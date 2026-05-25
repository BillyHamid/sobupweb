import PageHero from "@/components/PageHero";
import Link from "next/link";

const gttGroups = [
  { name: "GT Tuberculose", slug: "tuberculose", icon: "🫁", members: 18, color: "#dc2626", bg: "#fef2f2", desc: "Prise en charge de la tuberculose, résistance aux antituberculeux, stratégies de dépistage et de suivi." },
  { name: "GT Infections pulmonaires non TB", slug: "infections-non-tb", icon: "🦠", members: 12, color: "#ea580c", bg: "#fff7ed", desc: "Pneumonies communautaires et nosocomiales, infections opportunistes, gestion des antibiotiques." },
  { name: "GT Asthme & Allergie", slug: "asthme-allergie", icon: "💨", members: 15, color: "#2563eb", bg: "#eff6ff", desc: "Asthme allergique et non allergique, rhinite allergique, désensibilisation spécifique." },
  { name: "GT Oncologie thoracique", slug: "oncologie-thoracique", icon: "🔬", members: 10, color: "#7c3aed", bg: "#f5f3ff", desc: "Cancer du poumon, mésothéliome, dépistage, prise en charge multidisciplinaire." },
  { name: "GT Tabac & BPCO", slug: "tabac-bpco", icon: "🚭", members: 14, color: "#64748b", bg: "#f8fafc", desc: "Sevrage tabagique, BPCO, emphysème, réhabilitation respiratoire." },
  { name: "GT Sommeil & VNI", slug: "sommeil-vni", icon: "😴", members: 9, color: "#4f46e5", bg: "#eef2ff", desc: "Syndrome d'apnées obstructives du sommeil, ventilation non invasive à domicile." },
  { name: "GT Pneumo-pédiatrie", slug: "pneumo-pediatrie", icon: "👶", members: 11, color: "#db2777", bg: "#fdf2f8", desc: "Maladies respiratoires de l'enfant : asthme pédiatrique, infections, malformations." },
  { name: "GT EFR", slug: "efr", icon: "📊", members: 8, color: "#d97706", bg: "#fffbeb", desc: "Spirométrie, pléthysmographie, diffusion du CO, tests de marche de 6 minutes." },
  { name: "GT Imagerie thoracique & Écho pleurale", slug: "imagerie-thoracique", icon: "📷", members: 13, color: "#0891b2", bg: "#ecfeff", desc: "Radiologie thoracique standard, échographie pleurale et pulmonaire, TDM thoracique." },
  { name: "GT Endoscopie bronchique & Pleurale", slug: "endoscopie-bronchique", icon: "🩺", members: 7, color: "#31B9AE", bg: "#E8F9F7", desc: "Fibroscopie bronchique, pleuroscopie médicale, drainage pleural, biopsies." },
  { name: "GT Environnement, Travail & Santé Resp.", slug: "environnement-travail", icon: "🏭", members: 10, color: "#259689", bg: "#E8F9F7", desc: "Pathologies professionnelles, pollution de l'air intérieur et extérieur, pneumoconioses." },
];

export default function GTTPage() {
  return (
    <>
      <PageHero
        title="Groupes de Travail Thématiques"
        subtitle="Le cœur scientifique de la SOBUP — 11 groupes d'experts produisant recommandations, formations et recherches en pneumologie."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "GTT" }]}
        tag="Expertise scientifique"
        shape="wave"
      />

      {/* Intro */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "📋", label: "Recommandations nationales", desc: "Chaque GTT produit des recommandations adaptées au contexte burkinabè." },
              { icon: "🎓", label: "Formations spécialisées", desc: "Modules e-learning, webinaires et ateliers pratiques par spécialité." },
              { icon: "🤝", label: "Espace collaboratif", desc: "Forum privé et partage de ressources entre membres du groupe." },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 p-5 rounded-2xl border border-gray-100 card-shadow">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{item.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GTT grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gttGroups.map((gtt) => (
              <Link key={gtt.slug} href={`/gtt/${gtt.slug}`}
                className="group bg-background rounded-2xl border-2 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 card-shadow"
                style={{ borderColor: `${gtt.color}30` }}>
                <div className="px-6 py-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: gtt.bg }}>
                    {gtt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-gray-900 group-hover:transition-colors text-sm leading-tight mb-2"
                      style={{ color: "inherit" }}
                    >
                      {gtt.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{gtt.desc}</p>
                  </div>
                </div>
                <div className="px-6 pb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: gtt.bg, color: gtt.color }}>
                    {gtt.members} membres
                  </span>
                  <span className="text-xs font-bold flex items-center gap-1 transition-colors"
                    style={{ color: "#31B9AE" }}>
                    Voir le groupe →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Rejoindre un GTT */}
      <section className="py-12 banniere-sobup">
        <div className="mx-auto max-w-7xl px-4 text-center text-white">
          <h2 className="text-2xl font-black mb-3">Rejoindre un Groupe de Travail</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm">
            Les membres de la SOBUP peuvent adhérer à un ou plusieurs GTT depuis leur espace membre.
            La participation est ouverte à tous selon votre spécialité et vos intérêts scientifiques.
          </p>
          <Link href="/espace-membre"
            className="inline-block px-6 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: "#e67e22" }}>
            Accéder à mon espace membre
          </Link>
        </div>
      </section>
    </>
  );
}
