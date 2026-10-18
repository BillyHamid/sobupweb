export const RESPIRE_MODULES = [
  { id: 1, title: "Protocole de recherche", weeks: 4, hours: 36, online: "3 semaines en ligne + 2 jours en présentiel", description: "Transformez une question de terrain en protocole de recherche complet : méthodologie, éthique, budget et chronogramme.", outcome: "Un protocole complet soumissible à un comité d’éthique.", topics: ["Question de recherche et bibliographie", "Design d’étude, échantillonnage et collecte", "Analyse statistique et éthique", "Atelier de rédaction du protocole"] },
  { id: 2, title: "Publication scientifique", weeks: 4, hours: 36, online: "3 semaines en ligne + 2 jours en présentiel", description: "Structurez votre article, choisissez une revue adaptée et préparez votre soumission, avec un usage critique et éthique de l’IA.", outcome: "Un article IMRAD prêt à soumettre ou une revue narrative.", topics: ["Rédaction scientifique selon la structure IMRAD", "Choix de la revue et préparation de la soumission", "Relecture par les pairs", "Atelier de finalisation de l’article"] },
  { id: 3, title: "Projet et Grant", weeks: 3, hours: 29, online: "2 semaines en ligne + 2 jours en présentiel", description: "Préparez une demande de financement ou un document de planification en santé, selon votre projet et votre profil.", outcome: "Un grant, un plan stratégique ou un plan d’action.", topics: ["Bailleurs et opportunités de financement", "Piste A : demande de financement", "Piste B : planification stratégique", "Finalisation du livrable et présentation devant jury"] },
] as const;

export const RESPIRE_DATES = {
  online: "14 décembre 2026 au 10 janvier 2027",
  inPerson: "18 au 23 janvier 2027",
} as const;

export const RESPIRE_PEDAGOGICAL_DIRECTOR = {
  name: "Professeur OUÉDRAOGO Smaïla",
  role: "Chef de département santé publique à l’UFR/SDS de l’Université Joseph KI-ZERBO",
} as const;

export const ECHOT_DATES = {
  onlineStart: "26 octobre 2026",
  practiceStart: "5 novembre 2026",
} as const;

export const ECHOT_PROFESSIONS = ["Pneumologue", "Interne en pneumologie", "Résident en pneumologie"] as const;

export const THORACOSCOPY_DATES = {
  preparation: "29 novembre 2026, de 18 h à 20 h",
  initiation: "7 au 11 décembre 2026",
  consolidation: "à partir du 11 janvier 2027",
  registration: "26 octobre 2026",
} as const;

export const THORACOSCOPY_REGISTRATION_OPENS_AT = Date.UTC(2026, 9, 26);

export const THORACOSCOPY_PROFESSIONS = [
  "Pneumologue",
  "Chirurgien thoracique",
  "Chirurgien généraliste",
  "Résident en pneumologie",
  "Résident en CTCV",
  "Résident en chirurgie générale",
] as const;

/**
 * Mêmes intitulés que les formulaires d'adhésion et de la Journée Régionale,
 * plus « Autre » : RESPIRE-BF est une formation à la recherche, ouverte à des
 * profils (pharmaciens, biologistes, sages-femmes…) que les quatre premiers
 * choix ne couvrent pas.
 */
export const PROFESSIONS = [
  "Médecin généraliste",
  "Médecin spécialiste",
  "Infirmier(ère)",
  "Étudiant(e)",
  "Autre",
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
