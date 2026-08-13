import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "design-systems");

const SYSTEMS = [
  // --- IA & LLM ---
  { slug: "openai", name: "OpenAI", category: "IA & LLM", description: "Système calme et quasi-monochrome ancré dans un teal-noir profond, espace blanc généreux, typographie éditoriale.", palette: ["#0d0d0d", "#1a1a1a", "#f4f4f4", "#a3a3a3"], accent: "#10a37f", accentHover: "#0e8f6f", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "8px" },
  { slug: "claude", name: "Claude (Anthropic)", category: "IA & LLM", description: "Accent terra cotta chaleureux, mise en page éditoriale propre, surfaces crème.", palette: ["#faf9f5", "#f0eeea", "#191919", "#6b6a66"], accent: "#c15f3c", accentHover: "#a94f30", body: "Inter, system-ui, sans-serif", display: "Georgia, serif", density: "balanced", radius: "10px" },
  { slug: "ollama", name: "Ollama", category: "IA & LLM", description: "Exécution locale de LLM. Terminal-first, simplicité monochrome.", palette: ["#f6f6f4", "#ecece9", "#1f1f1e", "#7a7a75"], accent: "#5b5b56", accentHover: "#464642", body: "ui-monospace, 'Cascadia Code', monospace", display: "ui-monospace, monospace", density: "compact", radius: "4px" },
  { slug: "perplexity", name: "Perplexity AI", category: "IA & LLM", description: "Recherche IA conversationnelle. Fond sombre profond, unique accent violet, hiérarchie d'information dense.", palette: ["#0f1011", "#1a1b1d", "#f2f3f5", "#9a9da3"], accent: "#20808d", accentHover: "#1a6b76", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "compact", radius: "6px" },

  // --- SaaS & Productivité ---
  { slug: "linear", name: "Linear", category: "SaaS & Productivité", description: "Espace de travail ultra-minimal, précis, accent violet, densité maîtrisée.", palette: ["#0d0e10", "#16171a", "#f4f5f8", "#8b8d94"], accent: "#5e6ad2", accentHover: "#4f5ac2", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "compact", radius: "6px" },
  { slug: "notion", name: "Notion", category: "SaaS & Productivité", description: "Espace de travail tout-en-un. Minimalisme chaleureux, titres serif, surfaces douces.", palette: ["#ffffff", "#f7f7f5", "#37352f", "#9b9a97"], accent: "#2383e2", accentHover: "#1a6ec2", body: "Inter, system-ui, sans-serif", display: "Georgia, serif", density: "balanced", radius: "4px" },
  { slug: "stripe", name: "Stripe", category: "SaaS & Productivité", description: "Infrastructure de paiement. Dégradés violet signature, élégance typographique légère.", palette: ["#f6f8fa", "#ffffff", "#0a2540", "#425466"], accent: "#635bff", accentHover: "#5851e0", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "8px" },
  { slug: "vercel", name: "Vercel", category: "SaaS & Productivité", description: "Déploiement frontend. Précision noir et blanc, police Geist.", palette: ["#ffffff", "#fafafa", "#171717", "#737373"], accent: "#171717", accentHover: "#000000", body: "Geist, Inter, system-ui, sans-serif", display: "Geist, Inter, system-ui, sans-serif", density: "compact", radius: "6px" },
  { slug: "slack", name: "Slack", category: "SaaS & Productivité", description: "Communication d'entreprise. Violet aubergine principal, palette multi-accents.", palette: ["#ffffff", "#f4f2f8", "#1d1c1d", "#696769"], accent: "#611f69", accentHover: "#4a154b", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "8px" },
  { slug: "intercom", name: "Intercom", category: "SaaS & Productivité", description: "Messagerie client. Palette bleue amicale, motifs conversationnels.", palette: ["#ffffff", "#f4f7fb", "#1a1d24", "#6e7480"], accent: "#4d79ff", accentHover: "#3a63e8", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "10px" },
  { slug: "raycast", name: "Raycast", category: "SaaS & Productivité", description: "Lanceur de productivité. Chrome sombre élégant, accents en dégradé vibrants.", palette: ["#121417", "#1c1f24", "#f2f3f5", "#8b919c"], accent: "#ff6363", accentHover: "#e65454", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "compact", radius: "8px" },
  { slug: "mintlify", name: "Mintlify", category: "SaaS & Productivité", description: "Plateforme de documentation. Propre, accents verts, optimisée pour la lecture.", palette: ["#ffffff", "#f9fafb", "#0d1317", "#64748b"], accent: "#10b981", accentHover: "#0da271", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "8px" },

  // --- Fintech ---
  { slug: "coinbase", name: "Coinbase", category: "Fintech", description: "Échange crypto. Identité bleue épurée, axé sur la confiance.", palette: ["#ffffff", "#f5f8fa", "#0a0b0d", "#5b616e"], accent: "#0052ff", accentHover: "#0045d9", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "8px" },
  { slug: "revolut", name: "Revolut", category: "Fintech", description: "Banque numérique. Interface sombre élégante, cartes en dégradé.", palette: ["#191a1c", "#242629", "#f5f5f5", "#9e9ea2"], accent: "#5c5ce0", accentHover: "#4c4cd0", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "compact", radius: "12px" },
  { slug: "wise", name: "Wise", category: "Fintech", description: "Transfert d'argent. Accent vert vif, amical et clair.", palette: ["#ffffff", "#f5faf8", "#163300", "#5f6f59"], accent: "#163300", accentHover: "#0f2600", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "6px" },
  { slug: "trading-terminal", name: "Trading Terminal", category: "Fintech", description: "Terminal style Bloomberg. Dark uniquement, dense en données, signaux cyan/corail.", palette: ["#0a0e14", "#11161f", "#e6e9ee", "#8a94a6"], accent: "#00d4aa", accentHover: "#00b894", body: "ui-monospace, 'Cascadia Code', monospace", display: "ui-monospace, monospace", density: "compact", radius: "2px" },

  // --- Enterprise / Corporate ---
  { slug: "enterprise", name: "Enterprise", category: "Enterprise", description: "Design d'entreprise propre et à fort contraste pour les flux pilotés par les données.", palette: ["#ffffff", "#f5f6f8", "#101828", "#667085"], accent: "#1d4ed8", accentHover: "#1e40af", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "compact", radius: "6px" },
  { slug: "professional", name: "Professional", category: "Enterprise", description: "Design soigné et prêt pour les affaires, typographie moderne, mises en page structurées.", palette: ["#ffffff", "#f8f9fb", "#1f2937", "#6b7280"], accent: "#2563eb", accentHover: "#1d4ed8", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "8px" },
  { slug: "ant", name: "Ant", category: "Enterprise", description: "Système structuré orienté entreprise, clarté et efficacité pour applications à forte densité.", palette: ["#ffffff", "#f5f5f5", "#000000", "#888888"], accent: "#1677ff", accentHover: "#0958d9", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "compact", radius: "6px" },
  { slug: "material", name: "Material", category: "Enterprise", description: "Material Design : surfaces superposées, thème dynamique, motifs cross-platform.", palette: ["#fef7ff", "#ffffff", "#1d1b20", "#49454f"], accent: "#6750a4", accentHover: "#5a4599", body: "Roboto, system-ui, sans-serif", display: "Roboto, system-ui, sans-serif", density: "balanced", radius: "12px" },

  // --- E-commerce ---
  { slug: "shopify", name: "Shopify", category: "E-commerce", description: "Plateforme e-commerce. Cinématique dark-first, accent vert néon, typographie ultra-légère.", palette: ["#0b0b0d", "#16181a", "#f4f4f4", "#9a9ea6"], accent: "#96bf48", accentHover: "#84a83e", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "10px" },
  { slug: "airbnb", name: "Airbnb", category: "E-commerce", description: "Marketplace de voyage. Accent corail chaleureux, photographie en premier, interface arrondie.", palette: ["#ffffff", "#f7f7f7", "#222222", "#717171"], accent: "#ff385c", accentHover: "#e02e4e", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "12px" },
  { slug: "meta", name: "Meta (Store)", category: "E-commerce", description: "Commerce tech. Photographie en premier, surfaces clair/sombre, CTA Meta Blue.", palette: ["#ffffff", "#f0f2f5", "#050505", "#65676b"], accent: "#0866ff", accentHover: "#075be0", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "8px" },
  { slug: "nike", name: "Nike", category: "E-commerce", description: "Commerce sportif. Interface monochrome, typographie majuscule massive, photographie plein cadre.", palette: ["#ffffff", "#f5f5f5", "#111111", "#757575"], accent: "#111111", accentHover: "#000000", body: "Inter, system-ui, sans-serif", display: "'Helvetica Neue', Inter, sans-serif", density: "compact", radius: "0px" },

  // --- Éditorial ---
  { slug: "editorial", name: "Editorial", category: "Éditorial", description: "Mise en page magazine, typographie serif raffinée, grilles structurées.", palette: ["#ffffff", "#faf9f7", "#1a1a1a", "#6b6b6b"], accent: "#c1121f", accentHover: "#a30e19", body: "Georgia, serif", display: "'Playfair Display', Georgia, serif", density: "spacious", radius: "0px" },
  { slug: "warm-editorial", name: "Warm Editorial", category: "Éditorial", description: "Esthétique magazine à dominante serif, accent terra cotta sur papier blanc cassé chaud.", palette: ["#fbf7f0", "#f5ede1", "#2b2118", "#8a7a68"], accent: "#c96f4a", accentHover: "#b35e3c", body: "Georgia, serif", display: "'Playfair Display', Georgia, serif", density: "spacious", radius: "0px" },
  { slug: "modern", name: "Modern", category: "Éditorial", description: "Style éditorial contemporain, typographie serif, palettes minimales.", palette: ["#ffffff", "#f7f7f5", "#111111", "#5f5f5f"], accent: "#1a1a1a", accentHover: "#000000", body: "Georgia, serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "4px" },
  { slug: "kami", name: "Kami", category: "Éditorial", description: "Système papier éditorial : fond parchemin chaud, accent bleu encre, hiérarchie serif.", palette: ["#f5f4ed", "#efece2", "#1b365d", "#5c6b82"], accent: "#1b365d", accentHover: "#152a49", body: "Georgia, serif", display: "Georgia, serif", density: "spacious", radius: "0px" },

  // --- Minimal ---
  { slug: "clean", name: "Clean", category: "Minimal", description: "Simplicité avec espace blanc généreux, typographie lisible, palette limitée.", palette: ["#ffffff", "#fafafa", "#171717", "#737373"], accent: "#0f172a", accentHover: "#1e293b", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "spacious", radius: "8px" },
  { slug: "shadcn", name: "Shadcn", category: "Minimal", description: "Composants minimaux et propres, palette monochrome, motifs utility-first.", palette: ["#ffffff", "#f4f4f5", "#18181b", "#71717a"], accent: "#18181b", accentHover: "#27272a", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "compact", radius: "6px" },
  { slug: "mono", name: "Mono", category: "Minimal", description: "Monospace d'inspiration matricielle, fort contraste, densité compacte, hacker-chic.", palette: ["#0d0d0d", "#1a1a1a", "#e5e5e5", "#8a8a8a"], accent: "#4ade80", accentHover: "#3bcb6e", body: "ui-monospace, 'Cascadia Code', monospace", display: "ui-monospace, monospace", density: "compact", radius: "0px" },

  // --- Expressif / Effets ---
  { slug: "neobrutalism", name: "Neobrutalism", category: "Expressif", description: "Brutalisme moderne : bordures affirmées, accents vifs, surfaces chaudes.", palette: ["#fef2e8", "#fff", "#1f1f1f", "#6b6b6b"], accent: "#ff5d5d", accentHover: "#e84a4a", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "0px" },
  { slug: "neon", name: "Neon", category: "Expressif", description: "Lueur néon électrique, paires de couleurs à fort contraste.", palette: ["#0a0a14", "#12121f", "#e8e8f0", "#8888a0"], accent: "#00f0ff", accentHover: "#00d0dd", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "10px" },
  { slug: "retro", name: "Retro", category: "Expressif", description: "Design rétro vintage, palettes à fort contraste, éléments nostalgiques.", palette: ["#fdf3d8", "#f7e8c3", "#3d2b1f", "#8a6f4d"], accent: "#e76f51", accentHover: "#d05a3e", body: "'Courier New', monospace", display: "'Courier New', monospace", density: "balanced", radius: "0px" },
];

const LEGACY = [
  { slug: "corporate", name: "Corporate", category: "Enterprise", description: "Sobre, institutionnel, confiance", palette: ["#f8fafc", "#ffffff", "#0f172a", "#475569"], accent: "#1e3a8a", accentHover: "#1e40af", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "8px" },
  { slug: "fintech", name: "Fintech", category: "Fintech", description: "Moderne, données, confiance numérique", palette: ["#f0fdfa", "#ffffff", "#0f172a", "#475569"], accent: "#0f766e", accentHover: "#115e59", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "compact", radius: "12px" },
  { slug: "luxury", name: "Luxury", category: "Éditorial", description: "Élégant, haut de gamme, sombre", palette: ["#0c0a09", "#1c1917", "#fafaf9", "#a8a29e"], accent: "#b45309", accentHover: "#d97706", body: "Georgia, serif", display: "'Playfair Display', Georgia, serif", density: "spacious", radius: "4px" },
  { slug: "minimal", name: "Minimal", category: "Minimal", description: "Blanc, air, typographie forte", palette: ["#ffffff", "#fafafa", "#18181b", "#52525b"], accent: "#18181b", accentHover: "#27272a", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "spacious", radius: "16px" },
  { slug: "saas", name: "SaaS", category: "SaaS & Productivité", description: "Produit logiciel, conversion, moderne", palette: ["#f8fafc", "#ffffff", "#0f172a", "#64748b"], accent: "#4f46e5", accentHover: "#4338ca", body: "Inter, system-ui, sans-serif", display: "Inter, system-ui, sans-serif", density: "balanced", radius: "10px" },
  { slug: "ecommerce", name: "E-commerce", category: "E-commerce", description: "Produit, marketing, conversion", palette: ["#fff1f2", "#ffffff", "#1f2937", "#6b7280"], accent: "#e11d48", accentHover: "#be123c", body: "system-ui, sans-serif", display: "system-ui, sans-serif", density: "balanced", radius: "12px" },
];

function buildDesignMd(s) {
  return `---
name: ${s.name}
category: ${s.category}
description: ${s.description}
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
- Border radius: ${s.radius}

## 5. Component Stylings
- Buttons: accent background, contrast text, radius ${s.radius}
- Cards: surface background, 1px border (text 8% opacity), radius ${s.radius}
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

mkdirSync(OUT, { recursive: true });
for (const s of [...SYSTEMS, ...LEGACY]) {
  const dir = join(OUT, s.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "DESIGN.md"), buildDesignMd(s), "utf8");
}
console.log(`Générés : ${SYSTEMS.length + LEGACY.length} DESIGN.md dans ${OUT}`);
