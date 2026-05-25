import PageHero from "@/components/PageHero";
import Link from "next/link";

const courses = [
  { id: "spirometrie-avancee", type: "Module e-learning", title: "Spirométrie avancée : réalisation et interprétation", gtt: "GT EFR", instructor: "Dr. [Nom]", duration: "4h", level: "Intermédiaire", price: "Gratuit membres", enrolled: 87, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&q=80&fit=crop", badge: "Nouveau" },
  { id: "tb-mdr", type: "Webinaire replay", title: "Tuberculose résistante : mise à jour thérapeutique 2025", gtt: "GT Tuberculose", instructor: "Dr. [Nom]", duration: "2h30", level: "Avancé", price: "Gratuit membres", enrolled: 143, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80&fit=crop", badge: null },
  { id: "asthme-severe", type: "Module e-learning", title: "Asthme sévère : de l'évaluation au traitement", gtt: "GT Asthme & Allergie", instructor: "Dr. [Nom]", duration: "3h", level: "Avancé", price: "Gratuit membres", enrolled: 96, image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&q=80&fit=crop", badge: null },
  { id: "imagerie-pleurale", type: "Module e-learning", title: "Échographie pleuro-pulmonaire : initiation pratique", gtt: "GT Imagerie thoracique", instructor: "Dr. [Nom]", duration: "5h", level: "Débutant", price: "15 000 XOF", enrolled: 54, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80&fit=crop", badge: "Populaire" },
];

const levelColors: Record<string, { bg: string; color: string }> = {
  "Débutant": { bg: "#E8F9F7", color: "#259689" },
  "Intermédiaire": { bg: "#fef3c7", color: "#d97706" },
  "Avancé": { bg: "#fef2f2", color: "#dc2626" },
};

export default function FormationsPage() {
  return (
    <>
      <PageHero
        title="Formations"
        subtitle="Modules de formation en ligne, webinaires en direct et replays — accessibles à votre rythme, pour tous les membres."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Formations" }]}
        tag="Formation continue"
      />

      {/* Stats */}
      <section className="bg-background py-8 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "12", label: "Modules disponibles", icon: "📚" },
            { value: "380+", label: "Membres inscrits", icon: "👥" },
            { value: "100%", label: "Gratuit pour les membres", icon: "🎁" },
            { value: "🏅", label: "Attestation automatique", icon: "" },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ background: "#f0fafa" }}>
              <p className="text-2xl font-black mb-1" style={{ color: "#31B9AE" }}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-background border-b border-gray-100 sticky top-[70px] z-40">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {["Tous", "E-learning", "Webinaire live", "Webinaire replay", "Atelier"].map((f) => (
            <button key={f} className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors"
              style={f === "Tous" ? { background: "#31B9AE", color: "white", borderColor: "#31B9AE" } : { color: "#64748b", borderColor: "#e2e8f0" }}>
              {f}
            </button>
          ))}
          <div className="ml-auto shrink-0">
            <Link href="/formations/webinaires" className="text-sm font-bold px-4 py-1.5 rounded-full border-2 transition-colors"
              style={{ color: "#31B9AE", borderColor: "#31B9AE" }}>
              📡 Webinaires live →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4 grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.map((course) => {
            const lvl = levelColors[course.level] ?? { bg: "#f1f5f9", color: "#64748b" };
            return (
              <div key={course.id} className="bg-background rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group card-shadow flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#31B9AE" }}>{course.type}</span>
                    {course.badge && <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#e67e22" }}>{course.badge}</span>}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: lvl.bg, color: lvl.color }}>{course.level}</span>
                    <span className="text-xs text-gray-400 font-medium">⏱ {course.duration}</span>
                    <span className="text-xs text-gray-400">📌 {course.gtt}</span>
                  </div>
                  <h3 className="font-black text-gray-900 group-hover:text-primary transition-colors text-sm leading-snug mb-2 flex-1">{course.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">👨‍⚕️ {course.instructor} · {course.enrolled} inscrits</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm" style={{ color: "#31B9AE" }}>{course.price}</span>
                    <Link href="/espace-membre"
                      className="px-4 py-2 rounded-xl font-bold text-white text-xs transition-all hover:-translate-y-0.5"
                      style={{ background: "#31B9AE" }}>
                      Accéder au cours →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
