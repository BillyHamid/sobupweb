import PageHero from "@/components/PageHero";
import Link from "next/link";

interface GTT {
  name: string;
  fullName: string;
  icon: string;
  color: string;
  bg: string;
  coordinateurs: string[];
  desc: string;
  objectives: string[];
  actions: string[];
  resources: { title: string; icon: string }[];
}

const gttData: Record<string, GTT> = {
  tuberculose: {
    name: "GT Tuberculose",
    fullName: "Groupe de Travail Tuberculose",
    icon: "🫁",
    color: "#dc2626",
    bg: "#fef2f2",
    coordinateurs: ["Dr OUEDRAOGO Julienne", "Dr LOABA Abdou Eric", "Dr ZONGO Marthe"],
    desc: "",
    objectives: [
      
      "Organiser la formation continue des professionnels de santé sur le diagnostic et la prise en charge de la tuberculose.",
      "Coordonner des projets de recherche opérationnelle.",
      "Contribuer aux campagnes nationales de dépistage et de sensibilisation sur la tuberculose.",
      "Apporter l'expertise pneumologique au PNT pour l'adaptation des recommandations internationales aux spécificités locales."
    ],
    actions: [
      "Commémoration de la Journée Mondiale de la Tuberculose (JMT) 2026",
      "Campagnes de dépistage en milieu carcéral, sites d'orpaillage, camps PDI et enfants malnutris",
      "Émissions radiophoniques et télévisées ",
    ],
    resources: [
      { title: "Guide technique de lutte contre la tuberculose (10ème édition, 2025)", icon: "📋" },
      { title: "Guide de prise en charge de la tuberculose chez l'enfant", icon: "📄" },
      { title: "Guide TB/VIH", icon: "📄" },
      { title: "Guide de prise en charge de la Tuberculose Pharmacorésistante (TB-MR/RR)", icon: "📋" },
      { title: "Plan Stratégique National de lutte contre la tuberculose (PSN-TB)", icon: "📊" },
    ],
  },

  "infections-non-tb": {
    name: "GT Infections non TB",
    fullName: "GT Infections Pulmonaires Non Tuberculeuses",
    icon: "🦠",
    color: "#ea580c",
    bg: "#fff7ed",
    coordinateurs: ["Dr OUEDRAOGO Guy Alain", "Dr OUEDRAOGO Abdramane"],
    desc: "",
    objectives: [
      "Adapter les recommandations internationales sur la prise en charge des pneumonies communautaires et nosocomiales aux réalités locales.",
      "Rédiger des protocoles nationaux d'antibiothérapie raisonnée et de diagnostic des infections fongiques.",
      "Produire des supports de formation.",
      "Conduire des projets de recherche.",
    ],
    actions: [
      "Webinaire sur les infections respiratoires basses (en collaboration avec la Société Burkinabè de Pathologies Infectieuses et Tropicales)",
      "Rédaction en cours d'un guide de prise en charge des infections respiratoires basses",
    ],
    resources: [
      { title: "Présentation PPT du webinaire sur les infections respiratoires basses", icon: "📊" },
    ],
  },

  "asthme-allergie": {
    name: "GT Asthme & Allergie",
    fullName: "Groupe de Travail Asthme et Allergies",
    icon: "💨",
    color: "#2563eb",
    bg: "#eff6ff",
    coordinateurs: ["Dr MINOUNGOU J. Christian", "Dr OUEDRAOGO Patricia"],
    desc: "",
    objectives: [
      "Adapter les recommandations internationales au contexte burkinabè.",
      "Rédiger des protocoles nationaux de prise en charge de l'asthme et des allergies respiratoires.",
      "Produire des supports de formation pour les patients et les professionnels de santé.",
      "Conduire des projets de recherche sur l'asthme et les déterminants environnementaux.",
    ],
    actions: [
      "Lancement de l'École de l'asthme et des allergies (sessions bimestrielles dans les CHU de Ouagadougou)",
      "Formation des pharmaciens d'officine",
      "Commémoration de la Journée mondiale de l'asthme",
    ],
    resources: [
      { title: "Capsule vidéo sur l'utilisation des inhalateurs", icon: "🎬" },
      { title: "Liste des prochaines sessions de l'École de l'asthme", icon: "📅" },
    ],
  },

  "oncologie-thoracique": {
    name: "GT Oncologie thoracique",
    fullName: "Groupe de Travail Oncologie Thoracique",
    icon: "🔬",
    color: "#7c3aed",
    bg: "#f5f3ff",
    coordinateurs: ["Dr MAÏGA Moumouni", "Dr DEMBELE Ousmane"],
    desc: "",
    objectives: [
      "Adapter les recommandations internationales pour le diagnostic et la prise en charge du cancer du poumon au Burkina Faso.",
      "Produire des supports de formation à destination des professionnels de santé.",
      "Conduire des projets de recherche sur les cancers broncho-pulmonaires et les facteurs de risque locaux.",
    ],
    actions: [
      "Participation aux réunions de concertation pluridisciplinaires (RCP) locales",
    ],
    resources: [
      { title: "Momentanément indisponible", icon: "📋" },
    ],
  },

  "tabac-bpco": {
    name: "GT Tabac & BPCO",
    fullName: "Groupe de Travail Tabac et BPCO",
    icon: "🚭",
    color: "#374151",
    bg: "#f9fafb",
    coordinateurs: ["Dr BOUGMA Ghislain", "Dr SOUBEIGA Dimitri"],
    desc: "",
    objectives: [
      "Adapter les recommandations internationales (GOLD) sur la BPCO et le sevrage tabagique au contexte burkinabè.",
      "Rédiger des protocoles nationaux pour la prise en charge des exacerbations de BPCO et le sevrage tabagique.",
      "Produire des supports de formation sur la BPCO et le sevrage tabagique.",
      "Conduire des projets de recherche sur la BPCO, les facteurs de risque environnementaux et professionnels.",
    ],
    actions: [
      "Commémorations de la Journée sans tabac 2026",
    ],
    resources: [
      { title: "Vidéo sur les techniques d'inhalation", icon: "🎬" },
    ],
  },

  "sommeil-vni": {
    name: "GT Sommeil & VNI",
    fullName: "GT Sommeil et Ventilation Non Invasive",
    icon: "😴",
    color: "#4f46e5",
    bg: "#eef2ff",
    coordinateurs: ["Dr ZIDA Dominique", "Dr OUEDRAOGO Armel"],
    desc: "",
    objectives: [
      "Adapter les recommandations internationales sur le syndrome d'apnées du sommeil (SAS) et la VNI aux ressources disponibles au Burkina.",
      "Rédiger des protocoles nationaux pour le diagnostic du SAS et la VNI à domicile.",
      "Produire des supports de formation sur le SAS et la VNI.",
      "Conduire des projets de recherche sur les troubles respiratoires du sommeil.",
    ],
    actions: [
      "Table ronde pluridisciplinaire sur le syndrome d'apnées du sommeil (Journée mondiale du sommeil 2026)",
    ],
    resources: [
      { title: "Synthèse de la table ronde sur le SAS — Journée mondiale du sommeil 2026", icon: "📄" },
    ],
  },

  "pneumo-pediatrie": {
    name: "GT Pneumo-pédiatrie",
    fullName: "Groupe de Travail Pneumo-Pédiatrie",
    icon: "👶",
    color: "#db2777",
    bg: "#fdf2f8",
    coordinateurs: ["Dr KOUMBEM Bourema", "Dr YAOGHO Idrissa"],
    desc: "Ce groupe travaille sur les maladies respiratoires de l'enfant dans le contexte burkinabè, de la prise en charge des infections respiratoires aux maladies chroniques.",
    objectives: [
      "Adapter les recommandations internationales au contexte burkinabè.",
      "Rédiger des protocoles nationaux de prise en charge des pathologies respiratoires de l'enfant.",
      "Produire des supports de formation.",
      "Conduire des projets de recherche sur les maladies respiratoires chez l'enfant et les déterminants environnementaux.",
    ],
    actions: [
      "Participation au dépistage de la tuberculose chez les enfants dénutris",
    ],
    resources: [],
  },

  efr: {
    name: "GT EFR",
    fullName: "GT Explorations Fonctionnelles Respiratoires",
    icon: "📊",
    color: "#d97706",
    bg: "#fffbeb",
    coordinateurs: ["Dr TIENDREBEOGO J.F. Arnaud", "Dr ZAGRE Laurent"],
    desc: "Ce groupe adapte les recommandations sur les EFR au contexte burkinabè et travaille à établir les valeurs normales de la fonction respiratoire dans la population locale.",
    objectives: [
      "Adapter les recommandations internationales sur les EFR au contexte burkinabè.",
      "Rédiger des protocoles nationaux pour la réalisation et l'interprétation des EFR (spirométrie, pléthysmographie, test de marche).",
      "Produire des supports de formation (guides de qualité, tutoriels vidéo, fiches de contrôle).",
      "Conduire des projets de recherche sur les valeurs normales de la fonction respiratoire dans la population burkinabè.",
    ],
    actions: [],
    resources: [],
  },

  "imagerie-thoracique": {
    name: "GT Imagerie thoracique",
    fullName: "GT Imagerie Thoracique et Échographie Pleuro-Pulmonaire",
    icon: "📷",
    color: "#0891b2",
    bg: "#ecfeff",
    coordinateurs: ["Dr SOME Wilfried", "Dr PARE Salif"],
    desc: "Ce groupe adapte les recommandations sur l'imagerie thoracique et l'échographie pleurale aux pratiques locales, et développe la formation à l'échographie au lit du patient.",
    objectives: [
      "Adapter les recommandations internationales (imagerie thoracique, échographie pleurale) aux pratiques locales.",
      "Produire des supports de formation sur l'échographie au lit du patient.",
      "Conduire des projets de recherche.",
    ],
    actions: [],
    resources: [],
  },

  "endoscopie-bronchique": {
    name: "GT Endoscopie bronchique",
    fullName: "GT Endoscopie Bronchique et Interventions Pleurales",
    icon: "🩺",
    color: "#31B9AE",
    bg: "#E8F9F7",
    coordinateurs: ["Dr BAZONGO Moussa", "Dr KOALGA Richard", "Dr DELMA Eric"],
    desc: "",
    objectives: [
      "Adapter les recommandations internationales sur l'endoscopie bronchique et les gestes pleuraux aux ressources du Burkina.",
      "Rédiger des protocoles nationaux.",
      "Produire des supports de formation.",
      "Conduire des projets de recherche.",
    ],
    actions: [
      
      "",
    ],
    resources: [],
  },

  "environnement-travail": {
    name: "GT Environnement & Travail",
    fullName: "GT Environnement, Travail et Santé Respiratoire",
    icon: "🏭",
    color: "#16a34a",
    bg: "#f0fdf4",
    coordinateurs: ["Dr KUIRE Marcel", "Dr NACANABO Rachel"],
    desc: "",
    objectives: [
      "Adapter les recommandations internationales sur les pathologies respiratoires professionnelles et environnementales au cadre juridique et sanitaire burkinabè.",
      "Rédiger des protocoles nationaux (référentiel des maladies indemnisables, fiches de déclaration).",
      "Produire des supports de formation pour les médecins du travail, les pneumologues et les employeurs.",
      "Conduire des projets de recherche sur les pathologies respiratoires liées au travail et à la pollution.",
    ],
    actions: [
      "EPU sur les pathologies respiratoires indemnisables (déclaration et réparation)",
    ],
    resources: [],
  },
};

