---
name: Framer
category: Design & Creative
description: Website builder. Bold black and blue, motion-first, design-forward.
imported: true
---

# Design System — Framer

> Category: Design & Creative · Website builder. Bold black and blue, motion-first, design-forward.

## 1. Visual Theme & Atmosphere
Website builder. Bold black and blue, motion-first, design-forward.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#000000`): Fond principal de l'interface.
- **Surface** (`#090909`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#ffffff`): Texte principal et titres.
- **Text secondary** (`#a6a6a6`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#0099ff`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#0099ff`): État survol de l'accent.

## 3. Typography Rules
- **Display**: GT Walsheim Framer Medium, GT Walsheim Medium, GT Walsheim, -apple-system, Segoe UI, Inter, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Inter Variable, Inter, -apple-system, Segoe UI, Arial, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 96px
- Content padding: 24px 48px
- Border radius: 8px` (DESIGN.md §5: standard component radius
 *      for code blocks / buttons / interactive elements). Pill
 *      buttons go via `--radius-pill` and override locally — the
 *      40px–100px pill range from DESIGN.md is button-specific and
 *      not part of the shared schema.
 *
 *   7. `--elev-raised` reproduces the multi-layer Framer card stack
 *      from DESIGN.md §6 Level 3 verbatim: a 0.5px white top-edge
 *      highlight (simulating light hitting the top surface) plus a
 *      deep ambient 30px shadow (true floating depth). Never drop
 *      either layer when overriding — both are required for the
 *      "built-not-pasted-onto-page" quality DESIGN.md describes.
 *
 *   8. Foreground ramp binds all four tiers (#ffffff →
 *      rgba(255,255,255,0.6) → rgba(255,255,255,0.4)) so cross-brand
 *      components targeting `--fg-2`, `--muted`, or `--meta` resolve
 *      to Framer's actual ghost-white tiers instead of collapsing.
 *      `--fg-2` binds to Muted Silver (#a6a6a6), the documented
 *      secondary text color from DESIGN.md §2.
 *
 * Source contracts:
 *   - Standard token names: design-systems/_schema/tokens.schema.ts
 *   - A2 fallback parity:   design-systems/_schema/defaults.css
 *   - Lint enforcement:     apps/daemon/src/lint-artifact.ts
 *
 * Keep this file additive: never invent token names not also
 * documented in DESIGN.md or the schema. GT Walsheim / Inter / Azeret
 * Mono are not bundled — the font stacks list system fallbacks so
 * artifacts render acceptably even when the custom faces are not
 * loaded, and any host that wants the real faces links them externally.
 * ─────────────────────────────────────────────────────────────────── */

:root {
  /* ─── Surface ─────────────────────────────────────────────────────
   * The void: pure black canvas with a near-black elevated surface.
   * No warm tier — `--surface-warm` aliases to surface because the
   * brand explicitly forbids tinted backgrounds (DESIGN.md §7 don't:
   * "no warm dark backgrounds, no charcoal, no brownish blacks"). */
  --bg: #000000

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 8px` (DESIGN.md §5: standard component radius
 *      for code blocks / buttons / interactive elements). Pill
 *      buttons go via `--radius-pill` and override locally — the
 *      40px–100px pill range from DESIGN.md is button-specific and
 *      not part of the shared schema.
 *
 *   7. `--elev-raised` reproduces the multi-layer Framer card stack
 *      from DESIGN.md §6 Level 3 verbatim: a 0.5px white top-edge
 *      highlight (simulating light hitting the top surface) plus a
 *      deep ambient 30px shadow (true floating depth). Never drop
 *      either layer when overriding — both are required for the
 *      "built-not-pasted-onto-page" quality DESIGN.md describes.
 *
 *   8. Foreground ramp binds all four tiers (#ffffff →
 *      rgba(255,255,255,0.6) → rgba(255,255,255,0.4)) so cross-brand
 *      components targeting `--fg-2`, `--muted`, or `--meta` resolve
 *      to Framer's actual ghost-white tiers instead of collapsing.
 *      `--fg-2` binds to Muted Silver (#a6a6a6), the documented
 *      secondary text color from DESIGN.md §2.
 *
 * Source contracts:
 *   - Standard token names: design-systems/_schema/tokens.schema.ts
 *   - A2 fallback parity:   design-systems/_schema/defaults.css
 *   - Lint enforcement:     apps/daemon/src/lint-artifact.ts
 *
 * Keep this file additive: never invent token names not also
 * documented in DESIGN.md or the schema. GT Walsheim / Inter / Azeret
 * Mono are not bundled — the font stacks list system fallbacks so
 * artifacts render acceptably even when the custom faces are not
 * loaded, and any host that wants the real faces links them externally.
 * ─────────────────────────────────────────────────────────────────── */

:root {
  /* ─── Surface ─────────────────────────────────────────────────────
   * The void: pure black canvas with a near-black elevated surface.
   * No warm tier — `--surface-warm` aliases to surface because the
   * brand explicitly forbids tinted backgrounds (DESIGN.md §7 don't:
   * "no warm dark backgrounds, no charcoal, no brownish blacks"). */
  --bg: #000000
- Cards: surface background, 1px border (text 8% opacity), radius 8px` (DESIGN.md §5: standard component radius
 *      for code blocks / buttons / interactive elements). Pill
 *      buttons go via `--radius-pill` and override locally — the
 *      40px–100px pill range from DESIGN.md is button-specific and
 *      not part of the shared schema.
 *
 *   7. `--elev-raised` reproduces the multi-layer Framer card stack
 *      from DESIGN.md §6 Level 3 verbatim: a 0.5px white top-edge
 *      highlight (simulating light hitting the top surface) plus a
 *      deep ambient 30px shadow (true floating depth). Never drop
 *      either layer when overriding — both are required for the
 *      "built-not-pasted-onto-page" quality DESIGN.md describes.
 *
 *   8. Foreground ramp binds all four tiers (#ffffff →
 *      rgba(255,255,255,0.6) → rgba(255,255,255,0.4)) so cross-brand
 *      components targeting `--fg-2`, `--muted`, or `--meta` resolve
 *      to Framer's actual ghost-white tiers instead of collapsing.
 *      `--fg-2` binds to Muted Silver (#a6a6a6), the documented
 *      secondary text color from DESIGN.md §2.
 *
 * Source contracts:
 *   - Standard token names: design-systems/_schema/tokens.schema.ts
 *   - A2 fallback parity:   design-systems/_schema/defaults.css
 *   - Lint enforcement:     apps/daemon/src/lint-artifact.ts
 *
 * Keep this file additive: never invent token names not also
 * documented in DESIGN.md or the schema. GT Walsheim / Inter / Azeret
 * Mono are not bundled — the font stacks list system fallbacks so
 * artifacts render acceptably even when the custom faces are not
 * loaded, and any host that wants the real faces links them externally.
 * ─────────────────────────────────────────────────────────────────── */

:root {
  /* ─── Surface ─────────────────────────────────────────────────────
   * The void: pure black canvas with a near-black elevated surface.
   * No warm tier — `--surface-warm` aliases to surface because the
   * brand explicitly forbids tinted backgrounds (DESIGN.md §7 don't:
   * "no warm dark backgrounds, no charcoal, no brownish blacks"). */
  --bg: #000000
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
