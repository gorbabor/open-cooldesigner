# Open-Cooldesigner v0.2.0

Studio créatif IA **local-first** pour Windows : générer, modifier et exporter des artefacts visuels (landing pages, dashboards, interfaces, présentations web, wireframes, mockups…) sans écrire de code.

## ✨ Nouveautés v0.2.0

### Design systems — 156 disponibles (+116)
- **116 nouveaux design systems importés d'Open Design** : Apple, GitHub, Discord, Spotify, Uber, Tesla, Figma, Supabase, Nvidia, IBM, Playstation, BMW, Spacex, Duolingo… (script `scripts/gen-design-systems-open-design.mjs` reproductible)
- **Sélecteur en modal grand format** : grille de cartes avec vignettes, recherche, filtres par catégorie, compteur, preview en quasi plein écran (~90vw × 95vh), bouton « Défaut » par carte
- Badge **« importé »** pour distinguer les systèmes importés (palette + typographie)

### Templates — 40 disponibles (+10)
- wireframe-annotated, mobile-onboarding, social-carousel, email-marketing, contact-widget, image-poster, webgl-experience (Three.js via CDN), live-dashboard, github-dashboard, team-okrs
- **TemplatePicker** dans le pied du chat : recherche, preview en modal, option « Aucun template »

### Skills — 10 disponibles (+5, tous câblés)
- web-clone, design-md, ui-ux-pro-max, creative-director, impeccable-design-polish
- Les skills actifs sont **injectés dans le prompt de génération** (effet réel)

### UI/UX
- **Critique IA en modal** : 5 scores /10 colorés, Conserver/Corriger/Gains rapides, Auto-improve, « Critiquer à nouveau »
- **Preview grand format** pour les design systems et templates (90vw × 95vh, Dialog partagé)
- **Ancres corrigées** : les menus de la démo scrollent au lieu de naviguer (compatible sandbox)
- **Bandeau d'erreur JS** dans la preview (plus de page blanche muette)
- Bouton **« Ouvrir dans le navigateur »** (menus/JS pleinement fonctionnels)
- **Clé API permanente** : bouton « Enregistrer » + indicateur (Credential Manager en Tauri, localStorage en navigateur)

## 📦 Installation

### Prérequis
- **Node.js 18+** pour le développement
- **Rust + MSVC** uniquement pour compiler l'installateur Windows (optionnel)

### Développement
```bash
npm install
npm run dev        # → http://localhost:1420
npm test           # 136 tests Vitest
npm run typecheck && npm run lint && npm run build
```

### Installateur Windows
```bash
npm run tauri build   # Open-Cooldesigner-Setup-x64.exe + .msi (nécessite toolchain Rust/MSVC)
```

### Configuration IA
1. **Paramètres → Fournisseur** : choisir OpenAI / Anthropic / DeepSeek / OpenAI-compatible / Ollama
2. Saisir la clé API → **« Enregistrer »** (permanente)
3. Choisir le modèle, tester la connexion, régler la température

## 🚀 Utilisation
1. Créer un projet (choisir un design system)
2. Décrire le design dans le chat (« Crée un dashboard de suivi commercial »)
3. Prévisualiser, éditer le code, appliquer les Tweaks
4. Critiquer l'artefact et Auto-improve
5. Exporter HTML / ZIP

## 🔒 Sécurité
- Clés API jamais en dur dans le code (Credential Manager / localStorage)
- Previews sandboxées (`allow-scripts`, CSP)
- Snapshot avant chaque génération (aucune corruption)

## 📄 Licence
- **Apache-2.0** (`LICENSE`)
- Contenus adaptés d'Open Design : `LICENSES/OPEN-DESIGN.md`

## 🔗 Liens
- Repository : https://github.com/gorbabor/open-cooldesigner
- Documentation : [README.md](https://github.com/gorbabor/open-cooldesigner/blob/main/README.md)
