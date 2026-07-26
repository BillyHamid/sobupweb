import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const ALLOWED = [
  "type", "title", "excerpt", "description", "event_date", "display_date",
  "time_range", "location", "gtt", "image_url", "badge_label", "badge_color",
  "badge_bg", "has_page", "published", "featured", "slug",
  "attachment_url", "attachment_name", "attachment_size",
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
  const { data, error } = await supabase.from("events").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ event: data });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = createAdminClient();

  const { data: ev } = await supabase
    .from("events")
    .select("image_url, attachment_url")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Nettoyage best-effort des fichiers Storage associés
  if (ev?.image_url) {
    const match = ev.image_url.match(/\/event-images\/(.+)$/);
    if (match) await supabase.storage.from("event-images").remove([match[1]]).catch(() => {});
  }
  if (ev?.attachment_url) {
    const match = ev.attachment_url.match(/\/event-files\/(.+)$/);
    if (match) await supabase.storage.from("event-files").remove([match[1]]).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
