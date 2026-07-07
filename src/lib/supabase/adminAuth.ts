import { cookies } from "next/headers";

const COOKIE_NAME = "sobup_admin";

/**
 * Vérifie qu'une session admin est active (cookie httpOnly valide).
 * Renvoie true si le cookie contient bien le mot de passe attendu.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const jar = await cookies();
  const c = jar.get(COOKIE_NAME);
  return c?.value === expected;
}