const allGTTs = [
  { slug: "tuberculose", name: "GT Tuberculose", icon: "🫁" },
  { slug: "infections-non-tb", name: "GT Infections non TB", icon: "🦠" },
  { slug: "asthme-allergie", name: "GT Asthme & Allergie", icon: "💨" },
  { slug: "oncologie-thoracique", name: "GT Oncologie thoracique", icon: "🔬" },
  { slug: "tabac-bpco", name: "GT Tabac & BPCO", icon: "🚭" },
  { slug: "sommeil-vni", name: "GT Sommeil & VNI", icon: "😴" },
  { slug: "pneumo-pediatrie", name: "GT Pneumo-pédiatrie", icon: "👶" },
  { slug: "efr", name: "GT EFR", icon: "📊" },
  { slug: "imagerie-thoracique", name: "GT Imagerie thoracique", icon: "📷" },
  { slug: "endoscopie-bronchique", name: "GT Endoscopie bronchique", icon: "🩺" },
  { slug: "environnement-travail", name: "GT Environnement & Travail", icon: "🏭" },
];

export default async function GTTDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gtt = gttData[slug] ?? {
    name: "Groupe de Travail",
    fullName: "Groupe de Travail Thématique",
    icon: "🔬",
    color: "#31B9AE",
    bg: "#E8F9F7",
    coordinateurs: [],
    desc: "Ce groupe de travail thématique contribue à l'expertise scientifique de la SOBUP dans son domaine de spécialité.",
    objectives: ["Produire des recommandations nationales", "Organiser des formations spécialisées", "Partager les ressources scientifiques", "Animer un espace collaboratif entre membres"],
    actions: [],
    resources: [],
  };

  const otherGTTs = allGTTs.filter((g) => g.slug !== slug).slice(0, 6);

  return (
    <>
      <PageHero
        title={gtt.name}
        subtitle={gtt.desc}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "GTT", href: "/gtt" }, { label: gtt.name }]}
        tag="Groupe de Travail Thématique"
        shape="diagonal-right"
      />

      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-3 gap-8">

          {/* ── Colonne principale ── */}
          <div className="lg:col-span-2 space-y-7">

            {/* Coordonnateurs */}
            <div className="rounded-2xl p-6 border" style={{ background: gtt.bg, borderColor: `${gtt.color}30` }}>
              <h2 className="text-base font-black text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>👤</span> Coordonnateur{gtt.coordinateurs.length > 1 ? "s" : ""}
              </h2>
              <div className="flex flex-wrap gap-3">
                {gtt.coordinateurs.map((coord) => (
                  <span
                    key={coord}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm"
                    style={{ background: `${gtt.color}18`, color: gtt.color, border: `1px solid ${gtt.color}40` }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                      style={{ background: gtt.color }}
                    >
                      {coord.split(" ").find((w) => w.length > 2)?.[0] ?? "D"}
                    </span>
                    {coord}
                  </span>
                ))}
              </div>
            </div>

            {/* Objectifs */}
            <div className="bg-background rounded-2xl border border-gray-100 p-6 card-shadow">
              <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                <span>{gtt.icon}</span> Objectifs du groupe
              </h2>
              <ul className="space-y-3">
                {gtt.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                      style={{ background: gtt.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions récentes */}
            {gtt.actions.length > 0 && (
              <div className="bg-background rounded-2xl border border-gray-100 p-6 card-shadow">
                <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                  <span>⚡</span> Actions récentes
                </h2>
                <ul className="space-y-3">
                  {gtt.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="w-2 h-2 rounded-full mt-2 shrink-0"
                        style={{ background: gtt.color }}
                      />
                      <span className="text-gray-700 text-sm leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ressources disponibles */}
            {gtt.resources.length > 0 ? (
              <div className="bg-background rounded-2xl border border-gray-100 p-6 card-shadow">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-black text-gray-900">Ressources disponibles</h2>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: gtt.bg, color: gtt.color }}
                  >
                    {gtt.resources.length} document{gtt.resources.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="space-y-3">
                  {gtt.resources.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all group cursor-pointer"
                    >
                      <span className="text-2xl shrink-0">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors leading-snug">
                          {r.title}
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-background rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                <span className="text-3xl block mb-2">📂</span>
                <p className="text-gray-400 text-sm">Les ressources de ce groupe seront bientôt disponibles.</p>
              </div>
            )}

            {/* Espace collaboratif */}
            <div
              className="rounded-2xl p-6 border-2"
              style={{ background: gtt.bg, borderColor: `${gtt.color}30` }}
            >
              <h2 className="text-lg font-black text-gray-900 mb-2">💬 Espace collaboratif</h2>
              <p className="text-sm text-gray-600 mb-4">
                Réservé aux membres du groupe. Échangez, partagez des cas cliniques et collaborez sur les projets du GT.
              </p>
              <Link
                href="/espace-membre"
                className="inline-block px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
                style={{ background: gtt.color }}
              >
                Accéder à l&apos;espace membre →
              </Link>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Infos du groupe */}
            <div className="bg-background rounded-2xl border border-gray-100 p-5 card-shadow">
              <div
                className="flex items-center gap-3 p-3 rounded-xl mb-5"
                style={{ background: gtt.bg }}
              >
                <span className="text-3xl">{gtt.icon}</span>
                <div>
                  <p className="font-black text-gray-900 text-sm leading-tight">{gtt.name}</p>
                  <p className="text-xs text-gray-500 leading-tight mt-0.5">{gtt.fullName}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📅</span>
                  <div>
                    <p className="text-xs text-gray-400">Fréquence des réunions</p>
                    <p className="font-semibold text-gray-900">Trimestrielle</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <Link
                  href="/adhesion"
                  className="block w-full text-center py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
                  style={{ background: gtt.color }}
                >
                  Rejoindre ce groupe
                </Link>
              </div>
            </div>

            {/* Autres GTT */}
            <div className="bg-background rounded-2xl border border-gray-100 p-5 card-shadow">
              <h3 className="font-black text-gray-900 mb-4">Autres groupes de travail</h3>
              <div className="space-y-1.5">
                {otherGTTs.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/gtt/${g.slug}`}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg hover:bg-primary-light transition-colors"
                    style={{ color: "#475569" }}
                  >
                    <span>{g.icon}</span>
                    <span className="hover:text-primary transition-colors">{g.name}</span>
                  </Link>
                ))}
                <Link href="/gtt" className="block text-xs text-gray-400 hover:text-primary mt-2 text-center pt-1 border-t border-gray-100">
                  Voir tous les GTT →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
