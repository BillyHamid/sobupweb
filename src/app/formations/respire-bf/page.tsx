import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, Clock, GraduationCap, Laptop, FileCheck2 } from "lucide-react";
import { RESPIRE_MODULES } from "@/lib/formations";
import ApplicationForm from "../ApplicationForm";

export const metadata: Metadata = {
  title: "RESPIRE-BF — Formation en recherche",
  description: "RESPIRE-BF : trois modules pratiques en recherche, publication scientifique et montage de projets. Découvrez le programme et déposez votre candidature sur SOBUP online.",
  alternates: { canonical: "/formations/respire-bf" },
};

export default function RespireFormationPage() {
  return (
    <div className="bg-[#f7faf9] text-slate-800">
      <section className="relative overflow-hidden bg-[#0b3d38] text-white">
        <div className="pointer-events-none absolute -right-28 -top-40 h-[600px] w-[600px] rounded-full border-[80px] border-white/[0.035]" />
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-20">
          <nav aria-label="Fil d’Ariane" className="mb-10 flex flex-wrap gap-3 text-sm text-white/60"><Link href="/" className="hover:text-white">Accueil</Link><span>/</span><Link href="/formations" className="hover:text-white">Formations</Link><span>/</span><span aria-current="page" className="text-white">RESPIRE-BF</span></nav>
          <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#7eeae4]">Formation hybride · Recherche en santé</p>
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl">RESPIRE<span className="text-[#7eeae4]">-BF</span></h1>
              <p className="mt-5 max-w-xl text-xl font-semibold leading-relaxed sm:text-2xl">De votre question de terrain<br className="hidden sm:block" /> à un projet scientifique abouti.</p>
              <p className="mt-5 max-w-xl leading-relaxed text-white/70">Renforcement Scientifique Pratique et Intégré pour la Recherche en santé respiratoire au Burkina Faso.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#candidature" className="inline-flex items-center gap-3 rounded-xl bg-[#e67e22] px-6 py-3.5 font-bold text-white transition hover:bg-[#ce6c18]">Déposer ma candidature <ArrowUpRight className="h-5 w-5" /></a>
                <a href="#programme" className="inline-flex items-center gap-3 rounded-xl border border-white/25 px-6 py-3.5 font-bold hover:bg-white/10">Les trois modules <ArrowDown className="h-4 w-4" /></a>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 sm:p-9">
              <GraduationCap className="mb-6 h-9 w-9 text-[#7eeae4]" />
              <p className="text-2xl font-bold">Votre projet au cœur<br />de la formation.</p>
              <p className="mt-4 leading-relaxed text-white/70">Un, deux ou trois modules : construisez votre parcours et travaillez sur votre propre sujet, accompagné par les formateurs.</p>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/15 pt-6">
                {[["3", "modules"], ["99 h", "au total"], ["80 %", "de pratique"]].map(([value, label]) => <div key={label}><p className="text-2xl font-black text-[#7eeae4]">{value}</p><p className="mt-1 text-xs text-white/65">{label}</p></div>)}
              </div>
            </div>
          </div>
          <p className="mt-12 max-w-3xl border-t border-white/15 pt-6 text-sm leading-relaxed text-white/65">Une formation portée par la Société Burkinabè de Pneumologie (SOBUP) et le Département de Santé Publique de l’Université Joseph KI-ZERBO.</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl space-y-16 px-5 py-14 sm:px-8 sm:py-20">
        <section className="grid gap-8 lg:grid-cols-2">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Apprendre en produisant</p><h2 className="mt-3 text-3xl font-black text-[#0b3d38]">Une formation ancrée<br />dans votre pratique.</h2></div>
          <div className="space-y-4 leading-relaxed text-slate-600"><p>RESPIRE-BF accompagne les professionnels de santé dans la conception, la rédaction et la valorisation de leurs travaux de recherche en santé respiratoire et en santé publique.</p><p>Médecins, pneumologues, internes, résidents, professionnels de santé publique, enseignants-chercheurs, étudiants en master ou doctorat, pharmaciens, biologistes et paramédicaux impliqués dans la recherche : ce parcours s’adresse à vous.</p></div>
        </section>
        <section id="programme" className="scroll-mt-24">
          <p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Le programme</p><h2 className="mt-3 text-3xl font-black text-[#0b3d38]">Trois modules. Votre parcours.</h2><p className="mt-3 text-slate-600">Chaque module est autonome. Vous pouvez en choisir un, deux ou suivre les trois.</p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {RESPIRE_MODULES.map((module) => <article key={module.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between"><span className="rounded-lg bg-[#e8f9f7] px-3 py-1.5 text-xs font-black tracking-wider text-[#065e52]">MODULE 0{module.id}</span><span className="flex items-center gap-1.5 text-sm text-slate-500"><Clock className="h-4 w-4" />{module.hours} h</span></div>
              <h3 className="mt-6 text-2xl font-bold text-[#0b3d38]">{module.title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{module.description}</p>
              <p className="mt-5 text-sm font-semibold">{module.weeks} semaines</p><p className="mt-1 text-xs text-slate-500">{module.online}</p>
              <ul className="my-6 space-y-3 text-sm">{module.topics.map(topic => <li key={topic} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#08796c]" />{topic}</li>)}</ul>
              <div className="mt-auto rounded-xl bg-[#f0f7f5] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#08796c]">Votre livrable</p><p className="mt-2 text-sm leading-relaxed">{module.outcome}</p></div>
            </article>)}
          </div>
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-[#e8f3ef] p-7"><Laptop className="h-7 w-7 text-[#08796c]" /><h2 className="mt-4 text-xl font-bold text-[#0b3d38]">En ligne, puis ensemble en atelier</h2><p className="mt-3 leading-relaxed text-slate-600">Vidéos courtes, lectures, exercices et échanges en ligne préparent deux journées intensives en présentiel par module. Relecture entre pairs, mentorat et usage critique de l’IA accompagnent votre travail.</p><p className="mt-4 text-sm font-semibold text-[#065e52]">Dates et lieu des ateliers : à venir.</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7"><FileCheck2 className="h-7 w-7 text-[#08796c]" /><h2 className="mt-4 text-xl font-bold text-[#0b3d38]">Un certificat pour chaque module validé</h2><p className="mt-3 leading-relaxed text-slate-600">La validation repose sur les exercices, la participation, les relectures et le livrable final. Une présence d’au moins 80 % et une note supérieure à 12/20 au livrable final sont requises.</p><p className="mt-4 text-sm text-slate-600">Le certificat RESPIRE-BF complet est délivré après validation des trois modules et de leurs trois livrables.</p></div>
        </section>
        <section><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Frais de formation</p><h2 className="mt-3 text-3xl font-black text-[#0b3d38]">Choisissez la formule qui vous convient.</h2>
          <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><caption className="sr-only">Tarifs RESPIRE-BF par personne en francs CFA</caption><thead className="bg-[#0b3d38] text-white"><tr><th scope="col" className="p-4 sm:p-5">Catégorie</th><th scope="col" className="p-4 sm:p-5">Par module</th><th scope="col" className="p-4 sm:p-5">Les 3 modules</th></tr></thead><tbody>{[["Membres SOBUP à jour de cotisation", "50 000", "130 000"], ["Non membres SOBUP", "75 000", "200 000"], ["Inscriptions institutionnelles", "100 000", "270 000"]].map(row => <tr key={row[0]} className="border-t border-slate-100"><th scope="row" className="p-4 font-medium sm:p-5">{row[0]}</th><td className="whitespace-nowrap p-4 sm:p-5">{row[1]} FCFA</td><td className="whitespace-nowrap p-4 font-bold text-[#065e52] sm:p-5">{row[2]} FCFA</td></tr>)}</tbody></table></div>
          <p className="mt-3 text-sm text-slate-500">Tarifs par personne. Le dépôt de candidature ne constitue ni un paiement ni une confirmation d’admission.</p>
        </section>
        <section id="candidature" className="grid scroll-mt-24 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Candidature en ligne</p><h2 className="mt-3 text-3xl font-black text-[#0b3d38]">Votre prochain projet<br />commence ici.</h2><p className="mt-5 max-w-md leading-relaxed text-slate-600">Indiquez vos coordonnées, choisissez vos modules et joignez votre CV. Vous pouvez également ajouter une lettre de motivation.</p><p className="mt-4 max-w-md text-sm leading-relaxed text-slate-500">Aucun compte n’est nécessaire. Vos coordonnées et documents sont réservés à l’équipe chargée des candidatures RESPIRE-BF.</p></div>
          <ApplicationForm />
        </section>
      </div>
    </div>
  );
}
