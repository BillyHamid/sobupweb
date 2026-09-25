import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/server";
import SurveyVote from "./SurveyVote";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { title: "Sondage", robots: { index: false, follow: false } };
  const { data } = await createPublicClient().from("member_surveys").select("title").eq("id", id).eq("published", true).maybeSingle();
  return { title: data ? `${data.title} — Sondage SOBUP` : "Sondage SOBUP", robots: { index: false, follow: false } };
}

export default async function SurveyPage({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = createPublicClient();
  const { data: survey, error } = await db.from("member_surveys").select("id, title, question, description, is_open").eq("id", id).eq("published", true).maybeSingle();
  if (error || !survey) notFound();
  const { data: options, error: optionsError } = await db.from("member_survey_options").select("id, label, position").eq("survey_id", id).order("position");
  if (optionsError || !options?.length) notFound();
  return <div className="min-h-[70vh] bg-[#f7faf9] text-slate-800">
    <section className="bg-[#0b3d38] px-5 py-12 text-white sm:py-16"><div className="mx-auto max-w-3xl"><nav className="mb-8 text-sm text-white/65"><Link href="/" className="hover:text-white">Accueil</Link><span className="mx-3">/</span>Sondage</nav><p className="text-xs font-bold uppercase tracking-widest text-[#7eeae4]">Cérémonie SOBUP · Réservé aux membres</p><h1 className="mt-4 text-3xl font-black sm:text-5xl">{survey.title}</h1>{survey.description && <p className="mt-5 max-w-2xl leading-relaxed text-white/75">{survey.description}</p>}</div></section>
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14"><SurveyVote surveyId={id} question={survey.question} isOpen={survey.is_open} options={options.map(({ id, label }) => ({ id, label }))} /></div>
  </div>;
}
