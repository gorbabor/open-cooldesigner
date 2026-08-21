import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import type { Artifact } from "@/types";
import type { ArtifactTweaks } from "@/skills/types";
import { useAppStore } from "@/store/appStore";
import { buildHtmlExport, downloadBlob } from "@/services/exportService";
import { cn } from "@/lib/cn";
import { Code2, ExternalLink, Eye, Loader2 } from "lucide-react";
import "@/lib/monacoSetup";

interface Props {
  artifact: Artifact | null;
  generating: boolean;
}

type Tab = "preview" | "code";

const PREVIEW_SNIPPET = `
<script>
  document.addEventListener('mouseup', () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      window.parent.postMessage({ type: 'ocd:selection', text: sel.toString().trim().slice(0, 2000) }, '*');
    }
  });
</script>`;

const ERROR_BANNER_SNIPPET = `
<script>
(function(){
  function showBanner(msg){
    var b = document.createElement("div");
    b.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:2147483647;background:#dc2626;color:#fff;font:12px/1.4 system-ui,sans-serif;padding:6px 10px;box-shadow:0 1px 4px rgba(0,0,0,.3)";
    b.textContent = "⚠ Erreur JavaScript dans la preview: " + msg;
    document.body.appendChild(b);
  }
  window.addEventListener("error", function(e){ showBanner(e.message || "erreur inconnue"); });
  window.addEventListener("unhandledrejection", function(e){ showBanner(String(e.reason && e.reason.message ? e.reason.message : e.reason)); });
})();
</script>`;

