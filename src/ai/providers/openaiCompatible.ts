import type {
  AIChatResponse,
  AIMessage,
  AIProvider,
  AIRequestOptions,
} from "@/types";
import { AIHttpError, httpPostJson } from "../http";

export class OpenAICompatibleProvider implements AIProvider {
  readonly id = "openai-compatible" as const;

  constructor(private baseUrl: string = "http://localhost:1234/v1") {}

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
        max_tokens: options.maxTokens,
        stream: false,
      },
      signal: options.signal,
    });
    if (status !== 200) {
      throw new AIHttpError(`OpenAI-compatible: statut ${status}`);
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
