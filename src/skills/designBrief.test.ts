import { describe, expect, it } from "vitest";
import { buildDesignMd, parseBrief, resolveTokens } from "./designBrief";
import { DIMENSION_DEFAULTS } from "./designBrief";

describe("parseBrief", () => {
  it("résout un prompt vague en dimensions avec défauts", () => {
    const dims = parseBrief("une landing page");
    expect(dims.mood).toBe("professional_minimal");
    expect(dims.palette).toBe("light_clean");
    expect(dims.layout).toBe("single_column");
    expect(dims.density).toBe("balanced");
  });

  it("mappe « sombre, minimal » → monochrome_dark + professional_minimal", () => {
    const dims = parseBrief("landing page pro, sombre, minimal");
    expect(dims.palette).toBe("monochrome_dark");
    expect(dims.mood).toBe("professional_minimal");
  });

  it("mappe « aéré » → spacious et « éditorial » → mood editorial", () => {
    const dims = parseBrief("un rapport éditorial aéré");
    expect(dims.mood).toBe("editorial");
    expect(dims.density).toBe("spacious");
    expect(dims.palette).toBe("light_clean");
  });

  it("capture les exclusions « sans animation, sans dégradé »", () => {
    const dims = parseBrief("dashboard sans animation et sans dégradé");
    expect(dims.exclude).toContain("animations");
    expect(dims.exclude).toContain("gradients");
  });

  it("les défauts ne sont jamais mutés entre appels", () => {
    const a = parseBrief("sans animation");
    const b = parseBrief("une page");
    expect(a.exclude).toEqual(["animations"]);
    expect(b.exclude).toEqual([]);
    expect(DIMENSION_DEFAULTS.exclude).toEqual([]);
  });
});

describe("resolveTokens", () => {
  it("résout les tokens concrets d'une palette sombre", () => {
    const dims = parseBrief("page sombre");
    const tokens = resolveTokens(dims);
    expect(tokens.background).toBe("#09090B");
    expect(tokens.text).toBe("#FAFAFA");
  });

  it("résout l'accent corail", () => {
    const tokens = resolveTokens(parseBrief("accent corail"));
    expect(tokens.accent).toBe("#F97316");
  });

  it("résout la densité", () => {
    const compact = resolveTokens(parseBrief("interface dense"));
    expect(compact.sectionSpacing).toBe("48px");
    const spacious = resolveTokens(parseBrief("interface aérée"));
    expect(spacious.sectionSpacing).toBe("96px");
  });
});

describe("buildDesignMd", () => {
  it("génère un DESIGN.md complet avec les 8 dimensions", () => {
    const dims = parseBrief("dashboard sombre, minimal");
    const md = buildDesignMd(dims, resolveTokens(dims));
    expect(md).toContain("# Design System");
    expect(md).toContain("Mood: professional_minimal");
    expect(md).toContain("Background: #09090B");
    expect(md).toContain("Accent: #3B82F6");
    expect(md).toContain("Layout model: single_column");
    expect(md).toContain("Section spacing: 72px");
  });
});
