import type { ProviderId } from "@/types";

export function modelDisplayName(
  provider: ProviderId,
  model: string,
  aliases: Record<string, string>,
): string {
  return aliases[`${provider}:${model}`] ?? model;
}
