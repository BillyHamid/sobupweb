import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Award, ClipboardCheck, GraduationCap, Laptop, Users } from "lucide-react";
import { THORACOSCOPY_DATES, THORACOSCOPY_PROFESSIONS, THORACOSCOPY_REGISTRATION_OPENS_AT } from "@/lib/formations";
import ApplicationForm from "../ApplicationForm";

export const metadata: Metadata = {
  title: "Thoracoscopie médicale — Formation SOBUP",
  description: "Formation SOBUP en thoracoscopie médicale : préparation en ligne, initiation du 7 au 11 décembre 2026 à Ouagadougou et consolidation pratique dès janvier 2027.",
  alternates: { canonical: "/formations/thoracoscopie-medicale" },
};

export const dynamic = "force-dynamic";

const phases = [
  { number: "01", title: "Préparation en ligne", date: THORACOSCOPY_DATES.preparation, detail: "Réunion Zoom pour présenter les étapes du parcours et les conditions de travail." },
  { number: "02", title: "Initiation à Ouagadougou", date: `Du ${THORACOSCOPY_DATES.initiation}`, detail: "Cinq jours : trois jours de théorie, une journée de pratique sur modèles et une journée de stage observationnel." },
  { number: "03", title: "Consolidation pratique", date: THORACOSCOPY_DATES.consolidation, detail: "Cinq séminaires pratiques de cinq jours au CHU de Tengandogo et au CHU Yalgado Ouédraogo, suivis d’une évaluation des compétences." },
];

