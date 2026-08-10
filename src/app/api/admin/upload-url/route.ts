import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

/**
 * Délivre une autorisation d'envoi signée vers Supabase Storage.
 *
 * Pourquoi cette route existe : Vercel plafonne le corps des requêtes des
 * fonctions serverless à ~4,5 Mo. Un fichier plus lourd est rejeté par la
 * plateforme avec un 413 AVANT d'atteindre notre code — les limites de bucket
 * (30 Mo pour les newsletters, 50 Mo pour la médiathèque) étaient donc
 * inatteignables en production.
 *
 * Ici, seul un jeton transite par Vercel (quelques centaines d'octets) ; le
 * navigateur envoie ensuite le fichier directement à Supabase. La limite
 * réelle redevient celle du bucket. L'authentification admin reste vérifiée
 * côté serveur : sans elle, aucun jeton n'est délivré.
 */

/** Buckets autorisés → préfixe de dossier et types MIME acceptés. */
const BUCKETS: Record<string, { mimes: string[]; maxBytes: number }> = {
  newsletters: {
    mimes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxBytes: 30 * 1024 * 1024,
  },
  media: {
    mimes: [
      "image/jpeg", "image/jpg", "image/png", "image/webp",
      "video/mp4", "video/quicktime", "application/pdf",
    ],
    maxBytes: 50 * 1024 * 1024,
  },
  "event-files": {
    mimes: [
      "application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg", "image/png",
    ],
    maxBytes: 20 * 1024 * 1024,
  },
  "event-images": {
    mimes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxBytes: 5 * 1024 * 1024,
  },
  "blog-images": {
    mimes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    maxBytes: 5 * 1024 * 1024,
  },
};

function slugify(name: string) {
  const parts = name.split(".");
  const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : "bin";
  const base =
    parts.join(".")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "fichier";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}.${ext}`;
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "JSON attendu." }, { status: 400 });

  const bucket = String(body.bucket ?? "");
  const folder = String(body.folder ?? "").replace(/[^a-zA-Z0-9/_-]/g, "");
  const fileName = String(body.fileName ?? "");
  const contentType = String(body.contentType ?? "");
  const size = Number(body.size ?? 0);

  const config = BUCKETS[bucket];
  if (!config) {
    return NextResponse.json({ error: "Destination de stockage inconnue." }, { status: 400 });
  }
  if (!fileName) {
    return NextResponse.json({ error: "Nom de fichier manquant." }, { status: 400 });
  }
  if (!config.mimes.includes(contentType)) {
    return NextResponse.json(
      { error: `Type de fichier non accepté ici (${contentType || "type inconnu"}).` },
      { status: 422 }
    );
  }
  if (!size || size > config.maxBytes) {
    return NextResponse.json(
      { error: `Fichier trop lourd (max ${Math.round(config.maxBytes / 1024 / 1024)} Mo).` },
      { status: 422 }
    );
  }

  const path = folder ? `${folder}/${slugify(fileName)}` : slugify(fileName);

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[upload-url]", error);
    return NextResponse.json(
      { error: `Autorisation d'envoi refusée : ${error?.message ?? "erreur inconnue"}` },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    bucket,
    path: data.path,
    token: data.token,
    publicUrl: pub.publicUrl,
  });
}
