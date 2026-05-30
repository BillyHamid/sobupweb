import PageHero from "@/components/PageHero";

const categories = [
  {
    icon: "📄",
    title: "Articles scientifiques",
    desc: "Articles originaux publiés par les membres de la SOBUP dans des revues nationales et internationales.",
    color: "#2D7DD2",
    bg: "#EFF6FF",
  },
  {
    icon: "🎤",
    title: "Résumés de communication",
    desc: "Abstracts présentés lors des congrès, journées scientifiques et symposia.",
    color: "#E64980",
    bg: "#FDF2F8",
  },
  {
    icon: "🎓",
    title: "Thèses et Mémoires",
    desc: "Travaux universitaires — DES de pneumologie, mémoires de spécialisation et thèses de doctorat.",
    color: "#7048E8",
    bg: "#F5F3FF",
  },
  {
    icon: "📋",
    title: "Recommandations",
    desc: "Recommandations nationales et guides de pratique clinique élaborés par les groupes de travail.",
    color: "#37B24D",
    bg: "#F0FDF4",
  },
];

export default function PublicationsScientifiquesPage() {
  return (
    <>
      <PageHero
        title="Publications scientifiques"
        subtitle="La production scientifique de la SOBUP — articles, résumés, thèses et recommandations en pneumologie."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Publications scientifiques" }]}
        tag="Production scientifique"
        shape="diagonal-right"
      />

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Nos publications</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 section-title">Quatre catégories de productions</h2>
            <p className="mt-3 text-gray-500 text-sm max-w-2xl mx-auto">
              Retrouvez ici l&apos;ensemble des travaux scientifiques produits par les membres de la SOBUP.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {categories.map((c) => (
              <div
                key={c.title}
                className="group rounded-3xl p-8 border-2 border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all card-shadow"
                style={{ background: c.bg }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md"
                    style={{ background: "#fff" }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black mb-2" style={{ color: c.color }}>
                      {c.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
                    <p
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: c.color }}
                    >
                      Contenu à venir
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
