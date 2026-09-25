import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import SurveysManager from "./SurveysManager";

export const dynamic = "force-dynamic";

export type SurveyAdmin = {
  id: string;
  title: string;
  question: string;
  is_open: boolean;
  created_at: string;
  options: { id: string; label: string; position: number }[];
  votes: { user_id: string; option_id: string; name: string }[];
};

export default async function AdminSurveysPage() {
  if (!(await isAdminAuthenticated())) return null;
  const db = createAdminClient();
  const { data: surveys, error } = await db.from("member_surveys").select("id, title, question, is_open, created_at").order("created_at", { ascending: false });
  if (error) return <div className="p-8"><h1 className="text-2xl font-bold">Sondages</h1><p className="mt-4 text-red-700">Sondages indisponibles. Exécutez le script supabase-sondages.sql dans Supabase.</p></div>;
  const ids = (surveys ?? []).map(s => s.id);
  const [{ data: options, error: optionsError }, { data: ballots, error: ballotsError }] = ids.length ? await Promise.all([
    db.from("member_survey_options").select("id, survey_id, label, position").in("survey_id", ids).order("position"),
    db.from("member_survey_ballots").select("survey_id, option_id, user_id").in("survey_id", ids),
  ]) : [{ data: [], error: null }, { data: [], error: null }];
  if (optionsError || ballotsError) return <div className="p-8"><h1 className="text-2xl font-bold">Sondages</h1><p className="mt-4 text-red-700">Impossible de charger l’intégralité des résultats. Réessayez plus tard.</p></div>;
  const userIds = [...new Set((ballots ?? []).map(b => b.user_id))];
  const { data: profiles, error: profilesError } = userIds.length ? await db.from("profiles").select("user_id, prenom, nom").in("user_id", userIds) : { data: [], error: null };
  if (profilesError) return <div className="p-8"><h1 className="text-2xl font-bold">Sondages</h1><p className="mt-4 text-red-700">Impossible de vérifier l’identité des votants. Réessayez plus tard.</p></div>;
  const names = new Map((profiles ?? []).map(p => [p.user_id, `${p.prenom ?? ""} ${p.nom ?? ""}`.trim()]));
  const items: SurveyAdmin[] = (surveys ?? []).map(s => ({
    ...s,
    options: (options ?? []).filter(o => o.survey_id === s.id).map(({ id, label, position }) => ({ id, label, position })),
    votes: (ballots ?? []).filter(b => b.survey_id === s.id).map(b => ({ user_id: b.user_id, option_id: b.option_id, name: names.get(b.user_id) || `Membre ${b.user_id.slice(0, 8)}` })),
  }));
  return <SurveysManager initialSurveys={items} />;
}
