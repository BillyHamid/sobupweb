import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const options = Array.isArray(body?.options) ? body.options.map((v: unknown) => typeof v === "string" ? v.trim() : "") : [];
  if (title.length < 3 || title.length > 160 || question.length < 3 || question.length > 300 || description.length > 1000 || options.length < 2 || options.length > 30 || options.some((v: string) => !v || v.length > 160) || new Set(options.map((v: string) => v.toLocaleLowerCase("fr"))).size !== options.length) {
    return NextResponse.json({ error: "Vérifiez le titre, la question et la liste de 2 à 30 personnes distinctes." }, { status: 422 });
  }
  const db = createAdminClient();
  const { data: survey, error } = await db.from("member_surveys").insert({ title, question, description: description || null, published: false, is_open: false }).select("id").single();
  if (error || !survey) return NextResponse.json({ error: "Impossible de créer le sondage. Vérifiez la configuration Supabase." }, { status: 503 });
  const { error: optionsError } = await db.from("member_survey_options").insert(options.map((label: string, position: number) => ({ survey_id: survey.id, label, position })));
  if (optionsError) {
    await db.from("member_surveys").delete().eq("id", survey.id);
    return NextResponse.json({ error: "Impossible d’enregistrer les personnes proposées." }, { status: 503 });
  }
  const { error: publishError } = await db.from("member_surveys").update({ published: true, is_open: true }).eq("id", survey.id);
  if (publishError) return NextResponse.json({ error: "Sondage créé mais non publié. Contactez l’administrateur technique." }, { status: 503 });
  return NextResponse.json({ id: survey.id, url: `/sondages/${survey.id}` }, { status: 201 });
}
