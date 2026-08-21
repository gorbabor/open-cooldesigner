---
name: Miro
category: Design & Creative
description: Visual collaboration. Bright yellow accent, infinite canvas aesthetic.
imported: true
---

# Design System — Miro

> Category: Design & Creative · Visual collaboration. Bright yellow accent, infinite canvas aesthetic.

## 1. Visual Theme & Atmosphere
Visual collaboration. Bright yellow accent, infinite canvas aesthetic.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#fff7c2`): Fond principal de l'interface.
- **Surface** (`#ffffff`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#050038`): Texte principal et titres.
- **Text secondary** (`#322b6b`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#ffd02f`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#ffd02f`): État survol de l'accent.

## 3. Typography Rules
- **Display**: Formular, Inter, Arial, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Formular, Inter, Arial, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 96px
- Content padding: 24px 48px
- Border radius: 10px

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 10px
- Cards: surface background, 1px border (text 8% opacity), radius 10px
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
