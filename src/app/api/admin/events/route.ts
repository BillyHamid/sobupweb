import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data ?? [] });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const required = ["title", "type", "event_date", "display_date", "location"];
  for (const k of required) {
    if (!body[k] || String(body[k]).trim() === "") {
      return NextResponse.json({ error: `Champ "${k}" requis.` }, { status: 422 });
    }
  }

  const baseSlug = slugify(body.title);
  const supabase = createAdminClient();
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data: existing } = await supabase.from("events").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  const { data, error } = await supabase.from("events").insert({
    slug,
    type: body.type,
    title: String(body.title).trim(),
    excerpt: body.excerpt ?? null,
    description: body.description ?? null,
    event_date: body.event_date,
    display_date: String(body.display_date).trim(),
    time_range: body.time_range ?? null,
    location: String(body.location).trim(),
    gtt: body.gtt ?? null,
    image_url: body.image_url ?? null,
    badge_label: body.badge_label ?? "À venir",
    badge_color: body.badge_color ?? "#64748b",
    badge_bg: body.badge_bg ?? "#f1f5f9",
    attachment_url: body.attachment_url ?? null,
    attachment_name: body.attachment_name ?? null,
    attachment_size: body.attachment_size ?? null,
    has_page: !!body.has_page,
    published: body.published !== false,
    featured: !!body.featured,
  }).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data }, { status: 201 });
}
