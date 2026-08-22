import { describe, expect, it } from "vitest";
import type { Artifact } from "@/types";
import type { ArtifactTweaks } from "@/skills/types";
import { buildHtmlExport, buildZipExport, buildZipExportFileName } from "./exportService";

const artifact: Artifact = {
  id: "art-1",
  projectId: "proj-1",
  title: "Dashboard Ventes",
  kind: "web",
  files: [
    { path: "index.html", content: "<!doctype html><head></head><h1>Ventes</h1>" },
    { path: "styles.css", content: "body{}" },
    { path: "script.js", content: "console.log(1)" },
  ],
  createdAt: "2026-08-12T00:00:00.000Z",
  updatedAt: "2026-08-12T00:00:00.000Z",
};

const tweaks: ArtifactTweaks = {
  accent: "#ff0000",
  surface: "#ffffff",
  textColor: "#111111",
  pageBg: "#ffffff",
  fontFamily: "system",
  typeScale: 1,
  density: 1,
  radius: 8,
  theme: "dark",
  hoverMotion: "subtle",
  chartTooltips: false,
};

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

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

  it("export HTML sans tweaks : contenu brut, pas de bloc d'injection", async () => {
    const result = buildHtmlExport(artifact);
    const text = await readBlob(result.blob);
    expect(text).toContain("<h1>Ventes</h1>");
    expect(text).not.toContain("--ocd-accent");
  });

  it("export HTML avec tweaks : contient l'injection (couleurs, thème, hover)", async () => {
    const result = buildHtmlExport(artifact, tweaks);
    const text = await readBlob(result.blob);
    expect(text).toContain("--ocd-accent:#ff0000");
    expect(text).toContain('theme:"dark"');
    expect(text).toContain("translateY(-2px)");
  });

  it("export ZIP avec tweaks : index.html injecté, styles.css/script.js bruts", async () => {
    const result = await buildZipExport(artifact, tweaks);
    const zip = await import("jszip").then((m) => m.default.loadAsync(result.blob));
    const html = await zip.file("dashboard-ventes/index.html")?.async("string");
    const css = await zip.file("dashboard-ventes/styles.css")?.async("string");
    const js = await zip.file("dashboard-ventes/script.js")?.async("string");
    expect(html).toContain("--ocd-accent:#ff0000");
    expect(css).toBe("body{}");
    expect(js).toBe("console.log(1)");
  });
});
