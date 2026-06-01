"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface TitleLine { text: string; accent: boolean; }
interface Cta { label: string; href: string; }
interface Slide {
  id: number;
  titleLines: TitleLine[];
  subtitle: string;
  cta1: Cta;
  cta2?: Cta;
  image: string;
  imageAlt: string;
}

const slides: Slide[] = [
  {
    id: 1,
    titleLines: [
      { text: "La référence nationale", accent: false },
      { text: "en santé respiratoire", accent: true },
    ] as TitleLine[],
    subtitle: "La SOBUP, une société savante au service des professionnels et du public",
    cta1: { label: "Découvrir la SOBUP", href: "/a-propos" },
    cta2: { label: "Annuaire des pneumologues", href: "/annuaire" },
    image: "/baniercongres/congres-1-v2.jpeg",
    imageAlt: "9ème congrès SOBUP - Photo 1",
  },
  {
    id: 2,
    titleLines: [
      { text: "Au cœur de", accent: false },
      { text: "l'expertise scientifique", accent: true },
    ] as TitleLine[],
    subtitle: "11 groupes de travail – De la tuberculose à l'environnement, en passant par l'asthme, la BPCO, le sommeil, l'oncologie…",
    cta1: { label: "Découvrir les GTT", href: "/gtt" },
    image: "/baniercongres/congres-2-v2.jpg",
    imageAlt: "9ème congrès SOBUP - Photo 2",
  },
  {
    id: 3,
    titleLines: [
      { text: "Ne manquez aucun", accent: false },
      { text: "rendez-vous scientifique", accent: true },
    ] as TitleLine[],
    subtitle: "Congrès, Journée Scientifique Régionale, Webinaire…",
    cta1: { label: "Voir l'agenda", href: "/evenements" },
    image: "/baniercongres/congres-3-v3.jpeg",
    imageAlt: "9ème congrès SOBUP - Photo 3",
  },
  {
    id: 4,
    titleLines: [
      { text: "Formez-vous", accent: false },
      { text: "avec la SOBUP", accent: true },
    ] as TitleLine[],
    subtitle: "Ateliers pratiques, webinaires, EPU, FMC — Replay et attestations disponibles…",
    cta1: { label: "Voir les formations", href: "/formations" },
    image: "/baniercongres/congres-4-v3.JPG",
    imageAlt: "9ème congrès SOBUP - Photo 4",
  },
  {
    id: 5,
    titleLines: [
      { text: "Votre bibliothèque", accent: false },
      { text: "pneumologique", accent: true },
    ] as TitleLine[],
    subtitle: "Newsletter SOBUP, articles scientifiques, recommandations, protocoles nationaux, guides pratiques, médiathèque — Téléchargement gratuit",
    cta1: { label: "Accéder aux publications", href: "/publications" },
    image: "/ban1.jpg",
    imageAlt: "Publications et ressources de la SOBUP",
  },
  {
    id: 6,
    titleLines: [
      { text: "Ensemble, faisons reculer", accent: false },
      { text: "les maladies respiratoires", accent: true },
    ] as TitleLine[],
    subtitle: "Campagnes de dépistage, émissions radio, plaidoyer auprès des décideurs",
    cta1: { label: "Accéder aux publications", href: "/publications" },
    image: "/baniercongres/congres-6-v2.jpeg",
    imageAlt: "Communauté SOBUP réunie",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 450);
  }, [transitioning, current]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const id = setInterval(() => next(), 5000);
    return () => clearInterval(id);
  }, [next]);

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
                  style={{ color: line.accent ? "#7EEAE4" : "#FFFFFF" }}
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
            <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,0.78)" }}>
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
              {slide.cta2 && (
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
              )}
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
                        style={{ background: "#7EEAE4", width: "100%" }}
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
            className="flex justify-center items-center order-first sm:order-none"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? "scale(0.94) translateX(20px)" : "scale(1) translateX(0)",
              transition: "opacity .45s ease, transform .45s ease",
            }}
          >
            <div
              className="relative flex items-center justify-center"
              style={{ width: "min(460px, 80vw)", aspectRatio: "1 / 1" }}
            >

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
                className="absolute rounded-full"
                style={{
                  width: "96%", height: "96%",
                  background: "radial-gradient(circle, rgba(49,185,174,0.28) 0%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />

              {/* Circular image */}
              <div
                className="relative overflow-hidden shadow-2xl rounded-full"
                style={{
                  width: "92%",
                  height: "92%",
                  border: "5px solid rgba(49,185,174,0.55)",
                  transform: "rotate(2deg)",
                  background: "#0B3D38",
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  className="object-cover"
                  style={{ transform: "scale(0.88)" }}
                  sizes="(max-width: 640px) 80vw, 460px"
                  priority={slide.id === 1}
                />
              </div>

              {/* Floating SOBUP badge */}
              <div
                className="absolute flex items-center gap-2 rounded-2xl shadow-xl px-4 py-2.5"
                style={{
                  bottom: "6%", left: "-10px",
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
