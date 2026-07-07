import PageHero from "@/components/PageHero";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Post = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  gtt: string | null;
  display_date: string | null;
  featured: boolean;
  created_at: string;
};

const categoryColors: Record<string, { bg: string; color: string }> = {
  "Recommandations": { bg: "#E8F9F7", color: "#31B9AE" },
  "Recherche": { bg: "#eff6ff", color: "#2563eb" },
  "Actualités": { bg: "#fef3c7", color: "#d97706" },
  "Congrès": { bg: "#ede9fe", color: "#7c3aed" },
  "Formation": { bg: "#f5f3ff", color: "#7c3aed" },
  "Santé publique": { bg: "#E8F9F7", color: "#259689" },
  "GTT": { bg: "#fef2f2", color: "#dc2626" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default async function BlogPage() {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, category, title, excerpt, image_url, gtt, display_date, featured, created_at")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  const list: Post[] = posts ?? [];

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
          <h2 className="text-lg font-black text-gray-900 mb-5">Actualités</h2>

          {list.length === 0 ? (
            <div className="bg-background rounded-2xl border border-gray-100 p-12 text-center">
              <p className="text-gray-500">Aucun article publié pour l&apos;instant.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {list.map((post) => {
                const catStyle = categoryColors[post.category] ?? { bg: "#f1f5f9", color: "#64748b" };
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}
                    className="group bg-background rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 card-shadow flex flex-col">
                    <div className="h-44 overflow-hidden relative bg-gray-100">
                      {post.image_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={post.image_url} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : null}
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: catStyle.bg, color: catStyle.color }}>
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-gray-400 mb-2">{post.display_date ?? formatDate(post.created_at)}</p>
                      <h3 className="font-black text-gray-900 group-hover:text-primary transition-colors text-sm leading-snug mb-2 line-clamp-2 flex-1">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                      )}
                      {post.gtt && (
                        <span className="text-xs font-semibold" style={{ color: "#31B9AE" }}>📌 {post.gtt}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
