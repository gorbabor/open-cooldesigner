export function uid(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${rand}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function estimateCostUsd(
  provider: string,
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const rates = estimateRates(provider, model);
  return (
    (inputTokens / 1_000_000) * rates.inputPerMillion +
    (outputTokens / 1_000_000) * rates.outputPerMillion
  );
}

export function estimateRates(provider: string, model: string) {
  const m = model.toLowerCase();
  if (provider === "ollama" || provider === "openai-compatible") {
    return { inputPerMillion: 0, outputPerMillion: 0 };
  }
  if (provider === "openai") {
    if (m.includes("mini")) {
      return { inputPerMillion: 0.15, outputPerMillion: 0.6 };
    }
    return { inputPerMillion: 2.5, outputPerMillion: 10 };
  }
  if (provider === "anthropic") {
    if (m.includes("haiku")) {
      return { inputPerMillion: 0.8, outputPerMillion: 4 };
    }
    return { inputPerMillion: 3, outputPerMillion: 15 };
  }
  if (provider === "deepseek") {
    if (m.includes("reasoner")) {
      return { inputPerMillion: 0.55, outputPerMillion: 2.19 };
    }
    return { inputPerMillion: 0.27, outputPerMillion: 1.1 };
  }
  return { inputPerMillion: 1, outputPerMillion: 3 };
}

export function formatUsd(value: number): string {
  return `$${value.toFixed(4)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 3)}...`;
}
