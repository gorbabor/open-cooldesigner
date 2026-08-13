# OPEN-COOLDESIGNER

## Cahier des charges fonctionnel et technique

### Application Windows de conception visuelle assistée par IA

**Version :** 0.1 — Spécification initiale
**Date :** 12 août 2026
**Plateforme prioritaire :** Windows 10/11 x64
**Orientation :** Local-first, IA multi-fournisseurs, extensible par skills/plugins

\---

# 1\. SOURCES ANALYSÉES

## 1.1 Source principale

Le lien communiqué était :

`https://github.com/nexu-io/open-designet`

Ce dépôt n'existe pas sous cette forme.

Le dépôt correspondant identifié est :

`nexu-io/open-design`

**Statut : CONFIRMÉ**

Open Design se définit actuellement comme une alternative open source à Claude Design, fonctionnant en priorité en local et proposant une application native Windows et macOS. Il peut exploiter différents agents de programmation et modèles IA.

\---

## 1.2 Deuxième référence fonctionnelle

**Claude Design — Anthropic**

Claude Design permet de générer, à partir d'une conversation avec Claude :

* designs ;
* prototypes interactifs ;
* présentations ;
* one-pagers ;
* autres productions visuelles.

**Statut : CONFIRMÉ**

Claude Design repose notamment sur une interface composée :

* d'un chat à gauche ;
* d'un espace de conception/canvas à droite ;
* d'un système de design pouvant être dérivé d'éléments existants ;
* de mécanismes d'itération conversationnelle.

\---

# 2\. NOM DU PROJET

```text
APP\_NAME = Open-Cooldesigner
```

Le produit décrit dans l'ensemble de ce document sera donc désigné :

# **Open-Cooldesigner**

\---

# 3\. VISION PRODUIT

Open-Cooldesigner doit devenir un **studio de création visuelle assistée par intelligence artificielle fonctionnant principalement sur Windows**, permettant à une personne de passer :

```text
Idée
  ↓
Prompt / Brief
  ↓
Recherche et références
  ↓
Direction artistique
  ↓
Design System
  ↓
Génération
  ↓
Prévisualisation
  ↓
Modification visuelle ou conversationnelle
  ↓
Validation
  ↓
Export
```

L'objectif n'est pas simplement de reproduire Open Design.

Open-Cooldesigner doit combiner :

* les capacités de génération de Claude Design ;
* l'approche ouverte et local-first d'Open Design ;
* une interface visuelle plus accessible ;
* un véritable éditeur ;
* une gestion avancée de projets ;
* plusieurs fournisseurs IA ;
* des workflows automatisables ;
* une architecture extensible ;
* une installation Windows réellement simple.

\---

# 4\. POSITIONNEMENT

Open-Cooldesigner peut être présenté comme :

> \*\*Un studio créatif IA local-first permettant de concevoir, modifier et exporter des interfaces, sites, présentations, documents visuels, dashboards, images, animations et prototypes depuis une interface Windows unifiée.\*\*

L'utilisateur ne devrait pas avoir besoin de maîtriser :

* HTML ;
* CSS ;
* JavaScript ;
* React ;
* Figma ;
* PowerPoint ;
* les CLI ;
* les systèmes de prompts avancés.

L'application doit néanmoins permettre aux utilisateurs avancés d'accéder au code et à l'architecture générés.

\---

# 5\. CAPACITÉS IDENTIFIÉES DANS OPEN DESIGN

## 5.1 Application desktop

**CONFIRMÉ**

Open Design dispose d'une application native desktop destinée notamment à :

* Windows x64 ;
* macOS.

Une version Linux existe également dans une voie de distribution distincte.

### Pour Open-Cooldesigner

**PROPOSÉ**

Windows doit être la plateforme prioritaire du MVP.

\---

# 6\. GÉNÉRATION DE PROTOTYPES

**CONFIRMÉ**

Open Design peut produire des prototypes :

* Web ;
* desktop ;
* mobile.

Les rendus HTML peuvent être visualisés dans une iframe isolée.

### Open-Cooldesigner devra supporter

* landing pages ;
* sites vitrines ;
* dashboards ;
* interfaces administratives ;
* pages e-commerce ;
* applications SaaS ;
* interfaces métier ;
* prototypes desktop ;
* prototypes mobiles ;
* formulaires ;
* pages marketing ;
* portails ;
* écrans applicatifs.

\---

# 7\. DASHBOARDS ET LIVE ARTIFACTS

**CONFIRMÉ**

Open Design propose des dashboards et « live artifacts » avec des paramètres pouvant être modifiés et répercutés sur le rendu.

### Open-Cooldesigner

**PROPOSÉ**

Ajouter un véritable **Data Designer**.

Il permettra :

* import CSV ;
* import Excel ;
* import JSON ;
* connexion API ;
* création de cartes KPI ;
* graphiques ;
* tableaux ;
* filtres ;
* dashboards ;
* rapports.

Exemple :

```text
Importer ventes.xlsx
↓
Analyser automatiquement les colonnes
↓
Proposer 3 dashboards
↓
Choisir "Direction Générale"
↓
Générer dashboard
↓
Modifier par prompt ou visuellement
```