export default function CanvasPanel({ artifact, generating }: Props) {
  const [tab, setTab] = useState<Tab>("preview");
  const updateArtifact = useAppStore((s) => s.updateArtifact);
  const askSelection = useAppStore((s) => s.askSelection);
  const tweaks = useAppStore((s) => s.tweaks);
  const setTweaks = useAppStore((s) => s.setTweaks);
  const applyTweaksToProject = useAppStore((s) => s.applyTweaksToProject);
  const activeSkills = useAppStore((s) => s.activeSkills);
  const [askText, setAskText] = useState("");
  const [asking, setAsking] = useState(false);
  const [showTweaks, setShowTweaks] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const mainFile = useMemo(() => {
    if (!artifact) return null;
    return (
      artifact.files.find((f) => f.path === "index.html") ?? artifact.files[0]
    );
  }, [artifact]);

  const artifactTweaks = artifact
    ? mergeTweaks(tweaks[artifact.id])
    : undefined;

  const previewHtml = useMemo(() => {
    if (!mainFile) return "";
    const css =
      artifact?.files.find((f) => f.path === "styles.css")?.content ?? "";
    const js =
      artifact?.files.find((f) => f.path === "script.js")?.content ?? "";
    const t = artifactTweaks;
    const tweakCss = t
      ? `<style>
:root{
  --ocd-accent:${t.accent};
  --ocd-type-scale:${t.typeScale};
  --ocd-density:${t.density};
  --ocd-theme:${t.theme};
}
html[data-ocd-theme="dark"], body { filter: none; }
</style>
<script>
(function(){
  var t={accent:"${t.accent}",surface:"${t.surface}",textColor:"${t.textColor}",pageBg:"${t.pageBg}",fontFamily:"${t.fontFamily}",typeScale:${t.typeScale},density:${t.density},radius:${t.radius},theme:"${t.theme}"};
  var root=document.documentElement;
  root.style.setProperty("--accent",t.accent);
  root.style.setProperty("--color-accent",t.accent);
  root.style.setProperty("--primary",t.accent);
  root.style.setProperty("--surface",t.surface);
  root.style.setProperty("--color-surface",t.surface);
  root.style.setProperty("--card",t.surface);
  root.style.setProperty("--foreground",t.textColor);
  root.style.setProperty("--color-foreground",t.textColor);
  root.style.setProperty("--background",t.pageBg);
  root.style.setProperty("--color-background",t.pageBg);
  root.style.setProperty("--radius",t.radius+"px");
  if(t.fontFamily && t.fontFamily!=="system"){
    root.style.setProperty("--font-body",t.fontFamily);
    root.style.setProperty("--font-display",t.fontFamily);
    root.style.setProperty("font-family",t.fontFamily);
    var fam=t.fontFamily.split(",")[0].replace(/['"]/g,"").trim();
    if(!document.getElementById("ocd-font-link")){
      var link=document.createElement("link");
      link.id="ocd-font-link";
      link.rel="stylesheet";
      link.href="https://fonts.googleapis.com/css2?family="+fam.replace(/ /g,"+")+"&display=swap";
      document.head.appendChild(link);
    }
  }
  var dark=t.theme==="dark"||(t.theme==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
  if(dark){
    root.style.setProperty("--background","#0f172a");
    root.style.setProperty("--color-background","#0f172a");
    root.style.setProperty("background-color","#0f172a");
    document.body.style.background="#0f172a";
    root.style.setProperty("--foreground","#f8fafc");
    root.style.setProperty("--color-foreground","#f8fafc");
    root.style.setProperty("color","#f8fafc");
    document.body.style.color="#f8fafc";
    root.style.setProperty("--surface","#1e293b");
    root.style.setProperty("--color-surface","#1e293b");
  }
  var scale=t.typeScale;
  root.style.fontSize=(scale*100)+"%";
  var density=t.density;
  root.style.setProperty("--spacing",(density*24)+"px");
  root.style.setProperty("--ocd-spacing",(density*24)+"px");
})();
</script>
<style>
${t.hoverMotion === "subtle" ? `
@media (hover:hover){
  [class*="card"],[class*="Card"],[class*="kpi"],[class*="KPI"],[class*="tile"],[class*="Tile"],.btn,button:not(:disabled){
    transition:transform .15s ease,box-shadow .15s ease;
  }
  [class*="card"]:hover,[class*="Card"]:hover,[class*="kpi"]:hover,[class*="KPI"]:hover,[class*="tile"]:hover,[class*="Tile"]:hover,.btn:hover,button:not(:disabled):hover{
    transform:translateY(-2px);
    box-shadow:0 4px 14px rgba(0,0,0,.12);
  }
}` : ""}
${t.hoverMotion === "elevated" ? `
@media (hover:hover){
  [class*="card"],[class*="Card"],[class*="kpi"],[class*="KPI"],[class*="tile"],[class*="Tile"],.btn,button:not(:disabled){
    transition:transform .2s ease,box-shadow .2s ease;
  }
  [class*="card"]:hover,[class*="Card"]:hover,[class*="kpi"]:hover,[class*="KPI"]:hover,[class*="tile"]:hover,[class*="Tile"]:hover,.btn:hover,button:not(:disabled):hover{
    transform:translateY(-6px) scale(1.02);
    box-shadow:0 14px 30px rgba(0,0,0,.18);
  }
}` : ""}
${t.hoverMotion === "playful" ? `
@media (hover:hover){
  [class*="card"],[class*="Card"],[class*="kpi"],[class*="KPI"],[class*="tile"],[class*="Tile"],.btn,button:not(:disabled){
    transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s ease;
  }
  [class*="card"]:hover,[class*="Card"]:hover,[class*="kpi"]:hover,[class*="KPI"]:hover,[class*="tile"]:hover,[class*="Tile"]:hover,.btn:hover,button:not(:disabled):hover{
    transform:scale(1.04) rotate(-1deg);
    box-shadow:0 12px 28px rgba(0,0,0,.15);
  }
}` : ""}
@media (prefers-reduced-motion:reduce){
  [class*="card"],[class*="Card"],[class*="kpi"],[class*="KPI"],[class*="tile"],[class*="Tile"],.btn,button{transform:none!important;transition:none!important}
}
</style>
${t.chartTooltips ? `<script>
(function(){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var tip=document.createElement("div");
  tip.style.cssText="position:fixed;z-index:99999;pointer-events:none;background:#111;color:#fff;font:11px/1.4 system-ui,sans-serif;padding:3px 8px;border-radius:6px;display:none;box-shadow:0 2px 8px rgba(0,0,0,.3)";
  document.body.appendChild(tip);
  function show(x,y,text){
    tip.textContent=text;tip.style.display="block";
    var r=tip.getBoundingClientRect();
    tip.style.left=Math.min(x+10,innerWidth-r.width-8)+"px";
    tip.style.top=(y-r.height-10)+"px";
  }
  function val(el){
    var d=el.getAttribute("data-value")||el.getAttribute("data-label")||el.getAttribute("data-tip");
    if(d)return d;
    if(el.getAttribute("height")){
      var hh=el.getAttribute("height");
      return hh.indexOf("%")>-1?hh:parseFloat(hh).toFixed(0);
    }
    var h=el.style&&el.style.height;
    if(h){
      if(h.indexOf("%")>-1)return h;
      var p=parseFloat(h);
      if(!isNaN(p))return p.toFixed(0)+"px";
    }
    return null;
  }
  document.addEventListener("mouseover",function(e){
    var el=e.target;
    if(!el)return;
    if(el.closest&&el.closest("svg")&&(el.tagName==="RECT"||el.tagName==="CIRCLE"||el.tagName==="PATH")){
      var v=val(el);
      show(e.clientX,e.clientY,(el.tagName==="RECT"?(v||"Barre"):"Point")+(v?" : "+v:""));
    }else if(el.closest&&el.closest("[class*='bar' i],[class*='Bar' i]")&&el.closest(":not(svg)")){
      var b=el.closest("[class*='bar' i],[class*='Bar' i]");
      if(b.getAttribute("title"))return;
      var v2=val(b);
      if(v2)show(e.clientX,e.clientY,v2);
    }
  });
  document.addEventListener("mouseout",function(){tip.style.display="none"});
})();
</script>` : ""}`
      : "";
    return `${ERROR_BANNER_SNIPPET}
${mainFile.content}
${css ? `<style>${css}</style>` : ""}
${tweakCss}
${js ? `<script>${js}</script>` : ""}${PREVIEW_SNIPPET}`;
  }, [mainFile, artifact, artifactTweaks]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "ocd:selection") {
        setSelectedText(e.data.text);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!artifact || !mainFile) {
    return (
      <section className="flex min-w-0 flex-1 items-center justify-center bg-muted/40 text-sm text-muted-foreground">
        Sélectionnez ou générez un artefact pour l'éditer.
      </section>
    );
  }

  const runAsk = async () => {
    const instruction = askText.trim();
    if (!instruction || asking) return;
    setAsking(true);
    try {
      const target = selectedText ?? mainFile.content.slice(0, 4000);
      await askSelection(target, instruction, artifact.id);
      setAskText("");
      setSelectedText(null);
    } finally {
      setAsking(false);
    }
  };

  const openInBrowser = () => {
    const { blob } = buildHtmlExport(artifact);
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      downloadBlob(buildHtmlExport(artifact));
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col">
      <div className="flex h-9 shrink-0 items-center justify-between border-b bg-card px-2">
        <div className="flex items-center gap-1">
          <TabButton active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye size={13} />} label="Preview" />
          <TabButton active={tab === "code"} onClick={() => setTab("code")} icon={<Code2 size={13} />} label="Code" />
          {activeSkills.includes("tweaks") && (
            <button
              onClick={() => setShowTweaks((v) => !v)}
              className={cn(
                "ml-1 rounded-md px-2 py-1 text-xs",
                showTweaks
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60",
              )}
              title="Ajuster en direct (accent, typo, densité, thème)"
            >
              Tweaks
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <button
            onClick={openInBrowser}
            className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
            title="Ouvrir le design dans un onglet du navigateur (menus et JS pleinement fonctionnels)"
          >
            <ExternalLink size={12} />
            Ouvrir dans le navigateur
          </button>
          <span className="truncate max-w-[220px]" title={artifact.title}>
            {artifact.title} · {artifact.kind}
          </span>
          {generating && <Loader2 size={13} className="animate-spin" />}
        </div>
      </div>

      {tab === "preview" ? (
        <div className="relative min-h-0 flex-1 bg-white">
          <iframe
            key={artifact.updatedAt + artifact.id + JSON.stringify(artifactTweaks ?? null)}
            title="Aperçu de l'artefact"
            sandbox="allow-scripts"
            srcDoc={previewHtml}
            className="h-full w-full border-0"
          />
          {showTweaks && (
            <TweaksPanel
              artifactId={artifact.id}
              projectId={artifact.projectId}
              tweaks={artifactTweaks}
              setTweaks={setTweaks}
              applyToProject={applyTweaksToProject}
            />
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            <input
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runAsk()}
              placeholder={
                selectedText
                  ? "Modifier la sélection… (Ask AI)"
                  : "Sélectionnez un texte dans la preview, puis demandez…"
              }
              className="w-64 rounded-md border bg-white/95 px-2 py-1 text-xs shadow outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={runAsk}
              disabled={!askText.trim() || asking}
              className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow disabled:opacity-50"
            >
              {asking ? "…" : "Ask AI"}
            </button>
            {selectedText && (
              <span className="max-w-[140px] truncate rounded bg-accent px-1.5 py-0.5 text-[10px] text-accent-foreground">
                Sélection: {selectedText.length} car.
              </span>
            )}
          </div>
        </div>
      ) : (
        <CodeEditor
          value={mainFile.content}
          onChange={(v) => updateArtifact(artifact.id, v, mainFile.path)}
        />
      )}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded-md px-2 py-1 text-xs",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

const DEFAULT_TWEAKS: ArtifactTweaks = {
  accent: "#3B82F6",
  surface: "#ffffff",
  textColor: "#111111",
  pageBg: "#ffffff",
  fontFamily: "system",
  typeScale: 1,
  density: 1,
  radius: 8,
  theme: "light",
  hoverMotion: "subtle",
  chartTooltips: false,
};

function mergeTweaks(t: Partial<ArtifactTweaks> | undefined): ArtifactTweaks {
  return { ...DEFAULT_TWEAKS, ...t };
}

const QUICK_PALETTES: { name: string; accent: string; surface: string; textColor: string; pageBg: string }[] = [
  { name: "Indigo", accent: "#4f46e5", surface: "#ffffff", textColor: "#0f172a", pageBg: "#f8fafc" },
  { name: "Émeraude", accent: "#059669", surface: "#ffffff", textColor: "#0f172a", pageBg: "#f0fdf4" },
  { name: "Corail", accent: "#e11d48", surface: "#ffffff", textColor: "#1f2937", pageBg: "#fff1f2" },
  { name: "Ambre", accent: "#d97706", surface: "#ffffff", textColor: "#1c1917", pageBg: "#fffbeb" },
  { name: "Violet", accent: "#7c3aed", surface: "#ffffff", textColor: "#1e1b4b", pageBg: "#f5f3ff" },
  { name: "Mono", accent: "#171717", surface: "#fafafa", textColor: "#171717", pageBg: "#ffffff" },
];

const FONT_FAMILIES = [
  { id: "system", label: "Système" },
  { id: "Inter, system-ui, sans-serif", label: "Inter" },
  { id: "Georgia, serif", label: "Georgia" },
  { id: "'Playfair Display', Georgia, serif", label: "Playfair" },
  { id: "ui-monospace, 'Cascadia Code', monospace", label: "Mono" },
  { id: "'Courier New', monospace", label: "Courier" },
];

function TweaksPanel({
  artifactId,
  projectId,
  tweaks,
  setTweaks,
  applyToProject,
}: {
  artifactId: string;
  projectId: string | null;
  tweaks?: ArtifactTweaks;
  setTweaks: (id: string, t: ArtifactTweaks) => void;
  applyToProject: (projectId: string, t: ArtifactTweaks) => void;
}) {
  const t = tweaks ?? DEFAULT_TWEAKS;
  const [notice, setNotice] = useState<string | null>(null);
  const patch = (p: Partial<ArtifactTweaks>) =>
    setTweaks(artifactId, { ...t, ...p });

  const applyAll = () => {
    if (!projectId) return;
    const ok = window.confirm(
      "Appliquer ces réglages à tous les artefacts du projet ? Les réglages individuels seront remplacés.",
    );
    if (!ok) return;
    applyToProject(projectId, t);
    setNotice("✓ Appliqué à tous les artefacts du projet");
    setTimeout(() => setNotice(null), 2500);
  };

  return (
    <div className="absolute right-2 top-2 max-h-[calc(100%-1rem)] w-56 overflow-y-auto rounded-md border bg-white/95 p-2.5 text-xs shadow-lg">
      <p className="mb-2 font-semibold">Réglages en direct</p>

      <label className="mb-1 block text-[10px] text-muted-foreground">
        Palettes rapides
      </label>
      <div className="mb-2 flex gap-1">
        {QUICK_PALETTES.map((p) => (
          <button
            key={p.name}
            onClick={() =>
              patch({
                accent: p.accent,
                surface: p.surface,
                textColor: p.textColor,
                pageBg: p.pageBg,
              })
            }
            title={p.name}
            className="h-5 w-5 rounded-full border border-black/10"
            style={{ background: `linear-gradient(135deg, ${p.accent} 50%, ${p.pageBg} 50%)` }}
          />
        ))}
      </div>

      <label className="mb-1 block text-[10px] text-muted-foreground">
        Accent
      </label>
      <input
        type="color"
        value={t.accent}
        onChange={(e) => patch({ accent: e.target.value })}
        className="mb-1 h-6 w-full cursor-pointer rounded border"
      />
      <label className="mb-1 block text-[10px] text-muted-foreground">
        Surface (cartes)
      </label>
      <input
        type="color"
        value={t.surface}
        onChange={(e) => patch({ surface: e.target.value })}
        className="mb-1 h-6 w-full cursor-pointer rounded border"
      />
      <label className="mb-1 block text-[10px] text-muted-foreground">
        Texte
      </label>
      <input
        type="color"
        value={t.textColor}
        onChange={(e) => patch({ textColor: e.target.value })}
        className="mb-1 h-6 w-full cursor-pointer rounded border"
      />
      <label className="mb-1 block text-[10px] text-muted-foreground">
        Fond de page
      </label>
      <input
        type="color"
        value={t.pageBg}
        onChange={(e) => patch({ pageBg: e.target.value })}
        className="mb-2 h-6 w-full cursor-pointer rounded border"
      />

      <label className="mb-1 block text-[10px] text-muted-foreground">
        Police
      </label>
      <select
        value={t.fontFamily}
        onChange={(e) => patch({ fontFamily: e.target.value })}
        className="mb-2 w-full rounded-md border bg-background px-1.5 py-1 text-[11px] outline-none"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </select>

      <label className="mb-1 block text-[10px] text-muted-foreground">
        Échelle typo: {t.typeScale.toFixed(2)}×
      </label>
      <input
        type="range"
        min={0.8}
        max={1.3}
        step={0.05}
        value={t.typeScale}
        onChange={(e) => patch({ typeScale: Number(e.target.value) })}
        className="mb-2 w-full accent-primary"
      />
      <label className="mb-1 block text-[10px] text-muted-foreground">
        Densité: {t.density.toFixed(2)}×
      </label>
      <input
        type="range"
        min={0.5}
        max={1.5}
        step={0.1}
        value={t.density}
        onChange={(e) => patch({ density: Number(e.target.value) })}
        className="mb-2 w-full accent-primary"
      />
      <label className="mb-1 block text-[10px] text-muted-foreground">
        Rayon: {t.radius}px
      </label>
      <input
        type="range"
        min={0}
        max={24}
        step={1}
        value={t.radius}
        onChange={(e) => patch({ radius: Number(e.target.value) })}
        className="mb-2 w-full accent-primary"
      />

      <label className="mb-1 block text-[10px] text-muted-foreground">Thème</label>
      <div className="mb-2 flex gap-1">
        {(["light", "dark", "system"] as const).map((theme) => (
          <button
            key={theme}
            onClick={() => patch({ theme })}
            className={cn(
              "flex-1 rounded border px-2 py-0.5 text-[10px] capitalize",
              t.theme === theme
                ? "border-primary bg-accent text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {theme}
          </button>
        ))}
      </div>

      <label className="mb-1 block text-[10px] text-muted-foreground">
        Interactivité (survol)
      </label>
      <select
        value={t.hoverMotion}
        onChange={(e) =>
          patch({ hoverMotion: e.target.value as ArtifactTweaks["hoverMotion"] })
        }
        className="mb-2 w-full rounded-md border bg-background px-1.5 py-1 text-[11px] outline-none"
      >
        <option value="none">Désactivée</option>
        <option value="subtle">Subtile</option>
        <option value="elevated">Élevée</option>
        <option value="playful">Ludique</option>
      </select>

      <label className="mb-2 flex items-center justify-between text-[10px] text-muted-foreground">
        Tooltips graphiques
        <button
          onClick={() => patch({ chartTooltips: !t.chartTooltips })}
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            t.chartTooltips
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
          title="Afficher la valeur au survol des graphiques"
        >
          {t.chartTooltips ? "Activé" : "Désactivé"}
        </button>
      </label>

      <div className="flex gap-1 border-t pt-2">
        <button
          onClick={() => setTweaks(artifactId, DEFAULT_TWEAKS)}
          className="flex-1 rounded border px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted"
          title="Revenir aux réglages par défaut"
        >
          Réinitialiser
        </button>
        <button
          onClick={applyAll}
          disabled={!projectId}
          className="flex-1 rounded border border-primary px-2 py-1 text-[10px] text-primary hover:bg-accent disabled:opacity-50"
          title="Appliquer ces réglages à tous les artefacts du projet"
        >
          Tout le projet
        </button>
      </div>
      {notice && (
        <p className="mt-1.5 rounded bg-green-50 px-2 py-1 text-[10px] text-green-700">
          {notice}
        </p>
      )}
    </div>
  );
}

function CodeEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {  return (
    <div className="min-h-0 flex-1">
      <Editor
        height="100%"
        defaultLanguage="html"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
