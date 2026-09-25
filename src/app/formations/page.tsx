import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock, GraduationCap, Layers, Laptop } from "lucide-react";
import PageHero from "@/components/PageHero";
import { FORMATIONS } from "@/data/formations";

export const metadata: Metadata = {
  title: "Formations",
  description: "Découvrez les formations de la SOBUP, consultez leurs programmes et leurs modalités, puis déposez votre candidature en ligne.",
  alternates: { canonical: "/formations" },
};

export default function FormationsPage() {
  return (
    <div className="min-h-[70vh] bg-[#f7faf9]">
      <PageHero
        title="Nos formations"
        subtitle="Développez vos compétences, enrichissez votre pratique et donnez vie à vos projets avec la SOBUP."
        tag="Apprendre et progresser"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Formations" }]}
      />

      <section aria-labelledby="catalogue-title" className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="catalogue-title" className="text-2xl font-black text-[#0b3d38] sm:text-3xl">Explorez nos formations</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">Découvrez le programme, les informations pratiques et les modalités de candidature de chaque formation.</p>
          </div>
          <span className="rounded-full border border-[#065e52]/15 bg-white px-4 py-2 text-xs font-semibold text-[#065e52]">
            {FORMATIONS.length} formation{FORMATIONS.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FORMATIONS.map((formation) => (
            <Link
              key={formation.slug}
              href={`/formations/${formation.slug}`}
              aria-label={`Découvrir la formation ${formation.title}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#31b9ae] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#08796c]"
            >
              <div className="relative overflow-hidden bg-[#0b3d38] p-7 text-white">
                <div aria-hidden="true" className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[35px] border-white/5" />
                <div className="relative flex items-center justify-between gap-3">
                  <GraduationCap aria-hidden="true" className="h-9 w-9 text-[#7eeae4]" />
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">{formation.category}</span>
                </div>
                <h3 className="relative mt-8 text-3xl font-black tracking-tight">{formation.title}</h3>
                <p className="relative mt-2 text-sm text-white/70">{formation.subtitle}</p>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-sm leading-relaxed text-slate-600">{formation.description}</p>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2.5"><Laptop aria-hidden="true" className="h-4 w-4 shrink-0 text-[#08796c]" />{formation.format}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    <p className="flex items-center gap-2.5"><Layers aria-hidden="true" className="h-4 w-4 text-[#08796c]" />{formation.modules} modules indépendants</p>
                    <p className="flex items-center gap-2.5"><Clock aria-hidden="true" className="h-4 w-4 text-[#08796c]" />{formation.hours} h au total</p>
                  </div>
                  <p className="flex items-center gap-2.5"><CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-[#08796c]" />{formation.schedule}</p>
                </div>
                <div className="mt-auto pt-7">
                  <span className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5 text-sm font-bold text-[#065e52]">
                    Découvrir la formation
                    <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
