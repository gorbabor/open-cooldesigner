# Open-Cooldesigner

Studio créatif IA **local-first** pour Windows : générer, modifier et exporter des artefacts visuels (landing pages, dashboards, interfaces, présentations web, wireframes, mockups…) depuis une interface unifiée — sans écrire de code.

> Cahier des charges : `sources/cdc.md` — le projet est un projet indépendant (pas un fork d'Open Design).

## Stack

- **Tauri 2** (Rust) — shell Windows, installateur NSIS/MSI, stockage sécurisé des clés (Windows Credential Manager via `keyring`)
- **React 18 + TypeScript + Vite**
- **Tailwind CSS**, **Zustand** (persistance localStorage), **Monaco Editor** (workers locaux)
- **AI Gateway** multi-fournisseurs : OpenAI, Anthropic, DeepSeek, OpenAI-compatible, Ollama

## Fonctionnalités

- **Projets + snapshots** : versioning, restauration, duplication (branches)
- **Chat → génération** : prompt → artefact HTML → preview sandboxée (iframe + CSP, bandeau d'erreur JS) → édition Monaco → export HTML/ZIP
- **156 design systems** (dont 116 importés d'Open Design, marqués « importé ») — sélecteur en modal : recherche, filtres par catégorie, preview en grand format, « Défaut » pour les nouveaux projets
- **40 templates** (dashboard, landing, e-commerce, mobile, wireframe annoté, quiz, WebGL, OKRs…) — sélecteur dans le pied du chat avec recherche et preview
- **10 skills** activables (Design Brief, Template Guide, Design Critic, Tweaks, Web Clone, UI/UX Pro Max, Creative Director, Impeccable Polish…) — injectés dans le prompt de génération
- **Critique IA en modal** : 5 scores /10 colorés, Conserver / Corriger / Gains rapides, Auto-improve
- **Select & Ask** : sélectionner un texte dans la preview et demander une modification ciblée
- **Tweaks en direct** : accent, typo, densité, thème clair/sombre (CSS variables, sans IA)
- **AI Cost Center** : budget par projet, coûts estimés
- **Modèles** : ajout custom, **auto-découverte** (Ollama `/api/tags`, OpenAI-compatible & OpenAI `/models`), test de connexion, alias, température
- **Clé API permanente** : Windows Credential Manager en Tauri, localStorage en navigateur — jamais en dur dans le code

## Installation

### Prérequis

- **Node.js 18+** (développement)
- **Rust + MSVC** (uniquement pour compiler l'installateur Tauri — optionnel)

### Développement

```bash
npm install
npm run dev        # → http://localhost:1420 (WebView Tauri : npm run tauri dev)
npm test           # Vitest (136 tests)
npm run typecheck && npm run lint && npm run build
```

### Installateur Windows (Tauri)

```bash
npm run tauri build   # produit Open-Cooldesigner-Setup-x64.exe + .msi
```

### Configuration des clés IA

1. Ouvrir **Paramètres → Fournisseur**
2. Choisir le fournisseur (OpenAI, Anthropic, DeepSeek, OpenAI-compatible, Ollama)
3. Saisir la clé API et cliquer **« Enregistrer »** (permanente)
4. Choisir le modèle, tester la connexion, ajuster la température

## Utilisation

1. Créer un projet (choisir un design system)
2. Décrire le design dans le chat (« Crée un dashboard de suivi commercial »)
3. Prévisualiser, modifier le code, appliquer des Tweaks
4. Critiquer l'artefact (5 dimensions) et Auto-improve
5. Exporter en HTML ou ZIP

## Structure

```
src/
  ai/            # Gateway, providers, streaming SSE, http
  artifact/      # parseur de réponses IA → fichiers
  store/         # Zustand (persist, merge, budget, modèles)
  ui/            # App, ProjectSidebar, ChatPanel, CanvasPanel, SettingsDialog, ModelPicker,
                 # DesignSystemPicker, TemplatePicker, CritiqueReportDialog, PreviewDialog, Dialog
  services/      # export HTML/ZIP, coûts, secretStorage (Tauri)
  skills/        # 10 skills + 40 templates (registry)
  designSystem/  # parser DESIGN.md, registry dynamique (import.meta.glob)
  prompts/       # construction du prompt système + injection des skills
  types/, lib/   # types partagés, utilitaires
design-systems/  # 156 design systems (DESIGN.md + tokens)
scripts/         # génération des design systems (maison + import Open Design)
src-tauri/       # backend Rust (store_secret/get_secret/delete_secret, app_data_dir)
```

## Sécurité

- Clés API : Windows Credential Manager en Tauri, localStorage en navigateur — jamais en dur dans le code
- Previews isolées (`sandbox="allow-scripts"`, CSP dans `tauri.conf.json`)
- Snapshot avant chaque génération : une erreur IA ne corrompt jamais un projet
- Design systems/templates/skills importés d'Open Design : attributions Apache-2.0 dans `LICENSES/OPEN-DESIGN.md`

## Licence

- Code : **Apache-2.0** (voir `LICENSE`)
- Contenus adaptés d'Open Design : attributions dans `LICENSES/OPEN-DESIGN.md`
