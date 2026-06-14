import PageHero from "@/components/PageHero";
import Link from "next/link";

const events = [
  { id: "gtt/environnement-travail", type: "EPU", date: "31 Juillet 2026", location: "Ouagadougou, Burkina Faso", title: "Prise en charge des pathologies respiratoires professionnelles indemnisables (déclaration et réparation)", desc: "Éducation médicale continue organisée par le GT Environnement & Travail sur la déclaration et la réparation des pathologies respiratoires professionnelles.", badge: "À venir", badgeBg: "#f0fdf4", badgeColor: "#16a34a", gtt: "GT Environnement & Travail", image: "/ev-environnement-travail.jpg" },
  { id: "gtt/asthme-allergie", type: "Formation", date: "8 Août 2026", location: "CHUP Charles de Gaulle, Ouagadougou", title: "2ème session de l'École de l'Asthme et des Allergies", desc: "Deuxième session de formation de l'École de l'Asthme, organisée conjointement par le GT Asthme & Allergies et le GT Pneumo-Pédiatrie.", badge: "À venir", badgeBg: "#eff6ff", badgeColor: "#2563eb", gtt: "GT Asthme & Allergies · GT Pneumo-Pédiatrie", image: "/ev-asthme-ecole.png" },
  { id: "journee-regionale", type: "Journée", date: "19 – 21 Novembre 2026", location: "Koudougou, Burkina Faso", title: "1ère Journée Scientifique Régionale", desc: "Première journée scientifique régionale de la SOBUP — conférences, communications et échanges autour de la santé respiratoire.", badge: "À venir", badgeBg: "#f1f5f9", badgeColor: "#64748b", image: "/ev-journee-regionale.jpg" },
  { id: "9eme-congres", type: "Congrès", date: "16 – 19 Décembre 2027", location: "Sopatel Silmande Hôtel, Ouagadougou", title: "9ème Congrès de la SOBUP", desc: "Pneumologie en Afrique : défis et innovations — conférences, ateliers pratiques et soumissions d'abstracts.", badge: "Inscriptions ouvertes", badgeBg: "#E8F9F7", badgeColor: "#259689", image: "/congres-6.jpg" },
];

const typeColors: Record<string, string> = {
  "Congrès": "#7c3aed", "Journée": "#0891b2", "Webinaire": "#31B9AE", "Atelier": "#d97706", "Conférence": "#dc2626",
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
                  {"gtt" in ev && ev.gtt && (
                    <span className="flex items-center gap-1.5 font-medium" style={{ color: "#31B9AE" }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {(ev as { gtt: string }).gtt}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
