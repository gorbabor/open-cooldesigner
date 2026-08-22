import { useEffect, useRef, useState } from "react";
import { useAppStore, useProjectVersions } from "@/store/appStore";
import { buildHtmlExport, buildZipExport, downloadBlob } from "@/services/exportService";
import { estimateGenerationCost } from "@/services/costService";
import { QUICK_START_TEMPLATES } from "@/templates";
import ModelPicker from "./ModelPicker";
import DesignSystemPicker from "./DesignSystemPicker";
import TemplatePicker from "./TemplatePicker";
import CritiqueReportDialog from "./CritiqueReportDialog";
import { Download, History, Loader2, RotateCcw, Send, Sparkles, GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/cn";

export default function ChatPanel() {  const activeProject = useAppStore((s) =>
    s.projects.find((p) => p.id === s.activeProjectId) ?? null,
  );
  const chat = useAppStore((s) => s.chat);
  const generate = useAppStore((s) => s.generate);
  const generating = useAppStore((s) => s.generating);
  const error = useAppStore((s) => s.error);
  const clearError = useAppStore((s) => s.clearError);
  const retryLastGenerate = useAppStore((s) => s.retryLastGenerate);
  const checkBudget = useAppStore((s) => s.checkBudget);
  const lastPrompt = useAppStore((s) => s.lastPrompt);
  const restoreVersion = useAppStore((s) => s.restoreVersion);
  const duplicateVersion = useAppStore((s) => s.duplicateVersion);
  const selectArtifact = useAppStore((s) => s.selectArtifact);
  const setActiveTemplate = useAppStore((s) => s.setActiveTemplate);
  const versions = useProjectVersions(activeProject?.id ?? null);
  const [prompt, setPrompt] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const [budgetWarning, setBudgetWarning] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [chat.length, generating]);

  const send = () => {
    const p = prompt.trim();
    if (!p || generating) return;
    const warn = checkBudget(p);
    if (warn.exceeded) {
      setBudgetWarning(
        `Budget dépassé: traitement estimé à ${warn.estimatedUsd.toFixed(4)} USD (cumul ${warn.totalUsd.toFixed(4)} USD, budget ${warn.budgetUsd.toFixed(4)} USD).`,
      );
      return;
    }
    setBudgetWarning(null);
    setPrompt("");
    void generate(p);
  };

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Assistant IA
        </h2>
        <button
          onClick={() => setShowVersions((v) => !v)}
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-muted",
            showVersions && "bg-muted",
          )}
          title="Historique des versions"
        >
          <History size={13} />
          Versions
        </button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {chat.length === 0 && (
          <div className="space-y-3">
            <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
              Décrivez ce que vous voulez concevoir, par exemple :
              <br />
              <span className="italic">« Crée un dashboard de suivi commercial »</span>
            </p>
            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Démarrage rapide
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_START_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (t.skillTemplateId) setActiveTemplate(t.skillTemplateId);
                      setPrompt(t.name);
                      setBudgetWarning(null);
                      void generate(t.defaultSystemPrompt);
                    }}
                    className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted"
                    title={t.description}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {chat.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[90%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm",
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted",
            )}
          >
            {m.content.length > 600 && m.artifactId ? (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles size={13} />
                Artefact généré
              </span>
            ) : (
              m.content
            )}
            {m.artifactId && (
              <button
                onClick={() => selectArtifact(m.artifactId!)}
                className="mt-1 block rounded bg-background px-2 py-0.5 text-xs text-primary hover:underline"
              >
                Ouvrir l'artefact
              </button>
            )}
          </div>
        ))}
        {generating && (
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            Génération en cours…
          </div>
        )}
      </div>

      {showVersions && (
        <div className="max-h-48 overflow-y-auto border-t p-2">
          <h3 className="mb-1 px-1 text-xs font-semibold text-muted-foreground">
            Snapshots du projet
          </h3>
          {versions.length === 0 && (
            <p className="px-1 text-xs text-muted-foreground">Aucune version.</p>
          )}
          {versions.map((v, i) => (
            <div
              key={v.id}
              className="flex items-center justify-between rounded px-1 py-1 text-xs hover:bg-muted"
            >
              <span className="truncate" title={v.label}>
                {i === 0 ? "🟢 " : ""}
                {v.label}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => selectArtifact(v.artifact.id)}
                  className="text-primary hover:underline"
                  title="Ouvrir"
                >
                  <GitCompareArrows size={12} />
                </button>
                <button
                  onClick={() => restoreVersion(v.id)}
                  className="text-primary hover:underline"
                  title="Restaurer cette version"
                >
                  Restaurer
                </button>
                <button
                  onClick={() => duplicateVersion(v.id)}
                  className="text-primary hover:underline"
                  title="Dupliquer cette version (créer une branche)"
                >
                  Dupliquer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="border-t border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
          <div className="mt-1 flex gap-2">
            <button onClick={clearError} className="underline">
              Fermer
            </button>
            {lastPrompt && (
              <button
                onClick={() => void retryLastGenerate()}
                className="flex items-center gap-1 underline"
                title="Relancer la dernière génération"
              >
                <RotateCcw size={11} />
                Réessayer
              </button>
            )}
          </div>
        </div>
      )}

      {budgetWarning && (
        <div className="border-t border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {budgetWarning}
          <button
            onClick={() => setBudgetWarning(null)}
            className="ml-2 underline"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="border-t p-2">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5">
          <ModelPicker compact />
          <div className="flex items-center gap-1.5">
            <DesignSystemPicker />
            <TemplatePicker />
          </div>
        </div>
        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Décrivez votre design…"
            className="min-w-0 flex-1 rounded-md border bg-background px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={send}
            disabled={!prompt.trim() || generating}
            className="flex items-center gap-1 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            title="Générer"
          >
            <Send size={14} />
          </button>
        </div>
        <div className="mt-1.5 flex gap-1.5">
          <ExportButtons />
        </div>
      </div>
    </aside>
  );
}

function ExportButtons() {
  const artifact = useAppStore((s) =>
    s.artifacts.find((a) => a.id === s.activeArtifactId) ?? null,
  );
  const project = useAppStore((s) =>
    s.projects.find((p) => p.id === s.activeProjectId) ?? null,
  );
  const generations = useAppStore((s) => s.generations);
  const critiqueArtifact = useAppStore((s) => s.critiqueArtifact);
  const autoImprove = useAppStore((s) => s.autoImprove);
  const critiques = useAppStore((s) => s.critiques);
  const activeSkills = useAppStore((s) => s.activeSkills);
  const generating = useAppStore((s) => s.generating);
  const tweaks = useAppStore((s) => s.tweaks);
  const [notice, setNotice] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  const artifactTweaks = artifact ? tweaks[artifact.id] : undefined;

  const exportHtml = () => {
    if (!artifact) return;
    const result = buildHtmlExport(artifact, artifactTweaks);
    downloadBlob(result);
    setNotice(`HTML exporté (${(result.sizeBytes / 1024).toFixed(1)} Ko)`);
  };

  const exportZip = async () => {
    if (!artifact) return;
    const result = await buildZipExport(artifact, artifactTweaks);
    downloadBlob(result);
    setNotice(`ZIP exporté (${(result.sizeBytes / 1024).toFixed(1)} Ko)`);
  };

  if (!artifact || !project) return null;
  const gen = generations.find((g) => g.artifactId === artifact.id);
  const cost = gen
    ? estimateGenerationCost(gen.provider, gen.model, gen.inputTokens, gen.outputTokens)
    : null;
  const criticActive = activeSkills.includes("design-critic");
  const report = critiques[artifact.id];

  const runCritique = async () => {
    await critiqueArtifact(artifact.id);
    setShowReport(true);
  };

  const runAutoImprove = async () => {
    await autoImprove(artifact.id);
    setShowReport(false);
  };

  return (
    <>
      {criticActive && (
        <button
          onClick={runCritique}
          disabled={generating}
          className="flex-1 rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
          title="Analyser l'artefact (5 dimensions /10)"
        >
          Critiquer
        </button>
      )}
      {report && (
        <button
          onClick={() => setShowReport((v) => !v)}
          className="flex-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
          title="Afficher le rapport de critique"
        >
          Rapport ({report.scores.hierarchy}/10)
        </button>
      )}
      {report && criticActive && (
        <button
          onClick={runAutoImprove}
          disabled={generating}
          className="flex-1 rounded-md border border-primary px-2 py-1 text-xs text-primary hover:bg-accent disabled:opacity-50"
          title="Régénérer avec les corrections du critique"
        >
          Auto-improve
        </button>
      )}
      <button
        onClick={exportHtml}
        className="flex-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
      >
        Export HTML
      </button>
      <button
        onClick={exportZip}
        className="flex flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
      >
        <Download size={12} />
        Export ZIP
      </button>
      {showReport && report && (
        <CritiqueReportDialog
          report={report}
          artifactTitle={artifact.title}
          busy={generating}
          onCritique={runCritique}
          onAutoImprove={runAutoImprove}
          onClose={() => setShowReport(false)}
        />
      )}
      {notice && <span className="truncate text-[10px] text-muted-foreground">{notice}</span>}
      {cost && (
        <span className="truncate text-[10px] text-muted-foreground" title={`${cost.inputTokens} in / ${cost.outputTokens} out`}>
          Coût: ${cost.estimatedUsd.toFixed(4)}
        </span>
      )}
    </>
  );
}
