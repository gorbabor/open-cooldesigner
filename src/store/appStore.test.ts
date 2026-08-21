import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "./appStore";
import type { ArtifactTweaks } from "@/skills/types";

const HTML_ANSWER =
  "```html\n<!doctype html><html><head><title>Dashboard Ventes</title></head><body><h1>Ventes</h1></body></html>\n```";

function mockOpenAI(): ReturnType<typeof vi.fn> {
  const fn = vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        choices: [{ message: { content: HTML_ANSWER } }],
        usage: { prompt_tokens: 100, completion_tokens: 50 },
      }),
      { status: 200 },
    ),
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

beforeEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  useAppStore.setState({
    projects: [],
    artifacts: [],
    versions: [],
    chat: [],
    generations: [],
    activeProjectId: null,
    activeArtifactId: null,
    generating: false,
    error: null,
    streamingText: "",
    lastPrompt: null,
    customModels: {},
    lastTest: {},
    settings: {
      provider: "openai",
      model: "gpt-4o-mini",
      apiKey: "sk-test",
      baseUrl: "",
      temperature: 0.7,
      budgetUsd: null,
    },
  });
});

describe("appStore — cycle MVP (scénario §77 du CDC)", () => {
  it("crée un projet avec artefact initial et snapshot v1", () => {
    const project = useAppStore.getState().createProject("Suivi commercial", "fintech");
    const s = useAppStore.getState();
    expect(s.projects).toHaveLength(1);
    expect(s.activeProjectId).toBe(project.id);
    expect(s.artifacts).toHaveLength(1);
    expect(s.versions).toHaveLength(1);
    expect(s.versions[0].label).toContain("v1");
  });

  it("génère un artefact, l'ajoute aux versions et au chat", async () => {
    mockOpenAI();
    useAppStore.getState().createProject("Suivi commercial", "fintech");
    const artifact = await useAppStore.getState().generate(
      "Crée un dashboard de suivi commercial",
    );
    expect(artifact).not.toBeNull();
    const s = useAppStore.getState();
    expect(s.generating).toBe(false);
    expect(s.artifacts).toHaveLength(2);
    expect(s.versions).toHaveLength(2);
    expect(s.versions[1].label).toContain("v2");
    expect(s.activeArtifactId).toBe(artifact!.id);
    expect(s.chat).toHaveLength(2);
    expect(s.chat[0].role).toBe("user");
    expect(s.chat[1].role).toBe("assistant");
    expect(artifact!.title).toBe("Dashboard Ventes");
    expect(artifact!.files[0].path).toBe("index.html");
  });

  it("conserve le projet intact quand l'IA échoue (aucune corruption)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("nope", { status: 500 })),
    );
    useAppStore.getState().createProject("P", "minimal");
    const before = useAppStore.getState().artifacts.length;
    const artifact = await useAppStore.getState().generate("provoque une erreur");
    const s = useAppStore.getState();
    expect(artifact).toBeNull();
    expect(s.error).toMatch(/500/);
    expect(s.artifacts.length).toBe(before);
    expect(s.versions.length).toBe(before);
    expect(s.generating).toBe(false);
  });

  it("supprime un projet et ses données liées", () => {
    mockOpenAI();
    const p1 = useAppStore.getState().createProject("A", "corporate");
    const p2 = useAppStore.getState().createProject("B", "minimal");
    void useAppStore.getState().generate("un dashboard");
    useAppStore.getState().deleteProject(p1.id);
    const s = useAppStore.getState();
    expect(s.projects.map((p) => p.id)).toEqual([p2.id]);
    expect(s.artifacts.every((a) => a.projectId !== p1.id)).toBe(true);
    expect(s.versions.every((v) => v.projectId !== p1.id)).toBe(true);
  });

  it("réinitialise activeArtifactId quand on supprime le projet actif", () => {
    mockOpenAI();
    const p1 = useAppStore.getState().createProject("A", "corporate");
    const p2 = useAppStore.getState().createProject("B", "minimal");
    void useAppStore.getState().generate("un dashboard");
    useAppStore.getState().openProject(p1.id);
    const art = useAppStore.getState().artifacts.find((a) => a.projectId === p1.id)!;
    useAppStore.getState().selectArtifact(art.id);
    useAppStore.getState().deleteProject(p1.id);
    const s = useAppStore.getState();
    expect(s.activeArtifactId).toBeNull();
    expect(s.artifacts.find((a) => a.id === art.id)).toBeUndefined();
    expect(s.activeProjectId).toBe(p2.id);
  });

  it("restaure une version antérieure", async () => {
    mockOpenAI();
    useAppStore.getState().createProject("P", "corporate");
    const v1 = useAppStore.getState().versions[0];
    await useAppStore.getState().generate("nouvelle version");
    const before = useAppStore.getState().artifacts.find(
      (a) => a.id === v1.artifact.id,
    )!;
    const firstContent = before.files[0].content;
    expect(firstContent).toContain("Bienvenue");
    useAppStore.getState().restoreVersion(v1.id);
    const after = useAppStore.getState().artifacts.find(
      (a) => a.id === v1.artifact.id,
    )!;
    expect(after.files[0].content).toContain("Bienvenue");
  });

  it("duplique une version sans modifier l'original (branche)", async () => {
    mockOpenAI();
    useAppStore.getState().createProject("P", "corporate");
    const v1 = useAppStore.getState().versions[0];
    useAppStore.getState().duplicateVersion(v1.id);
    const s = useAppStore.getState();
    expect(s.versions).toHaveLength(2);
    const copy = s.versions[1];
    expect(copy.id).not.toBe(v1.id);
    expect(copy.label).toContain("copie");
    expect(copy.artifact.id).not.toBe(v1.artifact.id);
    expect(copy.artifact.files).toEqual(v1.artifact.files);
    expect(s.artifacts).toHaveLength(2);
    expect(s.activeArtifactId).toBe(copy.artifact.id);
  });

  it("persiste la clé API dans localStorage (permanente en navigateur)", async () => {
    useAppStore.getState().setSettings({ apiKey: "sk-secret-123" });
    await new Promise((r) => setTimeout(r, 20));
    const raw = localStorage.getItem("open-cooldesigner") ?? "";
    expect(raw).toContain("sk-secret-123");
    expect(useAppStore.getState().apiKeyStored).toBe(true);
  });

  it("modifie un artefact via updateArtifact (édition manuelle)", () => {
    const project = useAppStore.getState().createProject("P", "minimal");
    const art = useAppStore.getState().artifacts[0];
    useAppStore.getState().updateArtifact(art.id, "<h1>édité</h1>");
    const updated = useAppStore.getState().artifacts.find((a) => a.id === art.id)!;
    expect(updated.files.find((f) => f.path === "index.html")!.content).toBe(
      "<h1>édité</h1>",
    );
    expect(updated.projectId).toBe(project.id);
  });
});

