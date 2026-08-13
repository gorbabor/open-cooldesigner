import type {
  AIChatResponse,
  AIMessage,
  AIProvider,
  AIRequestOptions,
  ModelDiscoveryResult,
  ModelTestResult,
  ProviderId,
  TestConnectionOptions,
} from "@/types";
import { PROVIDERS } from "@/types";
import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { DeepSeekProvider } from "./providers/deepseek";
import { OpenAICompatibleProvider } from "./providers/openaiCompatible";
import { OllamaProvider } from "./providers/ollama";
import { streamChatCompletion } from "./streaming";
import { AIHttpError } from "./http";

export class AIProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIProviderError";
  }
}

export class AIGateway {
  private providers: Record<ProviderId, AIProvider>;

  constructor(customBaseUrls?: Partial<Record<ProviderId, string>>) {
    this.providers = {
      openai: new OpenAIProvider(customBaseUrls?.openai),
      anthropic: new AnthropicProvider(customBaseUrls?.anthropic),
      deepseek: new DeepSeekProvider(customBaseUrls?.deepseek),
      "openai-compatible": new OpenAICompatibleProvider(
        customBaseUrls?.["openai-compatible"],
      ),
      ollama: new OllamaProvider(customBaseUrls?.ollama),
    };
  }

  getProvider(id: ProviderId): AIProvider {
    const provider = this.providers[id];
    if (!provider) {
      throw new AIProviderError(`Fournisseur IA inconnu: ${id}`);
    }
    return provider;
  }

  listProviders() {
    return Object.values(PROVIDERS);
  }

  async chat(
    providerId: ProviderId,
    messages: AIMessage[],
    options: Omit<AIRequestOptions, "provider"> = {},
  ): Promise<AIChatResponse> {
    const provider = this.getProvider(providerId);
    if (!options.apiKey) {
      options.apiKey = this.resolveApiKeySafe(providerId);
    }
    const model =
      options.model ?? PROVIDERS[providerId].defaultModel;
    return provider.chat(messages, { ...options, provider: providerId, model });
  }

  async stream(
    providerId: ProviderId,
    messages: AIMessage[],
    options: Omit<AIRequestOptions, "provider"> = {},
  ): Promise<AsyncIterable<string>> {
    const provider = this.getProvider(providerId);
    const baseUrl =
      options.baseUrl ?? PROVIDERS[providerId].baseUrl ?? "";
    return streamChatCompletion(provider, baseUrl, messages, {
      ...options,
      provider: providerId,
    });
  }

  resolveApiKey(providerId: ProviderId): string {
    const envVar = PROVIDERS[providerId].apiKeyEnvVar;
    const key = typeof process !== "undefined" ? process.env[envVar] : undefined;
    if (!key) {
      throw new AIProviderError(
        `Clé API manquante: définissez la variable d'environnement ${envVar} (ou passez apiKey).`,
      );
    }
    return key;
  }

  resolveApiKeySafe(providerId: ProviderId): string | undefined {
    const isLocal =
      providerId === "ollama" || providerId === "openai-compatible";
    if (isLocal) return undefined;
    return this.resolveApiKey(providerId);
  }

  isLocalProvider(providerId: ProviderId): boolean {
    return providerId === "ollama" || providerId === "openai-compatible";
  }

  private resolveBaseUrl(providerId: ProviderId, explicit?: string): string {
    return (
      explicit?.trim() || PROVIDERS[providerId].baseUrl || ""
    );
  }

