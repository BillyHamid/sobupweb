import PageHero from "@/components/PageHero";
import Link from "next/link";

const posts = [
  { slug: "tournee-convivialite-24-avril", category: "Actualités", date: "24 Avr 2026", title: "Tournée de convivialité : le Bureau visite les structures de la capitale", excerpt: "Après le CHU-YO, le CNLAT et le SP/CNLST, le Bureau exécutif a poursuivi sa tournée en visitant plusieurs structures de Ouagadougou.", content: "Chers tous,\n\nAprès le CHU-YO, le CNLAT, le SP/CNLST, et l'OST, le Bureau exécutif de la SOBUP a poursuivi sa tournée de convivialité le 24 avril 2026 dans plusieurs structures de la capitale.\n\nUne délégation s'est rendue :\n\n• au CHU Bogodogo\n• au CHU Tengandogo\n• au CHU Pédiatrique Charles De Gaulle\n• à l'Hôpital de district de Bogodogo\n• à l'hôpital militaire Capitaine Halassane Coulibaly\n\nDans toutes ces structures, ladite délégation a reçu un accueil très chaleureux de la part des chefs de service et de l'ensemble des équipes. Des échanges ont mis en lumière de très belles perspectives pour le rayonnement de la Pneumologie au Burkina Faso.\n\nMerci à tous nos collègues et membres pour leur disponibilité et leur engagement.\n\nBien à vous,\nPrésident SOBUP", gtt: null, image: "/actualiteSobup/actu1.jpeg", featured: true },
  { slug: "visites-convivialite-bureau", category: "Actualités", date: "8 Avr 2026", title: "Le Bureau exécutif débute ses visites de convivialité", excerpt: "Le 8 avril, le Bureau exécutif a débuté ses visites au CHU-YO pour renforcer la cohésion au sein de la SOBUP.", content: "Chers tous,\n\nCe 8 avril, le Bureau exécutif a débuté ses visites de convivialité pour renforcer la cohésion, en commençant par le berceau : le service de pneumologie du CHU-YO.\n\nAu menu :\n• Présentation du bureau\n• Précieux conseils des aînés et Maîtres\n• Remise des cartes de membre au Président d'honneur ainsi qu'à tous les membres à jour de cotisation\n\nRappel : Le Bureau prévoit de rendre visite à l'ensemble des pneumologues sur tout le territoire.\n\nNB : Les cartes de membre sont disponibles pour tous les membres à jour de leur cotisation.\n\nBien à vous,\nPrésident SOBUP", gtt: null, image: "/actualiteSobup/actu2.jpeg", featured: true },
];

const categoryColors: Record<string, { bg: string; color: string }> = {
  "Recommandations": { bg: "#E8F9F7", color: "#31B9AE" },
  "Recherche": { bg: "#eff6ff", color: "#2563eb" },
  "Actualités": { bg: "#fef3c7", color: "#d97706" },
  "Formation": { bg: "#f5f3ff", color: "#7c3aed" },
  "Santé publique": { bg: "#E8F9F7", color: "#259689" },
  "GTT": { bg: "#fef2f2", color: "#dc2626" },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Blog SOBUP"
        subtitle=""
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Blog" }]}
        tag="Publications"
        shape="chevron-up"
      />

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          {/* Articles */}
          <h2 className="text-lg font-black text-gray-900 mb-5">Actualités</h2>
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {posts.map((post) => {
              const catStyle = categoryColors[post.category] ?? { bg: "#f1f5f9", color: "#64748b" };
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group bg-background rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 card-shadow flex flex-col">
                  <div className="h-44 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: catStyle.bg, color: catStyle.color }}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                    <h3 className="font-black text-gray-900 group-hover:text-primary transition-colors text-sm leading-snug mb-2 line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                    {post.gtt && (
                      <span className="text-xs font-semibold" style={{ color: "#31B9AE" }}>📌 {post.gtt}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}