describe("appStore — modèles custom & persistance", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    useAppStore.setState({
      projects: [],
      artifacts: [],
      versions: [],
      chat: [],
      generations: [],
      activeProjectId: null,
      activeArtifactId: null,
      generating: false,
      error: null,
      streamingText: "",
      lastPrompt: null,
      customModels: {},
      lastTest: {},
      settings: {
        provider: "openai",
        model: "gpt-4o-mini",
        apiKey: "sk-test",
        baseUrl: "",
        temperature: 0.7,
        budgetUsd: null,
      },
    });
  });

  it("ajoute un modèle custom sans doublon et le persiste avec la clé API", () => {
    const added = useAppStore.getState().addCustomModel("openai", "gpt-5-turbo");
    expect(added).toBe(true);
    expect(useAppStore.getState().addCustomModel("openai", "gpt-5-turbo")).toBe(false);
    expect(useAppStore.getState().addCustomModel("openai", "  ")).toBe(false);
    const custom = useAppStore.getState().customModels.openai;
    expect(custom).toEqual(["gpt-5-turbo"]);
    const raw = localStorage.getItem("open-cooldesigner") ?? "";
    expect(raw).toContain("gpt-5-turbo");
    expect(raw).toContain("sk-test");
    expect(raw).toContain("apiKey");
  });

  it("supprime un modèle custom et rebascule sur le modèle par défaut si sélectionné", () => {
    useAppStore.getState().addCustomModel("openai", "gpt-5-turbo");
    useAppStore.getState().setSettings({ model: "gpt-5-turbo" });
    useAppStore.getState().removeCustomModel("openai", "gpt-5-turbo");
    expect(useAppStore.getState().customModels.openai).toEqual([]);
    expect(useAppStore.getState().settings.model).toBe("gpt-4o");
  });

  it("fusionne les modèles distants avec les custom sans écrasement", async () => {
    useAppStore.getState().addCustomModel("ollama", "mon-modele");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ models: [{ name: "llama3.2:latest" }, { name: "qwen2.5:7b" }] }),
          { status: 200 },
        ),
      ),
    );
    const result = await useAppStore.getState().loadRemoteModels("ollama");
    expect(result.ok).toBe(true);
    expect(result.models).toEqual(["llama3.2", "qwen2.5:7b"]);
    const merged = useAppStore.getState().customModels.ollama;
    expect(merged).toEqual(["mon-modele", "llama3.2", "qwen2.5:7b"]);
  });

  it("testModel enregistre le statut du dernier test", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: "pong" } }],
            usage: { prompt_tokens: 1, completion_tokens: 1 },
          }),
          { status: 200 },
        ),
      ),
    );
    const result = await useAppStore.getState().testModel("openai", "gpt-4o-mini");
    expect(result.ok).toBe(true);
    const stored = useAppStore.getState().lastTest["openai:gpt-4o-mini"];
    expect(stored.ok).toBe(true);
  });

  it("persiste température, budget et clé API", () => {
    useAppStore.getState().setSettings({ temperature: 0.2, budgetUsd: 5 });
    const raw = localStorage.getItem("open-cooldesigner") ?? "";
    expect(raw).toContain('"temperature":0.2');
    expect(raw).toContain('"budgetUsd":5');
    expect(raw).toContain("sk-test");
  });

  it("merge un état persisté ancien format (sans temperature/budgetUsd)", async () => {    const oldState = {
      state: {
        projects: [],
        artifacts: [],
        versions: [],
        chat: [],
        generations: [],
        settings: { provider: "openai", model: "gpt-4o-mini", baseUrl: "" },
        activeProjectId: null,
        activeArtifactId: null,
      },
      version: 0,
    };
    localStorage.setItem("open-cooldesigner", JSON.stringify(oldState));
    vi.resetModules();
    const { useAppStore: freshStore } = await import("./appStore");
    const s = freshStore.getState();
    expect(s.settings.temperature).toBe(0.7);
    expect(s.settings.budgetUsd).toBeNull();
    expect(s.customModels).toEqual({});
    expect(s.lastTest).toEqual({});
  });

  it("rebascule sur le modèle par défaut si le modèle persisté n'existe plus", async () => {
    const staleState = {
      state: {
        projects: [],
        artifacts: [],
        versions: [],
        chat: [],
        generations: [],
        settings: {
          provider: "openai",
          model: "modele-supprime",
          baseUrl: "",
          temperature: 0.5,
          budgetUsd: null,
        },
        customModels: { openai: [] },
        lastTest: {},
        lastPrompt: null,
        activeProjectId: null,
        activeArtifactId: null,
      },
      version: 0,
    };
    localStorage.setItem("open-cooldesigner", JSON.stringify(staleState));
    vi.resetModules();
    const { useAppStore: freshStore } = await import("./appStore");
    expect(freshStore.getState().settings.model).toBe("gpt-4o");
  });

  it("setModelAlias enregistre et persiste un alias (et l'efface si vide)", () => {
    useAppStore.getState().addCustomModel("ollama", "hf.co/bartowski/nemotron:Q5_K_M");
    useAppStore.getState().setModelAlias(
      "ollama",
      "hf.co/bartowski/nemotron:Q5_K_M",
      "Nemotron",
    );
    expect(
      useAppStore.getState().modelAliases[
        "ollama:hf.co/bartowski/nemotron:Q5_K_M"
      ],
    ).toBe("Nemotron");
    const raw = localStorage.getItem("open-cooldesigner") ?? "";
    expect(raw).toContain("Nemotron");
    useAppStore.getState().setModelAlias(
      "ollama",
      "hf.co/bartowski/nemotron:Q5_K_M",
      "",
    );
    expect(
      useAppStore.getState().modelAliases[
        "ollama:hf.co/bartowski/nemotron:Q5_K_M"
      ],
    ).toBeUndefined();
  });

  it("initApp charge les modèles locaux automatiquement au démarrage", async () => {
    useAppStore.getState().setSettings({
      provider: "ollama",
      model: "llama3.2",
      baseUrl: "http://localhost:11434/v1",
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ models: [{ name: "llama3.2:latest" }, { name: "qwen2.5:7b" }] }),
          { status: 200 },
        ),
      ),
    );
    await useAppStore.getState().initApp();
    const s = useAppStore.getState();
    expect(s.customModels.ollama).toEqual(["llama3.2", "qwen2.5:7b"]);
    expect(s.lastModelsScan.ollama).toBeTruthy();
  });

  it("initApp reste silencieux si le serveur local est injoignable", async () => {
    useAppStore.getState().setSettings({
      provider: "ollama",
      model: "llama3.2",
      baseUrl: "http://localhost:11434/v1",
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );
    await expect(useAppStore.getState().initApp()).resolves.toBeUndefined();
    expect(useAppStore.getState().customModels.ollama ?? []).toEqual([]);
  });

  it("loadRemoteModels enregistre l'heure du dernier scan réussi", async () => {
    useAppStore.getState().setSettings({ provider: "openai", apiKey: "sk-test" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: [{ id: "gpt-4o" }] }), {
          status: 200,
        }),
      ),
    );
    await useAppStore.getState().loadRemoteModels("openai");
    expect(useAppStore.getState().lastModelsScan.openai).toBeTruthy();
    expect(useAppStore.getState().customModels.openai).toEqual(["gpt-4o"]);
  });
});

