import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export default function Dialog({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = "max-w-[560px]",
  ariaLabel,
  escapeDisabled = false,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
  ariaLabel?: string;
  escapeDisabled?: boolean;
}) {
  useEffect(() => {
    if (escapeDisabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, escapeDisabled]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      role="dialog"
      aria-label={ariaLabel ?? title}
    >
      <div
        className={cn(
          "flex h-[95vh] w-[90vw] flex-col overflow-hidden rounded-lg bg-card shadow-xl",
          maxWidth,
        )}
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
        {children}
      </div>
    </div>
  );
}
