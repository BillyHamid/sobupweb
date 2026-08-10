import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { toCsv, csvHeaders, csvDate } from "@/lib/csv";

const HEADERS = [
  { key: "n", label: "N°" },
  { key: "nom", label: "Nom" },
  { key: "prenom", label: "Prénom" },
  { key: "email", label: "Email" },
  { key: "telephone", label: "Téléphone" },
  { key: "fonction", label: "Fonction" },
  { key: "specialite", label: "Spécialité" },
  { key: "est_ehu", label: "Enseignant HU" },
  { key: "grade", label: "Grade" },
  { key: "lieu_exercice", label: "Lieu d'exercice" },
  { key: "motivation", label: "Motivation" },
  { key: "notes", label: "Notes internes" },
  { key: "date", label: "Date d'inscription" },
];

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const eventSlug = searchParams.get("event");

  const supabase = createAdminClient();
  let q = supabase.from("event_registrations").select("*").order("created_at", { ascending: true });
  if (eventSlug) q = q.eq("event_slug", eventSlug);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data ?? []).map((r, i) => ({
    n: i + 1,
    nom: r.nom,
    prenom: r.prenom,
    email: r.email,
    telephone: r.telephone,
    fonction: r.fonction,
    specialite: r.specialite,
    est_ehu: r.est_ehu,
    grade: r.grade,
    lieu_exercice: r.lieu_exercice,
    motivation: r.motivation,
    notes: r.notes,
    date: csvDate(r.created_at),
  }));

  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = eventSlug ? `-${eventSlug}` : "";
  return new NextResponse(toCsv(HEADERS, rows), {
    headers: csvHeaders(`inscriptions${suffix}-${stamp}.csv`),
  });
}