describe("appStore — budget & retry", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    useAppStore.setState({
      projects: [],
      artifacts: [],
      versions: [],
      chat: [],
      generations: [],
      activeProjectId: null,
      activeArtifactId: null,
      generating: false,
      error: null,
      streamingText: "",
      lastPrompt: null,
      customModels: {},
      lastTest: {},
      settings: {
        provider: "openai",
        model: "gpt-4o-mini",
        apiKey: "sk-test",
        baseUrl: "",
        temperature: 0.7,
        budgetUsd: null,
      },
    });
  });

  it("bloque la génération quand le budget est dépassé, sans appeler l'IA", async () => {
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().setSettings({ budgetUsd: 0.0001 });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const longPrompt = "x".repeat(5000);
    const artifact = await useAppStore.getState().generate(longPrompt);
    expect(artifact).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(useAppStore.getState().error).toMatch(/Budget dépassé/i);
    expect(useAppStore.getState().artifacts).toHaveLength(1);
  });

  it("permet la génération quand le budget est vide (illimité)", async () => {
    mockOpenAI();
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().setSettings({ budgetUsd: null });
    const artifact = await useAppStore.getState().generate("un dashboard");
    expect(artifact).not.toBeNull();
  });

  it("transmet la température des réglages à l'API", async () => {
    const fetchMock = mockOpenAI();
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().setSettings({ temperature: 0.1 });
    await useAppStore.getState().generate("un dashboard");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.temperature).toBe(0.1);
  });

  it("injecte la DESIGN SPEC (design-brief) et le template dans le prompt système", async () => {
    const fetchMock = mockOpenAI();
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().setActiveTemplate("dashboard");
    await useAppStore.getState().generate("dashboard sombre, minimal");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    const system = body.messages[0].content as string;
    expect(system).toContain("DESIGN SPEC");
    expect(system).toContain("Background: #09090B");
    expect(system).toContain("TEMPLATE: Tableau de bord");
    expect(system).toContain("Structure attendue");
  });

  it("désactive la spec si le skill design-brief est inactif", async () => {
    const fetchMock = mockOpenAI();
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().toggleSkill("design-brief");
    await useAppStore.getState().generate("un dashboard");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.messages[0].content as string).not.toContain("DESIGN SPEC");
  });

  it("injecte le skillMd des skills génériques actifs dans le prompt", async () => {
    const fetchMock = mockOpenAI();
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().toggleSkill("ui-ux-pro-max");
    await useAppStore.getState().generate("un dashboard");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.messages[0].content as string).toContain("=== SKILL ACTIF");
    expect(body.messages[0].content as string).toContain("UI/UX Pro Max");
  });

  it("injecte le DESIGN.md du design system sélectionné (nouveau format)", async () => {
    const fetchMock = mockOpenAI();
    useAppStore.getState().createProject("P", "linear");
    await useAppStore.getState().generate("un dashboard");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    const system = body.messages[0].content as string;
    expect(system).toContain("Design System — Linear");
    expect(system).toContain("#5e6ad2");
  });

  it("critiqueArtifact produit un rapport parsé et le stocke", async () => {
    const critiqueAnswer = `SCORES:
- Philosophie: 7/10
- Hiérarchie visuelle: 8/10
- Détails & finitions: 6/10
- Fonctionnalité: 9/10
- Innovation: 5/10

CONSERVER:
- Palette cohérente

CORRIGER:
- Contraste insuffisant

GAINS RAPIDES:
- Ajouter des états de survol`;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: critiqueAnswer } }],
            usage: { prompt_tokens: 10, completion_tokens: 5 },
          }),
          { status: 200 },
        ),
      ),
    );
    useAppStore.getState().createProject("P", "minimal");
    const art = useAppStore.getState().artifacts[0];
    const report = await useAppStore.getState().critiqueArtifact(art.id);
    expect(report).not.toBeNull();
    expect(report!.scores.hierarchy).toBe(8);
    expect(useAppStore.getState().critiques[art.id].fix).toContain(
      "Contraste insuffisant",
    );
  });

  it("autoImprove régénère l'artefact avec les corrections", async () => {
    const improved = "```html\n<!doctype html><html><head><title>Amélioré</title></head><body><h1>V2</h1></body></html>\n```";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: improved } }],
            usage: { prompt_tokens: 10, completion_tokens: 5 },
          }),
          { status: 200 },
        ),
      ),
    );
    useAppStore.getState().createProject("P", "minimal");
    const art = useAppStore.getState().artifacts[0];
    useAppStore.getState().critiques[art.id] = {
      scores: { philosophy: 5, hierarchy: 5, details: 5, functionality: 5, innovation: 5 },
      keep: [],
      fix: ["Améliorer le contraste"],
      quickWins: [],
      raw: "",
    };
    const result = await useAppStore.getState().autoImprove(art.id);
    expect(result).not.toBeNull();
    const updated = useAppStore.getState().artifacts.find((a) => a.id === art.id)!;
    expect(updated.files[0].content).toContain("<title>Amélioré</title>");
  });

  it("setTweaks enregistre les réglages par artefact", () => {
    useAppStore.getState().createProject("P", "minimal");
    const art = useAppStore.getState().artifacts[0];
    useAppStore.getState().setTweaks(art.id, {
      accent: "#ff0000",
      surface: "#fafafa",
      textColor: "#111111",
      pageBg: "#ffffff",
      fontFamily: "Georgia, serif",
      typeScale: 1.1,
      density: 0.8,
      radius: 12,
      theme: "dark",
      hoverMotion: "elevated",
      chartTooltips: true,
    });
    expect(useAppStore.getState().tweaks[art.id].accent).toBe("#ff0000");
    expect(useAppStore.getState().tweaks[art.id].theme).toBe("dark");
    expect(useAppStore.getState().tweaks[art.id].radius).toBe(12);
    expect(useAppStore.getState().tweaks[art.id].hoverMotion).toBe("elevated");
    expect(useAppStore.getState().tweaks[art.id].chartTooltips).toBe(true);
  });

  it("applyTweaksToProject applique les réglages à tous les artefacts du projet", () => {
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().createProject("Q", "minimal");
    const p1 = useAppStore.getState().projects[0];
    const artP1 = useAppStore.getState().artifacts[0];
    const artP2 = useAppStore.getState().artifacts[1];
    const tweaks: ArtifactTweaks = {
      accent: "#123456",
      surface: "#ffffff",
      textColor: "#111111",
      pageBg: "#f8fafc",
      fontFamily: "system",
      typeScale: 1,
      density: 1,
      radius: 8,
      theme: "light",
      hoverMotion: "subtle",
      chartTooltips: false,
    };
    useAppStore.getState().applyTweaksToProject(p1.id, tweaks);
    expect(useAppStore.getState().tweaks[artP1.id].accent).toBe("#123456");
    expect(useAppStore.getState().tweaks[artP2.id]).toBeUndefined();
  });

  it("retryLastGenerate relance le dernier prompt après une erreur", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn()
        .mockResolvedValueOnce(new Response("boom", { status: 500 }))
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              choices: [{ message: { content: HTML_ANSWER } }],
              usage: { prompt_tokens: 10, completion_tokens: 5 },
            }),
            { status: 200 },
          ),
        ),
    );
    useAppStore.getState().createProject("P", "minimal");
    const first = await useAppStore.getState().generate("un dashboard");
    expect(first).toBeNull();
    expect(useAppStore.getState().error).toMatch(/500/);
    const retried = await useAppStore.getState().retryLastGenerate();
    expect(retried).not.toBeNull();
    expect(retried!.title).toBe("Dashboard Ventes");
    expect(useAppStore.getState().chat).toHaveLength(2);
  });
});

