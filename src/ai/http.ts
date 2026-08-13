export class AIHttpError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly body?: string,
  ) {
    super(message);
    this.name = "AIHttpError";
  }
}

export interface HttpPostOptions {
  url: string;
  apiKey?: string;
  headers?: Record<string, string>;
  body: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export async function httpPostJson(
  options: HttpPostOptions,
): Promise<{ status: number; body: unknown; raw: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 600_000,
  );
  const onAbort = () => controller.abort();
  options.signal?.addEventListener("abort", onAbort);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (options.apiKey) {
      headers.Authorization = `Bearer ${options.apiKey}`;
    }
    const res = await fetch(options.url, {
      method: "POST",
      headers,
      body: JSON.stringify(options.body),
      signal: controller.signal,
    });
    const raw = await res.text();
    if (!res.ok) {
      throw new AIHttpError(
        `Requête IA échouée (${res.status}): ${raw.slice(0, 500)}`,
        res.status,
        raw,
      );
    }
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }
    return { status: res.status, body, raw };
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", onAbort);
  }
}
