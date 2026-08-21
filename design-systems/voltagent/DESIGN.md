---
name: VoltAgent
category: IA & LLM
description: AI agent framework. Void-black canvas, emerald accent, terminal-native.
imported: true
---

# Design System — VoltAgent

> Category: IA & LLM · AI agent framework. Void-black canvas, emerald accent, terminal-native.

## 1. Visual Theme & Atmosphere
AI agent framework. Void-black canvas, emerald accent, terminal-native.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#07110c`): Fond principal de l'interface.
- **Surface** (`#101c16`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#f4fff8`): Texte principal et titres.
- **Text secondary** (`#c8dfd0`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#7cff6b`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#7cff6b`): État survol de l'accent.

## 3. Typography Rules
- **Display**: Inter, system-ui, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Inter, system-ui, sans-serif, 400, 1rem/1.6
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
