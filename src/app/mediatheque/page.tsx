"use client";

import { useState } from "react";
import {
  Video, Image as ImageIcon, FileText, Play, Download, Eye,
  Calendar, Clock, ArrowUpRight, Sparkles, Film,
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
    count: "4 vidéos",
    icon: Video,
    accent: "rose" as const,
    headline: "L'univers SOBUP en mouvement.",
    items: [
      {
        title: "9ème Congrès SOBUP — Temps forts & discours officiels",
        desc: "Retour en images sur les moments clés du 9ème Congrès de la Société Burkinabè de Pneumologie à Ouagadougou.",
        thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80&fit=crop",
        duration: "18:42",
        date: "Décembre 2025",
        featured: true,
      },
      {
        title: "Journée Mondiale du Sommeil — Table ronde SOBUP 2026",
        desc: "150 participants, 13 spécialités médicales réunies autour du syndrome d'apnée du sommeil.",
        thumb: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80&fit=crop",
        duration: "12:05",
        date: "Mars 2026",
        featured: false,
      },
      {
        title: "Interview — Pr Martial OUÉDRAOGO, Président fondateur",
        desc: "Retour sur 19 ans de pneumologie burkinabè et la vision pour l'avenir de la SOBUP.",
        thumb: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80&fit=crop",
        duration: "08:30",
        date: "Février 2026",
        featured: false,
      },
      {
        title: "Formation Échographie Thoracique — Atelier pratique",
        desc: "Séquences de formation en petits groupes supervisés lors de la première session SOBUP.",
        thumb: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80&fit=crop",
        duration: "06:15",
        date: "Janvier 2026",
        featured: false,
      },
    ],
  },
  photos: {
    label: "Photos",
    count: "4 albums",
    icon: ImageIcon,
    accent: "blue" as const,
    headline: "Nos moments forts en images.",
    items: [
      {
        title: "9ème Congrès SOBUP",
        desc: "Cérémonies, conférences, ateliers et moments de networking du congrès.",
        thumb: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80&fit=crop",
        count: "28 photos",
        date: "Décembre 2025",
        featured: true,
      },
      {
        title: "Assemblée Générale Élective 2026",
        desc: "La passation de témoin et l'élection du nouveau bureau de la SOBUP.",
        thumb: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&fit=crop",
        count: "14 photos",
        date: "Février 2026",
        featured: false,
      },
      {
        title: "Journée Mondiale du Sommeil",
        desc: "Table ronde pluridisciplinaire au BRAVIA Hôtel, Ouagadougou.",
        thumb: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80&fit=crop",
        count: "21 photos",
        date: "Mars 2026",
        featured: false,
      },
      {
        title: "Hommage — Pr Bernard KOFFI N'GORAN",
        desc: "Cérémonie d'hommage à Abidjan — délégation SOBUP présente.",
        thumb: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80&fit=crop",
        count: "16 photos",
        date: "Mars 2026",
        featured: false,
      },
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
        pages: "17 pages",
        date: "Avril 2026",
        featured: true,
      },
      {
        title: "Statuts & Règlement intérieur — SOBUP 2026",
        desc: "Textes révisés lors de l'Assemblée Générale Élective du 17 février 2026.",
        type: "PDF",
        size: "1,2 Mo",
        pages: "22 pages",
        date: "Février 2026",
        featured: false,
      },
      {
        title: "Programme scientifique — 9ème Congrès SOBUP",
        desc: "Programme complet, résumés des communications et biographies des intervenants.",
        type: "PDF",
        size: "3,8 Mo",
        pages: "64 pages",
        date: "Décembre 2025",
        featured: false,
      },
      {
        title: "Rapport d'activités SOBUP 2023–2025",
        desc: "Bilan du mandat sortant : formations, congrès, publications et partenariats.",
        type: "PDF",
        size: "2,1 Mo",
        pages: "38 pages",
        date: "Février 2026",
        featured: false,
      },
      {
        title: "Guide national — Prise en charge de la tuberculose",
        desc: "Recommandations nationales élaborées par le GT Tuberculose de la SOBUP.",
        type: "PDF",
        size: "4,2 Mo",
        pages: "48 pages",
        date: "2025",
        featured: false,
      },
      {
        title: "Formulaire d'adhésion SOBUP",
        desc: "Rejoindre la Société Burkinabè de Pneumologie — cotisation annuelle 30 000 F.",
        type: "PDF",
        size: "0,3 Mo",
        pages: "2 pages",
        date: "2026",
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
  const category = MEDIA_LIBRARY[activeTab];
  const ac = ACCENT[category.accent];

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
            Explorez l&apos;univers{" "}
            <span style={{
              backgroundImage: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              SOBUP
            </span>{" "}
            en images.
          </h1>
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
            <div className="grid lg:grid-cols-12 gap-5">

              {/* Grande vidéo à la une */}
              {MEDIA_LIBRARY.videos.items.filter((v) => v.featured).map((v, i) => (
                <div key={i}
                  className="lg:col-span-7 relative rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="aspect-video w-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.thumb} alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
                    {/* Badge + durée */}
                    <div className="absolute top-4 left-4">
                      <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-white px-2.5 py-1 rounded-full"
                        style={{ background: ACCENT.rose.hex }}>
                        <Sparkles className="w-3 h-3" /> À LA UNE
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <Clock className="w-3 h-3" /> {v.duration}
                    </div>
                    {/* Bouton play */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 ml-1" style={{ fill: ACCENT.rose.hex, color: ACCENT.rose.hex }} />
                      </div>
                    </div>
                    {/* Infos bas */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-extrabold leading-tight mb-1">{v.title}</h3>
                      <p className="text-white/70 text-sm mb-2 line-clamp-2">{v.desc}</p>
                      <p className="text-white/50 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {v.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Vidéos secondaires */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {MEDIA_LIBRARY.videos.items.filter((v) => !v.featured).map((v, i) => (
                  <div key={i}
                    className="flex gap-3 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all group cursor-pointer">
                    <div className="relative w-36 shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={v.thumb} alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 ml-0.5" style={{ fill: ACCENT.rose.hex, color: ACCENT.rose.hex }} />
                        </div>
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 text-[10px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                        {v.duration}
                      </div>
                    </div>
                    <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <h4 className="text-sm font-black text-gray-900 leading-snug line-clamp-2 mb-1 group-hover:text-rose-500 transition-colors">{v.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{v.desc}</p>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                        <Calendar className="w-3 h-3" /> {v.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PHOTOS ── */}
        {activeTab === "photos" && (
          <div className="animate-fade-in grid grid-cols-2 lg:grid-cols-4 gap-4" key="photos">
            {MEDIA_LIBRARY.photos.items.map((p, i) => (
              <div key={i}
                className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                style={{ aspectRatio: "4/5", animationDelay: `${i * 60}ms` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.thumb} alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {/* Gradient bas permanent */}
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)" }} />
                {/* Overlay bleu au survol */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(59,130,246,0.35)" }} />
                {/* Badge featured */}
                {p.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full"
                      style={{ background: ACCENT.blue.hex }}>
                      <Sparkles className="w-2.5 h-2.5" /> À LA UNE
                    </span>
                  </div>
                )}
                {/* Compteur */}
                <div className="absolute top-3 right-3 text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                  {p.count}
                </div>
                {/* Bouton voir album hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-white shadow-xl"
                    style={{ background: ACCENT.blue.hex }}>
                    <Eye className="w-4 h-4" /> Voir l&apos;album
                  </button>
                </div>
                {/* Infos bas */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-black text-sm leading-tight">{p.title}</p>
                  <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {p.date}
                  </p>
                </div>
              </div>
            ))}
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
                <div className="px-6 pb-4 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {d.pages}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {d.date}</span>
                </div>
                {/* Actions */}
                <div className="mt-auto px-6 pb-6 flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{ background: ACCENT.gold.hex }}>
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black border-2 transition-all hover:-translate-y-0.5"
                    style={{ borderColor: ACCENT.gold.hex, color: ACCENT.gold.hex }}>
                    <Eye className="w-3.5 h-3.5" /> Aperçu
                  </button>
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
