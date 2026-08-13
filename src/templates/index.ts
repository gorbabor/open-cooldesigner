import type { Template } from "@/types";

export const QUICK_START_TEMPLATES: Template[] = [
  {
    id: "landing-page",
    name: "Landing page",
    description: "Page vitrine produit ou entreprise",
    skillTemplateId: "saas-landing",
    defaultSystemPrompt:
      "Crée une landing page moderne et convaincante avec hero, bénéfices, preuve sociale, prix et appel à l'action.",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Tableau de bord avec KPI et graphiques",
    skillTemplateId: "dashboard",
    defaultSystemPrompt:
      "Crée un dashboard professionnel avec cartes KPI, graphiques (barres, lignes) et tableau de données de démonstration.",
  },
  {
    id: "web-app",
    name: "Interface applicative",
    description: "Écran d'application SaaS",
    skillTemplateId: "web-prototype",
    defaultSystemPrompt:
      "Crée une interface applicative moderne avec sidebar, en-tête, contenu principal et composants d'interaction.",
  },
  {
    id: "presentation",
    name: "Présentation web",
    description: "Slides HTML présentables",
    skillTemplateId: "presentation",
    defaultSystemPrompt:
      "Crée une présentation web de 5 slides navigable (flèches ou boutons), au design soigné.",
  },
  {
    id: "form",
    name: "Formulaire",
    description: "Formulaire structuré",
    defaultSystemPrompt:
      "Crée un formulaire complet et accessible (validation, états, design system).",
  },
  {
    id: "ecommerce",
    name: "Page e-commerce",
    description: "Boutique / fiche produit",
    skillTemplateId: "ecommerce",
    defaultSystemPrompt:
      "Crée une page e-commerce avec grille de produits, filtres et panier.",
  },
];

export function getTemplate(id: string | null): Template | null {
  if (!id) return null;
  return QUICK_START_TEMPLATES.find((t) => t.id === id) ?? null;
}
