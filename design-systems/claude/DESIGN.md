---
name: Claude (Anthropic)
category: IA & LLM
description: Accent terra cotta chaleureux, mise en page éditoriale propre, surfaces crème.
---

# Design System — Claude (Anthropic)

> Category: IA & LLM · Accent terra cotta chaleureux, mise en page éditoriale propre, surfaces crème.

## 1. Visual Theme & Atmosphere
Accent terra cotta chaleureux, mise en page éditoriale propre, surfaces crème.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#faf9f5`): Fond principal de l'interface.
- **Surface** (`#f0eeea`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#191919`): Texte principal et titres.
- **Text secondary** (`#6b6a66`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#c15f3c`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#a94f30`): État survol de l'accent.

## 3. Typography Rules
- **Display**: Georgia, serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Inter, system-ui, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 72px
- Content padding: 24px 40px
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
