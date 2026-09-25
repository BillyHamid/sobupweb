"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, Vote } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Option = { id: string; label: string };
type Access = "loading" | "login" | "ready" | "voted" | "error";

export default function SurveyVote({ surveyId, question, isOpen, options }: { surveyId: string; question: string; isOpen: boolean; options: Option[] }) {
  const [access, setAccess] = useState<Access>("loading");
  const [chosen, setChosen] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    const db = createSupabaseBrowserClient();
    async function check() {
      try {
        const { data: { user }, error } = await db.auth.getUser();
        if (!active) return;
        if (error || !user) { setAccess("login"); return; }
        const { data, error: statusError } = await db.from("member_survey_participations").select("survey_id").eq("survey_id", surveyId).eq("user_id", user.id).maybeSingle();
        if (!active) return;
        if (statusError) { setAccess("error"); return; }
        setAccess(data ? "voted" : "ready");
      } catch { if (active) setAccess("error"); }
    }
    void check();
    return () => { active = false; };
  }, [surveyId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chosen || sending || access !== "ready") return;
    setSending(true); setMessage("");
    try {
      const db = createSupabaseBrowserClient();
      const { error } = await db.rpc("cast_member_survey_vote", { p_survey_id: surveyId, p_option_id: chosen });
      if (error) {
        if (error.code === "23505") { setAccess("voted"); return; }
        if (error.code === "28000" || error.message?.includes("Profil membre")) { setMessage("Votre compte n’a pas de profil membre SOBUP validé. Contactez le bureau."); return; }
        if (error.code === "22023") { setMessage("Ce sondage est fermé ou le choix n’est plus disponible. Rechargez la page."); return; }
        throw error;
      }
      setAccess("voted");
    } catch { setMessage("Le vote n’a pas pu être enregistré. Réessayez dans un instant."); }
    finally { setSending(false); }
  }

  return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <h2 className="text-2xl font-bold text-[#0b3d38]">{question}</h2>
    <p className="mt-3 text-sm leading-relaxed text-slate-600">Un seul choix est possible. Votre réponse reste privée pour les autres membres. L’administration SOBUP peut voir votre identité et votre choix.</p>
    {!isOpen ? <p className="mt-7 rounded-xl bg-slate-100 p-5 font-semibold text-slate-700">Ce sondage est fermé.</p>
      : access === "loading" ? <p role="status" className="mt-7 text-slate-600">Vérification de votre compte…</p>
      : access === "login" ? <div className="mt-7 rounded-xl bg-[#e8f9f7] p-6"><LockKeyhole className="h-7 w-7 text-[#065e52]" /><p className="mt-3 font-semibold text-[#0b3d38]">Connectez-vous avec votre compte membre SOBUP pour participer.</p><p className="mt-2 text-sm text-slate-600">Les comptes de démonstration ne permettent pas de voter.</p><Link href={`/espace-membre?next=${encodeURIComponent(`/sondages/${surveyId}`)}`} className="mt-5 inline-block rounded-lg bg-[#065e52] px-5 py-3 font-bold text-white">Se connecter</Link></div>
      : access === "voted" ? <div role="status" className="mt-7 rounded-xl bg-emerald-50 p-6"><CheckCircle2 className="h-8 w-8 text-emerald-600" /><p className="mt-3 font-semibold text-emerald-900">Votre vote a été enregistré.</p><p className="mt-1 text-sm text-emerald-800">Chaque membre ne peut répondre qu’une seule fois.</p></div>
      : access === "error" ? <p role="alert" className="mt-7 rounded-xl bg-amber-50 p-5 text-amber-900">Vérification de votre accès impossible. Rechargez la page ou réessayez plus tard.</p>
      : <form onSubmit={submit} className="mt-7"><fieldset disabled={sending} className="space-y-3"><legend className="mb-3 text-sm font-bold text-slate-700">Choisissez une personne</legend>{options.map(option => <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${chosen === option.id ? "border-[#08796c] bg-[#e8f9f7]" : "border-slate-200 hover:border-[#31b9ae]"}`}><input type="radio" name="candidate" value={option.id} checked={chosen === option.id} onChange={() => setChosen(option.id)} required className="h-4 w-4 accent-[#065e52]" /><span className="font-semibold">{option.label}</span></label>)}{message && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>}<button disabled={!chosen || sending} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#065e52] px-5 py-3.5 font-bold text-white hover:bg-[#0b3d38] disabled:opacity-50"><Vote className="h-5 w-5" />{sending ? "Enregistrement…" : "Valider mon choix"}</button></fieldset></form>}
  </div>;
}
