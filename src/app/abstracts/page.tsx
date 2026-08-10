import PageHero from "@/components/PageHero";
import AbstractForm from "./AbstractForm";

export default function AbstractsPage() {
  const annee = new Date().getFullYear();
  const anneeImpaire = annee % 2 !== 0;
  const evenement = anneeImpaire
    ? { slug: "congres-9", label: "9ème Congrès SOBUP", icon: "🏛️", color: "#E91E63", bg: "#fce4ec" }
    : {
        slug: "journee-regionale",
        label: `Journée Scientifique Régionale ${annee}`,
        icon: "🏥", color: "#31B9AE", bg: "#E8F9F7",
      };

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
              <p className="font-black text-amber-900">
                Période de soumission : du 31 Juillet au 30 Septembre {annee}
              </p>
              <p className="text-sm text-amber-700">
                Les abstracts acceptés seront notifiés après la clôture des soumissions. Les auteurs
                devront s&apos;inscrire à la journée scientifique pour présenter leur travail.
              </p>
            </div>
          </div>

          <AbstractForm evenement={evenement} />
        </div>
      </section>
    </>
  );
}
