import type { BriefDimensions, ResolvedTokens } from "./types";

export const DIMENSION_DEFAULTS: BriefDimensions = {
  palette: "light_clean",
  accent: "electric_blue",
  typography: "inter",
  display: "same_as_body",
  layout: "single_column",
  mood: "professional_minimal",
  density: "balanced",
  exclude: [],
};

const PALETTE_TOKENS: Record<string, { background: string; surface: string; text: string; textSecondary: string }> = {
  navy_and_white: { background: "#0F172A", surface: "#1E293B", text: "#F8FAFC", textSecondary: "#94A3B8" },
  monochrome_dark: { background: "#09090B", surface: "#18181B", text: "#FAFAFA", textSecondary: "#A1A1AA" },
  light_clean: { background: "#FFFFFF", surface: "#F8FAFC", text: "#0F172A", textSecondary: "#64748B" },
  earth_tones: { background: "#FFFBEB", surface: "#FEF3C7", text: "#451A03", textSecondary: "#92400E" },
};

const ACCENT_TOKENS: Record<string, { accent: string; accentHover: string }> = {
  coral: { accent: "#F97316", accentHover: "#EA580C" },
  electric_blue: { accent: "#3B82F6", accentHover: "#2563EB" },
  emerald: { accent: "#10B981", accentHover: "#059669" },
  muted_sage: { accent: "#84A98C", accentHover: "#6B8F73" },
  slate: { accent: "#64748B", accentHover: "#475569" },
};

const FONT_TOKENS: Record<string, { body: string; display: string }> = {
  inter: { body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif" },
  system_ui: { body: "system-ui, sans-serif", display: "system-ui, sans-serif" },
  dm_sans: { body: "'DM Sans', system-ui, sans-serif", display: "'DM Sans', system-ui, sans-serif" },
  georgia: { body: "Georgia, serif", display: "Georgia, serif" },
  space_grotesk: { body: "Inter, system-ui, sans-serif", display: "'Space Grotesk', system-ui, sans-serif" },
  playfair: { body: "Inter, system-ui, sans-serif", display: "'Playfair Display', Georgia, serif" },
};

const DENSITY_TOKENS: Record<string, { section: string; padding: string }> = {
  compact: { section: "48px", padding: "16px 24px" },
  balanced: { section: "72px", padding: "24px 40px" },
  spacious: { section: "96px", padding: "24px 48px" },
};

const KEYWORD_MAP: { regex: RegExp; dim: keyof BriefDimensions; value: string }[] = [
  { regex: /sombre|dark mode|dark theme|dark/i, dim: "palette", value: "monochrome_dark" },
  { regex: /clair|blanc|light|white background/i, dim: "palette", value: "light_clean" },
  { regex: /marin|navy/i, dim: "palette", value: "navy_and_white" },
  { regex: /terre|earth|chaud|warm/i, dim: "palette", value: "earth_tones" },
  { regex: /minimal|clean|simple|sobre/i, dim: "mood", value: "professional_minimal" },
  { regex: /joueur|playful|fun|friendly|sympa/i, dim: "mood", value: "playful" },
  { regex: /brutaliste|brutalist|raw/i, dim: "mood", value: "brutalist" },
  { regex: /éditorial|editorial|magazine/i, dim: "mood", value: "editorial" },
  { regex: /aéré|spacious|espace|whitespace/i, dim: "density", value: "spacious" },
  { regex: /compact|dense|dense/i, dim: "density", value: "compact" },
  { regex: /serif|traditionnel/i, dim: "typography", value: "georgia" },
  { regex: /corail|coral/i, dim: "accent", value: "coral" },
  { regex: /émeraude|emerald|vert/i, dim: "accent", value: "emerald" },
  { regex: /bleu|blue/i, dim: "accent", value: "electric_blue" },
  { regex: /une colonne|single column|single page|one page/i, dim: "layout", value: "single_column" },
  { regex: /deux colonnes|two column|sidebar|latérale/i, dim: "layout", value: "two_column" },
  { regex: /sans animation|no animation|statique|static/i, dim: "exclude", value: "animations" },
  { regex: /sans dégradé|no gradient/i, dim: "exclude", value: "gradients" },
  { regex: /sans photos|no stock photos/i, dim: "exclude", value: "stock_photos" },
];

export function parseBrief(prompt: string): BriefDimensions {
  const dims: BriefDimensions = { ...DIMENSION_DEFAULTS, exclude: [] };
  for (const { regex, dim, value } of KEYWORD_MAP) {
    if (regex.test(prompt)) {
      if (dim === "exclude") {
        if (!dims.exclude.includes(value)) dims.exclude.push(value);
      } else {
        dims[dim] = value;
      }
    }
  }
  if (dims.mood === "editorial" && !/marin|navy|terre|earth|sombre|dark/i.test(prompt)) {
    dims.palette = "light_clean";
  }
  return dims;
}

export function resolveTokens(dims: BriefDimensions): ResolvedTokens {
  const palette = PALETTE_TOKENS[dims.palette] ?? PALETTE_TOKENS.light_clean;
  const accent = ACCENT_TOKENS[dims.accent] ?? ACCENT_TOKENS.electric_blue;
  const fonts = FONT_TOKENS[dims.typography] ?? FONT_TOKENS.inter;
  const display =
    dims.display === "playfair"
      ? FONT_TOKENS.playfair.display
      : dims.display === "space_grotesk"
        ? FONT_TOKENS.space_grotesk.display
        : dims.display === "same_as_body"
          ? fonts.body
          : fonts.display;
  const density = DENSITY_TOKENS[dims.density] ?? DENSITY_TOKENS.balanced;
  return {
    background: palette.background,
    surface: palette.surface,
    text: palette.text,
    textSecondary: palette.textSecondary,
    accent: accent.accent,
    accentHover: accent.accentHover,
    displayFont: display,
    bodyFont: fonts.body,
    sectionSpacing: density.section,
    contentPadding: density.padding,
  };
}

export function buildDesignMd(dims: BriefDimensions, tokens: ResolvedTokens): string {
  const excluded = dims.exclude.length > 0 ? dims.exclude.map((e) => `- Ne pas utiliser : ${e}`).join("\n") : "- Aucune contrainte d'exclusion.";
  return `# Design System

## Visual Theme & Atmosphere
- Mood: ${dims.mood}
- Feel: ${dims.mood === "professional_minimal" ? "Clean, confident, restrained" : dims.mood === "playful" ? "Warm, expressive, friendly" : dims.mood === "brutalist" ? "Bold, exposed, raw" : "Refined, editorial, curated"}

## Color Palette & Roles
- Background: ${tokens.background}
- Surface: ${tokens.surface}
- Text primary: ${tokens.text}
- Text secondary: ${tokens.textSecondary}
- Accent: ${tokens.accent}
- Accent hover: ${tokens.accentHover}

## Typography Rules
- Display: ${tokens.displayFont}, 700, clamp(2rem, 5vw, 3.5rem)
- Body: ${tokens.bodyFont}, 400, 1rem/1.6

## Layout Principles
- Layout model: ${dims.layout}
- Max width: 1200px
- Section spacing: ${tokens.sectionSpacing}
- Content padding: ${tokens.contentPadding}

## Constraints
${excluded}

## Responsive
- Breakpoints: 640px / 768px / 1024px / 1280px
- Mobile: single column
- Desktop: full layout, max-width constraint
`;
}
