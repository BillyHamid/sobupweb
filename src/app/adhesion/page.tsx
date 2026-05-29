import PageHero from "@/components/PageHero";
import Link from "next/link";

export default function AdhesionPage() {
  return (
    <>
      <PageHero
        title="Adhésion à la SOBUP"
        subtitle="Rejoignez la société savante de référence en pneumologie au Burkina Faso. Paiement en ligne par Orange Money, Wave ou carte bancaire."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Adhésion" }]}
        tag="Devenir membre"
        shape="diagonal-left"
      />

      {/* Avantages */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-base font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Pourquoi adhérer</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Les avantages de la SOBUP</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🔬", title: "Groupes de travail", desc: "Rejoignez les GTT de votre spécialité" },
              { icon: "🎓", title: "Formations gratuites", desc: "E-learning et webinaires inclus" },
              { icon: "📋", title: "Recommandations", desc: "Accès à toutes les publications" },
              { icon: "🏆", title: "Congrès annuel", desc: "Tarifs préférentiels membres" },
              { icon: "📜", title: "Attestations", desc: "Générées automatiquement" },
              { icon: "🤝", title: "Réseau national", desc: "150+ pneumologues en réseau" },
              { icon: "🌍", title: "Visibilité", desc: "Profil dans l'annuaire national" },
              { icon: "🗳️", title: "Gouvernance", desc: "Droit de vote en AG" },
            ].map((item) => (
              <div key={item.title} className="text-center p-5 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all"
                style={{ "--hover-color": "#31B9AE" } as React.CSSProperties}>
                <span className="text-4xl block mb-3">{item.icon}</span>
                <p className="font-bold text-gray-900 text-lg mb-1.5">{item.title}</p>
                <p className="text-base text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-lg font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Cotisation annuelle</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Une cotisation annuelle unique</h2>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-background rounded-3xl border-2 p-8 sm:p-10 card-shadow shadow-xl text-center" style={{ borderColor: "#31B9AE" }}>
              <span className="inline-block text-sm font-black text-white px-4 py-1 rounded-full mb-6" style={{ background: "#e67e22" }}>⭐ Adhésion membre</span>
              <div className="flex items-end justify-center gap-2">
                <span className="text-6xl font-black leading-none" style={{ color: "#31B9AE" }}>30 000</span>
                <span className="text-gray-400 text-xl font-bold mb-1">XOF</span>
              </div>
              <p className="text-gray-500 text-base mt-3 mb-8">par an — valable 12 mois</p>
              <ul className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                {[
                  "Accès complet à l'espace membre",
                  "Adhésion à tous les groupes de travail (GTT)",
                  "Toutes les formations gratuites",
                  "Tarif préférentiel au congrès annuel",
                  "Téléchargement des recommandations",
                  "Attestations de participation",
                  "Droit de vote en Assemblée Générale",
                ].map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5 text-base text-gray-700">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#31B9AE" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                    </svg>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link href="/espace-membre"
                className="block w-full text-center py-4 rounded-xl font-black text-base text-white transition-all hover:-translate-y-0.5"
                style={{ background: "#31B9AE" }}>
                Adhérer maintenant →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
