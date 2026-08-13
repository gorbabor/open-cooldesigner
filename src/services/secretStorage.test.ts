import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteApiKey, isTauri, loadApiKey, saveApiKey } from "./secretStorage";

function setTauri(active: boolean) {
  if (active) {
    (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ = {};
  } else {
    delete (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;
  }
}

function mockInvoke(impl: (cmd: string, args: Record<string, unknown>) => unknown) {
  vi.doMock("@tauri-apps/api/core", () => ({
    invoke: vi.fn(impl),
  }));
}

afterEach(() => {
  vi.doUnmock("@tauri-apps/api/core");
  setTauri(false);
});

describe("secretStorage", () => {
  it("détecte l'environnement Tauri", () => {
    expect(isTauri()).toBe(false);
    setTauri(true);
    expect(isTauri()).toBe(true);
  });

  it("hors Tauri: load retourne vide et save ne fait rien", async () => {
    setTauri(false);
    expect(await loadApiKey()).toBe("");
    await expect(saveApiKey("sk-secret")).resolves.toBeUndefined();
  });

  it("en Tauri: load lit la clé via get_secret", async () => {
    setTauri(true);
    mockInvoke((cmd) =>
      cmd === "get_secret" ? "sk-du-coffre" : undefined,
    );
    expect(await loadApiKey()).toBe("sk-du-coffre");
  });

  it("en Tauri: load gère l'absence de clé (erreur) sans lever", async () => {
    setTauri(true);
    mockInvoke(() => {
      throw new Error("Secret introuvable");
    });
    expect(await loadApiKey()).toBe("");
  });

  it("en Tauri: save appelle store_secret avec la clé", async () => {
    setTauri(true);
    const calls: [string, Record<string, unknown>][] = [];
    mockInvoke((cmd, args) => {
      calls.push([cmd, args]);
      return undefined;
    });
    await saveApiKey("sk-123");
    expect(calls[0][0]).toBe("store_secret");
    expect(calls[0][1]).toEqual({
      payload: { key: "api_key", value: "sk-123" },
    });
  });

  it("en Tauri: save ignore les valeurs vides", async () => {
    setTauri(true);
    const fn = vi.fn();
    vi.doMock("@tauri-apps/api/core", () => ({ invoke: fn }));
    await saveApiKey("   ");
    expect(fn).not.toHaveBeenCalled();
  });

  it("en Tauri: delete appelle delete_secret", async () => {
    setTauri(true);
    const calls: [string, Record<string, unknown>][] = [];
    mockInvoke((cmd, args) => {
      calls.push([cmd, args]);
      return undefined;
    });
    await deleteApiKey();
    expect(calls[0][0]).toBe("delete_secret");
    expect(calls[0][1]).toEqual({ key: "api_key" });
  });
});
