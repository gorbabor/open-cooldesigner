import type {
  AIMessage,
  AIProvider,
  AIRequestOptions,
  ProviderId,
} from "@/types";
import { AIHttpError, httpPostJson } from "./http";

export class AIStreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AIStreamError";
  }
}

export function isAnthropicLike(provider: AIProvider): boolean {
  return provider.id === "anthropic";
}

export async function streamChatCompletion(
  provider: AIProvider,
  baseUrl: string,
  messages: AIMessage[],
  options: AIRequestOptions,
): Promise<AsyncIterable<string>> {
  const id = provider.id as ProviderId;
  const body: Record<string, unknown> = {
    model: options.model,
    messages,
    temperature: options.temperature ?? 0.7,
    stream: true,
  };
  let url: string;
  let headers: Record<string, string> = {};
  let parseChunk: (raw: string) => string[];

  if (id === "anthropic") {
    const system = messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");
    url = `${baseUrl}/messages`;
    headers = { "anthropic-version": "2023-06-01" };
    body.system = system || undefined;
    body.max_tokens = options.maxTokens ?? 4096;
    delete body.messages;
    body.messages = messages.filter((m) => m.role !== "system");
    parseChunk = (raw: string) => {
      try {
        const data = JSON.parse(raw);
        if (data.type === "content_block_delta" && data.delta?.text) {
          return [data.delta.text];
        }
      } catch {
        /* ligne non-JSON ignorée */
      }
      return [];
    };
  } else {
    url = `${baseUrl}/chat/completions`;
    if (options.maxTokens) body.max_tokens = options.maxTokens;
    parseChunk = (raw: string) => {
      try {
        const data = JSON.parse(raw);
        return [data.choices?.[0]?.delta?.content ?? ""];
      } catch {
        return [];
      }
    };
  }

  const response = await httpPostJson({
    url,
    apiKey: options.apiKey,
    headers,
    body,
    signal: options.signal,
    timeoutMs: 600_000,
  });

  if (response.status !== 200) {
    throw new AIHttpError(`Streaming: statut ${response.status}`);
  }
  if (typeof response.raw !== "string") {
    throw new AIStreamError("Réponse streaming invalide");
  }

  return parseSSE(response.raw, parseChunk);
}

export async function* parseSSE(
  raw: string,
  parseChunk: (rawLine: string) => string[],
): AsyncIterable<string> {
  const lines = raw.split(/\r?\n/);
  let current = "";
  for (const line of lines) {
    if (line.startsWith("data:")) {
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      const chunks = parseChunk(payload);
      for (const c of chunks) {
        if (c) {
          current += c;
          yield c;
        }
      }
    }
  }
  if (current.length === 0) {
    throw new AIStreamError("Aucun contenu reçu du stream");
  }
}
