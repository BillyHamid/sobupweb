import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

type SeedItem = {
  kind: "photo" | "video" | "document";
  title?: string | null;
  description?: string | null;
  file_url: string;
  album_ordinal?: string | null;
  album_year?: string | null;
  gtt?: string | null;
  display_date?: string | null;
  featured?: boolean;
  file_type?: string | null;
  sort_order?: number;
};

const PHOTO_ALBUMS: { ordinal: string; year: string; files: string[] }[] = [
  { ordinal: "Activités SOBUP", year: "2026", files: [
    "/mediatheque/congres-1.jpg", "/mediatheque/congres-3.jpg", "/mediatheque/congres-4.jpg",
    "/mediatheque/congres-5.jpeg", "/mediatheque/congres-6.jpg", "/mediatheque/congres-7.jpeg",
    "/mediatheque/congres-8.jpg", "/mediatheque/ev-journee-regionale.jpg", "/mediatheque/ff.jpeg",
    "/mediatheque/photo-1.jpeg", "/mediatheque/photo-2.jpeg", "/mediatheque/photo-3.jpeg",
  ]},
  { ordinal: "1ᵉʳ Congrès", year: "2011", files: Array.from({ length: 7 }, (_, i) => `/1er_congres/photo-${i + 1}.jpeg`) },
  { ordinal: "3ᵉ Congrès", year: "2015", files: ["/3econgres/photo-1.jpg"] },
  { ordinal: "4ᵉ Congrès", year: "2017", files: ["/4econgres/photo-1.jpg"] },
  { ordinal: "5ᵉ Congrès", year: "2019", files: ["/5econgres/photo-1.jpeg", "/5econgres/photo-2.jpeg"] },
  { ordinal: "6ᵉ Congrès", year: "2021", files: Array.from({ length: 3 }, (_, i) => `/6econgres/photo-${i + 1}.jpeg`) },
  { ordinal: "7ᵉ Congrès", year: "2023", files: Array.from({ length: 5 }, (_, i) => `/7econgres/photo-${i + 1}.jpeg`) },
];

const VIDEOS: SeedItem[] = [
  { kind: "video", title: "Vidéo récapitulative du lancement de l'École de l'asthme de Ouagadougou", gtt: "GT Asthme & Allergie", file_url: "/docs/gtt/asthme-allergie/lancement-ecole-asthme-ouagadougou.mp4", featured: true, file_type: "video/mp4" },
  { kind: "video", title: "Chambre d'inhalation — Capsule pédagogique (français)", gtt: "École de l'Asthme", file_url: "/mediatheque/chambre-inhalation-francais.mp4", file_type: "video/mp4" },
  { kind: "video", title: "Chambre d'inhalation — Capsule pédagogique (mooré)", gtt: "École de l'Asthme", file_url: "/mediatheque/chambre-inhalation-moore.mp4", file_type: "video/mp4" },
  { kind: "video", title: "Chambre d'inhalation — Capsule pédagogique (dioula)", gtt: "École de l'Asthme", file_url: "/mediatheque/chambre-inhalation-dioula.mp4", file_type: "video/mp4" },
  { kind: "video", title: "Utilisation du Diskus — Capsule de sensibilisation (français)", gtt: "École de l'Asthme", file_url: "/mediatheque/diskus-francais.mp4", file_type: "video/mp4" },
  { kind: "video", title: "Utilisation du Diskus — Capsule de sensibilisation (mooré)", gtt: "École de l'Asthme", file_url: "/mediatheque/diskus-moore.mp4", file_type: "video/mp4" },
  { kind: "video", title: "Aérosol doseur — Capsule de sensibilisation (français)", gtt: "École de l'Asthme", file_url: "/mediatheque/aerosol-doseur-francais.mp4", file_type: "video/mp4" },
  { kind: "video", title: "Aérosol doseur — Capsule de sensibilisation (mooré)", gtt: "École de l'Asthme", file_url: "/mediatheque/aerosol-doseur-moore.mp4", file_type: "video/mp4" },
  { kind: "video", title: "Lancement de l'École de l'Asthme — Ouagadougou", gtt: "GT Asthme & Allergie", file_url: "/mediatheque/lancement-ecole-asthme.mp4", file_type: "video/mp4" },
];

