import type { CostEstimate, ProviderId } from "@/types";
import { PROVIDERS } from "@/types";
import { estimateCostUsd, formatUsd } from "@/lib/utils";

export function estimateGenerationCost(
  provider: ProviderId,
  model: string,
  inputTokens: number,
  outputTokens: number,
): CostEstimate {
  return {
    provider,
    model,
    inputTokens,
    outputTokens,
    estimatedUsd: estimateCostUsd(provider, model, inputTokens, outputTokens),
  };
}

export function summarizeCosts(
  entries: { provider: string; model: string; inputTokens: number; outputTokens: number; cost: number }[],
): { totalUsd: number; totalInputTokens: number; totalOutputTokens: number; count: number } {
  return entries.reduce(
    (acc, e) => ({
      totalUsd: acc.totalUsd + e.cost,
      totalInputTokens: acc.totalInputTokens + e.inputTokens,
      totalOutputTokens: acc.totalOutputTokens + e.outputTokens,
      count: acc.count + 1,
    }),
    { totalUsd: 0, totalInputTokens: 0, totalOutputTokens: 0, count: 0 },
  );
}

export function isLocalProvider(provider: ProviderId): boolean {
  return provider === "ollama" || provider === "openai-compatible";
}

export function requiresApiKey(provider: ProviderId): boolean {
  return provider !== "ollama";
}

export function apiKeyOptional(provider: ProviderId): boolean {
  return provider === "openai-compatible";
}

export const DEFAULT_ESTIMATED_OUTPUT_TOKENS = 1024;

export function estimatePendingCostUsd(
  provider: string,
  model: string,
  promptText: string,
  estimatedOutputTokens = DEFAULT_ESTIMATED_OUTPUT_TOKENS,
): number {
  const inputTokens = Math.max(1, Math.ceil(promptText.length / 4));
  return estimateCostUsd(provider, model, inputTokens, estimatedOutputTokens);
}

export function providerLabel(provider: string): string {
  return PROVIDERS[provider as ProviderId]?.label ?? provider;
}

export { formatUsd };
