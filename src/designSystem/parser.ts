export interface ParsedDesignSystem {
  id: string;
  name: string;
  category: string;
  description: string;
  designMd: string;
  tokens: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    bodyFont: string;
    displayFont: string;
    sectionSpacing: string;
    contentPadding: string;
    radius: string;
  };
  tokensCss: string;
}

export function parseDesignSystem(id: string, raw: string): ParsedDesignSystem {
  const frontmatter = parseFrontmatter(raw);
  const hexes = extractHexes(raw);
  const bodyFont = extractFont(raw, "Body");
  const displayFont = extractFont(raw, "Display");
  const sectionSpacing = extractPx(raw, "Section spacing") ?? "72px";
  const contentPadding = extractPx(raw, "Content padding") ?? "24px 40px";
  const radius = extractPx(raw, "Border radius") ?? "8px";

  const tokens = {
    background: hexes[0] ?? "#ffffff",
    surface: hexes[1] ?? "#f5f5f5",
    text: hexes[2] ?? "#111111",
    textSecondary: hexes[3] ?? "#666666",
    accent: hexes[4] ?? "#3b82f6",
    accentHover: hexes[5] ?? "#2563eb",
    bodyFont: bodyFont ?? "Inter, system-ui, sans-serif",
    displayFont: displayFont ?? "Inter, system-ui, sans-serif",
    sectionSpacing,
    contentPadding,
    radius,
  };

  return {
    id,
    name: frontmatter.name ?? id,
    category: frontmatter.category ?? "Général",
    description: frontmatter.description ?? "",
    designMd: raw,
    tokens,
    tokensCss: buildTokensCss(tokens),
  };
}

export function parseFrontmatter(raw: string): Record<string, string> {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^(\w+):\s*(.+)$/.exec(line);
    if (kv) out[kv[1].trim()] = kv[2].trim();
  }
  return out;
}

export function extractHexes(raw: string): string[] {
  const re = /`(#[0-9a-fA-F]{3,8})`/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    out.push(m[1].toLowerCase());
  }
  return out;
}

export function extractFont(raw: string, role: "Body" | "Display"): string | null {
  const re = new RegExp(
    `\\*{0,2}${role}\\*{0,2}\\s*[:：]\\s*([^\\n,]+(?:,\\s*[^\\n,]+)*?)\\s*,\\s*\\d{3}`,
    "i",
  );
  const m = re.exec(raw);
  return m ? m[1].trim() : null;
}

export function extractPx(raw: string, label: string): string | null {
  const re = new RegExp(`${label}:\\s*([\\d]+px(?:\\s+[\\d]+px)?)`, "i");
  const m = re.exec(raw);
  return m ? m[1].trim() : null;
}

export function buildTokensCss(t: ParsedDesignSystem["tokens"]): string {
  return `:root {
  --color-background: ${t.background};
  --color-surface: ${t.surface};
  --color-foreground: ${t.text};
  --color-muted: ${t.textSecondary};
  --color-accent: ${t.accent};
  --color-accent-hover: ${t.accentHover};
  --font-body: ${t.bodyFont};
  --font-display: ${t.displayFont};
  --radius: ${t.radius};
  --spacing: ${t.sectionSpacing};
}`;
}

