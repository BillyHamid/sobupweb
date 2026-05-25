import PageHero from "@/components/PageHero";

const media = [
  { type: "photo", title: "8ème Congrès SOBUP — Cérémonie d'ouverture", date: "2025", thumb: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80&fit=crop" },
  { type: "video", title: "Conférence : Tuberculose résistante au Burkina Faso", date: "2025", thumb: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80&fit=crop" },
  { type: "presentation", title: "Asthme sévère — Présentation Pr. Kaboré", date: "2025", thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&fit=crop" },
  { type: "photo", title: "Atelier de spirométrie — Formation pratique", date: "2024", thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80&fit=crop" },
  { type: "video", title: "Webinaire : Imagerie thoracique en pratique", date: "2024", thumb: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80&fit=crop" },
  { type: "photo", title: "7ème Congrès — Session plénière", date: "2024", thumb: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&q=80&fit=crop" },
  { type: "presentation", title: "BPCO : Réhabilitation respiratoire", date: "2024", thumb: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80&fit=crop" },
  { type: "video", title: "Endoscopie bronchique — Formation vidéo", date: "2023", thumb: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&q=80&fit=crop" },
];

const typeIcons: Record<string, string> = { photo: "📷", video: "🎬", presentation: "📊" };
const typeLabels: Record<string, string> = { photo: "Photo", video: "Vidéo", presentation: "Présentation" };

export default function MediathequePage() {
  return (
    <>
      <PageHero
        title="Médiathèque"
        subtitle="Photos, vidéos de conférences et présentations scientifiques de la SOBUP et de ses Groupes de Travail."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Médiathèque" }]}
        tag="Ressources multimédia"
        shape="sharp"
      />

      <section className="bg-background border-b border-gray-100 sticky top-[70px] z-40">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {["Tout", "Photos", "Vidéos", "Présentations"].map((f) => (
            <button key={f} className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors"
              style={f === "Tout" ? { background: "#31B9AE", color: "white", borderColor: "#31B9AE" } : { color: "#64748b", borderColor: "#e2e8f0" }}>
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden border border-gray-100 bg-background hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer card-shadow">
                <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-4xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                      {item.type === "video" ? "▶️" : item.type === "photo" ? "🔍" : "📊"}
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(49,185,174,.88)" }}>
                      {typeIcons[item.type]} {typeLabels[item.type]}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
