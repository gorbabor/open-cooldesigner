---
name: Nike
category: E-commerce
description: Commerce sportif. Interface monochrome, typographie majuscule massive, photographie plein cadre.
---

# Design System — Nike

> Category: E-commerce · Commerce sportif. Interface monochrome, typographie majuscule massive, photographie plein cadre.

## 1. Visual Theme & Atmosphere
Commerce sportif. Interface monochrome, typographie majuscule massive, photographie plein cadre.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#ffffff`): Fond principal de l'interface.
- **Surface** (`#f5f5f5`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#111111`): Texte principal et titres.
- **Text secondary** (`#757575`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#111111`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#000000`): État survol de l'accent.

## 3. Typography Rules
- **Display**: 'Helvetica Neue', Inter, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Inter, system-ui, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 48px
- Content padding: 16px 24px
- Border radius: 0px

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 0px
- Cards: surface background, 1px border (text 8% opacity), radius 0px
- Inputs: transparent background, bottom border, focus ring accent

## 6. Depth & Elevation
- Shadows: subtle sm (restrained)
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
