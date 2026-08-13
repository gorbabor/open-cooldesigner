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

  const artifactTweaks = artifact ? tweaks[artifact.id] : undefined;

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
  var t={accent:"${t.accent}",typeScale:${t.typeScale},density:${t.density},theme:"${t.theme}"};
  var root=document.documentElement;
  root.style.setProperty("--accent",t.accent);
  root.style.setProperty("--color-accent",t.accent);
  root.style.setProperty("--primary",t.accent);
  if(t.theme==="dark"){
    root.style.setProperty("--color-background","#0f172a");
    root.style.setProperty("--color-foreground","#f8fafc");
    root.style.setProperty("background-color","#0f172a");
    document.body.style.background="#0f172a";
    document.body.style.color="#f8fafc";
  }
  var scale=t.typeScale;
  root.style.fontSize=(scale*100)+"%";
  var density=t.density;
  root.style.setProperty("--spacing",(density*24)+"px");
  root.style.setProperty("--ocd-spacing",(density*24)+"px");
})();
</script>`
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
              tweaks={artifactTweaks}
              setTweaks={setTweaks}
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

const DEFAULT_TWEAKS = {
  accent: "#3B82F6",
  typeScale: 1,
  density: 1,
  theme: "light" as const,
};

function TweaksPanel({
  artifactId,
  tweaks,
  setTweaks,
}: {
  artifactId: string;
  tweaks?: ArtifactTweaks;
  setTweaks: (id: string, t: ArtifactTweaks) => void;
}) {
  const t = tweaks ?? DEFAULT_TWEAKS;
  return (
    <div className="absolute right-2 top-2 w-52 rounded-md border bg-white/95 p-2.5 text-xs shadow-lg">
      <p className="mb-2 font-semibold">Réglages en direct</p>
      <label className="mb-1 block text-[10px] text-muted-foreground">
        Accent
      </label>
      <input
        type="color"
        value={t.accent}
        onChange={(e) => setTweaks(artifactId, { ...t, accent: e.target.value })}
        className="mb-2 h-6 w-full cursor-pointer rounded border"
      />
      <label className="mb-1 block text-[10px] text-muted-foreground">
        Échelle typo: {t.typeScale.toFixed(2)}×
      </label>
      <input
        type="range"
        min={0.8}
        max={1.3}
        step={0.05}
        value={t.typeScale}
        onChange={(e) =>
          setTweaks(artifactId, { ...t, typeScale: Number(e.target.value) })
        }
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
        onChange={(e) =>
          setTweaks(artifactId, { ...t, density: Number(e.target.value) })
        }
        className="mb-2 w-full accent-primary"
      />
      <label className="mb-1 block text-[10px] text-muted-foreground">Thème</label>
      <div className="flex gap-1">
        {(["light", "dark"] as const).map((theme) => (
          <button
            key={theme}
            onClick={() => setTweaks(artifactId, { ...t, theme })}
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
