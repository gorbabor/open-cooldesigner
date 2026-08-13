import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { summarizeCosts, providerLabel } from "@/services/costService";
import { formatUsd } from "@/lib/utils";
import ModelPicker from "./ModelPicker";
import { ChevronUp, Coins, Cpu } from "lucide-react";

export default function AiUsageFooter() {
  const generations = useAppStore((s) => s.generations);
  const settings = useAppStore((s) => s.settings);
  const summary = summarizeCosts(generations);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <footer className="relative shrink-0">
      {pickerOpen && (
        <div className="absolute bottom-full left-0 z-40 mb-1 rounded-md border bg-card p-2 shadow-lg">
          <ModelPicker />
        </div>
      )}
      <button
        onClick={() => setPickerOpen((v) => !v)}
        className="flex h-8 w-full items-center justify-between border-t bg-card px-4 text-[11px] text-muted-foreground hover:bg-muted/50"
        title="Changer de fournisseur ou de modèle"
      >
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Cpu size={12} />
            {providerLabel(settings.provider)} · {settings.model}
          </span>
          <span className="flex items-center gap-1">
            <Coins size={12} />
            Coût total: {formatUsd(summary.totalUsd)}
          </span>
          <span>
            {summary.count} génération{summary.count > 1 ? "s" : ""} ·{" "}
            {(summary.totalInputTokens + summary.totalOutputTokens).toLocaleString(
              "fr-FR",
            )}{" "}
            tokens
          </span>
        </span>
        <span className="flex items-center gap-2">
          Open-Cooldesigner v0.1.0
          <ChevronUp
            size={12}
            className={pickerOpen ? "rotate-180 transition-transform" : "transition-transform"}
          />
        </span>
      </button>
    </footer>
  );
}
