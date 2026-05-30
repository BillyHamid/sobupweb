import Link from "next/link";
import Image from "next/image";

const heroImages = [
  "/baniercongres/congres-1-v2.jpeg",
  "/baniercongres/congres-2-v2.jpg",
  "/baniercongres/congres-3-v3.jpeg",
  "/baniercongres/congres-4-v3.JPG",
];

const objectifs = [
  { icon: "🤝", titre: "Rapprocher", desc: "Amener l'expertise et les activités de la SOBUP au plus près des praticiens des régions." },
  { icon: "🎓", titre: "Former", desc: "Renforcer les compétences des professionnels de santé régionaux en pneumologie." },
  { icon: "🫁", titre: "Dépister", desc: "Sensibiliser et dépister les maladies respiratoires auprès des populations locales." },
  { icon: "🔗", titre: "Fédérer", desc: "Bâtir un réseau régional durable de collègues engagés pour la santé respiratoire." },
];

const programme = [
  { h: "08h00", t: "Accueil et enregistrement des participants" },
  { h: "09h00", t: "Cérémonie d'ouverture officielle" },
  { h: "09h30", t: "Conférence inaugurale — La pneumologie de proximité au Burkina Faso" },
  { h: "10h30", t: "Pause & visite des stands" },
  { h: "11h00", t: "Symposium — Prise en charge des pathologies respiratoires en région" },
  { h: "12h30", t: "Déjeuner & networking" },
  { h: "14h00", t: "Ateliers pratiques — spirométrie, sevrage tabagique, urgences respiratoires" },
  { h: "15h30", t: "Table ronde — Collaboration ville-hôpital et référencement des patients" },
  { h: "16h30", t: "Communications libres & présentation des posters" },
  { h: "17h30", t: "Synthèse, recommandations régionales et clôture" },
];

const infos = [
  { icon: "📅", label: "Date", value: "19 Novembre 2026" },
  { icon: "📍", label: "Lieu", value: "Koudougou, Burkina Faso" },
  { icon: "🌐", label: "Format", value: "Présentiel" },
  { icon: "👥", label: "Public", value: "Pneumologues, médecins, paramédicaux & étudiants" },
];

