---
name: Linear
category: SaaS & Productivité
description: Espace de travail ultra-minimal, précis, accent violet, densité maîtrisée.
---

# Design System — Linear

> Category: SaaS & Productivité · Espace de travail ultra-minimal, précis, accent violet, densité maîtrisée.

## 1. Visual Theme & Atmosphere
Espace de travail ultra-minimal, précis, accent violet, densité maîtrisée.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#0d0e10`): Fond principal de l'interface.
- **Surface** (`#16171a`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#f4f5f8`): Texte principal et titres.
- **Text secondary** (`#8b8d94`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#5e6ad2`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#4f5ac2`): État survol de l'accent.

## 3. Typography Rules
- **Display**: Inter, system-ui, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Inter, system-ui, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 48px
- Content padding: 16px 24px
- Border radius: 6px

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 6px
- Cards: surface background, 1px border (text 8% opacity), radius 6px
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
