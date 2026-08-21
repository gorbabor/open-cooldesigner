---
name: Apple
category: Media & Consumer
description: Consumer electronics. Premium white space, SF Pro, cinematic imagery.
imported: true
---

# Design System — Apple

> Category: Media & Consumer · Consumer electronics. Premium white space, SF Pro, cinematic imagery.

## 1. Visual Theme & Atmosphere
Consumer electronics. Premium white space, SF Pro, cinematic imagery.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#ffffff`): Fond principal de l'interface.
- **Surface** (`#f5f5f7`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#1d1d1f`): Texte principal et titres.
- **Text secondary** (`#424245`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#0071e3`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#0077ed`): État survol de l'accent.

## 3. Typography Rules
- **Display**: SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: SF Pro Text, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 96px
- Content padding: 24px 48px
- Border radius: 8px

## 5. Component Stylings
- Buttons: accent background, contrast text, radius 8px
- Cards: surface background, 1px border (text 8% opacity), radius 8px
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
