---
name: GitHub
category: Developer Tools
description: Code-forward platform. Functional density, blue-on-white precision, Primer foundations.
imported: true
---

# Design System — GitHub

> Category: Developer Tools · Code-forward platform. Functional density, blue-on-white precision, Primer foundations.

## 1. Visual Theme & Atmosphere
Code-forward platform. Functional density, blue-on-white precision, Primer foundations.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#ffffff`): Fond principal de l'interface.
- **Surface** (`#f6f8fa`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#1f2328`): Texte principal et titres.
- **Text secondary** (`#1f2328`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#0969da`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#0550ae`): État survol de l'accent.

## 3. Typography Rules
- **Display**: -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 72px
- Content padding: 24px 40px
- Border radius: 6px (universal Primer radius for buttons/inputs).
 * ─────────────────────────────────────────────────────────────────── */

:root {
  /* ─── Surface ──────────────────────────────────────────────────── */
  --bg:           #ffffff

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 6px (universal Primer radius for buttons/inputs).
 * ─────────────────────────────────────────────────────────────────── */

:root {
  /* ─── Surface ──────────────────────────────────────────────────── */
  --bg:           #ffffff
- Cards: surface background, 1px border (text 8% opacity), radius 6px (universal Primer radius for buttons/inputs).
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
