import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data ?? [] });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { title, category, excerpt, content, image_url, gtt, display_date, published, featured } = body;
  if (!title || !content) {
    return NextResponse.json({ error: "Titre et contenu requis." }, { status: 422 });
  }

  const baseSlug = slugify(title);
  const supabase = createAdminClient();

  // Trouver un slug unique
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug,
      title: String(title).trim(),
      category: category ?? "Actualités",
      excerpt: excerpt ?? null,
      content: String(content).trim(),
      image_url: image_url ?? null,
      gtt: gtt ?? null,
      display_date: display_date ?? null,
      published: published !== false,
      featured: !!featured,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data }, { status: 201 });
}
