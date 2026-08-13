import { parseDesignSystem, type ParsedDesignSystem } from "./parser";

const modules = import.meta.glob("../../design-systems/*/DESIGN.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function slugFromPath(path: string): string {
  const m = /\/([^/]+)\/DESIGN\.md$/.exec(path);
  return m ? m[1] : path;
}

export const DESIGN_SYSTEMS: ParsedDesignSystem[] = Object.entries(modules)
  .map(([path, raw]) => parseDesignSystem(slugFromPath(path), raw))
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

export function getDesignSystem(id: string | null): ParsedDesignSystem | null {
  if (!id) return null;
  return DESIGN_SYSTEMS.find((ds) => ds.id === id) ?? null;
}

export function listDesignSystemCategories(): string[] {
  return [...new Set(DESIGN_SYSTEMS.map((ds) => ds.category))].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
}

export function searchDesignSystems(query: string): ParsedDesignSystem[] {
  const q = query.trim().toLowerCase();
  if (!q) return DESIGN_SYSTEMS;
  return DESIGN_SYSTEMS.filter(
    (ds) =>
      ds.name.toLowerCase().includes(q) ||
      ds.category.toLowerCase().includes(q) ||
      ds.description.toLowerCase().includes(q),
  );
}
