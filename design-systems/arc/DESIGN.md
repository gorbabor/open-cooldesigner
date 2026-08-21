---
name: Arc Browser
category: SaaS & Productivité
description: "The browser that browses for you." Translucent surfaces, gradient warmth, sidebar-first layout.
imported: true
---

# Design System — Arc Browser

> Category: SaaS & Productivité · "The browser that browses for you." Translucent surfaces, gradient warmth, sidebar-first layout.

## 1. Visual Theme & Atmosphere
"The browser that browses for you." Translucent surfaces, gradient warmth, sidebar-first layout.

## 2. Color Palette & Roles
### Background
- **Canvas** (`#fdf3ec`): Fond principal de l'interface.
- **Surface** (`#ffffff`): Cartes, panneaux, zones élevées.

### Text
- **Text primary** (`#1a1a1f`): Texte principal et titres.
- **Text secondary** (`#54545a`): Texte secondaire, légendes, métadonnées.

### Accent
- **Accent** (`#ff5f5f`): Actions, focus, liens et éléments interactifs.
- **Accent hover** (`#ff5f5f`): État survol de l'accent.

## 3. Typography Rules
- **Display**: Argent CF, Source Serif Pro, Georgia, serif, 700, clamp(2rem, 5vw, 3.5rem)
- **Body**: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif, 400, 1rem/1.6
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
