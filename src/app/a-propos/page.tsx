import PageHero from "@/components/PageHero";
import Image from "next/image";

const values = [
  { icon: "🔐", title: "Intégrité scientifique", desc: "Rigueur et honnêteté dans toutes nos productions scientifiques." },
  { icon: "🏆", title: "Excellence clinique", desc: "Promotion des meilleures pratiques en pneumologie." },
  { icon: "👥", title: "Collaboration", desc: "Travail collectif entre membres, institutions et partenaires." },
  { icon: "🔬", title: "Innovation", desc: "Recherche de nouvelles solutions pour la santé respiratoire." },
  { icon: "⚖️", title: "Équité", desc: "Accès équitable aux soins pour toute la population burkinabè." },
  { icon: "💎", title: "Engagement", desc: "Dévouement au service de la population et de la science." },
];

const congressHistory = [
  { year: "2011", ordinal: "1ᵉʳ", color: "#2D7DD2", theme: "Poumon et environnement", place: "Salle de conférences Ouaga 2000, Ouagadougou" },
  { year: "2013", ordinal: "2ᵉ", color: "#F03E3E", theme: "Asthme, Allergologie et Antibiothérapie", place: "Palm Beach Hôtel, Ouagadougou" },
  { year: "2015", ordinal: "3ᵉ", color: "#F59F00", theme: "Poumon et environnement", place: "Palm Beach Hôtel, Ouagadougou" },
  { year: "2017", ordinal: "4ᵉ", color: "#E64980", theme: "Pneumologie tropicale et approches thérapeutiques nouvelles", place: "CHU Blaise Compaoré, Ouagadougou" },
  { year: "2019", ordinal: "5ᵉ", color: "#2B2D33", theme: "Innovation en pratique pneumologique au Burkina Faso", place: "Bravia Hôtel, Ouagadougou" },
  { year: "2021", ordinal: "6ᵉ", color: "#228BE6", theme: "Pathologies respiratoires et situation de crise", place: "Hôtel Silsiman, Bobo-Dioulasso" },
  { year: "2023", ordinal: "7ᵉ", color: "#7048E8", theme: "Pathologies respiratoires professionnelles", place: "Bravia Hôtel, Ouagadougou" },
  { year: "2025", ordinal: "8ᵉ", color: "#37B24D", theme: "Pratique de la pneumologie au Burkina Faso à l'ère des technologies nouvelles", place: "Azalaï Hôtel, Ouagadougou" },
];

