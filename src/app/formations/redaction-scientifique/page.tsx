import Link from "next/link";
import PageHero from "@/components/PageHero";

const stats = [
  { value: "2%", label: "Part de l'Afrique dans la production scientifique mondiale", sub: "Malgré un fardeau de morbidité parmi les plus élevés" },
  { value: "13 000+", label: "Revues accessibles via HINARI", sub: "Accès gratuit pour les institutions burkinabè éligibles (OMS)" },
  { value: "500+", label: "Revues africaines indexées sur AJOL", sub: "African Journals Online — plateforme de référence" },
  { value: "5 jours", label: "Formation complète en 4 modules", sub: "3 jours présentiel + 2 jours distanciel encadré" },
];

const modules = [
  {
    num: "01",
    titre: "Recherche bibliographique médicale",
    color: "#31B9AE",
    bg: "#E8F9F7",
    icon: "🔍",
    duree: "1 jour (8h)",
    desc: "Maîtrisez les outils de recherche documentaire biomédicale et construisez des équations de recherche efficaces sur PubMed, Cochrane et HINARI.",
    objectifs: [
      "Formuler une question de recherche structurée au format PICO",
      "Identifier les bases de données pertinentes selon le type de question",
      "Construire une équation de recherche avec opérateurs booléens et termes MeSH",
      "Évaluer la qualité et la pertinence des articles identifiés",
      "Organiser sa bibliographie avec Zotero",
      "Mettre en place une veille bibliographique automatisée",
    ],
    programme: [
      { titre: "Les bases de données biomédicales", items: ["PubMed/MEDLINE — référence mondiale, gratuit", "Cochrane Library — revues systématiques et méta-analyses", "HINARI (OMS) — accès gratuit pour les institutions burkinabè", "AJOL — plateforme de référence de la recherche africaine", "African Index Medicus (AIM) — index OMS des publications africaines", "Google Scholar : usages et limites"] },
      { titre: "Construire une requête efficace", items: ["La question PICO : décomposition et traduction en termes MeSH", "Les opérateurs booléens : AND, OR, NOT", "Filtres et limites : date, type d'étude, langue", "Exercice pratique : requête sur un sujet de pneumologie"] },
      { titre: "Gestion des références & veille", items: ["Zotero (outil libre et gratuit) : installation, import depuis PubMed, styles de citation", "Créer une bibliographie automatique dans Word", "Alertes bibliographiques : PubMed My NCBI, Google Scholar Alerts", "Partager une bibliothèque en équipe de recherche"] },
    ],
    outils: ["PubMed", "HINARI (OMS)", "AJOL", "Zotero", "Cochrane Library"],
  },
  {
    num: "02",
    titre: "Rédaction d'un protocole de recherche",
    color: "#065E52",
    bg: "#f0fafa",
    icon: "📋",
    duree: "1 jour (8h)",
    desc: "Apprenez à formuler une question de recherche clinique pertinente et à rédiger un protocole complet, soumissible à un comité d'éthique.",
    objectifs: [
      "Formuler une question de recherche clinique originale et pertinente",
      "Identifier le type d'étude adapté à sa question",
      "Rédiger les sections d'un protocole standardisé",
      "Intégrer les considérations éthiques du contexte africain",
      "Calculer une taille d'échantillon rigoureuse",
      "Soumettre un protocole au CERS (Burkina Faso)",
    ],
    programme: [
      { titre: "Poser la question de recherche", items: ["Identifier un problème de santé pertinent en pneumologie africaine", "Formuler une hypothèse de recherche mesurable", "La pyramide des preuves : quel type d'étude pour quelle question ?", "Les biais courants et les moyens de les contrôler"] },
      { titre: "Structure du protocole", items: ["Titre, résumé, introduction, objectifs SMART", "Méthodologie : population, critères, taille d'échantillon, plan statistique", "Considérations éthiques : consentement éclairé, confidentialité, bénéfice/risque", "Budget prévisionnel et planning (Gantt chart)"] },
      { titre: "Éthique et soumission", items: ["Le CERS — Comité d'Éthique pour la Recherche en Santé (Burkina Faso)", "Dossier de soumission : formulaire, consentement modèle, résumé profane", "Enregistrement sur PACTR (Pan African Clinical Trials Registry)", "Exercice : rédaction collaborative d'un protocole de pneumologie"] },
    ],
    outils: ["GPower", "OpenEpi (gratuit)", "PACTR", "CERS Burkina Faso", "Excel/ProjectLibre (Gantt)"],
  },
  {
    num: "03",
    titre: "Rédaction d'un article scientifique",
    color: "#e67e22",
    bg: "#fff7ed",
    icon: "✍️",
    duree: "2 jours (16h dont 4h d'atelier)",
    desc: "Structurez et rédigez un article selon les normes IMRaD, sélectionnez la revue cible et gérez le processus de soumission et de révision.",
    objectifs: [
      "Structurer un article selon les normes IMRaD internationales",
      "Rédiger chaque section en respectant le style scientifique",
      "Appliquer les directives CONSORT, STROBE ou PRISMA selon le type d'étude",
      "Sélectionner une revue cible indexée (PubMed, Scopus)",
      "Préparer un dossier de soumission complet",
      "Répondre aux commentaires des reviewers",
    ],
    programme: [
      { titre: "La structure IMRaD et le style scientifique", items: ["Introduction : contexte, lacune scientifique, objectif (entonnoir)", "Méthodes : description reproductible, critère de reproductibilité", "Résultats : présentation objective, tableaux et figures APA/Vancouver", "Discussion : confrontation à la littérature, forces et limites, implications", "Titre, résumé structuré, mots-clés MeSH"] },
      { titre: "Directives de reporting standardisées", items: ["CONSORT : 25 items pour les essais randomisés", "STROBE : 22 items pour les études observationnelles (cohorte, cas-témoins)", "PRISMA 2020 : 27 items pour les revues systématiques et méta-analyses", "EQUATOR Network : plateforme centrale de toutes les guidelines"] },
      { titre: "Choisir sa revue et soumettre", items: ["Facteur d'impact, quartile SCImago (Q1-Q4), indexation PubMed/Scopus", "Revues africaines : PAMJ, African Health Sciences, Méd. d'Afrique Francophone", "Revues internationales open access : PLOS ONE, BMC Pulmonary Medicine, ERJ Open Research", "Éviter les revues prédatrices : Think.Check.Submit, DOAJ, liste COPE", "La cover letter : arguments clés, non-duplication, exclusivité", "Répondre aux reviewers : méthode point par point"] },
      { titre: "Atelier pratique de rédaction (4h)", items: ["Travail sur un jeu de données réel fourni par les formateurs", "Rédaction du résumé, de l'introduction et de la discussion en groupes", "Correction croisée entre participants", "Retour individualisé des formateurs"] },
    ],
    outils: ["EQUATOR Network", "Scimago Journal Rank", "Think.Check.Submit", "JANE (sélection de revue)", "ICMJE (normes Vancouver)"],
  },
  {
    num: "04",
    titre: "Recherche et soumission de grants",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: "💰",
    duree: "1 jour (8h)",
    desc: "Identifiez les financements accessibles aux chercheurs africains, rédigez un dossier compétitif et bâtissez des partenariats de recherche durables.",
    objectifs: [
      "Identifier les sources de financement accessibles au Burkina Faso",
      "Analyser un appel à projets et évaluer son éligibilité",
      "Rédiger un résumé de projet (executive summary) convaincant",
      "Construire un budget de recherche justifié",
      "Gérer les aspects administratifs d'un projet financé",
      "Constituer des partenariats et consortiums de recherche",
    ],
    programme: [
      { titre: "Cartographie des financeurs", items: ["EDCTP3 : jusqu'à 147 M€ disponibles en 2025 pour les infections respiratoires", "TDR/OMS : Small Grants Scheme pour la recherche de mise en œuvre", "Wellcome Trust / H3Africa : génomique et santé populationnelle africaine", "NIH Fogarty International Center : partenariats de recherche Nord-Sud", "The Union : programme de petits grants en pneumologie et santé respiratoire", "ANRS-MIE, AFD/IRD, Grand Challenges Africa (Gates Foundation)"] },
      { titre: "Comprendre et analyser un appel à projets", items: ["Critères d'éligibilité : pays, type d'institution, statut du PI", "Critères d'évaluation : pertinence, faisabilité, innovation, impact, coût/efficacité", "Identifier les priorités thématiques alignées avec la pneumologie africaine", "Les erreurs éliminatoires les plus fréquentes dans les dossiers africains"] },
      { titre: "Rédiger un dossier compétitif", items: ["Executive Summary : accroche, problème, solution, impact (1 page décisive)", "Contexte : épidémiologie locale, lacune scientifique, alignement avec priorités nationales", "Méthodologie : robustesse scientifique, faisabilité dans le contexte burkinabè", "Budget détaillé : personnel, équipements, dissémination, frais de gestion", "Cadre logique, indicateurs de performance, plan de gestion des risques"] },
    ],
    outils: ["EDCTP / TDR / Wellcome Trust portals", "Global Health Network Africa", "Research Professional", "OpenProject / Asana", "Excel (budget & Gantt)"],
  },
];

