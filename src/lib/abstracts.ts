/**
 * Fenêtre de soumission des abstracts — source unique de vérité.
 *
 * Les dates étaient auparavant écrites en dur dans le texte de la page, sans
 * aucun effet réel : le formulaire restait ouvert après l'échéance affichée.
 * Tout part désormais d'ici, y compris le refus côté serveur.
 *
 * Le Burkina Faso est à UTC+0 toute l'année : minuit local = minuit UTC,
 * il n'y a donc pas de décalage à corriger.
 */

/** Dernier instant accepté : le 5 octobre 2026 à 23 h 59 min 59 s. */
export const SUBMISSION_CLOSES_AT = new Date("2026-10-05T23:59:59Z");

/** Libellés affichés au public. */
export const SUBMISSION_WINDOW_LABEL = "du 31 juillet au 5 octobre 2026";
export const SUBMISSION_DEADLINE_LABEL = "5 octobre 2026 à minuit";

/**
 * Refus effectif des soumissions tardives.
 * Laisser `false` garde le formulaire ouvert au-delà de la date affichée :
 * les envois restent horodatés, le comité tranche lui-même.
 */
export const ENFORCE_DEADLINE = false;

export function submissionsClosed(now: Date = new Date()): boolean {
  return ENFORCE_DEADLINE && now > SUBMISSION_CLOSES_AT;
}
