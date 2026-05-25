import Link from "next/link";
import PageHero from "@/components/PageHero";

const sommaire = [
  { label: "Mot du Président", page: 2, anchor: "#mot-president" },
  { label: "Vie de la société — AG Élective", page: 3, anchor: "#ag-elective" },
  { label: "Histoire & Héritage — Interview Pr Ouédraogo", page: 5, anchor: "#histoire" },
  { label: "Hommage — Pr Bernard KOFFI N'GORAN", page: 7, anchor: "#hommage" },
  { label: "Zoom sur... Dr SOUBEIGA (CHR Banfora)", page: 9, anchor: "#zoom" },
  { label: "Actualité scientifique en bref", page: 11, anchor: "#actu" },
  { label: "Rayonnement scientifique — CPLF 2026", page: 12, anchor: "#rayonnement" },
  { label: "Coin des Résidents", page: 15, anchor: "#residents" },
];


export default function JournalPage() {
  return (
    <>
      <PageHero
        title="Newsletter SOBUP"
        subtitle="Bulletin d'information de la Société Burkinabè de Pneumologie — N°1 · Avril 2026"
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Newsletter SOBUP" }]}
        tag="Numéro 1 — Avril 2026"
        shape="chevron-up"
      />

      {/* ── Bandeau identité bulletin ── */}
      <section className="py-0 bg-background border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-6 py-4 overflow-x-auto">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: "#31B9AE" }}>N°1</div>
              <div>
                <p className="font-black text-gray-900 text-sm">Bulletin d'information SOBUP</p>
                <p className="text-xs text-gray-500">Avril 2026 · Publication trimestrielle officielle</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden md:block shrink-0" />
            <div className="hidden md:flex items-center gap-6 text-xs text-gray-500">
              <span>📌 <strong>17 fév. 2026</strong> — AG Élective SOBUP</span>
              <span>📌 <strong>119 membres</strong> — Nouveau bureau de 13</span>
              <span>📌 <strong>CPLF 2026</strong> — Lille, 3 communications burkinabè</span>
            </div>
            <div className="ml-auto shrink-0">
              <a href="/newsletter-sobup-n1-avril2026.pdf" download
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: "#e67e22" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Télécharger le PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-10">

          {/* ── CONTENU PRINCIPAL ── */}
          <div className="lg:col-span-3 space-y-12">

            {/* ── MOT DU PRÉSIDENT ── */}
            <article id="mot-president" className="bg-background rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-8 py-5 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 100%)" }}>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "rgba(255,255,255,0.15)" }}>Éditorial</span>
                <span className="text-white/60 text-xs">Page 2</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Mot du Président</h2>
                <p className="text-sm font-bold mb-6" style={{ color: "#31B9AE" }}>Dr Abdoul Risgou OUEDRAOGO (MCA) — Président de la SOBUP</p>

                <div className="relative p-6 rounded-2xl mb-6" style={{ background: "#f0fafa", borderLeft: "4px solid #31B9AE" }}>
                  <svg className="w-8 h-8 mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#31B9AE" }}>
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <p className="text-gray-700 leading-relaxed italic text-sm">
                    « Ce premier numéro marque bien plus qu'une simple publication. Il incarne la renaissance, la transparence et la volonté de rassemblement qui animent la nouvelle équipe que j'ai l'honneur de conduire. »
                  </p>
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                  <p>Le 17 février 2026 restera gravé dans la mémoire de notre société savante. Ce jour-là, vous avez été nombreux à répondre présent pour l'Assemblée Générale Élective. Je mesure pleinement l'ampleur de ce choix. Il n'est pas un blanc-seing, mais un engagement réciproque — de notre part, servir avec humilité, transparence et dévouement ; de votre part, contribuer à faire vivre cette société par votre expertise et votre présence.</p>
                  <p>Ce premier numéro de notre newsletter trimestrielle est l'un des outils de cette transparence. Vous y trouverez : l'héritage de nos aînés avec l'interview du Pr Martial OUÉDRAOGO sur la genèse de la SOBUP ; la vie de notre société avec la composition du nouveau bureau ; le rayonnement de nos membres à travers leur participation au CPLF 2026 à Lille ; la science au quotidien avec nos « Vendredis de la SOBUP » ; et la relève, avec le coin des résidents.</p>
                  <p>Au nom de toute l'équipe <strong>« NOUVEAU SOUFFLE »</strong>, nous exprimons notre profonde gratitude au bureau sortant et à son Président, le Pr Martial OUEDRAOGO. Trois ans pour consolider, innover, rassembler et porter haut les couleurs de la pneumologie burkinabè. Ce premier numéro est le vôtre.</p>
                </div>
              </div>
            </article>

            {/* ── VIE DE LA SOCIÉTÉ ── */}
            <article id="ag-elective" className="bg-background rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-8 py-5 flex items-center gap-3" style={{ background: "#E8F9F7" }}>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "#31B9AE" }}>Vie de la société</span>
                <span className="text-gray-500 text-xs">Page 3</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Assemblée Générale Élective</h2>
                <p className="text-sm font-semibold text-gray-500 mb-6">Un nouveau chapitre s'ouvre — 17 février 2026, Université Joseph Ki-Zerbo, Ouagadougou</p>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { value: "119", label: "membres SOBUP à ce jour", icon: "👥" },
                    { value: "13", label: "membres dans le nouveau bureau", icon: "🏛️" },
                    { value: "30 000 F", label: "montant des cotisations (révision)", icon: "💳" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: "#f0fafa" }}>
                      <p className="text-2xl mb-1">{s.icon}</p>
                      <p className="text-2xl font-black" style={{ color: "#31B9AE" }}>{s.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="text-gray-600 space-y-4 text-sm leading-relaxed">
                  <p>Le mardi 17 février 2026 s'est tenue à l'Université Joseph Ki-Zerbo de Ouagadougou, l'Assemblée Générale Élective de la SOBUP avec la présence de la majorité de ses membres. La séance a débuté par la prise de parole du Président sortant, le Pr Martial OUÉDRAOGO, qui a invité l'assemblée à observer une minute de silence en mémoire des membres disparus.</p>
                  <p>L'Assemblée a procédé à une révision des statuts et du règlement intérieur avec deux décisions majeures : l'élargissement du bureau à 13 membres (dont la création d'un poste dédié au représentant des résidents), et la révision des cotisations de 25 000 F à 30 000 F. Le vote s'est déroulé de manière consensuelle à main levée, accordant unanimement la confiance à la seule liste de candidature.</p>
                  <p>Le nouveau Président, le Dr Abdoul Risgou OUÉDRAOGO (MCA), a partagé sa vision sous le signe du <strong>renouveau, de la transparence et de l'engagement collectif</strong>.</p>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">— Dr Aly COULIBALY, SOBUP Newsletter</p>
              </div>
            </article>

            {/* ── HISTOIRE ET HÉRITAGE ── */}
            <article id="histoire" className="bg-background rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-8 py-5 flex items-center gap-3" style={{ background: "#fff7ed" }}>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "#e67e22" }}>Histoire & Héritage</span>
                <span className="text-gray-500 text-xs">Page 5</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-1">« Et si on nous contait la SOBUP… »</h2>
                <p className="text-sm font-semibold text-gray-500 mb-6">Entretien avec le Pr Martial OUÉDRAOGO — Président fondateur et Président sortant</p>

                <div className="flex gap-4 items-start mb-6 p-5 rounded-2xl" style={{ background: "#f8fafc" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0" style={{ background: "linear-gradient(135deg, #0B3D38, #31B9AE)" }}>M</div>
                  <div>
                    <p className="font-black text-gray-900">Pr Martial OUÉDRAOGO</p>
                    <p className="text-xs text-gray-500">Président fondateur · Président sortant · Coordinateur national DES Pneumologie</p>
                  </div>
                </div>

                <div className="space-y-5 text-sm text-gray-600 leading-relaxed">
                  <div className="border-l-4 pl-5 py-1" style={{ borderColor: "#e67e22" }}>
                    <p className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-2" style={{ color: "#e67e22" }}>Genèse de la SOBUP</p>
                    <p>« À l'époque, la Société Africaine de Pneumologie de Langue Française (SAPLF) souhaitait fédérer les sociétés nationales, mais nous étions trop peu nombreux au Burkina. Il fallait d'abord atteindre une masse critique de pneumologues. C'est ainsi que la <strong>SOBUP a été créée en 2007</strong>, avec le Dr Alain Zoubga comme Président d'honneur. Nous n'étions que huit membres. »</p>
                  </div>
                  <div className="border-l-4 pl-5 py-1" style={{ borderColor: "#31B9AE" }}>
                    <p className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-2" style={{ color: "#31B9AE" }}>19 ans après</p>
                    <p>« Nous sommes passés de huit membres à plus d'une centaine. Lors de la dernière assemblée, 103 pneumologues et résidents étaient présents. Le Burkina pourra désormais jouer un rôle majeur dans le concert africain. L'avenir est prometteur. »</p>
                  </div>
                  <div className="border-l-4 pl-5 py-1" style={{ borderColor: "#7c3aed" }}>
                    <p className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-2" style={{ color: "#7c3aed" }}>Conseils au successeur</p>
                    <p>« Je lui conseille d'être un fédérateur en permettant à chacun de s'exprimer. L'unanimité est rare, mais l'essentiel est de préserver l'objectif commun : la <strong>promotion de la santé respiratoire au Burkina Faso</strong>. Être fédérateur n'exclut pas la fermeté. »</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-5 italic">— Propos recueillis par Dr Nouria BATIEBO/YAO, SOBUP Newsletter</p>
              </div>
            </article>

            {/* ── HOMMAGE ── */}
            <article id="hommage" className="bg-background rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-8 py-5 flex items-center gap-3" style={{ background: "#f5f3ff" }}>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "#7c3aed" }}>Hommage au Maître</span>
                <span className="text-gray-500 text-xs">Page 7</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-1">Pr Bernard KOFFI N'GORAN</h2>
                <p className="text-sm font-semibold text-gray-500 mb-6">La SOBUP aux côtés d'un Maître de la pneumologie africaine · Abidjan, 13 mars 2026</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: "🎓", label: "204 thèses encadrées", desc: "En Afrique et hors d'Afrique" },
                    { icon: "🌍", label: "Président de la SAPLF", desc: "Société Africaine de Pneumologie de Langue Française" },
                    { icon: "🏥", label: "Chef de service", desc: "Pneumo-phtisiologie, CHU Cocody, Abidjan" },
                    { icon: "🤝", label: "Société sœur", desc: "La SOBUP représentée par Pr Kadiatou BONCOUNGOU" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "#f5f3ff" }}>
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  La SOBUP a marqué de sa présence la cérémonie solennelle organisée à l'amphithéâtre de l'UFR Sciences Médicales de l'Université Félix Houphouët-Boigny, sous le haut parrainage du Vice-Premier Ministre de Côte d'Ivoire. Le Pr Koffi N'Goran a retracé l'évolution de la pneumologie africaine, de la phtisiologie centrée sur la tuberculose à la pneumologie moderne.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Il a réservé un remerciement particulier à la <strong>« société sœur du Burkina Faso »</strong> pour l'honneur qu'elle lui a fait par sa présence. La SOBUP avait également rendu un hommage solennel au Pr Koffi N'Goran lors de son <strong>8e Congrès à Ouagadougou</strong> (18–20 décembre 2025).
                </p>
                <p className="text-xs text-gray-400 mt-4 italic">— Pr Kadiatou BONCOUNGOU, pour la Société Burkinabè de Pneumologie</p>
              </div>
            </article>

            {/* ── ZOOM SUR ── */}
            <article id="zoom" className="bg-background rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-8 py-5 flex items-center gap-3" style={{ background: "#E8F9F7" }}>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "#31B9AE" }}>Zoom sur...</span>
                <span className="text-gray-500 text-xs">Page 9</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-1">Dr SOUBEIGA Dimitri</h2>
                <p className="text-sm font-semibold text-gray-500 mb-6">Pneumologue au Centre Hospitalier Régional (CHR) de Banfora — Installé depuis Avril 2025</p>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2 space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p>Formé à Ouagadougou, le Dr SOUBEIGA Dimitri a été affecté à Banfora pour contribuer à l'amélioration de la santé respiratoire dans une zone où les défis sanitaires sont immenses. <strong>La région n'avait jamais connu de pneumologue.</strong></p>

                    <div className="p-4 rounded-xl italic text-gray-700" style={{ background: "#f0fafa" }}>
                      « Avant, je devais aller jusqu'à Bobo-Dioulasso pour soigner mon asthme. C'était long, coûteux et fatigant. Aujourd'hui, je peux consulter ici à Banfora, près de ma famille. »
                      <p className="text-xs text-gray-400 mt-2 not-italic">— Mariam, patiente suivie par le Dr SOUBEIGA</p>
                    </div>

                    <p>Au-delà des soins, le Dr SOUBEIGA s'investit dans la sensibilisation communautaire via les médias locaux. Ses patients viennent parfois de villages à plus de 50 km de Banfora. Son rêve : <em>que chaque habitant des Tannounyan puisse respirer librement.</em></p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl text-center" style={{ background: "#0B3D38" }}>
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black mx-auto mb-3" style={{ background: "#31B9AE" }}>S</div>
                      <p className="font-black text-white text-sm">Dr SOUBEIGA Dimitri</p>
                      <p className="text-white/60 text-xs mt-1">Pneumologue · CHR Banfora</p>
                    </div>
                    <div className="p-3 rounded-xl text-xs text-gray-600 space-y-2" style={{ background: "#f8fafc" }}>
                      <p>✅ Consultations de pneumologie</p>
                      <p>✅ Visites patients hospitalisés</p>
                      <p>✅ Avis dans les autres services</p>
                      <p>✅ Lutte antituberculeuse régionale</p>
                      <p>⚠️ Manque de matériel spécialisé</p>
                      <p>⚠️ Absence de bronchoscopie, spirométrie</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic">— Propos recueillis par Dr Souleymane BAMOGO, SOBUP Newsletter</p>
              </div>
            </article>

            {/* ── ACTUALITÉ SCIENTIFIQUE ── */}
            <article id="actu" className="bg-background rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-8 py-5 flex items-center gap-3" style={{ background: "#fef3c7" }}>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "#d97706" }}>Actualité scientifique</span>
                <span className="text-gray-500 text-xs">Page 11</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-1">Les anticoagulants oraux directs (AOD)</h2>
                <p className="text-sm font-semibold text-gray-500 mb-6">Vers de nouvelles recommandations ? — Essai RENOVE, <em>The Lancet</em></p>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl border" style={{ borderColor: "#31B9AE", background: "#E8F9F7" }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Dose réduite</p>
                    <p className="text-2xl font-black text-gray-900">2,2%</p>
                    <p className="text-xs text-gray-500 mt-1">Récidive thromboembolique à 5 ans (n=1 383)</p>
                    <p className="text-2xl font-black text-gray-900 mt-3">9,9%</p>
                    <p className="text-xs text-gray-500 mt-1">Saignements majeurs à 5 ans</p>
                  </div>
                  <div className="p-4 rounded-2xl border" style={{ borderColor: "#e67e22", background: "#fff7ed" }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#e67e22" }}>Dose complète</p>
                    <p className="text-2xl font-black text-gray-900">1,8%</p>
                    <p className="text-xs text-gray-500 mt-1">Récidive thromboembolique à 5 ans (n=1 385)</p>
                    <p className="text-2xl font-black text-gray-900 mt-3">15,2%</p>
                    <p className="text-xs text-gray-500 mt-1">Saignements majeurs à 5 ans</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  L'essai <strong>RENOVE</strong> (Reduced Dose Versus Full-dose of Direct Oral Anticoagulant After Unprovoked Venous Thromboembolism) — essai de non-infériorité, multicentrique, randomisé, mené dans 47 hôpitaux en France, 2 768 patients — montre que la réduction de dose d'AOD n'a pas satisfait aux critères de non-infériorité pour la récidive thromboembolique.
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Cependant, la <strong>réduction substantielle des saignements (-35%)</strong> avec la dose réduite pourrait en faire une option thérapeutique pour certains sous-groupes de patients nécessitant une anticoagulation prolongée. Des recherches supplémentaires restent nécessaires.
                </p>
                <p className="text-xs text-gray-400 mt-4 italic">— Dr Edem KUNAKEY, SOBUP Newsletter</p>
              </div>
            </article>

            {/* ── RAYONNEMENT SCIENTIFIQUE ── */}
            <article id="rayonnement" className="bg-background rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-8 py-5 flex items-center gap-3" style={{ background: "#E8F9F7" }}>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "#31B9AE" }}>Rayonnement scientifique</span>
                <span className="text-gray-500 text-xs">Page 12</span>
              </div>
              <div className="p-8 space-y-8">

                {/* CPLF 2026 */}
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">La SOBUP au CPLF 2026 — Lille</h2>
                  <p className="text-sm font-semibold text-gray-500 mb-5">30e Congrès de Pneumologie de Langue Française · 30 janvier – 1er février 2026 · Grand Palais, Lille</p>

                  <div className="space-y-4">
                    {[
                      {
                        dr: "Dr NIKIEMA Tanguy",
                        titre: "Profil nutritionnel des patients atteints de tuberculose pulmonaire pharmaco-sensible au début du traitement — Ouagadougou, Burkina Faso",
                        desc: "Étude de cohorte prospective multicentrique visant à générer des données locales sur le lien entre l'état nutritionnel et l'issue du traitement antituberculeux.",
                        color: "#31B9AE", bg: "#E8F9F7",
                      },
                      {
                        dr: "Dr COULIBALY Aly",
                        titre: "Place des scarifications thoraciques en pathologies respiratoires au Burkina Faso",
                        desc: "Les scarifications thoraciques demeurent une pratique courante au Burkina Faso dans le parcours de soins respiratoires, mais leur impact thérapeutique réel reste indéterminé.",
                        color: "#065E52", bg: "#f0fafa",
                      },
                      {
                        dr: "Dr COULIBALY Aly",
                        titre: "Profil épidémiologique et clinique des fumeurs présentant des pathologies liées au tabac — Unité de sevrage tabagique, CHU Yalgado Ouédraogo",
                        desc: "Analyse du profil des patients tabagiques pris en charge à l'unité de sevrage du CHU-YO.",
                        color: "#e67e22", bg: "#fff7ed",
                      },
                      {
                        dr: "Dr MAIGA Moumouni",
                        titre: "Diagnostic et traitement systématique de la tuberculose résistante (TB-R) au CHR de Gaoua, Burkina Faso",
                        desc: "La tuberculose résistante dans une localité isolée illustre les défis diagnostiques et thérapeutiques dans les pays à ressources limitées.",
                        color: "#7c3aed", bg: "#f5f3ff",
                      },
                    ].map((comm) => (
                      <div key={comm.titre} className="flex gap-4 p-4 rounded-2xl border border-gray-100">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: comm.color }}>📊</div>
                        <div>
                          <p className="text-xs font-black mb-1" style={{ color: comm.color }}>{comm.dr}</p>
                          <p className="font-bold text-gray-900 text-sm mb-1">{comm.titre}</p>
                          <p className="text-xs text-gray-500">{comm.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-4 italic">— Dr Edem KUNAKEY, SOBUP Newsletter</p>
                </div>

                {/* Journée Sommeil */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-xl font-black text-gray-900 mb-1">Journée Mondiale du Sommeil 2026</h3>
                  <p className="text-sm font-semibold text-gray-500 mb-5">Table ronde pluridisciplinaire sur le Syndrome d'Apnée du Sommeil · 13 mars 2026 · BRAVIA Hôtel, Ouagadougou</p>

                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    {[
                      { value: "150+", label: "Participants", icon: "👥" },
                      { value: "13", label: "Spécialités médicales", icon: "🏥" },
                      { value: "6 mois", label: "Mandat du groupe de travail", icon: "📅" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "#f0fafa" }}>
                        <p className="text-xl mb-1">{s.icon}</p>
                        <p className="text-2xl font-black" style={{ color: "#31B9AE" }}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    La SOBUP a réuni plus de 150 participants autour d'une table ronde inédite : pneumologues, cardiologues, neurologues, ORL, stomatologues, physiologistes, anesthésistes-réanimateurs, pédiatres, gériatres, psychiatres, médecins du travail, ophtalmologues et nutritionnistes. Un groupe de travail pluridisciplinaire a été constitué, coordonné par <strong>le Dr Arnaud TIENDREBEOGO (physiologiste)</strong>.
                  </p>
                  <div className="p-4 rounded-xl border-l-4" style={{ borderColor: "#31B9AE", background: "#f0fafa" }}>
                    <p className="text-sm text-gray-700 italic">« Cette rencontre se veut avant tout un starter : le point de départ d'une collaboration durable et structurée entre nos disciplines. »</p>
                    <p className="text-xs text-gray-400 mt-2">— Dr Abdoul Risgou OUÉDRAOGO, Président de la SOBUP</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-4 italic">— Dr Souleymane BAMOGO, SOBUP Newsletter</p>
                </div>
              </div>
            </article>

            {/* ── COIN DES RÉSIDENTS ── */}
            <article id="residents" className="bg-background rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-8 py-5 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #0B3D38, #065E52)" }}>
                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "rgba(255,255,255,0.15)" }}>Coin des Résidents</span>
                <span className="text-white/60 text-xs">Page 15</span>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2">La relève est en marche !</h2>
                <p className="text-sm font-semibold text-gray-500 mb-6">DES de Pneumologie — Promotion de 1ère année</p>

                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">3 universités habilitées</p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { univ: "Université Joseph Ki-Zerbo", ville: "Ouagadougou", sites: ["CHU Yalgado Ouédraogo", "CHU de Bogodogo", "CHU de Tengandogo", "CHU Pédiatrique Charles de Gaulle"] },
                      { univ: "INSSA", ville: "Bobo-Dioulasso", sites: ["CHU de Pala", "CHU Souro Sanou"] },
                      { univ: "Université Bernard Lédéa Ouédraogo", ville: "Ouahigouya", sites: ["CHR de Ouahigouya", "CHR de Koudougou"] },
                    ].map((u) => (
                      <div key={u.univ} className="p-4 rounded-2xl border border-gray-100" style={{ background: "#f0fafa" }}>
                        <p className="font-black text-gray-900 text-sm">{u.univ}</p>
                        <p className="text-xs font-semibold mb-3" style={{ color: "#31B9AE" }}>📍 {u.ville}</p>
                        <ul className="space-y-1">
                          {u.sites.map((s) => (
                            <li key={s} className="text-xs text-gray-600 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#31B9AE" }} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  La formation théorique est assurée par le Collège des Enseignants de Pneumologie du Burkina Faso, sous la coupole du <strong>Pr Martial OUÉDRAOGO</strong>, coordinateur national du DES. Les résidents sont encouragés à participer aux <em>Vendredis de la SOBUP</em>, séances de présentation et de discussion de cas cliniques.
                </p>

                <div className="p-4 rounded-xl border-l-4" style={{ borderColor: "#31B9AE", background: "#E8F9F7" }}>
                  <p className="text-sm font-bold text-gray-900 mb-1">Appel à initiatives !</p>
                  <p className="text-sm text-gray-600">La SOBUP invite les résidents à partager leurs projets : études originales, journaux club, actions de sensibilisation (asthme, tabagisme, tuberculose) en milieu scolaire ou communautaire. Contactez-nous : <a href="mailto:sobup01@gmail.com" className="font-bold" style={{ color: "#31B9AE" }}>sobup01@gmail.com</a></p>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">— Dr Edem KUNAKEY, SOBUP Newsletter</p>
              </div>
            </article>

          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-6">

            {/* Sommaire */}
            <div className="bg-background rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="px-5 py-4 font-black text-white text-sm" style={{ background: "linear-gradient(135deg, #0B3D38, #31B9AE)" }}>
                📋 Sommaire — N°1
              </div>
              <div className="p-4">
                <ul className="space-y-1">
                  {sommaire.map((s) => (
                    <li key={s.anchor}>
                      <a href={s.anchor}
                        className="flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium text-gray-700 hover:text-primary transition-colors hover:bg-gray-50 group">
                        <span className="group-hover:underline">{s.label}</span>
                        <span className="text-gray-400 text-[10px] shrink-0 ml-2">p.{s.page}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a href="/newsletter-sobup-n1-avril2026.pdf" download
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-white text-xs"
                    style={{ background: "#e67e22" }}>
                    ⬇ Télécharger le PDF
                  </a>
                </div>
              </div>
            </div>

            {/* À propos */}
            <div className="bg-background rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 mb-3 text-sm">📖 À propos du bulletin</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p>📅 <strong>Périodicité :</strong> Trimestrielle</p>
                <p>🌐 <strong>Langue :</strong> Français</p>
                <p>✏️ <strong>Rédacteur en Chef :</strong> Dr Edem KUNAKEY</p>
                <p>📧 <strong>Contact :</strong> sobup01@gmail.com</p>
                <p>📱 <strong>Tél :</strong> 70 24 12 24 / 70 86 64 70</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a href="https://www.facebook.com/share/1G2yEo8sh2/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold" style={{ color: "#31B9AE" }}>
                  👍 Suivre sur Facebook →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── FOOTER NEWSLETTER ── */}
      <section className="py-10" style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 100%)" }}>
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-white/40 text-xs">© 2026 — Société Burkinabè de Pneumologie, Ouagadougou, Burkina Faso</p>
          <p className="text-white/40 text-xs mt-1">Directeur de la publication : Dr Abdoul Risgou OUEDRAOGO · Conception : Dr Souleymane BAMOGO</p>
        </div>
      </section>
    </>
  );
}