export function buildDesignSystemPreviewHtml(ds: ParsedDesignSystem): string {
  const t = ds.tokens;
  const swatches = [
    ["Canvas", t.background],
    ["Surface", t.surface],
    ["Texte", t.text],
    ["Texte secondaire", t.textSecondary],
    ["Accent", t.accent],
    ["Accent hover", t.accentHover],
  ]
    .map(
      ([label, color]) =>
        `<div class="swatch"><div class="swatch-color" style="background:${color}">${label}</div><div class="swatch-hex">${color}</div></div>`,
    )
    .join("");
  return `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>
:root{
  --bg:${t.background};--surface:${t.surface};--text:${t.text};--muted:${t.textSecondary};
  --accent:${t.accent};--accent-hover:${t.accentHover};--radius:${t.radius};--spacing:${t.sectionSpacing};
  --font-body:${t.bodyFont};--font-display:${t.displayFont};
}
*{box-sizing:border-box}
body{font-family:var(--font-body);margin:0;background:var(--bg);color:var(--text);line-height:1.6}
.wrap{max-width:960px;margin:0 auto;padding:var(--spacing) 24px}
header.nav{position:sticky;top:0;z-index:10;background:var(--bg);border-bottom:1px solid rgba(128,128,128,.2)}
.nav-inner{max-width:960px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;gap:16px}
.logo{font-family:var(--font-display);font-weight:700;font-size:1.1rem}
.nav-links{display:flex;gap:14px;flex:1}
.nav-links a{color:var(--muted);text-decoration:none;font-size:.9rem}
.nav-links a:hover{color:var(--text)}
.dropdown{position:relative}
.dropdown summary{cursor:pointer;list-style:none;color:var(--muted);font-size:.9rem;padding:4px 8px;border:1px solid transparent;border-radius:var(--radius)}
.dropdown summary:hover{color:var(--text);border-color:rgba(128,128,128,.3)}
.dropdown[open] summary{border-color:rgba(128,128,128,.3);background:var(--surface)}
.dropdown-menu{position:absolute;top:calc(100% + 6px);left:0;min-width:180px;background:var(--surface);border:1px solid rgba(128,128,128,.25);border-radius:var(--radius);box-shadow:0 8px 24px rgba(0,0,0,.15);padding:6px;z-index:20}
.dropdown-menu a{display:block;padding:7px 10px;border-radius:calc(var(--radius) / 2);color:var(--text);text-decoration:none;font-size:.88rem}
.dropdown-menu a:hover{background:var(--accent);color:#fff}
.hero{padding:calc(var(--spacing) * 1.2) 0 0}
.hero h1{font-family:var(--font-display);font-size:clamp(2rem,5vw,3.2rem);margin:0 0 8px;line-height:1.15}
.hero .sub{color:var(--muted);font-size:1.05rem;max-width:560px;margin:0 0 24px}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
h2.sec{font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:calc(var(--spacing) * 0.9) 0 12px;border-bottom:1px solid rgba(128,128,128,.2);padding-bottom:6px}
h3{font-family:var(--font-display);margin:18px 0 6px}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:.55rem 1.25rem;border-radius:var(--radius);border:0;font-family:var(--font-body);font-weight:600;font-size:.9rem;cursor:pointer;text-decoration:none}
.btn:hover{background:var(--accent-hover)}
.btn.secondary{background:transparent;color:var(--text);border:1px solid rgba(128,128,128,.4)}
.btn.secondary:hover{border-color:var(--text);background:transparent}
.btn.ghost{background:transparent;color:var(--muted)}
.btn.ghost:hover{color:var(--text)}
.btn:disabled{opacity:.5;cursor:not-allowed}
.badge{display:inline-block;background:var(--surface);border:1px solid rgba(128,128,128,.3);color:var(--muted);border-radius:999px;padding:2px 10px;font-size:.75rem;font-weight:600}
.badge.accent{background:var(--accent);color:#fff;border-color:transparent}
.type-scale div{margin-bottom:4px}
.t-display{font-family:var(--font-display);font-size:2.2rem;font-weight:700}
.t-h1{font-family:var(--font-display);font-size:1.8rem;font-weight:700}
.t-h2{font-family:var(--font-display);font-size:1.4rem;font-weight:600}
.t-h3{font-size:1.15rem;font-weight:600}
.t-h4{font-size:1rem;font-weight:600}
.t-body{font-size:1rem}
.t-caption{font-size:.8rem;color:var(--muted)}
.t-code{font-family:ui-monospace,monospace;font-size:.85rem;background:var(--surface);border:1px solid rgba(128,128,128,.2);border-radius:calc(var(--radius) / 2);padding:2px 6px}
label.field{display:block;font-size:.8rem;color:var(--muted);margin-bottom:4px}
input.field,select.field{width:100%;max-width:320px;background:var(--bg);color:var(--text);border:1px solid rgba(128,128,128,.35);border-radius:var(--radius);padding:8px 10px;font-family:var(--font-body);font-size:.9rem;outline:none}
input.field:focus,select.field:focus{border-color:var(--accent);box-shadow:0 0 0 3px ${t.accent}33}
.check{display:flex;align-items:center;gap:8px;font-size:.9rem}
.check input{accent-color:var(--accent)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.card{background:var(--surface);border:1px solid rgba(128,128,128,.18);border-radius:var(--radius);padding:16px}
.card .thumb{height:90px;border-radius:calc(var(--radius) / 2);background:linear-gradient(135deg,${t.accent}55,${t.accentHover}55);margin-bottom:12px}
.card h4{margin:0 0 4px;font-family:var(--font-display)}
.card p{margin:0 0 10px;font-size:.85rem;color:var(--muted)}
table{width:100%;border-collapse:collapse;font-size:.88rem}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid rgba(128,128,128,.18)}
th{color:var(--muted);font-weight:600;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em}
tbody tr:hover{background:var(--surface)}
.alert{border-radius:var(--radius);padding:10px 14px;font-size:.88rem;margin-bottom:8px;border:1px solid}
.alert.info{background:${t.accent}18;border-color:${t.accent}44;color:${isDark(t.accent) ? "#fff" : t.accent}}
.alert.ok{background:#16a34a18;border-color:#16a34a55;color:${isDark(t.background) ? "#4ade80" : "#15803d"}}
.alert.err{background:#dc262618;border-color:#dc262655;color:${isDark(t.background) ? "#f87171" : "#b91c1c"}}
footer.foot{margin-top:calc(var(--spacing) * 1.4);border-top:1px solid rgba(128,128,128,.2);padding:24px 0;color:var(--muted);font-size:.85rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
footer.foot a{color:var(--muted);text-decoration:none}
footer.foot a:hover{color:var(--text)}
</style></head><body>
<header class="nav"><div class="nav-inner">
  <span class="logo">${ds.name}</span>
  <nav class="nav-links">
    <a href="#composants">Composants</a>
    <a href="#typo">Typographie</a>
    <a href="#data">Données</a>
    <details class="dropdown">
      <summary>Menu déroulant ▾</summary>
      <div class="dropdown-menu">
        <a href="#composants">Boutons & badges</a>
        <a href="#typo">Échelle typographique</a>
        <a href="#data">Tableau & alertes</a>
        <a href="#hero">Haut de page</a>
      </div>
    </details>
  </nav>
</div></header>

<main class="wrap">
  <section class="hero" id="hero">
    <h1>${ds.name}</h1>
    <p class="sub">${ds.category} — ${ds.description || "Démo complète du design system."}</p>
    <div class="row">
      <button class="btn">Bouton principal</button>
      <button class="btn secondary">Secondaire</button>
      <button class="btn ghost">Ghost</button>
      <button class="btn" disabled>Désactivé</button>
    </div>
  </section>

  <h2 class="sec">Palette</h2>
  <div class="swatches row" style="gap:8px">${swatches}</div>

  <h2 class="sec" id="typo">Typographie</h2>
  <div class="type-scale">
    <div class="t-display">Display — Le renard brun saute</div>
    <div class="t-h1">Titre H1 — ${t.displayFont}</div>
    <div class="t-h2">Titre H2 — ${t.bodyFont}</div>
    <div class="t-h3">Titre H3</div>
    <div class="t-h4">Titre H4</div>
    <div class="t-body">Body — Le renard brun saute par-dessus le chien paresseux. 400, 1rem/1.6.</div>
    <div class="t-caption">Caption — texte secondaire, ${t.radius} de rayon, ${t.sectionSpacing} d'espacement.</div>
    <div class="t-body"><span class="t-code">code sample()</span> en ligne.</div>
  </div>

  <h2 class="sec" id="composants">Composants</h2>
  <div class="row" style="margin-bottom:14px">
    <span class="badge accent">Badge accent</span>
    <span class="badge">Badge neutre</span>
  </div>
  <div class="row" style="align-items:flex-end;margin-bottom:14px">
    <div style="flex:1;min-width:200px">
      <label class="field" for="f-email">Adresse e-mail</label>
      <input class="field" id="f-email" type="email" placeholder="vous@exemple.com">
    </div>
    <div style="flex:1;min-width:160px">
      <label class="field" for="f-cat">Catégorie</label>
      <select class="field" id="f-cat"><option>Tableau de bord</option><option>Landing page</option><option>Rapport</option></select>
    </div>
    <label class="check"><input type="checkbox" checked> Option cochée</label>
  </div>
  <div class="cards">
    <div class="card"><div class="thumb"></div><h4>Carte 1</h4><p>Surface, bordure et rayon ${t.radius} appliqués.</p><button class="btn">Action</button></div>
    <div class="card"><div class="thumb"></div><h4>Carte 2</h4><p>Grille responsive auto-fill pour tout format.</p><button class="btn secondary">Détails</button></div>
    <div class="card"><div class="thumb"></div><h4>Carte 3</h4><p>Typographie display ${t.displayFont}.</p><button class="btn ghost">Plus</button></div>
  </div>

  <h2 class="sec" id="data">Tableau & alertes</h2>
  <table>
    <thead><tr><th>Projet</th><th>Statut</th><th>Budget</th><th>Échéance</th></tr></thead>
    <tbody>
      <tr><td>Dashboard ventes</td><td><span class="badge accent">En cours</span></td><td>4 200 €</td><td>2026-09-30</td></tr>
      <tr><td>Landing produit</td><td><span class="badge">Brouillon</span></td><td>1 850 €</td><td>2026-10-15</td></tr>
      <tr><td>Rapport trimestriel</td><td><span class="badge accent">En cours</span></td><td>980 €</td><td>2026-08-28</td></tr>
    </tbody>
  </table>
  <div style="margin-top:16px">
    <div class="alert info">ℹ Info — synchronisation effectuée à l'instant.</div>
    <div class="alert ok">✓ Succès — export ZIP téléchargé.</div>
    <div class="alert err">✕ Erreur — connexion au fournisseur IA impossible.</div>
  </div>
</main>

<footer class="foot"><div class="wrap" style="padding:0;width:100%;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px">
  <span>© 2026 ${ds.name} — démo générée depuis DESIGN.md</span>
  <span><a href="#hero">Haut de page</a> · <a href="#composants">Composants</a> · <a href="#data">Données</a></span>
</div></footer>
</body></html>`;
}

