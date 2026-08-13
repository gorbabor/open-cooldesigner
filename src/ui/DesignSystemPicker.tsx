import { useRef, useState } from "react";
import { useAppStore } from "@/store/appStore";
import {
  DESIGN_SYSTEMS,
  searchDesignSystems,
} from "@/designSystem/registry";
import {
  buildDesignSystemPreviewHtml,
  buildDesignSystemThumbnailHtml,
} from "@/designSystem/parser";
import { Check, ChevronDown, Palette } from "lucide-react";
import { cn } from "@/lib/cn";
import { useOutsideClick } from "@/lib/hooks";
import PreviewDialog from "./PreviewDialog";

export default function DesignSystemPicker() {
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const activeProject = useAppStore(
    (s) => s.projects.find((p) => p.id === s.activeProjectId) ?? null,
  );
  const setProjectDesignSystem = useAppStore(
    (s) => s.setProjectDesignSystem,
  );
  const defaultDesignSystemId = useAppStore((s) => s.defaultDesignSystemId);
  const setDefaultDesignSystem = useAppStore(
    (s) => s.setDefaultDesignSystem,
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useOutsideClick(rootRef, () => setOpen(false), open);

  const currentId = activeProject?.designSystemId ?? defaultDesignSystemId;
  const current = DESIGN_SYSTEMS.find((ds) => ds.id === currentId) ?? null;
  const previewDs = preview
    ? DESIGN_SYSTEMS.find((ds) => ds.id === preview)
    : null;

  const select = (id: string) => {
    if (activeProjectId) setProjectDesignSystem(activeProjectId, id);
    setOpen(false);
  };

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          disabled={!activeProjectId}
          title={
            activeProjectId
              ? `Design system du projet : ${current?.name ?? "—"}`
              : "Ouvrez un projet pour choisir son design system"
          }
          className="flex max-w-[180px] items-center gap-1.5 rounded-md border bg-background px-1.5 py-1 text-xs outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        >
          <Palette size={12} className="shrink-0 text-muted-foreground" />
          <span className="truncate">
            {current ? current.name : "Design system"}
          </span>
          <ChevronDown size={11} className="shrink-0 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute bottom-full right-0 z-40 mb-1 w-80 rounded-md border bg-card p-2 shadow-xl">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un design system…"
              className="w-full rounded-md border bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="mt-1.5 max-h-64 space-y-1 overflow-y-auto">
              {searchDesignSystems(query).slice(0, 30).map((ds) => (
                <div
                  key={ds.id}
                  className={cn(
                    "rounded-md border p-1.5",
                    ds.id === currentId && "border-primary bg-accent/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={() => select(ds.id)}
                      className="flex min-w-0 flex-1 flex-col text-left"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-medium">
                        {ds.id === currentId && (
                          <Check size={11} className="shrink-0 text-primary" />
                        )}
                        <span className="truncate">{ds.name}</span>
                      </span>
                      <span className="truncate text-[10px] text-muted-foreground">
                        {ds.category} · {ds.description}
                      </span>
                    </button>
                    <button
                      onClick={() => setPreview(ds.id)}
                      className="shrink-0 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
                      title="Afficher la démo complète du design system"
                    >
                      Preview
                    </button>
                  </div>
                  <iframe
                    title={`Vignette ${ds.name}`}
                    sandbox="allow-scripts"
                    srcDoc={buildDesignSystemThumbnailHtml(ds)}
                    className="mt-1.5 h-9 w-full rounded border"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (currentId) setDefaultDesignSystem(currentId);
                setOpen(false);
              }}
              className="mt-1.5 w-full rounded-md border px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted"
              title="Design system proposé à la création des nouveaux projets"
            >
              {defaultDesignSystemId === currentId
                ? "✓ Défaut pour les nouveaux projets"
                : "Définir comme défaut pour les nouveaux projets"}
            </button>
          </div>
        )}
      </div>

      {previewDs && (
        <PreviewDialog
          title={previewDs.name}
          subtitle={`${previewDs.category} · ${previewDs.description}`}
          srcDoc={buildDesignSystemPreviewHtml(previewDs)}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
