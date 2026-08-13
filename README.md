# Open-Cooldesigner

Studio créatif IA **local-first** pour Windows : générer, modifier et exporter des artefacts visuels (landing pages, dashboards, interfaces, présentations web) depuis une interface unifiée — sans écrire de code.

> Cahier des charges : `sources/cdc.md` — le projet est un projet indépendant (pas un fork d'Open Design).

## Stack

- **Tauri 2** (Rust) — shell Windows, installateur NSIS/MSI, stockage sécurisé des clés (Windows Credential Manager via `keyring`)
- **React 18 + TypeScript + Vite**
- **Tailwind CSS**, **Zustand** (persistance localStorage), **Monaco Editor** (workers locaux)
- **AI Gateway** multi-fournisseurs : OpenAI, Anthropic, DeepSeek, OpenAI-compatible, Ollama

## Fonctionnalités

- Projets + snapshots (versioning, restauration, duplication)
- Chat → génération d'artefacts HTML → preview sandboxée (iframe + CSP) → édition Monaco → export HTML/ZIP
- Design systems (6), templates (6), Select & Ask, AI Cost Center (budget, coûts estimés)
- Modèles : ajout custom, **auto-découverte** (Ollama `/api/tags`, OpenAI-compatible & OpenAI `/models`), test de connexion (mini-chat), alias, température

## Lancer en développement

```bash
npm install
npm run dev        # → http://localhost:1420 (WebView Tauri : npm run tauri dev)
npm test           # Vitest
npm run typecheck && npm run lint && npm run build
```

## Structure

```
src/
  ai/          # Gateway, providers, streaming SSE, http
  artifact/    # parseur de réponses IA → fichiers
  store/       # Zustand (persist, merge, budget, modèles)
  ui/          # App, ProjectSidebar, ChatPanel, CanvasPanel, SettingsDialog, ModelPicker
  services/    # export HTML/ZIP, coûts, secretStorage (Tauri)
  designSystem/, templates/, prompts/, types/, lib/
src-tauri/     # backend Rust (commandes store_secret/get_secret/delete_secret, app_data_dir)
```

## Sécurité

- Clés API : Windows Credential Manager en Tauri, mémoire en navigateur — jamais persistées
- Previews isolées (`sandbox="allow-scripts"`, CSP dans `tauri.conf.json`)
- Snapshot avant chaque génération : une erreur IA ne corrompt jamais un projet