export default function AProposPage() {
  return (
    <>
      <PageHero
        title="À propos de la SOBUP"
        subtitle="Société savante de référence en santé respiratoire au Burkina Faso depuis plus de 15 ans."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
        shape="wave"
      />

      {/* Présentation */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Qui sommes-nous</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-5 section-title">
              La SOBUP en quelques mots
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              La <strong>Société Burkinabè de Pneumologie (SOBUP)</strong> est une société savante médicale créée conformément à la législation en vigueur au Burkina Faso, dont le siège social se trouve à Ouagadougou, au Service de Pneumologie du CHU Yalgado Ouédraogo.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Association apolitique, non confessionnelle et à but non lucratif, la SOBUP rassemble les pneumologues, médecins généralistes, internes, résidents, paramédicaux et chercheurs autour d'une mission commune : améliorer la santé respiratoire de tous les Burkinabè.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notre devise — <em>« La santé respiratoire, un droit pour tout Burkinabè »</em> — guide chacune de nos actions de formation, de recherche et de plaidoyer.
            </p>
            <div className="mt-6 flex gap-4 flex-wrap">
              <div className="bg-primary-light rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black" style={{ color: "#31B9AE" }}>150+</p>
                <p className="text-xs text-gray-500 font-medium">Membres actifs</p>
              </div>
              <div className="bg-primary-light rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black" style={{ color: "#31B9AE" }}>11</p>
                <p className="text-xs text-gray-500 font-medium">Groupes de travail</p>
              </div>
              <div className="bg-primary-light rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black" style={{ color: "#31B9AE" }}>8</p>
                <p className="text-xs text-gray-500 font-medium">Congrès organisés</p>
              </div>
              <div className="bg-primary-light rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black" style={{ color: "#31B9AE" }}>99 ans</p>
                <p className="text-xs text-gray-500 font-medium">Durée statutaire</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-xl" style={{ aspectRatio: "4/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/congres-8.jpg"
              alt="Équipe SOBUP au 9ème Congrès annuel"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="py-16" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Orientations stratégiques</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Vision, Mission & Objectifs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background rounded-2xl p-8 shadow-sm border-t-4 card-shadow" style={{ borderColor: "#31B9AE" }}>
              <span className="text-3xl block mb-4">🔭</span>
              <h3 className="text-xl font-black text-gray-900 mb-3">Notre Vision</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Être la référence scientifique incontournable en santé respiratoire au Burkina Faso, contribuant à la réduction de la morbidité et de la mortalité liées aux maladies respiratoires.
              </p>
            </div>
            <div className="bg-background rounded-2xl p-8 shadow-sm border-t-4 card-shadow" style={{ borderColor: "#5BCEC4" }}>
              <span className="text-3xl block mb-4">🎯</span>
              <h3 className="text-xl font-black text-gray-900 mb-3">Notre Mission</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Promouvoir l'excellence en pneumologie à travers la formation continue, la recherche scientifique, la production de recommandations adaptées au contexte national et le plaidoyer auprès des décideurs.
              </p>
            </div>
            <div className="bg-background rounded-2xl p-8 shadow-sm border-t-4 card-shadow" style={{ borderColor: "#e67e22" }}>
              <span className="text-3xl block mb-4">📋</span>
              <h3 className="text-xl font-black text-gray-900 mb-3">Nos Objectifs</h3>
              <ul className="text-gray-600 text-base leading-relaxed space-y-1.5">
                <li>• Fédérer les pneumologues du Burkina Faso</li>
                <li>• Organiser la formation médicale continue</li>
                <li>• Diffuser les travaux de recherche</li>
                <li>• Élaborer des recommandations nationales</li>
                <li>• Sensibiliser le grand public</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Ce qui nous guide</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Nos valeurs fondamentales</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-primary hover:shadow-md transition-all"
                style={{ "--tw-border-opacity": "1" } as React.CSSProperties}>
                <span className="text-2xl shrink-0">{v.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h4>
                  <p className="text-base text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historique — frise des congrès */}
      <section className="py-16 banniere-sobup">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest mb-2 text-secondary-light" style={{ color: "#5BCEC4" }}>Notre parcours</p>
            <h2 className="text-2xl md:text-3xl font-black text-white">Historique des congrès</h2>
            <p className="mt-3 text-sm text-white/80 max-w-2xl mx-auto">
              Huit congrès internationaux de pneumologie, de 2011 à 2025 — thèmes et lieux des rencontres scientifiques.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-8 overflow-x-auto">
            <div className="flex items-stretch w-full">
              {congressHistory.map((c, i) => {
                const above = i % 2 === 1;
                const label = (
                  <div className="px-3">
                    <p className="font-black text-sm" style={{ color: c.color }}>{c.ordinal} Congrès</p>
                    <p className="text-xs text-gray-600 leading-snug mt-1">{c.theme} – {c.place}.</p>
                  </div>
                );
                return (
                  <div
                    key={c.year}
                    className="flex flex-1 min-w-[7rem] flex-col"
                    style={{ marginLeft: i === 0 ? 0 : -14 }}
                  >
                    <div className="flex h-32 items-end pb-3">{above ? label : null}</div>
                    <div
                      className="flex h-11 items-center justify-center font-black text-white text-lg tracking-wide"
                      style={{
                        background: c.color,
                        clipPath:
                          i === 0
                            ? "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)"
                            : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)",
                      }}
                    >
                      {c.year}
                    </div>
                    <div className="flex h-32 items-start pt-3">{!above ? label : null}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
