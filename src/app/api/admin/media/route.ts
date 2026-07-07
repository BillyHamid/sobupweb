import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const supabase = createAdminClient();
  let q = supabase.from("media_items").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const {
    kind, title, description, file_url, file_path, file_size_bytes, file_type,
    album_ordinal, album_year, gtt, display_date, featured, published, sort_order,
  } = body;
  if (!kind || !["photo", "video", "document"].includes(kind)) {
    return NextResponse.json({ error: "Kind invalide (photo/video/document)." }, { status: 422 });
  }
  if (!file_url) {
    return NextResponse.json({ error: "Fichier requis." }, { status: 422 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("media_items").insert({
    kind, title: title || null, description: description || null,
    file_url, file_path: file_path || null,
    file_size_bytes: file_size_bytes || null, file_type: file_type || null,
    album_ordinal: album_ordinal || null, album_year: album_year || null,
    gtt: gtt || null, display_date: display_date || null,
    featured: !!featured, published: published !== false,
    sort_order: sort_order ?? 0,
  }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
