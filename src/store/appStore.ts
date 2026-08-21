import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Artifact,
  GenerationOptions,
  ModelTestResult,
  Project,
  ProjectVersion,
  ProviderId,
} from "@/types";
import { DEFAULT_PROVIDER, PROVIDERS } from "@/types";
import { AIGateway } from "@/ai/gateway";
import { parseArtifactResponse } from "@/artifact/parser";
import { buildGenerationPrompt } from "@/prompts";
import { getDesignSystem } from "@/designSystem/registry";import { nowIso, uid } from "@/lib/utils";
import { estimatePendingCostUsd } from "@/services/costService";
import {
  loadApiKey,
  saveApiKey,
  deleteApiKey,
  isTauri,
} from "@/services/secretStorage";
import {
  buildAutoImprovePrompt,
  buildCritiquePrompt,
  parseCritiqueReport,
} from "@/skills/critique";
import type { ArtifactTweaks, CritiqueReport } from "@/skills/types";

export interface ProviderSettings {
  provider: ProviderId;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  budgetUsd: number | null;
}

export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
  artifactId?: string;
  createdAt: string;
}

export interface GenerationRecord {
  id: string;
  artifactId: string;
  projectId: string;
  provider: ProviderId;
  model: string;
  prompt: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  createdAt: string;
}

export interface BudgetWarning {
  exceeded: boolean;
  estimatedUsd: number;
  totalUsd: number;
  budgetUsd: number;
}

interface AppState {
  gateway: AIGateway;
  projects: Project[];
  activeProjectId: string | null;
  artifacts: Artifact[];
  versions: ProjectVersion[];
  chat: ChatEntry[];
  generations: GenerationRecord[];
  settings: ProviderSettings;
  apiKeyStored: boolean;
  customModels: Partial<Record<ProviderId, string[]>>;
  modelAliases: Record<string, string>;
  lastTest: Record<string, ModelTestResult>;
  lastModelsScan: Partial<Record<ProviderId, string>>;
  activeSkills: string[];
  activeTemplateId: string | null;
  defaultDesignSystemId: string;
  critiques: Record<string, CritiqueReport>;
  tweaks: Record<string, ArtifactTweaks>;
  generating: boolean;
  streamingText: string;
  error: string | null;
  lastPrompt: string | null;

  setSettings: (patch: Partial<ProviderSettings>) => void;
  persistApiKey: () => Promise<{ ok: boolean; message: string }>;
  initApiKey: () => Promise<void>;
  initApp: () => Promise<void>;
  setModelAlias: (provider: ProviderId, model: string, alias: string) => void;
  toggleSkill: (skillId: string) => void;
  setActiveTemplate: (templateId: string | null) => void;
  setDefaultDesignSystem: (id: string) => void;
  setProjectDesignSystem: (projectId: string, designSystemId: string) => void;
  critiqueArtifact: (artifactId: string) => Promise<CritiqueReport | null>;
  autoImprove: (artifactId: string) => Promise<Artifact | null>;
  setTweaks: (artifactId: string, tweaks: ArtifactTweaks) => void;
  applyTweaksToProject: (projectId: string, tweaks: ArtifactTweaks) => void;
  addCustomModel: (provider: ProviderId, model: string) => boolean;
  removeCustomModel: (provider: ProviderId, model: string) => void;
  loadRemoteModels: (
    provider: ProviderId,
  ) => Promise<{ ok: boolean; models: string[]; message: string }>;
  testModel: (provider: ProviderId, model: string) => Promise<ModelTestResult>;
  checkBudget: (prompt: string) => BudgetWarning;
  createProject: (name: string, designSystemId: string) => Project;
  deleteProject: (id: string) => void;
  openProject: (id: string) => void;
  updateArtifact: (artifactId: string, content: string, path?: string) => void;
  selectArtifact: (artifactId: string) => void;
  activeArtifactId: string | null;
  setActiveArtifact: (id: string | null) => void;
  generate: (prompt: string, options?: Partial<GenerationOptions>) => Promise<Artifact | null>;
  askSelection: (component: string, instruction: string, artifactId: string) => Promise<void>;
  restoreVersion: (versionId: string) => void;
  duplicateVersion: (versionId: string) => void;
  retryLastGenerate: () => Promise<Artifact | null>;
  clearError: () => void;
}

