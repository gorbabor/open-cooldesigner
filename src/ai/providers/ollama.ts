import type {
  AIChatResponse,
  AIMessage,
  AIProvider,
  AIRequestOptions,
} from "@/types";
import { AIHttpError, httpPostJson } from "../http";

const DEFAULT_BASE_URL = "http://localhost:11434/v1";

export class OllamaProvider implements AIProvider {
  readonly id = "ollama" as const;

  constructor(private baseUrl: string = DEFAULT_BASE_URL) {}

  async chat(
    messages: AIMessage[],
    options: AIRequestOptions,
  ): Promise<AIChatResponse> {
    const { status, body } = await httpPostJson({
      url: `${this.baseUrl}/chat/completions`,
      apiKey: options.apiKey,
      body: {
        model: options.model,
        messages,
        temperature: options.temperature ?? 0.7,
        stream: false,
      },
      signal: options.signal,
    });
    if (status !== 200) {
      throw new AIHttpError(`Ollama: statut ${status}`);
    }
    const data = body as {
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    return {
      content: data.choices?.[0]?.message?.content ?? "",
      usage: {
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
      },
    };
  }
}
