import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, GraduationCap } from "lucide-react";
import { FORMATIONS } from "@/data/formations";

export default function MesFormationsPage() {
  return (
    <section className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">Espace membre</p>
        <h1 className="mt-2 text-3xl font-black text-[#0b3d38]">Formations SOBUP</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Découvrez les formations disponibles et consultez les modalités de candidature. Les candidatures ne sont pas encore suivies dans cet espace.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {FORMATIONS.map((formation) => (
          <article key={formation.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] bg-[#0b3d38]">
              <Image src={formation.image} alt={`Affiche de la formation ${formation.title}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#08796c]"><GraduationCap className="h-4 w-4" />{formation.category}</div>
              <h2 className="mt-3 text-2xl font-black text-[#0b3d38]">{formation.title}</h2>
              <p className="mt-2 text-slate-600">{formation.description}</p>
              <p className="mt-4 flex items-start gap-2 text-sm text-slate-600"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#08796c]" />{formation.schedule}</p>
              <Link href={`/formations/${formation.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#065e52] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0b3d38]">Voir la formation et candidater <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