\---

# 8\. PRÉSENTATIONS

**CONFIRMÉ**

Open Design sait produire des présentations et exporter notamment vers :

* HTML ;
* PDF ;
* PPTX.

### Open-Cooldesigner

Prévoir un module :

# Presentation Studio

Il devra générer :

* présentation commerciale ;
* présentation institutionnelle ;
* pitch deck ;
* rapport exécutif ;
* rapport financier ;
* présentation projet ;
* formation ;
* présentation académique.

### Fonction importante

**PROPOSÉ**

L'utilisateur pourra demander :

> « Transforme ce document Word de 40 pages en présentation de 15 slides destinée au comité exécutif. »

\---

# 9\. GÉNÉRATION D'IMAGES

**CONFIRMÉ**

Open Design supporte des workflows de génération d'images et des bibliothèques de prompts.

### Open-Cooldesigner

Créer :

# Image Studio

avec :

* text-to-image ;
* image-to-image ;
* variation ;
* changement de style ;
* suppression d'arrière-plan ;
* upscale ;
* retouche ;
* restauration ;
* modification conversationnelle ;
* création de mockups ;
* assets UI ;
* illustrations marketing.

\---

# 10\. VIDÉO ET MOTION DESIGN

**CONFIRMÉ**

Open Design intègre HyperFrames pour produire des animations HTML/CSS/GSAP convertibles en vidéo MP4.

### Open-Cooldesigner

Créer :

# Motion Studio

avec :

* animation de texte ;
* animation d'interfaces ;
* graphiques animés ;
* logo reveal ;
* trailers ;
* reels ;
* visualisation de données animée ;
* vidéo de démonstration produit.

### Phase ultérieure

Connexion éventuelle à :

* OpenAI ;
* Veo ;
* Kling ;
* Seedance ;
* autres API vidéo.

\---

# 11\. DESIGN SYSTEMS

C'est une fonction stratégique.

## Open Design

**CONFIRMÉ**

Open Design utilise notamment des fichiers `DESIGN.md` servant de contrat de marque et fournit un catalogue important de design systems.

## Claude Design

**CONFIRMÉ**

Claude Design peut analyser :

* code existant ;
* composants ;
* diapositives ;
* documents ;
* logos ;
* couleurs ;
* typographies ;
* références visuelles ;

afin de constituer un système de design réutilisable.

\---

# 12\. FONCTION À AJOUTER : BRAND INTELLIGENCE

**PROPOSÉ — DIFFÉRENCIATEUR IMPORTANT**

Open-Cooldesigner devra proposer un assistant :

# Brand Intelligence

L'utilisateur pourra fournir :

* URL d'un site ;
* logo ;
* captures d'écran ;
* PDF ;
* PowerPoint ;
* images ;
* ancien site ;
* dépôt GitHub.

Open-Cooldesigner déterminera automatiquement :

### Couleurs

* primaire ;
* secondaire ;
* accent ;
* background ;
* texte.

### Typographie

* famille ;
* tailles ;
* poids ;
* hiérarchie.

### Composants

* boutons ;
* cartes ;
* tableaux ;
* formulaires ;
* navigation ;
* alertes ;
* modales.

### Layout

* grilles ;
* espacements ;
* radius ;
* ombres ;
* densité.

Puis créera :

```text
DESIGN.md
tokens.json
tokens.css
components/
assets/
brand-profile.json
```

\---

# 13\. DESIGN SYSTEM MANAGER

Créer un catalogue local :

```text
Design Systems
│
├── Corporate
├── Luxury
├── Fintech
├── Banking
├── Energy
├── Government
├── Medical
├── Education
├── SaaS
├── E-commerce
├── Minimal
├── Futuristic
└── Custom
```

L'utilisateur pourra :

* prévisualiser ;
* dupliquer ;
* modifier ;
* importer ;
* exporter ;
* combiner.

\---

# 14\. AGENTS IA

Open Design utilise différentes CLI installées localement.

**CONFIRMÉ**

La documentation actuelle mentionne notamment :

* Claude Code ;
* Codex ;
* Cursor ;
* OpenCode ;
* Qwen ;
* GitHub Copilot ;
* OpenClaw ;
* plusieurs autres runtimes.

\---

# 15\. OPEN-COOLDESIGNER : MULTI-AGENT

Open-Cooldesigner ne devra pas dépendre d'un seul fournisseur.

Créer une abstraction :

```text
AI Provider Layer
```

capable de piloter :

```text
OpenAI
Anthropic
Google Gemini
DeepSeek
OpenRouter
Ollama
LM Studio
OpenAI-compatible API
Codex CLI
Claude Code
Gemini CLI
OpenCode
Qwen
OpenClaw
```

\---

# 16\. ROUTEUR IA

**PROPOSÉ**

Créer :

# AI Model Router

Chaque tâche pourra être envoyée vers le modèle le plus adapté.

Exemple :

```text
Analyse du brief
→ modèle raisonnement

Code React
→ Codex

Analyse d'image
→ modèle vision

Création image
→ modèle image

Copywriting
→ modèle texte économique
```

