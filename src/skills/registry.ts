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
];

export function getSkill(id: string): Skill | undefined {
  return SKILLS.find((s) => s.manifest.id === id);
}

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.manifest.id === id);
}

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
