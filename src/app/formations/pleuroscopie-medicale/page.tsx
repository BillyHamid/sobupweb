import Link from "next/link";
import PageHero from "@/components/PageHero";

const stats = [
  { value: "85–95%", label: "Rendement diagnostique", sub: "Dans les épanchements pleuraux exsudatifs non diagnostiqués" },
  { value: "73–80%", label: "Succès du talcage pleural à 3 mois", sub: "Gold standard pour les épanchements malins (méta-analyses ERS)" },
  { value: "< 0,35%", label: "Mortalité procédurale", sub: "Probablement < 0,1% pour les procédures diagnostiques seules" },
  { value: "30–45 min", label: "Durée moyenne de la procédure", sub: "Sous anesthésie locale + sédation consciente" },
];

const programme = [
  {
    jour: "Jour 1 — Fondamentaux et anatomie",
    color: "#31B9AE",
    bg: "#E8F9F7",
    modules: [
      {
        heure: "08h00 – 10h30",
        titre: "Module 1 — Bases anatomiques et physiopathologiques",
        type: "Théorique",
        items: [
          "Anatomie de la cavité pleurale : feuillets, ligaments, vaisseaux intercostaux",
          "Physiopathologie des épanchements pleuraux exsudatifs et transudatifs",
          "Critères de Light : différenciation exsudat / transudat",
          "Classification des épanchements par étiologie",
          "Place de la pleuroscopie dans l'algorithme diagnostique de l'épanchement pleural",
        ],
      },
      {
        heure: "10h30 – 13h00",
        titre: "Module 2 — Technique et matériel",
        type: "Théorique",
        items: [
          "Pleuroscope rigide vs semi-rigide (thoracoscope flexible) : avantages et limites",
          "Matériel nécessaire : trocart, optiques, pinces à biopsie, instruments de talcage",
          "Salle de procédure : configuration, monitoring, équipement de réanimation",
          "Anesthésie locale et sédation consciente : protocoles, agents, surveillance",
          "Positionnement du patient et repérage du site d'entrée",
          "Technique du pneumothorax artificiel (PAX) et instillation d'air",
        ],
      },
      {
        heure: "14h30 – 17h30",
        titre: "Atelier pratique n°1 — Simulateur anatomique",
        type: "Pratique",
        items: [
          "Simulation de l'introduction du trocart sur mannequin chirurgical",
          "Maniement du pleuroscope rigide et semi-rigide",
          "Identification des repères anatomiques intrathoraciques",
          "Techniques de biopsie pleurale guidée sous vue directe",
          "Groupes de 3 participants, supervisés par 1 formateur expert",
        ],
      },
    ],
  },
  {
    jour: "Jour 2 — Indications, complications et gestes thérapeutiques",
    color: "#065E52",
    bg: "#f0fafa",
    modules: [
      {
        heure: "08h00 – 10h30",
        titre: "Module 3 — Indications, contre-indications et bilan pré-procédure",
        type: "Théorique",
        items: [
          "Indications diagnostiques : épanchement exsudatif inexpliqué, suspicion de mésothéliome pleural, lymphome, cancer secondaire",
          "Indications thérapeutiques : talcage pleural, libération d'adhérences, drainage de pleurésies enkystées",
          "Contre-indications absolues et relatives (troubles de la coagulation, adhérences totales, instabilité hémodynamique)",
          "Bilan pré-procédural complet : EFR, gazométrie, bilan de coagulation, imagerie",
          "Information du patient et consentement éclairé",
        ],
      },
      {
        heure: "10h30 – 13h00",
        titre: "Module 4 — Anatomie endoscopique et aspects thérapeutiques",
        type: "Théorique",
        items: [
          "Aspect normal de la plèvre viscérale et pariétale en pleuroscopie",
          "Aspects pathologiques : plaques pleurales, nodules, tumeurs, fibrose",
          "Critères macroscopiques orientant vers mésothéliome, cancer secondaire, pleurésie infectieuse",
          "Talcage pleural : technique du spray vs poudre, dose, indications",
          "Drainage et fermeture : techniques de suture et prise en charge post-procédure",
          "Gestion des complications : pneumothorax persistant, emphysème sous-cutané, hémorragie",
        ],
      },
      {
        heure: "14h30 – 17h30",
        titre: "Atelier pratique n°2 — Cas cliniques vidéo et évaluation",
        type: "Pratique",
        items: [
          "Analyse de séquences vidéo commentées : pleuroscopies normales et pathologiques",
          "Exercices de biopsie sur modèle ex vivo",
          "Simulation de gestion d'une complication perti-procédurale",
          "Évaluation finale théorique et pratique",
          "Remise de l'attestation de formation SOBUP",
        ],
      },
    ],
  },
];

