import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const ALLOWED = [
  "numero", "title", "period", "description", "highlights",
  "cover_url", "pdf_url", "pdf_size", "published_at", "published",
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
  if ("numero" in patch) patch.numero = Number(patch.numero);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ce numéro est déjà utilisé par une autre newsletter." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ newsletter: data });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = createAdminClient();

  const { data: nl } = await supabase
    .from("newsletters")
    .select("cover_url, pdf_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("newsletters").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Nettoyage best-effort des fichiers Storage
  for (const url of [nl?.cover_url, nl?.pdf_url]) {
    if (!url) continue;
    const match = url.match(/\/newsletters\/(.+)$/);
    if (match) await supabase.storage.from("newsletters").remove([match[1]]).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
