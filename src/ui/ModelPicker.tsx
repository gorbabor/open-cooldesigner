import { useAppStore } from "@/store/appStore";
import { PROVIDERS, type ProviderId } from "@/types";
import { cn } from "@/lib/cn";
import { modelDisplayName } from "@/lib/modelNames";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function ModelPicker({ compact = false }: { compact?: boolean }) {
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const customModels = useAppStore((s) => s.customModels);
  const lastTest = useAppStore((s) => s.lastTest);
  const modelAliases = useAppStore((s) => s.modelAliases);

  const config = PROVIDERS[settings.provider];
  const customs = (customModels[settings.provider] ?? []).filter(
    (m) => !config.models.includes(m),
  );
  const test = lastTest[`${settings.provider}:${settings.model}`];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        compact ? "text-xs" : "text-sm",
      )}
    >
      <select
        value={settings.provider}
        onChange={(e) =>
          setSettings({ provider: e.target.value as ProviderId })
        }
        title="Fournisseur IA"
        className="max-w-[130px] rounded-md border bg-background px-1.5 py-1 text-xs outline-none focus:ring-2 focus:ring-ring"
      >
        {Object.values(PROVIDERS).map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <select
        value={settings.model}
        onChange={(e) => setSettings({ model: e.target.value })}
        title="Modèle"
        className="max-w-[170px] rounded-md border bg-background px-1.5 py-1 text-xs outline-none focus:ring-2 focus:ring-ring"
      >
        {config.models.map((m) => (
          <option key={m} value={m}>
            {modelDisplayName(settings.provider, m, modelAliases)}
          </option>
        ))}
        {customs.length > 0 && (
          <optgroup label="Personnalisés">
            {customs.map((m) => (
              <option key={m} value={m}>
                {modelDisplayName(settings.provider, m, modelAliases)}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      {test && (
        <span
          title={`${test.ok ? "Connexion OK" : "Échec du test"}: ${test.message} (${test.latencyMs} ms)`}
          className={cn("flex items-center", test.ok ? "text-green-600" : "text-red-500")}
        >
          {test.ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
        </span>
      )}
    </div>
  );
}

export function ModelStatusDot({ model }: { model: string }) {
  const lastTest = useAppStore((s) => s.lastTest);
  const settings = useAppStore((s) => s.settings);
  const test = lastTest[`${settings.provider}:${model}`];
  if (!test) return null;
  return (
    <span
      title={test.message}
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        test.ok ? "bg-green-500" : "bg-red-500",
      )}
    />
  );
}

export function TestingBadge({ busy }: { busy: boolean }) {
  if (!busy) return null;
  return <Loader2 size={13} className="animate-spin text-muted-foreground" />;
}
