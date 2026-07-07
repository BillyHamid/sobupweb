import PageHero from "@/components/PageHero";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const categoryColors: Record<string, { bg: string; color: string }> = {
  "Actualités": { bg: "#fef3c7", color: "#d97706" },
  "Congrès": { bg: "#ede9fe", color: "#7c3aed" },
  "Recommandations": { bg: "#E8F9F7", color: "#31B9AE" },
  "Recherche": { bg: "#eff6ff", color: "#2563eb" },
  "Formation": { bg: "#f5f3ff", color: "#7c3aed" },
  "Santé publique": { bg: "#E8F9F7", color: "#259689" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createPublicClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Article non trouvé</h1>
          <Link href="/blog" className="text-primary hover:underline">Retour au blog</Link>
        </div>
      </div>
    );
  }

  const catStyle = categoryColors[post.category] ?? { bg: "#f1f5f9", color: "#64748b" };

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt ?? ""}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title.substring(0, 30) }]}
        tag="Article"
        shape="chevron-up"
      />

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-3xl px-4">
          {post.image_url && (
            <div className="relative w-full h-96 rounded-3xl overflow-hidden mb-8 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: catStyle.bg, color: catStyle.color }}>
              {post.category}
            </span>
            <span className="text-sm text-gray-500">{post.display_date ?? formatDate(post.created_at)}</span>
            {post.gtt && (
              <span className="text-sm font-semibold" style={{ color: "#31B9AE" }}>📌 {post.gtt}</span>
            )}
          </div>

          <div className="bg-background rounded-2xl p-8 shadow-sm">
            <div className="prose prose-sm max-w-none">
              {post.content.split("\n").map((paragraph: string, i: number) => {
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
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>
                );
              })}
            </div>
          </div>

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
