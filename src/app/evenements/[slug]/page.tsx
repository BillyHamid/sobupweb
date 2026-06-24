"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

/* ─────────────────────────────────────────────────────────────
   CAROUSEL HÉROS — Concept 2 (Diagonal Split)
───────────────────────────────────────────────────────────── */
const heroSlides = [
  { id: 1, image: "/congresobup/congres-6.jpeg" },
  { id: 2, image: "/congresobup/WhatsApp Image 2026-05-20 at 10.30.46.jpeg" },
  { id: 3, image: "/congresobup/WhatsApp Image 2026-05-25 at 13.20.58.jpeg" },
];

const heroText = {
  tag: "Save the date · Décembre 2027",
  title: "Le 9ᵉ Congrès SOBUP approche.",
  subtitle: "Du 16 au 19 décembre — Azalaï Hôtel, Ouagadougou.",
};

const congressHistory = [
  { year: "2011", ordinal: "1ᵉʳ", color: "#2D7DD2", theme: "Poumon et environnement", place: "Salle de conférences Ouaga 2000, Ouagadougou" },
  { year: "2013", ordinal: "2ᵉ", color: "#F03E3E", theme: "Asthme, Allergologie et Antibiothérapie", place: "Palm Beach Hôtel, Ouagadougou" },
  { year: "2015", ordinal: "3ᵉ", color: "#F59F00", theme: "Poumon et environnement", place: "Palm Beach Hôtel, Ouagadougou" },
  { year: "2017", ordinal: "4ᵉ", color: "#E64980", theme: "Pneumologie tropicale et approches thérapeutiques nouvelles", place: "CHU Blaise Compaoré, Ouagadougou" },
  { year: "2019", ordinal: "5ᵉ", color: "#2B2D33", theme: "Innovation en pratique pneumologique au Burkina Faso", place: "Bravia Hôtel, Ouagadougou" },
  { year: "2021", ordinal: "6ᵉ", color: "#228BE6", theme: "Pathologies respiratoires et situation de crise", place: "Hôtel Sissiman, Bobo-Dioulasso" },
  { year: "2023", ordinal: "7ᵉ", color: "#7048E8", theme: "Pathologies respiratoires professionnelles", place: "Bravia Hôtel, Ouagadougou" },
  { year: "2025", ordinal: "8ᵉ", color: "#37B24D", theme: "Pratique de la pneumologie au Burkina Faso à l'ère des technologies nouvelles", place: "Azalaï Hôtel, Ouagadougou" },
];

