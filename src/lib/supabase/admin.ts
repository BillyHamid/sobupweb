import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase pour les routes serveur ADMIN.
 *
 * ⚠️ Utilise la SERVICE_ROLE key qui bypass toutes les RLS policies.
 * À n'importer QUE depuis des Route Handlers (`app/api/.../route.ts`),
 * jamais depuis un composant client ou une page.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin client : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local"
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