L'utilisateur pourra également sélectionner manuellement le modèle.

\---

# 17\. GESTION DES COÛTS IA

Fonction importante absente de nombreux outils.

**PROPOSÉ**

Créer :

# AI Cost Center

Afficher :

* modèle utilisé ;
* tokens input ;
* tokens output ;
* prix estimé ;
* coût du projet ;
* coût de chaque génération ;
* historique des coûts.

Ajouter :

```text
Budget maximum projet : 10 USD
```

L'application pourra avertir :

> Ce traitement est estimé à 1,40 USD.

\---

# 18\. MODE RECOMMANDÉ

## Mode recommandé

# **Local-first hybride**

\---

# 19\. JUSTIFICATION

Le cœur de l'application devrait fonctionner localement :

```text
Windows
   │
   ├── projets
   ├── fichiers
   ├── design systems
   ├── assets
   ├── cache
   ├── historique
   ├── prévisualisation
   └── agents locaux
```

Les appels Internet ne seraient utilisés que lorsque nécessaires.

Cette approche est cohérente avec le principe local-first utilisé par Open Design.

\---

# 20\. FONCTIONS DISPONIBLES HORS LIGNE

Selon les composants installés :

* ouverture d'un projet ;
* édition manuelle ;
* visualisation HTML ;
* gestion des assets ;
* design systems ;
* historique ;
* comparaison des versions ;
* export HTML ;
* certaines conversions ;
* agents locaux ;
* modèles Ollama ;
* modèles LM Studio ;
* génération de code locale.

\---

# 21\. FONCTIONS NÉCESSITANT INTERNET

Selon la configuration :

* OpenAI ;
* Claude API ;
* Gemini ;
* DeepSeek API ;
* OpenRouter ;
* génération cloud d'images ;
* modèles vidéo ;
* recherche Web ;
* GitHub ;
* synchronisation cloud ;
* collaboration distante ;
* marketplace ;
* mises à jour.

\---

# 22\. ALTERNATIVE

Une architecture 100 % cloud serait techniquement possible.

Elle simplifierait :

* collaboration ;
* synchronisation ;
* mises à jour ;
* accès multi-appareils.

Mais elle augmenterait :

* dépendance réseau ;
* coûts d'infrastructure ;
* problématiques de confidentialité ;
* complexité de gestion des fichiers sensibles.

Elle n'est donc pas recommandée comme architecture principale.

\---

# 23\. INTERFACE PRINCIPALE

Je recommande l'organisation suivante :

```text
┌──────────────────────────────────────────────────────────────┐
│ Open-Cooldesigner                              User / Settings│
├──────────────┬──────────────────────────────┬────────────────┤
│              │                              │                │
│ Projects     │                              │  AI Assistant  │
│              │                              │                │
│ Pages        │         CANVAS               │  Chat          │
│              │                              │                │
│ Layers       │                              │  Suggestions   │
│              │                              │                │
│ Assets       │                              │  Actions       │
│              │                              │                │
├──────────────┴──────────────────────────────┴────────────────┤
│ Preview | Code | Console | Versions | AI Usage | Export     │
└──────────────────────────────────────────────────────────────┘
```

\---

# 24\. DEUX MODES D'UTILISATION

Open-Cooldesigner devra combiner :

## Mode conversationnel

Exemple :

> Fais-moi un dashboard moderne de suivi du stock carburant.

## Mode visuel

L'utilisateur clique directement sur :

* texte ;
* image ;
* bouton ;
* carte ;
* graphique ;
* section.

Puis modifie :

* couleur ;
* taille ;
* position ;
* texte ;
* padding ;
* alignement ;
* police.

\---

# 25\. INNOVATION : SELECT \& ASK

**PROPOSÉ**

Lorsqu'un composant est sélectionné :

```text
Clic droit
→ Ask AI
```

Exemple :

> Rends uniquement cette carte plus professionnelle.

L'IA reçoit :

* composant ;
* CSS associé ;
* contexte ;
* design system.

Elle ne modifie que la zone demandée.

\---

# 26\. HISTORIQUE INTELLIGENT

Créer un système :

```text
Version 1
Version 2
Version 3
...
```

Chaque génération crée un snapshot.

Possibilités :

* comparer ;
* restaurer ;
* dupliquer ;
* créer une branche.

\---

# 27\. BRANCHES DE DESIGN

**PROPOSÉ**

Inspiré de Git :

```text
main
│
├── dark-theme
├── corporate
├── minimalist
└── experimental
```

L'utilisateur pourrait dire :

> Crée 3 variantes de ce dashboard sans modifier l'original.

\---

# 28\. COMPARATEUR VISUEL

Créer :

```text
Version A | Version B
```

avec slider avant/après.

L'IA pourra également produire :

```text
Critique A
Critique B
Recommandation
```

\---

# 29\. AI DESIGN CRITIC

**PROPOSÉ**

Après chaque production, un second agent peut analyser :

* contraste ;
* hiérarchie ;
* spacing ;
* cohérence ;
* lisibilité ;
* accessibilité ;
* alignements ;
* densité ;
* responsive ;
* cohérence avec la marque.

Notation possible :

