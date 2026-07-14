import type { MetadataRoute } from "next";

const SITE_URL = "https://www.sobup.online";

/**
 * Fichier robots.txt dynamique.
 * Autorise l'indexation de tout le site sauf les zones privées et pointe vers le sitemap.
 * Accessible sur https://www.sobup.online/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/espace-membre/dashboard",
          "/espace-membre/dashboard/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
