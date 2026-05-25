import PageHero from "@/components/PageHero";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Nous contacter"
        subtitle="Une question, une suggestion ou besoin d'information sur la SOBUP ? Notre équipe vous répond sous 48h."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
        shape="arrow-down"
      />

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-3 gap-8">

          {/* Formulaire */}
          <div className="md:col-span-2 bg-background rounded-2xl p-8 border border-gray-100 card-shadow">
            <h2 className="text-xl font-black text-gray-900 mb-6">Envoyer un message</h2>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom & Nom</label>
                  <input type="text" placeholder="Dr. Kaboré Aristide"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                  <input type="email" placeholder="votre@email.bf"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Sujet</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all text-gray-600">
                  <option>Adhésion et cotisation</option>
                  <option>Groupes de travail (GTT)</option>
                  <option>Événements et congrès</option>
                  <option>Formations et webinaires</option>
                  <option>Journal scientifique</option>
                  <option>Partenariat</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Message</label>
                <textarea rows={5} placeholder="Votre message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all resize-none"/>
              </div>
              <button type="submit"
                className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "#31B9AE" }}>
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Sidebar infos */}
          <div className="space-y-5">
            {[
              { icon: "📍", title: "Siège social", content: "Service de Pneumologie\nCHU Yalgado Ouédraogo\nOuagadougou, Burkina Faso" },
              { icon: "📧", title: "Email", content: "contact@sobup.bf" },
              { icon: "🌐", title: "Site web", content: "www.sobup.bf" },
              { icon: "📅", title: "Heures de bureau", content: "Lun–Ven : 8h00 – 17h00\nSamedi : 8h00 – 12h00" },
            ].map((info) => (
              <div key={info.title} className="bg-background rounded-2xl p-5 border border-gray-100 card-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{info.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">{info.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{info.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Partenaires */}
            <div className="bg-background rounded-2xl p-5 border border-gray-100 card-shadow">
              <p className="font-bold text-gray-900 text-sm mb-3">🌍 Partenaires scientifiques</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 font-semibold">
                {["SAPLF", "PATS", "PNT"].map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-full" style={{ background: "#E8F9F7", color: "#31B9AE" }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