function createProjectFolders(): Record<string, string> {
  return {
    "brief.md": "# Brief\n\n(Décrivez ici les objectifs, le public cible et les contraintes du projet.)",
    "memory.md": "# Mémoire projet\n\n- Objectifs:\n- Public cible:\n- Décisions:",
    "DESIGN.md": "",
  };
}

const initialSettings: ProviderSettings = {
  provider: DEFAULT_PROVIDER,
  model: PROVIDERS[DEFAULT_PROVIDER].defaultModel,
  apiKey: "",
  baseUrl: PROVIDERS[DEFAULT_PROVIDER].baseUrl ?? "",
  temperature: 0.7,
  budgetUsd: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      gateway: new AIGateway(),
      projects: [],
      activeProjectId: null,
      artifacts: [],
      versions: [],
      chat: [],
      generations: [],
      settings: initialSettings,
      apiKeyStored: false,
      customModels: {},
      modelAliases: {},
      lastTest: {},
      lastModelsScan: {},
      activeSkills: [
        "design-brief",
        "template-guide",
        "design-critic",
        "design-refine",
        "tweaks",
      ],
      activeTemplateId: "dashboard",
      defaultDesignSystemId: "corporate",
      critiques: {},
      tweaks: {},
      generating: false,
      streamingText: "",
      error: null,
      lastPrompt: null,
      activeArtifactId: null,

      setSettings: (patch) => {
        const next = { ...get().settings, ...patch };
        if (patch.provider && patch.provider !== get().settings.provider) {
          const cfg = PROVIDERS[patch.provider];
          next.model = cfg.defaultModel;
          next.baseUrl = cfg.baseUrl ?? "";
        }
        set({ settings: next });
        if (patch.apiKey !== undefined) {
          if (isTauri()) {
            if (patch.apiKey.trim()) {
              void saveApiKey(patch.apiKey);
            } else {
              void deleteApiKey();
            }
          }
          set({ apiKeyStored: patch.apiKey.trim() !== "" });
        }
      },

      persistApiKey: async () => {
        const { apiKey } = get().settings;
        if (!apiKey.trim()) {
          return { ok: false, message: "Clé vide : rien à enregistrer." };
        }
        if (!isTauri()) {
          set({ apiKeyStored: true });
          return {
            ok: true,
            message:
              "Clé enregistrée dans ce navigateur (localStorage) : elle reste disponible entre les sessions.",
          };
        }
        try {
          await saveApiKey(apiKey);
          set({ apiKeyStored: true });
          return {
            ok: true,
            message: "Clé enregistrée dans le Windows Credential Manager.",
          };
        } catch {
          return {
            ok: false,
            message: "Échec de l'enregistrement dans le Credential Manager.",
          };
        }
      },

      initApiKey: async () => {
        const key = await loadApiKey();
        if (key) {
          set((s) => ({
            settings: { ...s.settings, apiKey: key },
            apiKeyStored: true,
          }));
        }
      },

      initApp: async () => {
        await get().initApiKey();
        const provider = get().settings.provider;
        if (provider === "ollama" || provider === "openai-compatible") {
          try {
            await get().loadRemoteModels(provider);
          } catch {
            // serveur local injoignable: silencieux
          }
        }
      },

      setModelAlias: (provider, model, alias) => {
        const name = alias.trim();
        const key = `${provider}:${model}`;
        const next = { ...get().modelAliases };
        if (!name) {
          delete next[key];
        } else {
          next[key] = name;
        }
        set({ modelAliases: next });
      },

      toggleSkill: (skillId) => {
        const active = get().activeSkills;
        set({
          activeSkills: active.includes(skillId)
            ? active.filter((s) => s !== skillId)
            : [...active, skillId],
        });
      },

      setActiveTemplate: (templateId) =>
        set({ activeTemplateId: templateId }),

      setDefaultDesignSystem: (id) => set({ defaultDesignSystemId: id }),

      setProjectDesignSystem: (projectId, designSystemId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, designSystemId, updatedAt: nowIso() }
              : p,
          ),
        })),

      critiqueArtifact: async (artifactId) => {
        const { gateway, settings, activeProjectId } = get();
        if (!activeProjectId) return null;
        const artifact = get().artifacts.find((a) => a.id === artifactId);
        if (!artifact) return null;
        set({ generating: true, error: null });
        try {
          const response = await gateway.chat(
            settings.provider,
            [
              { role: "system", content: "Tu es l'AI Design Critic d'Open-Cooldesigner. Réponds dans le format exact demandé." },
              { role: "user", content: buildCritiquePrompt(artifact) },
            ],
            {
              model: settings.model,
              apiKey: settings.apiKey || undefined,
              baseUrl: settings.baseUrl || undefined,
              temperature: 0.2,
            },
          );
          const report = parseCritiqueReport(response.content);
          set({
            critiques: { ...get().critiques, [artifactId]: report },
            generating: false,
          });
          return report;
        } catch (err) {
          set({
            generating: false,
            error: err instanceof Error ? err.message : String(err),
          });
          return null;
        }
      },

      autoImprove: async (artifactId) => {
        const { gateway, settings, activeProjectId } = get();
        if (!activeProjectId) return null;
        const artifact = get().artifacts.find((a) => a.id === artifactId);
        const report = get().critiques[artifactId];
        if (!artifact || !report) return null;
        set({ generating: true, error: null });
        try {
          const response = await gateway.chat(
            settings.provider,
            [
              {
                role: "system",
                content:
                  "Tu es Open-Cooldesigner. Réponds avec le code complet du fichier amélioré dans un bloc de code, rien d'autre.",
              },
              { role: "user", content: buildAutoImprovePrompt(artifact, report) },
            ],
            {
              model: settings.model,
              apiKey: settings.apiKey || undefined,
              baseUrl: settings.baseUrl || undefined,
              temperature: settings.temperature,
            },
          );
          const parsed = parseArtifactResponse(response.content);
          const updated = parsed.files[0] ?? {
            path: "index.html",
            content: response.content,
          };
          get().updateArtifact(artifactId, updated.content, updated.path);
          set({ generating: false });
          return get().artifacts.find((a) => a.id === artifactId) ?? null;
        } catch (err) {
          set({
            generating: false,
            error: err instanceof Error ? err.message : String(err),
          });
          return null;
        }
      },

      setTweaks: (artifactId, tweaks) =>
        set({
          tweaks: { ...get().tweaks, [artifactId]: tweaks },
        }),

      applyTweaksToProject: (projectId, tweaks) =>
        set((s) => {
          const next = { ...s.tweaks };
          const copy = structuredClone(tweaks);
          for (const a of s.artifacts) {
            if (a.projectId === projectId) next[a.id] = copy;
          }
          return { tweaks: next };
        }),

      addCustomModel: (provider, model) => {
        const name = model.trim();
        if (!name) return false;
        const existing = get().customModels[provider] ?? [];
        if (existing.includes(name)) return false;
        set({
          customModels: {
            ...get().customModels,
            [provider]: [...existing, name],
          },
        });
        if (get().settings.provider === provider && !get().settings.model) {
          set({ settings: { ...get().settings, model: name } });
        }
        return true;
      },

      removeCustomModel: (provider, model) => {
        const existing = get().customModels[provider] ?? [];
        set({
          customModels: {
            ...get().customModels,
            [provider]: existing.filter((m) => m !== model),
          },
        });
        if (
          get().settings.provider === provider &&
          get().settings.model === model
        ) {
          const cfg = PROVIDERS[provider];
          set({
            settings: { ...get().settings, model: cfg.defaultModel },
          });
        }
      },

      loadRemoteModels: async (provider) => {
        const { gateway, settings } = get();
        const result = await gateway.fetchRemoteModels(provider, {
          baseUrl: settings.baseUrl || undefined,
          apiKey: settings.apiKey || undefined,
        });
        if (result.ok && result.models.length > 0) {
          const existing = get().customModels[provider] ?? [];
          const merged = [...new Set([...existing, ...result.models])];
          set({
            customModels: { ...get().customModels, [provider]: merged },
          });
        }
        if (result.ok) {
          set({
            lastModelsScan: {
              ...get().lastModelsScan,
              [provider]: new Date().toISOString(),
            },
          });
        }
        return result;
      },

      testModel: async (provider, model) => {
        const { gateway, settings } = get();
        const result = await gateway.testModelConnection(provider, model, {
          apiKey: settings.apiKey || undefined,
          baseUrl: settings.baseUrl || undefined,
        });
        set({
          lastTest: {
            ...get().lastTest,
            [`${provider}:${model}`]: result,
          },
        });
        return result;
      },

      checkBudget: (prompt) => {
        const { settings } = get();
        const budget = settings.budgetUsd;
        const totalUsd = get().generations.reduce((sum, g) => sum + g.cost, 0);
        if (budget === null || budget <= 0) {
          return { exceeded: false, estimatedUsd: 0, totalUsd, budgetUsd: budget ?? 0 };
        }
        const estimatedUsd = estimatePendingCostUsd(
          settings.provider,
          settings.model,
          prompt,
        );
        return {
          exceeded: totalUsd + estimatedUsd > budget,
          estimatedUsd,
          totalUsd,
          budgetUsd: budget,
        };
      },

      createProject: (name, designSystemId) => {
        const now = nowIso();
        const project: Project = {
          id: uid("proj"),
          name: name.trim() || "Projet sans titre",
          description: "",
          designSystemId,
          createdAt: now,
          updatedAt: now,
        };
        const artifact: Artifact = {
          id: uid("art"),
          projectId: project.id,
          title: "Bienvenue",
          kind: "text",
          files: [
            { path: "index.html", content: buildWelcomeHtml() },
            ...Object.entries(createProjectFolders()).map(([path, content]) => ({
              path,
              content,
            })),
          ],
          createdAt: now,
          updatedAt: now,
        };
        const version: ProjectVersion = {
          id: uid("ver"),
          projectId: project.id,
          artifact: structuredClone(artifact),
          label: "v1 — initial",
          createdAt: now,
        };
        set((s) => ({
          projects: [...s.projects, project],
          artifacts: [...s.artifacts, artifact],
          versions: [...s.versions, version],
          activeProjectId: project.id,
          activeArtifactId: artifact.id,
          chat: [],
        }));
        return project;
      },

      deleteProject: (id) =>
        set((s) => {
          const remainingProjects = s.projects.filter((p) => p.id !== id);
          return {
            projects: remainingProjects,
            artifacts: s.artifacts.filter((a) => a.projectId !== id),
            versions: s.versions.filter((v) => v.projectId !== id),
            generations: s.generations.filter((g) => g.projectId !== id),
            activeProjectId:
              s.activeProjectId === id
                ? (remainingProjects[0]?.id ?? null)
                : s.activeProjectId,
            activeArtifactId:
              s.activeArtifactId &&
              s.artifacts.some(
                (a) => a.id === s.activeArtifactId && a.projectId === id,
              )
                ? null
                : s.activeArtifactId,
          };
        }),

      openProject: (id) => set({ activeProjectId: id, activeArtifactId: null }),

      updateArtifact: (artifactId, content, path = "index.html") =>
        set((s) => ({
          artifacts: s.artifacts.map((a) => {
            if (a.id !== artifactId) return a;
            const existing = a.files.find((f) => f.path === path);
            const files = existing
              ? a.files.map((f) =>
                  f.path === path ? { ...f, content } : f,
                )
              : [...a.files, { path, content }];
            return { ...a, files, updatedAt: nowIso() };
          }),
        })),

      selectArtifact: (artifactId) => set({ activeArtifactId: artifactId }),

      setActiveArtifact: (id) => set({ activeArtifactId: id }),

      generate: async (prompt, options = {}) => {
        const { settings, gateway, activeProjectId } = get();
        if (!activeProjectId) return null;
        const budget = get().checkBudget(prompt);
        if (budget.exceeded) {
          set({
            error: `Budget dépassé: traitement estimé à ${budget.estimatedUsd.toFixed(4)} USD (cumul ${budget.totalUsd.toFixed(4)} USD, budget ${budget.budgetUsd.toFixed(4)} USD). Augmentez le budget ou choisissez un modèle local.`,
          });
          return null;
        }
        set({ generating: true, error: null, streamingText: "", lastPrompt: prompt });
        try {
          const provider = options.provider ?? settings.provider;
          const model = options.model ?? settings.model;
          const designSystem = getDesignSystem(
            get().projects.find((p) => p.id === activeProjectId)
              ?.designSystemId ?? null,
          );
          const { system, user } = buildGenerationPrompt(
            prompt,
            designSystem,
            get().activeSkills,
            get().activeTemplateId,
          );
          const response = await gateway.chat(
            provider,
            [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            {
              model,
              apiKey: settings.apiKey || undefined,
              baseUrl: settings.baseUrl || undefined,
              temperature: options.temperature ?? settings.temperature,
            },
          );
          const parsed = parseArtifactResponse(response.content);
          const now = nowIso();
          const artifact: Artifact = {
            id: uid("art"),
            projectId: activeProjectId,
            title: parsed.title,
            kind: parsed.kind,
            files: parsed.files,
            createdAt: now,
            updatedAt: now,
          };
          const version: ProjectVersion = {
            id: uid("ver"),
            projectId: activeProjectId,
            artifact: structuredClone(artifact),
            label: `v${get().versions.filter((v) => v.projectId === activeProjectId).length + 1} — ${prompt.slice(0, 40)}`,
            createdAt: now,
          };
          const record: GenerationRecord = {
            id: uid("gen"),
            artifactId: artifact.id,
            projectId: activeProjectId,
            provider,
            model,
            prompt,
            inputTokens: response.usage.inputTokens,
            outputTokens: response.usage.outputTokens,
            cost: 0,
            createdAt: now,
          };
          set((s) => ({
            artifacts: [artifact, ...s.artifacts],
            versions: [...s.versions, version],
            generations: [record, ...s.generations],
            chat: [
              ...s.chat,
              { id: uid("msg"), role: "user", content: prompt, createdAt: now },
              {
                id: uid("msg"),
                role: "assistant",
                content: response.content,
                artifactId: artifact.id,
                createdAt: now,
              },
            ],
            activeArtifactId: artifact.id,
            generating: false,
          }));
          return artifact;
        } catch (err) {
          set({
            generating: false,
            error: err instanceof Error ? err.message : String(err),
          });
          return null;
        }
      },

      retryLastGenerate: async () => {
        const { lastPrompt, generating, activeProjectId } = get();
        if (!lastPrompt || generating || !activeProjectId) return null;
        return get().generate(lastPrompt);
      },

      askSelection: async (component, instruction, artifactId) => {
        const { gateway, settings } = get();
        set({ generating: true, error: null, streamingText: "" });
        try {
          const artifact = get().artifacts.find((a) => a.id === artifactId);
          if (!artifact) throw new Error("Artefact introuvable");
          const mainFile =
            artifact.files.find((f) => f.path === "index.html") ??
            artifact.files[0];
          const response = await gateway.chat(
            settings.provider,
            [
              {
                role: "system",
                content:
                  "Tu modifies UNIQUEMENT le composant sélectionné. Réponds avec le fichier complet modifié dans un bloc de code.",
              },
              {
                role: "user",
                content: `Composant sélectionné:\n${component}\n\nFichier actuel:\n${mainFile.content}\n\nInstruction: ${instruction}`,
              },
            ],
            {
              model: settings.model,
              apiKey: settings.apiKey || undefined,
              baseUrl: settings.baseUrl || undefined,
            },
          );
          const parsed = parseArtifactResponse(response.content);
          const updated = parsed.files[0] ?? { path: mainFile.path, content: mainFile.content };
          get().updateArtifact(artifactId, updated.content, updated.path);
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : String(err),
          });
        } finally {
          set({ generating: false });
        }
      },

      restoreVersion: (versionId) => {
        const version = get().versions.find((v) => v.id === versionId);
        if (!version) return;
        set((s) => ({
          artifacts: s.artifacts.map((a) =>
            a.id === version.artifact.id
              ? { ...structuredClone(version.artifact), updatedAt: nowIso() }
              : a,
          ),
        }));
      },

      duplicateVersion: (versionId) => {
        const version = get().versions.find((v) => v.id === versionId);
        if (!version) return;
        const now = nowIso();
        const copyArtifact: Artifact = {
          ...structuredClone(version.artifact),
          id: uid("art"),
          createdAt: now,
          updatedAt: now,
        };
        const copyVersion: ProjectVersion = {
          id: uid("ver"),
          projectId: version.projectId,
          artifact: copyArtifact,
          label: `${version.label} (copie)`,
          createdAt: now,
        };
        set((s) => ({
          artifacts: [...s.artifacts, copyArtifact],
          versions: [...s.versions, copyVersion],
          activeArtifactId: copyArtifact.id,
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "open-cooldesigner",
      partialize: (s) => ({
        projects: s.projects,
        artifacts: s.artifacts,
        versions: s.versions,
        chat: s.chat,
        generations: s.generations,
        settings: {
          provider: s.settings.provider,
          model: s.settings.model,
          baseUrl: s.settings.baseUrl,
          temperature: s.settings.temperature,
          budgetUsd: s.settings.budgetUsd,
          apiKey: s.settings.apiKey,
        },
        customModels: s.customModels,
        modelAliases: s.modelAliases,
        lastTest: s.lastTest,
        lastModelsScan: s.lastModelsScan,
        activeSkills: s.activeSkills,
        activeTemplateId: s.activeTemplateId,
        defaultDesignSystemId: s.defaultDesignSystemId,
        critiques: s.critiques,
        tweaks: s.tweaks,
        lastPrompt: s.lastPrompt,
        activeProjectId: s.activeProjectId,
        activeArtifactId: s.activeArtifactId,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        const settings = {
          ...initialSettings,
          ...(p.settings ?? {}),
        };
        const hasValidModel = PROVIDERS[settings.provider]?.models.includes(
          settings.model,
        );
        const customModels = p.customModels ?? {};
        const customForProvider = customModels[settings.provider] ?? [];
        if (
          !hasValidModel &&
          !customForProvider.includes(settings.model)
        ) {
          settings.model = PROVIDERS[settings.provider]?.defaultModel ?? settings.model;
        }
        return {
          ...current,
          ...p,
          settings,
          apiKeyStored: settings.apiKey.trim() !== "",
          customModels,
          modelAliases: p.modelAliases ?? {},
          lastTest: p.lastTest ?? {},
          lastModelsScan: p.lastModelsScan ?? {},
          activeSkills:
            p.activeSkills ?? [
              "design-brief",
              "template-guide",
              "design-critic",
              "design-refine",
              "tweaks",
            ],
          activeTemplateId: p.activeTemplateId ?? "dashboard",
          defaultDesignSystemId: p.defaultDesignSystemId ?? "corporate",
          critiques: p.critiques ?? {},
          tweaks: p.tweaks ?? {},
          lastPrompt: p.lastPrompt ?? null,
          projects: p.projects ?? [],
          artifacts: p.artifacts ?? [],
          versions: p.versions ?? [],
          chat: p.chat ?? [],
          generations: p.generations ?? [],
        };
      },
    },
  ),
);

export function useActiveProject() {
  return useAppStore((s) =>
    s.projects.find((p) => p.id === s.activeProjectId) ?? null,
  );
}

export function useActiveArtifact() {
  return useAppStore((s) =>
    s.artifacts.find((a) => a.id === s.activeArtifactId) ?? null,
  );
}

export function useProjectVersions(projectId: string | null) {
  return useAppStore((s) =>
    s.versions
      .filter((v) => v.projectId === projectId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

function buildWelcomeHtml(): string {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Bienvenue dans Open-Cooldesigner</title>
<style>
  :root { --primary: #4f46e5; --bg: #f8fafc; --fg: #0f172a; }
  * { box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; margin: 0; background: var(--bg); color: var(--fg); }
  main { max-width: 720px; margin: 0 auto; padding: 4rem 1.5rem; }
  .badge { display: inline-block; background: #eef2ff; color: var(--primary); border-radius: 999px; padding: 0.25rem 0.75rem; font-size: 0.8rem; font-weight: 600; }
  h1 { font-size: 2rem; margin: 0.75rem 0; }
  p { line-height: 1.6; color: #475569; }
  code { background: #e2e8f0; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.9em; }
  .steps { display: grid; gap: 0.75rem; margin-top: 1.5rem; }
  .step { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 0.9rem 1rem; }
  .step b { color: var(--primary); margin-right: 0.5rem; }
</style>
</head>
<body>
<main>
  <span class="badge">Open-Cooldesigner</span>
  <h1>Projet créé 🎉</h1>
  <p>Votre projet est prêt. Décrivez dans le chat à gauche ce que vous voulez concevoir, par exemple :
  <code>"Crée un dashboard de suivi commercial"</code> — puis générez.</p>
  <div class="steps">
    <div class="step"><b>1.</b> Vérifiez votre fournisseur IA dans les paramètres</div>
    <div class="step"><b>2.</b> Écrivez votre brief dans le chat</div>
    <div class="step"><b>3.</b> Prévisualisez, modifiez le code, comparez les versions</div>
    <div class="step"><b>4.</b> Exportez en HTML/ZIP</div>
  </div>
</main>
</body>
</html>`;
}
