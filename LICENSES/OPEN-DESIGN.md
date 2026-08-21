# Attribution — Contenus adaptés d'Open Design

Les skills et templates inclus dans ce projet (`src/skills/registry.ts`) sont des
**adaptations** de contenus publiés par le projet open source

**Open Design** — https://github.com/nexu-io/open-design — © Powerformer, Inc.

Licence des contenus sources : **Apache-2.0** (https://www.apache.org/licenses/LICENSE-2.0)

## Contenus adaptés

| Élément Open-Cooldesigner | Source Open Design |
|---|---|
| skill `design-brief` | plugin `examples/design-brief` (parsing I-Lang, 8 dimensions) |
| skill `design-critic` | plugin `examples/critique` (review 5 dimensions /10) |
| skill `design-refine` | plugin `od-design-refine` (critique ciblée + patch) |
| skill `tweaks` | plugin `examples/tweaks` (panneau live CSS variables) |
| skill `template-guide` | concept du catalogue de templates |
| skills `web-clone`, `design-md`, `ui-ux-pro-max`, `creative-director`, `impeccable-design-polish` | catalogue `skills/*` (adaptations condensées, fonctionnant sans dépendance externe) |
| templates `dashboard`, `saas-landing`, `data-report`, `docs-page`, `financial-report`, `invoice`, `meeting-notes`, `blog-post`, `kanban`, `pricing`, `waitlist`, `mobile-app`, `web-prototype` | catalogue `plugins/_official/examples/*` (structures + example.html) |
| templates `wireframe-annotated`, `mobile-onboarding`, `social-carousel`, `email-marketing`, `contact-widget`, `image-poster`, `webgl-experience`, `live-dashboard`, `github-dashboard`, `team-okrs` | catalogue `design-templates/*` (structures + example.html, adaptés) |
| **40 design systems** (`design-systems/<slug>/DESIGN.md`) : openai, claude, ollama, perplexity, linear, notion, stripe, vercel, slack, intercom, raycast, mintlify, coinbase, revolut, wise, trading-terminal, enterprise, professional, ant, material, shopify, airbnb, meta, nike, editorial, warm-editorial, modern, kami, clean, shadcn, mono, neobrutalism, neon, retro, corporate, fintech, luxury, minimal, saas, ecommerce | catalogue « Design System Examples » (`plugins/_official/design-systems/*`) — format DESIGN.md, catégories et palettes « inspired by » |
| **+116 design systems importés** (`design-systems/<slug>/DESIGN.md`, script `scripts/gen-design-systems-open-design.mjs` — conversion `manifest.json` + `tokens.css` → format DESIGN.md app, marqués `imported: true`) : agentic, airtable, apple, application, arc, artistic, atelier-zero, bento, binance, bmw, bmw-m, bold, brutalism, bugatti, cafe, cal, canva, cisco, clay, claymorphism, clickhouse, cloudflare-kumo, cohere, colorful, composio, contemporary, cosmic, creative, cursor, dashboard, default, discord, dithered, doodle, dramatic, duolingo, elegant, elevenlabs, energetic, expo, expressive, fantasy, ferrari, figma, flat, framer, friendly, futuristic, github, glassmorphism, gradient, hashicorp, hud, huggingface, ibm, kraken, lamborghini, levels, linear-app, lingo, loom, lovable, mastercard, minimax, miro, mission-control, mistral-ai, mongodb, neumorphism, nvidia, opencode-ai, pacman, paper, perspective, pinterest, playstation, posthog, premium, publication, refined, renault, replicate, resend, runwayml, sanity, sentry, simple, skeumorphism, sleek, spacex, spacious, spotify, starbucks, storytelling, supabase, superhuman, tesla, tetris, theverge, together-ai, tom-modern, totality-festival, uber, urdu, vibrant, vintage, vodafone, voltagent, warp, webex, webflow, wechat, wired, x-ai, xiaohongshu, zapier | catalogue `design-systems/*` (151 packages) — conversion automatisée |

## Conditions respectées

- Attribution conservée ci-dessus (exigence Apache-2.0).
- Les `SKILL.md`, `example.html` et `DESIGN.md` ont été **réécrits/condensés**
  pour Open-Cooldesigner : ce sont des interprétations « inspired by » des
  systèmes cités, pas des copies littérales de fichiers ni d'actifs de marque
  (aucun logo, police ou image n'est réutilisé).
- Les palettes sont des approximations génériques des directions visuelles
  décrites publiquement — aucune marque n'est affiliée au projet.
