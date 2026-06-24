"use client";

import { useState, useEffect } from "react";
import {
  Video, Image as ImageIcon, FileText, Download, Eye,
  Calendar, ArrowUpRight, Sparkles, Film, X,
} from "lucide-react";

/* ─────────────────────────────────────────────
   SYSTÈME DE COULEURS PAR CATÉGORIE
───────────────────────────────────────────── */
const ACCENT = {
  rose: {
    text: "text-rose-500",
    hex: "#f43f5e",
    hexLight: "#fff1f2",
  },
  blue: {
    text: "text-blue-500",
    hex: "#3b82f6",
    hexLight: "#eff6ff",
  },
  gold: {
    text: "text-amber-500",
    hex: "#f59e0b",
    hexLight: "#fffbeb",
  },
};

/* ─────────────────────────────────────────────
   DONNÉES MÉDIA
───────────────────────────────────────────── */
const MEDIA_LIBRARY = {
  videos: {
    label: "Vidéos",
    count: "9 vidéos",
    icon: Video,
    accent: "rose" as const,
    headline: "L'univers SOBUP en mouvement.",
    items: [
      {
        title: "Vidéo récapitulative du lancement de l'École de l'asthme de Ouagadougou",
        gtt: "GT Asthme & Allergie",
        src: "/docs/gtt/asthme-allergie/lancement-ecole-asthme-ouagadougou.mp4",
        featured: true,
      },
      {
        title: "Chambre d'inhalation — Capsule pédagogique (français)",
        gtt: "École de l'Asthme",
        src: "/mediatheque/chambre-inhalation-francais.mp4",
        featured: false,
      },
      {
        title: "Chambre d'inhalation — Capsule pédagogique (mooré)",
        gtt: "École de l'Asthme",
        src: "/mediatheque/chambre-inhalation-moore.mp4",
        featured: false,
      },
      {
        title: "Chambre d'inhalation — Capsule pédagogique (dioula)",
        gtt: "École de l'Asthme",
        src: "/mediatheque/chambre-inhalation-dioula.mp4",
        featured: false,
      },
      {
        title: "Utilisation du Diskus — Capsule de sensibilisation (français)",
        gtt: "École de l'Asthme",
        src: "/mediatheque/diskus-francais.mp4",
        featured: false,
      },
      {
        title: "Utilisation du Diskus — Capsule de sensibilisation (mooré)",
        gtt: "École de l'Asthme",
        src: "/mediatheque/diskus-moore.mp4",
        featured: false,
      },
      {
        title: "Aérosol doseur — Capsule de sensibilisation (français)",
        gtt: "École de l'Asthme",
        src: "/mediatheque/aerosol-doseur-francais.mp4",
        featured: false,
      },
      {
        title: "Aérosol doseur — Capsule de sensibilisation (mooré)",
        gtt: "École de l'Asthme",
        src: "/mediatheque/aerosol-doseur-moore.mp4",
        featured: false,
      },
      {
        title: "Lancement de l'École de l'Asthme — Ouagadougou",
        gtt: "GT Asthme & Allergie",
        src: "/mediatheque/lancement-ecole-asthme.mp4",
        featured: false,
      },
    ],
  },
  photos: {
    label: "Photos",
    count: "31 photos",
    icon: ImageIcon,
    accent: "blue" as const,
    headline: "Nos moments forts en images.",
    items: [
      // Activités SOBUP — 2026
      { src: "/mediatheque/congres-1.jpg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/congres-3.jpg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/congres-4.jpg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/congres-5.jpeg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/congres-6.jpg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/congres-7.jpeg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/congres-8.jpg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/ev-journee-regionale.jpg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/ff.jpeg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/photo-1.jpeg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/photo-2.jpeg", ordinal: "Activités SOBUP", year: "2026" },
      { src: "/mediatheque/photo-3.jpeg", ordinal: "Activités SOBUP", year: "2026" },
      // 1er Congrès — 2011
      { src: "/1er_congres/photo-1.jpeg", ordinal: "1ᵉʳ Congrès", year: "2011" },
      { src: "/1er_congres/photo-2.jpeg", ordinal: "1ᵉʳ Congrès", year: "2011" },
      { src: "/1er_congres/photo-3.jpeg", ordinal: "1ᵉʳ Congrès", year: "2011" },
      { src: "/1er_congres/photo-4.jpeg", ordinal: "1ᵉʳ Congrès", year: "2011" },
      { src: "/1er_congres/photo-5.jpeg", ordinal: "1ᵉʳ Congrès", year: "2011" },
      { src: "/1er_congres/photo-6.jpeg", ordinal: "1ᵉʳ Congrès", year: "2011" },
      { src: "/1er_congres/photo-7.jpeg", ordinal: "1ᵉʳ Congrès", year: "2011" },
      // 3e Congrès — 2015
      { src: "/3econgres/photo-1.jpg", ordinal: "3ᵉ Congrès", year: "2015" },
      // 4e Congrès — 2017
      { src: "/4econgres/photo-1.jpg", ordinal: "4ᵉ Congrès", year: "2017" },
      // 5e Congrès — 2019
      { src: "/5econgres/photo-1.jpeg", ordinal: "5ᵉ Congrès", year: "2019" },
      { src: "/5econgres/photo-2.jpeg", ordinal: "5ᵉ Congrès", year: "2019" },
      // 6e Congrès — 2021
      { src: "/6econgres/photo-1.jpeg", ordinal: "6ᵉ Congrès", year: "2021" },
      { src: "/6econgres/photo-2.jpeg", ordinal: "6ᵉ Congrès", year: "2021" },
      { src: "/6econgres/photo-3.jpeg", ordinal: "6ᵉ Congrès", year: "2021" },
      // 7e Congrès — 2023
      { src: "/7econgres/photo-1.jpeg", ordinal: "7ᵉ Congrès", year: "2023" },
      { src: "/7econgres/photo-2.jpeg", ordinal: "7ᵉ Congrès", year: "2023" },
      { src: "/7econgres/photo-3.jpeg", ordinal: "7ᵉ Congrès", year: "2023" },
      { src: "/7econgres/photo-4.jpeg", ordinal: "7ᵉ Congrès", year: "2023" },
      { src: "/7econgres/photo-5.jpeg", ordinal: "7ᵉ Congrès", year: "2023" },
    ],
  },
  documents: {
    label: "Documents",
    count: "6 fichiers",
    icon: FileText,
    accent: "gold" as const,
    headline: "Tous nos documents officiels.",
    items: [
      {
        title: "Bulletin d'information SOBUP N°1",
        desc: "Premier numéro de la newsletter trimestrielle officielle de la SOBUP — Avril 2026.",
        type: "PDF",
        size: "6,7 Mo",
        gtt: "SOBUP",
        date: "Avril 2026",
        file: "/newsletter-n1-avril-2026.pdf",
        featured: true,
      },
      {
        title: "Guide technique de lutte contre la tuberculose (10ème édition, 2025)",
        desc: "Référentiel national de prise en charge de la tuberculose, élaboré par le GT Tuberculose et le PNT.",
        type: "PDF",
        size: "5,4 Mo",
        gtt: "GT Tuberculose",
        date: "2025",
        file: "/docs/gtt/tuberculose/guide-technique-tb-2025.pdf",
        featured: false,
      },
      {
        title: "Guide de prise en charge de la Tuberculose Pharmacorésistante (TB-MR/RR, 2026)",
        desc: "Recommandations pour la prise en charge des tuberculoses multi-résistantes et résistantes à la rifampicine.",
        type: "PDF",
        size: "3,3 Mo",
        gtt: "GT Tuberculose",
        date: "2026",
        file: "/docs/gtt/tuberculose/guide-tb-resistante-2026.pdf",
        featured: false,
      },
      {
        title: "Guide de prise en charge de la tuberculose chez l'enfant (2025)",
        desc: "Recommandations pédiatriques nationales — diagnostic, traitement et suivi de la TB de l'enfant.",
        type: "PDF",
        size: "2,6 Mo",
        gtt: "GT Tuberculose",
        date: "2025",
        file: "/docs/gtt/tuberculose/guide-tb-enfant-2025.pdf",
        featured: false,
      },
      {
        title: "Guide TB/VIH (6ème édition, 2024)",
        desc: "Prise en charge intégrée de la co-infection tuberculose / VIH au Burkina Faso.",
        type: "PDF",
        size: "2,2 Mo",
        gtt: "GT Tuberculose",
        date: "2024",
        file: "/docs/gtt/tuberculose/guide-tb-vih-2024.pdf",
        featured: false,
      },
      {
        title: "Plan Stratégique National de lutte contre la tuberculose (PSN-TB 2024-2026)",
        desc: "Document de référence de la politique nationale de lutte contre la tuberculose pour la période 2024-2026.",
        type: "PDF",
        size: "3,7 Mo",
        gtt: "GT Tuberculose",
        date: "2024",
        file: "/docs/gtt/tuberculose/psn-tb-2024-2026.pdf",
        featured: false,
      },
    ],
  },
};

