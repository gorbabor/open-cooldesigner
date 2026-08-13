import { useEffect } from "react";
import { X } from "lucide-react";

export default function PreviewDialog({
  title,
  subtitle,
  srcDoc,
  onClose,
}: {
  title: string;
  subtitle?: string;
  srcDoc: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!srcDoc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [srcDoc, onClose]);

  if (!srcDoc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-label={`Aperçu : ${title}`}
    >
      <div
        className="flex h-[85vh] w-[90vw] flex-col overflow-hidden rounded-lg bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">{title}</h2>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Fermer (Échap)"
          >
            <X size={16} />
          </button>
        </div>
        <iframe
          title={title}
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          className="min-h-0 w-full flex-1 border-0"
        />
      </div>
    </div>
  );
}
