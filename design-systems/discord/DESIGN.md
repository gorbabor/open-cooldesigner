---
name: Discord
category: SaaS & Productivité
description: Voice / chat platform. Deep blurple, dark-first surfaces, playful accent moments.
imported: true
---

# Design System — Discord

> Category: SaaS & Productivité · Voice / chat platform. Deep blurple, dark-first surfaces, playful accent moments.

## 1. Visual Theme & Atmosphere
Voice / chat platform. Deep blurple, dark-first surfaces, playful accent moments.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#313338`): Fond principal de l'interface.
- **Surface** (`#2b2d31`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#dbdee1`): Texte principal et titres.
- **Text secondary** (`#f2f3f5`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#5865f2`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#4752c4`): État survol de l'accent.

## 3. Typography Rules
- **Display**: gg sans, Helvetica Neue, Helvetica, Arial, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: gg sans, Helvetica Neue, Helvetica, Arial, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 72px
- Content padding: 24px 40px
- Border radius: 4px (buttons/inputs)

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 4px (buttons/inputs)
- Cards: surface background, 1px border (text 8% opacity), radius 4px (buttons/inputs)
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
