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

export default function AProposPage() {
  return (
    <>
      <PageHero
        title="À propos de la SOBUP"
        subtitle="Société savante de référence en santé respiratoire au Burkina Faso depuis 2007."
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
              Association apolitique, non confessionnelle et à but non lucratif, la SOBUP rassemble les pneumologues, médecins généralistes, internes, résidents, paramédicaux et chercheurs autour d&apos;une mission commune : améliorer la santé respiratoire de tous les Burkinabè.
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
                Promouvoir l&apos;excellence en pneumologie à travers la formation continue, la recherche scientifique, la production de recommandations adaptées au contexte national et le plaidoyer auprès des décideurs.
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

    </>
  );
}
