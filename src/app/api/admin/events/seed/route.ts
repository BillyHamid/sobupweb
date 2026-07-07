import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const SEED = [
  {
    slug: "epu-environnement-travail",
    type: "EPU",
    title: "Prise en charge des pathologies respiratoires professionnelles indemnisables (déclaration et réparation)",
    excerpt: "Éducation médicale continue organisée par le GT Environnement & Travail sur la déclaration et la réparation des pathologies respiratoires professionnelles.",
    description: "Éducation médicale continue (EPU) destinée aux pneumologues, médecins du travail, employeurs et acteurs de la santé respiratoire au Burkina Faso. Programme : référentiel des maladies respiratoires professionnelles indemnisables, procédure de déclaration, droits du salarié, rôle du médecin du travail.",
    event_date: "2026-07-31",
    display_date: "31 Juillet 2026",
    time_range: "15h30 – 17h30",
    location: "Salle de conférence de la CARFO, Ouagadougou",
    gtt: "GT Environnement & Travail",
    image_url: "/ev-environnement-travail.jpg",
    badge_label: "À venir",
    badge_color: "#16a34a",
    badge_bg: "#f0fdf4",
    has_page: false,
    featured: true,
  },
  {
    slug: "ecole-asthme-2",
    type: "Formation",
    title: "2ème session de l'École de l'Asthme et des Allergies",
    excerpt: "Deuxième session de formation de l'École de l'Asthme, organisée conjointement par le GT Asthme & Allergies et le GT Pneumo-Pédiatrie.",
    description: "Formation intensive sur la prise en charge de l'asthme et des allergies respiratoires de l'adulte et de l'enfant. Ateliers pratiques d'utilisation des dispositifs d'inhalation (chambre d'inhalation, Diskus, aérosol doseur).",
    event_date: "2026-08-08",
    display_date: "8 Août 2026",
    time_range: null,
    location: "CHUP Charles de Gaulle, Ouagadougou",
    gtt: "GT Asthme & Allergies · GT Pneumo-Pédiatrie",
    image_url: "/ev-asthme-ecole.png",
    badge_label: "À venir",
    badge_color: "#2563eb",
    badge_bg: "#eff6ff",
    has_page: false,
    featured: true,
  },
  {
    slug: "journee-regionale",
    type: "Journée",
    title: "1ère Journée Scientifique Régionale",
    excerpt: "Première journée scientifique régionale de la SOBUP — conférences, communications et échanges autour de la santé respiratoire.",
    description: "1ère édition de la Journée Scientifique Régionale de la SOBUP à Koudougou. Programme de 3 jours : conférences plénières, ateliers pratiques, communications orales et affichées, sessions de dépistage des maladies respiratoires.",
    event_date: "2026-11-19",
    display_date: "19 – 21 Novembre 2026",
    time_range: null,
    location: "Koudougou, Burkina Faso",
    gtt: null,
    image_url: "/ev-journee-regionale.jpg",
    badge_label: "À venir",
    badge_color: "#64748b",
    badge_bg: "#f1f5f9",
    has_page: true,
    featured: true,
  },
  {
    slug: "9eme-congres",
    type: "Congrès",
    title: "9ème Congrès de la SOBUP",
    excerpt: "Pneumologie en Afrique : défis et innovations — conférences, ateliers pratiques et soumissions d'abstracts.",
    description: "9ème édition du Congrès biennal de la Société Burkinabè de Pneumologie. Thème : Pneumologie en Afrique — défis et innovations. Conférences plénières, symposiums, ateliers pratiques, communications libres et soumissions d'abstracts.",
    event_date: "2027-12-16",
    display_date: "16 – 18 Décembre 2027",
    time_range: null,
    location: "Sopatel Silmande Hôtel, Ouagadougou",
    gtt: null,
    image_url: "/congres-6.jpg",
    badge_label: "Inscriptions ouvertes",
    badge_color: "#259689",
    badge_bg: "#E8F9F7",
    has_page: true,
    featured: true,
  },
];

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("events").upsert(SEED, { onConflict: "slug", ignoreDuplicates: true }).select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, inserted: data?.length ?? 0, total: SEED.length });
}