```text
Visual hierarchy      89/100
Consistency           94/100
Accessibility         82/100
Brand compliance      96/100
Responsive            87/100
```

Bouton :

**Auto-improve**

\---

# 30\. RECHERCHE DE RÉFÉRENCES

Fonction recommandée :

# Inspiration Explorer

Prompt :

> Je veux une application de gestion énergétique premium.

Open-Cooldesigner pourra rechercher des références et constituer un moodboard.

Chaque inspiration doit être accompagnée de sa provenance.

\---

# 31\. IMPORTER UN SITE WEB

**PROPOSÉ**

Commande :

```text
Import Website
```

URL :

```text
https://example.com
```

L'application analyse :

* layout ;
* couleurs ;
* composants ;
* responsive ;
* typographie ;
* navigation.

Puis peut :

```text
Reproduire la structure
```

ou :

```text
Créer une nouvelle version inspirée du style
```

La fonction devra respecter les contraintes de droits d'auteur et privilégier l'analyse structurelle et l'inspiration plutôt que la copie non autorisée d'actifs protégés.

\---

# 32\. IMPORTER UNE CAPTURE D'ÉCRAN

Utilisateur :

```text
screenshot.png
```

Puis :

> Reproduis cette interface.

L'application :

1. analyse ;
2. détecte les composants ;
3. reconstitue le layout ;
4. génère le code ;
5. permet l'édition.

\---

# 33\. IMPORTER UNE MAQUETTE

Formats à envisager :

* PNG ;
* JPG ;
* SVG ;
* PDF ;
* PPTX ;
* HTML ;
* ZIP ;
* Markdown.

\---

# 34\. GESTION DE PROJETS

Structure :

```text
Workspace
└── Project
    ├── Brief
    ├── References
    ├── Design System
    ├── Assets
    ├── Artifacts
    ├── Pages
    ├── Versions
    ├── Exports
    └── AI Sessions
```

\---

# 35\. MÉMOIRE PAR PROJET

**PROPOSÉ**

Open-Cooldesigner doit conserver :

* objectifs ;
* public cible ;
* identité visuelle ;
* contraintes ;
* décisions ;
* préférences ;
* composants validés ;
* composants rejetés.

Cela évite de réexpliquer le contexte à chaque génération.

\---

# 36\. TYPES DE PROJETS

Page d'accueil :

```text
New Project

○ Website
○ Web App
○ Desktop App
○ Mobile App
○ Dashboard
○ Presentation
○ Document
○ Image
○ Social Media
○ Motion / Video
○ Data Visualization
○ Custom
```

\---

# 37\. TEMPLATES

Bibliothèque :

```text
Business
Finance
Energy
Medical
Education
Government
SaaS
Corporate
Marketing
E-commerce
Portfolio
Analytics
Mobile
```

\---

# 38\. SKILLS

Open Design utilise une logique de skills composables.

Open-Cooldesigner devra adopter une architecture comparable :

```text
skills/
   landing-page/
      SKILL.md

   dashboard/
      SKILL.md

   presentation/
      SKILL.md

   mobile-ui/
      SKILL.md
```

\---

# 39\. PLUGINS

Architecture recommandée :

```text
plugins/
    figma-import/
    github/
    image-generator/
    excel-dashboard/
    pptx-export/
    pdf-export/
    html-export/
```

Chaque plugin doit disposer d'un manifeste.

Exemple :

```json
{
  "id": "pptx-export",
  "name": "PowerPoint Export",
  "version": "1.0.0",
  "permissions": \[
    "project.read",
    "export.write"
  ]
}
```

\---

# 40\. PLUGIN MARKETPLACE

### Phase ultérieure

Créer un marketplace permettant :

* installer ;
* activer ;
* désactiver ;
* mettre à jour ;
* désinstaller.

Types :

* skills ;
* plugins ;
* themes ;
* design systems ;
* templates ;
* exporters ;
* AI providers.

\---

# 41\. MCP

**PROPOSÉ / FORTEMENT RECOMMANDÉ**

Open-Cooldesigner devra exposer un serveur MCP.

Il permettra à :

* Codex ;
* Claude Code ;
* OpenClaw ;
* Cursor ;
* VS Code ;
* autres agents compatibles

de contrôler Open-Cooldesigner.

Exemples :

```text
create\_project
create\_artifact
render\_artifact
update\_artifact
get\_project
list\_assets
export\_artifact
```

\---

# 42\. INTÉGRATION CODEX

Codex constitue une cible prioritaire.

Flux :

```text
Open-Cooldesigner
      │
      ├── MCP
      │
      ├── CLI
      │
      └── project filesystem
              │
              ▼
             Codex
```

L'utilisateur pourra demander dans Codex :

> Utilise Open-Cooldesigner pour créer le prototype de cette application.

\---

# 43\. HANDOFF VERS CODEX

Fonction stratégique :

# Continue in Codex

Open-Cooldesigner pourra transformer un prototype en projet de développement.

Exemple :

```text
Prototype
   ↓
Continue in Codex
   ↓
Choose stack
   ↓
React / Next / Laravel / etc.
   ↓
Generate implementation plan
   ↓
Open project
```

