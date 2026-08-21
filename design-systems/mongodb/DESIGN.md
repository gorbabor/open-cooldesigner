---
name: MongoDB
category: Backend & Data
description: Document database. Green leaf branding, developer documentation focus.
imported: true
---

# Design System — MongoDB

> Category: Backend & Data · Document database. Green leaf branding, developer documentation focus.

## 1. Visual Theme & Atmosphere
Document database. Green leaf branding, developer documentation focus.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#001e2b`): Fond principal de l'interface.
- **Surface** (`#1c2d38`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#ffffff`): Texte principal et titres.
- **Text secondary** (`#e8edeb`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#00ed64`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#00684a`): État survol de l'accent.

## 3. Typography Rules
- **Display**: MongoDB Value Serif for editorial hero headlines * --font-body: Euclid Circular A for geometric body / UI * --font-mono: Source Code Pro for code and wide-tracked labels * The serif-at-hero choice is the typographic signature, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Euclid Circular A for geometric body / UI * --font-mono: Source Code Pro for code and wide-tracked labels * The serif-at-hero choice is the typographic signature, 400, 1rem/1.6
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
