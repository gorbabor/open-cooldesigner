---
name: Mastercard
category: Fintech
description: Global payments network. Warm cream canvas, orbital pill shapes, editorial warmth.
imported: true
---

# Design System — Mastercard

> Category: Fintech · Global payments network. Warm cream canvas, orbital pill shapes, editorial warmth.

## 1. Visual Theme & Atmosphere
Global payments network. Warm cream canvas, orbital pill shapes, editorial warmth.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#f3f0ee`): Fond principal de l'interface.
- **Surface** (`#fcfbfa`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#141413`): Texte principal et titres.
- **Text secondary** (`#262627`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#cf4500`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#cf4500`): État survol de l'accent.

## 3. Typography Rules
- **Display**: MarkForMC, Sofia Sans, Arial, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: MarkForMC, Sofia Sans, Arial, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 96px
- Content padding: 24px 48px
- Border radius: 20px

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 20px
- Cards: surface background, 1px border (text 8% opacity), radius 20px
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
