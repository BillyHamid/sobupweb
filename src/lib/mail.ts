/**
 * Retourne la liste des adresses en copie cachée à ajouter à tous les mails.
 * Configurable via l'env `SOBUP_BCC_EMAILS` (virgules).
 * Retourne `undefined` si vide — évite les headers BCC inutiles.
 */
export function getBccList(): string[] | undefined {
  const raw = process.env.SOBUP_BCC_EMAILS;
  if (!raw) return undefined;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length > 0 ? list : undefined;
}
