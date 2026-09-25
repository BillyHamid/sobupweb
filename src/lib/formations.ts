export const RESPIRE_MODULES = [
  { id: 1, title: "Protocole de recherche", weeks: 4, hours: 36, online: "3 semaines en ligne + 2 jours en présentiel", description: "Transformez une question de terrain en protocole de recherche complet : méthodologie, éthique, budget et chronogramme.", outcome: "Un protocole complet soumissible à un comité d’éthique.", topics: ["Question de recherche et bibliographie", "Design d’étude, échantillonnage et collecte", "Analyse statistique et éthique", "Atelier de rédaction du protocole"] },
  { id: 2, title: "Publication scientifique", weeks: 4, hours: 36, online: "3 semaines en ligne + 2 jours en présentiel", description: "Structurez votre article, choisissez une revue adaptée et préparez votre soumission, avec un usage critique et éthique de l’IA.", outcome: "Un article IMRAD prêt à soumettre ou une revue narrative.", topics: ["Rédaction scientifique selon la structure IMRAD", "Choix de la revue et préparation de la soumission", "Relecture par les pairs", "Atelier de finalisation de l’article"] },
  { id: 3, title: "Projet et Grant", weeks: 3, hours: 27, online: "2 semaines en ligne + 2 jours en présentiel", description: "Préparez une demande de financement ou un document de planification en santé, selon votre projet et votre profil.", outcome: "Un grant, un plan stratégique ou un plan d’action.", topics: ["Bailleurs et opportunités de financement", "Piste A : demande de financement", "Piste B : planification stratégique", "Finalisation du livrable et présentation devant jury"] },
] as const;

export const APPLICATION_BUCKET = "formation-applications";
export const MAX_APPLICATION_FILE_SIZE = 2 * 1024 * 1024;
export const APPLICATION_FILE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function validModuleSelection(values: unknown): values is number[] {
  return Array.isArray(values) && values.length >= 1 && values.length <= 3
    && values.every((v) => Number.isInteger(v) && [1, 2, 3].includes(v))
    && new Set(values).size === values.length;
}
