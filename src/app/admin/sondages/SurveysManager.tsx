"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, Plus, Users } from "lucide-react";
import type { SurveyAdmin } from "./page";

export default function SurveysManager({ initialSurveys }: { initialSurveys: SurveyAdmin[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [people, setPeople] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const field = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#08796c] focus:ring-2 focus:ring-[#08796c]/20";

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const options = people.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
    try {
      const response = await fetch("/api/admin/sondages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, question, description, options }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Création impossible.");
      setTitle(""); setQuestion(""); setDescription(""); setPeople("");
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Création impossible."); }
    finally { setBusy(false); }
  }

  async function toggle(id: string, isOpen: boolean) {
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/sondages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_open: !isOpen }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Modification impossible.");
      router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Modification impossible."); }
    finally { setBusy(false); }
  }

  async function copy(id: string) {
    try { await navigator.clipboard.writeText(`${window.location.origin}/sondages/${id}`); setCopied(id); }
    catch { setError("Copie impossible. Ouvrez le lien et copiez l’adresse du navigateur."); }
  }

  return <div className="mx-auto max-w-6xl space-y-8 p-5 sm:p-8">
    <div><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Espace administrateur</p><h1 className="mt-2 text-3xl font-black text-[#0b3d38]">Sondages des membres</h1><p className="mt-2 text-slate-600">Créez un lien de vote pour une cérémonie. Seuls les membres connectés avec leur compte SOBUP peuvent répondre.</p></div>
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={create} className="h-fit space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[#065e52]"><Plus className="h-5 w-5" /><h2 className="text-xl font-bold">Créer un sondage</h2></div>
        <label className="block text-sm font-semibold">Titre de la cérémonie *<input className={field} value={title} onChange={e => setTitle(e.target.value)} maxLength={160} minLength={3} required placeholder="Ex. : Prix du mérite 2026" /></label>
        <label className="block text-sm font-semibold">Question posée aux membres *<input className={field} value={question} onChange={e => setQuestion(e.target.value)} maxLength={300} minLength={3} required placeholder="Pour qui souhaitez-vous voter ?" /></label>
        <label className="block text-sm font-semibold">Présentation (facultative)<textarea className={field} value={description} onChange={e => setDescription(e.target.value)} maxLength={1000} rows={3} /></label>
        <label className="block text-sm font-semibold">Personnes proposées *<textarea className={field} value={people} onChange={e => setPeople(e.target.value)} rows={6} required placeholder="Un nom par ligne" /><span className="mt-1 block text-xs font-normal text-slate-500">Un nom par ligne, 2 à 30 personnes. La liste est figée après création pour préserver les votes.</span></label>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-[#065e52] px-5 py-3.5 font-bold text-white hover:bg-[#0b3d38] disabled:opacity-60">{busy ? "En cours…" : "Créer et générer le lien"}</button>
      </form>
      <section aria-label="Sondages créés" className="space-y-5">
        {!initialSurveys.length && <p className="rounded-2xl border border-slate-200 bg-white p-7 text-slate-600">Aucun sondage créé pour le moment.</p>}
        {initialSurveys.map(survey => <article key={survey.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-[#0b3d38]">{survey.title}</h2><p className="mt-1 text-sm text-slate-600">{survey.question}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${survey.is_open ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{survey.is_open ? "Ouvert" : "Fermé"}</span></div>
          <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => copy(survey.id)} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"><Copy className="h-4 w-4" />{copied === survey.id ? "Lien copié" : "Copier le lien"}</button><a href={`/sondages/${survey.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold">Ouvrir <ExternalLink className="h-4 w-4" /></a><button type="button" disabled={busy} onClick={() => toggle(survey.id, survey.is_open)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-60">{survey.is_open ? "Clore le vote" : "Rouvrir le vote"}</button></div>
          <div className="mt-6 grid gap-5 md:grid-cols-2"><div><h3 className="font-bold text-[#0b3d38]">Résultats</h3><p className="mt-1 text-sm text-slate-500">{survey.votes.length} vote{survey.votes.length > 1 ? "s" : ""}</p><ul className="mt-3 space-y-2">{survey.options.map(option => { const count = survey.votes.filter(v => v.option_id === option.id).length; return <li key={option.id} className="flex justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm"><span>{option.label}</span><strong>{count}</strong></li>; })}</ul></div>
            <div><h3 className="flex items-center gap-2 font-bold text-[#0b3d38]"><Users className="h-4 w-4" />Qui a voté pour qui</h3>{!survey.votes.length ? <p className="mt-3 text-sm text-slate-500">Aucune réponse pour le moment.</p> : <ul className="mt-3 max-h-64 space-y-2 overflow-auto">{survey.votes.map(vote => <li key={vote.user_id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm"><strong>{vote.name}</strong><span className="text-slate-500"> → {survey.options.find(o => o.id === vote.option_id)?.label ?? "Option inconnue"}</span><span className="mt-1 block break-all text-xs text-slate-400">Compte : {vote.user_id}</span></li>)}</ul>}</div></div>
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">Les détails des votes ne sont visibles que dans l’administration. Les membres ne voient pas les choix des autres.</p>
        </article>)}
      </section>
    </div>
  </div>;
}
