---
name: Cohere
category: IA & LLM
description: Enterprise AI platform. Vibrant gradients, data-rich dashboard aesthetic.
imported: true
---

# Design System — Cohere

> Category: IA & LLM · Enterprise AI platform. Vibrant gradients, data-rich dashboard aesthetic.

## 1. Visual Theme & Atmosphere
Enterprise AI platform. Vibrant gradients, data-rich dashboard aesthetic.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#ffffff`): Fond principal de l'interface.
- **Surface** (`#fafafa`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#000000`): Texte principal et titres.
- **Text secondary** (`#212121`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#1863dc`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#1863dc`): État survol de l'accent.

## 3. Typography Rules
- **Display**: CohereText, Space Grotesk, Inter, ui-sans-serif, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Unica77 Cohere Web, Inter, Arial, ui-sans-serif, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 72px
- Content padding: 24px 40px
- Border radius: small utility elements (dialog boxes, nav pills)
   * --radius-md: THE PRIMARY COHERE CARD — always 22px
   * --radius-lg: large featured containers — same 22px treatment */
  --radius-sm: 8px

## 5. Component Stylings
- Buttons: accent background, contrast text, radius small utility elements (dialog boxes, nav pills)
   * --radius-md: THE PRIMARY COHERE CARD — always 22px
   * --radius-lg: large featured containers — same 22px treatment */
  --radius-sm: 8px
- Cards: surface background, 1px border (text 8% opacity), radius small utility elements (dialog boxes, nav pills)
   * --radius-md: THE PRIMARY COHERE CARD — always 22px
   * --radius-lg: large featured containers — same 22px treatment */
  --radius-sm: 8px
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
