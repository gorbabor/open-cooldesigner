---
name: WeChat Design System
category: Social & Messaging
description: Brand visual language for WeChat Mini Programs, official accounts, and open ecosystem extensions.
imported: true
---

# Design System — WeChat Design System

> Category: Social & Messaging · Brand visual language for WeChat Mini Programs, official accounts, and open ecosystem extensions.

## 1. Visual Theme & Atmosphere
Brand visual language for WeChat Mini Programs, official accounts, and open ecosystem extensions.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#ededed`): Fond principal de l'interface.
- **Surface** (`#f7f7f7`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#1a1a1a`): Texte principal et titres.
- **Text secondary** (`#666666`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#07c160`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#10b160`): État survol de l'accent.

## 3. Typography Rules
- **Display**: -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Noto Sans SC, Helvetica Neue, Helvetica, Arial, sans-serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: identical apple-system + CJK stack. * DESIGN.md uses a single family across the app, 400, 1rem/1.6
- **Mono**: ui-monospace, 'Cascadia Code', monospace, 400, 0.875rem

## 4. Layout Principles
- Layout model: single_column, max-width 1200px
- Section spacing: 72px
- Content padding: 24px 40px
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
