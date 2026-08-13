import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AIGateway, AIProviderError } from "./gateway";

function mockFetchOnce(
  body: unknown,
  status = 200,
  raw?: string,
): ReturnType<typeof vi.fn> {
  const fn = vi.fn().mockResolvedValue(
    new Response(raw ?? JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("AIGateway", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("expose les 4 providers requis par le CDC", () => {
    const gateway = new AIGateway();
    const ids = gateway.listProviders().map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "openai",
        "anthropic",
        "openai-compatible",
        "ollama",
      ]),
    );
  });

  it("appelle DeepSeek avec le bon contrat (chat/completions)", async () => {
    const fetchMock = mockFetchOnce({
      choices: [{ message: { content: "Réponse DS" } }],
      usage: { prompt_tokens: 7, completion_tokens: 3 },
    });
    const gateway = new AIGateway();
    const res = await gateway.chat(
      "deepseek",
      [{ role: "user", content: "hi" }],
      { apiKey: "sk-ds", model: "deepseek-chat" },
    );
    expect(res.content).toBe("Réponse DS");
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.deepseek.com/chat/completions");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer sk-ds");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("deepseek-chat");
  });

  it("envoie la clé en Authorization même pour OpenAI-compatible si fournie", async () => {
    const fetchMock = mockFetchOnce({
      choices: [{ message: { content: "ok" } }],
    });
    const gateway = new AIGateway();
    await gateway.chat(
      "openai-compatible",
      [{ role: "user", content: "x" }],
      { apiKey: "sk-local", model: "m" },
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer sk-local");
  });

  it("liste les modèles OpenAI via /models avec la clé", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ data: [{ id: "gpt-4o" }, { id: "gpt-4o-mini" }] }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const gateway = new AIGateway();
    const result = await gateway.fetchRemoteModels("openai", {
      apiKey: "sk-test",
    });
    expect(result.ok).toBe(true);
    expect(result.models).toEqual(["gpt-4o", "gpt-4o-mini"]);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/models");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer sk-test");
  });

  it("appelle OpenAI avec le bon contrat", async () => {
    const fetchMock = mockFetchOnce({
      choices: [{ message: { content: "Bonjour" } }],
      usage: { prompt_tokens: 10, completion_tokens: 5 },
    });
    const gateway = new AIGateway();
    const res = await gateway.chat(
      "openai",
      [{ role: "user", content: "salut" }],
      { apiKey: "sk-test", model: "gpt-4o-mini" },
    );
    expect(res.content).toBe("Bonjour");
    expect(res.usage.inputTokens).toBe(10);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect(init.headers).toMatchObject({ Authorization: "Bearer sk-test" });
  });

  it("appelle Anthropic avec headers et body spécifiques", async () => {
    const fetchMock = mockFetchOnce({
      content: [{ type: "text", text: "Réponse Claude" }],
      usage: { input_tokens: 4, output_tokens: 8 },
    });
    const gateway = new AIGateway();
    const res = await gateway.chat(
      "anthropic",
      [{ role: "system", content: "sois bref" }, { role: "user", content: "hi" }],
      { apiKey: "sk-ant", model: "claude-haiku-4-5" },
    );
    expect(res.content).toBe("Réponse Claude");
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    const headers = init.headers as Record<string, string>;
    expect(headers["anthropic-version"]).toBe("2023-06-01");
    const body = JSON.parse(init.body as string);
    expect(body.system).toBe("sois bref");
    expect(body.messages).toEqual([{ role: "user", content: "hi" }]);
  });

  it("utilise Ollama en local sans clé", async () => {
    const fetchMock = mockFetchOnce({
      choices: [{ message: { content: "local!" } }],
      usage: { prompt_tokens: 3, completion_tokens: 2 },
    });
    const gateway = new AIGateway();
    const res = await gateway.chat("ollama", [{ role: "user", content: "x" }], {
      model: "llama3.2",
    });
    expect(res.content).toBe("local!");
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain("localhost:11434");
  });

  it("respecte les URLs personnalisées", async () => {
    const fetchMock = mockFetchOnce({
      choices: [{ message: { content: "ok" } }],
    });
    const gateway = new AIGateway({ ollama: "http://10.0.0.5:8080/v1" });
    await gateway.chat("ollama", [{ role: "user", content: "x" }], {
      model: "m",
    });
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe("http://10.0.0.5:8080/v1/chat/completions");
  });

  it("lève une erreur explicite si la clé est absente pour un provider cloud", async () => {
    const gateway = new AIGateway();
    await expect(
      gateway.chat("openai", [{ role: "user", content: "x" }]),
    ).rejects.toThrow(AIProviderError);
  });

  it("propage les erreurs HTTP avec statut", async () => {
    mockFetchOnce({ error: "boom" }, 401);
    const gateway = new AIGateway();
    await expect(
      gateway.chat("openai", [{ role: "user", content: "x" }], {
        apiKey: "sk-x",
      }),
    ).rejects.toThrow(/401/);
  });

  it("stream produit des fragments puis s'arrête sur [DONE]", async () => {
    const sse = [
      'data: {"choices":[{"delta":{"content":"Bon"}}]}',
      'data: {"choices":[{"delta":{"content":"jour"}}]}',
      "data: [DONE]",
    ].join("\n");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(sse, {
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const gateway = new AIGateway();
    const chunks: string[] = [];
    for await (const c of await gateway.stream("openai", [{ role: "user", content: "x" }], {
      apiKey: "sk-x",
      model: "gpt-4o-mini",
    })) {
      chunks.push(c);
    }
    expect(chunks.join("")).toBe("Bonjour");
  });

  it("stream Anthropic lit content_block_delta", async () => {
    const sse = [
      'data: {"type":"content_block_delta","delta":{"text":"Salut"}}',
      'data: {"type":"message_stop"}',
    ].join("\n");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(sse, { status: 200 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const gateway = new AIGateway();
    const chunks: string[] = [];
    for await (const c of await gateway.stream("anthropic", [{ role: "user", content: "x" }], {
      apiKey: "sk-ant",
      model: "claude-haiku-4-5",
    })) {
      chunks.push(c);
    }
    expect(chunks.join("")).toBe("Salut");
  });
});

describe("AIGateway.testModelConnection", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("valide la connexion OpenAI avec un mini-chat", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: "pong" } }],
            usage: { prompt_tokens: 1, completion_tokens: 1 },
          }),
          { status: 200 },
        ),
      ),
    );
    const gateway = new AIGateway();
    const result = await gateway.testModelConnection("openai", "gpt-4o-mini", {
      apiKey: "sk-test",
    });
    expect(result.ok).toBe(true);
    expect(result.message).toContain("OK");
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it("traduit une clé invalide (401) en erreur explicite", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("unauthorized", { status: 401 })),
    );
    const gateway = new AIGateway();
    const result = await gateway.testModelConnection("openai", "gpt-4o-mini", {
      apiKey: "sk-wrong",
    });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/clé/i);
    expect(result.message).toMatch(/401/);
  });

  it("traduit un modèle inconnu (404) en erreur explicite", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("nope", { status: 404 })),
    );
    const gateway = new AIGateway();
    const result = await gateway.testModelConnection("openai", "model-fantome", {
      apiKey: "sk-test",
    });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/404/);
    expect(result.message).toMatch(/model-fantome/);
  });

  it("gère un serveur injoignable sans lever d'exception", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );
    const gateway = new AIGateway();
    const result = await gateway.testModelConnection("openai", "gpt-4o-mini", {
      apiKey: "sk-test",
    });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/injoignable/i);
  });

  it("clé manquante pour un provider cloud → erreur explicite", async () => {
    const gateway = new AIGateway();
    const result = await gateway.testModelConnection("anthropic", "claude-haiku-4-5");
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/ANTHROPIC_API_KEY/);
  });
});

