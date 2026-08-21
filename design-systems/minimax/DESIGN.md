---
name: MiniMax
category: IA & LLM
description: AI model provider. Bold dark interface with neon accents.
imported: true
---

# Design System — MiniMax

> Category: IA & LLM · AI model provider. Bold dark interface with neon accents.

## 1. Visual Theme & Atmosphere
AI model provider. Bold dark interface with neon accents.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#ffffff`): Fond principal de l'interface.
- **Surface** (`#fafafa`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#222222`): Texte principal et titres.
- **Text secondary** (`#18181b`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#1456f0`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#2563eb`): État survol de l'accent.

## 3. Typography Rules
- **Display**: Outfit + CJK fallbacks, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: DM Sans + CJK. * - --text-4xl: 80px (display hero, Outfit weight 500 per DESIGN.md §3). * - --leading-body: 1.5 (universal MiniMax rhythm), 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 72px
- Content padding: 24px 40px
- Border radius: 8px (CTA), --radius-md: 13px (card),
 *     --radius-lg: 20px (product showcase), --radius-pill: 9999px (nav).
 *   - --elev-raised: 0 4px 6px rgba(0, 0, 0, 0.08) — DESIGN.md §6 Level 1.
 *     The brand-glow shadow rgba(44, 30, 116, 0.16) stays inline on
 *     featured product cards (one-off, not promoted to a token).
 * ─────────────────────────────────────────────────────────────────── */

:root {
  /* ─── Surface ──────────────────────────────────────────────────── */
  --bg:           #ffffff

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 8px (CTA), --radius-md: 13px (card),
 *     --radius-lg: 20px (product showcase), --radius-pill: 9999px (nav).
 *   - --elev-raised: 0 4px 6px rgba(0, 0, 0, 0.08) — DESIGN.md §6 Level 1.
 *     The brand-glow shadow rgba(44, 30, 116, 0.16) stays inline on
 *     featured product cards (one-off, not promoted to a token).
 * ─────────────────────────────────────────────────────────────────── */

:root {
  /* ─── Surface ──────────────────────────────────────────────────── */
  --bg:           #ffffff
- Cards: surface background, 1px border (text 8% opacity), radius 8px (CTA), --radius-md: 13px (card),
 *     --radius-lg: 20px (product showcase), --radius-pill: 9999px (nav).
 *   - --elev-raised: 0 4px 6px rgba(0, 0, 0, 0.08) — DESIGN.md §6 Level 1.
 *     The brand-glow shadow rgba(44, 30, 116, 0.16) stays inline on
 *     featured product cards (one-off, not promoted to a token).
 * ─────────────────────────────────────────────────────────────────── */

:root {
  /* ─── Surface ──────────────────────────────────────────────────── */
  --bg:           #ffffff
- Inputs: transparent background, bottom border, focus ring accent

## 6. Depth & Elevation
- Shadows: subtle sm (default)
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
