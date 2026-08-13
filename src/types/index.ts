export type ProviderId =
  | "openai"
  | "anthropic"
  | "deepseek"
  | "openai-compatible"
  | "ollama";

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  baseUrl?: string;
  apiKeyEnvVar: string;
  models: string[];
  defaultModel: string;
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  openai: {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    apiKeyEnvVar: "OPENAI_API_KEY",
    models: ["gpt-4o", "gpt-4o-mini"],
    defaultModel: "gpt-4o",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    apiKeyEnvVar: "ANTHROPIC_API_KEY",
    models: ["claude-sonnet-4-5", "claude-haiku-4-5"],
    defaultModel: "claude-sonnet-4-5",
  },
  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com",
    apiKeyEnvVar: "DEEPSEEK_API_KEY",
    models: ["deepseek-chat", "deepseek-reasoner"],
    defaultModel: "deepseek-chat",
  },
  "openai-compatible": {
    id: "openai-compatible",
    label: "OpenAI-compatible",
    baseUrl: "http://localhost:1234/v1",
    apiKeyEnvVar: "OPENAI_COMPATIBLE_API_KEY",
    models: ["local-model"],
    defaultModel: "local-model",
  },
  ollama: {
    id: "ollama",
    label: "Ollama (local)",
    baseUrl: "http://localhost:11434/v1",
    apiKeyEnvVar: "OLLAMA_API_KEY",
    models: ["llama3.2", "qwen2.5"],
    defaultModel: "llama3.2",
  },
};

export const DEFAULT_PROVIDER: ProviderId = "ollama";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIRequestOptions {
  provider: ProviderId;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface ModelTestResult {
  ok: boolean;
  latencyMs: number;
  message: string;
  testedAt: string;
}

export interface ModelDiscoveryResult {
  ok: boolean;
  models: string[];
  message: string;
}

export interface TestConnectionOptions {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface AIResponse {
  content: string;
  usage: AIUsage;
}

export interface AIChatResponse {
  content: string;
  usage: AIUsage;
}

export interface AIProvider {
  readonly id: ProviderId;
  chat(
    messages: AIMessage[],
    options: AIRequestOptions,
  ): Promise<AIChatResponse>;
}

export interface ArtifactFile {
  path: string;
  content: string;
}

export interface Artifact {
  id: string;
  projectId: string;
  title: string;
  kind: string;
  files: ArtifactFile[];
  createdAt: string;
  updatedAt: string;
}

export interface DesignSystem {
  id: string;
  name: string;
  description: string;
  designMd: string;
  tokensCss: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  designSystemId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  artifact: Artifact;
  label: string;
  createdAt: string;
}

export interface GenerationOptions {
  provider: ProviderId;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
}

export interface GenerationResult {
  artifact: Artifact;
  usage: AIUsage;
  cost: number;
}

export interface CostEstimate {
  provider: ProviderId;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedUsd: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  defaultSystemPrompt: string;
  skillTemplateId?: string;
}
