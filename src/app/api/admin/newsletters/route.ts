import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .order("numero", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ newsletters: data ?? [] });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { numero, title, period, description, highlights, cover_url, pdf_url, pdf_size, published_at, published } = body;

  if (!numero || !title || !period || !pdf_url) {
    return NextResponse.json(
      { error: "Numéro, titre, période et fichier PDF sont requis." },
      { status: 422 }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("newsletters").insert({
    numero: Number(numero),
    title: String(title).trim(),
    period: String(period).trim(),
    description: description || null,
    highlights: Array.isArray(highlights) ? highlights : [],
    cover_url: cover_url || null,
    pdf_url,
    pdf_size: pdf_size || null,
    published_at: published_at || new Date().toISOString().slice(0, 10),
    published: published !== false,
  }).select("*").single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: `Le numéro ${numero} existe déjà.` }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ newsletter: data }, { status: 201 });
}
