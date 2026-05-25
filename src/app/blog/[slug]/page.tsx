import PageHero from "@/components/PageHero";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";

const allPosts = [
  { slug: "tournee-convivialite-24-avril", category: "Actualités", date: "24 Avr 2026", title: "Tournée de convivialité : le Bureau visite les structures de la capitale", excerpt: "Après le CHU-YO, le CNLAT et le SP/CNLST, le Bureau exécutif a poursuivi sa tournée en visitant plusieurs structures de Ouagadougou.", content: "Chers tous,\n\nAprès le CHU-YO, le CNLAT, le SP/CNLST, et l'OST, le Bureau exécutif de la SOBUP a poursuivi sa tournée de convivialité le 24 avril 2026 dans plusieurs structures de la capitale.\n\nUne délégation s'est rendue :\n\n• au CHU Bogodogo\n• au CHU Tengandogo\n• au CHU Pédiatrique Charles De Gaulle\n• à l'Hôpital de district de Bogodogo\n• à l'hôpital militaire Capitaine Halassane Coulibaly\n\nDans toutes ces structures, ladite délégation a reçu un accueil très chaleureux de la part des chefs de service et de l'ensemble des équipes. Des échanges ont mis en lumière de très belles perspectives pour le rayonnement de la Pneumologie au Burkina Faso.\n\nMerci à tous nos collègues et membres pour leur disponibilité et leur engagement.\n\nBien à vous,\nPrésident SOBUP", image: "/actualiteSobup/actu1.jpeg" },
  { slug: "visites-convivialite-bureau", category: "Actualités", date: "8 Avr 2026", title: "Le Bureau exécutif débute ses visites de convivialité", excerpt: "Le 8 avril, le Bureau exécutif a débuté ses visites au CHU-YO pour renforcer la cohésion au sein de la SOBUP.", content: "Chers tous,\n\nCe 8 avril, le Bureau exécutif a débuté ses visites de convivialité pour renforcer la cohésion, en commençant par le berceau : le service de pneumologie du CHU-YO.\n\nAu menu :\n• Présentation du bureau\n• Précieux conseils des aînés et Maîtres\n• Remise des cartes de membre au Président d'honneur ainsi qu'à tous les membres à jour de cotisation\n\nRappel : Le Bureau prévoit de rendre visite à l'ensemble des pneumologues sur tout le territoire.\n\nNB : Les cartes de membre sont disponibles pour tous les membres à jour de leur cotisation.\n\nBien à vous,\nPrésident SOBUP", image: "/actualiteSobup/actu2.jpeg" },
];

const categoryColors: Record<string, { bg: string; color: string }> = {
  "Actualités": { bg: "#fef3c7", color: "#d97706" },
  "Recommandations": { bg: "#E8F9F7", color: "#31B9AE" },
  "Recherche": { bg: "#eff6ff", color: "#2563eb" },
  "Formation": { bg: "#f5f3ff", color: "#7c3aed" },
  "Santé publique": { bg: "#E8F9F7", color: "#259689" },
};

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Article non trouvé</h1>
          <Link href="/blog" className="text-primary hover:underline">
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const catStyle = categoryColors[post.category] ?? { bg: "#f1f5f9", color: "#64748b" };

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title.substring(0, 30) }]}
        tag="Article"
        shape="chevron-up"
      />

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-3xl px-4">
          {/* Image */}
          <div className="relative w-full h-96 rounded-3xl overflow-hidden mb-8 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: catStyle.bg, color: catStyle.color }}>
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.date}</span>
          </div>

          {/* Content */}
          <div className="bg-background rounded-2xl p-8 shadow-sm">
            <div className="prose prose-sm max-w-none">
              {post.content.split("\n").map((paragraph, i) => {
                if (paragraph.trim() === "") return null;
                if (paragraph.startsWith("•")) {
                  return (
                    <div key={i} className="ml-4 text-gray-700 leading-relaxed mb-2">
                      <span className="inline-block mr-2">•</span>
                      {paragraph.replace(/^•\s*/, "")}
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Back button */}
          <div className="mt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold" style={{ background: "#31B9AE", color: "white" }}>
              ← Retour au blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
