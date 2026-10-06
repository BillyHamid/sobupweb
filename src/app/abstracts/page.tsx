import PageHero from "@/components/PageHero";
import AbstractForm from "./AbstractForm";
import { SUBMISSION_WINDOW_LABEL, SUBMISSION_DEADLINE_LABEL, submissionsClosed } from "@/lib/abstracts";

// Sans cela la page serait pré-rendue au build : la date de clôture serait
// évaluée une fois pour toutes et le formulaire ne fermerait jamais.
export const dynamic = "force-dynamic";

export default function AbstractsPage() {
  const closed = submissionsClosed();
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
        tag={`Journée Scientifique ${annee} — Soumissions ${SUBMISSION_WINDOW_LABEL}`}
        shape="sharp"
      />

      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-4xl px-4">
          {closed ? (
            <div className="bg-background rounded-2xl p-8 sm:p-10 border border-gray-100 card-shadow text-center">
              <span className="text-5xl block mb-4" aria-hidden="true">🔒</span>
              <h2 className="text-2xl font-black text-gray-900 mb-3">Les soumissions sont closes</h2>
              <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
                La période de dépôt des abstracts s&apos;est achevée le{" "}
                <strong className="text-gray-700">{SUBMISSION_DEADLINE_LABEL}</strong>. Le comité
                scientifique examine actuellement les travaux reçus ; chaque auteur sera informé
                de la décision par email.
              </p>
              <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed mt-5">
                Vous avez soumis un abstract et n&apos;avez pas reçu d&apos;accusé de réception, ou
                votre situation justifie un examen particulier ? Écrivez au secrétariat à{" "}
                <a href="mailto:sobup01@gmail.com" className="font-semibold" style={{ color: "#065e52" }}>
                  sobup01@gmail.com
                </a>.
              </p>
            </div>
          ) : (
            <>
              {/* Info deadline */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 flex items-center gap-4 mb-8">
                <span className="text-3xl">⏰</span>
                <div>
                  <p className="font-black text-amber-900">
                    Période de soumission prolongée : {SUBMISSION_WINDOW_LABEL}
                  </p>
                  <p className="text-sm text-amber-700">
                    Les abstracts acceptés seront notifiés après la clôture des soumissions. Les auteurs
                    devront s&apos;inscrire à la journée scientifique pour présenter leur travail.
                  </p>
                </div>
              </div>

              <AbstractForm evenement={evenement} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
