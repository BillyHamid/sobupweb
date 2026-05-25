import PageHero from "@/components/PageHero";
import Link from "next/link";

const events = [
  { id: "9eme-congres", type: "Congrès", date: "15–17 Mai 2026", location: "Hôtel Laïco Ouaga 2000, Ouagadougou", title: "9ème Congrès annuel de la SOBUP", desc: "Pneumologie en Afrique : défis et innovations. 3 jours de conférences, ateliers pratiques et soumissions d'abstracts.", fee: "30 000 XOF membres / 50 000 XOF non-membres", status: "upcoming", badge: "Inscriptions ouvertes", badgeBg: "#E8F9F7", badgeColor: "#259689", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&fit=crop" },
  { id: "webinaire-asthme", type: "Webinaire", date: "22 Juin 2026", location: "En ligne (Zoom)", title: "Prise en charge de l'asthme sévère en Afrique", desc: "Webinaire du GT Asthme & Allergie sur les nouveaux protocoles de prise en charge de l'asthme sévère.", fee: "Gratuit pour les membres", status: "upcoming", badge: "Gratuit membres", badgeBg: "#E8F9F7", badgeColor: "#31B9AE", image: "https://images.unsplash.com/photo-1588776814546-1ffbb9e0a75a?w=600&q=80&fit=crop" },
  { id: "atelier-spirometrie", type: "Atelier", date: "10 Juillet 2026", location: "CHU Yalgado Ouédraogo", title: "Atelier pratique de spirométrie", desc: "Formation pratique intensive sur la réalisation et l'interprétation des explorations fonctionnelles respiratoires.", fee: "15 000 XOF membres / 25 000 XOF non-membres", status: "upcoming", badge: "Places limitées", badgeBg: "#fef3c7", badgeColor: "#d97706", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80&fit=crop" },
  { id: "webinaire-tb", type: "Webinaire", date: "5 Septembre 2026", location: "En ligne", title: "Tuberculose résistante : mise à jour 2026", desc: "GT Tuberculose — Nouvelles recommandations OMS et adaptation au contexte burkinabè.", fee: "Gratuit pour les membres", status: "upcoming", badge: "À venir", badgeBg: "#f1f5f9", badgeColor: "#64748b", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80&fit=crop" },
];

const typeColors: Record<string, string> = {
  "Congrès": "#7c3aed", "Webinaire": "#31B9AE", "Atelier": "#d97706", "Conférence": "#dc2626",
};

export default function EvenementsPage() {
  return (
    <>
      <PageHero
        title="Événements"
        subtitle="Agenda scientifique de la SOBUP — congrès, webinaires, ateliers pratiques et formations."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Événements" }]}
        tag="Agenda 2026"
        shape="diagonal-right"
      />

      {/* Filtres */}
      <section className="bg-background border-b border-gray-100 sticky top-[70px] z-40">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3 overflow-x-auto">
          {["Tous", "Congrès", "Webinaire", "Atelier", "Formation"].map((f) => (
            <button key={f}
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors"
              style={f === "Tous" ? { background: "#31B9AE", color: "white", borderColor: "#31B9AE" } : { color: "#64748b", borderColor: "#e2e8f0" }}>
              {f}
            </button>
          ))}
          <div className="ml-auto shrink-0">
            <Link href="/abstracts"
              className="px-4 py-1.5 rounded-full text-sm font-bold text-white"
              style={{ background: "#e67e22" }}>
              + Soumettre un abstract
            </Link>
          </div>
        </div>
      </section>

      {/* Events list */}
      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4 space-y-5">
          {events.map((ev) => (
            <Link key={ev.id} href={`/evenements/${ev.id}`}
              className="group bg-background rounded-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row hover:shadow-xl transition-all hover:-translate-y-0.5 card-shadow">
              {/* Image */}
              <div className="md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full"
                    style={{ background: typeColors[ev.type] ?? "#31B9AE" }}>
                    {ev.type}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {ev.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    {ev.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold" style={{ color: "#31B9AE" }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {ev.fee}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