export function buildDesignSystemThumbnailHtml(ds: ParsedDesignSystem): string {
  const t = ds.tokens;
  const chips = [
    t.background,
    t.surface,
    t.accent,
    t.text,
  ]
    .map(
      (c) =>
        `<span style="flex:1;height:100%;background:${c};border-right:1px solid rgba(128,128,128,.25)"></span>`,
    )
    .join("");
  return `<!doctype html><html lang="fr"><head><meta charset="UTF-8"><style>
body{margin:0;font-family:${t.bodyFont};display:flex;flex-direction:column;height:100%;background:${t.background}}
.bar{display:flex;height:22px;border-bottom:1px solid rgba(128,128,128,.25)}
.pill{display:inline-block;margin:6px 8px 0;padding:2px 10px;border-radius:999px;font-size:9px;font-weight:700;background:${t.accent};color:#fff;align-self:flex-start}
.line{height:6px;border-radius:3px;background:${t.surface};margin:5px 8px 0}
.line.short{width:55%}
.line.accent{background:${t.accent};width:40%}
</style></head><body>
<div class="bar">${chips}</div>
<span class="pill">${ds.name}</span>
<div class="line short"></div>
<div class="line"></div>
<div class="line accent"></div>
</body></html>`;
}

export function isDark(hex: string): boolean {
  const h = hex.replace("#", "");
  const full =
    h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}
