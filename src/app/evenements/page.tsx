"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { X, Calendar, MapPin, Users } from "lucide-react";

type Event = {
  id: string;
  type: string;
  date: string;
  location: string;
  title: string;
  desc: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  gtt?: string;
  image: string;
  hasPage: boolean;
};

const events: Event[] = [
  {
    id: "epu-environnement-travail",
    type: "EPU",
    date: "31 Juillet 2026",
    location: "Ouagadougou, Burkina Faso",
    title: "Prise en charge des pathologies respiratoires professionnelles indemnisables (déclaration et réparation)",
    desc: "Éducation médicale continue organisée par le GT Environnement & Travail sur la déclaration et la réparation des pathologies respiratoires professionnelles.",
    badge: "À venir",
    badgeBg: "#f0fdf4",
    badgeColor: "#16a34a",
    gtt: "GT Environnement & Travail",
    image: "/ev-environnement-travail.jpg",
    hasPage: false,
  },
  {
    id: "ecole-asthme-2",
    type: "Formation",
    date: "8 Août 2026",
    location: "CHUP Charles de Gaulle, Ouagadougou",
    title: "2ème session de l'École de l'Asthme et des Allergies",
    desc: "Deuxième session de formation de l'École de l'Asthme, organisée conjointement par le GT Asthme & Allergies et le GT Pneumo-Pédiatrie.",
    badge: "À venir",
    badgeBg: "#eff6ff",
    badgeColor: "#2563eb",
    gtt: "GT Asthme & Allergies · GT Pneumo-Pédiatrie",
    image: "/ev-asthme-ecole.png",
    hasPage: false,
  },
  {
    id: "journee-regionale",
    type: "Journée",
    date: "19 – 21 Novembre 2026",
    location: "Koudougou, Burkina Faso",
    title: "1ère Journée Scientifique Régionale",
    desc: "Première journée scientifique régionale de la SOBUP — conférences, communications et échanges autour de la santé respiratoire.",
    badge: "À venir",
    badgeBg: "#f1f5f9",
    badgeColor: "#64748b",
    image: "/ev-journee-regionale.jpg",
    hasPage: true,
  },
  {
    id: "9eme-congres",
    type: "Congrès",
    date: "16 – 18 Décembre 2027",
    location: "Sopatel Silmande Hôtel, Ouagadougou",
    title: "9ème Congrès de la SOBUP",
    desc: "Pneumologie en Afrique : défis et innovations — conférences, ateliers pratiques et soumissions d'abstracts.",
    badge: "Inscriptions ouvertes",
    badgeBg: "#E8F9F7",
    badgeColor: "#259689",
    image: "/congres-6.jpg",
    hasPage: true,
  },
];

const typeColors: Record<string, string> = {
  "Congrès": "#7c3aed",
  "Journée": "#0891b2",
  "Webinaire": "#31B9AE",
  "Atelier": "#d97706",
  "Conférence": "#dc2626",
  "EPU": "#16a34a",
  "Formation": "#2563eb",
};

export default function EvenementsPage() {
  const [openEvent, setOpenEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!openEvent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenEvent(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openEvent]);

  return (
    <>
      <PageHero
        title="Événements"
        subtitle="Agenda scientifique de la SOBUP — congrès, journées, ateliers pratiques et formations."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Événements" }]}
        tag="Agenda 2026"
        shape="diagonal-right"
      />

      {/* Bandeau action */}
      <section className="bg-background border-b border-gray-100 sticky top-[70px] z-40">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-end">
          <Link
            href="/abstracts"
            className="px-4 py-1.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "#e67e22" }}
          >
            + Soumettre un abstract
          </Link>
        </div>
      </section>

      {/* Liste */}
      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4 space-y-5">
          {events.map((ev) => {
            const inner = (
              <>
                <div className="md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ev.image} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full"
                      style={{ background: typeColors[ev.type] ?? "#31B9AE" }}>
                      {ev.type}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-black text-gray-900 text-lg group-hover:text-primary transition-colors leading-tight">
                        {ev.title}
                      </h3>
                      <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                        style={{ background: ev.badgeBg, color: ev.badgeColor }}>
                        {ev.badge}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{ev.desc}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {ev.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {ev.location}
                    </span>
                    {ev.gtt && (
                      <span className="flex items-center gap-1.5 font-medium" style={{ color: "#31B9AE" }}>
                        <Users className="w-4 h-4" />
                        {ev.gtt}
                      </span>
                    )}
                  </div>
                </div>
              </>
            );

            const className =
              "group bg-background rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:shadow-xl transition-all hover:-translate-y-0.5 card-shadow w-full";

            return ev.hasPage ? (
              <Link key={ev.id} href={`/evenements/${ev.id}`} className={className}>
                {inner}
              </Link>
            ) : (
              <button
                key={ev.id}
                type="button"
                onClick={() => setOpenEvent(ev)}
                className={className}
                aria-label={`Ouvrir les détails — ${ev.title}`}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── MODAL ÉVÉNEMENT ── */}
      {openEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ev-modal-title"
          onClick={() => setOpenEvent(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-evmodal-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-evmodal-up"
          >
            {/* Image bandeau */}
            <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={openEvent.image} alt={openEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 60%)" }} />
              <span className="absolute top-4 left-4 text-xs font-black uppercase tracking-wider text-white px-3 py-1 rounded-full"
                style={{ background: typeColors[openEvent.type] ?? "#31B9AE" }}>
                {openEvent.type}
              </span>
              <button
                onClick={() => setOpenEvent(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-lg transition-all"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-2"
                  style={{ background: openEvent.badgeBg, color: openEvent.badgeColor }}>
                  {openEvent.badge}
                </span>
                <h2 id="ev-modal-title" className="text-white text-xl sm:text-2xl font-black leading-tight">
                  {openEvent.title}
                </h2>
              </div>
            </div>

            {/* Corps */}
            <div className="p-6 sm:p-8 overflow-y-auto">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl p-4 border border-gray-100" style={{ background: "#f8fafc" }}>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Date
                  </p>
                  <p className="text-sm font-bold text-gray-900">{openEvent.date}</p>
                </div>
                <div className="rounded-xl p-4 border border-gray-100" style={{ background: "#f8fafc" }}>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> Lieu
                  </p>
                  <p className="text-sm font-bold text-gray-900">{openEvent.location}</p>
                </div>
              </div>

              {openEvent.gtt && (
                <div className="rounded-xl p-4 border mb-6 flex items-center gap-3"
                  style={{ background: "#E8F9F7", borderColor: "#31B9AE40" }}>
                  <Users className="w-5 h-5 shrink-0" style={{ color: "#31B9AE" }} />
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest mb-0.5" style={{ color: "#31B9AE" }}>
                      Organisé par
                    </p>
                    <p className="text-sm font-bold text-gray-900">{openEvent.gtt}</p>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-700 leading-relaxed mb-6">{openEvent.desc}</p>

              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setOpenEvent(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all hover:-translate-y-0.5"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}
                >
                  Fermer
                </button>
                <Link
                  href="/contact"
                  className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "#31B9AE" }}
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes evmodal-fade { from { opacity: 0; } to { opacity: 1; } }
            @keyframes evmodal-up   { from { opacity: 0; transform: translateY(20px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .animate-evmodal-fade { animation: evmodal-fade .25s ease both; }
            .animate-evmodal-up   { animation: evmodal-up .35s cubic-bezier(.22,1,.36,1) both; }
          `}</style>
        </div>
      )}
    </>
  );
}