\---

# 44\. STACK TECHNIQUE RECOMMANDÉ

Après analyse des besoins, je recommande :

## Desktop

# Tauri 2

avec :

# React + TypeScript

\---

# 45\. POURQUOI TAURI

Comparé à Electron :

* exécutable généralement plus léger ;
* meilleure consommation mémoire ;
* backend Rust ;
* bon contrôle du système ;
* très adapté aux applications Windows ;
* WebView natif ;
* accès filesystem contrôlé.

\---

# 46\. FRONTEND

```text
React
TypeScript
Vite
```

\---

# 47\. UI

```text
Tailwind CSS
shadcn/ui
Radix UI
Lucide
```

\---

# 48\. STATE MANAGEMENT

```text
Zustand
```

ou éventuellement :

```text
Redux Toolkit
```

Je recommande Zustand pour le MVP.

\---

# 49\. ÉDITEUR DE CODE

# Monaco Editor

Le même moteur d'édition que VS Code.

Utilisation :

* HTML ;
* CSS ;
* JS ;
* TypeScript ;
* JSON ;
* Markdown.

\---

# 50\. CANVAS / NODE EDITOR

Pour les workflows :

# React Flow

\---

# 51\. PREVIEW

Utiliser :

```text
sandboxed iframe
```

avec contrôle strict :

```text
Content-Security-Policy
sandbox
permissions
```

\---

# 52\. BACKEND LOCAL

Deux options étaient possibles :

### Node.js

ou

### Rust

La présence de Tauri justifie :

# Rust pour les fonctions système

et :

# Node.js sidecar seulement lorsqu'un outil JS l'exige.

\---

# 53\. BASE DE DONNÉES

MVP :

# SQLite

avec éventuellement :

# Drizzle ORM

ou couche Rust SQL.

\---

# 54\. STOCKAGE

```text
%APPDATA%/
   Open-Cooldesigner/
      database/
      projects/
      assets/
      cache/
      models/
      logs/
      extensions/
```

\---

# 55\. MOTEUR IA

Architecture :

```text
AI Gateway
│
├── OpenAI Adapter
├── Anthropic Adapter
├── Gemini Adapter
├── DeepSeek Adapter
├── OpenRouter Adapter
├── Ollama Adapter
├── LM Studio Adapter
└── OpenAI-Compatible Adapter
```

\---

# 56\. GESTION DES SECRETS

Ne jamais enregistrer les clés API en clair.

Windows :

# Windows Credential Manager

ou coffre sécurisé Tauri.

\---

# 57\. SANDBOX

Les artefacts générés ne doivent jamais disposer automatiquement :

* accès disque complet ;
* accès shell ;
* accès réseau ;
* accès secrets ;
* accès fichiers personnels.

Les permissions doivent être explicites.

\---

# 58\. ARCHITECTURE LOGIQUE

```text
┌───────────────────────────────┐
│         Desktop UI            │
│ React + TypeScript            │
└──────────────┬────────────────┘
               │
┌──────────────▼────────────────┐
│ Application Core              │
│ Projects / Artifacts / Assets │
└──────┬────────┬────────┬──────┘
       │        │        │
       ▼        ▼        ▼
 AI Gateway   Renderer   Plugin Engine
       │        │        │
       ▼        ▼        ▼
Models/API    iframe    Extensions
       │
       ▼
 Agent Runtime
 Claude/Codex/Ollama/etc.
```

\---

# 59\. ARCHITECTURE DES PROJETS

```text
project/
│
├── project.json
├── brief.md
├── memory.md
├── DESIGN.md
│
├── assets/
├── references/
│
├── artifacts/
│   ├── dashboard/
│   ├── slides/
│   ├── prototype/
│   └── images/
│
├── versions/
├── exports/
└── .open-cooldesigner/
```

\---

# 60\. MVP

Le MVP ne doit pas essayer de reproduire immédiatement toutes les capacités d'Open Design.

## MVP 1 — indispensable

### Project Manager

* créer projet ;
* ouvrir ;
* supprimer ;
* renommer ;
* sauvegarder.

### AI Chat

* prompt ;
* historique ;
* streaming.

### Providers

* OpenAI ;
* Anthropic ;
* OpenAI-compatible ;
* Ollama.

### Prototype generator

* HTML ;
* CSS ;
* JavaScript.

### Preview

* iframe sécurisé ;
* rafraîchissement.

### Code editor

* Monaco.

### Design systems

* importer ;
* sélectionner ;
* DESIGN.md.

### Versioning

* snapshots.

### Export

* HTML ;
* ZIP.

\---

# 61\. MVP 1.5

Ajouter :

* Codex CLI ;
* Claude Code ;
* GitHub ;
* génération d'images ;
* screenshot-to-design ;
* PDF export ;
* templates ;
* AI Critic.

\---

# 62\. VERSION 2

Ajouter :

* PowerPoint ;
* dashboards ;
* Excel/CSV ;
* Brand Intelligence ;
* visual editor ;
* plugin SDK ;
* MCP ;
* workflow automation.

\---

# 63\. VERSION 3

Ajouter :

