"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface TitleLine { text: string; accent: boolean; }

const slides = [
  {
    id: 1,
    titleLines: [
      { text: "Pneumologie en Afrique :", accent: false },
      { text: "défis et innovations", accent: true },
    ] as TitleLine[],
    subtitle: "Du 16 au 18 Décembre 2027 à Ouagadougou — Moments forts et échanges scientifiques.",
    cta1: { label: "S'inscrire au congrès", href: "/evenements/9eme-congres" },
    cta2: { label: "Voir les photos", href: "/blog" },
    image: "/baniercongres/congres-1.jpeg",
    imageAlt: "9ème congrès SOBUP - Photo 1",
  },
  {
    id: 2,
    titleLines: [
      { text: "Rencontres scientifiques", accent: true },
      { text: "et collaborations", accent: false },
    ] as TitleLine[],
    subtitle: "Échanges entre pneumologues de tout le Burkina Faso et d'Afrique.",
    cta1: { label: "S'inscrire au congrès", href: "/evenements/9eme-congres" },
    cta2: { label: "Voir les photos", href: "/blog" },
    image: "/baniercongres/congres-2.jpeg",
    imageAlt: "9ème congrès SOBUP - Photo 2",
  },
  {
    id: 3,
    titleLines: [
      { text: "Sessions plénières", accent: false },
      { text: "et ateliers interactifs", accent: true },
    ] as TitleLine[],
    subtitle: "Formations et discussions approfondies sur les défis pneumologiques actuels.",
    cta1: { label: "S'inscrire au congrès", href: "/evenements/9eme-congres" },
    cta2: { label: "Voir les photos", href: "/blog" },
    image: "/baniercongres/congres-3.jpeg",
    imageAlt: "9ème congrès SOBUP - Photo 3",
  },
  {
    id: 4,
    titleLines: [
      { text: "Réseautage professionnel", accent: true },
      { text: "et partage d'expertises", accent: false },
    ] as TitleLine[],
    subtitle: "Connexions durables au sein de la communauté pneumologique africaine.",
    cta1: { label: "S'inscrire au congrès", href: "/evenements/9eme-congres" },
    cta2: { label: "Voir les photos", href: "/blog" },
    image: "/baniercongres/congres-4.jpeg",
    imageAlt: "9ème congrès SOBUP - Photo 4",
  },
  {
    id: 5,
    titleLines: [
      { text: "Évènements et congrès", accent: false },
      { text: "à venir", accent: true },
    ] as TitleLine[],
    subtitle: "Inscrivez-vous aux prochains évènements de la SOBUP et restez connecté.",
    cta1: { label: "Voir tous les évènements", href: "/evenements" },
    cta2: { label: "Adhérer à la SOBUP", href: "/adhesion" },
    image: "/ban1.jpg",
    imageAlt: "Bannière SOBUP évènements",
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index: number) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setProgress(0);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 450);
  }, [transitioning, current]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / AUTOPLAY_MS) * 100, 100);
      setProgress(pct);
      if (pct >= 100) next();
    }, 50);
    return () => clearInterval(id);
  }, [current, next]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [next, prev]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: "620px",
        background: "linear-gradient(160deg, #0B3D38 0%, #065E52 45%, #31B9AE 100%)",
      }}
    >
      {/* ── Dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Decorative circle rings (top-right) ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-80px", right: "-80px",
          width: "420px", height: "420px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-30px", right: "-30px",
          width: "300px", height: "300px",
          borderRadius: "50%",
          border: "1px dashed rgba(49,185,174,0.25)",
        }}
      />

      {/* ── Slide counter ── */}
      <div className="absolute top-5 right-16 z-20 text-white/40 text-xs font-mono select-none tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 min-h-[620px] flex items-center">
        <div className="grid sm:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-16 sm:py-20">

          {/* LEFT — Typography */}
          <div
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "translateY(18px)" : "translateY(0)",
              transition: "opacity .45s ease, transform .45s ease",
            }}
          >
            {/* Two-tone title */}
            <h1 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)" }}>
              {slide.titleLines.map((line, i) => (
                <span
                  key={i}
                  className="block"
                  style={{ color: line.accent ? "#7EEAE4" : "#FFFFFF", whiteSpace: "nowrap" }}
                >
                  {line.text}
                </span>
              ))}
            </h1>

            {/* Orange accent bar */}
            <div
              className="mb-5 rounded-full"
              style={{ width: "56px", height: "4px", background: "#e67e22" }}
            />

            {/* Subtitle */}
            <p className="text-base md:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.78)" }}>
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href={slide.cta1.href}
                className="px-6 py-3 rounded-xl font-black text-white text-sm shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: "#e67e22" }}
              >
                {slide.cta1.label}
              </Link>
              <Link
                href={slide.cta2.href}
                className="px-6 py-3 rounded-xl font-black text-sm border transition-all hover:-translate-y-0.5"
                style={{
                  color: "#7EEAE4",
                  borderColor: "rgba(49,185,174,0.45)",
                  background: "rgba(49,185,174,0.1)",
                }}
              >
                {slide.cta2.label}
              </Link>
            </div>

            {/* Progress dots + inline nav */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Précédent"
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-all hover:scale-110"
                style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.07)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: i === current ? 28 : 6, background: "rgba(255,255,255,0.25)" }}
                  >
                    {i === current && (
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ background: "#7EEAE4", width: `${progress}%`, transition: "width .05s linear" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={next}
                aria-label="Suivant"
                className="w-8 h-8 rounded-full flex items-center justify-center border transition-all hover:scale-110"
                style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.07)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT — Circular image */}
          <div
            className="hidden sm:flex justify-center items-center"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "scale(0.94) translateX(20px)" : "scale(1) translateX(0)",
              transition: "opacity .45s ease, transform .45s ease",
            }}
          >
            <div className="relative flex items-center justify-center" style={{ width: "500px", height: "500px" }}>

              {/* Outer dashed ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px dashed rgba(49,185,174,0.3)",
                  animation: "spin 30s linear infinite",
                }}
              />

              {/* Glow blob */}
              <div
                className="absolute"
                style={{
                  width: "440px", height: "440px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(49,185,174,0.28) 0%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />

              {/* Circular image */}
              <div
                className="relative overflow-hidden shadow-2xl"
                style={{
                  width: "460px",
                  height: "460px",
                  borderRadius: "50%",
                  border: "5px solid rgba(49,185,174,0.55)",
                  transform: "rotate(2deg)",
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  className="object-cover"
                  sizes="460px"
                  priority={slide.id === 1}
                />
              </div>

              {/* Floating SOBUP badge */}
              <div
                className="absolute flex items-center gap-2 rounded-2xl shadow-xl px-4 py-2.5"
                style={{
                  bottom: "30px", left: "-10px",
                  background: "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Image src="/logo.png" alt="SOBUP" width={32} height={32} className="w-8 h-8" />
                <div>
                  <p className="text-xs font-black leading-none" style={{ color: "#31B9AE" }}>SOBUP</p>
                  <p className="text-[10px] text-gray-400 leading-tight">Société savante</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Wave bottom ── */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,24 C480,48 960,0 1440,24 L1440,48 L0,48 Z" fill="#F5F5F5"/>
      </svg>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
