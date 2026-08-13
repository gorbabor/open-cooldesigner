import { describe, expect, it } from "vitest";
import {
  extractCodeBlocks,
  inferKind,
  looksLikeFullHtml,
  parseArtifactResponse,
} from "./parser";

describe("extractCodeBlocks", () => {
  it("extrait un bloc html", () => {
    const blocks = extractCodeBlocks("```html\n<div>ok</div>\n```");
    expect(blocks).toHaveLength(1);
    expect(blocks[0].language).toBe("html");
    expect(blocks[0].code).toBe("<div>ok</div>");
  });

  it("extrait plusieurs blocs distincts", () => {
    const blocks = extractCodeBlocks(
      "```html\n<h1>T</h1>\n```\ntexte\n```css\nbody{}\n```",
    );
    expect(blocks).toHaveLength(2);
    expect(blocks[0].language).toBe("html");
    expect(blocks[1].language).toBe("css");
  });

  it("retourne une liste vide sans bloc", () => {
    expect(extractCodeBlocks("pas de bloc ici")).toEqual([]);
  });
});

describe("looksLikeFullHtml", () => {
  it("détecte un document html complet", () => {
    expect(looksLikeFullHtml("<!doctype html><html><body>x</body></html>")).toBe(
      true,
    );
  });
  it("rejette du texte brut", () => {
    expect(looksLikeFullHtml("juste du texte")).toBe(false);
  });
});

describe("inferKind", () => {
  it("détecte web pour html", () => {
    expect(inferKind([{ language: "html", code: "<div/>" }])).toBe("web");
  });
  it("détecte react pour tsx", () => {
    expect(inferKind([{ language: "tsx", code: "const A = () => null" }])).toBe(
      "react",
    );
  });
});

describe("parseArtifactResponse", () => {
  it("parse une réponse avec fichier html unique", () => {
    const raw = "```html\n<!doctype html><html><head><title>Dashboard</title></head><body></body></html>\n```";
    const result = parseArtifactResponse(raw, "Fallback");
    expect(result.kind).toBe("web");
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe("index.html");
    expect(result.title).toBe("Dashboard");
  });

  it("parse plusieurs fichiers et conserve les chemins", () => {
    const raw = [
      "```html\n<h1>App</h1>\n```",
      "```css\nbody{}\n```",
      "```javascript\nconsole.log(1)\n```",
    ].join("\n");
    const result = parseArtifactResponse(raw, "Fallback");
    const paths = result.files.map((f) => f.path);
    expect(paths).toEqual(["index.html", "styles.css", "script.js"]);
  });

  it("retourne un artefact fallback si rien d'exploitable", () => {
    const result = parseArtifactResponse("réponse incompréhensible", "Chute");
    expect(result.title).toBe("Chute");
    expect(result.files[0].path).toBe("index.html");
    expect(result.files[0].content).toContain("<!doctype html>");
  });

  it("traite du HTML nu sans bloc comme artefact web", () => {
    const raw = "<!doctype html><html><head><title>Nu</title></head><body></body></html>";
    const result = parseArtifactResponse(raw, "F");
    expect(result.kind).toBe("web");
    expect(result.files[0].content).toBe(raw);
  });
});