export default function ThoracoscopieMedicalePage() {
  const applicationsOpen = Date.now() >= THORACOSCOPY_REGISTRATION_OPENS_AT;
  return (
    <div className="bg-[#faf8f9] text-slate-800">
      <section className="relative overflow-hidden bg-[#512638] text-white">
        <div className="pointer-events-none absolute -right-28 -top-40 h-[600px] w-[600px] rounded-full border-[80px] border-white/[0.035]" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
          <nav aria-label="Fil d’Ariane" className="mb-10 flex flex-wrap gap-3 text-sm text-white/65"><Link href="/" className="hover:text-white">Accueil</Link><span>/</span><Link href="/formations" className="hover:text-white">Formations</Link><span>/</span><span aria-current="page" className="text-white">Thoracoscopie médicale</span></nav>
          <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div><p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#f7c6d9]">Formation pratique · Trois phases</p><h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Thoracoscopie <span className="text-[#f7c6d9]">médicale</span></h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">Un parcours progressif, de la préparation en ligne à la maîtrise du geste grâce à des séminaires pratiques supervisés.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#candidature" className="inline-flex items-center gap-3 rounded-xl bg-[#e67e22] px-6 py-3.5 font-bold text-white transition hover:bg-[#ce6c18]">Déposer ma candidature <ArrowUpRight className="h-5 w-5" /></a><a href="#programme" className="inline-flex items-center gap-3 rounded-xl border border-white/25 px-6 py-3.5 font-bold hover:bg-white/10">Découvrir le parcours <ArrowDown className="h-4 w-4" /></a></div></div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 sm:p-9"><GraduationCap className="mb-6 h-10 w-10 text-[#f7c6d9]" /><p className="text-2xl font-bold">Une cohorte de dix participants.</p><p className="mt-4 leading-relaxed text-white/70">La sélection se fait sur dossier. La formation comprend une initiation de cinq jours, puis cinq séminaires pratiques de consolidation.</p><div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/15 pt-6">{[["3", "phases"], ["5 jours", "d’initiation"], ["10", "places"]].map(([value, label]) => <div key={label}><p className="text-xl font-black text-[#f7c6d9] sm:text-2xl">{value}</p><p className="mt-1 text-xs text-white/65">{label}</p></div>)}</div></div>
          </div>
          <p className="mt-12 max-w-3xl border-t border-white/15 pt-6 text-sm leading-relaxed text-white/70">Une formation de la Société Burkinabè de Pneumologie (SOBUP) destinée aux pneumologues, chirurgiens et médecins en spécialisation concernés.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-5 py-14 sm:px-8 sm:py-20">
        <section className="grid gap-8 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8b3452]">Le parcours</p><h2 className="mt-3 text-3xl font-black text-[#512638]">Apprendre, pratiquer, consolider.</h2></div><div className="space-y-4 leading-relaxed text-slate-600"><p>La formation associe une réunion préparatoire, une initiation à Ouagadougou et une pratique accompagnée dans deux sites de pleuroscopie.</p><p>La phase de consolidation vise l’acquisition de la maîtrise du geste, avec la réalisation d’au moins cinq pleuroscopies et une évaluation finale des compétences.</p></div></section>
        <section id="programme" className="scroll-mt-24"><p className="text-xs font-bold uppercase tracking-widest text-[#8b3452]">Programme</p><h2 className="mt-3 text-3xl font-black text-[#512638]">Trois phases complémentaires.</h2><div className="mt-8 grid gap-5 lg:grid-cols-3">{phases.map(phase => <article key={phase.number} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7"><p className="text-xs font-black uppercase tracking-widest text-[#8b3452]">Phase {phase.number}</p><h3 className="mt-4 text-xl font-bold text-[#512638]">{phase.title}</h3><p className="mt-3 font-semibold text-[#8b3452]">{phase.date}</p><p className="mt-4 text-sm leading-relaxed text-slate-600">{phase.detail}</p></article>)}</div></section>
        <section className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl bg-[#f4e6ec] p-7"><Laptop className="h-7 w-7 text-[#8b3452]" /><h2 className="mt-4 text-xl font-bold text-[#512638]">Une progression encadrée</h2><p className="mt-3 leading-relaxed text-slate-600">Après les exposés et démonstrations, les participants s’exercent sur modèles, observent les procédures, puis participent aux séminaires pratiques dans les deux CHU.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-7"><Award className="h-7 w-7 text-[#8b3452]" /><h2 className="mt-4 text-xl font-bold text-[#512638]">Mentorat et accompagnement</h2><p className="mt-3 leading-relaxed text-slate-600">Le projet prévoit aussi un appui aux structures souhaitant installer une unité de thoracoscopie médicale.</p></div></section>
        <section><p className="text-xs font-bold uppercase tracking-widest text-[#8b3452]">Public concerné</p><h2 className="mt-3 text-3xl font-black text-[#512638]">Qui peut candidater ?</h2><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{THORACOSCOPY_PROFESSIONS.map(profession => <div key={profession} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><Users className="h-5 w-5 shrink-0 text-[#8b3452]" /><span className="font-medium">{profession}</span></div>)}</div><p className="mt-4 text-sm text-slate-600">Première cohorte : 10 participants, retenus après sélection de leur dossier.</p></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9"><ClipboardCheck className="h-7 w-7 text-[#8b3452]" /><p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#8b3452]">Frais de participation</p><h2 className="mt-2 text-3xl font-black text-[#512638]">250 000 FCFA par participant</h2><p className="mt-4 max-w-3xl leading-relaxed text-slate-600">La formation est financée par le participant ou par son institution.</p></section>
        <section id="candidature" className="grid scroll-mt-24 gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8b3452]">Candidature en ligne</p><h2 className="mt-3 text-3xl font-black text-[#512638]">Rejoindre la première cohorte.</h2><p className="mt-5 max-w-md leading-relaxed text-slate-600">Inscriptions ouvertes à partir du {THORACOSCOPY_DATES.registration}. Indiquez vos coordonnées, votre profil et votre établissement, puis joignez votre CV.</p><p className="mt-4 text-sm text-slate-500">Pour toute question : (+226) 75 65 17 66 / 70 24 12 24.</p></div>{applicationsOpen ? <ApplicationForm formation="thoracoscopie-medicale" /> : <div className="rounded-2xl border border-[#e5cad4] bg-white p-8"><p className="text-lg font-bold text-[#512638]">Ouverture des candidatures le {THORACOSCOPY_DATES.registration}</p><p className="mt-3 leading-relaxed text-slate-600">Le formulaire de dépôt sera disponible ici à partir de cette date.</p></div>}</section>
      </div>
    </div>
  );
}
