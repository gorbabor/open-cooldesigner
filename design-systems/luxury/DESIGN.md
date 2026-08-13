---
name: Luxury
category: Éditorial
description: Élégant, haut de gamme, sombre
---

# Design System — Luxury

> Category: Éditorial · Élégant, haut de gamme, sombre

## 1. Visual Theme & Atmosphere
Élégant, haut de gamme, sombre

## 2. Color Palette & Roles
### Background
- **Canvas** (`#0c0a09`): Fond principal de l'interface.
- **Surface** (`#1c1917`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#fafaf9`): Texte principal et titres.
- **Text secondary** (`#a8a29e`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#b45309`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#d97706`): État survol de l'accent.

## 3. Typography Rules
- **Display**: 'Playfair Display', Georgia, serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Georgia, serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 96px
- Content padding: 24px 48px
- Border radius: 4px

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 4px
- Cards: surface background, 1px border (text 8% opacity), radius 4px
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