describe("AIGateway.fetchRemoteModels", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("liste les modèles Ollama via /api/tags et retire :latest", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          models: [
            { name: "llama3.2:latest" },
            { name: "qwen2.5:7b" },
            { name: "llama3.2:1b" },
          ],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const gateway = new AIGateway();
    const result = await gateway.fetchRemoteModels("ollama");
    expect(result.ok).toBe(true);
    expect(result.models).toEqual(["llama3.2", "qwen2.5:7b", "llama3.2:1b"]);
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe("http://localhost:11434/api/tags");
  });

  it("liste les modèles OpenAI-compatible via /models", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ data: [{ id: "local-model" }, { id: "mistral-7b" }] }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const gateway = new AIGateway();
    const result = await gateway.fetchRemoteModels("openai-compatible", {
      baseUrl: "http://localhost:1234/v1",
    });
    expect(result.ok).toBe(true);
    expect(result.models).toEqual(["local-model", "mistral-7b"]);
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toBe("http://localhost:1234/v1/models");
  });

  it("serveur local injoignable → message explicite", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );
    const gateway = new AIGateway();
    const result = await gateway.fetchRemoteModels("ollama");
    expect(result.ok).toBe(false);
    expect(result.models).toEqual([]);
    expect(result.message).toMatch(/injoignable/i);
  });

  it("modèle local absent de la liste → test de connexion en échec", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ models: [{ name: "llama3.2:latest" }] }), {
          status: 200,
        }),
      ),
    );
    const gateway = new AIGateway();
    const result = await gateway.testModelConnection("ollama", "gemma2");
    expect(result.ok).toBe(false);
    expect(result.message).toContain("gemma2");
  });
});
