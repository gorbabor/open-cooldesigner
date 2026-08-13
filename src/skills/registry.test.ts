import { describe, expect, it } from "vitest";
import { SKILLS, TEMPLATES, getSkill, getTemplate, suggestTemplate } from "./registry";
import { parseCritiqueReport } from "./critique";

describe("registry skills", () => {
  it("expose les 5 skills avec manifest complet", () => {
    expect(SKILLS).toHaveLength(5);
    const ids = SKILLS.map((s) => s.manifest.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "design-brief",
        "design-critic",
        "design-refine",
        "tweaks",
        "template-guide",
      ]),
    );
    for (const s of SKILLS) {
      expect(s.manifest.version).toBeTruthy();
      expect(s.skillMd.length).toBeGreaterThan(50);
      expect(s.manifest.license).toContain("Apache-2.0");
    }
  });

  it("getSkill retrouve un skill", () => {
    expect(getSkill("design-brief")?.manifest.name).toBe("Design Brief");
    expect(getSkill("inconnu")).toBeUndefined();
  });
});

describe("registry templates", () => {
  it("expose au moins 30 templates avec SKILL.md et example.html", () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(30);
    for (const t of TEMPLATES) {
      expect(t.skillMd.length).toBeGreaterThan(30);
      expect(t.exampleHtml).toBeTruthy();
      expect(t.exampleHtml).toContain("<!doctype html>");
      expect(t.manifest.triggers.length).toBeGreaterThan(0);
    }
  });

  it("inclut les nouveaux templates (auth, chat-ui, ecommerce, quiz, 404, presentation…)", () => {
    const ids = TEMPLATES.map((t) => t.manifest.id);
    for (const id of [
      "auth",
      "chat-ui",
      "ecommerce",
      "portfolio",
      "profile",
      "event",
      "quiz",
      "travel",
      "restaurant",
      "404",
      "newsletter",
      "presentation",
    ]) {
      expect(ids).toContain(id);
    }
  });

  it("inclut les templates de types avancés (clone-site, ui-mockup, wireframe, documents, dynamic)", () => {
    const ids = TEMPLATES.map((t) => t.manifest.id);
    for (const id of [
      "clone-site",
      "ui-mockup",
      "wireframe",
      "documents",
      "dynamic",
    ]) {
      expect(ids).toContain(id);
    }
  });

  it("getTemplate retrouve un template", () => {
    expect(getTemplate("dashboard")?.manifest.name).toBe("Tableau de bord");
    expect(getTemplate("nope")).toBeUndefined();
  });

  it("suggère un template par mots-clés du prompt", () => {
    expect(suggestTemplate("Crée un dashboard de suivi commercial")?.manifest.id).toBe(
      "dashboard",
    );
    expect(suggestTemplate("une landing page pour mon SaaS")?.manifest.id).toBe(
      "saas-landing",
    );
    expect(suggestTemplate("rapport financier trimestriel")?.manifest.id).toBe(
      "financial-report",
    );
    expect(suggestTemplate("notes de réunion du sprint")?.manifest.id).toBe(
      "meeting-notes",
    );
  });

  it("retourne null si aucun mot-clé ne matche", () => {
    expect(suggestTemplate("dessine un éléphant")).toBeNull();
  });
});

describe("parseCritiqueReport", () => {
  const sample = `SCORES:
- Philosophie: 7/10
- Hiérarchie visuelle: 8/10
- Détails & finitions: 6/10
- Fonctionnalité: 9/10
- Innovation: 5/10

CONSERVER:
- Palette cohérente
- Bonne hiérarchie

CORRIGER:
- Contraste insuffisant
- Espacement inégal

GAINS RAPIDES:
- Ajouter des états de survol
- Réduire la taille du titre`;

  it("parse les scores sur 10", () => {
    const r = parseCritiqueReport(sample);
    expect(r.scores.philosophy).toBe(7);
    expect(r.scores.hierarchy).toBe(8);
    expect(r.scores.details).toBe(6);
    expect(r.scores.functionality).toBe(9);
    expect(r.scores.innovation).toBe(5);
  });

  it("parse les trois listes", () => {
    const r = parseCritiqueReport(sample);
    expect(r.keep).toContain("Palette cohérente");
    expect(r.fix).toContain("Contraste insuffisant");
    expect(r.quickWins).toContain("Ajouter des états de survol");
  });

  it("gère une réponse sans structure (fallback vide)", () => {
    const r = parseCritiqueReport("pas de format");
    expect(r.scores.philosophy).toBe(0);
    expect(r.keep).toEqual([]);
    expect(r.fix).toEqual([]);
  });

  it("borne les scores à 10", () => {
    const r = parseCritiqueReport("SCORES:\n- Philosophie: 15/10");
    expect(r.scores.philosophy).toBe(10);
  });
});
