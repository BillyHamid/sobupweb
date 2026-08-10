import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { toCsv, csvHeaders, csvDate } from "@/lib/csv";

const STATUT_LABELS: Record<string, string> = {
  soumis: "Soumis",
  en_evaluation: "En évaluation",
  accepte: "Accepté",
  refuse: "Refusé",
};

const TYPE_LABELS: Record<string, string> = {
  oral: "Communication orale",
  poster: "Poster",
};

const HEADERS = [
  { key: "n", label: "N°" },
  { key: "reference", label: "Référence" },
  { key: "status", label: "Statut" },
  { key: "type", label: "Type" },
  { key: "titre", label: "Titre" },
  { key: "auteur", label: "Auteur principal" },
  { key: "co_auteurs", label: "Co-auteurs" },
  { key: "etablissement", label: "Service / Établissement" },
  { key: "email", label: "Email" },
  { key: "telephone", label: "Téléphone" },
  { key: "mots_cles", label: "Mots clés" },
  { key: "nb_mots", label: "Nb mots" },
  { key: "texte", label: "Résumé" },
  { key: "fichier", label: "Fichier joint" },
  { key: "review_note", label: "Commentaire comité" },
  { key: "reviewed_at", label: "Date de décision" },
  { key: "event_title", label: "Événement" },
  { key: "date", label: "Date de soumission" },
];

function countWords(s: string | null) {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const supabase = createAdminClient();
  let q = supabase.from("abstracts").select("*").order("created_at", { ascending: true });
  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []).map((a, i) => ({
    n: i + 1,
    reference: a.reference,
    status: STATUT_LABELS[a.status] ?? a.status,
    type: TYPE_LABELS[a.type] ?? a.type,
    titre: a.titre,
    auteur: a.auteur_principal,
    co_auteurs: a.co_auteurs,
    etablissement: a.etablissement,
    email: a.email,
    telephone: a.telephone,
    mots_cles: a.mots_cles,
    nb_mots: countWords(a.texte),
    texte: a.texte,
    fichier: a.file_url,
    review_note: a.review_note,
    reviewed_at: csvDate(a.reviewed_at),
    event_title: a.event_title,
    date: csvDate(a.created_at),
  }));

  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = status ? `-${status}` : "";
  return new NextResponse(toCsv(HEADERS, rows), {
    headers: csvHeaders(`abstracts${suffix}-${stamp}.csv`),
  });
}
