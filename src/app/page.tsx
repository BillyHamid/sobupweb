import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";
import Newsletter from "@/components/Newsletter";

/* ─── Mock data ─── */

const gttGroups = [
  { name: "Tuberculose", icon: "🫁", slug: "tuberculose", color: "bg-red-50 border-red-200 text-red-700" },
  { name: "Asthme & Allergie", icon: "💨", slug: "asthme-allergie", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { name: "Oncologie thoracique", icon: "🔬", slug: "oncologie-thoracique", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { name: "Tabac & BPCO", icon: "🚭", slug: "tabac-bpco", color: "bg-gray-50 border-gray-200 text-gray-700" },
  { name: "Pneumo-pédiatrie", icon: "👶", slug: "pneumo-pediatrie", color: "bg-pink-50 border-pink-200 text-pink-700" },
  { name: "Sommeil & VNI", icon: "😴", slug: "sommeil-vni", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
  { name: "Imagerie thoracique", icon: "📷", slug: "imagerie-thoracique", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
  { name: "Endoscopie bronchique", icon: "🩺", slug: "endoscopie-bronchique", color: "bg-primary-light border-primary/25 text-primary-dark" },
  { name: "EFR", icon: "📊", slug: "efr", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { name: "Infections non TB", icon: "🦠", slug: "infections-non-tb", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { name: "Environnement & Travail", icon: "🏭", slug: "environnement-travail", color: "bg-primary-light border-primary/25 text-primary-dark" },
];

const upcomingEvents = [
  {
    date: "19",
    month: "Nov",
    year: "2026",
    title: "1ère Journée Scientifique Régionale",
    location: "Koudougou, Burkina Faso",
    type: "Journée",
    badge: "bg-secondary text-white",
    href: "/evenements/journee-regionale",
    image: "/baniercongres/ban1.jpeg",
  },
  {
    date: "16",
    month: "Déc",
    year: "2027",
    title: "9ème Congrès de la SOBUP",
    location: "Ouagadougou, Burkina Faso",
    type: "Congrès",
    badge: "bg-accent text-white",
    href: "/evenements/9eme-congres",
    image: "/baniercongres/congres-4.jpeg",
  },
  {
    date: "22",
    month: "Juin",
    year: "2026",
    title: "Webinaire : Prise en charge de l'asthme sévère",
    location: "En ligne",
    type: "Webinaire",
    badge: "bg-primary text-white",
    href: "/evenements/webinaire-asthme",
    image: null,
  },
];

const latestNews = [
  {
    category: "Recommandations",
    date: "5 Avr 2026",
    title: "Nouvelles recommandations sur la tuberculose résistante au Burkina Faso",
    excerpt: "Le GTT Tuberculose publie ses recommandations actualisées pour la prise en charge de la TB-MDR.",
    gtt: "GT Tuberculose",
    href: "/blog/recommandations-tb-mdr-2026",
  },
  {
    category: "Recherche",
    date: "28 Mar 2026",
    title: "BPCO en Afrique subsaharienne : prévalence et facteurs de risque",
    excerpt: "Revue de la littérature sur la BPCO dans notre région. Une étude menée par le GT Tabac & BPCO.",
    gtt: "GT Tabac & BPCO",
    href: "/blog/bpco-afrique-subsaharienne",
  },
  {
    category: "Actualités",
    date: "15 Mar 2026",
    title: "8ème congrès SOBUP : plus de 200 participants réunis",
    excerpt: "Retour sur le 8ème congrès annuel qui a réuni pneumologues, chercheurs et partenaires.",
    gtt: null,
    href: "/blog/bilan-8eme-congres",
  },
  {
    category: "Formation",
    date: "5 Mar 2026",
    title: "Nouveau module e-learning : Imagerie thoracique pour cliniciens",
    excerpt: "Le GT Imagerie thoracique lance un module de formation en ligne accessible à tous les membres.",
    gtt: "GT Imagerie",
    href: "/blog/module-elearning-imagerie",
  },
];

const journalArticles = [
  {
    type: "Article original",
    title: "Prévalence de la silicose chez les mineurs artisanaux au Burkina Faso",
    authors: "Ouédraogo K., Sawadogo B., et al.",
    year: "2026",
  },
  {
    type: "Éditorial",
    title: "Vers une pneumologie africaine : défis et perspectives",
    authors: "Pr. Zoungrana O.",
    year: "2026",
  },
  {
    type: "Cas clinique",
    title: "Aspergillome pulmonaire sur séquelle de tuberculose — à propos d'un cas",
    authors: "Compaoré Y., Traoré S.",
    year: "2026",
  },
];


/* ─── Page ─── */

export default function Home() {
  return (
    <>
      {/* ══════════════════════════════════════
          HERO CAROUSEL
      ══════════════════════════════════════ */}
      <HeroCarousel />

      {/* ══════════════════════════════════════
          QUICK ACCESS
      ══════════════════════════════════════ */}
      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "📋", title: "Recommandations", sub: "Guides & protocoles nationaux", href: "/recommandations", bg: "from-blue-50 to-blue-100", border: "border-blue-200", text: "text-blue-700" },
              { icon: "👥", title: "Annuaire", sub: "Trouver un pneumologue", href: "/annuaire", bg: "from-primary-light to-secondary-light", border: "border-primary/25", text: "text-primary-dark" },
              { icon: "🎓", title: "Formations", sub: "E-learning & webinaires", href: "/formations", bg: "from-purple-50 to-purple-100", border: "border-purple-200", text: "text-purple-700" },
              { icon: "📰", title: "Newsletter SOBUP", sub: "Publications scientifiques", href: "/journal", bg: "from-orange-50 to-orange-100", border: "border-orange-200", text: "text-orange-700" },
            ].map((item) => (
              <Link key={item.title} href={item.href}
                className={`group bg-gradient-to-br ${item.bg} border ${item.border} rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5`}>
                <span className="text-3xl block mb-3">{item.icon}</span>
                <p className={`font-bold text-base ${item.text} mb-1`}>{item.title}</p>
                <p className="text-sm text-gray-500">{item.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MOT DU PRÉSIDENT (comme PATS)
      ══════════════════════════════════════ */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            {/* Photo */}
            <div className="md:col-span-2 flex justify-center">
              <div className="relative">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-xl ring-4 ring-white">
                  <Image
                    src="/president-sobup.png"
                    alt="Portrait du Président de la SOBUP"
                    fill
                    className="object-cover object-[center_15%]"
                    sizes="(max-width: 640px) 288px, (max-width: 768px) 320px, 384px"
                    priority
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background rounded-full px-4 py-1.5 shadow-md">
                  <span className="text-xs font-bold text-primary whitespace-nowrap">Président, SOBUP</span>
                </div>
              </div>
            </div>
            {/* Message */}
            <div className="md:col-span-3">
              <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">
                Mot du Président
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 section-title">
                Ensemble pour la santé respiratoire
              </h2>
              <blockquote className="text-gray-600 leading-relaxed text-base mb-4 border-l-4 border-secondary pl-5 italic">
                &ldquo;La SOBUP incarne notre engagement collectif envers l&apos;excellence en pneumologie.
                Chaque membre, chaque groupe de travail, chaque publication contribue à améliorer
                la prise en charge des maladies respiratoires au Burkina Faso. Ce site est votre
                espace — celui de toute notre communauté scientifique.&rdquo;
              </blockquote>
              <p className="font-bold text-gray-900">Docteur Abdoul Risgou OUEDRAOGO (MCA)</p>
              <p className="text-sm text-gray-500">Président de la SOBUP</p>
              <Link href="/a-propos" className="inline-flex items-center gap-1.5 mt-4 text-primary hover:text-primary-dark font-semibold text-sm transition-colors">
                En savoir plus sur la SOBUP
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          GTT — GROUPES DE TRAVAIL
      ══════════════════════════════════════ */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Expertise scientifique</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Groupes de Travail Thématiques
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Les GTT sont le cœur scientifique de la SOBUP. Ils produisent recommandations, formations
              et ressources scientifiques pour chaque spécialité.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {gttGroups.map((gtt) => (
              <Link key={gtt.slug} href={`/gtt/${gtt.slug}`}
                className={`group border-2 ${gtt.color} rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5 bg-background`}>
                <span className="text-3xl block mb-3">{gtt.icon}</span>
                <p className="font-bold text-gray-900 group-hover:text-primary text-base leading-tight">
                  {gtt.name}
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gtt"
              className="inline-flex items-center gap-2 bg-primary-light hover:bg-blue-100 text-primary px-6 py-3 rounded-lg font-semibold text-sm transition-colors">
              Voir tous les groupes de travail
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          JOURNAL SOBUP
      ══════════════════════════════════════ */}
      <section className="py-16 bg-primary-light/40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-5 gap-8 items-start">
            {/* Left — promo */}
            <div className="md:col-span-2 bg-primary rounded-2xl p-8 text-white">
              <span className="text-4xl block mb-4">📖</span>
              <h2 className="text-2xl font-bold mb-3">Journal Scientifique SOBUP</h2>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Publication officielle de la SOBUP — articles originaux, éditoriaux,
                cas cliniques et revues de la littérature en pneumologie africaine.
              </p>
              <Link href="/journal"
                className="inline-block bg-background text-primary hover:bg-gray-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
                Consulter le journal
              </Link>
            </div>
            {/* Right — articles */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-lg">Derniers articles</h3>
                <Link href="/journal" className="text-primary text-sm font-medium hover:underline">
                  Tout voir →
                </Link>
              </div>
              {journalArticles.map((article, i) => (
                <div key={i}
                  className="bg-background rounded-xl p-5 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer card-shadow">
                  <span className="text-xs font-semibold bg-secondary-light text-secondary px-2.5 py-1 rounded-full">
                    {article.type}
                  </span>
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary mt-2 mb-1 text-sm leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-gray-400">{article.authors} — {article.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ÉVÉNEMENTS
      ══════════════════════════════════════ */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Agenda</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 section-title">
                Événements à venir
              </h2>
            </div>
            <Link href="/evenements"
              className="hidden sm:inline-flex items-center gap-1.5 text-primary hover:text-primary-dark font-semibold text-sm">
              Tout l&apos;agenda
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((ev, i) => (
              <Link key={i} href={ev.href}
                className="group bg-background rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 card-shadow">
                {/* Image or color banner */}
                {ev.image ? (
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={ev.image}
                      alt={ev.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
                    <span className={`absolute top-3 left-3 ${ev.badge} text-xs font-bold px-3 py-1 rounded-full shadow`}>
                      {ev.type}
                    </span>
                    <div className="absolute bottom-3 left-4 flex items-baseline gap-1.5 text-white">
                      <span className="text-3xl font-black leading-none">{ev.date}</span>
                      <span className="text-sm font-medium opacity-90">{ev.month} {ev.year}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-primary px-6 py-4 flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white leading-none">{ev.date}</p>
                      <p className="text-blue-200 text-sm font-medium">{ev.month} {ev.year}</p>
                    </div>
                    <span className={`${ev.badge} text-xs font-bold px-3 py-1 rounded-full ml-auto`}>
                      {ev.type}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-base leading-snug mb-3">
                    {ev.title}
                  </h3>
                  <p className="flex items-center gap-1.5 text-xs text-gray-400">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {ev.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════ */}
      <Newsletter />

      {/* ══════════════════════════════════════
          CTA ADHÉSION
      ══════════════════════════════════════ */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0B3D38 0%, #065E52 50%, #31B9AE 100%)" }}
      >
        {/* Dot texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Decorative rings */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-white/5 pointer-events-none"/>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full border border-white/5 pointer-events-none"/>

        <div className="relative mx-auto max-w-5xl px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left — text */}
            <div>
              <span
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
                style={{ background: "rgba(49,185,174,0.2)", border: "1px solid rgba(49,185,174,0.4)", color: "#7EEAE4" }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#7EEAE4" }}/>
                Adhésion SOBUP
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Rejoignez la<br/>
                <span style={{ color: "#7EEAE4" }}>communauté SOBUP</span>
              </h2>
              <div className="w-12 h-1 rounded-full mb-5" style={{ background: "#e67e22" }}/>
              <p className="text-white/80 text-base leading-relaxed max-w-md">
                Devenez membre actif — accédez aux ressources exclusives, rejoignez un Groupe de Travail Thématique et participez à nos congrès.
              </p>
            </div>
            {/* Right — cards + CTAs */}
            <div className="space-y-4">
              {[
                { icon: "📚", label: "Ressources & publications exclusives" },
                { icon: "🏆", label: "Accès aux congrès et formations" },
                { icon: "👥", label: "Réseau de 150+ pneumologues" },
                { icon: "🔬", label: "Participation aux groupes de travail" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-white/90 font-medium text-sm">{item.label}</span>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Link href="/adhesion"
                  className="flex-1 text-center px-6 py-3 rounded-xl font-black text-white text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ background: "#e67e22" }}>
                  Adhérer maintenant
                </Link>
                <Link href="/espace-membre"
                  className="flex-1 text-center px-6 py-3 rounded-xl font-black text-sm border transition-all hover:-translate-y-0.5"
                  style={{ color: "#7EEAE4", borderColor: "rgba(49,185,174,0.45)", background: "rgba(49,185,174,0.1)" }}>
                  Espace membre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
