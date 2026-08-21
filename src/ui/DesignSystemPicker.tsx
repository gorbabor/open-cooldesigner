import { memo, useMemo, useState } from "react";
import { useAppStore } from "@/store/appStore";
import {
  DESIGN_SYSTEMS,
  listDesignSystemCategories,
  searchDesignSystems,
} from "@/designSystem/registry";
import {
  buildDesignSystemPreviewHtml,
  buildDesignSystemThumbnailHtml,
} from "@/designSystem/parser";
import type { ParsedDesignSystem } from "@/designSystem/parser";
import { Check, ChevronDown, Palette } from "lucide-react";
import { cn } from "@/lib/cn";
import Dialog from "./Dialog";
import PreviewDialog from "./PreviewDialog";

const DesignSystemCard = memo(function DesignSystemCard({
  ds,
  isCurrent,
  isDefault,
  onSelect,
  onPreview,
  onDefault,
}: {
  ds: ParsedDesignSystem;
  isCurrent: boolean;
  isDefault: boolean;
  onSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onDefault: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md border p-2",
        isCurrent && "border-primary bg-accent/40",
      )}
    >
      <button
        onClick={() => onSelect(ds.id)}
        className="flex min-w-0 flex-1 flex-col text-left"
        title={`Appliquer « ${ds.name} » au projet`}
      >
        <iframe
          title={`Vignette ${ds.name}`}
          sandbox="allow-scripts"
          srcDoc={buildDesignSystemThumbnailHtml(ds)}
          className="h-10 w-full rounded border"
        />
        <span className="mt-1.5 flex items-center gap-1.5 text-xs font-medium">
          {isCurrent && <Check size={11} className="shrink-0 text-primary" />}
          <span className="truncate">{ds.name}</span>
        </span>
        <span className="truncate text-[10px] text-muted-foreground">
          {ds.category}
          {ds.imported && (
            <span
              className="ml-1 rounded bg-muted px-1 py-0.5 text-[9px] text-muted-foreground"
              title="Système importé d'Open Design (palette + typographie)"
            >
              importé
            </span>
          )}
          · {ds.description}
        </span>
      </button>
      <div className="mt-1.5 flex items-center gap-1">
        <button
          onClick={() => onPreview(ds.id)}
          className="flex-1 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
          title="Afficher la démo complète"
        >
          Preview
        </button>
        <button
          onClick={() => onDefault(ds.id)}
          className={cn(
            "flex-1 rounded border px-1.5 py-0.5 text-[10px]",
            isDefault
              ? "border-primary bg-primary/10 font-medium text-primary"
              : "text-muted-foreground hover:bg-muted",
          )}
          title="Défaut pour les nouveaux projets"
        >
          {isDefault ? "Défaut ✓" : "Défaut"}
        </button>
      </div>
    </div>
  );
});

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
  const [category, setCategory] = useState("all");
  const [preview, setPreview] = useState<string | null>(null);

  const currentId = activeProject?.designSystemId ?? defaultDesignSystemId;
  const current = DESIGN_SYSTEMS.find((ds) => ds.id === currentId) ?? null;
  const previewDs = preview
    ? DESIGN_SYSTEMS.find((ds) => ds.id === preview)
    : null;

  const close = () => {
    setOpen(false);
    setQuery("");
    setCategory("all");
  };

  const filtered = useMemo(() => {
    const searched = searchDesignSystems(query);
    return category === "all"
      ? searched
      : searched.filter((ds) => ds.category === category);
  }, [query, category]);

  const select = (id: string) => {
    if (activeProjectId) setProjectDesignSystem(activeProjectId, id);
    close();
  };

  return (
    <>
      <div className="relative">
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
      </div>

      {open && (
        <Dialog
          title="Design systems"
          subtitle={`${DESIGN_SYSTEMS.length} disponibles`}
          onClose={close}
          maxWidth="max-w-[1100px]"
          ariaLabel="Choisir un design system"
          escapeDisabled={preview !== null}
        >
          <div className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="w-56 rounded-md border bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border bg-background px-2 py-1 text-xs outline-none"
            >
              <option value="all">Toutes catégories</option>
              {listDesignSystemCategories().map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((ds) => (
                <DesignSystemCard
                  key={ds.id}
                  ds={ds}
                  isCurrent={ds.id === currentId}
                  isDefault={defaultDesignSystemId === ds.id}
                  onSelect={select}
                  onPreview={setPreview}
                  onDefault={setDefaultDesignSystem}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-10 text-center text-xs text-muted-foreground">
                Aucun design system ne correspond à « {query} ».
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t px-4 py-2 text-[10px] text-muted-foreground">
            <span>
              {filtered.length} affichés
              {category !== "all" && ` · catégorie « ${category} »`}
              {query && ` · recherche « ${query} »`}
            </span>
            <span>Cliquer sur une carte pour l'appliquer au projet</span>
          </div>
        </Dialog>
      )}

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
