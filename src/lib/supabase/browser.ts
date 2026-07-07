"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pour les composants client (navigateur).
 * Utilise la clé ANON publique — sécurisé pour le client.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