* vidéo ;
* collaboration ;
* cloud sync ;
* marketplace ;
* multi-agent parallèle ;
* team workspaces ;
* commentaires ;
* approbations.

\---

# 64\. FONCTIONNALITÉS DIFFÉRENCIATRICES RECOMMANDÉES

Open-Cooldesigner devrait aller au-delà des références avec notamment :

1. **AI Design Critic**
2. **AI Cost Center**
3. **Design Branches**
4. **Compare Designs**
5. **Select \& Ask**
6. **Brand Intelligence**
7. **Data Designer**
8. **Multi-model Router**
9. **Continue in Codex**
10. **Project Memory**
11. **Workflow Builder**
12. **Local AI**
13. **Screenshot-to-design**
14. **Website-to-design**
15. **Design-to-code**
16. **Code-to-design**
17. **Automatic accessibility audit**

\---

# 65\. WORKFLOW AUTOMATION

Créer un éditeur :

```text
Trigger
   ↓
Input
   ↓
AI Analysis
   ↓
Design
   ↓
Critic
   ↓
Correction
   ↓
Export
```

Exemple :

```text
Excel
 ↓
Analyse
 ↓
Dashboard
 ↓
Executive Summary
 ↓
PDF
 ↓
PowerPoint
```

\---

# 66\. AUTONOMOUS DESIGN TEAM

Phase avancée.

Plusieurs agents spécialisés :

```text
Creative Director
       │
 ┌─────┼────────┐
 ▼     ▼        ▼
UX    UI       Copy
 │     │        │
 └─────┼────────┘
       ▼
   QA Critic
       │
       ▼
     Output
```

Cela permettrait à Open-Cooldesigner d'agir comme une petite équipe créative virtuelle.

\---

# 67\. BACKLOG INITIAL POUR CODEX

## Epic 01 — Foundation

### OCD-001

Créer monorepo.

### OCD-002

Configurer Tauri 2.

### OCD-003

Configurer React + TypeScript.

### OCD-004

Configurer Tailwind.

### OCD-005

Configurer shadcn/ui.

### OCD-006

Créer navigation desktop.

\---

# 68\. EPIC 02 — PROJECTS

### OCD-010

Créer modèle Project.

### OCD-011

Créer projet.

### OCD-012

Ouvrir projet.

### OCD-013

Sauvegarder projet.

### OCD-014

Supprimer projet.

### OCD-015

Créer gestionnaire de fichiers.

\---

# 69\. EPIC 03 — AI

### OCD-020

Créer interface `AIProvider`.

### OCD-021

OpenAI adapter.

### OCD-022

Anthropic adapter.

### OCD-023

OpenAI-compatible adapter.

### OCD-024

Ollama adapter.

### OCD-025

Streaming.

### OCD-026

Secure API key storage.

\---

# 70\. EPIC 04 — ARTIFACTS

### OCD-030

Artifact model.

### OCD-031

HTML generator.

### OCD-032

Artifact parser.

### OCD-033

Artifact storage.

### OCD-034

Artifact preview.

### OCD-035

Refresh automatique.

\---

# 71\. EPIC 05 — EDITOR

### OCD-040

Monaco integration.

### OCD-041

HTML editor.

### OCD-042

CSS editor.

### OCD-043

JavaScript editor.

### OCD-044

Synchronisation code/preview.

\---

# 72\. EPIC 06 — DESIGN SYSTEM

### OCD-050

`DESIGN.md` parser.

### OCD-051

Design system registry.

### OCD-052

Design system selector.

### OCD-053

Design system preview.

### OCD-054

Custom design system.

\---

# 73\. EPIC 07 — VERSIONING

### OCD-060

Snapshot.

### OCD-061

Version list.

### OCD-062

Restore.

### OCD-063

Duplicate.

### OCD-064

Compare.

\---

# 74\. EPIC 08 — EXPORT

### OCD-070

HTML export.

### OCD-071

ZIP export.

### OCD-072

Asset bundling.

\---

# 75\. EPIC 09 — CODEX

### OCD-080

Détecter Codex.

### OCD-081

Configurer Codex.

### OCD-082

Envoyer task Codex.

### OCD-083

Recevoir événements.

### OCD-084

Afficher logs.

### OCD-085

Continue in Codex.

\---

# 76\. TESTS

Chaque ticket doit comporter :

* critères d'acceptation ;
* tests unitaires ;
* tests d'intégration lorsque pertinents ;
* erreurs prévues ;
* comportement hors ligne.

\---

# 77\. CRITÈRE MVP MAJEUR

Le scénario suivant doit fonctionner entièrement :

```text
1. Installer Open-Cooldesigner.exe
2. Lancer l'application
3. Créer projet
4. Choisir OpenAI / Ollama
5. Sélectionner Design System
6. Écrire :

   "Crée un dashboard de suivi commercial"

7. Générer
8. Voir immédiatement le résultat
9. Modifier :

   "Change les KPI et rends les cartes plus modernes"

10. Visualiser la nouvelle version
11. Comparer version précédente
12. Modifier le code manuellement
13. Exporter en HTML/ZIP
```

Si ce parcours fonctionne de façon stable, le premier MVP est viable.

