import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { toCsv, csvHeaders } from "@/lib/csv";

const HEADERS = [
  { key: "reference", label: "Référence" },
  { key: "auteur", label: "Nom auteur principal" },
  { key: "co_auteurs", label: "Co-auteurs" },
  { key: "service", label: "Service" },
  { key: "email", label: "Email" },
  { key: "telephone", label: "Tél." },
  { key: "resume", label: "Résumé" },
  { key: "mots_cles", label: "Mots-clés" },
  { key: "fichier", label: "Fichier joint (Oui/Non)" },
];

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const supabase = createAdminClient();
  const abstracts = [];
  const batchSize = 1000;
  for (let offset = 0; ; offset += batchSize) {
    let q = supabase.from("abstracts")
      .select("id, reference, auteur_principal, co_auteurs, etablissement, email, telephone, texte, mots_cles, file_url")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + batchSize - 1);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    abstracts.push(...(data ?? []));
    if (!data || data.length < batchSize) break;
  }

  const rows = abstracts.map((a) => ({
    reference: a.reference,
    auteur: a.auteur_principal,
    co_auteurs: a.co_auteurs,
    service: a.etablissement,
    email: a.email,
    telephone: a.telephone,
    resume: a.texte,
    mots_cles: a.mots_cles,
    fichier: a.file_url ? "Oui" : "Non",
  }));

  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = status ? `-${status}` : "";
  return new NextResponse(toCsv(HEADERS, rows), {
    headers: csvHeaders(`abstracts${suffix}-${stamp}.csv`),
  });
}
