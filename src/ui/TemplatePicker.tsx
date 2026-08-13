import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/appStore";
import { TEMPLATES } from "@/skills/registry";
import { Check, ChevronDown, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/cn";
import { useOutsideClick } from "@/lib/hooks";
import PreviewDialog from "./PreviewDialog";

export default function TemplatePicker() {
  const activeTemplateId = useAppStore((s) => s.activeTemplateId);
  const setActiveTemplate = useAppStore((s) => s.setActiveTemplate);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useOutsideClick(rootRef, close, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current =
    TEMPLATES.find((t) => t.manifest.id === activeTemplateId) ?? null;
  const previewTemplate = preview
    ? TEMPLATES.find((t) => t.manifest.id === preview)
    : null;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? TEMPLATES.filter(
        (t) =>
          t.manifest.name.toLowerCase().includes(q) ||
          t.manifest.description.toLowerCase().includes(q) ||
          t.manifest.kind.toLowerCase().includes(q),
      )
    : TEMPLATES;

  const select = (id: string | null) => {
    setActiveTemplate(id);
    close();
  };

  return (
    <>
      <div ref={rootRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          title={
            current
              ? `Template de génération (global) : ${current.manifest.name}`
              : "Aucun template — la structure est libre (réglage global)"
          }
          className="flex max-w-[180px] items-center gap-1.5 rounded-md border bg-background px-1.5 py-1 text-xs outline-none focus:ring-2 focus:ring-ring"
        >
          <LayoutTemplate size={12} className="shrink-0 text-muted-foreground" />
          <span className="truncate">
            {current ? current.manifest.name : "Aucun template"}
          </span>
          <ChevronDown size={11} className="shrink-0 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute bottom-full right-0 z-40 mb-1 w-80 rounded-md border bg-card p-2 shadow-xl">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un template…"
              className="w-full rounded-md border bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="mt-1.5 max-h-72 space-y-1 overflow-y-auto">
              <div
                className={cn(
                  "rounded-md border p-1.5",
                  activeTemplateId === null && "border-primary bg-accent/40",
                )}
              >
                <button
                  onClick={() => select(null)}
                  className="flex min-w-0 flex-1 items-center gap-1.5 text-left text-xs font-medium"
                >
                  {activeTemplateId === null && (
                    <Check size={11} className="shrink-0 text-primary" />
                  )}
                  <span className="truncate">Aucun template (libre)</span>
                </button>
              </div>
              {filtered.map((t) => (
                <div
                  key={t.manifest.id}
                  className={cn(
                    "rounded-md border p-1.5",
                    activeTemplateId === t.manifest.id &&
                      "border-primary bg-accent/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={() => select(t.manifest.id)}
                      className="flex min-w-0 flex-1 flex-col text-left"
                    >
                      <span className="flex items-center gap-1.5 text-xs font-medium">
                        {activeTemplateId === t.manifest.id && (
                          <Check size={11} className="shrink-0 text-primary" />
                        )}
                        <span className="truncate">{t.manifest.name}</span>
                      </span>
                      <span className="truncate text-[10px] text-muted-foreground">
                        {t.manifest.kind} · {t.manifest.description}
                      </span>
                    </button>
                    {t.exampleHtml && (
                      <button
                        onClick={() => setPreview(t.manifest.id)}
                        className="shrink-0 rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-muted"
                        title="Afficher l'exemple du template"
                      >
                        Preview
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {previewTemplate && previewTemplate.exampleHtml && (
        <PreviewDialog
          title={previewTemplate.manifest.name}
          subtitle={`${previewTemplate.manifest.kind} · ${previewTemplate.manifest.description}`}
          srcDoc={previewTemplate.exampleHtml}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
