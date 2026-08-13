import { describe, expect, it } from "vitest";
import {
  buildDesignSystemPreviewHtml,
  buildDesignSystemThumbnailHtml,
  extractFont,
  extractHexes,
  extractPx,
  isDark,
  parseDesignSystem,
  parseFrontmatter,
} from "./parser";

const FULL_FORMAT = `---
name: OpenAI
category: IA & LLM
description: Système calme quasi-monochrome.
---

# Design System — OpenAI

## 2. Color Palette & Roles
- **Canvas** (\`#0d0d0d\`): Fond principal.
- **Surface** (\`#1a1a1a\`): Cartes.
- **Text primary** (\`#f4f4f4\`): Texte.
- **Text secondary** (\`#a3a3a3\`): Légendes.
- **Accent** (\`#10a37f\`): Actions.
- **Accent hover** (\`#0e8f6f\`): Survol.

## 3. Typography Rules
- **Display**: Inter, system-ui, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Inter, system-ui, sans-serif, 400, 1rem/1.6

## 4. Layout Principles
- Section spacing: 72px
- Content padding: 24px 40px
- Border radius: 8px
`;

const NO_FRONTMATTER = `# Design System — Legacy

## Couleurs
- Primaire: #1e3a8a
- Background: #f8fafc
- Texte: #0f172a

## Typographie
- Famille: Inter, system-ui
`;

const FRENCH_ORDER = `---
name: Kami
category: Éditorial
description: Système papier.
---

# Kami

## Couleurs
- **Canvas** (\`#f5f4ed\`)
- **Surface** (\`#efece2\`)
- **Texte** (\`#1b365d\`)
- **Accent** (\`#1b365d\`)

## Espacements
- Section spacing: 96px
- Border radius: 0px

## Typo
- **Display**: Georgia, serif, 700
- **Body**: Georgia, serif, 400
`;

describe("parseDesignSystem — format complet (style généré)", () => {
  it("extrait frontmatter, hex, fonts, espacements", () => {
    const ds = parseDesignSystem("openai", FULL_FORMAT);
    expect(ds.name).toBe("OpenAI");
    expect(ds.category).toBe("IA & LLM");
    expect(ds.tokens.background).toBe("#0d0d0d");
    expect(ds.tokens.accent).toBe("#10a37f");
    expect(ds.tokens.bodyFont).toBe("Inter, system-ui, sans-serif");
    expect(ds.tokens.sectionSpacing).toBe("72px");
    expect(ds.tokens.radius).toBe("8px");
    expect(ds.tokensCss).toContain("--color-accent: #10a37f");
    expect(ds.designMd).toContain("# Design System");
  });
});

describe("parseDesignSystem — format sans frontmatter (legacy)", () => {
  it("retombe sur id et catégorie par défaut, hex sans backticks ignorés", () => {
    const ds = parseDesignSystem("legacy", NO_FRONTMATTER);
    expect(ds.name).toBe("legacy");
    expect(ds.category).toBe("Général");
    expect(ds.tokensCss).toContain("--font-body");
  });
});

describe("parseDesignSystem — format français avec ordre différent", () => {
  it("extrait malgré sections réordonnées", () => {
    const ds = parseDesignSystem("kami", FRENCH_ORDER);
    expect(ds.category).toBe("Éditorial");
    expect(ds.tokens.surface).toBe("#efece2");
    expect(ds.tokens.sectionSpacing).toBe("96px");
    expect(ds.tokens.displayFont).toBe("Georgia, serif");
    expect(ds.tokens.radius).toBe("0px");
  });
});

describe("helpers", () => {
  it("parseFrontmatter ignore les lignes sans clé", () => {
    const fm = parseFrontmatter("---\nname: X\ncategory: Y\n---\n# Titre");
    expect(fm).toEqual({ name: "X", category: "Y" });
    expect(parseFrontmatter("pas de frontmatter")).toEqual({});
  });

  it("extractHexes ne prend que les backticks", () => {
    expect(extractHexes("`#0d0d0d` et #ffffff et `#1a1a1a`")).toEqual([
      "#0d0d0d",
      "#1a1a1a",
    ]);
  });

  it("extractFont gère Display/Body", () => {
    expect(extractFont("**Display**: Georgia, serif, 700", "Display")).toBe(
      "Georgia, serif",
    );
    expect(extractFont("Body: Inter, sans-serif, 400", "Body")).toBe(
      "Inter, sans-serif",
    );
  });

  it("extractPx gère simple et double valeur", () => {
    expect(extractPx("Section spacing: 96px", "Section spacing")).toBe("96px");
    expect(extractPx("Content padding: 24px 48px", "Content padding")).toBe(
      "24px 48px",
    );
    expect(extractPx("rien", "Section spacing")).toBeNull();
  });

  it("isDark détecte les couleurs sombres", () => {
    expect(isDark("#000000")).toBe(true);
    expect(isDark("#ffffff")).toBe(false);
    expect(isDark("#0d0d0d")).toBe(true);
    expect(isDark("#f4f4f4")).toBe(false);
    expect(isDark("#f00")).toBe(true);
    expect(isDark("#fff1f2")).toBe(false);
  });

  it("buildDesignSystemPreviewHtml produit une page avec palette et bouton", () => {
    const ds = parseDesignSystem("openai", FULL_FORMAT);
    const html = buildDesignSystemPreviewHtml(ds);
    expect(html).toContain("#0d0d0d");
    expect(html).toContain("Bouton principal");
    expect(html).toContain("<body>");
  });

  it("buildDesignSystemPreviewHtml contient toutes les sections de la démo complète", () => {
    const ds = parseDesignSystem("openai", FULL_FORMAT);
    const html = buildDesignSystemPreviewHtml(ds);
    expect(html).toContain('<header class="nav">');
    expect(html).toContain("Menu déroulant");
    expect(html).toContain('class="hero"');
    expect(html).toContain("Typographie");
    expect(html).toContain("Composants");
    expect(html).toContain("<table>");
    expect(html).toContain("Tableau & alertes");
    expect(html).toContain("Succès");
    expect(html).toContain("Erreur");
    expect(html).toContain("<footer");
    expect(html).toContain("type=\"email\"");
    expect(html).toContain("<select");
    expect(html).toContain("Badge accent");
  });

  it("buildDesignSystemPreviewHtml injecte les tokens (fonts, radius, accent)", () => {
    const ds = parseDesignSystem("openai", FULL_FORMAT);
    const html = buildDesignSystemPreviewHtml(ds);
    expect(html).toContain("--font-body:Inter, system-ui, sans-serif");
    expect(html).toContain("--font-display:Inter, system-ui, sans-serif");
    expect(html).toContain("--radius:8px");
    expect(html).toContain("--accent:#10a37f");
    expect(html).toContain("--spacing:72px");
  });

  it("buildDesignSystemThumbnailHtml produit une vignette compacte avec les couleurs", () => {
    const ds = parseDesignSystem("openai", FULL_FORMAT);
    const html = buildDesignSystemThumbnailHtml(ds);
    expect(html).toContain("background:#0d0d0d");
    expect(html).toContain("background:#10a37f");
    expect(html).toContain(ds.name);
    expect(html).toContain("<body>");
  });
});
