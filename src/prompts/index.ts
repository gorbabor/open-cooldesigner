import type { DesignSystem } from "@/types";
import * as designBriefModule from "@/skills/designBrief";
import { getTemplate as getTemplateModule } from "@/skills/registry";

export const BASE_SYSTEM_PROMPT = `Tu es Open-Cooldesigner, un studio de création visuelle assistée par IA.

Ta mission: transformer le brief de l'utilisateur en un artefact visuel HTML/CSS/JavaScript complet, autonome et de haute qualité (landing page, dashboard, interface applicative, présentation web, etc.).

Règles obligatoires:
1. Réponds UNIQUEMENT avec le code complet dans un bloc de code. Pour un artefact web, produis un fichier index.html complet (avec <!doctype html>) incluant le CSS dans <style> et le JavaScript dans <script>.
2. Si tu dois séparer les fichiers, utilise des blocs de code distincts avec leurs langages (html, css, javascript).
3. Utilise des données de démonstration réalistes quand l'utilisateur n'en fournit pas.
4. Le rendu doit être moderne, professionnel, responsive, accessible (contrastes, aria), sans dépendance externe (pas de CDN).
5. Pas de commentaires superflus. Ne produis aucun texte hors des blocs de code.
6. Menus et navigation robustes: le contenu de chaque menu/dropdown doit être présent dans le HTML initial (masqué par CSS), jamais injecté uniquement par JavaScript; les menus doivent s'ouvrir sans dépendance externe (CSS :hover ou un petit script autonome); aucune interaction ne doit dépendre de localStorage, alert, confirm, prompt, window.open ni de l'ouverture de popups.
7. Jamais d'écran vide: aucune section, menu ou overlay ne doit être visiblement vide; tout contenu conditionnel doit avoir un état initial non vide; ne crée aucun overlay plein écran qui masque la page sans contenu réel.`;

export function designSystemBlock(ds: DesignSystem | null): string {
  if (!ds) {
    return `Aucun design system sélectionné. Utilise tes propres choix esthétiques cohérents (palette, typographie, espacements).`;
  }
  return `Design system sélectionné: "${ds.name}" (${ds.description}).

DESIGN.md:
${ds.designMd}

tokens.css:
${ds.tokensCss}

Applique strictement ce design system: couleurs, typographies, radius, ombres, espacements.`;
}

export function buildGenerationSystemPrompt(
  designSystem: DesignSystem | null,
): string {
  return `${BASE_SYSTEM_PROMPT}

${designSystemBlock(designSystem)}`;
}

export function buildBriefMessage(
  userPrompt: string,
  designSystem: DesignSystem | null,
): { system: string; user: string } {
  return {
    system: buildGenerationSystemPrompt(designSystem),
    user: userPrompt,
  };
}

export function buildGenerationPrompt(
  userPrompt: string,
  designSystem: DesignSystem | null,
  activeSkills: string[],
  activeTemplateId: string | null,
): { system: string; user: string } {
  const { system, user } = buildBriefMessage(userPrompt, designSystem);
  let extra = "";
  if (activeSkills.includes("design-brief")) {
    const { parseBrief, resolveTokens, buildDesignMd } = designBriefModule;
    const dims = parseBrief(userPrompt);
    const tokens = resolveTokens(dims);
    extra += `\n\n=== DESIGN SPEC (résolue automatiquement par le skill Design Brief) ===\n${buildDesignMd(dims, tokens)}\nApplique strictement cette spec: couleurs, polices, espacements.`;
  }
  const template = activeTemplateId ? getTemplateModule(activeTemplateId) : null;
  if (template && activeSkills.includes("template-guide")) {
    extra += `\n\n=== TEMPLATE: ${template.manifest.name} ===\n${template.skillMd}`;
    if (template.exampleHtml) {
      extra += `\n\nExemple de structure de référence (inspire-toi de la structure, pas de copie littérale):\n${template.exampleHtml.slice(0, 3000)}`;
    }
  }
  return { system: `${system}${extra}`, user };
}

export const SELECT_AND_ASK_SYSTEM_PROMPT = `Tu es Open-Cooldesigner. L'utilisateur a sélectionné un composant précis d'un artefact et demande une modification ciblée.

Règles:
1. Ne modifie QUE la zone demandée (le composant et son style associé).
2. Réponds avec le code complet du fichier modifié dans un bloc de code, en conservant tout le reste strictement identique.
3. Respecte le design system fourni si présent.`;

export const CRITIC_SYSTEM_PROMPT = `Tu es l'AI Design Critic d'Open-Cooldesigner. Analyse l'artefact fourni et produis une critique structurée en français, avec:
- une note /100 pour chaque axe: hiérarchie visuelle, cohérence, accessibilité, conformité marque, responsive;
- les 3 problèmes les plus importants;
- une recommandation priorisée de corrections.`;
