import PageHero from "@/components/PageHero";

const recommandations = [
  { title: "Prise en charge de la tuberculose multirésistante au Burkina Faso", gtt: "GT Tuberculose", year: "2025", pathology: "Tuberculose", pages: 48, downloads: 312 },
  { title: "Guide national de prise en charge de l'asthme de l'adulte", gtt: "GT Asthme & Allergie", year: "2024", pathology: "Asthme", pages: 64, downloads: 287 },
  { title: "Recommandations pour la prise en charge de la BPCO", gtt: "GT Tabac & BPCO", year: "2024", pathology: "BPCO", pages: 52, downloads: 245 },
  { title: "Protocole de réalisation et d'interprétation de la spirométrie", gtt: "GT EFR", year: "2024", pathology: "EFR", pages: 32, downloads: 198 },
  { title: "Prise en charge du cancer du poumon au Burkina Faso", gtt: "GT Oncologie thoracique", year: "2023", pathology: "Oncologie", pages: 70, downloads: 176 },
  { title: "Guide de prise en charge des pneumonies communautaires", gtt: "GT Infections non TB", year: "2023", pathology: "Infections", pages: 40, downloads: 221 },
  { title: "Syndrome d'apnées du sommeil : diagnostic et traitement", gtt: "GT Sommeil & VNI", year: "2023", pathology: "Sommeil", pages: 36, downloads: 154 },
  { title: "Asthme de l'enfant : guide pour le praticien burkinabè", gtt: "GT Pneumo-pédiatrie", year: "2022", pathology: "Asthme", pages: 44, downloads: 189 },
];

const pathologies = ["Toutes", "Tuberculose", "Asthme", "BPCO", "Oncologie", "Infections", "EFR", "Sommeil"];

const pathologyColors: Record<string, { bg: string; color: string }> = {
  "Tuberculose": { bg: "#fef2f2", color: "#dc2626" },
  "Asthme": { bg: "#eff6ff", color: "#2563eb" },
  "BPCO": { bg: "#f8fafc", color: "#475569" },
  "Oncologie": { bg: "#f5f3ff", color: "#7c3aed" },
  "Infections": { bg: "#fff7ed", color: "#ea580c" },
  "EFR": { bg: "#fffbeb", color: "#d97706" },
  "Sommeil": { bg: "#eef2ff", color: "#4f46e5" },
};

export default function RecommandationsPage() {
  return (
    <>
      <PageHero
        title="Recommandations médicales"
        subtitle="Guides de bonnes pratiques et recommandations nationales élaborés par nos Groupes de Travail Thématiques."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Recommandations" }]}
        tag="Bibliothèque scientifique"
        shape="arrow-down"
      />

      {/* Filtres */}
      <section className="bg-background border-b border-gray-100 sticky top-[70px] z-40">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {pathologies.map((p) => (
            <button key={p} className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors"
              style={p === "Toutes" ? { background: "#31B9AE", color: "white", borderColor: "#31B9AE" } : { color: "#64748b", borderColor: "#e2e8f0" }}>
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommandations.map((rec, i) => {
              const cs = pathologyColors[rec.pathology] ?? { bg: "#E8F9F7", color: "#31B9AE" };
              return (
                <div key={i}
                  className="bg-background rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 group card-shadow flex flex-col">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-14 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: cs.bg }}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: cs.color }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-1.5 inline-block"
                        style={{ background: cs.bg, color: cs.color }}>
                        {rec.pathology}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-3">
                        {rec.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 flex-wrap">
                    <span>📌 {rec.gtt}</span>
                    <span>• {rec.year}</span>
                    <span>• {rec.pages}p</span>
                    <span>• {rec.downloads} téléchargements</span>
                  </div>
                  <div className="mt-auto">
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                      style={{ background: "#31B9AE" }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      Télécharger PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
