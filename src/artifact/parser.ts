export interface ArtifactParseResult {
  title: string;
  kind: string;
  files: { path: string; content: string }[];
}

const DEFAULT_FILES: { path: string; content: string }[] = [
  {
    path: "index.html",
    content: `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Artefact Open-Cooldesigner</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 0; padding: 2rem; }
</style>
</head>
<body>
  <h1>Artefact généré</h1>
  <p>Aucun contenu n'a été généré par l'IA.</p>
</body>
</html>`,
  },
];

export function parseArtifactResponse(
  raw: string,
  fallbackTitle = "Sans titre",
): ArtifactParseResult {
  const blocks = extractCodeBlocks(raw);

  if (blocks.length > 0) {
    return {
      title: inferTitle(raw) ?? fallbackTitle,
      kind: inferKind(blocks),
      files: blocks.map((b, i) => ({
        path:
          b.language && b.language !== "html"
            ? b.language === "javascript" || b.language === "js"
              ? "script.js"
              : b.language === "css"
                ? "styles.css"
                : `file-${i}.${b.language}`
            : "index.html",
        content: b.code,
      })),
    };
  }

  if (looksLikeFullHtml(raw)) {
    return {
      title: inferTitle(raw) ?? fallbackTitle,
      kind: "web",
      files: [{ path: "index.html", content: raw }],
    };
  }

  return {
    title: fallbackTitle,
    kind: "text",
    files: DEFAULT_FILES,
  };
}

interface CodeBlock {
  language: string | null;
  code: string;
}

export function extractCodeBlocks(raw: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const regex = /```([a-zA-Z0-9+#-]*)\s*\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(raw)) !== null) {
    const language = match[1]?.trim() || null;
    const code = match[2].replace(/\n$/, "");
    blocks.push({ language, code });
  }
  return blocks;
}

export function looksLikeFullHtml(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("<") || !trimmed.includes("</")) return false;
  return /<!doctype html|<html[\s>]/i.test(trimmed);
}

export function inferTitle(raw: string): string | null {
  const html = /<title[^>]*>([^<]+)<\/title>/i.exec(raw);
  if (html?.[1]?.trim()) return html[1].trim();
  const heading = /<h1[^>]*>([^<]+)<\/h1>/i.exec(raw);
  if (heading?.[1]?.trim()) return heading[1].trim().slice(0, 80);
  const firstLine = raw
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.length > 0 && !l.startsWith("#") && !l.startsWith("```"));
  if (firstLine && firstLine.length > 3 && firstLine.length < 80) {
    return firstLine;
  }
  return null;
}

export function inferKind(blocks: CodeBlock[]): string {
  const languages = new Set(blocks.map((b) => b.language ?? "html"));
  if (languages.has("html") || languages.has("htm")) return "web";
  if (languages.has("tsx") || languages.has("jsx")) return "react";
  if (languages.has("json")) return "data";
  if (languages.has("css")) return "style";
  return "web";
}
