import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Award, Check, Clock, Laptop, ScanLine, Users } from "lucide-react";
import { ECHOT_DATES } from "@/lib/formations";
import ApplicationForm from "../ApplicationForm";

export const metadata: Metadata = {
  title: "Échographie thoracique — Formation SOBUP",
  description: "Formation hybride en échographie thoracique pour pneumologues, internes et résidents : théorie en ligne, quatre jours de pratique supervisée et mentorat.",
  alternates: { canonical: "/formations/echographie-thoracique" },
};

const competencies = [
  "Réaliser un examen échographique thoracique systématique et reconnaître l’aspect normal",
  "Identifier un épanchement pleural, un pneumothorax, un syndrome interstitiel, une condensation et une dysfonction diaphragmatique",
  "Repérer un site sûr avant une ponction pleurale",
  "Rédiger un compte rendu structuré et intégrer les résultats au contexte clinique",
];

const practice = [
  { day: "Jour 1", title: "Appareil et examen normal", details: "Sondes, réglages, optimisation de l’image, examen systématique, paroi, plèvre, glissement pleural, lignes A et diaphragme." },
  { day: "Jour 2", title: "Plèvre", details: "Détection, caractérisation et estimation d’un épanchement pleural ; recherche échographique d’un pneumothorax." },
  { day: "Jour 3", title: "Parenchyme et diaphragme", details: "Lignes B, syndrome interstitiel, condensations, bronchogrammes, atélectasie et fonction diaphragmatique." },
  { day: "Jour 4", title: "Intégration et évaluation", details: "Examen complet, repérage avant ponction, cas cliniques, interprétation, compte rendu et évaluation individuelle." },
];