const AUTOPLAY = 6000;

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 600);
  }, [transitioning, current]);

  const next = useCallback(() => goTo((current + 1) % heroSlides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + heroSlides.length) % heroSlides.length), [current, goTo]);

  useEffect(() => {
    const id = setInterval(() => next(), AUTOPLAY);
    return () => clearInterval(id);
  }, [next]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [next, prev]);

  return (
    <section className="relative overflow-hidden text-white h-[460px] sm:h-[540px] md:h-[620px] lg:h-[700px]" style={{ background: "#0B3D38" }}>
      {/* ── Slideshow image en pleine page (crossfade) ── */}
      <div className="absolute inset-0">
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            <Image
              src={s.image}
              alt={heroText.title}
              fill
              className="object-contain lg:object-cover"
              style={{ objectPosition: "50% 25%" }}
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* ── Voile pour lisibilité (sombre à gauche, fade à droite + bas) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, rgba(11,61,56,.65) 0%, rgba(11,61,56,.35) 30%, rgba(11,61,56,.08) 55%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: "40%", background: "linear-gradient(to top, rgba(0,0,0,.45) 0%, transparent 100%)" }}
      />
      {/* Texture points subtile */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[.05]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      {/* ── Contenu ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 w-full">
          <div className="max-w-2xl mt-16 lg:mt-24">
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-0.5 w-12 rounded-full" style={{ background: "#5BCEC4" }} />
              <span className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-[.22em]" style={{ color: "#5BCEC4" }}>{heroText.tag}</span>
            </div>
            <h1
              className="font-black leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)", textShadow: "0 2px 14px rgba(0,0,0,.85), 0 1px 4px rgba(0,0,0,.7)" }}
            >
              Le 9ᵉ Congrès SOBUP{" "}
              <span style={{ color: "#7EEAE4" }}>approche.</span>
            </h1>
            <div className="mb-8 rounded-full" style={{ height: "4px", width: "60px", background: "var(--accent)" }} />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/espace-membre"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5"
                style={{ background: "var(--accent)", boxShadow: "0 12px 36px rgba(230,126,34,.5)" }}
              >
                S&apos;inscrire au congrès
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/abstracts"
                className="inline-flex items-center px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-white/20"
                style={{ color: "rgba(255,255,255,.95)", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.28)", backdropFilter: "blur(4px)" }}
              >
                Soumettre un abstract
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation slides (bas) ── */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {heroSlides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 36 : 8,
                    background: i === current ? "var(--accent)" : "rgba(255,255,255,.45)",
                  }}
                />
              ))}
            </div>
            <span className="ml-1 font-mono text-xs select-none tabular-nums" style={{ color: "rgba(255,255,255,.65)" }}>
              {String(current + 1).padStart(2, "0")} <span className="opacity-50">/</span> {String(heroSlides.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex gap-2">
            {[prev, next].map((fn, i) => (
              <button
                key={i}
                onClick={fn}
                aria-label={i === 0 ? "Précédent" : "Suivant"}
                className="flex items-center justify-center rounded-full transition-all hover:scale-110 hover:bg-white/25"
                style={{
                  width: 42,
                  height: 42,
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.3)",
                  color: "white",
                  backdropFilter: "blur(6px)",
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={i === 0 ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Wave bas */}
      <svg className="absolute bottom-0 left-0 w-full pointer-events-none z-10" viewBox="0 0 1440 52" preserveAspectRatio="none">
        <path d="M0,26 C360,52 720,0 1080,26 C1260,39 1380,20 1440,26 L1440,52 L0,52 Z" fill="#F5F5F5" />
      </svg>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────────────────────── */
export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const isCongres = slug === "9eme-congres";

  if (!isCongres) {
    return (
      <section className="py-20 text-center">
        <p className="text-gray-500">Événement non trouvé.</p>
        <Link href="/evenements" className="mt-4 inline-block font-bold" style={{ color: "var(--primary)" }}>← Retour aux événements</Link>
      </section>
    );
  }

  return (
    <>
      {/* ── HÉROS CAROUSEL ───────────────────────────────────── */}
      <HeroCarousel />

      {/* ── BANDE INFO RAPIDE (défilante) ─────────────────────── */}
      <div className="overflow-hidden" style={{ background: "var(--primary)" }}>
        <div className="flex w-max py-4" style={{ animation: "marquee-infos 18s linear infinite" }}>
          {[0, 1, 2, 3].map((dup) => (
            <div key={dup} className="flex items-center shrink-0" aria-hidden={dup !== 0}>
              {[
                { icon: "📅", text: "16 au 19 Décembre 2027" },
                { icon: "📍", text: "Sopatel Silmande Hôtel, Ouagadougou" },
                { icon: "🌐", text: "Présentiel" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-10 text-white text-sm font-semibold whitespace-nowrap">
                  <span>{item.icon}</span>
                  <span style={{ color: "rgba(255,255,255,.9)" }}>{item.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <style>{`@keyframes marquee-infos { from { transform: translateX(0); } to { transform: translateX(-25%); } }`}</style>
      </div>

      {/* ── HISTORIQUE — FRISE DES CONGRÈS ─────────────────────── */}
      <section className="py-20 banniere-sobup">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="text-center mb-10">
            <p className="text-lg md:text-xl font-black uppercase tracking-widest mb-3 text-white">Notre parcours</p>
            <h2 className="text-base md:text-lg font-bold text-white/90">Historique des congrès</h2>
            <p className="mt-3 text-sm text-white/80 max-w-2xl mx-auto">
              Huit congrès internationaux de pneumologie, de 2011 à 2025 — thèmes et lieux des rencontres scientifiques.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-14 lg:p-16 overflow-x-auto">
            <div className="flex items-stretch w-full min-w-[1100px]">
              {congressHistory.map((c, i) => {
                const above = i % 2 === 1;
                const label = (
                  <div className="px-4">
                    <p className="font-black text-base md:text-lg" style={{ color: c.color }}>{c.ordinal} Congrès</p>
                    <p className="text-sm text-gray-600 leading-snug mt-1.5">{c.theme} – {c.place}.</p>
                  </div>
                );
                return (
                  <div
                    key={c.year}
                    className="flex flex-1 min-w-[9rem] flex-col"
                    style={{ marginLeft: i === 0 ? 0 : -20 }}
                  >
                    <div className="flex h-44 items-end pb-4">{above ? label : null}</div>
                    <div
                      className="flex h-16 items-center justify-center font-black text-white text-2xl md:text-3xl tracking-wide"
                      style={{
                        background: c.color,
                        clipPath:
                          i === 0
                            ? "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)"
                            : "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                      }}
                    >
                      {c.year}
                    </div>
                    <div className="flex h-44 items-start pt-4">{!above ? label : null}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVRETS DE RÉSUMÉS PAR CONGRÈS ────────────────────── */}
      <section className="py-20" style={{ background: "#F5F5F5" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <p className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Archives scientifiques</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 section-title">Livrets de résumés des congrès</h2>
            <p className="mt-3 text-sm text-gray-500 max-w-2xl mx-auto">
              Consultez les recueils de communications de chaque édition — cliquez sur une carte pour ouvrir le livret.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {congressHistory.slice(0, 7).map((c, i) => {
              const num = i + 1;
              const folders = ["1er_congres", "2econgres", "3econgres", "4econgres", "5econgres", "6econgres", "7econgres"];
              const livretsDisponibles = [1, 2, 3, 4, 5, 6, 7];
              const available = livretsDisponibles.includes(num);
              const href = `/${folders[i]}/livret-resumes.pdf`;

              const cardInner = (
                <>
                  {/* Halo de couleur */}
                  <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                    style={{ background: c.color, filter: "blur(30px)" }}
                  />
                  {/* Ruban supérieur */}
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: c.color }} />

                  {/* Contenu */}
                  <div className="relative p-6 flex flex-col h-full">
                    {/* En-tête : ordinal + année */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Édition</p>
                        <p className="font-black text-3xl md:text-4xl" style={{ color: c.color }}>{c.ordinal}</p>
                      </div>
                      <span
                        className="text-xs font-black px-3 py-1.5 rounded-full text-white shadow-sm"
                        style={{ background: c.color }}
                      >
                        {c.year}
                      </span>
                    </div>

                    {/* Thème */}
                    <p className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-3">{c.theme}</p>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-5">{c.place}</p>

                    {/* Pied : action */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      {available ? (
                        <>
                          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: c.color }}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                            </svg>
                            Livret PDF
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-xs font-black text-white px-3 py-1.5 rounded-lg transition-transform group-hover:translate-x-0.5"
                            style={{ background: c.color }}
                          >
                            Ouvrir
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7"/></svg>
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Bientôt disponible
                        </span>
                      )}
                    </div>
                  </div>
                </>
              );

              const baseCls =
                "livret-card group relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl";

              return available ? (
                <a
                  key={c.year}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseCls + " cursor-pointer block"}
                  style={{ animationDelay: `${i * 90}ms` }}
                  aria-label={`Ouvrir le livret du ${c.ordinal} Congrès (${c.year})`}
                >
                  {cardInner}
                </a>
              ) : (
                <div
                  key={c.year}
                  className={baseCls + " opacity-80"}
                  style={{ animationDelay: `${i * 90}ms` }}
                  aria-label={`${c.ordinal} Congrès — livret bientôt disponible`}
                >
                  {cardInner}
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes livret-up {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .livret-card { animation: livret-up .7s ease both; }
        `}</style>
      </section>

    </>
  );
}