const indications = [
  {
    type: "Diagnostique",
    color: "#31B9AE",
    bg: "#E8F9F7",
    items: [
      { titre: "Épanchement exsudatif inexpliqué", desc: "1ère cause — rendement diagnostique 85–95% après biopsie pleurale guidée sous vue directe" },
      { titre: "Suspicion de mésothéliome pleural", desc: "Biopsie ciblée indispensable pour le diagnostic histologique et la stadification" },
      { titre: "Pleurésie métastatique", desc: "Identification de la lésion primitive, biopsies multiples, cellules malignes" },
      { titre: "Lymphome pleural", desc: "Biopsies pour immunohistochimie et classification histologique" },
      { titre: "Pleurésie tuberculeuse", desc: "Visualisation des granulomes, culture mycobactérienne sur biopsies" },
    ],
  },
  {
    type: "Thérapeutique",
    color: "#e67e22",
    bg: "#fff7ed",
    items: [
      { titre: "Talcage pleural (symphyse)", desc: "Gold standard pour la pleurodèse dans les épanchements pleuraux malins récidivants — efficacité 90–95%" },
      { titre: "Libération d'adhérences", desc: "Débridement des cloisonnements pleuraux, amélioration du drainage" },
      { titre: "Drainage de pleurésies enkystées", desc: "Évacuation sous contrôle visuel direct des collections localisées" },
      { titre: "Pleurostomie et tunnélisation", desc: "Mise en place d'un cathéter à demeure sous contrôle pleuroscopique" },
    ],
  },
];

const competences = [
  { icon: "🔬", titre: "Compétences techniques", items: ["Maîtrise du matériel pleuroscopique rigide et semi-rigide", "Réalisation du pneumothorax artificiel", "Biopsies pleurales guidées sous vue directe", "Technique de talcage pleural en spray", "Gestion des incidents et complications"] },
  { icon: "🏥", titre: "Compétences cliniques", items: ["Sélection rigoureuse des patients et bilan pré-procédure", "Interprétation macroscopique des aspects pleuraux", "Intégration des résultats dans la démarche diagnostique", "Prise en charge des suites post-procédurales", "Information et communication avec le patient"] },
  { icon: "📋", titre: "Compétences organisationnelles", items: ["Rédaction du compte rendu de pleuroscopie", "Organisation de la salle de procédure", "Protocoles de sécurité et de vigilance", "Codification et nomenclature des actes", "Traçabilité et archivage"] },
];