export default function EchographieThoraciquePage() {
  return (
    <div className="bg-[#f7faf9] text-slate-800">
      <section className="relative overflow-hidden bg-[#0b3d38] text-white">
        <div className="pointer-events-none absolute -right-24 -top-32 h-[540px] w-[540px] rounded-full border-[70px] border-white/[0.04]" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
          <nav aria-label="Fil d’Ariane" className="mb-10 flex flex-wrap gap-3 text-sm text-white/65"><Link href="/" className="hover:text-white">Accueil</Link><span>/</span><Link href="/formations" className="hover:text-white">Formations</Link><span>/</span><span aria-current="page" className="text-white">Échographie thoracique</span></nav>
          <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#7eeae4]">Formation hybride · Pratique clinique</p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Échographie <span className="text-[#7eeae4]">thoracique</span></h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">Apprenez à réaliser, interpréter et intégrer une échographie thoracique de base dans votre pratique, avec un entraînement supervisé en petit groupe.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#inscription" className="inline-flex items-center gap-3 rounded-xl bg-[#e67e22] px-6 py-3.5 font-bold text-white transition hover:bg-[#ce6c18]">Modalités d’inscription <ArrowUpRight className="h-5 w-5" /></a>
                <a href="#programme" className="inline-flex items-center gap-3 rounded-xl border border-white/25 px-6 py-3.5 font-bold hover:bg-white/10">Voir le programme <ArrowDown className="h-4 w-4" /></a>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 sm:p-9">
              <ScanLine className="mb-6 h-10 w-10 text-[#7eeae4]" />
              <p className="text-2xl font-bold">De l’image au geste clinique.</p>
              <p className="mt-4 leading-relaxed text-white/70">Une théorie à suivre en ligne, puis quatre journées de pratique et un mentorat pour consolider les acquis.</p>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/15 pt-6">
                {[["4 jours", "par session"], ["5", "sessions"], ["25", "places maximum"]].map(([value, label]) => <div key={label}><p className="text-xl font-black text-[#7eeae4] sm:text-2xl">{value}</p><p className="mt-1 text-xs text-white/65">{label}</p></div>)}
              </div>
            </div>
          </div>
          <p className="mt-12 max-w-3xl border-t border-white/15 pt-6 text-sm leading-relaxed text-white/70">Une formation organisée par la Société Burkinabè de Pneumologie (SOBUP), destinée aux pneumologues, internes et résidents en pneumologie.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-5 py-14 sm:px-8 sm:py-20">
        <section className="grid gap-8 lg:grid-cols-2">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Objectif de la formation</p><h2 className="mt-3 text-3xl font-black text-[#0b3d38]">Une échographie utile au lit du patient.</h2></div>
          <div className="space-y-4 leading-relaxed text-slate-600"><p>Non irradiante et répétable, l’échographie thoracique complète l’examen clinique dans l’exploration de la plèvre, du poumon périphérique et du diaphragme.</p><p>Le parcours associe connaissances théoriques, sémiologie, manipulation de l’échographe, pratique supervisée et suivi après les ateliers.</p></div>
        </section>

        <section aria-labelledby="competences-title"><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Compétences attendues</p><h2 id="competences-title" className="mt-3 text-3xl font-black text-[#0b3d38]">Ce que vous saurez faire.</h2><div className="mt-7 grid gap-4 md:grid-cols-2">{competencies.map(item => <div key={item} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#08796c]" /><p className="leading-relaxed text-slate-700">{item}</p></div>)}</div></section>

        <section id="programme" className="scroll-mt-24"><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Le programme</p><h2 className="mt-3 text-3xl font-black text-[#0b3d38]">De la théorie à la pratique.</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-[#e8f3ef] p-7"><Laptop className="h-7 w-7 text-[#08796c]" /><h3 className="mt-4 text-xl font-bold text-[#0b3d38]">Théorie en ligne</h3><p className="mt-3 leading-relaxed text-slate-600">Une réunion d’information présente le parcours. Les participants suivent ensuite la formation théorique en ligne et doivent la valider avant la pratique. Une réunion préparatoire répond aux questions avant les ateliers.</p><p className="mt-4 text-sm font-semibold text-[#065e52]">Dès le {ECHOT_DATES.onlineStart} · Accès en continu pendant deux mois.</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-7"><Users className="h-7 w-7 text-[#08796c]" /><h3 className="mt-4 text-xl font-bold text-[#0b3d38]">Pratique en petit groupe</h3><p className="mt-3 leading-relaxed text-slate-600">Cinq sessions successives de quatre jours, avec cinq participants par session. Trois formateurs seront retenus à l’issue d’un appel à candidatures.</p><p className="mt-4 text-sm font-semibold text-[#065e52]">Dès le {ECHOT_DATES.practiceStart} · 25 participants maximum.</p></div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{practice.map(item => <article key={item.day} className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-xs font-black uppercase tracking-widest text-[#08796c]">{item.day}</p><h3 className="mt-3 text-lg font-bold text-[#0b3d38]">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.details}</p></article>)}</div>
          <p className="mt-4 text-sm text-slate-500">Le déroulement des ateliers pourra être adapté aux situations cliniques rencontrées afin de préserver le temps de pratique de chaque participant.</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7"><Award className="h-7 w-7 text-[#08796c]" /><h2 className="mt-4 text-xl font-bold text-[#0b3d38]">Évaluation et attestation</h2><p className="mt-3 leading-relaxed text-slate-600">La validation tient compte du cours en ligne, de l’observation pendant les ateliers, d’une grille individuelle de compétences et d’un examen thoracique commenté avec compte rendu. Une attestation de formation pratique est délivrée aux participants ayant satisfait aux exigences.</p></div>
          <div className="rounded-2xl bg-[#e8f3ef] p-7"><Clock className="h-7 w-7 text-[#08796c]" /><h2 className="mt-4 text-xl font-bold text-[#0b3d38]">Mentorat après les ateliers</h2><p className="mt-3 leading-relaxed text-slate-600">Un suivi d’environ trois mois aide à consolider la pratique : carnet d’examens, partage sécurisé de cas anonymisés, retours des formateurs et discussions périodiques.</p></div>
        </section>

        <section id="inscription" className="scroll-mt-24"><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Participation</p><h2 className="mt-3 text-3xl font-black text-[#0b3d38]">Tarifs et candidature.</h2><div className="mt-7 grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">Membres SOBUP à jour de cotisation</p><p className="mt-2 text-3xl font-black text-[#065e52]">40 000 FCFA</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">Autres participants</p><p className="mt-2 text-3xl font-black text-[#065e52]">70 000 FCFA</p></div></div><p className="mt-5 max-w-3xl leading-relaxed text-slate-600">Les frais couvrent les quatre jours de pratique, les supports, les consommables d’atelier, les évaluations, le mentorat et l’attestation. Le déplacement et l’hébergement restent à la charge des participants.</p></section>
        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Candidature en ligne</p><h2 className="mt-3 text-3xl font-black text-[#0b3d38]">Rejoignez une session pratique.</h2><p className="mt-5 max-w-md leading-relaxed text-slate-600">Renseignez vos coordonnées et joignez votre CV. La candidature est ouverte aux pneumologues, internes et résidents en pneumologie, dans la limite de 25 places.</p></div><ApplicationForm formation="echographie-thoracique" /></section>
      </div>
    </div>
  );
}
