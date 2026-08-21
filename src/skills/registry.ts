import type { Skill, Template } from "./types";

export const SKILLS: Skill[] = [
  {
    manifest: {
      id: "design-brief",
      name: "Design Brief",
      version: "1.0.0",
      description:
        "Analyse le brief en 8 dimensions (palette, accent, typographie, display, layout, mood, densité, contraintes) et génère une spec concrète injectée dans le prompt de génération.",
      triggers: [],
      stage: "before",
      license: "Apache-2.0 (adapté de nexu-io/open-design example-design-brief)",
    },
    skillMd: `# Design Brief Skill

Avant chaque génération, analyse le prompt utilisateur et résous 8 dimensions :
palette, accent, typography, display, layout, mood, density, exclude.

1. Mappe les mots-clés du langage naturel vers des valeurs symboliques
   (ex: "sombre" → monochrome_dark, "minimal" → professional_minimal).
2. Complète les dimensions non spécifiées avec des défauts sûrs.
3. Résous les valeurs symboliques en tokens concrets (couleurs, polices, espacements).
4. Produis la section DESIGN SPEC du prompt avec les tokens résolus.
5. N'invente jamais de valeur hors de la table de résolution.`,
  },
  {
    manifest: {
      id: "design-critic",
      name: "Design Critic",
      version: "1.0.0",
      description:
        "Après génération, note l'artefact sur 5 dimensions (0-10) et produit un rapport Conserver/Corriger/Gains rapides. Permet l'Auto-improve.",
      triggers: ["critique", "critiquer", "évaluer", "review", "audit"],
      stage: "after",
      license: "Apache-2.0 (adapté de nexu-io/open-design example critique)",
    },
    skillMd: `# Design Critic Skill

Après chaque génération d'artefact :
1. Analyse l'artefact HTML sur 5 dimensions : Philosophie, Hiérarchie visuelle,
   Détails & finitions, Fonctionnalité, Innovation — chacune notée /10.
2. Produis un rapport structuré : CONSERVER (3 points forts),
   CORRIGER (3 problèmes principaux), GAINS RAPIDES (3 corrections).
3. Sur demande, régénère l'artefact en intégrant toutes les corrections.`,
  },
  {
    manifest: {
      id: "design-refine",
      name: "Design Refine",
      version: "1.0.0",
      description:
        "Modification ciblée d'un composant sélectionné : l'IA reçoit le composant, son contexte et le design system, et ne modifie que la zone demandée.",
      triggers: ["refine", "modifie", "améliore", "améliore ce"],
      stage: "on-demand",
      license: "Apache-2.0 (adapté de nexu-io/open-design od-design-refine)",
    },
    skillMd: `# Design Refine Skill

Pour une modification ciblée :
1. Reçois le composant sélectionné, son contexte (CSS associé) et le design system.
2. Ne modifie QUE la zone demandée — conserve tout le reste strictement identique.
3. Réponds avec le fichier complet modifié dans un bloc de code.
4. Respecte le design system fourni.`,
  },
  {
    manifest: {
      id: "tweaks",
      name: "Tweaks",
      version: "1.0.0",
      description:
        "Panneau live de réglage : accent, échelle typographique, densité, thème clair/sombre appliqués via variables CSS, sans génération IA.",
      triggers: [],
      stage: "live",
      license: "Apache-2.0 (adapté de nexu-io/open-design example tweaks)",
    },
    skillMd: `# Tweaks Skill

Fournit un panneau de réglage en direct appliqué via CSS custom properties :
- accent : couleur d'accent (remplace --accent)
- typeScale : échelle typographique (multiplicateur des tailles)
- density : espacement de section (compact/balanced/spacious)
- theme : clair/sombre (inverse les couleurs de fond/texte)
Les modifications sont injectées dans la preview et persistées dans le projet.`,
  },
  {
    manifest: {
      id: "template-guide",
      name: "Template Guide",
      version: "1.0.0",
      description:
        "Injecte le SKILL.md et l'example.html du template sélectionné dans le prompt de génération pour guider la structure de l'artefact.",
      triggers: [],
      stage: "during",
      license: "Apache-2.0 (concept nexu-io/open-design templates)",
    },
    skillMd: `# Template Guide Skill

Quand un template est sélectionné :
1. Charge le SKILL.md du template : il définit la structure attendue
   (sections, composants, layout) et les mots-clés déclencheurs.
2. Utilise l'example.html comme référence structurelle (pas de copie littérale).
3. Injecte ces consignes dans le prompt système de génération.`,
  },
  {
    manifest: {
      id: "web-clone",
      name: "Web Clone",
      version: "1.0.0",
      description:
        "Guide la reproduction fidèle de la structure et du style d'un site existant décrit par l'utilisateur, sans jamais copier le contenu réel.",
      triggers: ["clone", "reproduction", "comme le site", "même style que", "refaire le site"],
      stage: "before",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Web Clone Skill

Quand l'utilisateur demande de cloner/reproduire un site (nom, URL ou description) :
1. Identifie les caractéristiques visuelles clés à reproduire : layout général,
   palette, typographie, composants (nav, hero, grilles, footer).
2. Ne copie JAMAIS le contenu textuel réel : utilise du texte de démonstration.
3. N'accède jamais au réseau : se base uniquement sur la description.
4. Produit une reproduction structurelle fidèle (même squelette, même ambiance),
   pas une copie littérale.`,
  },
  {
    manifest: {
      id: "design-md",
      name: "Design MD",
      version: "1.0.0",
      description:
        "Génère un DESIGN.md complet (palette, typographie, composants) à partir d'un brief ou d'une marque, injecté dans les générations.",
      triggers: ["design system", "design.md", "créer un design system", "tokens", "charte graphique"],
      stage: "before",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Design MD Skill

Quand l'utilisateur demande un design system ou une charte :
1. Analyse le brief/marque et résous : palette (canvas, surface, texte, accent),
   typographies (display, body), radius, espacements, densité.
2. Produis une spec DESIGN.md structurée (sections 1-9 du format Open Design).
3. Tous les tokens doivent être concrets (hex, familles, px) — jamais vagues.
4. Le DESIGN.md généré devient la référence des générations suivantes.`,
  },
  {
    manifest: {
      id: "ui-ux-pro-max",
      name: "UI/UX Pro Max",
      version: "1.0.0",
      description:
        "Checklist de qualité UI/UX appliquée à chaque génération : hiérarchie, accessibilité, états, responsive, cohérence.",
      triggers: ["ui ux", "qualité ui", "bonnes pratiques", "accessibilité", "checklist"],
      stage: "during",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# UI/UX Pro Max Skill

À chaque génération, applique cette checklist :
1. Hiérarchie : un seul titre principal, sous-titres ordonnés, espacement cohérent.
2. Accessibilité : contrastes WCAG AA, labels de formulaire, aria sur les interactifs.
3. États : hover, focus visible, disabled, erreurs pour chaque composant interactif.
4. Responsive : grilles fluides, breakpoints, cibles tactiles ≥ 44px.
5. Cohérence : palette et typographie issues du design system, jamais inventées.
Corrige tout écart AVANT de rendre le code.`,
  },
  {
    manifest: {
      id: "creative-director",
      name: "Creative Director",
      version: "1.0.0",
      description:
        "Direction artistique : élève le brief en une intention créative forte (concept, ambiance, signature visuelle).",
      triggers: ["direction artistique", "concept créatif", "signature visuelle", "ambiance", "plus créatif"],
      stage: "before",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Creative Director Skill

Avant la génération :
1. Formule une intention créative en une phrase (ex. « un espace calme et
   éditorial où le produit est la star »).
2. Déduis-en des choix concrets : ambiance (lumière, densité, rythme),
   traitement typographique (display fort vs discret), micro-détails signatures.
3. Intègre ces choix dans la spec de génération SANS déroger aux tokens
   du design system (couleurs, fonts) — la créativité porte sur la mise en
   scène, pas sur la palette.`,
  },
  {
    manifest: {
      id: "impeccable-design-polish",
      name: "Impeccable Polish",
      version: "1.0.0",
      description:
        "Finitions : alignements parfaits, micro-interactions, états soignés, zéro détail approximatif.",
      triggers: ["finitions", "polish", "soigné", "détails", "perfection", "alignements"],
      stage: "during",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Impeccable Design Polish Skill

Passe finale avant de rendre le code :
1. Alignements : grille respectée, espacements multiples du scale, pas de 17px ou 23px arbitraires.
2. Micro-interactions : transitions 150ms sur hover/focus, courbes cohérentes.
3. États complets : normal, hover, focus, active, disabled, vide, chargement.
4. Zéro défaut : pas de texte tronqué, pas d'overflow accidentel, pas de contraste raté.
5. L'artefact doit passer un examen « loupe » : chaque pixel est intentionnel.`,
  },
];

export const TEMPLATES: Template[] = [
  {
    manifest: {
      id: "dashboard",
      name: "Tableau de bord",
      version: "1.0.0",
      description: "Dashboard admin/analytique : sidebar, KPI, graphiques.",
      triggers: ["dashboard", "tableau de bord", "admin", "analytique", "kpi"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example dashboard)",
    },
    skillMd: `# Dashboard Template
Structure attendue : barre latérale gauche fixe, barre supérieure (recherche, utilisateur), grille de cartes KPI, graphiques (barres/lignes), tableau de données.
Données de démonstration réalistes. Responsive.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;display:grid;grid-template-columns:220px 1fr;min-height:100vh}.side{background:#0f172a;color:#e2e8f0;padding:1rem}.side a{display:block;color:#94a3b8;padding:.5rem;text-decoration:none}.main{padding:1.5rem}.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem}.kpi{border:1px solid #e2e8f0;border-radius:10px;padding:1rem}.kpi b{font-size:1.5rem}.charts{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem}.chart{border:1px solid #e2e8f0;border-radius:10px;padding:1rem;min-height:180px}table{width:100%;border-collapse:collapse;margin-top:1rem}th,td{border-bottom:1px solid #e2e8f0;padding:.5rem;text-align:left}</style></head><body><aside class="side"><h3>Vue d'ensemble</h3><a href="#">Accueil</a><a href="#">Analyse</a><a href="#">Clients</a><a href="#">Paramètres</a></aside><main class="main"><h1>Tableau de bord</h1><div class="kpis"><div class="kpi"><span>Revenus</span><br><b>€2,5M</b><br><small>+12%</small></div><div class="kpi"><span>Utilisateurs</span><br><b>580</b><br><small>+8%</small></div><div class="kpi"><span>Conversion</span><br><b>4,2%</b><br><small>-2%</small></div></div><div class="charts"><div class="chart"><h3>Évolution mensuelle</h3></div><div class="chart"><h3>Distribution</h3></div></div><table><thead><tr><th>Client</th><th>Vente</th><th>Date</th></tr></thead><tbody><tr><td>Client A</td><td>€1200</td><td>2026-08-01</td></tr><tr><td>Client B</td><td>€950</td><td>2026-08-02</td></tr></tbody></table></main></body></html>`,
  },
  {
    manifest: {
      id: "saas-landing",
      name: "Landing SaaS",
      version: "1.0.0",
      description: "Page d'accueil SaaS : hero, fonctionnalités, preuve sociale, tarifs, CTA.",
      triggers: ["saas", "landing", "marketing page", "produit", "accueil"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example saas-landing)",
    },
    skillMd: `# SaaS Landing Template
Structure : nav sticky, hero (titre + sous-titre + CTA), section fonctionnalités (grille), preuve sociale (logos/témoignages), section tarifs (3 colonnes), footer.
Respecte les tokens du DESIGN.md actif.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;color:#0f172a}header{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;border-bottom:1px solid #e2e8f0}.hero{text-align:center;padding:5rem 2rem}.hero h1{font-size:2.75rem;margin:0 0 1rem}.cta{display:inline-block;background:#4f46e5;color:#fff;padding:.75rem 1.5rem;border-radius:8px;text-decoration:none}.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.5rem;padding:3rem 2rem}.feature{border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem}.pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;padding:3rem 2rem;max-width:900px;margin:auto}.plan{border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;text-align:center}footer{text-align:center;padding:2rem;color:#64748b}</style></head><body><header><b>Acme SaaS</b><nav><a href="#" style="margin-left:1rem">Fonctionnalités</a><a href="#" style="margin-left:1rem">Tarifs</a></nav></header><section class="hero"><h1>La plateforme qui accélère votre équipe</h1><p style="color:#64748b">Automatisez, collaborez, livrez.</p><a class="cta" href="#">Essai gratuit</a></section><section class="features"><div class="feature"><h3>Automatisation</h3><p>Gagnez des heures chaque semaine.</p></div><div class="feature"><h3>Collaboration</h3><p>Toute l'équipe au même endroit.</p></div><div class="feature"><h3>Analytics</h3><p>Des décisions basées sur les données.</p></div></section><section class="pricing"><div class="plan"><h3>Starter</h3><p>19€/mois</p></div><div class="plan"><h3>Pro</h3><p>49€/mois</p></div><div class="plan"><h3>Entreprise</h3><p>Sur devis</p></div></section><footer>© 2026 Acme SaaS</footer></body></html>`,
  },
  {
    manifest: {
      id: "data-report",
      name: "Rapport de données",
      version: "1.0.0",
      description: "Transforme des données (CSV/Excel/JSON) en page de rapport visuelle.",
      triggers: ["rapport", "report", "data", "données", "csv", "excel", "json"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example data-report)",
    },
    skillMd: `# Data Report Template
Structure : en-tête KPI (4 cartes), graphique principal, tableau de données, points clés.
Si des données sont fournies (CSV/JSON), les intégrer ; sinon données de démonstration clairement marquées.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;padding:2rem;color:#0f172a}.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:1.5rem}.kpi{background:#fff;border-radius:10px;padding:1rem;box-shadow:0 1px 3px rgba(0,0,0,.1)}.panel{background:#fff;border-radius:10px;padding:1.5rem;margin-bottom:1rem;box-shadow:0 1px 3px rgba(0,0,0,.1)}table{width:100%;border-collapse:collapse}th,td{padding:.5rem;text-align:left;border-bottom:1px solid #e2e8f0}th{background:#f1f5f9}</style></head><body><h1>Rapport trimestriel</h1><div class="kpis"><div class="kpi"><b>€1,2M</b><br><small>Revenus</small></div><div class="kpi"><b>18%</b><br><small>Croissance</small></div><div class="kpi"><b>3 400</b><br><small>Clients</small></div><div class="kpi"><b>92%</b><br><small>Rétention</small></div></div><div class="panel"><h3>Évolution des revenus</h3></div><div class="panel"><table><thead><tr><th>Mois</th><th>Revenus</th><th>Variation</th></tr></thead><tbody><tr><td>Juin</td><td>€380k</td><td>+6%</td></tr><tr><td>Juillet</td><td>€410k</td><td>+8%</td></tr><tr><td>Août</td><td>€410k</td><td>+4%</td></tr></tbody></table></div></body></html>`,
  },
  {
    manifest: {
      id: "docs-page",
      name: "Page de documentation",
      version: "1.0.0",
      description: "Documentation avec navigation latérale, contenu et table des matières.",
      triggers: ["documentation", "docs", "guide", "tutoriel", "api"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example docs-page)",
    },
    skillMd: `# Docs Page Template
Structure : navigation latérale gauche (sections), zone de contenu principale avec table des matières, blocs de code, liens de navigation précédent/suivant.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;display:grid;grid-template-columns:240px 1fr;min-height:100vh}.nav{background:#f8fafc;border-right:1px solid #e2e8f0;padding:1.5rem}.nav a{display:block;color:#475569;padding:.4rem 0;text-decoration:none}.nav a.active{color:#4f46e5;font-weight:600}.content{max-width:720px;padding:2rem}code{background:#f1f5f9;padding:.15rem .4rem;border-radius:4px;font-size:.9em}</style></head><body><nav class="nav"><h3>Docs</h3><a class="active" href="#">Installation</a><a href="#">Configuration</a><a href="#">API</a><a href="#">Dépannage</a></nav><main class="content"><h1>Installation</h1><h2>Prérequis</h2><p>Node.js 18+ et un gestionnaire de paquets.</p><h2>Démarrage rapide</h2><pre><code>npm install\nnpm run dev</code></pre><h2>Étapes suivantes</h2><p>Consultez la page Configuration.</p></main></body></html>`,
  },
  {
    manifest: {
      id: "financial-report",
      name: "Rapport financier",
      version: "1.0.0",
      description: "Rapport financier trimestriel : KPI, graphiques, P&L, perspectives.",
      triggers: ["financier", "financial", "rapport q", "p&l", "mrr", "revenus"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example finance-report)",
    },
    skillMd: `# Financial Report Template
Structure : en-tête KPI, graphiques revenus/dépenses, tableau P&L, points clés, paragraphe perspectives. Ton institutionnel, couleurs sobres.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:Georgia,serif;margin:0;background:#fff;padding:2.5rem;color:#111827;max-width:860px;margin:auto}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;border-bottom:2px solid #111;padding-bottom:1.5rem}.kpi b{font-size:1.4rem}table{width:100%;border-collapse:collapse;margin-top:1rem}th,td{padding:.6rem;text-align:left;border-bottom:1px solid #d1d5db}.pos{color:#047857}</style></head><body><h1>Rapport financier — T3 2026</h1><div class="kpis"><div class="kpi"><b>€1,1M</b><br><small>Revenus</small></div><div class="kpi"><b>€780k</b><br><small>Dépenses</small></div><div class="kpi"><b>€320k</b><br><small>EBITDA</small></div><div class="kpi"><b>29%</b><br><small>Marge</small></div></div><h2>Compte de résultat</h2><table><thead><tr><th>Poste</th><th>T3</th><th>Var.</th></tr></thead><tbody><tr><td>Revenus récurrents</td><td>€950k</td><td class="pos">+12%</td></tr><tr><td>Services</td><td>€150k</td><td class="pos">+4%</td></tr><tr><td>Coûts opérationnels</td><td>€530k</td><td>-8%</td></tr></tbody></table><h2>Perspectives</h2><p>Croissance soutenue des revenus récurrents, maîtrise des coûts confirmée.</p></body></html>`,
  },
  {
    manifest: {
      id: "invoice",
      name: "Facture",
      version: "1.0.0",
      description: "Facture imprimable : expéditeur, articles, taxes, totaux.",
      triggers: ["facture", "invoice", "billing", "devis"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example invoice)",
    },
    skillMd: `# Invoice Template
Structure : en-tête (logo, expéditeur, destinataire, numéro/date), tableau des articles (description, quantité, PU, total), sous-total, taxes, total, instructions de paiement. Prêt à imprimer.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;padding:2rem}.sheet{background:#fff;max-width:720px;margin:auto;padding:2.5rem;box-shadow:0 1px 4px rgba(0,0,0,.1)}.head{display:flex;justify-content:space-between;border-bottom:2px solid #0f172a;padding-bottom:1rem}.meta{display:flex;justify-content:space-between;margin:1.5rem 0}table{width:100%;border-collapse:collapse}th,td{padding:.6rem;text-align:left;border-bottom:1px solid #e2e8f0}.totals{margin-left:auto;width:240px;margin-top:1.5rem}.totals div{display:flex;justify-content:space-between;padding:.3rem 0}.grand{font-weight:700;border-top:2px solid #0f172a;padding-top:.6rem}</style></head><body><div class="sheet"><div class="head"><div><b>Ma Société</b><br>12 rue Exemple<br>75001 Paris</div><div><h1 style="margin:0">FACTURE</h1><small>N° 2026-0142</small></div></div><div class="meta"><div><b>Client</b><br>Société Client<br>contact@client.fr</div><div><b>Date</b><br>12 août 2026</div></div><table><thead><tr><th>Description</th><th>Qté</th><th>PU</th><th>Total</th></tr></thead><tbody><tr><td>Prestation de conseil</td><td>10h</td><td>€90</td><td>€900</td></tr><tr><td>Licence logicielle</td><td>1</td><td>€250</td><td>€250</td></tr></tbody></table><div class="totals"><div><span>Sous-total</span><span>€1 150</span></div><div><span>TVA (20%)</span><span>€230</span></div><div class="grand"><span>Total</span><span>€1 380</span></div></div></div></body></html>`,
  },
  {
    manifest: {
      id: "meeting-notes",
      name: "Notes de réunion",
      version: "1.0.0",
      description: "Notes : participants, ordre du jour, décisions, actions.",
      triggers: ["notes de réunion", "réunion", "meeting", "compte-rendu", "procès-verbal"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example meeting-notes)",
    },
    skillMd: `# Meeting Notes Template
Structure : barre de titre avec participants et date, checklist d'ordre du jour, bloc de décisions, tableau d'actions (responsable, date, statut), pied de page prochaine réunion.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;padding:2rem}.sheet{background:#fff;max-width:680px;margin:auto;padding:2rem;border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,.1)}h2{border-bottom:2px solid #4f46e5;padding-bottom:.4rem}table{width:100%;border-collapse:collapse}th,td{padding:.5rem;text-align:left;border-bottom:1px solid #e2e8f0}li{margin:.3rem 0}</style></head><body><div class="sheet"><h1>Notes de réunion</h1><p><b>Projet:</b> Lancement V2 · <b>Date:</b> 12/08/2026 · <b>Participants:</b> A. Martin, B. Diallo</p><h2>Ordre du jour</h2><ul><li>Avancement sprint</li><li>Risques identifiés</li><li>Planning livraison</li></ul><h2>Décisions</h2><ul><li>La V2 sort le 1er septembre</li><li>Le périmètre est gelé</li></ul><h2>Actions</h2><table><thead><tr><th>Action</th><th>Responsable</th><th>Échéance</th></tr></thead><tbody><tr><td>Préparer le plan de test</td><td>A. Martin</td><td>19/08</td></tr><tr><td>Valider les maquettes</td><td>B. Diallo</td><td>20/08</td></tr></tbody></table><p style="margin-top:1.5rem"><b>Prochaine réunion:</b> 19/08/2026</p></div></body></html>`,
  },
  {
    manifest: {
      id: "blog-post",
      name: "Article de blog",
      version: "1.0.0",
      description: "Article long format : en-tête, corps avec figures, citations, signature.",
      triggers: ["blog", "article", "post", "essai", "étude de cas"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example blog-post)",
    },
    skillMd: `# Blog Post Template
Structure : en-tête (titre, auteur, date, image hero), corps avec figures et citations, signature d'auteur, articles connexes.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:Georgia,serif;margin:0;background:#fff;color:#1f2937}article{max-width:680px;margin:auto;padding:2.5rem 1.5rem}.hero{height:220px;background:linear-gradient(135deg,#4f46e5,#a855f7);border-radius:12px;margin-bottom:2rem}.byline{color:#6b7280;font-size:.9rem}blockquote{border-left:3px solid #4f46e5;margin:1.5rem 0;padding:.5rem 1rem;font-style:italic;color:#374151}figure{background:#f3f4f6;border-radius:8px;padding:1rem;text-align:center;color:#6b7280}</style></head><body><article><div class="hero"></div><h1>Pourquoi le design système change tout</h1><p class="byline">Par A. Martin · 12 août 2026</p><p>Un design system n'est pas une bibliothèque de composants — c'est un contrat.</p><blockquote>« La cohérence est la confiance de l'interface. »</blockquote><p>Déployé correctement, il réduit les frictions entre design et développement.</p><figure>Figure : anatomie d'un design system</figure><p class="byline" style="margin-top:2rem">— A. Martin, Design Lead</p></article></body></html>`,
  },
  {
    manifest: {
      id: "kanban",
      name: "Tableau Kanban",
      version: "1.0.0",
      description: "Tableau de tâches avec colonnes et cartes.",
      triggers: ["kanban", "tâches", "task board", "sprint", "trello", "gestion de projet"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example kanban)",
    },
    skillMd: `# Kanban Template
Structure : colonnes (À faire / En cours / En revue / Terminé), cartes déplaçables avec titre, étiquette et assigné, barre de filtre supérieure.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f1f5f9;padding:1.5rem}.board{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}.col{background:#e2e8f0;border-radius:10px;padding:.8rem;min-height:300px}.col h3{font-size:.85rem;text-transform:uppercase;margin:0 0 .6rem}.card{background:#fff;border-radius:8px;padding:.7rem;margin-bottom:.5rem;box-shadow:0 1px 2px rgba(0,0,0,.08)}.tag{display:inline-block;font-size:.7rem;background:#eef2ff;color:#4f46e5;border-radius:999px;padding:.1rem .5rem}.tag.red{background:#fef2f2;color:#dc2626}</style></head><body><h1>Projet V2</h1><div class="board"><div class="col"><h3>À faire</h3><div class="card"><b>Maquetter l'accueil</b><br><span class="tag">Design</span></div><div class="card"><b>Rédiger la doc</b><br><span class="tag red">Doc</span></div></div><div class="col"><h3>En cours</h3><div class="card"><b>API utilisateurs</b><br><span class="tag">Dev</span></div></div><div class="col"><h3>En revue</h3><div class="card"><b>Tests e2e</b><br><span class="tag">QA</span></div></div><div class="col"><h3>Terminé</h3><div class="card"><b>Design system</b><br><span class="tag">Design</span></div></div></div></body></html>`,
  },
  {
    manifest: {
      id: "pricing",
      name: "Page de tarification",
      version: "1.0.0",
      description: "Tarifs : en-tête, forfaits, tableau comparatif, FAQ.",
      triggers: ["tarifs", "pricing", "forfaits", "abonnement"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example pricing)",
    },
    skillMd: `# Pricing Template
Structure : en-tête, 3 niveaux de forfaits (dont un mis en avant), tableau comparatif des fonctionnalités, FAQ, CTA.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;padding:3rem 1.5rem;color:#0f172a}h1{text-align:center}.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:900px;margin:2rem auto}.plan{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:1.5rem;text-align:center}.plan.featured{border:2px solid #4f46e5;box-shadow:0 8px 24px rgba(79,70,229,.15)}.price{font-size:2rem;font-weight:700}.btn{display:inline-block;margin-top:1rem;padding:.6rem 1.4rem;border-radius:8px;text-decoration:none;border:1px solid #cbd5e1;color:#0f172a}.plan.featured .btn{background:#4f46e5;color:#fff;border-color:#4f46e5}</style></head><body><h1>Choisissez votre forfait</h1><div class="plans"><div class="plan"><h3>Starter</h3><div class="price">19€</div><p>/mois</p><p>1 utilisateur</p><p>10 projets</p><a class="btn" href="#">Commencer</a></div><div class="plan featured"><h3>Pro</h3><div class="price">49€</div><p>/mois</p><p>5 utilisateurs</p><p>Projets illimités</p><a class="btn" href="#">Essai 14 jours</a></div><div class="plan"><h3>Entreprise</h3><div class="price">Sur devis</div><p>SSO & support dédié</p><p>Personnalisation</p><a class="btn" href="#">Nous contacter</a></div></div></body></html>`,
  },
  {
    manifest: {
      id: "waitlist",
      name: "Page d'attente",
      version: "1.0.0",
      description: "Landing pré-lancement avec capture d'e-mails.",
      triggers: ["waitlist", "attente", "bêta", "early access", "lancement"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example waitlist)",
    },
    skillMd: `# Waitlist Template
Structure : message central (logo, titre, proposition de valeur), champ email + CTA, preuve sociale optionnelle, pied de page. Lit les tokens du DESIGN.md.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh}.card{text-align:center;max-width:460px;padding:2rem}.logo{font-size:1.2rem;font-weight:700;color:#818cf8}h1{font-size:2.2rem;margin:.8rem 0}p{color:#94a3b8}form{display:flex;gap:.5rem;margin-top:1.5rem}input{flex:1;padding:.7rem;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#f8fafc}button{padding:.7rem 1.2rem;border-radius:8px;border:0;background:#818cf8;color:#0f172a;font-weight:600;cursor:pointer}</style></head><body><div class="card"><div class="logo">Acme</div><h1>Quelque chose de grand arrive</h1><p>Rejoignez la liste d'attente pour un accès anticipé.</p><form><input placeholder="votre@email.com" /><button>Je m'inscris</button></form><p style="font-size:.8rem;margin-top:1rem">3 200 personnes déjà inscrites</p></div></body></html>`,
  },
  {
    manifest: {
      id: "mobile-app",
      name: "Application mobile",
      version: "1.0.0",
      description: "Écran d'application mobile dans un cadre iPhone.",
      triggers: ["mobile", "application mobile", "ios", "android", "téléphone"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example mobile-app)",
    },
    skillMd: `# Mobile App Template
Structure : cadre téléphone (iPhone 15 Pro), écran d'application avec barre de statut, navigation basse, contenu scrollable. Pixel-perfect.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh}.phone{width:320px;height:660px;background:#fff;border-radius:36px;border:8px solid #0f172a;overflow:hidden;position:relative}.status{display:flex;justify-content:space-between;padding:.6rem 1.2rem;font-size:.7rem;font-weight:600}.notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:110px;height:22px;background:#0f172a;border-radius:0 0 12px 12px}.content{padding:1rem}.card{border:1px solid #e2e8f0;border-radius:12px;padding:.9rem;margin-bottom:.7rem}.tabbar{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-around;padding:.8rem;border-top:1px solid #e2e8f0;background:#fff;font-size:.65rem;color:#64748b}</style></head><body><div class="phone"><div class="notch"></div><div class="status"><span>9:41</span><span>📶 🔋</span></div><div class="content"><h2 style="margin:.4rem 0">Accueil</h2><div class="card"><b>Solde</b><br><span style="font-size:1.4rem;font-weight:700">€2 450,80</span></div><div class="card"><b>Dernières transactions</b><br><small>Café — €4,50<br>Courses — €32,10<br>Salaire — €2 400</small></div><div class="card"><b>Objectif d'épargne</b><br><small>68% atteint</small></div></div><div class="tabbar"><span>Accueil</span><span>Cartes</span><span>Stats</span><span>Profil</span></div></div></body></html>`,
  },
  {
    manifest: {
      id: "web-prototype",
      name: "Prototype web",
      version: "1.0.0",
      description: "Prototype web polyvalent : landing, marketing, documentation ou SaaS.",
      triggers: ["prototype", "web", "page", "vitrine", "site", "accueil"],
      kind: "web",
      license: "Apache-2.0 (adapté de nexu-io/open-design example web-prototype)",
    },
    skillMd: `# Web Prototype Template
Prototype web de bureau polyvalent. Structure : nav, hero, sections de contenu, footer. Option par défaut pour les demandes vagues de pages web.
Adapte la structure au brief : landing (hero+features+cta), documentation (nav latérale), SaaS (pricing).`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;color:#0f172a}nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;border-bottom:1px solid #e2e8f0}.hero{padding:4rem 2rem;text-align:center;background:linear-gradient(180deg,#f8fafc,#fff)}.hero h1{font-size:2.5rem;margin:0 0 .8rem}.btn{display:inline-block;background:#0f172a;color:#fff;padding:.7rem 1.5rem;border-radius:8px;text-decoration:none}.section{padding:3rem 2rem;max-width:960px;margin:auto}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}.item{border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem}footer{text-align:center;padding:2rem;border-top:1px solid #e2e8f0;color:#64748b}</style></head><body><nav><b>MonProjet</b><span><a href="#" style="margin-left:1rem;color:#64748b">À propos</a><a href="#" style="margin-left:1rem;color:#64748b">Contact</a></span></nav><section class="hero"><h1>Bienvenue sur MonProjet</h1><p style="color:#64748b">Une description claire et engageante.</p><a class="btn" href="#">Découvrir</a></section><section class="section"><div class="grid"><div class="item"><h3>Fonctionnalité 1</h3><p>Description courte.</p></div><div class="item"><h3>Fonctionnalité 2</h3><p>Description courte.</p></div><div class="item"><h3>Fonctionnalité 3</h3><p>Description courte.</p></div></div></section><footer>© 2026 MonProjet</footer></body></html>`,
  },
  {
    manifest: {
      id: "auth",
      name: "Authentification",
      version: "1.0.0",
      description: "Page de connexion / inscription / mot de passe oublié.",
      triggers: ["login", "connexion", "signin", "inscription", "signup", "authentification", "mot de passe"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Auth Template
Structure : carte centrée, titre, formulaire (email, mot de passe, connexion via fournisseur), lien mot de passe oublié, bascule connexion/inscription, rappel des tokens du DESIGN.md actif. Accessible (labels, aria).`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f1f5f9;display:flex;align-items:center;justify-content:center;min-height:100vh}.card{background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.08);padding:2.2rem;width:100%;max-width:380px}h1{font-size:1.4rem;margin:0 0 .3rem}.sub{color:#64748b;font-size:.9rem;margin-bottom:1.4rem}label{display:block;font-size:.8rem;color:#475569;margin-bottom:.3rem}input{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:8px;padding:.6rem .8rem;margin-bottom:1rem;font-size:.9rem}input:focus{outline:none;border-color:#4f46e5;box-shadow:0 0 0 3px rgba(79,70,229,.15)}.btn{width:100%;background:#4f46e5;color:#fff;border:0;border-radius:8px;padding:.65rem;font-weight:600;cursor:pointer;font-size:.95rem}.btn:hover{background:#4338ca}.divider{display:flex;align-items:center;gap:.6rem;color:#94a3b8;font-size:.75rem;margin:1rem 0}.divider::before,.divider::after{content:"";flex:1;height:1px;background:#e2e8f0}.switch{text-align:center;font-size:.85rem;color:#64748b;margin-top:1rem}.switch a{color:#4f46e5;text-decoration:none}.forgot{display:block;text-align:right;font-size:.78rem;color:#64748b;margin-top:-.6rem;margin-bottom:1rem;text-decoration:none}</style></head><body><div class="card"><h1>Bienvenue</h1><p class="sub">Connectez-vous à votre espace</p><form><label for="email">Adresse e-mail</label><input id="email" type="email" placeholder="vous@exemple.com"><label for="pass">Mot de passe</label><input id="pass" type="password" placeholder="••••••••"><a class="forgot" href="#">Mot de passe oublié ?</a><button class="btn" type="submit">Se connecter</button></form><div class="divider">ou</div><div style="display:flex;gap:.6rem"><button style="flex:1;padding:.55rem;border:1px solid #cbd5e1;border-radius:8px;background:#fff;cursor:pointer;font-size:.85rem">Google</button><button style="flex:1;padding:.55rem;border:1px solid #cbd5e1;border-radius:8px;background:#fff;cursor:pointer;font-size:.85rem">GitHub</button></div><p class="switch">Pas encore de compte ? <a href="#">S'inscrire</a></p></div></body></html>`,
  },
  {
    manifest: {
      id: "chat-ui",
      name: "Interface de chat",
      version: "1.0.0",
      description: "Application de messagerie : conversations, bulles, saisie.",
      triggers: ["chat", "messagerie", "conversation", "messages", "discussion", "ia"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Chat UI Template
Structure : liste de conversations (gauche), zone de discussion (en-tête contact, bulles reçues/envoyées avec timestamps, indicateur de saisie), champ de saisie + bouton envoyer. Respecte les tokens du DESIGN.md.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;display:grid;grid-template-columns:280px 1fr;height:100vh;background:#f8fafc}.convos{border-right:1px solid #e2e8f0;background:#fff;overflow-y:auto}.convos h3{padding:1rem;margin:0;font-size:.85rem;text-transform:uppercase;color:#64748b}.conv{display:flex;align-items:center;gap:.7rem;padding:.7rem 1rem;cursor:pointer;border-bottom:1px solid #f1f5f9}.conv.active{background:#eef2ff}.avatar{width:38px;height:38px;border-radius:50%;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:.8rem;flex-shrink:0}.conv small{color:#94a3b8}.main{display:flex;flex-direction:column;height:100%}.head{display:flex;align-items:center;gap:.8rem;padding:.8rem 1.2rem;border-bottom:1px solid #e2e8f0;background:#fff}.msgs{flex:1;overflow-y:auto;padding:1.2rem;display:flex;flex-direction:column;gap:.6rem}.msg{max-width:65%;padding:.6rem .9rem;border-radius:14px;font-size:.9rem;line-height:1.4}.msg.in{background:#fff;border:1px solid #e2e8f0;align-self:flex-start;border-bottom-left-radius:4px}.msg.out{background:#4f46e5;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}.msg small{display:block;font-size:.68rem;opacity:.7;margin-top:.2rem}.inputbar{display:flex;gap:.6rem;padding:.8rem 1.2rem;border-top:1px solid #e2e8f0;background:#fff}input{flex:1;border:1px solid #cbd5e1;border-radius:999px;padding:.6rem 1rem;font-size:.9rem}input:focus{outline:none;border-color:#4f46e5}button{background:#4f46e5;color:#fff;border:0;border-radius:999px;padding:.6rem 1.2rem;font-weight:600;cursor:pointer}</style></head><body><aside class="convos"><h3>Conversations</h3><div class="conv active"><div class="avatar">AM</div><div><b>Ana Martin</b><br><small>Super, merci !</small></div></div><div class="conv"><div class="avatar">BD</div><div><b>B. Diallo</b><br><small>On se cale demain ?</small></div></div><div class="conv"><div class="avatar">SL</div><div><b>Sarah L.</b><br><small>Le rapport est prêt</small></div></div></aside><main class="main"><div class="head"><div class="avatar">AM</div><div><b>Ana Martin</b><br><small style="color:#22c55e">En ligne</small></div></div><div class="msgs"><div class="msg in">Salut ! Tu as vu la nouvelle maquette ?<small>09:41</small></div><div class="msg out">Oui, elle est superbe. J'adore la palette.<small>09:42</small></div><div class="msg in">On peut l'ajuster pour le mobile ?<small>09:43</small></div><div class="msg out">Bien sûr, je m'en occupe.<small>09:44</small></div></div><div class="inputbar"><input placeholder="Écrire un message…"><button>Envoyer</button></div></main></body></html>`,
  },
  {
    manifest: {
      id: "ecommerce",
      name: "E-commerce",
      version: "1.0.0",
      description: "Boutique en ligne : catalogue, filtres, panier.",
      triggers: ["e-commerce", "ecommerce", "boutique", "magasin", "catalogue", "produits", "panier", "achat"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# E-commerce Template
Structure : en-tête (logo, recherche, panier), barre de catégories, grille de produits (image, nom, prix, badge promo, bouton ajout), fiche produit (galerie, description, quantité, CTA), panier latéral. Données de démo réalistes.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;color:#0f172a}header{display:flex;justify-content:space-between;align-items:center;padding:.9rem 2rem;border-bottom:1px solid #e2e8f0;position:sticky;top:0;background:#fff}.logo{font-weight:800;font-size:1.1rem}.cats{display:flex;gap:1.2rem;padding:.6rem 2rem;border-bottom:1px solid #f1f5f9;font-size:.85rem;color:#64748b}.cats span{cursor:pointer}.cats span:hover{color:#0f172a}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.2rem;padding:1.5rem 2rem}.prod{border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#fff}.thumb{height:150px;background:linear-gradient(135deg,#eef2ff,#e0e7ff);display:flex;align-items:center;justify-content:center;color:#a5b4fc;font-size:.8rem}.prod .info{padding:.8rem}.prod b{font-size:.95rem}.price{color:#4f46e5;font-weight:700}.badge{position:absolute;background:#ef4444;color:#fff;font-size:.7rem;padding:.15rem .5rem;border-radius:999px}.add{width:100%;margin-top:.6rem;padding:.5rem;border:1px solid #cbd5e1;border-radius:8px;background:#fff;cursor:pointer;font-size:.85rem}.add:hover{border-color:#4f46e5;color:#4f46e5}</style></head><body><header><span class="logo">MaBoutique</span><span style="font-size:.85rem;color:#64748b">Rechercher un produit…</span><span>🛒 Panier (3)</span></header><div class="cats"><span>Tous</span><span>Électronique</span><span>Mode</span><span>Maison</span><span>Sport</span></div><div class="grid"><div class="prod"><div style="position:relative"><div class="thumb">Casque Audio</div><span class="badge" style="top:8px;left:8px">-20%</span></div><div class="info"><b>Casque Bluetooth Pro</b><br><span class="price">79,99 €</span> <s style="color:#94a3b8;font-size:.8rem">99,99 €</s><br><button class="add">Ajouter au panier</button></div></div><div class="prod"><div class="thumb">Montre Connectée</div><div class="info"><b>Montre Fit X2</b><br><span class="price">149 €</span><br><button class="add">Ajouter au panier</button></div></div><div class="prod"><div class="thumb">Enceinte</div><div class="info"><b>Enceinte portable</b><br><span class="price">59 €</span><br><button class="add">Ajouter au panier</button></div></div><div class="prod"><div class="thumb">Clavier</div><div class="info"><b>Clavier mécanique</b><br><span class="price">89 €</span><br><button class="add">Ajouter au panier</button></div></div></div></body></html>`,
  },
  {
    manifest: {
      id: "portfolio",
      name: "Portfolio",
      version: "1.0.0",
      description: "Portfolio personnel créatif : héro, projets, compétences, contact.",
      triggers: ["portfolio", "cv", "personnel", "projets", "freelance", "créatif"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Portfolio Template
Structure : héro (nom, titre, CTA), grille de projets (images, tags), section compétences (barres ou badges), témoignages optionnels, formulaire de contact, footer social. Personnalité visuelle forte, respecte les tokens.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#fafaf9;color:#1c1917}nav{display:flex;justify-content:space-between;padding:1.2rem 2rem;position:sticky;top:0;background:#fafaf9;border-bottom:1px solid #e7e5e4}.hero{padding:4rem 2rem;text-align:center}.hero h1{font-size:2.8rem;margin:0 0 .5rem}.hero .role{color:#78716c;font-size:1.1rem;margin-bottom:1.5rem}.chip{display:inline-block;background:#1c1917;color:#fafaf9;padding:.5rem 1.2rem;border-radius:999px;text-decoration:none;font-size:.9rem}.projects{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.2rem;max-width:1000px;margin:auto;padding:2rem}.proj{background:#fff;border:1px solid #e7e5e4;border-radius:14px;overflow:hidden}.cover{height:160px;background:linear-gradient(135deg,#d6d3d1,#a8a29e);display:flex;align-items:center;justify-content:center;color:#57534e;font-size:.8rem}.proj .body{padding:1rem}.proj .tags{display:flex;gap:.4rem;margin-top:.6rem}.tag{font-size:.7rem;background:#f5f5f4;border:1px solid #e7e5e4;border-radius:999px;padding:.15rem .6rem;color:#57534e}.skills{max-width:700px;margin:auto;padding:2rem;text-align:center}.bar{height:8px;background:#e7e5e4;border-radius:999px;margin:.4rem auto 1rem;max-width:400px;overflow:hidden}.bar i{display:block;height:100%;background:#1c1917;border-radius:999px}.contact{text-align:center;padding:2.5rem;background:#1c1917;color:#fafaf9}footer{text-align:center;padding:1.2rem;font-size:.85rem;color:#78716c}</style></head><body><nav><b>Alex Dubois</b><span style="color:#78716c">Projets · Compétences · Contact</span></nav><section class="hero"><h1>Alex Dubois</h1><p class="role">Designer & développeur front-end</p><a class="chip" href="#">Voir mes projets ↓</a></section><div class="projects"><div class="proj"><div class="cover">Dashboard SaaS</div><div class="body"><b>Dashboard SaaS</b><p style="color:#78716c;font-size:.85rem;margin:.3rem 0">Refonte d'un outil analytique.</p><div class="tags"><span class="tag">React</span><span class="tag">Design system</span></div></div></div><div class="proj"><div class="cover">App mobile</div><div class="body"><b>App mobile fitness</b><p style="color:#78716c;font-size:.85rem;margin:.3rem 0">Conception UI/UX complète.</p><div class="tags"><span class="tag">Mobile</span><span class="tag">Figma</span></div></div></div><div class="proj"><div class="cover">Site vitrine</div><div class="body"><b>Site vitrine restaurant</b><p style="color:#78716c;font-size:.85rem;margin:.3rem 0">Identité et maquettes.</p><div class="tags"><span class="tag">Branding</span></div></div></div></div><section class="skills"><h2>Compétences</h2><p style="color:#78716c">UI Design</p><div class="bar"><i style="width:90%"></i></div><p style="color:#78716c">Développement</p><div class="bar"><i style="width:75%"></i></div><p style="color:#78716c">Prototypage</p><div class="bar"><i style="width:85%"></i></div></section><section class="contact"><h2>Travaillons ensemble</h2><p style="color:#d6d3d1">alex@exemple.com</p><a class="chip" href="#" style="background:#fafaf9;color:#1c1917;margin-top:1rem;display:inline-block">Me contacter</a></section><footer>© 2026 Alex Dubois — Portfolio</footer></body></html>`,
  },
  {
    manifest: {
      id: "profile",
      name: "Profil utilisateur",
      version: "1.0.0",
      description: "Page de profil / compte : avatar, infos, onglets, activités.",
      triggers: ["profil", "profile", "compte", "utilisateur", "avatar", "paramètres du compte"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Profile Template
Structure : carte d'en-tête (avatar, nom, bio, boutons suivre/éditer), statistiques (3 chiffres), onglets (À propos, Activité, Réglages), grille de contenu. Respecte les tokens du DESIGN.md.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;color:#0f172a}.banner{height:140px;background:linear-gradient(135deg,#4f46e5,#a855f7)}.wrap{max-width:720px;margin:-50px auto 0;padding:0 1rem 2rem}.card{background:#fff;border-radius:16px;box-shadow:0 4px 16px rgba(0,0,0,.06);padding:1.4rem;margin-bottom:1rem}.avatar{width:96px;height:96px;border-radius:50%;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;border:4px solid #fff}.row{display:flex;align-items:center;gap:1rem}.stats{display:flex;gap:1.5rem;margin-top:.8rem}.stat b{font-size:1.2rem;display:block}.stat span{color:#64748b;font-size:.8rem}.btn{background:#4f46e5;color:#fff;border:0;border-radius:8px;padding:.5rem 1.1rem;font-weight:600;cursor:pointer;font-size:.85rem}.btn.ghost{background:#fff;border:1px solid #cbd5e1;color:#0f172a}.tabs{display:flex;gap:.2rem;margin-bottom:1rem}.tab{flex:1;text-align:center;padding:.7rem;font-size:.85rem;color:#64748b;cursor:pointer;border-bottom:2px solid transparent}.tab.active{color:#4f46e5;border-bottom-color:#4f46e5;font-weight:600}.grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}.item{border:1px solid #e2e8f0;border-radius:10px;padding:.9rem;font-size:.85rem}.item small{color:#94a3b8}</style></head><body><div class="banner"></div><div class="wrap"><div class="card"><div class="row"><div class="avatar">AD</div><div style="flex:1"><h2 style="margin:0">Alex Dubois</h2><p style="color:#64748b;margin:.2rem 0">Designer produit · Paris</p><div class="stats"><div class="stat"><b>128</b><span>Publications</span></div><div class="stat"><b>4 230</b><span>Abonnés</span></div><div class="stat"><b>318</b><span>Abonnements</span></div></div></div><button class="btn">Suivre</button><button class="btn ghost">Éditer</button></div></div><div class="tabs"><div class="tab active">À propos</div><div class="tab">Activité</div><div class="tab">Réglages</div></div><div class="card"><h3 style="margin:0 0 .6rem">À propos</h3><p style="color:#475569;font-size:.9rem;margin:0">Designer passionné par les interfaces élégantes et accessibles. 8 ans d'expérience sur des produits SaaS et mobiles.</p></div><div class="grid"><div class="item"><b>Récent</b><br><small>Dashboard ventes — il y a 2 h</small></div><div class="item"><b>Projet</b><br><small>App fitness — en cours</small></div><div class="item"><b>Compétence</b><br><small>UI Design, React</small></div><div class="item"><b>Localisation</b><br><small>Paris, France</small></div></div></div></body></html>`,
  },
  {
    manifest: {
      id: "event",
      name: "Événement",
      version: "1.0.0",
      description: "Landing d'événement / conférence : agenda, speakers, inscription.",
      triggers: ["événement", "event", "conférence", "webinar", "meetup", "sommet", "inscription événement"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Event Template
Structure : héro (titre, date, lieu, CTA billetterie), compteur ou bandeau, agenda des sessions (jour/heure/titre), grille des speakers (photo, nom, rôle), section sponsors, inscription (email ou billetterie).`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;color:#0f172a}.hero{background:#0f172a;color:#f8fafc;text-align:center;padding:4.5rem 1.5rem}.hero .date{color:#818cf8;font-weight:600;letter-spacing:.06em;text-transform:uppercase;font-size:.8rem}.hero h1{font-size:2.6rem;margin:.6rem 0}.cta{display:inline-block;background:#818cf8;color:#0f172a;padding:.8rem 1.8rem;border-radius:10px;font-weight:700;text-decoration:none;margin-top:1.2rem}.sec{max-width:900px;margin:auto;padding:2.5rem 1.5rem}h2{font-size:1.4rem;margin-bottom:1rem}.agenda{border-left:2px solid #e2e8f0;padding-left:1.2rem}.slot{margin-bottom:1.2rem}.slot b{display:block}.slot small{color:#64748b}.speakers{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1.2rem}.spk{text-align:center}.spk .pic{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#c7d2fe,#818cf8);margin:0 auto .6rem;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700}.spk small{color:#64748b}.sponsors{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}.sponsor{border:1px solid #e2e8f0;border-radius:10px;padding:.8rem 1.4rem;color:#64748b;font-weight:600;background:#fff}</style></head><body><section class="hero"><span class="date">12–14 novembre 2026 · Paris</span><h1>TechConf 2026</h1><p style="color:#cbd5e1;max-width:520px;margin:auto">Le rendez-vous des makers du web : design, IA et produits.</p><a class="cta" href="#">Réserver ma place</a></section><section class="sec"><h2>Programme</h2><div class="agenda"><div class="slot"><b>09:00 — Ouverture & keynote</b><small>Grande salle</small></div><div class="slot"><b>10:30 — Design systems à l'échelle</b><small>Salle B</small></div><div class="slot"><b>14:00 — IA générative en pratique</b><small>Salle A</small></div><div class="slot"><b>16:30 — Table ronde produits</b><small>Grande salle</small></div></div></section><section class="sec"><h2>Intervenants</h2><div class="speakers"><div class="spk"><div class="pic">AM</div><b>Ana Martin</b><br><small>Design Lead, Acme</small></div><div class="spk"><div class="pic">BD</div><b>B. Diallo</b><br><small>CTO, StartupX</small></div><div class="spk"><div class="pic">SL</div><b>Sarah L.</b><br><small>PM, DataCorp</small></div></div></section><section class="sec"><h2>Sponsors</h2><div class="sponsors"><span class="sponsor">Acme</span><span class="sponsor">StartupX</span><span class="sponsor">DataCorp</span></div></section></body></html>`,
  },
  {
    manifest: {
      id: "quiz",
      name: "Quiz interactif",
      version: "1.0.0",
      description: "Quiz : questions, progression, score final.",
      triggers: ["quiz", "questionnaire", "test interactif", "jeu de questions", "sondage"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Quiz Template
Structure : carte de question (titre, 4 choix), barre de progression, compteur question X/Y, écran de résultat (score, message, bouton rejouer). Interactif en JS pur, sans dépendance.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f1f5f9;display:flex;align-items:center;justify-content:center;min-height:100vh}.card{background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.08);padding:2rem;width:100%;max-width:480px}.progress{height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden;margin-bottom:1.2rem}.progress i{display:block;height:100%;background:#4f46e5;transition:width .3s}.qnum{color:#64748b;font-size:.8rem;margin-bottom:.4rem}.q{font-size:1.15rem;font-weight:600;margin-bottom:1.2rem}.opt{display:block;width:100%;text-align:left;border:1px solid #cbd5e1;border-radius:10px;background:#fff;padding:.8rem 1rem;margin-bottom:.6rem;font-size:.9rem;cursor:pointer}.opt:hover{border-color:#4f46e5;background:#eef2ff}.opt.correct{border-color:#22c55e;background:#f0fdf4}.opt.wrong{border-color:#ef4444;background:#fef2f2}.result{text-align:center}.result .score{font-size:2.6rem;font-weight:800;color:#4f46e5}.btn{background:#4f46e5;color:#fff;border:0;border-radius:10px;padding:.7rem 1.6rem;font-weight:600;cursor:pointer;font-size:.95rem;margin-top:1rem}</style></head><body><div class="card" id="app"><div class="progress"><i id="bar" style="width:25%"></i></div><div class="qnum" id="qnum">Question 1 / 4</div><div class="q" id="q">Quel langage est utilisé pour styler une page web ?</div><div id="opts"><button class="opt" onclick="pick(0)">JavaScript</button><button class="opt" onclick="pick(1)">CSS</button><button class="opt" onclick="pick(2)">Python</button><button class="opt" onclick="pick(3)">Rust</button></div></div><script>const QS=[{q:"Quel langage est utilisé pour styler une page web ?",a:1,o:["JavaScript","CSS","Python","Rust"]},{q:"Que signifie HTML ?",a:2,o:["Hyper Text Markup Language","High Tech Modern Layout","Home Tool Markup Language","Hyper Transfer Main Link"]},{q:"Quel est le rôle d'un design system ?",a:0,o:["Assurer la cohérence visuelle","Accélérer le réseau","Stocker des images","Compiler le CSS"]},{q:"CSS signifie…",a:3,o:["Cascading Style Sheets","Computer Style System","Creative Style Syntax","Cascading Simple Sheets"]}];let i=0,s=0;const $=id=>document.getElementById(id);function render(){const c=QS[i];$("q").textContent=c.q;$("qnum").textContent="Question "+(i+1)+" / "+QS.length;$("bar").style.width=((i+1)/QS.length*100)+"%";$("opts").innerHTML=c.o.map((o,j)=>'<button class="opt" onclick="pick('+j+')">'+o+"</button>").join("")}function pick(j){const c=QS[i];const btns=$("opts").children;if(j===c.a){s++;btns[j].className+=" correct"}else{btns[j].className+=" wrong";btns[c.a].className+=" correct"}setTimeout(()=>{i++;if(i<QS.length)render();else{$("app").innerHTML='<div class="result"><div class="score">'+Math.round(s/QS.length*100)+" %</div><p>Vous avez "+s+" bonne(s) réponse(s) sur "+QS.length+"</p><button class="btn" onclick="location.reload()">Rejouer</button></div>'}},900)}render();</script></body></html>`,
  },
  {
    manifest: {
      id: "travel",
      name: "Voyage",
      version: "1.0.0",
      description: "Réservation de voyage : recherche, résultats, offres.",
      triggers: ["voyage", "travel", "hôtel", "réservation", "vol", "vacances", "séjour"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Travel Template
Structure : barre de recherche (destination, dates, voyageurs), grille de résultats (image, nom, note, prix, bouton), filtre par prix/type, bandeau promo. Données de démo réalistes.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;color:#0f172a}.search{background:#0f172a;color:#f8fafc;padding:2.5rem 1.5rem;text-align:center}.search h1{font-size:1.8rem;margin:0 0 1rem}.bar{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap}.bar input,.bar button{padding:.7rem 1rem;border-radius:10px;border:0;font-size:.9rem}.bar input{width:200px}.bar button{background:#818cf8;color:#0f172a;font-weight:700;cursor:pointer}.results{max-width:900px;margin:auto;padding:2rem 1.5rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.2rem}.hotel{border:1px solid #e2e8f0;border-radius:14px;background:#fff;overflow:hidden}.photo{height:130px;background:linear-gradient(135deg,#a5b4fc,#818cf8);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600}.hotel .body{padding:.9rem}.stars{color:#f59e0b;font-size:.85rem}.price{color:#4f46e5;font-weight:700;font-size:1.05rem}.btn{display:block;width:100%;margin-top:.6rem;background:#4f46e5;color:#fff;border:0;border-radius:8px;padding:.55rem;font-weight:600;cursor:pointer}.promo{max-width:900px;margin:1.5rem auto 0;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;padding:.9rem 1.2rem;font-size:.9rem;text-align:center}</style></head><body><section class="search"><h1>Où allez-vous ?</h1><div class="bar"><input placeholder="Destination"><input placeholder="Arrivée"><input placeholder="Départ"><button>Rechercher</button></div></section><div class="promo">✈ Offre de rentrée : -15% sur les séjours en Europe jusqu'au 30 septembre</div><div class="results"><div class="hotel"><div class="photo">Lisbonne</div><div class="body"><b>Hôtel Miradouro</b><br><span class="stars">★★★★★</span> · 4,8/5<br><span style="color:#64748b;font-size:.85rem">2 nuits, petit-déj inclus</span><br><span class="price">189 €</span><button class="btn">Réserver</button></div></div><div class="hotel"><div class="photo">Barcelone</div><div class="body"><b>Apartments Gòtic</b><br><span class="stars">★★★★</span> · 4,5/5<br><span style="color:#64748b;font-size:.85rem">3 nuits</span><br><span class="price">245 €</span><button class="btn">Réserver</button></div></div><div class="hotel"><div class="photo">Rome</div><div class="body"><b>Hotel Trastevere</b><br><span class="stars">★★★★★</span> · 4,7/5<br><span style="color:#64748b;font-size:.85rem">2 nuits</span><br><span class="price">210 €</span><button class="btn">Réserver</button></div></div></div></body></html>`,
  },
  {
    manifest: {
      id: "restaurant",
      name: "Restaurant",
      version: "1.0.0",
      description: "Vitrine restaurant : menu, galerie, réservation.",
      triggers: ["restaurant", "menu", "carte", "cuisine", "réservation restaurant", "bistrot"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Restaurant Template
Structure : héro (photo, nom, tagline, CTA réservation), sections menu par catégorie (plat, description, prix), galerie, horaires & contact, footer. Ambiance chaleureuse selon les tokens.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:Georgia,serif;margin:0;background:#faf7f2;color:#292524}.hero{background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),linear-gradient(135deg,#92400e,#78350f);color:#fef3c7;text-align:center;padding:4.5rem 1.5rem}.hero h1{font-size:2.6rem;margin:0 0 .4rem}.hero p{font-style:italic;opacity:.9;margin:0 0 1.4rem}.cta{background:#f59e0b;color:#292524;padding:.7rem 1.8rem;border-radius:999px;font-weight:700;text-decoration:none;font-family:system-ui}.sec{max-width:760px;margin:auto;padding:2.2rem 1.5rem}h2{font-family:system-ui;letter-spacing:.08em;text-transform:uppercase;font-size:.9rem;color:#92400e;border-bottom:1px solid #e7dcc8;padding-bottom:.5rem}.dish{display:flex;justify-content:space-between;gap:1rem;padding:.6rem 0;border-bottom:1px dashed #e7dcc8}.dish b{font-weight:700}.dish span{color:#78350f;font-weight:700}.gal{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem}.gal div{height:110px;border-radius:10px;background:linear-gradient(135deg,#d6c7a8,#b8a37e);display:flex;align-items:center;justify-content:center;color:#fff;font-size:.8rem;font-family:system-ui}.info{background:#f0e9dc;border-radius:12px;padding:1.2rem;font-family:system-ui;font-size:.9rem;text-align:center}footer{text-align:center;padding:1.4rem;color:#78716c;font-family:system-ui;font-size:.85rem}</style></head><body><section class="hero"><h1>Le Bistrot des Halles</h1><p>Cuisine française de saison, produits du marché</p><a class="cta" href="#">Réserver une table</a></section><section class="sec"><h2>Entrées</h2><div class="dish"><span><b>Velouté de potimarron</b><br><small style="color:#78716c">crème de noisette, graines torréfiées</small></span><span>9 €</span></div><div class="dish"><span><b>Œuf parfait</b><br><small style="color:#78716c">mousseline de champignons</small></span><span>11 €</span></div></section><section class="sec"><h2>Plats</h2><div class="dish"><span><b>Poulet fermier rôti</b><br><small style="color:#78716c">jus corsé, légumes de saison</small></span><span>22 €</span></div><div class="dish"><span><b>Bar entier meunière</b><br><small style="color:#78716c">beurre noisette, citron confit</small></span><span>27 €</span></div></section><section class="sec"><h2>Galerie</h2><div class="gal"><div>Salle</div><div>Plat signature</div><div>Terrasse</div></div></section><section class="sec"><div class="info"><b>Horaires</b> — Mar–Sam : 12h–14h30 / 19h–22h30<br><b>Adresse</b> — 12 rue des Halles, 75001 Paris<br><b>Tél</b> — 01 42 00 00 00</div></section><footer>© 2026 Le Bistrot des Halles</footer></body></html>`,
  },
  {
    manifest: {
      id: "404",
      name: "Page 404",
      version: "1.0.0",
      description: "Page d'erreur 404 créative.",
      triggers: ["404", "page d'erreur", "introuvable", "not found", "erreur 404"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# 404 Template
Structure : grand visuel/typographie 404, message d'erreur court, recherche ou liens utiles, bouton retour à l'accueil. Personnalité forte, on-brand selon les tokens.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}.code{font-size:7rem;font-weight:800;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1}.msg{color:#94a3b8;margin:.8rem 0 1.5rem}.btn{display:inline-block;background:#818cf8;color:#0f172a;padding:.7rem 1.6rem;border-radius:10px;font-weight:700;text-decoration:none}.links{margin-top:1.2rem;color:#64748b;font-size:.85rem}.links a{color:#94a3b8;margin:0 .5rem;text-decoration:none}.links a:hover{color:#fff}</style></head><body><div><div class="code">404</div><h1 style="margin:.4rem 0">Oups, page introuvable</h1><p class="msg">La page que vous cherchez a été déplacée ou n'existe plus.</p><a class="btn" href="#">Retour à l'accueil</a><div class="links"><a href="#">Documentation</a>·<a href="#">Support</a>·<a href="#">Contact</a></div></div></body></html>`,
  },
  {
    manifest: {
      id: "newsletter",
      name: "Newsletter",
      version: "1.0.0",
      description: "Email / newsletter : en-tête, articles, pied de page.",
      triggers: ["newsletter", "email", "emailing", "lettre d'information", "campagne email"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Newsletter Template
Structure : en-tête (logo, titre, date), article principal (image, titre, extrait), liste d'articles secondaires, appel à l'action, pied de page (désabonnement, réseaux). Format email-friendly (largeur max 600px, styles inline).`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f1f5f9;padding:2rem}.sheet{max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.06)}.head{background:#0f172a;color:#fff;padding:1.4rem;display:flex;justify-content:space-between;align-items:center}.head b{font-size:1.1rem}.head small{color:#94a3b8}.content{padding:1.6rem}.main-img{height:160px;border-radius:10px;background:linear-gradient(135deg,#c7d2fe,#818cf8);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;margin-bottom:1rem}.meta{color:#64748b;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em}.h2{font-size:1.3rem;margin:.4rem 0}.items{border-top:1px solid #e2e8f0;margin-top:1.2rem;padding-top:1rem}.item{display:flex;gap:.8rem;padding:.6rem 0;border-bottom:1px solid #f1f5f9}.thumb{width:70px;height:50px;border-radius:8px;background:#eef2ff;flex-shrink:0}.cta{display:block;text-align:center;background:#4f46e5;color:#fff;text-decoration:none;border-radius:10px;padding:.8rem;font-weight:600;margin-top:1.4rem}.foot{background:#f8fafc;text-align:center;padding:1.2rem;color:#94a3b8;font-size:.78rem}.foot a{color:#64748b;margin:0 .4rem}</style></head><body><div class="sheet"><div class="head"><b>📬 La Lettre Dev</b><small>N°42 — août 2026</small></div><div class="content"><div class="main-img">Actualité du mois</div><div class="meta">Tendances · 6 min</div><h2 class="h2">Le design system comme contrat d'équipe</h2><p style="color:#475569;line-height:1.6">Pourquoi les meilleures équipes produits traitent leur design system comme un contrat vivant — et comment le vôtre peut en faire autant.</p><div class="items"><div class="item"><div class="thumb"></div><div><b style="font-size:.9rem">5 outils IA à surveiller</b><br><small style="color:#64748b">Sélection du mois</small></div></div><div class="item"><div class="thumb"></div><div><b style="font-size:.9rem">CSS : 10 astuces oubliées</b><br><small style="color:#64748b">Tutoriel</small></div></div></div><a class="cta" href="#">Lire la newsletter complète →</a></div><div class="foot">Vous recevez cet email car vous êtes abonné à La Lettre Dev.<br><a href="#">Se désabonner</a> · <a href="#">Gérer mes préférences</a></div></div></body></html>`,
  },
  {
    manifest: {
      id: "presentation",
      name: "Présentation",
      version: "1.0.0",
      description: "Slides HTML navigables : diaporama web.",
      triggers: ["présentation", "slides", "diaporama", "keynote", "deck", "support de présentation"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Presentation Template
Structure : slides plein écran (titre, contenu, visuel), navigation flèches/boutons, indicateur slide X/Y, transitions simples en JS pur. Design sobre et lisible de loin.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;overflow:hidden;background:#0f172a;color:#f8fafc}.slide{display:none;height:100vh;align-items:center;justify-content:center;flex-direction:column;padding:2rem;text-align:center}.slide.active{display:flex}.slide h1{font-size:3rem;margin:0 0 .8rem}.slide p{font-size:1.3rem;color:#94a3b8;max-width:640px}.nav{position:fixed;bottom:1.5rem;right:1.5rem;display:flex;gap:.5rem}.nav button{background:#334155;color:#f8fafc;border:0;border-radius:10px;padding:.7rem 1.1rem;font-size:1.1rem;cursor:pointer}.counter{position:fixed;bottom:1.7rem;left:1.5rem;color:#64748b;font-size:.9rem}.accent{color:#818cf8}</style></head><body><section class="slide active"><h1>L'IA au service du design</h1><p>Comment les studios créatifs accélèrent avec l'IA générative.</p></section><section class="slide"><h1>01 — Le constat</h1><p>3 heures pour une maquette, 3 minutes avec les bons outils.</p></section><section class="slide"><h1>02 — La méthode</h1><p>Brief structuré → design system → génération → critique itérative.</p></section><section class="slide"><h1>03 — Les résultats</h1><p><span class="accent">-80%</span> de temps de conception, <span class="accent">×3</span> d'itérations possibles.</p></section><section class="slide"><h1>Merci 🙏</h1><p>Des questions ?</p></section><div class="counter"><span id="cur">1</span> / 5</div><div class="nav"><button onclick="prev()">←</button><button onclick="next()">→</button></div><script>let i=0;const s=document.querySelectorAll(".slide"),c=document.getElementById("cur");function show(){s.forEach((x,j)=>x.classList.toggle("active",j===i));c.textContent=i+1}function next(){i=Math.min(i+1,s.length-1);show()}function prev(){i=Math.max(i-1,0);show()}document.addEventListener("keydown",e=>{if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")prev()});</script></body></html>`,
  },
  {
    manifest: {
      id: "clone-site",
      name: "Clone de site web",
      version: "1.0.0",
      description: "Reproduction fidèle d'un site existant décrit par l'utilisateur.",
      triggers: ["clone", "reproduction", "copie", "comme le site", "similaire à", "même style que", "refaire le site"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Clone Site Template
Reproduit fidèlement la structure, la palette et les composants d'un site existant décrit par l'utilisateur (nom, URL ou description). Règles : (1) ne jamais copier le contenu textuel réel (texte de démo) ; (2) reproduire uniquement la structure visuelle, le layout et le style ; (3) si l'utilisateur fournit une URL, reproduire ce qui est décrit sans accéder au réseau. Structure : nav, hero, sections identifiées, footer.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;color:#0f172a}nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;border-bottom:1px solid #e2e8f0}.hero{display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:center;padding:4rem 2rem;max-width:1000px;margin:auto}.hero h1{font-size:2.4rem;margin:0 0 .6rem}.mock{height:280px;border-radius:14px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);display:flex;align-items:center;justify-content:center;color:#6366f1;font-weight:600}.btn{display:inline-block;background:#4f46e5;color:#fff;padding:.7rem 1.5rem;border-radius:8px;text-decoration:none;margin-top:.8rem}.logos{display:flex;gap:1.2rem;justify-content:center;padding:1.5rem;color:#94a3b8;font-size:.85rem}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;max-width:1000px;margin:auto;padding:2rem}.feature{border:1px solid #e2e8f0;border-radius:12px;padding:1.2rem}footer{text-align:center;padding:2rem;color:#94a3b8;border-top:1px solid #e2e8f0}</style></head><body><nav><b>MonProduit</b><span style="color:#64748b">Fonctionnalités · Tarifs · Contact</span></nav><section class="hero"><div><h1>Le produit qui change tout</h1><p style="color:#64748b">Description courte et percutante, comme sur le site de référence.</p><a class="btn" href="#">Essayer gratuitement</a></div><div class="mock">Capture du produit</div></section><div class="logos">Ils nous font confiance : Acme · StartupX · DataCorp · FinCo</div><section class="features"><div class="feature"><b>Rapide</b><p style="color:#64748b;font-size:.85rem">Chargement instantané.</p></div><div class="feature"><b>Sécurisé</b><p style="color:#64748b;font-size:.85rem">Chiffrement de bout en bout.</p></div><div class="feature"><b>Simple</b><p style="color:#64748b;font-size:.85rem">Prise en main en 5 minutes.</p></div></section><footer>© 2026 MonProduit — reproduction de structure</footer></body></html>`,
  },
  {
    manifest: {
      id: "ui-mockup",
      name: "UI Mockup",
      version: "1.0.0",
      description: "Mockup d'interface haute-fidélité : composants, états, grille.",
      triggers: ["mockup", "maquette haute-fidélité", "ui mockup", "mock-up", "maquette interface", "hi-fi"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# UI Mockup Template
Mockup d'interface en haute-fidélité : grille de composants (boutons, inputs, cartes, badges, modales), états (normal, hover, focus, disabled, error), sections annotées. Utilise les tokens du DESIGN.md actif. Rendu net, pixels alignés.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;color:#0f172a;padding:2rem}.wrap{max-width:900px;margin:auto}h1{font-size:1.5rem;margin:0 0 .4rem}.sub{color:#64748b;font-size:.9rem;margin-bottom:1.5rem}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem}.box{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1rem}.box h3{font-size:.75rem;text-transform:uppercase;color:#94a3b8;letter-spacing:.05em;margin:0 0 .8rem}.btn{display:inline-block;padding:.5rem 1.1rem;border-radius:8px;font-size:.85rem;font-weight:600;border:0;cursor:pointer}.btn.primary{background:#4f46e5;color:#fff}.btn.primary:hover{background:#4338ca}.btn.primary:focus{outline:none;box-shadow:0 0 0 3px rgba(79,70,229,.3)}.btn.secondary{background:#fff;border:1px solid #cbd5e1;color:#0f172a}.btn.ghost{background:transparent;color:#64748b}.btn:disabled{opacity:.5;cursor:not-allowed}.btn.error{background:#ef4444;color:#fff}input{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:8px;padding:.5rem .7rem;font-size:.85rem;margin-bottom:.6rem}input:focus{outline:none;border-color:#4f46e5;box-shadow:0 0 0 3px rgba(79,70,229,.15)}input.err{border-color:#ef4444;background:#fef2f2}.badge{display:inline-block;font-size:.7rem;border-radius:999px;padding:.2rem .7rem;font-weight:600}.badge.info{background:#eef2ff;color:#4f46e5}.badge.ok{background:#f0fdf4;color:#16a34a}.badge.warn{background:#fef3c7;color:#d97706}.card{border:1px solid #e2e8f0;border-radius:10px;padding:.8rem}.note{font-size:.68rem;color:#94a3b8;margin-top:.5rem}</style></head><body><div class="wrap"><h1>UI Mockup — Kit composants</h1><p class="sub">États et variantes · palette du design system actif</p><div class="grid"><div class="box"><h3>Boutons</h3><button class="btn primary">Primaire</button><br><br><button class="btn secondary">Secondaire</button><br><br><button class="btn ghost">Ghost</button><br><br><button class="btn primary" disabled>Désactivé</button><br><br><button class="btn error">Erreur</button><div class="note">Normal · Hover · Focus · Disabled · Erreur</div></div><div class="box"><h3>Champs</h3><input placeholder="Normal"><input class="err" placeholder="Erreur" value=""><div class="note">Focus (anneau), état erreur</div></div><div class="box"><h3>Badges</h3><span class="badge info">Info</span> <span class="badge ok">Succès</span> <span class="badge warn">Alerte</span><div class="note">Variantes sémantiques</div></div><div class="box"><h3>Carte</h3><div class="card"><b>Titre</b><p style="color:#64748b;font-size:.8rem;margin:.3rem 0">Description avec surface et rayon du design system.</p><button class="btn primary" style="font-size:.75rem;padding:.4rem .9rem">Action</button></div><div class="note">Composant complet</div></div></div></div></body></html>`,
  },
  {
    manifest: {
      id: "wireframe",
      name: "Maquette filaire",
      version: "1.0.0",
      description: "Wireframe en niveaux de gris : layout, blocs, annotations.",
      triggers: ["wireframe", "maquette filaire", "filaire", "squelette", "low-fi", "structure page", "zonage"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Wireframe Template
Wireframe basse-fidélité en niveaux de gris : blocs structurés (nav, hero, sections, footer), lignes de texte factices, annotations en petits labels gris. Aucune couleur, aucun contenu réel. Priorité au layout et à la hiérarchie.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:ui-monospace,monospace;margin:0;background:#fff;color:#374151;padding:2rem}.page{max-width:900px;margin:auto;border:2px dashed #9ca3af;border-radius:10px;padding:1.2rem}.block{border:1px solid #d1d5db;background:#f9fafb;border-radius:6px;padding:.8rem;margin-bottom:.8rem;position:relative}.block .label{position:absolute;top:-.6rem;left:.6rem;background:#fff;font-size:.6rem;color:#6b7280;padding:0 .3rem;letter-spacing:.04em}.row{display:flex;gap:.8rem}.row .block{flex:1;margin-bottom:0}.line{height:8px;background:#e5e7eb;border-radius:4px;margin:.3rem 0}.line.w{width:60%}.line.s{width:40%}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem}.nav{display:flex;justify-content:space-between;align-items:center}.logo{width:70px;height:18px;background:#d1d5db;border-radius:3px}</style></head><body><div class="page"><div class="block nav"><div class="logo"></div><span style="font-size:.65rem;color:#9ca3af">Lien 1 · Lien 2 · Lien 3 · CTA</span></div><div class="block"><span class="label">HERO</span><div class="line w"></div><div class="line s"></div><div class="line" style="width:80%"></div></div><div class="block"><span class="label">CARACTÉRISTIQUES (3 colonnes)</span><div class="grid3"><div><div class="line"></div><div class="line s"></div></div><div><div class="line"></div><div class="line s"></div></div><div><div class="line"></div><div class="line s"></div></div></div></div><div class="row"><div class="block"><span class="label">IMAGE</span><div style="height:120px;background:#e5e7eb;border-radius:4px"></div></div><div class="block"><span class="label">TEXTE</span><div class="line"></div><div class="line"></div><div class="line s"></div></div></div><div class="block"><span class="label">FOOTER</span><div class="line" style="width:50%"></div></div></div></body></html>`,
  },
  {
    manifest: {
      id: "documents",
      name: "Document",
      version: "1.0.0",
      description: "Document imprimable stylé : lettre, contrat, CV, rapport.",
      triggers: ["document", "lettre", "contrat", "cv", "curriculum", "memo", "note interne", "document imprimable"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Documents Template
Document imprimable (max 800px, prêt pour print) : en-tête (logo/nom, coordonnées), titre, sections structurées, tableaux, pied de page. Ton sobre et professionnel, respecte les tokens. Ajoute @media print pour un rendu papier propre.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:Georgia,serif;margin:0;background:#f3f4f6;padding:2rem}.sheet{max-width:800px;margin:auto;background:#fff;padding:2.5rem;box-shadow:0 2px 12px rgba(0,0,0,.08);color:#1f2937}.head{display:flex;justify-content:space-between;border-bottom:2px solid #1f2937;padding-bottom:1rem}.head h1{margin:0;font-size:1.4rem}.meta{display:flex;gap:2rem;margin:1.2rem 0}.meta div{font-size:.85rem}.meta b{display:block;font-size:.7rem;text-transform:uppercase;color:#6b7280;letter-spacing:.05em}h2{font-size:1rem;margin:1.4rem 0 .5rem;border-bottom:1px solid #e5e7eb;padding-bottom:.3rem}p{font-size:.9rem;line-height:1.6;margin:.4rem 0}table{width:100%;border-collapse:collapse;font-size:.85rem;margin:.8rem 0}th,td{text-align:left;padding:.5rem;border-bottom:1px solid #e5e7eb}th{background:#f9fafb}.sig{margin-top:2.5rem;font-size:.85rem}@media print{body{background:#fff;padding:0}.sheet{box-shadow:none;padding:1rem}}</style></head><body><div class="sheet"><div class="head"><div><h1>Lettre de mission</h1><small style="color:#6b7280">N° LM-2026-018</small></div><div style="text-align:right;font-size:.85rem"><b>Ma Société</b><br>12 rue Exemple<br>75001 Paris</div></div><div class="meta"><div><b>Émetteur</b>Alex Dubois, Directeur</div><div><b>Bénéficiaire</b>Société Client<br>contact@client.fr</div><div><b>Date</b>12 août 2026</div></div><h2>Objet</h2><p>Mission de conseil en design produit pour la période du 1er septembre au 31 octobre 2026.</p><h2>Périmètre</h2><p>Audit UX, refonte de l'interface principale, mise en place d'un design system interne, accompagnement de l'équipe développement.</p><h2>Conditions</h2><table><tr><th>Poste</th><th>Montant</th></tr><tr><td>Forfait global</td><td>12 000 € HT</td></tr><tr><td>Déplacement</td><td>Facturés au réel</td></tr></table><div class="sig">Fait à Paris, le 12 août 2026<br><br><b>Alex Dubois</b></div></div></body></html>`,
  },
  {
    manifest: {
      id: "dynamic",
      name: "Artefact dynamique",
      version: "1.0.0",
      description: "Artefact interactif / animé : micro-animations, transitions, WebGL.",
      triggers: ["dynamique", "interactif", "animé", "animation", "transition", "webgl", "3d", "effet", "motion"],
      kind: "web",
      license: "Apache-2.0 (concept inspiré des outils de design courants)",
    },
    skillMd: `# Dynamic Artefact Template
Artefact interactif ou animé : micro-animations CSS/JS, transitions fluides, parallaxe, défilement animé. Pour la 3D/WebGL : autorisé d'utiliser Three.js via CDN (exception à la règle « pas de CDN »), avec fallback gracieux si le chargement échoue. Le contenu doit rester lisible et accessible (prefers-reduced-motion).`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#0f172a;color:#f8fafc;overflow-x:hidden}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:2rem}.orb{width:160px;height:160px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#818cf8,#4f46e5);animation:float 4s ease-in-out infinite;margin-bottom:2rem;box-shadow:0 0 60px rgba(129,140,248,.5)}@keyframes float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-22px) scale(1.05)}}.hero h1{font-size:2.6rem;margin:0 0 .6rem;animation:rise .8s ease-out both}.hero p{color:#94a3b8;animation:rise .8s .15s ease-out both}.btn{display:inline-block;background:#818cf8;color:#0f172a;padding:.8rem 1.8rem;border-radius:10px;font-weight:700;text-decoration:none;margin-top:1.2rem;transition:transform .2s,box-shadow .2s;animation:rise .8s .3s ease-out both}.btn:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(129,140,248,.4)}@keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.2rem;max-width:900px;margin:auto;padding:3rem 1.5rem}.card{background:#1e293b;border:1px solid #334155;border-radius:14px;padding:1.5rem;opacity:0;transform:translateY(30px);transition:opacity .6s,transform .6s}.card.visible{opacity:1;transform:none}.card:hover{border-color:#818cf8}.card b{display:block;margin-bottom:.4rem}.card p{color:#94a3b8;font-size:.88rem;margin:0}@media (prefers-reduced-motion:reduce){.orb,.hero h1,.hero p,.btn{animation:none}.card{opacity:1;transform:none}}</style></head><body><section class="hero"><div class="orb"></div><h1>Artefact dynamique</h1><p>Micro-animations, défilement révélé, interactions fluides.</p><a class="btn" href="#cards">Découvrir ↓</a></section><section class="cards" id="cards"><div class="card"><b>Card 1</b><p>Apparaît au défilement avec une transition douce.</p></div><div class="card"><b>Card 2</b><p>Le survol éclaire la bordure.</p></div><div class="card"><b>Card 3</b><p>Respecte prefers-reduced-motion.</p></div></section><script>const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.2});document.querySelectorAll(".card").forEach(c=>io.observe(c));</script></body></html>`,
  },
  {
    manifest: {
      id: "wireframe-annotated",
      name: "Maquette filaire annotée",
      version: "1.0.0",
      description: "Wireframe avec annotations de décision : zones, notes, flèches.",
      triggers: ["wireframe annoté", "maquette annotée", "annotations", "notes de conception", "wireframe avec notes"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Wireframe Annotated Template
Wireframe en niveaux de gris avec annotations de conception : chaque zone (nav, hero, sections) porte un label et une note expliquant la décision (ex. « CTA primaire ici — conversion »). Flèches et numéros pour relier les zones. Aucune couleur, aucun contenu réel.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:ui-monospace,monospace;margin:0;background:#fff;color:#374151;padding:2rem}.page{max-width:900px;margin:auto;border:2px dashed #9ca3af;border-radius:10px;padding:1.4rem}.zone{border:1px solid #d1d5db;background:#f9fafb;border-radius:6px;padding:.8rem;margin-bottom:1rem;position:relative}.tag{position:absolute;top:-.6rem;left:.6rem;background:#fff;font-size:.6rem;color:#6b7280;padding:0 .3rem;border:1px solid #d1d5db;border-radius:3px}.note{font-size:.62rem;color:#9ca3af;margin-top:.5rem;border-left:2px solid #d1d5db;padding-left:.5rem}.line{height:8px;background:#e5e7eb;border-radius:4px;margin:.3rem 0}.line.w{width:60%}.line.s{width:40%}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem}.nav{display:flex;justify-content:space-between;align-items:center}.logo{width:70px;height:18px;background:#d1d5db;border-radius:3px}</style></head><body><div class="page"><div class="zone nav"><div class="logo"></div><span style="font-size:.65rem;color:#9ca3af">Lien 1 · Lien 2 · CTA</span><span class="tag">NAV — 01</span></div><div class="note">Ancre sticky. Logo à gauche, CTA à droite pour la conversion (pattern éprouvé).</div><div class="zone"><span class="tag">HERO — 02</span><div class="line w"></div><div class="line s"></div><div class="line" style="width:80%"></div></div><div class="note">Message principal + sous-titre. Le CTA reprend l'accent du design system.</div><div class="zone"><span class="tag">FONCTIONNALITÉS — 03</span><div class="grid3"><div><div class="line"></div><div class="line s"></div></div><div><div class="line"></div><div class="line s"></div></div><div><div class="line"></div><div class="line s"></div></div></div></div><div class="note">3 colonnes égales — hiérarchie par taille de titre, pas par couleur.</div><div class="zone"><span class="tag">FOOTER — 04</span><div class="line" style="width:50%"></div></div><div class="note">Liens secondaires + mentions légales. Fond différent de la page.</div></div></body></html>`,
  },
  {
    manifest: {
      id: "mobile-onboarding",
      name: "Onboarding mobile",
      version: "1.0.0",
      description: "Écrans d'onboarding : points, illustrations, étapes.",
      triggers: ["onboarding", "bienvenue app", "première utilisation", "tutoriel mobile", "intro app"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Mobile Onboarding Template
Écrans d'onboarding dans un cadre téléphone : 3 étapes (bénéfice, démo, CTA), indicateur de progression (points), boutons Suivant/Passer, navigation par swipe ou clic. Illustrations simples en CSS. Respecte les tokens du DESIGN.md.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh}.phone{width:330px;height:680px;background:#fff;border-radius:36px;border:8px solid #0f172a;overflow:hidden;position:relative;display:flex;flex-direction:column}.screen{flex:1;display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem}.screen.active{display:flex}.art{width:130px;height:130px;border-radius:30px;background:linear-gradient(135deg,#c7d2fe,#818cf8);display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin-bottom:1.5rem}.screen h1{font-size:1.4rem;margin:0 0 .5rem}.screen p{color:#64748b;font-size:.9rem;line-height:1.5;margin:0}.dots{display:flex;gap:.4rem;justify-content:center;padding:.8rem}.dot{width:8px;height:8px;border-radius:999px;background:#e2e8f0}.dot.on{background:#4f46e5}.btns{display:flex;gap:.6rem;padding:0 1.5rem 1.5rem}.btn{flex:1;padding:.7rem;border-radius:10px;border:0;font-weight:600;cursor:pointer;font-size:.9rem}.btn.primary{background:#4f46e5;color:#fff}.btn.ghost{background:transparent;color:#64748b}</style></head><body><div class="phone"><div class="screen active"><div class="art">📊</div><h1>Suivez vos objectifs</h1><p>Visualisez vos progrès en temps réel avec des graphiques clairs.</p></div><div class="screen"><div class="art">🔔</div><h1>Restez informé</h1><p>Recevez des rappels intelligents au bon moment, jamais trop.</p></div><div class="screen"><div class="art">🚀</div><h1>C'est parti</h1><p>Créez votre compte en 30 secondes et lancez-vous.</p></div><div class="dots"><span class="dot on"></span><span class="dot"></span><span class="dot"></span></div><div class="btns"><button class="btn ghost" onclick="skip()">Passer</button><button class="btn primary" onclick="next()">Suivant</button></div></div><script>let i=0;const s=document.querySelectorAll(".screen"),d=document.querySelectorAll(".dot"),b=document.querySelector(".btns .primary");function show(){s.forEach((x,j)=>x.classList.toggle("active",j===i));d.forEach((x,j)=>x.classList.toggle("on",j===i));b.textContent=i===s.length-1?"Commencer":"Suivant"}function next(){i=Math.min(i+1,s.length-1);show()}function skip(){i=s.length-1;show()}</script></body></html>`,
  },
  {
    manifest: {
      id: "social-carousel",
      name: "Carrousel réseaux sociaux",
      version: "1.0.0",
      description: "Carrousel de slides pour réseaux sociaux (Instagram, LinkedIn…).",
      triggers: ["carrousel", "slides réseaux sociaux", "post carrousel", "instagram", "linkedin post", "contenu social"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Social Carousel Template
Carrousel de slides 1:1 (format réseaux sociaux) : slide de couverture (titre accrocheur), 3-5 slides de contenu (points clés, chiffres, citations), slide finale (CTA, logo). Navigation par clic ou flèches, numéro de slide « 2/5 ». Design percutant, lisible en miniature.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh}.carousel{width:420px;max-width:92vw;position:relative}.slide{display:none;aspect-ratio:1;border-radius:18px;background:#fff;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;box-sizing:border-box}.slide.active{display:flex}.slide .kicker{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#4f46e5;font-weight:700;margin-bottom:.8rem}.slide h2{font-size:1.7rem;margin:0 0 .8rem;line-height:1.2}.slide p{color:#64748b;font-size:.95rem;margin:0}.big{font-size:3rem;font-weight:800;color:#0f172a;margin:.5rem 0}.cta{background:#4f46e5;color:#fff;padding:.7rem 1.6rem;border-radius:999px;font-weight:700;font-size:.9rem}.nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.9);border:0;border-radius:50%;width:38px;height:38px;font-size:1.1rem;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)}.nav.prev{left:-46px}.nav.next{right:-46px}.counter{position:absolute;bottom:-30px;left:0;right:0;text-align:center;color:#64748b;font-size:.8rem}</style></head><body><div class="carousel"><div class="slide active"><div class="kicker">Design · 2026</div><h2>5 tendances UI qui dominent cette année</h2><p>Un carrousel pour briller sur LinkedIn</p></div><div class="slide"><div class="kicker">01</div><h2>Le dark mode n'est plus une option</h2><p>78% des apps leaders le proposent par défaut.</p></div><div class="slide"><div class="kicker">02</div><h2>Micro-interactions</h2><p>Le détail qui transforme l'expérience.</p></div><div class="slide"><div class="kicker">03</div><div class="big">−40%</div><h2>de temps de chargement</h2><p>grâce aux design systems compilés.</p></div><div class="slide"><div class="kicker">BONUS</div><h2>Suivez-moi pour la suite</h2><div class="cta">Voir le carrousel complet</div></div><button class="nav prev" onclick="mv(-1)">‹</button><button class="nav next" onclick="mv(1)">›</button><div class="counter"><span id="c">1</span>/5</div></div><script>let i=0;const s=document.querySelectorAll(".slide"),c=document.getElementById("c");function mv(d){i=(i+d+s.length)%s.length;s.forEach((x,j)=>x.classList.toggle("active",j===i));c.textContent=i+1}</script></body></html>`,
  },
  {
    manifest: {
      id: "email-marketing",
      name: "Email marketing",
      version: "1.0.0",
      description: "Email promotionnel : offre, visuels, CTA, désinscription.",
      triggers: ["email marketing", "email promo", "campagne promo", "email commercial", "promotion email"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Email Marketing Template
Email promotionnel (max 600px, styles inline-friendly) : préheader, bandeau offre (visuel, titre, code promo), bloc produits ou avantages, CTA principal répété, preuve sociale, pied de page (désinscription, adresse). Ton persuasif mais honnête.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f1f5f9;padding:2rem}.mail{max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.06)}.pre{background:#0f172a;color:#94a3b8;text-align:center;font-size:.72rem;padding:.5rem}.hero{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-align:center;padding:2.4rem 1.5rem}.hero .tag{display:inline-block;background:rgba(255,255,255,.2);border-radius:999px;padding:.2rem .8rem;font-size:.72rem;font-weight:600;margin-bottom:.8rem}.hero h1{font-size:1.7rem;margin:0 0 .4rem}.hero p{opacity:.9;margin:0 0 1rem;font-size:.9rem}.cta{display:inline-block;background:#fff;color:#4f46e5;padding:.7rem 1.8rem;border-radius:999px;font-weight:700;text-decoration:none}.body{padding:1.6rem}.code{text-align:center;background:#f5f3ff;border:2px dashed #c4b5fd;border-radius:10px;padding:1rem;margin-bottom:1.4rem}.code b{font-size:1.3rem;letter-spacing:.1em;color:#4f46e5}.perks{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;text-align:center}.perk{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:.8rem;font-size:.78rem}.perk b{display:block;font-size:1rem;color:#0f172a}.cta2{display:block;text-align:center;background:#4f46e5;color:#fff;text-decoration:none;border-radius:10px;padding:.9rem;font-weight:700;margin-top:1.4rem}.foot{background:#f8fafc;text-align:center;padding:1rem;color:#94a3b8;font-size:.72rem}.foot a{color:#64748b;margin:0 .3rem}</style></head><body><div class="mail"><div class="pre">Offre exclusive réservée aux abonnés — vue dans le navigateur</div><div class="hero"><span class="tag">OFFRE D'ÉTÉ</span><h1>−25% sur tout le site</h1><p>Jusqu'au 31 août, avec le code ci-dessous</p><a class="cta" href="#">J'en profite</a></div><div class="body"><div class="code">Code : <b>ETE25</b></div><div class="perks"><div class="perk"><b>Livraison</b>offerte dès 50€</div><div class="perk"><b>Retours</b>30 jours gratuits</div><div class="perk"><b>Support</b>7j/7 réactif</div></div><a class="cta2" href="#">Découvrir les offres →</a></div><div class="foot">MaBoutique · 12 rue Exemple, 75001 Paris<br><a href="#">Se désabonner</a> · <a href="#">Préférences</a></div></div></body></html>`,
  },
  {
    manifest: {
      id: "contact-widget",
      name: "Widget de contact",
      version: "1.0.0",
      description: "Widget flottant de contact : chat, formulaire, coordonnées.",
      triggers: ["widget contact", "bouton contact", "chat flottant", "formulaire de contact", "nous contacter"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Contact Widget Template
Widget flottant (coin bas-droit) : bouton rond avec icône, panneau dépliable (formulaire nom/email/message ou mini-chat), coordonnées (tél, email), confirmation d'envoi simulée. Accessible (aria), ouvert/fermé par clic, sans dépendance.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;min-height:100vh;display:flex;align-items:center;justify-content:center;color:#0f172a}h1{font-size:1.5rem;color:#64748b}.fab{position:fixed;bottom:1.4rem;right:1.4rem;width:56px;height:56px;border-radius:50%;background:#4f46e5;color:#fff;border:0;font-size:1.5rem;cursor:pointer;box-shadow:0 8px 24px rgba(79,70,229,.4);z-index:40}.panel{position:fixed;bottom:5.5rem;right:1.4rem;width:300px;background:#fff;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.15);padding:1.2rem;display:none;z-index:40}.panel.open{display:block}.panel h3{margin:0 0 .8rem;font-size:1rem}.panel input,.panel textarea{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:8px;padding:.55rem .7rem;margin-bottom:.6rem;font-size:.85rem;font-family:inherit}.panel input:focus,.panel textarea:focus{outline:none;border-color:#4f46e5}.panel button{width:100%;background:#4f46e5;color:#fff;border:0;border-radius:8px;padding:.6rem;font-weight:600;cursor:pointer}.coords{font-size:.75rem;color:#64748b;margin-top:.8rem;padding-top:.8rem;border-top:1px solid #e2e8f0}.ok{display:none;text-align:center;color:#16a34a;font-size:.85rem;padding:.6rem;background:#f0fdf4;border-radius:8px}.ok.show{display:block}</style></head><body><h1>Page d'exemple</h1><button class="fab" onclick="toggle()" aria-label="Contacter le support">💬</button><div class="panel" id="p"><h3>Comment pouvons-nous aider ?</h3><form id="f" onsubmit="send(event)"><input placeholder="Votre nom" required><input type="email" placeholder="Email" required><textarea rows="3" placeholder="Votre message…" required></textarea><button type="submit">Envoyer</button></form><div class="ok" id="ok">✓ Message envoyé, nous revenons vite !</div><div class="coords">📞 01 42 00 00 00<br>✉ support@exemple.com</div></div><script>function toggle(){document.getElementById("p").classList.toggle("open")}function send(e){e.preventDefault();document.getElementById("f").style.display="none";document.getElementById("ok").classList.add("show")}</script></body></html>`,
  },
  {
    manifest: {
      id: "image-poster",
      name: "Affiche",
      version: "1.0.0",
      description: "Affiche / poster : titre fort, composition graphique, dates.",
      triggers: ["affiche", "poster", "flyer", "annonce visuelle", "événement visuel"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Image Poster Template
Affiche grand format (ratio portrait 3:4) : titre typographique massif, composition graphique (formes CSS, dégradés), informations clés (date, lieu, prix), CTA discret. Fort contraste, impact visuel immédiat, respecte les tokens du DESIGN.md.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#111;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}.poster{width:420px;max-width:90vw;aspect-ratio:3/4;background:linear-gradient(160deg,#f43f5e,#7c3aed 55%,#0f172a 55%);border-radius:6px;position:relative;overflow:hidden;color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:2rem;box-sizing:border-box}.ring{position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;border:28px solid rgba(255,255,255,.15)}.tag{font-size:.7rem;text-transform:uppercase;letter-spacing:.25em;opacity:.9}.title{font-size:2.6rem;font-weight:800;line-height:1.05;margin:.6rem 0;text-transform:uppercase}.sub{font-size:.85rem;opacity:.85;max-width:260px;line-height:1.5}.info{border-top:2px solid rgba(255,255,255,.6);padding-top:.8rem;font-size:.8rem;display:flex;justify-content:space-between;gap:1rem;text-transform:uppercase;letter-spacing:.06em}</style></head><body><div class="poster"><div class="ring"></div><div><div class="tag">Festival · Édition 2026</div><div class="title">Néons<br>en fête</div></div><div><div class="sub">Trois nuits de musique électronique, arts visuels et performances immersives.</div><div class="info"><span>14–16 NOV</span><span>PARIS</span><span>DÈS 25€</span></div></div></div></body></html>`,
  },
  {
    manifest: {
      id: "webgl-experience",
      name: "Expérience WebGL",
      version: "1.0.0",
      description: "Expérience 3D immersive (Three.js via CDN, exception autorisée).",
      triggers: ["webgl", "expérience 3d", "scene 3d", "three.js", "immersif", "objet 3d", "particules 3d"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# WebGL Experience Template
Expérience 3D immersive avec Three.js via CDN (exception à la règle « pas de CDN », autorisée pour ce template). Règles : (1) charger Three.js depuis unpkg/jsdelivr avec fallback gracieux si le chargement échoue (message + rendu 2D) ; (2) scène simple et robuste (un objet, rotation douce, lumière) ; (3) overlay UI en HTML par-dessus le canvas ; (4) respecter prefers-reduced-motion ; (5) ne jamais bloquer l'interaction.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;overflow:hidden;background:#0a0a12;color:#f8fafc}canvas{display:block}.ui{position:fixed;bottom:2rem;left:2rem;z-index:10;background:rgba(10,10,18,.7);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:1rem 1.4rem}.ui h1{font-size:1.1rem;margin:0 0 .2rem}.ui p{font-size:.8rem;color:#94a3b8;margin:0}.fallback{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#0a0a12;z-index:5;display:none}.fallback.show{display:flex}.fallback p{max-width:360px;text-align:center;color:#94a3b8;font-size:.9rem}</style></head><body><div class="ui"><h1>Orbe 3D</h1><p>Faites glisser pour faire tourner</p></div><div class="fallback" id="fb"><p>WebGL indisponible — activez l'accélération matérielle pour voir la scène 3D.</p></div><script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script><script>if(typeof THREE==="undefined"){document.getElementById("fb").classList.add("show")}else{const scene=new THREE.Scene();const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,100);cam.position.z=3;const ren=new THREE.WebGLRenderer({antialias:true});ren.setSize(innerWidth,innerHeight);ren.setPixelRatio(Math.min(devicePixelRatio,2));document.body.appendChild(ren.domElement);const geo=new THREE.IcosahedronGeometry(1.2,1);const mat=new THREE.MeshStandardMaterial({color:0x818cf8,metalness:.4,roughness:.25,flatShading:true});const mesh=new THREE.Mesh(geo,mat);scene.add(mesh);scene.add(new THREE.AmbientLight(0xffffff,.6));const l=new THREE.DirectionalLight(0xffffff,1.4);l.position.set(2,3,4);scene.add(l);let rx=0,ry=0;let dragging=false,px=0,py=0;addEventListener("mousedown",e=>{dragging=true;px=e.clientX;py=e.clientY});addEventListener("mouseup",()=>dragging=false);addEventListener("mousemove",e=>{if(!dragging)return;ry+=(e.clientX-px)*.01;rx+=(e.clientY-py)*.01;px=e.clientX;py=e.clientY});addEventListener("resize",()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)});const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;function tick(){if(!reduce)mesh.rotation.y+=.005;mesh.rotation.x=rx;mesh.rotation.y+=ry;ren.render(scene,cam);requestAnimationFrame(tick)}tick()}</script></body></html>`,
  },
  {
    manifest: {
      id: "live-dashboard",
      name: "Dashboard temps réel",
      version: "1.0.0",
      description: "Dashboard live : métriques qui bougent, flux, alertes.",
      triggers: ["dashboard temps réel", "live dashboard", "monitoring temps réel", "flux live", "métriques en direct"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Live Dashboard Template
Dashboard temps réel : KPI qui se mettent à jour toutes les N secondes (simulation JS), graphique en direct (sparkline animée), flux d'événements (liste qui s'enrichit), badge « LIVE ». Données simulées clairement, sans dépendance.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#0f172a;color:#f8fafc;padding:1.5rem;min-height:100vh}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem}.live{display:flex;align-items:center;gap:.4rem;font-size:.75rem;color:#f8fafc;background:#dc2626;border-radius:999px;padding:.25rem .8rem;font-weight:700}.live::before{content:"";width:7px;height:7px;border-radius:50%;background:#fff;animation:pulse 1.2s infinite}@keyframes pulse{50%{opacity:.3}}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.8rem;margin-bottom:1rem}.kpi{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:.9rem}.kpi small{color:#94a3b8;font-size:.72rem;text-transform:uppercase;letter-spacing:.05em}.kpi b{font-size:1.5rem;display:block;margin-top:.2rem}.kpi .delta{font-size:.75rem;color:#22c55e}.row{display:grid;grid-template-columns:2fr 1fr;gap:.8rem}.panel{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:1rem}.panel h3{margin:0 0 .8rem;font-size:.85rem;color:#94a3b8}.chart{display:flex;align-items:flex-end;gap:3px;height:120px}.bar{flex:1;background:linear-gradient(180deg,#818cf8,#4f46e5);border-radius:3px 3px 0 0;min-height:4px;transition:height .4s}.feed{list-style:none;margin:0;padding:0;font-size:.8rem;max-height:120px;overflow:hidden}.feed li{display:flex;justify-content:space-between;padding:.35rem 0;border-bottom:1px solid #334155}.feed .t{color:#94a3b8;font-size:.7rem}</style></head><body><div class="head"><h1 style="margin:0;font-size:1.2rem">Ventes en direct</h1><span class="live">LIVE</span></div><div class="grid" id="kpis"></div><div class="row"><div class="panel"><h3>Activité (30 dernières s)</h3><div class="chart" id="chart"></div></div><div class="panel"><h3>Événements récents</h3><ul class="feed" id="feed"></ul></div></div><script>const N=12;const names=["Commande #","Inscription","Remboursement","Nouveau client"];let hist=Array(N).fill(12);function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}function kpi(label,val,delta){return '<div class="kpi"><small>'+label+'</small><b>'+val+'</b><span class="delta">'+delta+'</span></div>'}function draw(){let total=hist.reduce((a,b)=>a+b,0);document.getElementById("kpis").innerHTML=kpi("Ventes du jour","€"+(total*47).toLocaleString("fr-FR"),"▲ +12%")+kpi("Panier moyen","€"+Math.round(47+Math.sin(Date.now()/5000)*6).toLocaleString("fr-FR"),"▲ +3%")+kpi("Visiteurs",""+rand(800,1200),"▼ -2%")+kpi("Conversion",""+(3.2+Math.sin(Date.now()/8000)*.4).toFixed(1)+"%","▲ +0.4");hist.push(rand(6,40));hist.shift();document.getElementById("chart").innerHTML=hist.map(h=>'<div class="bar" style="height:'+(h/40*100)+'%"></div>').join("");const feed=document.getElementById("feed");const li=document.createElement("li");li.innerHTML="<span>"+names[rand(0,names.length-1)]+rand(1000,9999)+"</span><span class='t'>"+new Date().toLocaleTimeString("fr-FR")+"</span>";feed.prepend(li);while(feed.children.length>5)feed.removeChild(feed.lastChild)}draw();setInterval(draw,2500);</script></body></html>`,
  },
  {
    manifest: {
      id: "github-dashboard",
      name: "Dashboard GitHub",
      version: "1.0.0",
      description: "Dashboard dev : repos, PRs, issues, activité.",
      triggers: ["github", "dashboard dev", "pull requests", "issues", "repos", "activité dev"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# GitHub Dashboard Template
Dashboard pour développeurs : en-tête (avatar, nom, stats repos/PRs/issues), liste des repos (nom, langue, stars), colonne PRs ouvertes (titre, branche, revues), issues récentes, graphique d'activité (barres par jour). Données de démo réalistes.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#0d1117;color:#e6edf3;padding:1.5rem}.head{display:flex;align-items:center;gap:1rem;margin-bottom:1.2rem}.avatar{width:56px;height:56px;border-radius:50%;background:#1f6feb;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.3rem}.stats{display:flex;gap:1.5rem}.stats b{display:block;font-size:1.1rem}.stats small{color:#8b949e}.grid{display:grid;grid-template-columns:1.4fr 1fr;gap:1rem}.card{background:#161b22;border:1px solid #30363d;border-radius:10px;padding:1rem;margin-bottom:1rem}.card h3{margin:0 0 .8rem;font-size:.85rem;color:#8b949e;text-transform:uppercase;letter-spacing:.05em}.repo{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid #21262d;font-size:.85rem}.repo .lang{font-size:.72rem;color:#8b949e}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:.4rem}.pr{display:flex;align-items:center;gap:.6rem;padding:.45rem 0;border-bottom:1px solid #21262d;font-size:.82rem}.pr .st{color:#3fb950}.issue{display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid #21262d;font-size:.82rem;color:#8b949e}.activity{display:flex;align-items:flex-end;gap:3px;height:70px;margin-top:.6rem}.act{flex:1;background:#1f6feb;border-radius:2px;min-height:4px;opacity:.8}</style></head><body><div class="head"><div class="avatar">AD</div><div><b>Alex Dubois</b><br><small style="color:#8b949e">@alexdubois · 128 contributions cette semaine</small></div><div class="stats" style="margin-left:auto"><div><b>24</b><small>Repos</small></div><div><b>312</b><small>Étoiles</small></div><div><b>8</b><small>PRs ouvertes</small></div></div></div><div class="grid"><div><div class="card"><h3>Dépôts récents</h3><div class="repo"><span><span class="dot" style="background:#f1e05a"></span>open-cooldesigner</span><span class="lang">TypeScript · 42★</span></div><div class="repo"><span><span class="dot" style="background:#3572A5"></span>api-gateway</span><span class="lang">Python · 18★</span></div><div class="repo"><span><span class="dot" style="background:#e34c26"></span>landing-kit</span><span class="lang">HTML · 9★</span></div></div><div class="card"><h3>Activité</h3><div class="activity" id="act"></div></div></div><div><div class="card"><h3>Pull requests</h3><div class="pr"><span class="st">●</span>feat: design system tokens<span style="margin-left:auto;color:#8b949e">#128</span></div><div class="pr"><span class="st">●</span>fix: preview sandbox<span style="margin-left:auto;color:#8b949e">#127</span></div><div class="pr"><span class="st">●</span>docs: README v2<span style="margin-left:auto;color:#8b949e">#126</span></div></div><div class="card"><h3>Issues</h3><div class="issue"><span>Le parser ignore les rgba</span><span>#125</span></div><div class="issue"><span>Export ZIP trop lent</span><span>#124</span></div><div class="issue"><span>Dark mode tweaks</span><span>#123</span></div></div></div></div><script>document.getElementById("act").innerHTML=Array.from({length:28},()=>'<div class="act" style="height:'+(10+Math.random()*90)+'%"></div>').join("")</script></body></html>`,
  },
  {
    manifest: {
      id: "team-okrs",
      name: "OKRs d'équipe",
      version: "1.0.0",
      description: "Tableau d'objectifs et résultats clés (OKR) d'équipe.",
      triggers: ["okr", "objectifs", "résultats clés", "objectifs équipe", "suivi objectifs", "kpi équipe"],
      kind: "web",
      license: "Apache-2.0 (importé et adapté d'Open Design)",
    },
    skillMd: `# Team OKRs Template
Tableau d'OKRs : objectif (titre + propriétaire + trimestre), 3-4 résultats clés par objectif avec barre de progression et valeur cible, statut (on track / at risk / behind), note de contexte. Design clair, données de démo réalistes.`,
    exampleHtml: `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;margin:0;background:#f8fafc;color:#0f172a;padding:1.5rem}.wrap{max-width:860px;margin:auto}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem}.head h1{font-size:1.3rem;margin:0}.head small{color:#64748b}.okr{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:1.2rem;margin-bottom:1rem}.obj{display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem}.obj b{font-size:1rem}.badge{font-size:.68rem;font-weight:700;border-radius:999px;padding:.2rem .7rem}.badge.on{background:#f0fdf4;color:#16a34a}.badge.risk{background:#fef3c7;color:#d97706}.badge.behind{background:#fef2f2;color:#dc2626}.kr{display:flex;align-items:center;gap:.8rem;padding:.45rem 0}.kr .txt{flex:1;font-size:.85rem}.kr .txt small{color:#64748b;display:block}.bar{width:120px;height:7px;background:#e2e8f0;border-radius:999px;overflow:hidden;flex-shrink:0}.bar i{display:block;height:100%;background:#4f46e5;border-radius:999px}.kr .val{width:64px;text-align:right;font-size:.78rem;font-weight:600;color:#64748b}</style></head><body><div class="wrap"><div class="head"><h1>OKRs — Équipe Produit · T3 2026</h1><small>Mise à jour : 12 août</small></div><div class="okr"><div class="obj"><b>🎯 O1 — Accélérer l'activation des nouveaux utilisateurs</b><span class="badge on">On track</span></div><div class="kr"><span class="txt">KR1 — Atteindre 35% d'activation à J7<small>Propriétaire : Ana</small></span><div class="bar"><i style="width:71%"></i></div><span class="val">71% · 25/35</span></div><div class="kr"><span class="txt">KR2 — Réduire le temps d'onboarding à 3 min<small>Propriétaire : B. Diallo</small></span><div class="bar"><i style="width:55%"></i></div><span class="val">55% · 5,4 min</span></div><div class="kr"><span class="txt">KR3 — 20% de références entre utilisateurs<small>Propriétaire : Sarah</small></span><div class="bar"><i style="width:40%"></i></div><span class="val">40% · 8/20</span></div></div><div class="okr"><div class="obj"><b>🎯 O2 — Consolider la fiabilité de la plateforme</b><span class="badge risk">At risk</span></div><div class="kr"><span class="txt">KR1 — 99,9% de disponibilité<small>Propriétaire : Ops</small></span><div class="bar"><i style="width:82%"></i></div><span class="val">82% · 99,92%</span></div><div class="kr"><span class="txt">KR2 — Temps de réponse < 200ms p95<small>Propriétaire : Ops</small></span><div class="bar"><i style="width:45%"></i></div><span class="val">45% · 340ms</span></div></div></div></body></html>`,
  },
];

export function getSkill(id: string): Skill | undefined {
  return SKILLS.find((s) => s.manifest.id === id);
}

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.manifest.id === id);
}

/**
 * Suggère le template le plus pertinent pour un prompt utilisateur,
 * par pondération des mots-clés déclencheurs (multi-mots ×2).
 * API de registre intentionnelle : utilisée par les tests et
 * réservée à la future suggestion automatique dans l'UI.
 */
export function suggestTemplate(prompt: string): Template | null {
  const lower = prompt.toLowerCase();
  let best: Template | null = null;
  let bestScore = 0;
  for (const t of TEMPLATES) {
    let score = 0;
    for (const trigger of t.manifest.triggers) {
      if (lower.includes(trigger.toLowerCase())) {
        score += trigger.length * (trigger.includes(" ") ? 2 : 1);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }
  return best;
}
