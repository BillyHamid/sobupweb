import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";
import Newsletter from "@/components/Newsletter";

/* ─── Mock data ─── */

const upcomingEvents = [
  {
    date: "24",
    month: "Juil",
    year: "2026",
    time: "15h30 – 17h30",
    title: "Prise en charge des pathologies respiratoires professionnelles indemnisables (déclaration et réparation)",
    location: "Salle de conférence de la CARFO, Ouagadougou",
    type: "EPU",
    badge: "bg-green-600 text-white",
    href: "/evenements",
    image: "/ev-environnement-travail.jpg",
    gtt: "GT Environnement & Travail",
  },
  {
    date: "8",
    month: "Août",
    year: "2026",
    title: "2ème session de l'École de l'Asthme et des Allergies",
    location: "CHUP Charles de Gaulle, Ouagadougou",
    type: "",
    badge: "bg-blue-600 text-white",
    href: "/evenements",
    image: "/ev-asthme-ecole.png",
    gtt: "GT Asthme & Allergies · GT Pneumo-Pédiatrie",
  },
  {
    date: "19-21",
    month: "Nov",
    year: "2026",
    title: "1ère Journée Scientifique Régionale",
    location: "Koudougou, Burkina Faso",
    type: "Journée",
    badge: "bg-secondary text-white",
    href: "/evenements/journee-regionale",
    image: "/ev-journee-regionale.jpg",
  },
  {
    date: "16-18",
    month: "Déc",
    year: "2027",
    title: "9ème Congrès de la SOBUP",
    location: "Ouagadougou, Burkina Faso",
    type: "Congrès",
    badge: "bg-accent text-white",
    href: "/evenements/9eme-congres",
    image: "/congres-6.jpg",
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



/* ─── Page ─── */

export default function Home() {
  return (
    <>
      {/* ══════════════════════════════════════
          HERO CAROUSEL
      ══════════════════════════════════════ */}
      <HeroCarousel />

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
                    src="/baniercongres/presi.jpeg"
                    alt="Portrait du Président de la SOBUP"
                    fill
                    className="object-cover"
                    style={{ objectPosition: "60% 12%", transformOrigin: "60% 22%", transform: "scale(1.15)" }}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((ev, i) => (
              <Link key={i} href={ev.href}
                className="group bg-background rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 card-shadow">
                {/* Image or color banner */}
                {ev.image ? (
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <Image
                      src={ev.image}
                      alt={ev.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
                    {ev.type && (
                      <span className={`absolute top-3 left-3 ${ev.badge} text-xs font-bold px-3 py-1 rounded-full shadow`}>
                        {ev.type}
                      </span>
                    )}
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
                  {"time" in ev && ev.time && (
                    <p className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: "#e67e22" }}>
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {(ev as { time: string }).time}
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {ev.location}
                  </p>
                  {"gtt" in ev && ev.gtt && (
                    <p className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#31B9AE" }}>
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {(ev as { gtt: string }).gtt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          JOURNAL SOBUP (Newsletter — centrée)
      ══════════════════════════════════════ */}
      <section className="py-16 bg-primary-light/40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-center">
            <Link
              href="/journal"
              className="group block relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white w-full max-w-md"
            >
              <div className="relative">
                <Image
                  src="/newletter.jpg"
                  alt="Couverture Newsletter SOBUP N°1 — Avril 2026"
                  width={1200}
                  height={1700}
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 28rem"
                />
                {/* Badge numéro */}
                <span
                  className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-md backdrop-blur-sm"
                  style={{ background: "rgba(255,255,255,.95)", color: "#0a7265" }}
                >
                  📖 N°1 · Avril 2026
                </span>
                {/* CTA bas avec dégradé */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                  <span
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg"
                    style={{ background: "#e67e22" }}
                  >
                    Lire le numéro
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
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

      {/* ══════════════════════════════════════
          NOS PARTENAIRES
      ══════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #0B3D38 0%, #0a5c52 50%, #0d7a6e 100%)" }}>
        {/* Texture points */}
        <div className="absolute inset-0 pointer-events-none opacity-[.06]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Halos décoratifs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(49,185,174,.25) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(230,126,34,.2) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative mx-auto max-w-7xl px-4">
          {/* En-tête */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] px-4 py-2 rounded-full mb-4"
              style={{ background: "rgba(49,185,174,.18)", border: "1px solid rgba(49,185,174,.35)", color: "#7EEAE4" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7EEAE4" }} />
              Ils nous font confiance
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">Nos partenaires</h2>
            <div className="w-10 h-1 rounded-full mx-auto mt-3" style={{ background: "#e67e22" }} />
          </div>

          {/* Logos */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { src: "/PATS.jpeg", alt: "PATS", name: "PATS" },
              { src: "/SAPLF.jpg", alt: "SAPLF", name: "SAPLF" },
              { src: "/PNT.jpg", alt: "Programme National Tuberculose — Burkina Faso", name: "PNT" },
            ].map((p) => (
              <div key={p.alt}
                className="group relative flex flex-col items-center gap-5 px-16 py-10 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(8px)" }}>
                {/* Halo hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(49,185,174,.08)", border: "1px solid rgba(49,185,174,.3)" }} />
                {/* Logo */}
                <div className="relative w-52 h-24 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="max-h-24 max-w-[208px] w-auto object-contain"
                  />
                </div>
                <span className="relative text-xs font-bold tracking-widest uppercase text-white/50">
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          {/* Ligne bas */}
          <p className="text-center text-xs text-white/30 mt-12">
            Vous souhaitez devenir partenaire ?{" "}
            <Link href="/contact" className="underline hover:text-white/60 transition-colors">Contactez-nous</Link>
          </p>
        </div>
      </section>
    </>
  );
}