\---

# 78\. DISTRIBUTION WINDOWS

Open-Cooldesigner devra produire :

```text
Open-Cooldesigner-Setup-x64.exe
```

et éventuellement :

```text
Open-Cooldesigner-x64.msi
```

L'installation doit :

* créer les dossiers nécessaires ;
* enregistrer l'application ;
* ajouter un raccourci ;
* installer/détecter les dépendances ;
* proposer les intégrations IA ;
* ne pas nécessiter Node.js pour l'utilisateur final.

\---

# 79\. AUTO UPDATE

Prévoir dès l'architecture initiale :

```text
Update Service
```

avec :

* vérification nouvelle version ;
* notes de version ;
* téléchargement ;
* vérification signature ;
* installation.

\---

# 80\. OBSERVABILITÉ

Localement :

```text
logs/
```

avec :

* application ;
* AI ;
* renderer ;
* plugin ;
* export ;
* crash.

Bouton :

**Export diagnostic report**

\---

# 81\. SÉCURITÉ

Minimum requis :

* isolation des previews ;
* CSP ;
* gestion sécurisée des clés ;
* validation des plugins ;
* validation des chemins ;
* protection path traversal ;
* validation des URL ;
* limitations subprocess ;
* permissions de fichiers ;
* contrôle réseau ;
* journalisation.

\---

# 82\. LICENCES

Open Design utilise une licence Apache-2.0 et certains composants intégrés conservent leurs licences propres.

Avant de reprendre directement du code :

* identifier chaque licence ;
* conserver les attributions nécessaires ;
* vérifier les sous-modules et composants tiers ;
* distinguer inspiration fonctionnelle et réutilisation directe de code.

\---

# 83\. CE QU'IL NE FAUT PAS FAIRE

Open-Cooldesigner ne doit pas devenir au départ :

* un clone complet de Figma ;
* un IDE généraliste ;
* un Photoshop complet ;
* un logiciel de montage vidéo complet ;
* une plateforme cloud complexe.

Le cœur du produit doit rester :

> \*\*Prompt → Design → Preview → Iterate → Edit → Export\*\*

\---

# 84\. DIFFÉRENCE STRATÉGIQUE AVEC OPEN DESIGN

Open Design fournit déjà une base extrêmement riche, notamment agents locaux, plugins, design systems, prototypes, présentations, images et vidéo.

Open-Cooldesigner doit donc éviter une simple copie.

Son différenciateur devrait être :

### 1\. Plus simple

Pensé d'abord pour les utilisateurs Windows non-développeurs.

### 2\. Plus visuel

Édition directe des composants.

### 3\. Plus orienté documents professionnels

Dashboards, rapports, PowerPoint et données.

### 4\. Plus transparent sur l'IA

Modèles, coûts et tâches visibles.

### 5\. Plus intégré à Codex

Passage immédiat de prototype vers application.

### 6\. Plus automatisable

Workflows visuels.

### 7\. Plus intelligent sur la marque

Brand Intelligence.

\---

# 85\. CLAUDE DESIGN : CE QU'IL FAUT RETENIR

Claude Design confirme la pertinence de plusieurs concepts importants pour Open-Cooldesigner :

**CONFIRMÉ**

* interaction conversationnelle ;
* canvas de création ;
* prototypes interactifs ;
* présentations ;
* contexte visuel ;
* design system organisationnel ;
* import de références ;
* itérations conversationnelles.

Claude permet par ailleurs la création et l'édition d'artifacts avec gestion de versions et téléchargement de fichiers, ce qui valide l'intérêt d'un workflow artifact-centric.

\---

# 86\. ARCHITECTURE RECOMMANDÉE FINALE

```text
                 OPEN-COOLDESIGNER

┌─────────────────────────────────────────────┐
│               TAURI DESKTOP                 │
│                                             │
│ React + TypeScript                          │
│ Tailwind + shadcn                           │
│ Monaco                                      │
│ React Flow                                  │
└──────────────────────┬──────────────────────┘
                       │
             ┌─────────▼─────────┐
             │ Application Core  │
             └─────────┬─────────┘
                       │
 ┌─────────────┬───────┼───────────┬─────────────┐
 │             │       │           │             │
 ▼             ▼       ▼           ▼             ▼

Projects    AI Gateway Renderer   Plugins      Exports
 │             │       │           │             │
SQLite         │     iframe       SDK       HTML/PDF/PPTX
               │
       ┌───────┼────────────┐
       ▼       ▼            ▼
     Cloud   Local         CLI
     APIs    Models        Agents
       │       │            │
 OpenAI      Ollama        Codex
 Claude      LM Studio     Claude Code
 Gemini                    OpenClaw
 DeepSeek
```

\---

# 87\. RECOMMANDATION TECHNOLOGIQUE

## Stack retenu

**Desktop**

* Tauri 2
* Rust

**Frontend**

* React
* TypeScript
* Vite

**UI**

* Tailwind CSS
* shadcn/ui
* Radix UI

**Editor**

* Monaco Editor

**State**

* Zustand

**Workflow**

* React Flow

**Database**

* SQLite

**AI**

