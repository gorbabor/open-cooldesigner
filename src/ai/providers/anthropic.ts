import type {
  AIChatResponse,
  AIMessage,
  AIProvider,
  AIRequestOptions,
} from "@/types";
import { AIHttpError, httpPostJson } from "../http";

const DEFAULT_BASE_URL = "https://api.anthropic.com/v1";
const DEFAULT_VERSION = "2023-06-01";

export class AnthropicProvider implements AIProvider {
  readonly id = "anthropic" as const;

  constructor(
    private baseUrl: string = DEFAULT_BASE_URL,
    private apiVersion: string = DEFAULT_VERSION,
  ) {}

  async chat(
    messages: AIMessage[],
    options: AIRequestOptions,
  ): Promise<AIChatResponse> {
    const system = messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));

    const { status, body } = await httpPostJson({
      url: `${this.baseUrl}/messages`,
      apiKey: options.apiKey,
      headers: {
        "anthropic-version": this.apiVersion,
      },
      body: {
        model: options.model,
        max_tokens: options.maxTokens ?? 4096,
        system: system || undefined,
        messages: userMessages,
        temperature: options.temperature ?? 0.7,
        stream: false,
      },
      signal: options.signal,
    });
    if (status !== 200) {
      throw new AIHttpError(`Anthropic: statut ${status}`);
    }
    const data = body as {
      content?: { type?: string; text?: string }[];
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    const content = (data.content ?? [])
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");
    return {
      content,
      usage: {
        inputTokens: data.usage?.input_tokens ?? 0,
        outputTokens: data.usage?.output_tokens ?? 0,
      },
    };
  }
}