describe("appStore — design system par projet & clé API", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    useAppStore.setState({
      projects: [],
      artifacts: [],
      versions: [],
      chat: [],
      generations: [],
      activeProjectId: null,
      activeArtifactId: null,
      generating: false,
      error: null,
      streamingText: "",
      lastPrompt: null,
      customModels: {},
      lastTest: {},
      apiKeyStored: false,
      settings: {
        provider: "openai",
        model: "gpt-4o-mini",
        apiKey: "sk-test",
        baseUrl: "",
        temperature: 0.7,
        budgetUsd: null,
      },
    });
  });

  it("setProjectDesignSystem change le design system d'un projet et le persiste", () => {
    const p1 = useAppStore.getState().createProject("A", "fintech");
    const p2 = useAppStore.getState().createProject("B", "minimal");
    useAppStore.getState().setProjectDesignSystem(p1.id, "linear");
    const s = useAppStore.getState();
    expect(
      s.projects.find((p) => p.id === p1.id)!.designSystemId,
    ).toBe("linear");
    expect(
      s.projects.find((p) => p.id === p2.id)!.designSystemId,
    ).toBe("minimal");
    const raw = localStorage.getItem("open-cooldesigner") ?? "";
    expect(raw).toContain('"designSystemId":"linear"');
    expect(raw).toContain('"designSystemId":"minimal"');
  });

  it("setProjectDesignSystem n'affecte pas les autres projets", () => {
    const p1 = useAppStore.getState().createProject("A", "fintech");
    const p2 = useAppStore.getState().createProject("B", "minimal");
    useAppStore.getState().setProjectDesignSystem(p1.id, "vercel");
    const s = useAppStore.getState();
    expect(
      s.projects.find((p) => p.id === p2.id)!.designSystemId,
    ).toBe("minimal");
  });

  it("le DESIGN.md du design system mis à jour est injecté à la génération", async () => {
    const fetchMock = mockOpenAI();
    const project = useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().setProjectDesignSystem(project.id, "linear");
    await useAppStore.getState().generate("un dashboard");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.messages[0].content as string).toContain(
      "Design System — Linear",
    );
  });

  it("persistApiKey hors Tauri confirme la persistance permanente", async () => {
    useAppStore.getState().setSettings({ apiKey: "sk-memoire" });
    const result = await useAppStore.getState().persistApiKey();
    expect(result.ok).toBe(true);
    expect(result.message).toMatch(/localStorage/i);
    expect(useAppStore.getState().apiKeyStored).toBe(true);
    const raw = localStorage.getItem("open-cooldesigner") ?? "";
    expect(raw).toContain("sk-memoire");
  });

  it("persistApiKey hors Tauri avec clé vide refuse proprement", async () => {
    useAppStore.getState().setSettings({ apiKey: "" });
    const result = await useAppStore.getState().persistApiKey();
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Clé vide/i);
  });

  it("hors Tauri, saisir une clé la marque comme enregistrée (permanente)", () => {
    useAppStore.getState().setSettings({ apiKey: "sk-123" });
    expect(useAppStore.getState().apiKeyStored).toBe(true);
  });

  it("vider la clé la marque comme non enregistrée", () => {
    useAppStore.getState().setSettings({ apiKey: "sk-123" });
    useAppStore.getState().setSettings({ apiKey: "" });
    expect(useAppStore.getState().apiKeyStored).toBe(false);
  });

  it("restaure la clé API et son statut depuis le localStorage (merge)", async () => {
    const state = {
      state: {
        projects: [],
        artifacts: [],
        versions: [],
        chat: [],
        generations: [],
        settings: {
          provider: "openai",
          model: "gpt-4o-mini",
          baseUrl: "",
          temperature: 0.7,
          budgetUsd: null,
          apiKey: "sk-reload",
        },
        activeProjectId: null,
        activeArtifactId: null,
      },
      version: 0,
    };
    localStorage.setItem("open-cooldesigner", JSON.stringify(state));
    vi.resetModules();
    const { useAppStore: freshStore } = await import("./appStore");
    const s = freshStore.getState();
    expect(s.settings.apiKey).toBe("sk-reload");
    expect(s.apiKeyStored).toBe(true);
  });
});

