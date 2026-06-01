import Link from "next/link";
import Image from "next/image";

const highlights = [
  { icon: "🏛️", label: "Vie de la société", desc: "L'Assemblée Générale Élective" },
  { icon: "📜", label: "Histoire & Héritage", desc: "Entretien avec le Pr Martial OUEDRAOGO" },
  { icon: "🎖️", label: "Hommages", desc: "Pr Bernard KOFFI N'GORAN — Abidjan" },
  { icon: "🔬", label: "Rayonnement scientifique", desc: "Actualité scientifique en bref" },
];

export default function JournalPage() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "linear-gradient(160deg, #0B3D38 0%, #065E52 45%, #0a7265 100%)",
      }}
    >
      {/* Texture points */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[.08]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Blobs flottants */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: "-100px",
          right: "-80px",
          width: "440px",
          height: "440px",
          background: "radial-gradient(circle, rgba(49,185,174,.42) 0%, transparent 70%)",
          filter: "blur(45px)",
          animation: "j-float 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          bottom: "-80px",
          left: "-60px",
          width: "340px",
          height: "340px",
          background: "radial-gradient(circle, rgba(230,126,34,.28) 0%, transparent 70%)",
          filter: "blur(55px)",
          animation: "j-float 11s ease-in-out infinite reverse",
        }}
      />
      {/* Anneau tournant */}
      <div
        className="absolute pointer-events-none hidden md:block"
        style={{
          top: "10%",
          right: "6%",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          border: "1px dashed rgba(255,255,255,.15)",
          animation: "j-spin 34s linear infinite",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-20">
        {/* Retour accueil */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors mb-10"
          style={{ animation: "j-fade .6s ease both" }}
        >
          ← Retour à l&apos;accueil
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* COUVERTURE — vitrine magazine */}
          <div
            className="relative flex justify-center lg:justify-start"
            style={{ animation: "j-fadeup .8s ease both" }}
          >
            {/* Halo coloré derrière */}
            <div
              className="absolute inset-x-10 top-10 bottom-10 rounded-3xl opacity-60 blur-3xl"
              style={{ background: "linear-gradient(135deg, #31B9AE 0%, #e67e22 100%)" }}
            />
            {/* Cercles décoratifs */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-40 pointer-events-none"
              style={{
                background: "radial-gradient(circle, #e67e22 0%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
            {/* Couverture inclinée */}
            <div
              className="relative rounded-2xl overflow-hidden bg-white max-w-md w-full transition-transform duration-500 hover:rotate-0"
              style={{
                transform: "rotate(-2.5deg)",
                boxShadow: "0 30px 80px rgba(0,0,0,.55), 0 8px 20px rgba(0,0,0,.25)",
              }}
            >
              <Image
                src="/newletter.jpg"
                alt="Newsletter SOBUP N°1 — Avril 2026"
                width={1200}
                height={1700}
                className="w-full h-auto block"
                sizes="(max-width: 1024px) 90vw, 480px"
                priority
              />
              {/* Ruban NOUVEAU */}
              <div
                className="absolute top-5 -right-1 px-4 py-1.5 text-[11px] font-black text-white tracking-widest shadow-lg"
                style={{
                  background: "#e67e22",
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 75%)",
                }}
              >
                NOUVEAU
              </div>
            </div>
          </div>

          {/* INFOS + SOMMAIRE + DOWNLOAD */}
          <div style={{ animation: "j-fadeup .8s ease both", animationDelay: ".15s" }}>
            {/* Tag pulsant */}
            <span
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(49,185,174,.22)",
                border: "1px solid rgba(49,185,174,.4)",
                color: "#7EEAE4",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#7EEAE4", animation: "j-pulse 2s ease-in-out infinite" }}
              />
              Bulletin d&apos;information · Numéro 1
            </span>

            {/* Titre deux-tons */}
            <h1 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
              <span className="block">Newsletter SOBUP</span>
              <span className="block" style={{ color: "#7EEAE4" }}>Avril 2026</span>
            </h1>

            {/* Barre accent */}
            <div
              className="mb-6 rounded-full"
              style={{ width: "60px", height: "4px", background: "#e67e22" }}
            />

            {/* Description */}
            <p className="text-base md:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,.78)" }}>
              Découvrez le premier numéro du bulletin d&apos;information de la Société Burkinabè
              de Pneumologie&nbsp;: actualité de la société, histoire, hommages et rayonnement
              scientifique.
            </p>

            {/* Sommaire express */}
            <div className="grid sm:grid-cols-2 gap-3 mb-9">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}
                >
                  <span className="text-xl shrink-0" aria-hidden>{h.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight">{h.label}</p>
                    <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,.6)" }}>{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/newsletter-n1-avril-2026.pdf"
                download
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black text-white text-base transition-all hover:-translate-y-1"
                style={{ background: "#e67e22", boxShadow: "0 16px 40px rgba(230,126,34,.5)" }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                  />
                </svg>
                Télécharger le PDF
                <span className="text-xs font-normal opacity-80">· 7 Mo</span>
              </a>
              <a
                href="/newsletter-n1-avril-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all hover:bg-white/20"
                style={{
                  color: "#fff",
                  background: "rgba(255,255,255,.1)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Lire en ligne
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes j-fadeup { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes j-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes j-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-24px); } }
        @keyframes j-spin { to { transform: rotate(360deg); } }
        @keyframes j-pulse { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
      `}</style>
    </section>
  );
}
