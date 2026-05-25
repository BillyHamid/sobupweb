import PageHero from "@/components/PageHero";
import Link from "next/link";

const membershipTypes = [
  { id: "titulaire", label: "Membre Titulaire", price: "15 000 XOF", period: "/ an", target: "Médecins spécialistes en pneumologie", color: "#31B9AE", popular: false, perks: ["Accès complet à l'espace membre", "Adhésion à tous les GTT", "Toutes les formations gratuites", "Tarif préférentiel congrès", "Téléchargement des recommandations", "Attestations de participation", "Vote en Assemblée Générale"] },
  { id: "associe", label: "Membre Associé", price: "10 000 XOF", period: "/ an", target: "Médecins généralistes, paramédicaux, chercheurs", color: "#31B9AE", popular: true, perks: ["Accès à l'espace membre", "Adhésion à 2 GTT au choix", "Formations à tarif réduit", "Tarif préférentiel congrès", "Téléchargement des recommandations", "Attestations de participation"] },
  { id: "etudiant", label: "Membre Étudiant", price: "5 000 XOF", period: "/ an", target: "Internes, résidents, étudiants en médecine", color: "#5BCEC4", popular: false, perks: ["Accès à l'espace membre", "Adhésion à 1 GTT au choix", "Formations gratuites sélectionnées", "Tarif étudiant congrès", "Téléchargement des recommandations"] },
];

const paymentMethods = [
  { name: "Orange Money", logo: "🟠", desc: "Paiement via votre numéro Orange", color: "#FF6B00" },
  { name: "Wave", logo: "〰️", desc: "Paiement via l'application Wave", color: "#1BA8E0" },
  { name: "Carte bancaire", logo: "💳", desc: "Visa, Mastercard — sécurisé SSL", color: "#065E52" },
];

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
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Pourquoi adhérer</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Les avantages de la SOBUP</h2>
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
              <div key={item.title} className="text-center p-4 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all"
                style={{ "--hover-color": "#31B9AE" } as React.CSSProperties}>
                <span className="text-2xl block mb-2">{item.icon}</span>
                <p className="font-bold text-gray-900 text-sm mb-1">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Cotisation annuelle</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Choisissez votre formule</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {membershipTypes.map((type) => (
              <div key={type.id}
                className={`bg-background rounded-2xl border-2 p-6 flex flex-col relative card-shadow ${type.popular ? "shadow-xl" : ""}`}
                style={{ borderColor: type.popular ? type.color : "#e2e8f0" }}>
                {type.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black text-white px-4 py-1 rounded-full"
                    style={{ background: "#e67e22" }}>
                    ⭐ Recommandé
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="font-black text-gray-900 text-lg mb-1">{type.label}</h3>
                  <p className="text-xs text-gray-500 mb-4">{type.target}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black" style={{ color: type.color }}>{type.price}</span>
                    <span className="text-gray-400 text-sm mb-1">{type.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {type.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: type.color }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg>
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link href="/espace-membre"
                  className="block w-full text-center py-3 rounded-xl font-black text-sm transition-all hover:-translate-y-0.5"
                  style={type.popular ? { background: type.color, color: "white" } : { border: `2px solid ${type.color}`, color: type.color }}>
                  Adhérer maintenant →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modes de paiement */}
      <section className="py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-xl font-black text-gray-900">Modes de paiement acceptés</h2>
            <p className="text-gray-500 text-sm mt-1">Paiement 100% sécurisé — reçu automatique par email</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {paymentMethods.map((pm) => (
              <div key={pm.name} className="text-center p-6 rounded-2xl border-2 border-gray-100 hover:shadow-md transition-all">
                <span className="text-4xl block mb-3">{pm.logo}</span>
                <p className="font-black text-gray-900 mb-1">{pm.name}</p>
                <p className="text-xs text-gray-500">{pm.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            🔒 Paiement sécurisé SSL · Reçu envoyé automatiquement · Accès immédiat après paiement
          </p>
        </div>
      </section>
    </>
  );
}
