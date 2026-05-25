import Link from "next/link";
import PageHero from "@/components/PageHero";

const stats = [
  { value: "92%", label: "Sensibilité pour le diagnostic de pneumonie", sub: "Méta-analyse Orso et al., 5 108 patients" },
  { value: "98,2%", label: "Spécificité pour le pneumothorax", sub: "vs 46% pour la radiographie standard" },
  { value: "5 min", label: "Pour orienter un diagnostic de dyspnée aiguë", sub: "vs 104,5 min en méthode conventionnelle" },
  { value: ">90%", label: "Précision diagnostique (protocole BLUE)", sub: "En défaillance respiratoire aiguë" },
];

const programme = [
  {
    jour: "Jour 1",
    color: "#31B9AE",
    bg: "#E8F9F7",
    modules: [
      {
        heure: "08h00 – 11h00",
        titre: "Module 1 — Bases de l'échographie thoracique",
        type: "Théorique",
        items: [
          "Physique des ultrasons : génération, propagation, réflexion",
          "Formation de l'image : résolution, contraste, artefacts",
          "Choix de la sonde (convexe 2–5 MHz, linéaire haute fréquence)",
          "Anatomie échographique du thorax normal",
          "Artefacts fondamentaux : lignes A, lignes B, signe de glissement",
        ],
      },
      {
        heure: "11h00 – 13h00",
        titre: "Module 2 — Pathologies pleurales",
        type: "Théorique",
        items: [
          "Épanchement pleural : sémiologie, quantification, caractérisation",
          "Pneumothorax : signe de stratosphère, abolition du glissement, point pulmonaire",
          "Hydropneumothorax et épanchements complexes",
          "Ponction pleurale échoguidée : technique et balisage",
        ],
      },
      {
        heure: "14h30 – 17h30",
        titre: "Atelier pratique n°1 — Thorax normal",
        type: "Pratique",
        items: [
          "Identification des fenêtres acoustiques (antérieure, latérale, postérieure)",
          "Reconnaissance du glissement pleural et des artefacts normaux",
          "Réglages machine : gain, profondeur, focalisation",
          "Séance sur sujet sain (groupes de 4 participants / 1 formateur)",
        ],
      },
    ],
  },
  {
    jour: "Jour 2",
    color: "#e67e22",
    bg: "#fff7ed",
    modules: [
      {
        heure: "08h00 – 11h00",
        titre: "Module 3 — Parenchyme pulmonaire & protocoles",
        type: "Théorique",
        items: [
          "Syndrome interstitiel : lignes B confluentes, œdème pulmonaire, pneumopathie interstitielle",
          "Consolidation alvéolaire : bronchogramme aérique, diagnostic de pneumonie / atélectasie",
          "Mobilité diaphragmatique : paralysie et dysfonction",
          "Protocole BLUE : algorithme décisionnel en détresse respiratoire",
          "Protocole FALLS : aide au remplissage vasculaire en état de choc",
        ],
      },
      {
        heure: "11h00 – 13h00",
        titre: "Module 4 — Gestes guidés & évaluation",
        type: "Théorique",
        items: [
          "Ponction pleurale échoguidée : guidage en temps réel",
          "Drainage thoracique échoguidé : indications et technique",
          "Rédaction d'un compte rendu selon la nomenclature internationale",
          "Archivage et traçabilité des images",
        ],
      },
      {
        heure: "14h30 – 17h30",
        titre: "Atelier pratique n°2 — Cas cliniques supervisés",
        type: "Pratique",
        items: [
          "Analyse de cas vidéo annotés (épanchements, pneumonies, pneumothorax)",
          "Exercices sur patients pathologiques supervisés",
          "Évaluation finale sur cas cliniques",
          "Remise de l'attestation de formation SOBUP",
        ],
      },
    ],
  },
];

const indications = [
  { pathologie: "Épanchement pleural", signe: "Espace anéchogène, signe de la sinusoïde", perf: "Spécificité 83–92 %" },
  { pathologie: "Pneumothorax", signe: "Abolition du glissement, signe de stratosphère, point pulmonaire", perf: "Sensibilité 82,9 % / Spécificité 98,2 %" },
  { pathologie: "Pneumonie", signe: "Tissu-like sign, bronchogramme aérique dynamique", perf: "Sensibilité 92 % / Spécificité 93 %" },
  { pathologie: "Œdème pulmonaire", signe: "Lignes B confluentes bilatérales (> 3 / espace intercostal)", perf: "Sensibilité 88 % / Spécificité 90 %" },
  { pathologie: "Atélectasie", signe: "Consolidation sans bronchogramme aérique, bronchogramme liquidien", perf: "Corrélation scanner > 85 %" },
  { pathologie: "Paralysie diaphragmatique", signe: "Absence de cinétique en mode TM", perf: "Corrélation clinique élevée" },
];

