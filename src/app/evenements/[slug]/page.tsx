"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

/* ─────────────────────────────────────────────────────────────
   CAROUSEL HÉROS — Concept 2 (Diagonal Split)
───────────────────────────────────────────────────────────── */
const heroSlides = [
  {
    id: 1,
    tag: "Congrès",
    title: "Pneumologie en Afrique : défis et innovations",
    subtitle: "",
    image: "/congresobup/congres-3.jpg",
  },
  {
    id: 2,
    tag: "Programme scientifique",
    title: "3 jours d'échanges, de formation et de recherche",
    subtitle: "Symposiums, ateliers pratiques, communications orales et remise des prix.",
    image: "/congresobup/dd.jpeg",
  },
  {
    id: 3,
    tag: "Moments forts du congrès",
    title: "Une communauté pneumologique unie et engagée",
    subtitle: "Rencontres, partages et collaborations au service de la santé respiratoire.",
    image: "/congresobup/WhatsApp Image 2026-05-25 at 13.20.53.jpeg",
  },
];

const AUTOPLAY = 6000;

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const goTo = useCallback((index: number, d: 1 | -1 = 1) => {
    if (transitioning || index === current) return;
    setDir(d);
    setTransitioning(true);
    setProgress(0);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 520);
  }, [transitioning, current]);

  const next = useCallback(() => goTo((current + 1) % heroSlides.length, 1), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + heroSlides.length) % heroSlides.length, -1), [current, goTo]);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / AUTOPLAY) * 100, 100);
      setProgress(pct);
      if (pct >= 100) next();
    }, 50);
    return () => clearInterval(id);
  }, [current, next]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [next, prev]);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden" style={{ height: "clamp(520px, 78vh, 700px)", background: "#004D40" }}>

      {/* ── Zone image droite ── */}
      <div
        className="absolute top-0 bottom-0 right-0 flex items-center justify-center overflow-hidden"
        style={{ width: "60%", background: "#002E28" }}
      >
        <div
          className="relative w-full h-full"
          style={{
            opacity: transitioning ? 0.3 : 1,
            transition: "opacity .52s ease",
          }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            style={{ objectFit: "contain", objectPosition: "center center" }}
            sizes="60vw"
            priority={slide.id === 1}
          />
        </div>
        {/* Fondu gauche pour fusionner avec le panneau teal */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, #004D40 0%, rgba(0,46,40,0.5) 20%, transparent 45%)" }} />
        {/* Fondu bas */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,46,40,0.6) 0%, transparent 30%)" }} />
      </div>

      {/* ── Panneau diagonal gauche ── */}
      <div className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(150deg, #004D40 0%, #065E52 55%, #0a7265 100%)",
          clipPath: "polygon(0 0, 62% 0, 46% 100%, 0 100%)",
        }}>
        <div className="absolute inset-0 opacity-[.07]"
          style={{ backgroundImage: "radial-gradient(circle, #31B9AE 1.2px, transparent 1.2px)", backgroundSize: "26px 26px" }} />
        <div className="absolute inset-y-0 opacity-20" style={{ right: "-1px", width: "2px", background: "linear-gradient(to bottom, transparent, #31B9AE 40%, #5BCEC4 60%, transparent)" }} />
      </div>

      {/* ── Contenu ── */}
      <div className="relative z-20 h-full flex items-center">
        <div className="px-8 sm:px-14 lg:px-20 xl:px-28"
          style={{
            maxWidth: "min(640px, 55vw)",
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? `translateX(${dir === 1 ? "-28px" : "28px"})` : "translateX(0)",
            transition: "opacity .52s ease, transform .52s ease",
          }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="block h-px w-8 rounded-full" style={{ background: "#5BCEC4" }} />
            <span className="text-[11px] font-black uppercase tracking-[.22em]" style={{ color: "#5BCEC4" }}>{slide.tag}</span>
          </div>
          <h1 className="font-black text-white leading-[1.06] mb-4" style={{ fontSize: "clamp(1.8rem, 3.2vw, 3.2rem)" }}>
            {slide.title}
          </h1>
          <div className="mb-5 rounded-full" style={{ height: "3px", width: "52px", background: "var(--accent)" }} />
          {slide.subtitle && (
            <p className="leading-relaxed mb-8" style={{ color: "rgba(255,255,255,.72)", fontSize: "clamp(.88rem, 1.2vw, 1rem)" }}>
              {slide.subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/espace-membre"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5"
              style={{ background: "var(--accent)", boxShadow: "0 10px 32px rgba(230,126,34,.38)" }}>
              S&apos;inscrire au congrès
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/abstracts"
              className="inline-flex items-center px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/20"
              style={{ color: "rgba(255,255,255,.88)", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)" }}>
              Soumettre un abstract
            </Link>
          </div>
          {/* Dots + compteur + flèches */}
          <div className="flex items-center gap-2">
            {heroSlides.map((s, i) => (
              <button key={s.id} onClick={() => goTo(i, i > current ? 1 : -1)} aria-label={`Slide ${i + 1}`}
                className="relative overflow-hidden rounded-full transition-all duration-300"
                style={{ height: "3px", width: i === current ? "28px" : "8px", background: "rgba(255,255,255,.2)" }}>
                {i === current && <span className="absolute inset-y-0 left-0 rounded-full" style={{ background: "var(--accent)", width: `${progress}%`, transition: "width .05s linear" }} />}
                {i < current && <span className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,.45)" }} />}
              </button>
            ))}
            <span className="ml-2 font-mono text-xs select-none" style={{ color: "rgba(255,255,255,.3)" }}>
              {String(current + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5 ml-auto">
              {[prev, next].map((fn, i) => (
                <button key={i} onClick={fn} aria-label={i === 0 ? "Précédent" : "Suivant"}
                  className="flex items-center justify-center rounded-full transition-all hover:scale-110"
                  style={{ width: 34, height: 34, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", color: "white" }}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={i === 0 ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 1440 52" preserveAspectRatio="none" style={{ marginBottom: "3px" }}>
        <path d="M0,26 C360,52 720,0 1080,26 C1260,39 1380,20 1440,26 L1440,52 L0,52 Z" fill="#F5F5F5" />
      </svg>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────────────────────── */
const program = [
  { day: "Jour 1 — 15 Mai", sessions: ["08h00 — Accueil et enregistrement", "09h00 — Cérémonie d'ouverture officielle", "10h00 — Conférence inaugurale : État de la pneumologie en Afrique", "14h00 — Symposium : Tuberculose résistante au Burkina Faso", "16h30 — Communications orales — Séance 1", "18h00 — Cocktail de bienvenue"] },
  { day: "Jour 2 — 16 Mai", sessions: ["08h30 — Ateliers pratiques simultanés (spirométrie, endoscopie, imagerie)", "11h00 — Session plénière : Cancer du poumon en Afrique", "14h00 — Symposium : Asthme sévère et nouvelles thérapies", "16h00 — Présentation des posters", "17h30 — Assemblée Générale de la SOBUP"] },
  { day: "Jour 3 — 17 Mai", sessions: ["09h00 — Communications orales — Séance 2", "11h00 — Symposium : BPCO et réhabilitation respiratoire", "14h00 — Remise des prix scientifiques", "15h30 — Cérémonie de sortie — 7ème Promotion", "16h30 — Clôture et perspectives 2027"] },
];

const retraites = [
  {
    nom: "Pr. Dramane Konaté",
    titre: "Professeur de Pneumologie — CHU Yalgado Ouédraogo",
    annees: "1988 – 2026",
    photo: "/retraite/retraite1.jpeg",
    pos: "50% 26%",
    texte: "38 années de service au chevet des patients et à la formation de générations de pneumologues. Votre rigueur et votre engagement resteront un modèle pour tous.",
  },
  {
    nom: "Dr. Mariam Sawadogo",
    titre: "Pneumologue — Centre Hospitalier Régional de Bobo-Dioulasso",
    annees: "1992 – 2026",
    photo: "/retraite/retraite2.jpeg",
    pos: "50% 15%",
    texte: "Pionnière de la pneumologie pédiatrique au Burkina Faso, vous avez consacré votre carrière aux enfants les plus vulnérables. Nous vous souhaitons une retraite méritée.",
  },
];

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
                { icon: "📍", text: "Azalaï Hôtel, Ouagadougou" },
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

      {/* ── CONTENU PRINCIPAL ────────────────────────────────── */}
      <div className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-14">

          <div className="space-y-16">

            {/* ── 7ÈME PROMOTION ────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-1 w-10 rounded-full" style={{ background: "var(--primary)" }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--primary)" }}>Cérémonie officielle</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 section-title">
                Sortie de la 7ème Promotion de Pneumologues du Burkina Faso
              </h2>

              <div className="rounded-3xl overflow-hidden shadow-lg">
                <Image src="/congres-5.jpeg" alt="Cérémonie 7ème promotion SOBUP" width={1200} height={800} className="w-full h-auto" style={{ display: "block" }} />
              </div>
            </section>

            {/* ── HOMMAGES — RETRAITES ─────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-1 w-10 rounded-full" style={{ background: "var(--accent)" }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--accent)" }}>Reconnaissance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 section-title">
                Hommages aux membres partant à la retraite
              </h2>
              <p className="text-gray-500 text-sm mb-8">La SOBUP honore celles et ceux qui ont consacré leur carrière à la pneumologie burkinabè.</p>

              <div className="grid sm:grid-cols-2 gap-6">
                {retraites.map((p) => (
                  <div key={p.nom} className="group rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    {/* Bande accent haut */}
                    <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, var(--accent), var(--warning))" }} />
                    {/* Portrait — corps entier */}
                    <div className="relative h-[440px] overflow-hidden" style={{ background: "radial-gradient(130% 85% at 50% 22%, #0a7265 0%, #0B3D38 72%)" }}>
                      {/* motif points */}
                      <div className="absolute inset-0 pointer-events-none opacity-[.07]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
                      {/* halo sol */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 rounded-[50%] blur-md" style={{ background: "rgba(0,0,0,.35)" }} />
                      <Image
                        src={p.photo}
                        alt={p.nom}
                        fill
                        className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 460px"
                      />
                      {/* Badge expert */}
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-md backdrop-blur-sm" style={{ background: "rgba(255,255,255,.92)", color: "var(--accent)" }}>
                        <span>🎖️</span> Expert honoré
                      </div>
                      {/* Années de service */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-md" style={{ background: "var(--accent)" }}>
                        {p.annees}
                      </div>
                    </div>
                    {/* Identité + hommage */}
                    <div className="p-6">
                      <h3 className="text-lg font-black text-gray-900 leading-tight">{p.nom}</h3>
                      <p className="text-sm mt-0.5 font-semibold" style={{ color: "var(--primary)" }}>{p.titre}</p>
                      <p className="mt-4 text-sm text-gray-600 leading-relaxed italic border-l-2 pl-4" style={{ borderColor: "var(--accent-light)" }}>
                        &ldquo;{p.texte}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── IN MEMORIAM ───────────────────────────────── */}
            <section>
              <div className="rounded-3xl overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1a2a26 0%, #0a3830 100%)" }}>
                {/* Bande décorative */}
                <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--primary), var(--primary-mid))" }} />

                <div className="p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-8 rounded-full" style={{ background: "rgba(49,185,174,.5)" }} />
                    <span className="text-xs font-black uppercase tracking-[.2em]" style={{ color: "var(--primary-mid)" }}>In Memoriam</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-8 items-start">
                    {/* Portrait — bannière d'hommage */}
                    <div className="shrink-0 mx-auto sm:mx-0">
                      <div className="relative w-48 sm:w-56">
                        <div className="absolute -inset-2 rounded-2xl opacity-30 blur-xl" style={{ background: "var(--primary)" }} />
                        <div className="relative rounded-2xl overflow-hidden border-2 shadow-xl" style={{ borderColor: "rgba(49,185,174,.4)", aspectRatio: "3 / 4" }}>
                          <Image
                            src="/RIP.jpeg"
                            alt="Hommage au Professeur Georges OUEDRAOGO"
                            fill
                            className="object-cover"
                            style={{ objectPosition: "47% 33%" }}
                            sizes="(max-width: 640px) 70vw, 224px"
                          />
                        </div>
                        {/* Bougie */}
                        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-base shadow-lg" style={{ background: "#0a3830", border: "1px solid rgba(49,185,174,.4)" }}>
                          🕯️
                        </div>
                      </div>
                    </div>

                    {/* Texte */}
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Pr. Georges OUEDRAOGO</h3>
                      <p className="text-sm mb-1" style={{ color: "var(--primary-mid)" }}>
                        Pneumologue — Enseignant-Chercheur
                      </p>
                      <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,.35)" }}>03 juin 1960 – 11 février 2025</p>

                      <div className="h-px w-full mb-5 opacity-10" style={{ background: "var(--primary)" }} />

                      <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,.65)" }}>
                        La SOBUP rend hommage au Professeur Georges OUEDRAOGO, pionnier de la pneumologie au Burkina Faso. Enseignant-chercheur et formateur d&apos;exception, il a consacré sa carrière à faire grandir la spécialité et à transmettre son savoir à des générations de praticiens.
                      </p>

                      <div className="mt-6 rounded-xl px-4 py-3 inline-block" style={{ background: "rgba(49,185,174,.1)", border: "1px solid rgba(49,185,174,.2)" }}>
                        <p className="text-sm italic" style={{ color: "rgba(255,255,255,.7)" }}>
                          &ldquo; Un pionnier de la pneumologie au Burkina Faso, un formateur d&apos;exception, un chercheur engagé, un homme d&apos;une humanité rare. &rdquo;
                        </p>
                        <p className="text-xs mt-1 font-semibold" style={{ color: "var(--primary-mid)" }}>— Hommage de la SOBUP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── PROGRAMME ─────────────────────────────────── */}
            <section>
              <div className="flex items-center gap-3 mb-2">
                <span className="h-1 w-10 rounded-full" style={{ background: "var(--primary)" }} />
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--primary)" }}>Agenda</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 section-title">Programme scientifique</h2>
              <div className="space-y-5">
                {program.map((day) => (
                  <div key={day.day} className="rounded-2xl border border-gray-100 overflow-hidden card-shadow">
                    <div className="px-5 py-3 font-bold text-white text-sm" style={{ background: "var(--primary)" }}>{day.day}</div>
                    <ul className="px-5 py-4 space-y-2.5">
                      {day.sessions.map((s, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "var(--secondary)" }} />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

          </div>


        </div>
      </div>
    </>
  );
}