describe("appStore — sélection de template (frontend)", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    useAppStore.setState({
      projects: [],
      artifacts: [],
      versions: [],
      chat: [],
      generations: [],
      activeProjectId: null,
      activeArtifactId: null,
      generating: false,
      error: null,
      streamingText: "",
      lastPrompt: null,
      customModels: {},
      lastTest: {},
      apiKeyStored: false,
      settings: {
        provider: "openai",
        model: "gpt-4o-mini",
        apiKey: "sk-test",
        baseUrl: "",
        temperature: 0.7,
        budgetUsd: null,
      },
    });
  });

  it("setActiveTemplate change et persiste le template actif", () => {
    useAppStore.getState().setActiveTemplate("saas-landing");
    expect(useAppStore.getState().activeTemplateId).toBe("saas-landing");
    const raw = localStorage.getItem("open-cooldesigner") ?? "";
    expect(raw).toContain('"activeTemplateId":"saas-landing"');
  });

  it("setActiveTemplate(null) désactive le template (libre)", () => {
    useAppStore.getState().setActiveTemplate("kanban");
    useAppStore.getState().setActiveTemplate(null);
    expect(useAppStore.getState().activeTemplateId).toBeNull();
    const raw = localStorage.getItem("open-cooldesigner") ?? "";
    expect(raw).toContain('"activeTemplateId":null');
  });

  it("le template sélectionné est injecté dans le prompt de génération", async () => {
    const fetchMock = mockOpenAI();
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().setActiveTemplate("kanban");
    await useAppStore.getState().generate("un kanban");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.messages[0].content as string).toContain(
      "=== TEMPLATE: Tableau Kanban ===",
    );
  });

  it("sans template actif, aucun bloc TEMPLATE dans le prompt", async () => {
    const fetchMock = mockOpenAI();
    useAppStore.getState().createProject("P", "minimal");
    useAppStore.getState().setActiveTemplate(null);
    await useAppStore.getState().generate("un dashboard");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(body.messages[0].content as string).not.toContain("=== TEMPLATE:");
  });
});
