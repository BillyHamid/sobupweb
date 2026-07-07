import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const ALLOWED = [
  "title", "description", "album_ordinal", "album_year",
  "gtt", "display_date", "featured", "published", "sort_order",
];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  for (const k of ALLOWED) if (k in body) patch[k] = body[k];
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Aucun champ à modifier." }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("media_items").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = createAdminClient();

  const { data: item } = await supabase.from("media_items").select("file_path, file_url").eq("id", id).single();
  const { error } = await supabase.from("media_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const path = item?.file_path ?? (item?.file_url ? item.file_url.match(/\/media\/(.+)$/)?.[1] : null);
  if (path) await supabase.storage.from("media").remove([path]).catch(() => {});
  return NextResponse.json({ ok: true });
}
