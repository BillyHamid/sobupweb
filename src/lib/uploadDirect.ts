"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Envoie un fichier au Storage Supabase SANS passer par une fonction Vercel.
 *
 * Vercel plafonne le corps des requêtes serverless à ~4,5 Mo : au-delà, la
 * plateforme répond 413 avant même d'exécuter la route. On demande donc au
 * serveur une simple autorisation signée (quelques centaines d'octets), puis
 * le navigateur envoie le fichier directement à Supabase. La limite effective
 * redevient celle du bucket.
 */

export type UploadResult = { url: string; path: string; size: number; humanSize: string };

export function humanSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".0", "")} Mo`;
}

export async function uploadDirect(
  file: File,
  opts: { bucket: string; folder?: string }
): Promise<UploadResult> {
  // 1) Autorisation signée — la route vérifie l'authentification admin,
  //    le type MIME et la taille avant de délivrer quoi que ce soit.
  const authRes = await fetch("/api/admin/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      bucket: opts.bucket,
      folder: opts.folder ?? "",
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    }),
  });
  const auth = await authRes.json().catch(() => ({}));
  if (!authRes.ok) {
    throw new Error(auth.error ?? "Autorisation d'envoi refusée.");
  }

  // 2) Envoi direct navigateur → Supabase.
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from(auth.bucket)
    .uploadToSignedUrl(auth.path, auth.token, file, { contentType: file.type });

  if (error) {
    // Message explicite plutôt qu'un « upload impossible » opaque.
    throw new Error(`Envoi refusé par le stockage : ${error.message}`);
  }

  return {
    url: auth.publicUrl,
    path: auth.path,
    size: file.size,
    humanSize: humanSize(file.size),
  };
}