* Provider abstraction
* OpenAI
* Anthropic
* Gemini
* DeepSeek
* OpenRouter
* Ollama
* OpenAI-compatible

**Agent integration**

* Codex
* Claude Code
* OpenClaw
* autres CLI

**Interop**

* MCP

**Packaging**

* Tauri Windows Installer

\---

# 88\. DÉCISION D'ARCHITECTURE

Je ne recommande **pas de partir d'un fork direct d'Open Design comme architecture définitive d'Open-Cooldesigner**.

Je recommande :

```text
Étudier Open Design
        ↓
Réutiliser les principes pertinents
        ↓
Réutiliser uniquement les composants juridiquement et techniquement appropriés
        ↓
Créer une architecture Open-Cooldesigner indépendante
```

Cela permet :

* de garder le contrôle du produit ;
* de simplifier l'interface ;
* d'éviter d'hériter d'une grande quantité de complexité ;
* de choisir les fonctionnalités réellement nécessaires ;
* d'intégrer Codex comme composant de premier ordre ;
* de développer plus facilement les fonctions spécifiques à Open-Cooldesigner.

\---

# 89\. ORDRE DE DÉVELOPPEMENT RECOMMANDÉ POUR CODEX

```text
PHASE 0
Architecture + repository

PHASE 1
Windows shell

PHASE 2
Projects

PHASE 3
AI Gateway

PHASE 4
Chat

PHASE 5
Artifact generation

PHASE 6
Preview

PHASE 7
Code editor

PHASE 8
Design systems

PHASE 9
Versioning

PHASE 10
Export

PHASE 11
Codex integration

PHASE 12
Installer Windows

PHASE 13
Tests

PHASE 14
MVP Release
```

\---

# 90\. BRIEF MAÎTRE POUR CODEX

## Mission

Développer progressivement une application Windows appelée **Open-Cooldesigner**.

Open-Cooldesigner est un studio de création visuelle assistée par IA, local-first, capable de transformer un brief utilisateur en artefacts visuels modifiables, prévisualisables et exportables.

Le produit doit initialement supporter principalement :

* prototypes Web ;
* dashboards ;
* interfaces applicatives ;
* landing pages.

## Stack imposé pour le MVP

```text
Tauri 2
Rust
React
TypeScript
Vite
Tailwind CSS
shadcn/ui
Zustand
Monaco Editor
SQLite
```

## Principes

1. Architecture modulaire.
2. Windows prioritaire.
3. Local-first.
4. Aucun modèle IA imposé.
5. AI providers interchangeables.
6. Sécurité des clés.
7. Artefacts isolés.
8. Chaque fonctionnalité testable.
9. Pas de dépendances inutiles.
10. Pas de fonctionnalités fictives.

## Règle de développement

Ne jamais tenter de développer l'application entière en une seule tâche.

Pour chaque fonctionnalité :

```text
Analyse
↓
Specification
↓
Implementation
↓
Tests
↓
Validation
↓
Commit
```

## Première milestone

Produire une application Windows permettant :

```text
Create Project
      ↓
Enter prompt
      ↓
Call AI
      ↓
Receive HTML
      ↓
Preview
      ↓
Edit code
      ↓
Save
      ↓
Export HTML
```

Tant que cette chaîne n'est pas parfaitement opérationnelle, ne pas commencer les fonctionnalités avancées.

\---

# 91\. CRITÈRES DE SUCCÈS DU MVP

Open-Cooldesigner MVP sera considéré exploitable lorsque :

* l'application s'installe sur Windows ;
* elle démarre sans environnement de développement ;
* un projet peut être créé ;
* un provider IA peut être configuré ;
* un prompt peut être envoyé ;
* un prototype peut être produit ;
* le résultat est visualisé ;
* le résultat est modifiable ;
* plusieurs versions sont conservées ;
* le projet peut être rouvert ;
* l'artefact peut être exporté ;
* les clés API restent protégées ;
* une erreur IA ne détruit pas le projet.

\---

# 92\. CONCLUSION

L'analyse des références montre qu'il ne faut pas concevoir **Open-Cooldesigner** comme un simple générateur de pages Web.

La catégorie de produit est devenue beaucoup plus large : Claude Design propose une expérience conversationnelle de création visuelle et de prototypes, tandis qu'Open Design démontre qu'une architecture ouverte, local-first, multi-agent, avec design systems, plugins et multiples formats d'artefacts est réalisable.

La meilleure orientation pour **Open-Cooldesigner** est donc :

> \*\*un studio créatif IA Windows local-first, multi-modèles, capable de générer, comprendre, modifier et exporter des créations visuelles, tout en permettant de poursuivre leur développement directement avec Codex.\*\*

L'élément central ne sera pas seulement le **canvas**, mais la combinaison :

```text
PROJECT
+
AI
+
DESIGN SYSTEM
+
ARTIFACT
+
VISUAL EDITOR
+
CODE
+
VERSIONING
+
CODEX
+
EXPORT
```

Cette architecture crée une base suffisamment simple pour construire un MVP réaliste tout en permettant, progressivement, de faire évoluer Open-Cooldesigner vers une véritable plateforme de conception et de production assistée par IA.

