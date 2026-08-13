import { describe, expect, it } from "vitest";
import {
  DESIGN_SYSTEMS,
  getDesignSystem,
  listDesignSystemCategories,
  searchDesignSystems,
} from "./registry";

describe("registry dynamique (import.meta.glob)", () => {
  it("charge au moins 30 design systems réels depuis design-systems/", () => {
    expect(DESIGN_SYSTEMS.length).toBeGreaterThanOrEqual(30);
  });

  it("les ids sont uniques", () => {
    const ids = DESIGN_SYSTEMS.map((ds) => ds.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("conserve les 6 systèmes existants", () => {
    const ids = DESIGN_SYSTEMS.map((ds) => ds.id);
    for (const legacy of ["corporate", "fintech", "luxury", "minimal", "saas", "ecommerce"]) {
      expect(ids).toContain(legacy);
    }
  });

  it("chaque système a designMd, tokensCss, category et tokens complets", () => {
    for (const ds of DESIGN_SYSTEMS) {
      expect(ds.designMd.length).toBeGreaterThan(200);
      expect(ds.tokensCss).toContain("--color-accent");
      expect(ds.category).toBeTruthy();
      expect(ds.tokens.accent).toMatch(/^#[0-9a-f]{6}$/);
      expect(ds.tokens.background).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("couvre les catégories du plan (IA & LLM, SaaS, Fintech, Enterprise, E-commerce, Éditorial, Minimal, Expressif)", () => {
    const cats = listDesignSystemCategories();
    for (const expected of [
      "IA & LLM",
      "SaaS & Productivité",
      "Fintech",
      "Enterprise",
      "E-commerce",
      "Éditorial",
      "Minimal",
      "Expressif",
    ]) {
      expect(cats).toContain(expected);
    }
  });

  it("getDesignSystem retrouve par id et retourne null sinon", () => {
    expect(getDesignSystem("linear")?.name).toBe("Linear");
    expect(getDesignSystem("openai")?.category).toBe("IA & LLM");
    expect(getDesignSystem("inconnu")).toBeNull();
    expect(getDesignSystem(null)).toBeNull();
  });

  it("searchDesignSystems filtre par nom, catégorie et description", () => {
    expect(searchDesignSystems("linear")[0]?.id).toBe("linear");
    expect(searchDesignSystems("fintech").every((d) => d.category === "Fintech" || d.description.toLowerCase().includes("fintech") || d.name.toLowerCase().includes("fintech"))).toBe(true);
    expect(searchDesignSystems("crypto").length).toBeGreaterThan(0);
    expect(searchDesignSystems("").length).toBe(DESIGN_SYSTEMS.length);
    expect(searchDesignSystems("zzz-inexistant")).toEqual([]);
  });
});
