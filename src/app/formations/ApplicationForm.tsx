"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { MAX_APPLICATION_FILE_SIZE, RESPIRE_MODULES, PROFESSIONS } from "@/lib/formations";

export default function ApplicationForm() {
  const [modules, setModules] = useState<number[]>([]);
  const [profession, setProfession] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [warning, setWarning] = useState("");
  const submitting = useRef(false);
  const requestId = useRef<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError("");
    if (!modules.length) { setError("Choisissez au moins un module."); return; }
    const data = new FormData(event.currentTarget);
    const cv = data.get("cv");
    if (cv instanceof File && cv.size > MAX_APPLICATION_FILE_SIZE) { setError("Votre CV doit peser au maximum 2 Mo."); return; }
    requestId.current ??= crypto.randomUUID();
    data.set("requestId", requestId.current);
    data.set("modules", JSON.stringify(modules));
    submitting.current = true;
    setPending(true);
    try {
      const response = await fetch("/api/formations/candidatures", { method: "POST", body: data });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.reference) throw new Error(result?.error || "L’envoi n’a pas pu être confirmé. Réessayez avec les mêmes informations.");
      setWarning(result.warning ?? "");
      setReference(result.reference);
    } catch (err) { setError(err instanceof Error ? err.message : "Envoi impossible. Réessayez."); }
    finally { submitting.current = false; setPending(false); }
  }

  if (reference) return <div role="status" className="rounded-2xl border border-emerald-200 bg-white p-8"><CheckCircle2 className="h-10 w-10 text-emerald-600" /><h3 className="mt-4 text-2xl font-bold text-[#0b3d38]">Candidature enregistrée</h3><p className="mt-3 leading-relaxed text-slate-600">Votre dossier a bien été transmis à l’équipe RESPIRE-BF. Un accusé de réception vient de vous être envoyé par email. Conservez votre référence pour vos échanges avec la SOBUP.</p><p className="mt-5 break-all rounded-lg bg-slate-50 p-4 font-mono text-sm">{reference}</p>{warning && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{warning}</p>}<p className="mt-4 text-sm text-slate-500">Modules demandés : {modules.slice().sort().join(", ")}. Le dépôt ne vaut pas confirmation d’admission.</p></div>;
  const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#08796c] focus:ring-2 focus:ring-[#08796c]/20";
  return <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
    <fieldset disabled={pending} className="space-y-6 disabled:opacity-70">
      <legend className="sr-only">Candidature RESPIRE-BF</legend>
      <p className="text-sm text-slate-500">Les champs marqués d’un astérisque sont obligatoires.</p>
      <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold">Nom *<input name="nom" autoComplete="family-name" required maxLength={100} className={inputClass} /></label><label className="text-sm font-semibold">Prénom *<input name="prenom" autoComplete="given-name" required maxLength={100} className={inputClass} /></label></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">Téléphone (WhatsApp) *<input name="telephone" type="tel" autoComplete="tel" required maxLength={40} placeholder="+226 XX XX XX XX" className={inputClass} /><span className="mt-2 block text-xs font-normal text-slate-500">Numéro joignable sur WhatsApp.</span></label>
        <label className="text-sm font-semibold">Email *<input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="vous@exemple.com" className={inputClass} /><span className="mt-2 block text-xs font-normal text-slate-500">Votre accusé de réception y sera envoyé.</span></label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">Profession *<select name="profession" required value={profession} onChange={e => setProfession(e.target.value)} className={inputClass}><option value="">Choisissez…</option>{PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}</select></label>
        <label className="text-sm font-semibold">Spécialité {profession === "Médecin spécialiste" ? "*" : ""}<input name="specialite" required={profession === "Médecin spécialiste"} maxLength={120} placeholder="Ex. : Pneumologie" className={inputClass} /><span className="mt-2 block text-xs font-normal text-slate-500">{profession === "Médecin spécialiste" ? "Obligatoire pour un médecin spécialiste." : "Facultatif — votre domaine principal."}</span></label>
      </div>
      <label className="block text-sm font-semibold">Lieu d’exercice *<input name="lieuExercice" required maxLength={160} placeholder="Ex. : CHU Yalgado Ouédraogo, Ouagadougou" className={inputClass} /><span className="mt-2 block text-xs font-normal text-slate-500">Établissement et ville. Étudiant(e) : indiquez votre faculté.</span></label>
      <fieldset className="space-y-3"><legend className="text-sm font-semibold">Module(s) souhaité(s) *</legend>
        <p className="mb-3 text-xs text-slate-500">Plusieurs choix possibles : cochez autant de modules que vous le souhaitez.</p>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#e8f9f7] p-4 text-sm font-bold text-[#065e52]"><input type="checkbox" checked={modules.length === 3} onChange={e => setModules(e.target.checked ? [1, 2, 3] : [])} className="h-4 w-4 accent-[#08796c]" />Tous les trois — parcours complet</label>
        {RESPIRE_MODULES.map(module => <label key={module.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm"><input type="checkbox" checked={modules.includes(module.id)} onChange={e => setModules(e.target.checked ? [...modules, module.id] : modules.filter(id => id !== module.id))} className="h-4 w-4 shrink-0 accent-[#08796c]" /><span><span className="font-semibold">Module {module.id}</span> · {module.title}</span></label>)}
      </fieldset>
      <label className="block text-sm font-semibold">Votre CV *<input type="file" name="cv" required accept=".pdf,.doc,.docx" className="mt-2 block w-full min-w-0 rounded-xl border border-dashed border-slate-300 p-3 text-xs font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-[#e8f9f7] file:px-3 file:py-2 file:font-semibold file:text-[#065e52]" /><span className="mt-2 block text-xs font-normal text-slate-500">PDF, DOC ou DOCX · 2 Mo maximum.</span></label>
      <div className="hidden" aria-hidden="true"><label>Site internet<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="text-xs leading-relaxed text-slate-500">En soumettant ce formulaire, vous transmettez vos coordonnées et documents à la SOBUP pour l’examen de votre candidature et le suivi de votre demande.</p>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={pending} className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#065e52] px-5 py-4 font-bold text-white hover:bg-[#0b3d38] disabled:cursor-wait">{pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}{pending ? "Envoi en cours…" : "Envoyer ma candidature"}</button>
    </fieldset>
  </form>;
}
