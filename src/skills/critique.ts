import type { Artifact } from "@/types";
import type { CritiqueReport, CritiqueScores } from "./types";

export function buildCritiquePrompt(artifact: Artifact): string {
  const main =
    artifact.files.find((f) => f.path === "index.html") ?? artifact.files[0];
  return `Tu es l'AI Design Critic. Analyse l'artefact HTML suivant et produis une critique en français, avec exactement ce format:

SCORES:
- Philosophie: X/10
- Hiérarchie visuelle: X/10
- Détails & finitions: X/10
- Fonctionnalité: X/10
- Innovation: X/10

CONSERVER:
- <3 points forts à conserver>

CORRIGER:
- <3 problèmes principaux à corriger>

GAINS RAPIDES:
- <3 corrections rapides>

ARTEFACT:
${main.content.slice(0, 12000)}`;
}

export function buildAutoImprovePrompt(
  artifact: Artifact,
  report: CritiqueReport,
): string {
  const main =
    artifact.files.find((f) => f.path === "index.html") ?? artifact.files[0];
  return `Tu es Open-Cooldesigner. Un critique de design a évalué l'artefact suivant. Régénère le fichier complet en intégrant TOUTES les corrections listées. Réponds avec le code complet dans un bloc de code.

CRITIQUE:
Scores: Philosophie ${report.scores.philosophy}/10, Hiérarchie ${report.scores.hierarchy}/10, Détails ${report.scores.details}/10, Fonctionnalité ${report.scores.functionality}/10, Innovation ${report.scores.innovation}/10

CORRIGER:
${report.fix.join("\n")}

GAINS RAPIDES:
${report.quickWins.join("\n")}

ARTEFACT ACTUEL:
${main.content.slice(0, 12000)}`;
}

export function parseCritiqueReport(text: string): CritiqueReport {
  const score = (label: string): number => {
    const re = new RegExp(`${label}[^\\n:]*?[:：]\\s*(\\d{1,2})\\s*/\\s*10`, "i");
    const m = text.match(re);
    const v = m ? parseInt(m[1], 10) : 0;
    return Math.min(10, Math.max(0, v));
  };
  const scores: CritiqueScores = {
    philosophy: score("Philosophie"),
    hierarchy: score("Hiérarchie"),
    details: score("Détails"),
    functionality: score("Fonctionnalité"),
    innovation: score("Innovation"),
  };
  const section = (label: string): string[] => {
    const re = new RegExp(`${label}\\s*[:：]\\s*\\n([\\s\\S]*?)(?=\\n[A-ZÀ-Ü][A-ZÀ-Ü '&-]+\\s*[:：]\\s*\\n|$)`, "i");
    const m = text.match(re);
    if (!m) return [];
    return m[1]
      .split(/\n|[-•*]/)
      .map((s) => s.trim().replace(/^[-•*]\s*/, ""))
      .filter((s) => s.length > 2 && !/^(CONSERVER|CORRIGER|GAINS RAPIDES)/i.test(s));
  };
  return {
    scores,
    keep: section("CONSERVER"),
    fix: section("CORRIGER"),
    quickWins: section("GAINS RAPIDES"),
    raw: text,
  };
}
