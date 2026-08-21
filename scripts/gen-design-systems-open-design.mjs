import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "design-systems");
const SOURCE = process.argv[2];

if (!SOURCE) {
  console.error(
    "Usage : node scripts/gen-design-systems-open-design.mjs <chemin/vers/open-design/design-systems>",
  );
  console.error(
    "Exemple : node scripts/gen-design-systems-open-design.mjs \"C:\\Users\\moi\\Downloads\\open-design-main\\design-systems\"",
  );
  process.exit(1);
}

const CATEGORY_MAP = {
  "productivity & saas": "SaaS & Productivité",
  saas: "SaaS & Productivité",
  "ai & llm": "IA & LLM",
  ai: "IA & LLM",
  fintech: "Fintech",
  finance: "Fintech",
  "fintech & crypto": "Fintech",
  crypto: "Fintech",
  "e-commerce": "E-commerce",
  ecommerce: "E-commerce",
  enterprise: "Enterprise",
  editorial: "Éditorial",
  minimal: "Minimal",
  expressive: "Expressif",
  creative: "Expressif",
  artistic: "Expressif",
  retro: "Retro",
  vintage: "Retro",
  gaming: "Gaming",
  social: "Social",
  "design tools": "Design Tools",
  design: "Design",
  media: "Média",
  news: "Média",
  travel: "Voyage",
  food: "Alimentation",
  education: "Éducation",
  health: "Santé",
  default: "Général",
  general: "Général",
  "developer tools": "Developer Tools",
  developer: "Developer Tools",
  mobile: "Mobile",
  "ecommerce & retail": "E-commerce",
};

function translateCategory(cat) {
  if (!cat) return "Général";
  return CATEGORY_MAP[cat.toLowerCase()] ?? cat;
}

function normalizeHex(value, fallback) {
  if (!value) return fallback;
  const m = /#([0-9a-f]{3,8})/i.exec(value);
  if (m) {
    let h = m[1].toLowerCase();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length === 4) h = h.split("").map((c) => c + c).join("");
    if (h.length >= 6) return "#" + h.slice(0, 6);
    return fallback;
  }
  const rgba = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(value);
  if (rgba) {
    const toHex = (n) => Math.max(0, Math.min(255, Number(n))).toString(16).padStart(2, "0");
    return "#" + toHex(rgba[1]) + toHex(rgba[2]) + toHex(rgba[3]);
  }
  return fallback;
}

function cssVar(css, name) {
  const re = new RegExp("--" + name + "\\s*:\\s*([^;]+);");
  const m = re.exec(css);
  return m ? m[1].trim() : null;
}

function densityFromSectionY(value) {
  const m = /(\d+)px/.exec(value ?? "");
  const px = m ? Number(m[1]) : 72;
  if (px >= 96) return "spacious";
  if (px <= 48) return "compact";
  return "balanced";
}

function extractDescription(dir, manifest) {
  const mdPath = join(dir, "DESIGN.md");
  if (existsSync(mdPath)) {
    const md = readFileSync(mdPath, "utf8");
    const lines = md.split(/\r?\n/);
    for (let i = 0; i < lines.length - 1; i++) {
      if (/^>\s*Category:/i.test(lines[i])) {
        for (let j = i + 1; j < lines.length; j++) {
          const m = /^>\s*(.+)$/.exec(lines[j]);
          if (m) {
            const d = m[1].trim();
            if (d && !/^[A-Z][a-z]+:/.test(d)) return d.slice(0, 160);
            continue;
          }
          if (lines[j].trim() === "") continue;
          break;
        }
      }
    }
  }
  return (manifest.description ?? `Design system « ${manifest.name ?? ""} » (importé d'Open Design).`).slice(0, 160);
}