const publics = [
  { icon: "🫁", label: "Pneumologues", desc: "Compétence socle — prioritaire" },
  { icon: "🏥", label: "Internistes", desc: "Formation de base recommandée" },
  { icon: "🚨", label: "Urgentistes", desc: "Formation POCUS indispensable" },
  { icon: "💉", label: "Réanimateurs", desc: "Protocoles BLUE / FALLS" },
  { icon: "🎓", label: "Internes en pneumologie", desc: "Formation initiale DES" },
  { icon: "🩺", label: "Médecins généralistes", desc: "Extension de compétences" },
];

export default function EchographieThoraciquePage() {
  return (
    <>
      <PageHero
        title="Échographie thoracique"
        subtitle="Formation certifiante de niveau 1 — Maîtrisez l'outil diagnostique incontournable du pneumologue moderne, au chevet du patient, sans irradiation."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Formations", href: "/formations" },
          { label: "Échographie thoracique" },
        ]}
        tag="Formation pratique — 2 jours"
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

      {/* ── Pourquoi cette formation ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                Pourquoi se former ?
              </span>
              <h2 className="text-3xl font-black text-gray-900 mb-5 leading-tight">
                L'échographie thoracique,<br />
                <span style={{ color: "#31B9AE" }}>nouveau stéthoscope du pneumologue</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                En Afrique subsaharienne, l'accès au scanner et à la radiographie reste limité dans de nombreuses structures de soins. L'échographie thoracique de point-of-care (POCUS) s'impose comme la réponse : portable, immédiate, sans irradiation, et dont la précision diagnostique dépasse la radiographie conventionnelle pour les épanchements, pneumonies et pneumothorax.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Cette formation de 2 jours vous donne les bases théoriques et la pratique supervisée nécessaires pour intégrer l'échographie thoracique dans votre exercice quotidien dès le lendemain de la formation.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Aucune irradiation — utilisable en consultation, aux urgences, au lit du patient",
                  "Résultat immédiat — diagnostic en 3 à 5 minutes",
                  "Adapté aux contextes à ressources limitées",
                  "Supérieur à la radiographie pour 6 pathologies majeures",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-black" style={{ background: "#31B9AE" }}>✓</span>
                    <span className="text-gray-700 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Encart citation */}
            <div className="rounded-3xl p-8" style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 100%)" }}>
              <svg className="w-10 h-10 mb-4 opacity-40" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#7EEAE4" }}>
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-white text-lg font-semibold leading-relaxed mb-6 italic">
                « L'échographie pulmonaire au point d'intervention est un outil clinique de premier ordre : sa courbe d'apprentissage est courte, sa précision diagnostique est supérieure à la radiographie conventionnelle pour de nombreuses pathologies. »
              </p>
              <div className="border-t border-white/20 pt-4">
                <p className="text-white/90 text-sm font-bold">Lichtenstein DA, Mezière GA.</p>
                <p className="text-white/60 text-xs">BLUE-Protocol and FALLS-Protocol — CHEST Journal, 2015</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <p className="text-2xl font-black" style={{ color: "#7EEAE4" }}>1 500+</p>
                  <p className="text-white/70 text-xs mt-1">Praticiens formés par le réseau G-ECHO</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <p className="text-2xl font-black" style={{ color: "#7EEAE4" }}>22</p>
                  <p className="text-white/70 text-xs mt-1">Pays africains et européens couverts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programme détaillé ── */}
      <section className="py-16" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Programme
            </span>
            <h2 className="text-3xl font-black text-gray-900">Contenu de la formation</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">2 jours intensifs — 16 heures dont 6h d'ateliers pratiques supervisés en petits groupes</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {programme.map((jour) => (
              <div key={jour.jour} className="rounded-2xl overflow-hidden border border-gray-200 bg-background">
                <div className="px-6 py-4 font-black text-white text-lg" style={{ background: jour.color }}>
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

      {/* ── Indications cliniques ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Indications enseignées
            </span>
            <h2 className="text-3xl font-black text-gray-900">6 pathologies maîtrisées</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr style={{ background: "#0B3D38" }}>
                  <th className="text-left px-5 py-4 text-white text-sm font-black">Pathologie</th>
                  <th className="text-left px-5 py-4 text-white text-sm font-black">Signe échographique principal</th>
                  <th className="text-left px-5 py-4 text-white text-sm font-black">Performance diagnostique</th>
                </tr>
              </thead>
              <tbody>
                {indications.map((ind, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#f0fafa" : "white" }}>
                    <td className="px-5 py-3.5 font-bold text-gray-900 text-sm">{ind.pathologie}</td>
                    <td className="px-5 py-3.5 text-gray-600 text-sm">{ind.signe}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                        {ind.perf}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Niveaux de formation ── */}
      <section className="py-16" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Parcours progressif
            </span>
            <h2 className="text-3xl font-black text-gray-900">Une formation en 3 niveaux</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                niveau: "Niveau 1",
                label: "Initiation",
                color: "#31B9AE",
                bg: "#E8F9F7",
                duree: "2 jours",
                actif: true,
                desc: "Plèvre, sémiologie de base, pneumothorax, épanchement pleural. Attestation SOBUP.",
                items: ["Bases physiques", "Pathologie pleurale", "Protocoles BLUE & FALLS", "Atelier pratique"],
              },
              {
                niveau: "Niveau 2",
                label: "Approfondissement",
                color: "#065E52",
                bg: "#f0fafa",
                duree: "2 jours",
                actif: false,
                desc: "Parenchyme pulmonaire, protocoles avancés, diaphragme, cas complexes. Certification SOBUP + partenaires.",
                items: ["Parenchyme & interstitiel", "Protocoles avancés", "Diaphragme", "Gestes guidés"],
              },
              {
                niveau: "Niveau 3",
                label: "Expert",
                color: "#e67e22",
                bg: "#fff7ed",
                duree: "1 jour + supervision",
                actif: false,
                desc: "Enseignement, recherche, cas complexes. Formation des formateurs. Certification nationale.",
                items: ["Formation des formateurs", "Gestes complexes", "Recherche & publication", "Certification nationale"],
              },
            ].map((n) => (
              <div key={n.niveau}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${n.actif ? "shadow-xl" : "opacity-80"}`}
                style={{ borderColor: n.actif ? n.color : "#e2e8f0" }}>
                <div className="px-6 py-5" style={{ background: n.actif ? n.color : n.bg }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black uppercase tracking-widest"
                      style={{ color: n.actif ? "rgba(255,255,255,0.8)" : n.color }}>
                      {n.niveau}
                    </span>
                    {n.actif && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">En cours</span>
                    )}
                  </div>
                  <p className="font-black text-xl" style={{ color: n.actif ? "white" : "#1e293b" }}>{n.label}</p>
                  <p className="text-sm mt-1" style={{ color: n.actif ? "rgba(255,255,255,0.85)" : "#64748b" }}>⏱ {n.duree}</p>
                </div>
                <div className="p-5 bg-background">
                  <p className="text-sm text-gray-600 mb-4">{n.desc}</p>
                  <ul className="space-y-2">
                    {n.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: n.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Public cible ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                Public cible
              </span>
              <h2 className="text-3xl font-black text-gray-900 mb-6">À qui s'adresse cette formation ?</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {publics.map((p) => (
                  <div key={p.label} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.label}</p>
                      <p className="text-xs text-gray-500">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl border-l-4" style={{ borderColor: "#31B9AE", background: "#f0fafa" }}>
                <p className="text-sm font-bold text-gray-900 mb-1">Prérequis</p>
                <p className="text-sm text-gray-600">Être titulaire d'un diplôme de médecin ou être en formation médicale supervisée. Aucune expérience préalable en échographie n'est requise pour le niveau 1.</p>
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
                  { icon: "⏱", label: "Volume horaire", value: "16h dont 6h d'ateliers pratiques supervisés" },
                  { icon: "👥", label: "Encadrement", value: "1 formateur pour 3 participants maximum" },
                  { icon: "📍", label: "Lieu", value: "Ouagadougou — site communiqué à l'inscription" },
                  { icon: "🏅", label: "Certification", value: "Attestation officielle SOBUP remise en fin de formation" },
                  { icon: "💻", label: "E-learning", value: "Accès à la plateforme SOBUP pendant 3 mois post-formation" },
                  { icon: "💰", label: "Tarif", value: "Gratuit pour les membres SOBUP à jour de cotisation" },
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
          <h2 className="text-3xl font-black text-white mb-4">Prêt à maîtriser l'échographie thoracique ?</h2>
          <p className="text-white/75 mb-8 text-lg">
            Rejoignez les pneumologues qui intègrent l'imagerie au point d'intervention dans leur pratique quotidienne. Places limitées — inscrivez-vous dès maintenant.
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
          <p className="text-white/50 text-xs mt-6">Formation gratuite pour les membres SOBUP · Attestation officielle délivrée · Accès e-learning 3 mois</p>
        </div>
      </section>
    </>
  );
}
