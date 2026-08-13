import { useState } from "react";
import type { Project } from "@/types";
import { useAppStore } from "@/store/appStore";
import { Plus, Trash2, FolderOpen, Check } from "lucide-react";
import { DESIGN_SYSTEMS, searchDesignSystems } from "@/designSystem/registry";
import { cn } from "@/lib/cn";

interface Props {
  projects: Project[];
  onCreate: (name: string, designSystemId: string) => Project;
  empty?: boolean;
}

export default function ProjectSidebar({ projects, onCreate, empty }: Props) {
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const openProject = useAppStore((s) => s.openProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const defaultDesignSystemId = useAppStore((s) => s.defaultDesignSystemId);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [dsQuery, setDsQuery] = useState("");
  const [dsId, setDsId] = useState(
    defaultDesignSystemId || DESIGN_SYSTEMS[0]?.id || "",
  );
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const filteredDs = searchDesignSystems(dsQuery).slice(0, 30);

  const submit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), dsId);
    setCreating(false);
    setName("");
    setDsQuery("");
  };

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-card">
      <div className="border-b p-3">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Projets
        </h2>
        <button
          onClick={() => setCreating((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={14} />
          Nouveau projet
        </button>
      </div>

      {creating && (
        <div className="border-b p-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Nom du projet"
            className="mb-2 w-full rounded-md border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Design system
          </p>
          <input
            value={dsQuery}
            onChange={(e) => setDsQuery(e.target.value)}
            placeholder="Rechercher…"
            className="mb-1 w-full rounded-md border bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="mb-2 max-h-40 space-y-0.5 overflow-y-auto rounded-md border">
            {filteredDs.map((ds) => (
              <button
                key={ds.id}
                onClick={() => setDsId(ds.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-1 px-2 py-1 text-left text-xs hover:bg-muted",
                  dsId === ds.id && "bg-accent text-accent-foreground",
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{ds.name}</span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {ds.category}
                  </span>
                </span>
                {dsId === ds.id && <Check size={12} className="shrink-0" />}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={!name.trim()}
              className="flex-1 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground disabled:opacity-50"
            >
              Créer
            </button>
            <button
              onClick={() => setCreating(false)}
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {projects.length === 0 && !empty && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            Aucun projet. Créez-en un.
          </p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className={`group mb-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
              p.id === activeProjectId
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted"
            }`}
          >
            <button
              onClick={() => openProject(p.id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <FolderOpen size={14} className="shrink-0 text-muted-foreground" />
              <span className="truncate">{p.name}</span>
            </button>
            <button
              onClick={() => setPendingDelete(p)}
              className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              title="Supprimer"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setPendingDelete(null)}
        >
          <div
            className="w-[380px] rounded-lg bg-card p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Confirmer la suppression"
          >
            <h3 className="mb-2 text-base font-semibold">Supprimer le projet ?</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              « {pendingDelete.name} » et toutes ses versions, artefacts et
              générations seront définitivement supprimés. Cette action est
              irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-md px-3 py-1.5 text-sm hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  deleteProject(pendingDelete.id);
                  setPendingDelete(null);
                }}
                className="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