export default function PleuroscopieMedicalePage() {
  return (
    <>
      <PageHero
        title="Pleuroscopie médicale"
        subtitle="Formation certifiante à la thoracoscopie médicale — Maîtrisez le geste de référence pour le diagnostic et le traitement des maladies pleurales complexes."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Formations", href: "/formations" },
          { label: "Pleuroscopie médicale" },
        ]}
        tag="Formation avancée — 2 jours"
        shape="diagonal-right"
      />

      {/* ── Stats clés ── */}
      <section className="py-10 bg-background border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.value} className="rounded-2xl p-5 text-center border border-gray-100 hover:shadow-md transition-shadow" style={{ background: "#f0fafa" }}>
              <p className="text-3xl font-black mb-1" style={{ color: "#31B9AE" }}>{s.value}</p>
              <p className="text-sm font-bold text-gray-700 leading-tight mb-1">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Introduction ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                Qu'est-ce que la pleuroscopie médicale ?
              </span>
              <h2 className="text-3xl font-black text-gray-900 mb-5 leading-tight">
                Le regard direct<br />
                <span style={{ color: "#31B9AE" }}>dans la cavité pleurale</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                La <strong>pleuroscopie médicale</strong> — également appelée thoracoscopie médicale — est un examen endoscopique de la cavité pleurale réalisé par le pneumologue, sous anesthésie locale et sédation consciente. Elle se distingue de la thoracoscopie chirurgicale (VATS) par sa réalisation en dehors du bloc opératoire, sous ventilation spontanée.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                En Afrique, les pleurésies représentent une cause majeure de consultation en pneumologie. Tuberculose, cancers pleuraux, mésothéliome : autant de pathologies pour lesquelles la pleuroscopie offre un <strong>rendement diagnostique incomparable</strong> — là où les biopsies à l'aveugle échouent dans plus de 40% des cas.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Sur le plan thérapeutique, le talcage pleural sous pleuroscopie constitue le <strong>gold standard</strong> pour la symphyse pleurale dans les épanchements malins récidivants, avec une efficacité de 90 à 95%.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Réalisable sous anesthésie locale + sédation légère, sans intubation",
                  "Rendement diagnostique 85–95% dans les pleurésies inexpliquées",
                  "Gold standard pour le talcage pleural (épanchements malins)",
                  "Mortalité < 1% dans les centres formés",
                  "Technique enseignée selon les guidelines ERS / ATS / BTS",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-black" style={{ background: "#31B9AE" }}>✓</span>
                    <span className="text-gray-700 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Encart distinction */}
            <div className="space-y-4">
              <div className="rounded-2xl p-6 border-2 border-gray-100" style={{ background: "#f0fafa" }}>
                <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: "#31B9AE" }}>M</span>
                  Pleuroscopie <span style={{ color: "#31B9AE" }}>médicale</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {["Réalisée par le pneumologue", "Anesthésie locale + sédation consciente", "Patient en ventilation spontanée", "Hors bloc opératoire (salle d'endoscopie)", "Pleuroscope rigide ou semi-rigide", "Biopsies, talcage, drainage"].map(item => (
                    <li key={item} className="flex items-center gap-2"><span style={{ color: "#31B9AE" }}>•</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl p-6 border-2 border-gray-100 opacity-70">
                <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white bg-gray-400">C</span>
                  Thoracoscopie <span className="text-gray-500">chirurgicale (VATS)</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {["Réalisée par le chirurgien thoracique", "Anesthésie générale + intubation sélective", "Patient sous ventilation mécanique", "Bloc opératoire obligatoire", "Plusieurs trocarts (2–3 ports)", "Résections pulmonaires, chirurgie pleurale lourde"].map(item => (
                    <li key={item} className="flex items-center gap-2"><span className="text-gray-400">•</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programme ── */}
      <section className="py-16" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Programme
            </span>
            <h2 className="text-3xl font-black text-gray-900">Contenu de la formation</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">2 jours intensifs — 16 heures dont 6h d'ateliers sur simulateur et modèles ex vivo, en petits groupes</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {programme.map((jour) => (
              <div key={jour.jour} className="rounded-2xl overflow-hidden border border-gray-200 bg-background">
                <div className="px-6 py-4 font-black text-white text-base" style={{ background: jour.color }}>
                  {jour.jour}
                </div>
                <div className="p-2">
                  {jour.modules.map((mod, i) => (
                    <div key={i} className="p-4 rounded-xl mb-2" style={{ background: i % 2 === 0 ? jour.bg : "transparent" }}>
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                          style={{
                            background: mod.type === "Pratique" ? "#fff7ed" : "#f1f5f9",
                            color: mod.type === "Pratique" ? "#e67e22" : "#475569"
                          }}>
                          {mod.type === "Pratique" ? "🔬 Pratique" : "📖 Théorique"}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{mod.heure}</span>
                      </div>
                      <h4 className="font-black text-gray-900 text-sm mb-2">{mod.titre}</h4>
                      <ul className="space-y-1">
                        {mod.items.map((item, j) => (
                          <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                            <span style={{ color: jour.color }} className="mt-0.5 shrink-0">›</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Indications ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Indications enseignées
            </span>
            <h2 className="text-3xl font-black text-gray-900">Diagnostique & thérapeutique</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {indications.map((cat) => (
              <div key={cat.type} className="rounded-2xl overflow-hidden border border-gray-100">
                <div className="px-6 py-4 font-black text-lg" style={{ background: cat.bg, color: cat.color }}>
                  {cat.type === "Diagnostique" ? "🔍" : "⚕️"} Indications {cat.type}s
                </div>
                <div className="p-5 bg-background space-y-4">
                  {cat.items.map((item) => (
                    <div key={item.titre} className="flex gap-3">
                      <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: cat.color }} />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{item.titre}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compétences acquises ── */}
      <section className="py-16" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Compétences
            </span>
            <h2 className="text-3xl font-black text-gray-900">Ce que vous maîtriserez</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {competences.map((cat) => (
              <div key={cat.titre} className="bg-background rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h4 className="font-black text-gray-900 mb-4">{cat.titre}</h4>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: "#31B9AE" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Infos pratiques + public ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Public cible */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                Public cible
              </span>
              <h2 className="text-2xl font-black text-gray-900 mb-6">À qui s'adresse cette formation ?</h2>
              <div className="space-y-3">
                {[
                  { icon: "🫁", label: "Pneumologues en exercice", desc: "Compétence essentielle dans la prise en charge des pathologies pleurales" },
                  { icon: "🎓", label: "Internes en pneumologie (DES)", desc: "Formation initiale recommandée en fin de cursus" },
                  { icon: "🏥", label: "Pneumologues débutants", desc: "Acquisition d'une compétence procédurale de haut niveau dès l'installation" },
                ].map((p) => (
                  <div key={p.label} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 rounded-xl border-l-4" style={{ borderColor: "#e67e22", background: "#fff7ed" }}>
                <p className="text-sm font-bold text-gray-900 mb-1">⚠️ Prérequis obligatoires</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Diplôme de médecin (ou équivalent) obligatoire</li>
                  <li>• Connaissance de base des pathologies pleurales recommandée</li>
                  <li>• Formation à la bronchoscopie souple conseillée</li>
                  <li>• Aucune expérience préalable en pleuroscopie requise</li>
                </ul>
              </div>
            </div>

            {/* Infos pratiques */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-6 py-5 font-black text-white text-lg" style={{ background: "linear-gradient(135deg, #065E52 0%, #31B9AE 100%)" }}>
                Informations pratiques
              </div>
              <div className="p-6 bg-background space-y-5">
                {[
                  { icon: "📅", label: "Format", value: "2 jours consécutifs (vendredi + samedi)" },
                  { icon: "⏱", label: "Volume horaire", value: "16h dont 6h d'ateliers pratiques sur simulateur" },
                  { icon: "👥", label: "Encadrement", value: "1 formateur expert pour 3 participants maximum" },
                  { icon: "🔬", label: "Équipement", value: "Pleuroscopes rigides et semi-rigides mis à disposition" },
                  { icon: "📍", label: "Lieu", value: "Centre hospitalier universitaire — Ouagadougou" },
                  { icon: "🏅", label: "Certification", value: "Attestation officielle SOBUP + ERS recognition" },
                  { icon: "💰", label: "Tarif", value: "Tarif préférentiel membres SOBUP — Voir programme" },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{info.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{info.label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 100%)" }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Devenez expert en pleuroscopie médicale</h2>
          <p className="text-white/75 mb-8 text-lg">
            Acquérez le geste de référence pour le diagnostic des pleurésies complexes et le traitement des épanchements malins. Formation limitée à 12 participants.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/adhesion"
              className="px-8 py-3.5 rounded-xl font-black text-white text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: "#e67e22" }}>
              S'inscrire à la formation →
            </Link>
            <Link href="/contact"
              className="px-8 py-3.5 rounded-xl font-black text-sm border-2 transition-all hover:-translate-y-0.5"
              style={{ color: "#7EEAE4", borderColor: "rgba(126,234,228,0.45)", background: "rgba(49,185,174,0.1)" }}>
              Contacter la SOBUP
            </Link>
          </div>
          <p className="text-white/50 text-xs mt-6">Places limitées à 12 participants · Attestation officielle SOBUP · Matériel fourni</p>
        </div>
      </section>
    </>
  );
}