const DOCUMENTS: SeedItem[] = [
  {
    kind: "document",
    title: "Bulletin d'information SOBUP N°1",
    description: "Premier numéro de la newsletter trimestrielle officielle de la SOBUP — Avril 2026.",
    gtt: "SOBUP", display_date: "Avril 2026",
    file_url: "/newsletter-n1-avril-2026.pdf", featured: true, file_type: "application/pdf",
  },
  {
    kind: "document",
    title: "Guide technique de lutte contre la tuberculose (10ème édition, 2025)",
    description: "Référentiel national de prise en charge de la tuberculose, élaboré par le GT Tuberculose et le PNT.",
    gtt: "GT Tuberculose", display_date: "2025",
    file_url: "/docs/gtt/tuberculose/guide-technique-tb-2025.pdf", file_type: "application/pdf",
  },
  {
    kind: "document",
    title: "Guide de prise en charge de la Tuberculose Pharmacorésistante (TB-MR/RR, 2026)",
    description: "Recommandations pour la prise en charge des tuberculoses multi-résistantes et résistantes à la rifampicine.",
    gtt: "GT Tuberculose", display_date: "2026",
    file_url: "/docs/gtt/tuberculose/guide-tb-resistante-2026.pdf", file_type: "application/pdf",
  },
  {
    kind: "document",
    title: "Guide de prise en charge de la tuberculose chez l'enfant (2025)",
    description: "Recommandations pédiatriques nationales — diagnostic, traitement et suivi de la TB de l'enfant.",
    gtt: "GT Tuberculose", display_date: "2025",
    file_url: "/docs/gtt/tuberculose/guide-tb-enfant-2025.pdf", file_type: "application/pdf",
  },
  {
    kind: "document",
    title: "Guide TB/VIH (6ème édition, 2024)",
    description: "Prise en charge intégrée de la co-infection tuberculose / VIH au Burkina Faso.",
    gtt: "GT Tuberculose", display_date: "2024",
    file_url: "/docs/gtt/tuberculose/guide-tb-vih-2024.pdf", file_type: "application/pdf",
  },
  {
    kind: "document",
    title: "Plan Stratégique National de lutte contre la tuberculose (PSN-TB 2024-2026)",
    description: "Document de référence de la politique nationale de lutte contre la tuberculose pour la période 2024-2026.",
    gtt: "GT Tuberculose", display_date: "2024",
    file_url: "/docs/gtt/tuberculose/psn-tb-2024-2026.pdf", file_type: "application/pdf",
  },
];

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const supabase = createAdminClient();

  const { count } = await supabase.from("media_items").select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) {
    return NextResponse.json({ ok: true, skipped: true, message: "Médias déjà présents — seed ignoré." });
  }

  const photos: SeedItem[] = PHOTO_ALBUMS.flatMap((a) =>
    a.files.map((f, i) => ({
      kind: "photo" as const,
      file_url: f,
      album_ordinal: a.ordinal,
      album_year: a.year,
      sort_order: i,
      file_type: f.endsWith(".png") ? "image/png" : "image/jpeg",
    }))
  );

  // Normalise pour ne pas envoyer d'undefined à PostgREST (interprétés comme null)
  const normalize = (item: SeedItem) => ({
    kind: item.kind,
    title: item.title ?? null,
    description: item.description ?? null,
    file_url: item.file_url,
    file_type: item.file_type ?? null,
    album_ordinal: item.album_ordinal ?? null,
    album_year: item.album_year ?? null,
    gtt: item.gtt ?? null,
    display_date: item.display_date ?? null,
    featured: item.featured === true,
    published: true,
    sort_order: item.sort_order ?? 0,
  });

  const all = [...photos, ...VIDEOS, ...DOCUMENTS].map(normalize);
  const { data, error } = await supabase.from("media_items").insert(all).select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    ok: true,
    inserted: data?.length ?? 0,
    breakdown: { photos: photos.length, videos: VIDEOS.length, documents: DOCUMENTS.length },
  });
}
