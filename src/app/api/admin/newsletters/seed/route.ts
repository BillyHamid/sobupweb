import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const SEED = {
  numero: 1,
  title: "Newsletter SOBUP",
  period: "Avril 2026",
  description:
    "Découvrez le premier numéro du bulletin d'information de la Société Burkinabè de Pneumologie : actualité de la société, histoire, hommages et rayonnement scientifique.",
  highlights: [
    { icon: "🏛️", label: "Vie de la société", desc: "L'Assemblée Générale Élective" },
    { icon: "📜", label: "Histoire & Héritage", desc: "Entretien avec le Pr Martial OUEDRAOGO" },
    { icon: "🎖️", label: "Hommages", desc: "Pr Bernard KOFFI N'GORAN — Abidjan" },
    { icon: "🔬", label: "Rayonnement scientifique", desc: "Actualité scientifique en bref" },
  ],
  cover_url: "/newletter.jpg",
  pdf_url: "/newsletter-n1-avril-2026.pdf",
  pdf_size: "7 Mo",
  published_at: "2026-04-01",
  published: true,
};

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const supabase = createAdminClient();

  const { count } = await supabase.from("newsletters").select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) {
    return NextResponse.json({ ok: true, skipped: true, message: "Des newsletters existent déjà — import ignoré." });
  }

  const { data, error } = await supabase.from("newsletters").insert(SEED).select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, inserted: 1, id: data.id });
}
