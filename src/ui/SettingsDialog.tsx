import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/appStore";
import { PROVIDERS, type ProviderId } from "@/types";
import {
  apiKeyOptional,
  isLocalProvider,
  requiresApiKey,
} from "@/services/costService";
import { ModelStatusDot, TestingBadge } from "./ModelPicker";
import { modelDisplayName } from "@/lib/modelNames";
import { cn } from "@/lib/cn";
import { isTauri } from "@/services/secretStorage";
import { SKILLS, TEMPLATES } from "@/skills/registry";
import { Eye, EyeOff, Pencil, X } from "lucide-react";

type Tab = "provider" | "templates" | "skills";

export default function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const customModels = useAppStore((s) => s.customModels);
  const addCustomModel = useAppStore((s) => s.addCustomModel);
  const removeCustomModel = useAppStore((s) => s.removeCustomModel);
  const loadRemoteModels = useAppStore((s) => s.loadRemoteModels);
  const testModel = useAppStore((s) => s.testModel);
  const modelAliases = useAppStore((s) => s.modelAliases);
  const setModelAlias = useAppStore((s) => s.setModelAlias);
  const lastModelsScan = useAppStore((s) => s.lastModelsScan);
  const activeSkills = useAppStore((s) => s.activeSkills);
  const toggleSkill = useAppStore((s) => s.toggleSkill);
  const activeTemplateId = useAppStore((s) => s.activeTemplateId);
  const setActiveTemplate = useAppStore((s) => s.setActiveTemplate);
  const apiKeyStored = useAppStore((s) => s.apiKeyStored);
  const persistApiKey = useAppStore((s) => s.persistApiKey);

  const [newModel, setNewModel] = useState("");
  const [busy, setBusy] = useState<"load" | "test" | "save" | null>(null);
  const [feedback, setFeedback] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);
  const [keyFeedback, setKeyFeedback] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [editingAlias, setEditingAlias] = useState<{
    model: string;
    value: string;
  } | null>(null);
  const [tab, setTab] = useState<Tab>("provider");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const keyInputRef = useRef<HTMLInputElement>(null);

  const autoTestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!open) return;
    const provider = settings.provider;
    const needsKey = requiresApiKey(provider);
    if (!needsKey || !settings.apiKey.trim()) return;
    if (autoTestTimer.current) clearTimeout(autoTestTimer.current);
    autoTestTimer.current = setTimeout(() => {
      void testModel(provider, settings.model);
    }, 1000);
    return () => {
      if (autoTestTimer.current) clearTimeout(autoTestTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.apiKey, settings.provider, open]);

  if (!open) return null;

  const config = PROVIDERS[settings.provider];
  const local = isLocalProvider(settings.provider);
  const customs = (customModels[settings.provider] ?? []).filter(
    (m) => !config.models.includes(m),
  );
  const scanTime = lastModelsScan[settings.provider];

  const submitModel = () => {
    const name = newModel.trim();
    if (!name) return;
    const added = addCustomModel(settings.provider, name);
    setFeedback(
      added
        ? { kind: "ok", text: `Modèle « ${name} » ajouté.` }
        : { kind: "err", text: `Le modèle « ${name} » existe déjà.` },
    );
    if (added) setNewModel("");
  };

  const runLoad = async () => {
    setBusy("load");
    setFeedback(null);
    const result = await loadRemoteModels(settings.provider);
    setFeedback({
      kind: result.ok ? "ok" : "err",
      text: result.message,
    });
    setBusy(null);
  };

  const runTest = async () => {
    setBusy("test");
    setFeedback(null);
    const result = await testModel(settings.provider, settings.model);
    setFeedback({
      kind: result.ok ? "ok" : "err",
      text: `${result.message} (${result.latencyMs} ms)`,
    });
    setBusy(null);
  };

  const runPersistKey = async () => {
    setBusy("save");
    setKeyFeedback(null);
    const result = await persistApiKey();
    setKeyFeedback({ kind: result.ok ? "ok" : "err", text: result.message });
    setBusy(null);
  };

  const saveAlias = () => {
    if (!editingAlias) return;
    setModelAlias(settings.provider, editingAlias.model, editingAlias.value);
    setEditingAlias(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="max-h-[90vh] w-[520px] overflow-y-auto rounded-lg bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Paramètres IA"
      >
        <h2 className="mb-4 text-lg font-semibold">Paramètres IA</h2>

        <div className="mb-4 flex gap-1 rounded-md bg-muted p-1">
          {(
            [
              ["provider", "Fournisseur"],
              ["templates", "Templates"],
              ["skills", "Skills"],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 rounded px-2 py-1 text-xs font-medium",
                tab === id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "templates" && (
          <div>
            <p className="mb-2 text-xs text-muted-foreground">
              Le template sélectionné guide la structure des générations
              (injecté dans le prompt système avec son exemple de référence).
            </p>
            <div className="max-h-[50vh] space-y-1 overflow-y-auto">
              {TEMPLATES.map((t) => (
                <div
                  key={t.manifest.id}
                  className={cn(
                    "rounded-md border p-2",
                    activeTemplateId === t.manifest.id && "border-primary bg-accent/40",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveTemplate(t.manifest.id)}
                      className="flex min-w-0 flex-1 flex-col text-left"
                    >
                      <span className="text-sm font-medium">{t.manifest.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {t.manifest.description}
                      </span>
                    </button>
                    <button
                      onClick={() => setPreviewTemplate(
                        previewTemplate === t.manifest.id ? null : t.manifest.id,
                      )}
                      className="shrink-0 rounded border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted"
                    >
                      {previewTemplate === t.manifest.id ? "Masquer" : "Preview"}
                    </button>
                  </div>
                  {previewTemplate === t.manifest.id && t.exampleHtml && (
                    <iframe
                      title={`Preview ${t.manifest.name}`}
                      sandbox="allow-scripts"
                      srcDoc={t.exampleHtml}
                      className="mt-2 h-48 w-full rounded border"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "skills" && (
          <div>
            <p className="mb-2 text-xs text-muted-foreground">
              Les skills actifs s'exécutent automatiquement dans le pipeline :
              avant (Design Brief), pendant (Template Guide), après (Design
              Critic) et en direct (Tweaks).
            </p>
            <div className="space-y-1">
              {SKILLS.map((s) => {
                const active = activeSkills.includes(s.manifest.id);
                return (
                  <div
                    key={s.manifest.id}
                    className="flex items-start justify-between gap-2 rounded-md border p-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{s.manifest.name}</span>
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {s.manifest.stage}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {s.manifest.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSkill(s.manifest.id)}
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {active ? "Actif" : "Inactif"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "provider" && (
          <>

        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Fournisseur
        </label>
        <select
          value={settings.provider}
          onChange={(e) =>
            setSettings({ provider: e.target.value as ProviderId })
          }
          className="mb-3 w-full rounded-md border bg-background px-2 py-1.5 text-sm outline-none"
        >
          {Object.values(PROVIDERS).map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Modèle actif
        </label>
        <div className="mb-2 flex items-center gap-2">
          <select
            value={settings.model}
            onChange={(e) => setSettings({ model: e.target.value })}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm outline-none"
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
          <ModelStatusDot model={settings.model} />
        </div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <button
            onClick={runTest}
            disabled={busy !== null}
            className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-muted disabled:opacity-50"
          >
            <TestingBadge busy={busy === "test"} />
            Tester la connexion
          </button>
          {(local || settings.provider === "openai") && (
            <button
              onClick={runLoad}
              disabled={busy !== null}
              className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs hover:bg-muted disabled:opacity-50"
            >
              <TestingBadge busy={busy === "load"} />
              Charger les modèles
            </button>
          )}
          {scanTime && (
            <span className="text-[10px] text-muted-foreground">
              Dernier scan:{" "}
              {new Date(scanTime).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Ajouter un modèle
        </label>
        <div className="mb-2 flex gap-2">
          <input
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitModel()}
            placeholder="ex: gpt-5-turbo, llama3.3, mistral-large…"
            className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={submitModel}
            disabled={!newModel.trim()}
            className="rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
        {customs.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {customs.map((m) => (
              <span
                key={m}
                className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
                title={m}
              >
                {modelDisplayName(settings.provider, m, modelAliases)}
                <button
                  onClick={() =>
                    setEditingAlias({ model: m, value: modelAliases[`${settings.provider}:${m}`] ?? m })
                  }
                  className="text-muted-foreground hover:text-primary"
                  title={`Renommer ${m}`}
                >
                  <Pencil size={10} />
                </button>
                <button
                  onClick={() => removeCustomModel(settings.provider, m)}
                  className="text-muted-foreground hover:text-destructive"
                  title={`Supprimer ${m}`}
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
        {editingAlias && (
          <div className="mb-3 flex gap-2">
            <input
              autoFocus
              value={editingAlias.value}
              onChange={(e) =>
                setEditingAlias({ ...editingAlias, value: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && saveAlias()}
              placeholder="Alias lisible (ex: Nemotron)"
              className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={saveAlias}
              className="rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground"
            >
              OK
            </button>
            <button
              onClick={() => setEditingAlias(null)}
              className="rounded-md px-2 text-xs hover:bg-muted"
            >
              Annuler
            </button>
          </div>
        )}

        {requiresApiKey(settings.provider) && (
          <>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Clé API
              {apiKeyOptional(settings.provider) && (
                <span className="ml-1 font-normal italic">
                  (optionnel pour serveurs locaux)
                </span>
              )}
            </label>
            <div className="mb-1 flex items-center gap-2">
              <input
                ref={keyInputRef}
                type={showKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) => {
                  setSettings({ apiKey: e.target.value });
                  setKeyFeedback(null);
                }}
                placeholder={`Variable ${config.apiKeyEnvVar} sinon`}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="shrink-0 rounded-md border px-2 py-1.5 text-muted-foreground hover:bg-muted"
                title={showKey ? "Masquer la clé" : "Afficher la clé"}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={runPersistKey}
                disabled={!settings.apiKey.trim() || busy !== null}
                className="flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-50"
                title="Enregistrer la clé dans le Windows Credential Manager"
              >
                <TestingBadge busy={busy === "save"} />
                Enregistrer
              </button>
            </div>
            <p
              className={cn(
                "mb-1 text-[10px]",
                apiKeyStored ? "text-green-700" : "text-amber-600",
              )}
            >
              {apiKeyStored
                ? isTauri()
                  ? "✓ Clé enregistrée de façon permanente (Windows Credential Manager)"
                  : "✓ Clé enregistrée de façon permanente dans ce navigateur"
                : settings.apiKey
                  ? "Clé non enregistrée"
                  : "Aucune clé enregistrée"}
            </p>
            {keyFeedback && (
              <p
                className={cn(
                  "mb-2 rounded-md px-2 py-1 text-[11px]",
                  keyFeedback.kind === "ok"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600",
                )}
              >
                {keyFeedback.text}
              </p>
            )}
            {apiKeyOptional(settings.provider) && (
              <p className="mb-3 text-[10px] text-muted-foreground">
                Obligatoire pour les APIs cloud compatibles (ex: DeepSeek),
                vide pour un serveur local (LM Studio…).
              </p>
            )}
          </>
        )}

        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          URL de base (facultatif)
        </label>
        <input
          value={settings.baseUrl}
          onChange={(e) => setSettings({ baseUrl: e.target.value })}
          placeholder={config.baseUrl ?? "https://api…"}
          className="mb-3 w-full rounded-md border bg-background px-2 py-1.5 text-sm outline-none"
        />

        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Température : <span className="font-semibold text-foreground">{settings.temperature.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={settings.temperature}
          onChange={(e) => setSettings({ temperature: Number(e.target.value) })}
          className="mb-3 w-full accent-primary"
        />

        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Budget max projet (USD, vide = illimité)
        </label>
        <input
          type="number"
          min={0}
          step={0.01}
          value={settings.budgetUsd ?? ""}
          onChange={(e) =>
            setSettings({
              budgetUsd:
                e.target.value === "" ? null : Number(e.target.value),
            })
          }
          placeholder="ex: 10"
          className="mb-3 w-full rounded-md border bg-background px-2 py-1.5 text-sm outline-none"
        />
          </>
        )}

        {feedback && (
          <p
            className={cn(
              "mb-3 rounded-md px-2 py-1.5 text-xs",
              feedback.kind === "ok"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600",
            )}
          >
            {feedback.text}
          </p>
        )}

        <p className="mb-4 text-xs text-muted-foreground">
          En environnement Tauri, la clé API est enregistrée dans le Windows
          Credential Manager (commande <code>store_secret</code>) et n'est
          jamais écrite sur disque. En navigateur (mode dev), elle est
          conservée de façon permanente dans le localStorage de ce navigateur
          (stockage local, en clair). Le test de connexion n'envoie la clé que
          vers le fournisseur choisi. La détection automatique des modèles
          s'exécute au démarrage pour les serveurs locaux.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md px-3 py-1.5 text-sm hover:bg-muted"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