export default function JourneeRegionalePage() {
  return (
    <>
      {/* ════════════════ HÉROS ANIMÉ ════════════════ */}
      <section className="relative overflow-hidden text-white" style={{ background: "#0B3D38" }}>
        {/* Diaporama d'images en arrière-plan */}
        <div className="absolute inset-0 pointer-events-none">
          {heroImages.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ opacity: 0, animation: `jr-slideshow 32s ${i * 8}s infinite` }}
            />
          ))}
        </div>
        {/* Voile sombre pour la lisibilité */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(150deg, rgba(11,61,56,.92) 0%, rgba(6,94,82,.86) 50%, rgba(10,114,101,.82) 100%)" }}
        />
        {/* Texture points */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[.10]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />
        {/* Blobs flottants */}
        <div className="absolute pointer-events-none rounded-full" style={{ top: "-90px", right: "-60px", width: "360px", height: "360px", background: "radial-gradient(circle, rgba(49,185,174,.45) 0%, transparent 70%)", filter: "blur(40px)", animation: "jr-float 9s ease-in-out infinite" }} />
        <div className="absolute pointer-events-none rounded-full" style={{ bottom: "-80px", left: "-40px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(230,126,34,.30) 0%, transparent 70%)", filter: "blur(50px)", animation: "jr-float 11s ease-in-out infinite reverse" }} />
        {/* Anneau tournant */}
        <div className="absolute pointer-events-none hidden md:block" style={{ top: "8%", right: "6%", width: "260px", height: "260px", borderRadius: "50%", border: "1px dashed rgba(255,255,255,.18)", animation: "jr-spin 34s linear infinite" }} />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:py-28 text-center">
          {/* Fil d'Ariane */}
          <nav className="flex items-center justify-center gap-2 text-xs text-white/55 mb-6" style={{ animation: "jr-fade .6s ease both" }}>
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/evenements" className="hover:text-white transition-colors">Événements</Link>
            <span>/</span>
            <span className="text-white/85">Journée Scientifique Régionale</span>
          </nav>

          {/* Tag */}
          <span
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(49,185,174,.22)", border: "1px solid rgba(49,185,174,.4)", color: "#7EEAE4", animation: "jr-fade .6s ease both", animationDelay: ".08s" }}
          >
            <span style={{ animation: "jr-pulse 2.2s ease-in-out infinite" }}>●</span>
            1ère Journée Scientifique Régionale · 2026
          </span>

          {/* Titre */}
          <h1
            className="font-black leading-tight mb-6"
            style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.4rem)", animation: "jr-up .7s ease both", animationDelay: ".15s" }}
          >
            <span className="block">Rapprocher les activités SOBUP</span>
            <span className="block" style={{ color: "#7EEAE4" }}>vers les collègues et les patients en régions</span>
          </h1>

          {/* Barre accent */}
          <div className="mx-auto mb-7 rounded-full" style={{ width: "70px", height: "4px", background: "#e67e22", animation: "jr-up .7s ease both", animationDelay: ".22s" }} />

          {/* Sous-titre */}
          <p
            className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed mb-8"
            style={{ color: "rgba(255,255,255,.8)", animation: "jr-up .7s ease both", animationDelay: ".28s" }}
          >
            Une journée de partage scientifique au cœur des régions : former, dépister et fédérer les
            acteurs de la santé respiratoire, au plus près des praticiens et des populations.
          </p>

          {/* Chips infos */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-9" style={{ animation: "jr-up .7s ease both", animationDelay: ".34s" }}>
            {[
              { icon: "📅", text: "19 Novembre 2026" },
              { icon: "📍", text: "Koudougou, Burkina Faso" },
              { icon: "🌐", text: "Présentiel" },
            ].map((c) => (
              <span key={c.text} className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)" }}>
                <span>{c.icon}</span> {c.text}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3" style={{ animation: "jr-up .7s ease both", animationDelay: ".4s" }}>
            <Link
              href="/espace-membre"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-sm shadow-lg transition-all hover:-translate-y-0.5"
              style={{ background: "#e67e22", boxShadow: "0 12px 34px rgba(230,126,34,.4)" }}
            >
              S&apos;inscrire à la journée
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link
              href="/abstracts"
              className="inline-flex items-center px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-white/20"
              style={{ color: "#fff", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.25)" }}
            >
              Soumettre un abstract
            </Link>
          </div>
        </div>

        {/* Vague bas */}
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 48" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,24 C480,48 960,0 1440,24 L1440,48 L0,48 Z" fill="#F5F5F5" />
        </svg>

        <style>{`
          @keyframes jr-up { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes jr-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes jr-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-26px); } }
          @keyframes jr-spin { to { transform: rotate(360deg); } }
          @keyframes jr-pulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
          @keyframes jr-slideshow {
            0%   { opacity: 0; transform: scale(1.04); }
            3%   { opacity: 1; }
            22%  { opacity: 1; }
            28%  { opacity: 0; transform: scale(1.12); }
            100% { opacity: 0; transform: scale(1.04); }
          }
        `}</style>
      </section>

      {/* ════════════════ OBJECTIFS ════════════════ */}
      <section className="py-16" style={{ background: "#F5F5F5" }}>
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Notre ambition</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 section-title">Pourquoi cette journée&nbsp;?</h2>
            <p className="mt-3 text-gray-500 text-sm max-w-2xl mx-auto">
              Décentraliser l&apos;excellence scientifique de la SOBUP pour qu&apos;elle profite à tous, partout au Burkina Faso.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {objectifs.map((o) => (
              <div key={o.titre} className="bg-background rounded-2xl p-6 border border-gray-100 card-shadow hover:shadow-lg hover:-translate-y-1 transition-all">
                <span className="text-4xl block mb-4">{o.icon}</span>
                <h3 className="font-black text-gray-900 text-lg mb-1.5">{o.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PROGRAMME ════════════════ */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Au programme</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 section-title">Déroulé de la journée</h2>
          </div>
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute top-2 bottom-2 left-[68px] sm:left-[84px] w-px" style={{ background: "linear-gradient(to bottom, var(--primary), var(--secondary-light))" }} />
            <div className="space-y-5">
              {programme.map((p) => (
                <div key={p.h} className="relative flex items-start gap-4 sm:gap-6">
                  <div className="shrink-0 w-14 sm:w-16 text-right">
                    <span className="text-sm font-black" style={{ color: "#31B9AE" }}>{p.h}</span>
                  </div>
                  <div className="relative shrink-0 mt-1.5">
                    <span className="block w-3.5 h-3.5 rounded-full ring-4 ring-white" style={{ background: "#31B9AE" }} />
                  </div>
                  <div className="flex-1 bg-background rounded-xl border border-gray-100 px-5 py-3.5 card-shadow">
                    <p className="text-sm text-gray-700 font-medium">{p.t}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">Programme prévisionnel — susceptible d&apos;ajustements.</p>
        </div>
      </section>

      {/* ════════════════ INFOS PRATIQUES ════════════════ */}
      <section className="py-16" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Infos pratiques</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 section-title">L&apos;essentiel à retenir</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infos.map((i) => (
              <div key={i.label} className="bg-background rounded-2xl p-6 text-center border border-gray-100 card-shadow">
                <span className="text-3xl block mb-3">{i.icon}</span>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">{i.label}</p>
                <p className="font-bold text-gray-900 text-sm">{i.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="py-16 banniere-sobup text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10" style={{ background: "#fff", filter: "blur(60px)" }} />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Participez à la 1ère Journée Régionale</h2>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Rejoignez vos collègues à Koudougou pour une journée de science, de partage et d&apos;engagement
            au service de la santé respiratoire des régions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/espace-membre" className="px-7 py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5" style={{ background: "#e67e22" }}>
              S&apos;inscrire maintenant
            </Link>
            <Link href="/evenements" className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-white/20" style={{ color: "#fff", border: "1px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.08)" }}>
              ← Tous les événements
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
