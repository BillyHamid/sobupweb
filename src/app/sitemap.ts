import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/server";

const SITE_URL = "https://www.sobup.online";

/**
 * Sitemap XML dynamique lu par Google Search Console.
 * Inclut les pages statiques + les articles de blog et événements publiés.
 * Accessible sur https://www.sobup.online/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ─── Pages statiques ───
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/a-propos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gtt`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/evenements`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/recommandations`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/mediatheque`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/annuaire`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/adhesion`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/espace-membre`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  // ─── Pages GTT ───
  const gttSlugs = [
    "tuberculose", "infections-non-tb", "asthme-allergie", "oncologie-thoracique",
    "tabac-bpco", "sommeil-vni", "pneumo-pediatrie", "efr",
    "imagerie-thoracique", "endoscopie-bronchique", "environnement-travail",
  ];
  const gttPages: MetadataRoute.Sitemap = gttSlugs.map((slug) => ({
    url: `${SITE_URL}/gtt/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // ─── Pages congrès et journée régionale (événements avec pages dédiées) ───
  const eventPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/evenements/9eme-congres`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/evenements/journee-regionale`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // ─── Articles de blog (dynamiques depuis Supabase) ───
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("published", true)
      .order("updated_at", { ascending: false });
    if (data) {
      blogPages = data.map((post: { slug: string; updated_at: string }) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.warn("[sitemap] Impossible de charger les articles de blog :", err);
  }

  return [...staticPages, ...gttPages, ...eventPages, ...blogPages];
}
