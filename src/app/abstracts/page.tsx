import PageHero from "@/components/PageHero";

export default function AbstractsPage() {
  const annee = new Date().getFullYear();
  const anneeImpaire = annee % 2 !== 0;
  const evenement = anneeImpaire
    ? { label: "9ème Congrès SOBUP", icon: "🏛️", color: "#E91E63", bg: "#fce4ec" }
    : { label: "Journée Scientifique Régionale", icon: "🏥", color: "#31B9AE", bg: "#E8F9F7" };

  return (
    <>
      <PageHero
        title="Soumission d'abstracts"
        subtitle="Déposez vos travaux scientifiques — communications orales, posters, cas cliniques — pour la Journée Scientifique Régionale."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Abstracts" }]}
        tag={`Journée Scientifique ${annee} — Soumissions du 31 Juillet au 30 Septembre`}
        shape="sharp"
      />

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-4xl px-4">
          {/* Info deadline */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-center gap-4 mb-8">
            <span className="text-3xl">⏰</span>
            <div>
              <p className="font-black text-amber-900">Période de soumission : du 31 Juillet au 30 Septembre {annee}</p>
              <p className="text-sm text-amber-700">Les abstracts acceptés seront notifiés après la clôture des soumissions. Les auteurs devront s'inscrire à la journée scientifique pour présenter leur travail.</p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-background rounded-2xl p-8 border border-gray-100 card-shadow">
            <h2 className="text-xl font-black text-gray-900 mb-6">Formulaire de soumission</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Type de soumission *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "oral", label: "Communication orale", icon: "🎤" },
                    { value: "poster", label: "Poster", icon: "📊" },
                  ].map((t) => (
                    <label key={t.value} className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-primary transition-colors text-center">
                      <input type="radio" name="type" value={t.value} className="sr-only"/>
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-xs font-bold text-gray-700">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom & Nom (auteur principal) *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email *</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Co-auteurs</label>
                <input type="text" placeholder="Dupont A., Martin B., ..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all"/>
              </div>


              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Titre de l&apos;abstract *</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all"/>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Texte de l&apos;abstract * <span className="font-normal text-gray-400">(max. 300 mots)</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">Structure recommandée : Introduction — Méthodes — Résultats — Conclusion — Mots clés</p>
                <textarea rows={8} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 transition-all resize-none"/>
              </div>

              <div className="rounded-xl border-2 p-4 flex items-center gap-3" style={{ borderColor: evenement.color, background: evenement.bg }}>
                <span className="text-2xl shrink-0">{evenement.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: evenement.color }}>Événement cible — {annee}</p>
                  <p className="text-sm font-black text-gray-900">{evenement.label}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Fichier joint (optionnel)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <span className="text-3xl block mb-2">📎</span>
                  <p className="text-sm font-semibold text-gray-600">Glisser-déposer un fichier ou cliquer pour sélectionner</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — max. 5 Mo</p>
                </div>
              </div>

              <button type="submit"
                className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "#31B9AE" }}>
                Soumettre l&apos;abstract
              </button>
              <p className="text-xs text-gray-400 text-center">
                Vous recevrez un accusé de réception par email. Suivi de votre soumission disponible dans l&apos;espace membre.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
