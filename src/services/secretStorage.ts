const SECRET_KEY = "api_key";

export function isTauri(): boolean {
  return (
    typeof window !== "undefined" &&
    (window as unknown as { __TAURI_INTERNALS__?: unknown })
      .__TAURI_INTERNALS__ !== undefined
  );
}

async function invoke(command: string, args: Record<string, unknown>): Promise<unknown> {
  const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
  return tauriInvoke(command, args);
}

export async function loadApiKey(): Promise<string> {
  if (!isTauri()) return "";
  try {
    const value = (await invoke("get_secret", { key: SECRET_KEY })) as string;
    return value ?? "";
  } catch {
    return "";
  }
}

export async function saveApiKey(value: string): Promise<void> {
  if (!isTauri() || !value.trim()) return;
  try {
    await invoke("store_secret", {
      payload: { key: SECRET_KEY, value },
    });
  } catch {
    // stockage indisponible: la clé reste en mémoire pour la session
  }
}

export async function deleteApiKey(): Promise<void> {
  if (!isTauri()) return;
  try {
    await invoke("delete_secret", { key: SECRET_KEY });
  } catch {
    // rien à supprimer
  }
}
