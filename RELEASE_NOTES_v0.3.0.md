# Open-Cooldesigner v0.3.0

Studio créatif IA **local-first** pour Windows : générer, modifier et exporter des artefacts visuels (landing pages, dashboards, interfaces, présentations web, wireframes, mockups…) sans écrire de code.

## ✨ Nouveautés v0.3.0

### Tweaks « Interactivité & Motion » (panneau Réglages en direct)
- **Interactivité au survol** : 4 niveaux — Désactivée / **Subtile** (élévation douce + ombre) / **Élevée** (élévation marquée + scale) / **Ludique** (rotation + rebond)
- **Tooltips graphiques** (toggle) : survol des barres (SVG/div) et points → tooltip avec la valeur
- `prefers-reduced-motion` respecté (aucune animation si l'utilisateur le demande)

### Corrections & améliorations
- **Thème sombre corrigé** : texte, fond et surfaces correctement surchargés (plus de texte noir sur fond sombre)
- **Migration des anciens réglages** : les artefacts créés avant cette version reçoivent les valeurs par défaut des nouveaux champs
- **Tooltips sans doublon** : les valeurs s'affichent avec leur unité naturelle (70%, 70px)
- **« Tout le projet » sécurisé** : confirmation avant d'écraser les réglages individuels + copie indépendante par artefact
- **Polices réelles** : Inter, Georgia, Playfair… chargées dynamiquement (webfonts) — plus de fallback silencieux

## 📦 Installation

### Prérequis
- **Node.js 18+** pour le développement
- **Rust + MSVC** uniquement pour compiler l'installateur Windows (optionnel)

### Développement
```bash
npm install
npm run dev        # → http://localhost:1420
npm test           # 137 tests Vitest
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
3. Prévisualiser, éditer le code, appliquer les Tweaks (couleurs, polices, thème, **interactivité**)
4. Critiquer l'artefact et Auto-improve
5. Exporter HTML / ZIP

## 📦 Contenu (depuis v0.2.0)
- **156 design systems** (dont 116 importés d'Open Design)
- **40 templates** (dashboard, landing, e-commerce, mobile, wireframe, quiz, WebGL, OKRs…)
- **10 skills** activables (Design Brief, Critic, Web Clone, UI/UX Pro Max…)

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
