# Open-Cooldesigner v0.4.0

Studio créatif IA **local-first** pour Windows : générer, modifier et exporter des artefacts visuels (landing pages, dashboards, interfaces, présentations web, wireframes, mockups…) sans écrire de code.

## ✨ Nouveautés v0.4.0

### Export avec Tweaks
- **Export HTML / ZIP / « Ouvrir dans le navigateur »** : les réglages Tweaks (couleurs, police, thème, radius, interactivité au survol, tooltips graphiques) sont maintenant **inclus dans les fichiers exportés** — le rendu final correspond exactement à la preview
- **Injection intelligente** : si l'artefact n'a jamais été tweaké, l'export reste le **code brut** (pas de bloc ajouté) ; dès qu'un réglage est modifié, il est embarqué
- **ZIP autonome** : `index.html` injecté avec les tweaks, `styles.css` / `script.js` conservés bruts
- **Module partagé** (`src/lib/tweakInjection.ts`) : une seule source de vérité pour la preview, l'export et l'ouverture navigateur

### Corrections
- `exportHtml` ne reconstruit plus le blob deux fois (perf)
- Fichier orphelin `sources/documentation-kami.html` supprimé (hygiène repo)

## 📦 Installation

### Prérequis
- **Node.js 18+** pour le développement
- **Rust + MSVC** uniquement pour compiler l'installateur Windows (optionnel)

### Développement
```bash
npm install
npm run dev        # → http://localhost:1420
npm test           # 140 tests Vitest
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
1. Créer un projet (choisir un design system parmi 156)
2. Décrire le design dans le chat (« Crée un dashboard de suivi commercial »)
3. Prévisualiser, éditer le code, appliquer les Tweaks (couleurs, polices, thème, interactivité)
4. Critiquer l'artefact et Auto-improve
5. Exporter HTML / ZIP — **avec les tweaks appliqués**

## 📦 Contenu
- **156 design systems** (dont 116 importés d'Open Design)
- **40 templates** (dashboard, landing, e-commerce, mobile, wireframe, quiz, WebGL, OKRs…)
- **10 skills** activables (Design Brief, Critic, Web Clone, UI/UX Pro Max…)
- **Tweaks** : couleurs (4), palettes rapides, polices webfont, thème clair/sombre/système, radius, densité, typo, **interactivité au survol** (4 niveaux), **tooltips graphiques**

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
