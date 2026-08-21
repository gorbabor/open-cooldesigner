export interface SkillManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  triggers?: string[];
  stage: "before" | "during" | "after" | "on-demand" | "live";
  license: string;
}

export interface TemplateManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  triggers: string[];
  kind: string;
  license: string;
}

export interface Skill {
  manifest: SkillManifest;
  skillMd: string;
}

export interface Template {
  manifest: TemplateManifest;
  skillMd: string;
  exampleHtml?: string;
}

export interface BriefDimensions {
  palette: string;
  accent: string;
  typography: string;
  display: string;
  layout: string;
  mood: string;
  density: string;
  exclude: string[];
}

export interface ResolvedTokens {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  displayFont: string;
  bodyFont: string;
  sectionSpacing: string;
  contentPadding: string;
}

export interface CritiqueScores {
  philosophy: number;
  hierarchy: number;
  details: number;
  functionality: number;
  innovation: number;
}

export interface CritiqueReport {
  scores: CritiqueScores;
  keep: string[];
  fix: string[];
  quickWins: string[];
  raw: string;
}

export interface ArtifactTweaks {
  accent: string;
  surface: string;
  textColor: string;
  pageBg: string;
  fontFamily: string;
  typeScale: number;
  density: number;
  radius: number;
  theme: "light" | "dark" | "system";
  hoverMotion: "none" | "subtle" | "elevated" | "playful";
  chartTooltips: boolean;
}
