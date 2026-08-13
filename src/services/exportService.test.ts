import { describe, expect, it } from "vitest";
import type { Artifact } from "@/types";
import { buildHtmlExport, buildZipExport, buildZipExportFileName } from "./exportService";

const artifact: Artifact = {
  id: "art-1",
  projectId: "proj-1",
  title: "Dashboard Ventes",
  kind: "web",
  files: [
    { path: "index.html", content: "<!doctype html><h1>Ventes</h1>" },
    { path: "styles.css", content: "body{}" },
    { path: "script.js", content: "console.log(1)" },
  ],
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
};

describe("exportService", () => {
  it("construit un export HTML à partir du fichier principal", () => {
    const result = buildHtmlExport(artifact);
    expect(result.fileName).toBe("dashboard-ventes.html");
    expect(result.mimeType).toBe("text/html");
    expect(result.sizeBytes).toBeGreaterThan(0);
    expect(result.blob.type).toBe("text/html;charset=utf-8");
  });

  it("construit un export ZIP contenant tous les fichiers", async () => {
    const result = await buildZipExport(artifact);
    expect(result.fileName).toBe("dashboard-ventes.zip");
    expect(result.mimeType).toBe("application/zip");
    expect(result.sizeBytes).toBeGreaterThan(0);
  });

  it("échappe le nom de fichier des caractères non sûrs", () => {
    const weird: Artifact = {
      ...artifact,
      title: "Été / 2026 : Rapport!",
    };
    expect(buildHtmlExport(weird).fileName).toBe("ete-2026-rapport.html");
    expect(buildZipExportFileName(weird.title)).toBe("ete-2026-rapport.zip");
  });
});