const planning = [
  { jour: "Jour 1", matin: "Module 1 — Bases de données (PubMed, HINARI, AJOL)", apmidi: "Module 1 — Zotero, équation de recherche, veille", format: "Présentiel + TP informatique" },
  { jour: "Jour 2", matin: "Module 2 — Question de recherche, types d'études, calcul d'échantillon", apmidi: "Module 2 — Rédaction de protocole, éthique, CERS", format: "Présentiel + Atelier groupes" },
  { jour: "Jour 3", matin: "Module 3 — IMRaD, CONSORT / STROBE / PRISMA", apmidi: "Module 3 — Sélection de revue, soumission, peer review", format: "Présentiel + Atelier pratique" },
  { jour: "Jour 4", matin: "Module 3 — Atelier de rédaction sur données réelles", apmidi: "Corrections individualisées + Retour formateurs", format: "Distanciel encadré" },
  { jour: "Jour 5", matin: "Module 4 — Grants, analyse d'appels à projets", apmidi: "Module 4 — Rédaction executive summary + clôture", format: "Distanciel encadré" },
];

export default function RedactionScientifiquePage() {
  return (
    <>
      <PageHero
        title="Rédaction scientifique"
        subtitle="De la recherche bibliographique à la soumission de grants — un programme complet pour publier vos travaux dans des revues indexées et financer votre recherche."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Formations", href: "/formations" },
          { label: "Rédaction scientifique" },
        ]}
        tag="Formation complète — 4 modules · 5 jours"
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

      {/* ── Intro ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                Pourquoi cette formation ?
              </span>
              <h2 className="text-3xl font-black text-gray-900 mb-5 leading-tight">
                Renforcer la voix<br />
                <span style={{ color: "#31B9AE" }}>de la pneumologie africaine</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                L'Afrique subsaharienne ne contribue qu'à <strong>2 % de la production scientifique mondiale</strong>, alors qu'elle supporte l'un des fardeaux de morbidité les plus lourds. En pneumologie, tuberculose, pneumonies, asthme et BPCO représentent des millions de cas — sans les données locales nécessaires pour guider les politiques de santé.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                La SOBUP s'engage à inverser cette tendance en dotant ses membres des compétences pour <strong>rechercher, écrire, publier et obtenir des financements</strong>. Une formation structurée en 4 modules, du PubMed au grant EDCTP, ancrée dans les réalités du contexte burkinabè.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  "Outils 100% accessibles depuis le Burkina Faso (HINARI, AJOL, PubMed)",
                  "Formation ancrée dans le contexte africain et les revues africaines",
                  "Livrables concrets à chaque module (requête, protocole, article, dossier de grant)",
                  "Suivi post-formation : relecture de manuscripts à 3 mois",
                  "Attestation DPC — Développement Professionnel Continu",
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
                « La recherche médicale africaine existe. Elle manque de visibilité, non de valeur. Former les praticiens à publier et à obtenir des financements, c'est investir dans la santé de millions de patients. »
              </p>
              <div className="border-t border-white/20 pt-4 mb-6">
                <p className="text-white/60 text-xs">Programme de renforcement des capacités SOBUP</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "37%", label: "des décès africains dus aux MNT (maladies respiratoires incluses)" },
                  { value: "+41%", label: "d'urgences sanitaires en Afrique depuis 2022" },
                  { value: "147M€", label: "disponibles via EDCTP3 pour la recherche africaine en 2025" },
                  { value: "70%", label: "des projets africains internationaux financés par le NIH Fogarty" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <p className="text-xl font-black" style={{ color: "#7EEAE4" }}>{s.value}</p>
                    <p className="text-white/70 text-xs mt-1 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Les 4 modules ── */}
      <section className="py-16" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Programme
            </span>
            <h2 className="text-3xl font-black text-gray-900">4 modules complémentaires</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Un parcours progressif, du chercheur débutant au chercheur publié et financé</p>
          </div>

          <div className="space-y-8">
            {modules.map((mod, idx) => (
              <div key={mod.num} className="bg-background rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="grid lg:grid-cols-3">
                  {/* En-tête module */}
                  <div className="p-8 flex flex-col justify-between" style={{ background: mod.bg }}>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl font-black opacity-20" style={{ color: mod.color }}>
                          {mod.num}
                        </span>
                        <span className="text-3xl">{mod.icon}</span>
                      </div>
                      <h3 className="font-black text-xl text-gray-900 mb-3 leading-tight">{mod.titre}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{mod.desc}</p>
                      <span className="inline-block text-xs font-bold px-3 py-1 rounded-full" style={{ background: mod.color, color: "white" }}>
                        ⏱ {mod.duree}
                      </span>
                    </div>
                    <div className="mt-6">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Outils enseignés</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mod.outils.map((outil) => (
                          <span key={outil} className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">
                            {outil}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Objectifs */}
                  <div className="p-8 border-r border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Objectifs pédagogiques</p>
                    <ul className="space-y-2">
                      {mod.objectifs.map((obj) => (
                        <li key={obj} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: mod.color }} />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Programme */}
                  <div className="p-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Au programme</p>
                    <div className="space-y-4">
                      {mod.programme.map((bloc) => (
                        <div key={bloc.titre}>
                          <p className="font-bold text-gray-900 text-xs mb-2" style={{ color: mod.color }}>▸ {bloc.titre}</p>
                          <ul className="space-y-1">
                            {bloc.items.map((item) => (
                              <li key={item} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="shrink-0 mt-0.5">–</span>{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planning ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Organisation
            </span>
            <h2 className="text-3xl font-black text-gray-900">Planning des 5 jours</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr style={{ background: "#0B3D38" }}>
                  <th className="text-left px-5 py-4 text-white text-sm font-black">Jour</th>
                  <th className="text-left px-5 py-4 text-white text-sm font-black">Matin</th>
                  <th className="text-left px-5 py-4 text-white text-sm font-black">Après-midi</th>
                  <th className="text-left px-5 py-4 text-white text-sm font-black">Format</th>
                </tr>
              </thead>
              <tbody>
                {planning.map((row, i) => (
                  <tr key={row.jour} style={{ background: i % 2 === 0 ? "#f0fafa" : "white" }}>
                    <td className="px-5 py-3.5">
                      <span className="font-black text-sm px-2.5 py-1 rounded-full text-white" style={{ background: "#31B9AE" }}>{row.jour}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{row.matin}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{row.apmidi}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{
                          background: row.format.includes("Distanciel") ? "#fff7ed" : "#E8F9F7",
                          color: row.format.includes("Distanciel") ? "#e67e22" : "#31B9AE"
                        }}>
                        {row.format}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Livrables ── */}
      <section className="py-16" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Livrables
            </span>
            <h2 className="text-3xl font-black text-gray-900">Ce que vous produirez</h2>
            <p className="text-gray-500 mt-2">Un livrable concret à l'issue de chaque module</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: "01", icon: "🔍", titre: "Requête bibliographique", desc: "Une équation de recherche structurée sur votre sujet de pneumologie, avec bibliographie gérée sous Zotero", color: "#31B9AE", bg: "#E8F9F7" },
              { num: "02", icon: "📋", titre: "Plan de protocole", desc: "Un protocole de recherche structuré et soumissible au CERS, avec calcul de taille d'échantillon", color: "#065E52", bg: "#f0fafa" },
              { num: "03", icon: "📄", titre: "Résumé IMRaD", desc: "Un abstract structuré + plan d'article complet prêt à être soumis à une revue identifiée", color: "#e67e22", bg: "#fff7ed" },
              { num: "04", icon: "💰", titre: "Executive summary de grant", desc: "Un résumé de projet de 1 page, ciblant un bailleur identifié (EDCTP, The Union, etc.)", color: "#7c3aed", bg: "#f5f3ff" },
            ].map((item) => (
              <div key={item.num} className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="px-5 py-4" style={{ background: item.bg }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-black opacity-30 text-gray-900">MODULE {item.num}</span>
                  </div>
                  <p className="font-black text-gray-900">{item.titre}</p>
                </div>
                <div className="p-5 bg-background">
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  <div className="mt-4 w-full h-1 rounded-full" style={{ background: item.bg }}>
                    <div className="h-1 rounded-full w-full" style={{ background: item.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Public & infos pratiques ── */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                Public cible
              </span>
              <h2 className="text-2xl font-black text-gray-900 mb-6">À qui s'adresse cette formation ?</h2>
              <div className="space-y-3">
                {[
                  { icon: "🫁", label: "Pneumologues en exercice", desc: "Souhaitant valoriser leurs cas cliniques et études dans des revues indexées" },
                  { icon: "🎓", label: "Internes et résidents en médecine", desc: "Voulant publier leur thèse ou mémoire dans une revue africaine ou internationale" },
                  { icon: "🔬", label: "Enseignants-chercheurs", desc: "Cherchant à renforcer leur production scientifique et obtenir des financements" },
                  { icon: "💊", label: "Pharmaciens et biologistes", desc: "Impliqués dans la recherche clinique ou les essais thérapeutiques" },
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
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="px-6 py-5 font-black text-white text-lg" style={{ background: "linear-gradient(135deg, #065E52 0%, #31B9AE 100%)" }}>
                Informations pratiques
              </div>
              <div className="p-6 bg-background space-y-5">
                {[
                  { icon: "📅", label: "Format", value: "5 jours — 3 jours présentiel + 2 jours distanciel encadré" },
                  { icon: "⏱", label: "Volume horaire", value: "40 heures de formation (cours + ateliers + encadrement individuel)" },
                  { icon: "👥", label: "Participants", value: "15 à 25 participants maximum par session" },
                  { icon: "🖥️", label: "Équipement", value: "Salle informatique avec accès à HINARI, PubMed, Zotero" },
                  { icon: "📍", label: "Lieu", value: "Ouagadougou — site communiqué à l'inscription" },
                  { icon: "🏅", label: "Certification", value: "Attestation DPC officielle SOBUP — Développement Professionnel Continu" },
                  { icon: "🔄", label: "Suivi post-formation", value: "Session de relecture de manuscripts à 3 mois + groupe de travail SOBUP" },
                  { icon: "💰", label: "Tarif", value: "Tarif préférentiel membres SOBUP — Voir programme d'adhésion" },
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

      {/* ── Conseils pratiques ── */}
      <section className="py-16" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "#E8F9F7", color: "#31B9AE" }}>
              Conseils
            </span>
            <h2 className="text-3xl font-black text-gray-900">8 règles d'or pour publier</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: "1", tip: "Commencez par les revues africaines indexées", desc: "PAMJ, African Health Sciences, Méd. d'Afrique Francophone — points d'entrée réalistes et valorisés" },
              { num: "2", tip: "Vérifiez l'accès via HINARI", desc: "Plus de 13 000 revues accessibles gratuitement pour les institutions burkinabè (programme OMS)" },
              { num: "3", tip: "Utilisez les checklists EQUATOR", desc: "CONSORT, STROBE, PRISMA — exigées par les revues Q1/Q2, elles améliorent votre article" },
              { num: "4", tip: "Soignez votre cover letter", desc: "3 paragraphes décisifs : pourquoi ce sujet, pourquoi cette revue, originalité et non-duplication" },
              { num: "5", tip: "Répondez aux reviewers avec méthode", desc: "Point par point, sans défensivité. Un reviewer difficile est une opportunité d'amélioration" },
              { num: "6", tip: "Fuyez les revues prédatrices", desc: "Think.Check.Submit + DOAJ + liste COPE avant toute soumission payante" },
              { num: "7", tip: "Enregistrez votre étude avant de la démarrer", desc: "ClinicalTrials.gov ou PACTR — gratuit, attendu par les revues Q1, cause fréquente de rejet" },
              { num: "8", tip: "Privilégiez l'open access", desc: "PLOS ONE, BMC, ERJ Open Research — des waivers (exemptions APC) existent pour les auteurs africains" },
            ].map((item) => (
              <div key={item.num} className="bg-background rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black mb-3" style={{ background: "#31B9AE" }}>
                  {item.num}
                </div>
                <p className="font-black text-gray-900 text-sm mb-2">{item.tip}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 100%)" }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Donnez de la visibilité à vos travaux</h2>
          <p className="text-white/75 mb-8 text-lg">
            Rejoignez la communauté de chercheurs SOBUP. Publiez dans des revues indexées, financez vos projets et contribuez au rayonnement de la pneumologie burkinabè.
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
          <p className="text-white/50 text-xs mt-6">Attestation DPC officielle · Suivi post-formation à 3 mois · Tarif préférentiel membres SOBUP</p>
        </div>
      </section>
    </>
  );
}
