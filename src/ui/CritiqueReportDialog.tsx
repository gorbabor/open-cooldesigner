import { useEffect } from "react";
import type { CritiqueReport } from "@/skills/types";
import { CheckCircle2, Hammer, Loader2, Sparkles, X, Zap } from "lucide-react";
import { cn } from "@/lib/cn";

function scoreColor(score: number): string {
  if (score >= 7) return "bg-green-50 text-green-700 border-green-200";
  if (score >= 4) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-600 border-red-200";
}

const DIMENSIONS: [keyof CritiqueReport["scores"], string][] = [
  ["philosophy", "Philosophie"],
  ["hierarchy", "Hiérarchie"],
  ["details", "Détails"],
  ["functionality", "Fonctionnalité"],
  ["innovation", "Innovation"],
];

export default function CritiqueReportDialog({
  report,
  artifactTitle,
  busy,
  onCritique,
  onAutoImprove,
  onClose,
}: {
  report: CritiqueReport;
  artifactTitle: string;
  busy: boolean;
  onCritique: () => void;
  onAutoImprove: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  const scores = report.scores;
  const average =
    DIMENSIONS.reduce((sum, [k]) => sum + scores[k], 0) / DIMENSIONS.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => !busy && onClose()}
      role="dialog"
      aria-label="Rapport du critique"
    >
      <div
        className="flex max-h-[85vh] w-[90vw] max-w-[560px] flex-col overflow-hidden rounded-lg bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Rapport du critique</h2>
            <p className="truncate text-xs text-muted-foreground">
              {artifactTitle} · {average.toFixed(1)}/10 en moyenne
            </p>
          </div>
          <button
            onClick={() => !busy && onClose()}
            disabled={busy}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            title="Fermer (Échap)"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-4 grid grid-cols-5 gap-2">
            {DIMENSIONS.map(([key, label]) => (
              <div
                key={key}
                className={cn(
                  "rounded-md border p-2 text-center",
                  scoreColor(scores[key]),
                )}
                title={label}
              >
                <div className="text-lg font-bold leading-none">
                  {scores[key]}
                </div>
                <div className="mt-1 text-[9px] font-medium uppercase tracking-wide opacity-80">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {report.keep.length > 0 && (
            <section className="mb-3">
              <h3 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-green-700">
                <CheckCircle2 size={13} /> Conserver
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {report.keep.map((item, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-green-600">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {report.fix.length > 0 && (
            <section className="mb-3">
              <h3 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                <Hammer size={13} /> Corriger
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {report.fix.map((item, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-red-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {report.quickWins.length > 0 && (
            <section>
              <h3 className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                <Zap size={13} /> Gains rapides
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                {report.quickWins.map((item, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-amber-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t px-4 py-2.5">
          <button
            onClick={onCritique}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-50"
          >
            <Sparkles size={12} />
            {busy ? "Analyse en cours…" : "Critiquer à nouveau"}
          </button>
          <button
            onClick={onAutoImprove}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
            Auto-improve
          </button>
        </div>
      </div>
    </div>
  );
}