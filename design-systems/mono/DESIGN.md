---
name: Mono
category: Minimal
description: Monospace d'inspiration matricielle, fort contraste, densité compacte, hacker-chic.
---

# Design System — Mono

> Category: Minimal · Monospace d'inspiration matricielle, fort contraste, densité compacte, hacker-chic.

## 1. Visual Theme & Atmosphere
Monospace d'inspiration matricielle, fort contraste, densité compacte, hacker-chic.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#0d0d0d`): Fond principal de l'interface.
- **Surface** (`#1a1a1a`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#e5e5e5`): Texte principal et titres.
- **Text secondary** (`#8a8a8a`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#4ade80`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#3bcb6e`): État survol de l'accent.

## 3. Typography Rules
- **Display**: ui-monospace, monospace, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: ui-monospace, 'Cascadia Code', monospace, 400, 1rem/1.6
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