  /**
   * Teste la connexion à un modèle:
   * - providers cloud (OpenAI/Anthropic): mini-chat max_tokens=1
   * - providers locaux (Ollama/OpenAI-compatible): GET de la liste des modèles
   * Erreurs traduites: 401 = clé invalide, 404 = modèle inconnu, réseau = injoignable.
   */
  async testModelConnection(
    providerId: ProviderId,
    model: string,
    options: TestConnectionOptions = {},
  ): Promise<ModelTestResult> {
    const baseUrl = this.resolveBaseUrl(providerId, options.baseUrl);
    const startedAt = Date.now();
    const latency = () => Date.now() - startedAt;
    const fail = (message: string): ModelTestResult => ({
      ok: false,
      latencyMs: latency(),
      message,
      testedAt: new Date().toISOString(),
    });

    try {
      if (this.isLocalProvider(providerId)) {
        const list = await this.fetchRemoteModels(providerId, options);
        if (!list.ok) return fail(list.message);
        if (model && !list.models.some((m) => m === model || m.startsWith(`${model}:`))) {
          return fail(
            `Le modèle « ${model} » n'est pas installé sur le serveur local. Disponibles: ${list.models.join(", ") || "aucun"}.`,
          );
        }
        return {
          ok: true,
          latencyMs: latency(),
          message: `Serveur accessible (${list.models.length} modèle(s) local(aux))`,
          testedAt: new Date().toISOString(),
        };
      }

      const apiKey = options.apiKey ?? this.resolveApiKeySafe(providerId);
      if (!apiKey) {
        return fail(
          `Clé API manquante: définissez la variable d'environnement ${PROVIDERS[providerId].apiKeyEnvVar} (ou saisissez-la dans les paramètres).`,
        );
      }
      const response = await this.chat(
        providerId,
        [{ role: "user", content: "Ping" }],
        {
          model,
          apiKey,
          baseUrl,
          maxTokens: 1,
          temperature: 0,
        },
      );
      void response;
      return {
        ok: true,
        latencyMs: latency(),
        message: "Connexion OK, modèle répond.",
        testedAt: new Date().toISOString(),
      };
    } catch (err) {
      if (err instanceof AIHttpError) {
        if (err.status === 401 || err.status === 403) {
          return fail(`Clé API invalide ou refusée (HTTP ${err.status}).`);
        }
        if (err.status === 404) {
          return fail(
            `Modèle « ${model} » introuvable (HTTP 404): vérifiez le nom du modèle.`,
          );
        }
        return fail(`Erreur HTTP ${err.status}: ${err.message}`);
      }
      return fail(`Serveur injoignable: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Liste les modèles disponibles sur un serveur local.
   * - Ollama: GET {baseUrl sans /v1}/api/tags
   * - OpenAI-compatible: GET {baseUrl}/models
   */
  async fetchRemoteModels(
    providerId: ProviderId,
    options: TestConnectionOptions = {},
  ): Promise<ModelDiscoveryResult> {
    const baseUrl = this.resolveBaseUrl(providerId, options.baseUrl);
    if (!baseUrl) {
      return { ok: false, models: [], message: "URL de base manquante." };
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        options.timeoutMs ?? 8_000,
      );
      try {
        let url: string;
        if (providerId === "ollama") {
          url = `${baseUrl.replace(/\/v1\/?$/, "")}/api/tags`;
        } else {
          url = `${baseUrl.replace(/\/+$/, "")}/models`;
        }        const res = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: options.apiKey
            ? { Authorization: `Bearer ${options.apiKey}` }
            : undefined,
        });
        if (!res.ok) {
          return {
            ok: false,
            models: [],
            message: `Liste des modèles refusée (HTTP ${res.status}).`,
          };
        }
        const data = (await res.json()) as {
          models?: { name?: string; model?: string }[];
          data?: { id?: string }[];
        };
        let models: string[] = [];
        if (Array.isArray(data.models)) {
          models = data.models
            .map((m) => m.name ?? m.model ?? "")
            .filter(Boolean)
            .map((n) => n.replace(/:latest$/, ""));
        } else if (Array.isArray(data.data)) {
          models = data.data.map((m) => m.id ?? "").filter(Boolean);
        }
        return {
          ok: true,
          models: [...new Set(models)],
          message: `${models.length} modèle(s) trouvé(s) sur le serveur.`,
        };
      } finally {
        clearTimeout(timeout);
      }
    } catch (err) {
      return {
        ok: false,
        models: [],
        message: `Serveur injoignable: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }
}
