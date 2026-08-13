import { describe, expect, it } from "vitest";
import {
  clamp,
  estimateCostUsd,
  estimateRates,
  formatUsd,
  truncate,
  uid,
} from "./utils";

describe("estimateCostUsd", () => {
  it("calcule le coût OpenAI", () => {
    const cost = estimateCostUsd("openai", "gpt-4o", 1_000_000, 100_000);
    expect(cost).toBeCloseTo(3.5, 5);
  });
  it("calcule le coût Anthropic", () => {
    const cost = estimateCostUsd("anthropic", "claude-sonnet-4-5", 1_000_000, 100_000);
    expect(cost).toBeCloseTo(4.5, 5);
  });
  it("les providers locaux coûtent 0", () => {
    expect(estimateCostUsd("ollama", "llama3.2", 999_999, 999_999)).toBe(0);
    expect(
      estimateCostUsd("openai-compatible", "local", 999_999, 999_999),
    ).toBe(0);
  });
  it("utilise le modèle mini à prix réduit", () => {
    expect(estimateRates("openai", "gpt-4o-mini").inputPerMillion).toBe(0.15);
  });
});

describe("formatUsd", () => {
  it("formate 4 décimales", () => {
    expect(formatUsd(1.4)).toBe("$1.4000");
  });
});

describe("uid", () => {
  it("génère des identifiants préfixés et uniques", () => {
    const a = uid("proj");
    const b = uid("proj");
    expect(a).toMatch(/^proj-/);
    expect(a).not.toBe(b);
  });
});

describe("clamp / truncate", () => {
  it("borne les valeurs", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-2, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
  it("tronque avec ellipse sans dépasser la taille max", () => {
    expect(truncate("bonjour", 5)).toBe("bo...");
    expect(truncate("bonjour", 6)).toBe("bon...");
    expect(truncate("bon", 5)).toBe("bon");
  });
});
