# Open-Cooldesigner — Dev Notes

> Notes de développement — ligne directrice et points de reprise.
> Dernière mise à jour : 12 août 2026 (soir) · Version : 0.1.0
> ⚠️ **NOUVEL EMPLACEMENT DU PROJET** : `C:\projets\OpenFox\Xampp\open-cooldesigner`
> (déplacé depuis `C:\projets\OpenFox\open-cooldesigner` ; l'ancien dossier résiduel est une coquille vide verrouillée par OpenFox — à supprimer plus tard)

---

## 0. DERNIER POINT D'ARRÊT (19h — session en cours)

### ✅ Lot 1 — Déplacement du projet (terminé, critères 29-33)
- Jonction `Xampp\open-cooldesigner` supprimée ; contenu copié (robocopy 0 échec, 15 147 fichiers, 273 Mo) puis renommé en `Xampp\open-cooldesigner`
- **97 tests Vitest verts + typecheck + lint OK depuis le nouvel emplacement**
- Ancien dossier `C:\projets\OpenFox\open-cooldesigner` vidé (0 fichier) mais répertoire racine verrouillé par le process OpenFox — coquille vide à supprimer quand le verrou sera levé
- ➡️ **Tout le développement continue dans `C:\projets\OpenFox\Xampp\open-cooldesigner`**

### 🔄 Lot 2 — Design systems Open Design (TERMINÉ, critères 23-28)
État d'avancement :
1. ✅ 40 design systems générés dans `design-systems/<slug>/DESIGN.md` (script `scripts/gen-design-systems.mjs` reproductible)
2. ✅ Parser `src/designSystem/parser.ts` (frontmatter, hex, fonts, espacements → tokensCss + preview HTML)
3. ✅ Registry dynamique `import.meta.glob` (`src/designSystem/registry.ts`) — ajouter un dossier = système dispo
4. ✅ Onglet Design dans Paramètres (recherche, catégories, preview, « Défaut » persisté via `defaultDesignSystemId`)
5. ✅ Sélecteur de création enrichi (recherche + catégories + coche)
6. ✅ LICENSES/OPEN-DESIGN.md mis à jour (40 systèmes « inspired by »)
7. ✅ **114 tests verts** (10 suites, +17 nouveaux), typecheck, lint, build OK — vérifié en réel (recherche, preview, sélection)

---

## 1. État du projet (réalisé)

Application **Tauri 2 + React 18 + TypeScript + Vite** (dossier racine : `C:\projets\OpenFox\Xampp\open-cooldesigner`, sources du cahier des charges : `sources/cdc.md`).

### Cœur applicatif (MVP §77 opérationnel)
- **Projets** : création/ouverture/suppression (avec confirmation), design systems (6), snapshot v1 automatique
- **AI Gateway** : 5 providers — OpenAI, Anthropic, DeepSeek, OpenAI-compatible, Ollama ; streaming SSE ; coûts estimés (AI Cost Center)
- **Chat → génération** : prompt → artefact HTML (parseur de blocs de code) ; erreur IA sans corruption (snapshot avant chaque génération)
- **Canvas** : preview iframe sandboxée (CSP), éditeur Monaco (workers locaux), Select & Ask, **Tweaks** (accent/typo/densité/thème en direct)
- **Versioning** : snapshots, restore, duplicate (branches)
- **Export** : HTML + ZIP

### Gestion des modèles
- Modèles custom (ajout/suppression), **auto-découverte** (Ollama `/api/tags`, OpenAI & compatible `/models`), **test de connexion** (mini-chat cloud / liste locale), alias de modèles, température, budget max projet, retry
- Champ clé API corrigé : visible pour OpenAI/Anthropic/DeepSeek (obligatoire) et OpenAI-compatible (optionnel), caché pour Ollama ; clé **jamais persistée** (Windows Credential Manager en Tauri, mémoire en navigateur)

### Skills & Templates (pipeline qualité automatique)
- **5 skills** : design-brief (spec 8 dimensions), design-critic (notes 5×/10 + Auto-improve), design-refine, tweaks, template-guide
- **13 templates** avec example.html : dashboard, saas-landing, data-report, docs-page, financial-report, invoice, meeting-notes, blog-post, kanban, pricing, waitlist, mobile-app, web-prototype
- Pipeline : brief → spec → template injecté → génération → critique → auto-improve → tweaks
- Suggestion de template par mots-clés dans le chat
- Attribution Apache-2.0 : `../LICENSES/OPEN-DESIGN.md`

### Qualité
- **97 tests Vitest** verts (8 suites), tsc strict, ESLint, build Vite OK
- Installation Windows : scaffold Tauri complet (keyring Credential Manager, icon.ico, NSIS/MSI) — **à compiler** sur une machine avec toolchain Rust/MSVC (`npm run tauri build`)

---

## 2. Ligne de développement (principes directeurs)

1. **Local-first** : tout fonctionne sans compte ; les clés restent sur la machine (BYOK).
2. **IA multi-fournisseurs** : abstraction `AIProvider` + `AIGateway` — jamais de dépendance à un seul fournisseur ; le router peut envoyer chaque tâche au meilleur modèle.
3. **Artefact-centric** : tout est un artefact (fichiers + versions) prévisualisable et exportable.
4. **Skills composables** : le pipeline (avant/pendant/après/en direct) est piloté par des skills activables — étendre = ajouter un skill, pas modifier le cœur.
5. **Qualité par tests** : chaque fonctionnalité livrée avec tests unitaires ; TDD pour les corrections.
6. **Sécurité** : previews sandboxées, clés jamais en clair, aucune erreur IA ne corrompt un projet.

---

## 3. Par où continuer — priorités recommandées

### A. Court terme (finir le MVP 1.5 — CDC §61, 90)
1. **Compiler l'installateur Windows** sur une machine avec Rust/MSVC :
   ```bash
   npm run tauri build   # produit Open-Cooldesigner-Setup-x64.exe + .msi
   ```
   Vérifier : keyring (Credential Manager) fonctionnel, icône, raccourcis, CSP en prod.
2. **Intégration Codex** (Epic 09, OCD-080→085) : détecter la CLI Codex, envoyer une tâche, recevoir les événements, « Continue in Codex » (handoff prototype → projet React/Next).
3. **Exports avancés** : PDF (via sidecar Node ou impression), puis PPTX — arbitrage à trancher (sidecar Node dédié vs Rust).
4. **Screenshot-to-design** : importer une capture → l'IA reproduit l'interface (CDC §32).
5. **AI Design Critic en auto** : déclencher la critique automatiquement après chaque génération si le skill est actif (aujourd'hui : bouton manuel).

### B. Moyen terme (Version 2 — CDC §62)
- **Data Designer** : import CSV/Excel/JSON → dashboards (module Data Report existe déjà comme template ; à transformer en fonctionnalité)
- **Brand Intelligence** : URL/logo/PDF → DESIGN.md + tokens.json + components (base : skill design-brief)
- **Visual editor** : édition directe des composants (Select & Ask amélioré — skill design-refine)
- **Plugin SDK + manifestes** (CDC §39), **serveur MCP** (CDC §41), **workflow automation** (React Flow), **AI Cost Center complet** (budget par projet déjà présent)
- **Branches de design** (déjà partiellement via duplicateVersion), **Inspiration Explorer**

### C. Plus tard (Version 3 — CDC §63)
- Vidéo/motion (HyperFrames), collaboration, cloud sync, marketplace, multi-agents parallèles

---

## 4. Architecture (repères)

```
src/
  ai/          # gateway.ts, providers/ (openai, anthropic, deepseek, openaiCompatible, ollama), http.ts, streaming.ts
  artifact/    # parser.ts (réponse IA → fichiers)
  skills/      # registry.ts (5 skills + 13 templates), designBrief.ts, critique.ts, types.ts
  store/       # appStore.ts (Zustand persist + merge, pipeline, budget, tweaks)
  ui/          # App, ProjectSidebar, ChatPanel, CanvasPanel, SettingsDialog, ModelPicker, AiUsageFooter
  services/    # exportService (HTML/ZIP), costService, secretStorage (Tauri Credential Manager)
  prompts/     # index.ts (BASE_SYSTEM_PROMPT + buildGenerationPrompt)
  designSystem/ registry.ts (6 design systems)
src-tauri/     # lib.rs (store_secret/get_secret/delete_secret/app_data_dir), tauri.conf.json (CSP, NSIS/MSI)
```

## 5. Pièges & décisions à connaître
- **Pas de toolchain Rust** sur la machine de dev actuelle : la couche Tauri est scaffoldée mais non compilée — priorité A.1.
- **localStorage** : un état persisté ancien est migré par le `merge` personnalisé (settings complets, modèle valide) — ne pas casser ce merge.
- **Timeout IA** : 600 s par défaut (modèles de raisonnement locaux lents).
- **Suggestions de templates** : pondération multi-mots ×2 — ajuster `registry.ts` si de faux positifs apparaissent.
- **Licences** : tout contenu repris d'Open Design doit conserver l'attribution dans `LICENSES/OPEN-DESIGN.md` (Apache-2.0).
- **Tests** : `npm test` (Vitest) ; `npm run typecheck` ; `npm run lint` ; `npm run build`.

## 6. Prochaines étapes concrètes (checklist)

### En cours — Lot 2 : Design systems Open Design (critères 23-28)
- [ ] **Créer le script de génération** des DESIGN.md (30+ systèmes, format Open Design) dans `design-systems/<slug>/DESIGN.md` (catégories : IA/LLM, SaaS, Fintech, Enterprise, E-commerce, Éditorial, Minimal, Expressif, Rétro)
- [ ] **Parser DESIGN.md** → couleurs/fonts/espacements (tokensCss + preview), testé sur 3 formats
- [ ] **Registry dynamique** `import.meta.glob` (ajouter un dossier = système dispo), 6 existants conservés
- [ ] **Onglet Design** dans Paramètres (recherche, catégories, preview, sélection persistée)
- [ ] **Sélecteur de création** enrichi (recherche + catégories)
- [ ] **Attribution** LICENSES/OPEN-DESIGN.md mise à jour
- [ ] Tests + typecheck + lint + build verts

### Ensuite (à la reprise, si pas déjà fait)
- [ ] Compiler l'installateur Windows (`npm run tauri build`) — machine avec Rust/MSVC requise
- [ ] Intégration Codex (OCD-080→085)
- [ ] Export PDF
- [ ] Screenshot-to-design
- [ ] Critique automatique post-génération
- [ ] Data Designer (import CSV/Excel/JSON)
- [ ] Brand Intelligence
- [ ] Plugin SDK + MCP
- [ ] Supprimer l'ancienne coquille `C:\projets\OpenFox\open-cooldesigner` (verrou OpenFox levé)