function buildDesignMd(s) {
  const radius = s.radius;
  return `---
name: ${s.name}
category: ${s.category}
description: ${s.description}
imported: true
---

# Design System — ${s.name}

> Category: ${s.category} · ${s.description}

## 1. Visual Theme & Atmosphere
${s.description}

## 2. Color Palette & Roles
### Background
- **Canvas** (\`${s.palette[0]}\`): Fond principal de l'interface.
- **Surface** (\`${s.palette[1]}\`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (\`${s.palette[2]}\`): Texte principal et titres.
- **Text secondary** (\`${s.palette[3]}\`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (\`${s.accent}\`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (\`${s.accentHover}\`): État survol de l'accent.

## 3. Typography Rules
- **Display**: ${s.display}, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: ${s.body}, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: ${s.density === "compact" ? "48px" : s.density === "spacious" ? "96px" : "72px"}
- Content padding: ${s.density === "compact" ? "16px 24px" : s.density === "spacious" ? "24px 48px" : "24px 40px"}
- Border radius: ${radius}

## 5. Component Stylings
- Buttons: accent background, contrast text, radius ${radius}
- Cards: surface background, 1px border (text 8% opacity), radius ${radius}
- Inputs: transparent background, bottom border, focus ring accent

## 6. Depth & Elevation
- Shadows: subtle sm (${s.density === "compact" ? "restrained" : "default"})
- Borders: 1px solid, text color at 8% opacity

## 7. Do's and Don'ts
- DO use the declared color tokens exclusively.
- DO maintain consistent section spacing.
- DO ensure all text meets WCAG AA contrast ratio.
- DON'T invent colors outside the palette.
- DON'T add decorative shadows.
- DON'T use more than 2 typefaces (monospace excluded).

## 8. Responsive Behavior
- Breakpoints: 640px / 768px / 1024px / 1280px
- Mobile: single column, stack sections
- Desktop: full layout, max-width constraint

## 9. Motion & Interaction
- Transitions: 150ms ease for hover/focus
- Focus: visible outline using accent color
- Reduced motion: respect prefers-reduced-motion
`;
}

function readableSlug(slug) {
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

if (!existsSync(SOURCE)) {
  console.error(`Dossier source introuvable : ${SOURCE}`);
  process.exit(1);
}

const existingSlugs = new Set(
  readdirSync(OUT, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name),
);

const existingNames = new Set();
for (const slug of existingSlugs) {
  const mdPath = join(OUT, slug, "DESIGN.md");
  if (existsSync(mdPath)) {
    const m = /^name:\s*(.+)$/m.exec(readFileSync(mdPath, "utf8"));
    if (m) existingNames.add(m[1].trim().toLowerCase());
  }
}

const sourceDirs = readdirSync(SOURCE, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(SOURCE, e.name, "manifest.json")))
  .map((e) => e.name);

let added = 0;
let skipped = 0;
const warnings = [];

for (const slug of sourceDirs) {
  if (existingSlugs.has(slug)) {
    skipped++;
    continue;
  }
  const dir = join(SOURCE, slug);
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
  } catch {
    warnings.push(`${slug}: manifest.json illisible, ignoré`);
    skipped++;
    continue;
  }
  const cssPath = join(dir, "tokens.css");
  if (!existsSync(cssPath)) {
    warnings.push(`${slug}: tokens.css absent, ignoré`);
    skipped++;
    continue;
  }
  const css = readFileSync(cssPath, "utf8");

  const name = manifest.name ?? slug;
  const uniqueName = existingNames.has(name.toLowerCase())
    ? `${name} (${readableSlug(slug)})`
    : name;
  existingNames.add(uniqueName.toLowerCase());
  const category = translateCategory(manifest.category);
  const description = extractDescription(dir, manifest);

  const canvas = normalizeHex(cssVar(css, "bg") ?? cssVar(css, "background"), "#ffffff");
  const surface = normalizeHex(cssVar(css, "surface"), canvas);
  const text = normalizeHex(cssVar(css, "fg") ?? cssVar(css, "foreground"), "#111111");
  const textSecondary = normalizeHex(
    cssVar(css, "fg-2") ?? cssVar(css, "muted") ?? cssVar(css, "meta"),
    "#666666",
  );
  const accent = normalizeHex(cssVar(css, "accent"), "#3b82f6");
  const accentHover = normalizeHex(
    cssVar(css, "accent-hover") ?? cssVar(css, "accent-active"),
    accent,
  );

  const bodyRaw = cssVar(css, "font-body") ?? cssVar(css, "font-display") ?? "Inter, system-ui, sans-serif";
  const displayRaw = cssVar(css, "font-display") ?? bodyRaw;
  const cleanFont = (f) => f.replace(/["']/g, "").replace(/\s+/g, " ").trim();
  const body = cleanFont(bodyRaw);
  const display = cleanFont(displayRaw);

  const radius =
    cssVar(css, "radius-sm") ?? cssVar(css, "radius") ?? cssVar(css, "radius-md") ?? "8px";
  const density = densityFromSectionY(cssVar(css, "section-y-desktop"));

  const s = {
    slug,
    name: uniqueName,
    category,
    description,
    palette: [canvas, surface, text, textSecondary],
    accent,
    accentHover,
    body,
    display,
    density,
    radius,
  };

  const outDir = join(OUT, slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "DESIGN.md"), buildDesignMd(s), "utf8");
  added++;
}

console.log(
  `Open Design → app : ${added} design systems ajoutés, ${skipped} ignorés (déjà présents ou incomplets).`,
);
if (warnings.length > 0) {
  console.log("Avertissements :");
  for (const w of warnings) console.log(`  - ${w}`);
}