type TabKey = keyof typeof MEDIA_LIBRARY;

/* ─────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────── */
export default function MediathequePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("videos");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [photoYear, setPhotoYear] = useState<string>("Toutes");
  const category = MEDIA_LIBRARY[activeTab];
  const ac = ACCENT[category.accent];

  // Années disponibles + photos filtrées
  const photoYears = Array.from(new Set(MEDIA_LIBRARY.photos.items.map((p) => p.year))).sort();
  const filteredPhotos =
    photoYear === "Toutes"
      ? MEDIA_LIBRARY.photos.items
      : MEDIA_LIBRARY.photos.items.filter((p) => p.year === photoYear);

  // Groupement par congrès dans l'ordre d'apparition
  const photoGroups = filteredPhotos.reduce<{ ordinal: string; year: string; photos: { src: string; originalIndex: number }[] }[]>(
    (acc, p) => {
      const originalIndex = MEDIA_LIBRARY.photos.items.indexOf(p);
      const last = acc[acc.length - 1];
      if (last && last.ordinal === p.ordinal && last.year === p.year) {
        last.photos.push({ src: p.src, originalIndex });
      } else {
        acc.push({ ordinal: p.ordinal, year: p.year, photos: [{ src: p.src, originalIndex }] });
      }
      return acc;
    },
    []
  );

  // Fermer la lightbox avec Échap + navigation flèches
  useEffect(() => {
    if (lightbox === null) return;
    const total = MEDIA_LIBRARY.photos.items.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      else if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % total));
      else if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : (i - 1 + total) % total));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section
      className="relative min-h-screen py-16 sm:py-20 lg:py-28"
      style={{ background: "#f8fafc" }}
    >
      {/* ── Décors radiaux flous ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #31B9AE, transparent)" }} />
        <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #e67e22, transparent)" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ══════════════ HEADER ══════════════ */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.18em] mb-5"
            style={{ background: "#E8F9F7", color: "#31B9AE" }}>
            <Film className="w-3.5 h-3.5" />
            Médiathèque
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-4">
            Plongez au cœur de l&apos;univers{" "}
            <span className="mediatheque-shimmer" style={{
              backgroundImage: "linear-gradient(110deg, #31B9AE 0%, #065E52 30%, #f43f5e 50%, #3b82f6 70%, #31B9AE 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              SOBUP
            </span>{" "}
            en{" "}
            <span className="mediatheque-rotator">
              <span className="mediatheque-word" style={{ color: ACCENT.rose.hex }}>vidéos</span>
              <span className="mediatheque-word" style={{ color: ACCENT.blue.hex }}>photos</span>
              <span className="mediatheque-word" style={{ color: ACCENT.gold.hex }}>documents</span>
            </span>
            .
          </h1>
          <style>{`
            @keyframes mediatheque-shimmer {
              0%   { background-position: 0% 50%; }
              100% { background-position: 300% 50%; }
            }
            .mediatheque-shimmer {
              animation: mediatheque-shimmer 6s linear infinite;
            }
            .mediatheque-rotator {
              position: relative;
              display: inline-grid;
              vertical-align: bottom;
              overflow: hidden;
            }
            .mediatheque-rotator .mediatheque-word {
              grid-row: 1;
              grid-column: 1;
              white-space: nowrap;
              opacity: 0;
              transform: translateY(110%);
              animation: mediatheque-rotate 7.5s infinite;
              font-weight: 900;
              background-clip: text;
            }
            .mediatheque-rotator .mediatheque-word:nth-child(1) { animation-delay: 0s; }
            .mediatheque-rotator .mediatheque-word:nth-child(2) { animation-delay: 2.5s; }
            .mediatheque-rotator .mediatheque-word:nth-child(3) { animation-delay: 5s; }
            @keyframes mediatheque-rotate {
              0%   { opacity: 0; transform: translateY(110%); }
              5%   { opacity: 1; transform: translateY(0); }
              30%  { opacity: 1; transform: translateY(0); }
              35%  { opacity: 0; transform: translateY(-110%); }
              100% { opacity: 0; transform: translateY(-110%); }
            }
          `}</style>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Vidéos institutionnelles, reportages photos et documents officiels —
            toutes les ressources pour mieux connaître la Société Burkinabè de Pneumologie.
          </p>
        </div>

        {/* ══════════════ ONGLETS ══════════════ */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
            {(Object.keys(MEDIA_LIBRARY) as TabKey[]).map((key) => {
              const tab = MEDIA_LIBRARY[key];
              const tabAc = ACCENT[tab.accent];
              const isActive = activeTab === key;
              const Icon = tab.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`relative flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border-2 transition-all duration-200 ${
                    isActive ? "shadow-lg" : "border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5"
                  }`}
                  style={isActive ? { borderColor: tabAc.hex, background: tabAc.hexLight } : {}}
                >
                  {/* Barre supérieure active */}
                  {isActive && (
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                      style={{ background: tabAc.hex }} />
                  )}
                  {/* Icône cercle */}
                  <span className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ background: tabAc.hex }}>
                    <Icon className="w-5 h-5" />
                  </span>
                  {/* Label + count */}
                  <span>
                    <p className="text-sm font-black" style={isActive ? { color: tabAc.hex } : { color: "#374151" }}>
                      {tab.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{tab.count}</p>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════════ EN-TÊTE CATÉGORIE ══════════════ */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mb-1"
              style={{ color: ac.hex }}>
              {(() => { const Icon = category.icon; return <Icon className="w-3.5 h-3.5" />; })()}
              {category.label}
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              {category.headline}
            </h2>
          </div>
          <button
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all hover:-translate-y-0.5"
            style={{ borderColor: ac.hex, color: ac.hex }}>
            Tout voir <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* ══════════════ CONTENU PAR ONGLET ══════════════ */}

        {/* ── VIDÉOS ── */}
        {activeTab === "videos" && (
          <div className="animate-fade-in" key="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MEDIA_LIBRARY.videos.items.map((v, i) => (
                <div key={i}
                  className="relative rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 bg-black md:col-span-2 lg:col-span-1">
                  <div className="aspect-video w-full relative">
                    <video
                      src={`${v.src}#t=0.5`}
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {v.featured && (
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-white px-2.5 py-1 rounded-full"
                          style={{ background: ACCENT.rose.hex }}>
                          <Sparkles className="w-3 h-3" /> À LA UNE
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 bg-gray-900">
                    {"gtt" in v && v.gtt && (
                      <p className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: ACCENT.rose.hex }}>
                        {v.gtt}
                      </p>
                    )}
                    <h3 className="text-white text-base md:text-lg font-extrabold leading-snug">{v.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {MEDIA_LIBRARY.videos.items.length < 4 && (
              <p className="text-center text-sm text-gray-500 mt-8 italic">
                D&apos;autres vidéos seront ajoutées dès que les GTT déposeront leurs supports.
              </p>
            )}
          </div>
        )}

        {/* ── PHOTOS ── */}
        {activeTab === "photos" && (
          <div className="animate-fade-in" key="photos">
            {/* Filtre par année */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 mr-2">Année</span>
              {["Toutes", ...photoYears].map((y) => {
                const active = photoYear === y;
                return (
                  <button
                    key={y}
                    onClick={() => setPhotoYear(y)}
                    className="px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all hover:-translate-y-0.5"
                    style={active
                      ? { background: ACCENT.blue.hex, color: "white", borderColor: ACCENT.blue.hex }
                      : { color: "#64748b", borderColor: "#e2e8f0", background: "white" }}
                  >
                    {y}
                  </button>
                );
              })}
              <span className="ml-auto text-xs font-bold text-gray-400">
                {filteredPhotos.length} photo{filteredPhotos.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Albums par congrès */}
            <div className="space-y-10">
              {photoGroups.map((g) => (
                <section key={`${g.ordinal}-${g.year}`}>
                  <div className="flex items-baseline gap-3 mb-4 pb-2 border-b-2" style={{ borderColor: ACCENT.blue.hexLight }}>
                    <h3 className="font-black text-xl text-gray-900">{g.ordinal}</h3>
                    <span className="text-sm font-bold px-3 py-0.5 rounded-full"
                      style={{ background: ACCENT.blue.hexLight, color: ACCENT.blue.hex }}>
                      {g.year}
                    </span>
                    <span className="text-xs font-bold text-gray-400 ml-auto">
                      {g.photos.length} photo{g.photos.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {g.photos.map((p) => (
                      <button
                        key={p.originalIndex}
                        onClick={() => setLightbox(p.originalIndex)}
                        className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        style={{ aspectRatio: "4/5" }}
                        aria-label={`Agrandir — ${g.ordinal} ${g.year}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.src}
                          alt={`${g.ordinal} ${g.year}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                          style={{ background: "rgba(59,130,246,0.45)" }}>
                          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-white shadow-xl"
                            style={{ background: ACCENT.blue.hex }}>
                            <Eye className="w-4 h-4" /> Agrandir
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}

              {photoGroups.length === 0 && (
                <p className="text-center text-gray-500 italic py-16">
                  Aucune photo pour cette année.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── LIGHTBOX PHOTOS ── */}
        {lightbox !== null && (
          <div
            role="dialog"
            aria-modal="true"
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-sm animate-fade-in"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const total = MEDIA_LIBRARY.photos.items.length;
                setLightbox((lightbox - 1 + total) % total);
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-2xl font-black"
              aria-label="Précédente"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const total = MEDIA_LIBRARY.photos.items.length;
                setLightbox((lightbox + 1) % total);
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-2xl font-black"
              aria-label="Suivante"
            >
              ›
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MEDIA_LIBRARY.photos.items[lightbox].src}
              alt={`Photo ${lightbox + 1}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
            />
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs font-semibold">
              {lightbox + 1} / {MEDIA_LIBRARY.photos.items.length}
            </p>
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {activeTab === "documents" && (
          <div className="animate-fade-in grid sm:grid-cols-2 lg:grid-cols-3 gap-5" key="documents">
            {MEDIA_LIBRARY.documents.items.map((d, i) => (
              <div key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    {/* Icône fichier avec coin plié */}
                    <div className="relative w-14 h-16">
                      <div className="w-14 h-16 rounded-xl flex items-end justify-center pb-2"
                        style={{ background: `linear-gradient(135deg, ${ACCENT.gold.hex} 0%, #d97706 100%)` }}>
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute top-0 right-0 w-0 h-0"
                        style={{ borderStyle: "solid", borderWidth: "0 14px 14px 0", borderColor: "transparent white transparent transparent" }} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {d.featured && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full"
                          style={{ background: ACCENT.gold.hex }}>
                          <Sparkles className="w-2.5 h-2.5" /> Vedette
                        </span>
                      )}
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                        style={{ background: ACCENT.gold.hexLight, color: ACCENT.gold.hex }}>
                        {d.type} · {d.size}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-black text-gray-900 text-sm leading-snug mb-2">{d.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{d.desc}</p>
                </div>
                {/* Métadonnées */}
                <div className="px-6 pb-4 flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {d.gtt}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {d.date}</span>
                </div>
                {/* Actions */}
                <div className="mt-auto px-6 pb-6 flex gap-2">
                  <a href={d.file} download
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: ACCENT.gold.hex }}>
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </a>
                  <a href={d.file} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black border-2 transition-all hover:-translate-y-0.5"
                    style={{ borderColor: ACCENT.gold.hex, color: ACCENT.gold.hex }}>
                    <Eye className="w-3.5 h-3.5" /> Aperçu
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeInUp 600ms ease both; }
      `}</style>
    </section>
  );
}
