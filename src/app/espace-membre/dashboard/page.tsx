"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, Calendar, Users, GraduationCap, FileText,
  ArrowUpRight, Sparkles, Award,
} from "lucide-react";
import { useSessionUser, getSessionUser, type SessionUser } from "@/lib/userSession";

const buildStats = (nbGtt: number) => [
  { label: "GTT actifs", value: String(nbGtt), trend: nbGtt > 0 ? "Membre actif" : "Aucun pour le moment", icon: Users, color: "#31B9AE", bg: "#E8F9F7" },
  { label: "Formations", value: "2", trend: "1 en cours", icon: GraduationCap, color: "#e67e22", bg: "#fff7ed" },
  { label: "Publications", value: "4", trend: "Dernière : avr.", icon: FileText, color: "#7c3aed", bg: "#f5f3ff" },
  { label: "Attestations", value: "7", trend: "À télécharger", icon: Award, color: "#0ea5e9", bg: "#f0f9ff" },
];

const evenements = [
  { date: "19", mois: "Nov", year: "2026", titre: "1ère Journée Scientifique Régionale", lieu: "Koudougou", type: "Journée", color: "#31B9AE" },
  { date: "12", mois: "Juil", year: "2026", titre: "Vendredi de la SOBUP — Asthme sévère", lieu: "En ligne", type: "Webinaire", color: "#e67e22" },
  { date: "16", mois: "Déc", year: "2027", titre: "9ème Congrès de la SOBUP", lieu: "Ouagadougou", type: "Congrès", color: "#7c3aed" },
];

const activites = [
  { type: "publication", titre: "Nouveau numéro de la Newsletter SOBUP", desc: "Le bulletin N°1 d'Avril 2026 est disponible", time: "Il y a 2h", icon: Sparkles, color: "#7c3aed" },
  { type: "gtt", titre: "GT Tuberculose — Nouvelle réunion programmée", desc: "Le 15 mai 2026 à 18h00 (en visio)", time: "Il y a 1j", icon: Users, color: "#31B9AE" },
  { type: "formation", titre: "Formation Échographie thoracique ouverte", desc: "Inscriptions ouvertes — Places limitées", time: "Il y a 3j", icon: GraduationCap, color: "#e67e22" },
  { type: "attestation", titre: "Nouvelle attestation DPC disponible", desc: "8ème Congrès SOBUP — Téléchargez votre certificat", time: "Il y a 5j", icon: Award, color: "#0ea5e9" },
];

export default function DashboardHomePage() {
  const reactiveUser = useSessionUser();
  const pathname = usePathname();
  const [latest, setLatest] = useState<SessionUser | null>(null);

  useEffect(() => {
    setLatest(getSessionUser());
  }, [pathname]);

  const user = (latest?.gttMemberships?.length ?? 0) > (reactiveUser?.gttMemberships?.length ?? 0)
    ? latest
    : reactiveUser;

  // Extraire le nom court ("Dr KUNAKEY") depuis "Dr Edem KUNAKEY"
  const shortName = user?.name
    ? (() => {
        const parts = user.name.split(" ");
        if (parts.length >= 3) return `${parts[0]} ${parts[parts.length - 1]}`;
        return user.name;
      })()
    : "membre SOBUP";

  const nbGtt = user?.gttMemberships?.length ?? 0;

  return (
    <div className="space-y-6 lg:space-y-8">

      {/* ══════════════ HERO BIENVENUE ══════════════ */}
      <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-7 lg:p-10"
        style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 60%, #31B9AE 130%)" }}>
        {/* Décors */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7EEAE4, transparent)" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #ffffff, transparent)" }} />

        <div className="relative grid lg:grid-cols-3 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white px-3 py-1 rounded-full mb-3"
              style={{ background: "rgba(126,234,228,0.18)", border: "1px solid rgba(126,234,228,0.3)" }}>
              <Sparkles className="w-3 h-3" /> Espace collaboratif
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2 leading-tight">
              Bonjour {shortName} 👋
            </h1>
            <p className="text-white/70 text-xs sm:text-sm lg:text-base max-w-xl leading-relaxed">
              Bienvenue dans votre espace collaboratif SOBUP. Suivez vos activités scientifiques,
              vos groupes de travail et vos formations en un seul endroit.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-5">
              <Link href="/espace-membre/dashboard/gtt"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-white text-xs transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "#e67e22" }}>
                Accéder à mes GTT →
              </Link>
              <Link href="/espace-membre/dashboard/formations"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-black text-xs border-2 transition-all hover:-translate-y-0.5"
                style={{ color: "#7EEAE4", borderColor: "rgba(126,234,228,0.4)", background: "rgba(49,185,174,0.1)" }}>
                Voir mes formations
              </Link>
            </div>
          </div>

          {/* Carte cotisation */}
          <div className="relative rounded-2xl p-4 sm:p-5 backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#7EEAE4" }}>
              Statut membre
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
              <p className="font-black text-white text-sm">Membre actif · À jour</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Cotisation 2026</span>
                <span className="font-bold text-white">30 000 F</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Membre depuis</span>
                <span className="font-bold text-white">{user?.joinedAt ?? "—"}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Renouvellement</span>
                <span className="font-bold text-white">31 déc. 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS RAPIDES ══════════════ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {buildStats(nbGtt).map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: s.color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-xl sm:text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5 leading-tight">{s.label}</p>
              <p className="text-[10px] font-bold mt-2" style={{ color: s.color }}>
                {s.trend}
              </p>
            </div>
          );
        })}
      </section>

      {/* ══════════════ GRILLE PRINCIPALE ══════════════ */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Activité récente */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="font-black text-gray-900 text-sm sm:text-base truncate">Activité récente</h2>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">Vos dernières interactions sur la SOBUP</p>
            </div>
            <button className="text-xs font-bold flex items-center gap-1 shrink-0" style={{ color: "#31B9AE" }}>
              <span className="hidden sm:inline">Tout voir</span><ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="p-2">
            {activites.map((act, i) => {
              const Icon = act.icon;
              return (
                <div key={i} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${act.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: act.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">{act.titre}</p>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">{act.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium shrink-0 whitespace-nowrap">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prochains événements */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="font-black text-gray-900 text-sm sm:text-base">Agenda</h2>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">Vos prochains événements</p>
            </div>
            <Calendar className="w-4 h-4 text-gray-300 shrink-0" />
          </div>
          <div className="p-3 sm:p-4 space-y-3">
            {evenements.map((ev, i) => (
              <Link key={i} href="/evenements"
                className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all group">
                <div className="rounded-xl px-2.5 py-2 text-center shrink-0 w-14"
                  style={{ background: `${ev.color}15` }}>
                  <p className="text-[9px] font-bold uppercase" style={{ color: ev.color }}>{ev.mois}</p>
                  <p className="text-lg font-black leading-none" style={{ color: ev.color }}>{ev.date}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{ev.year}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: ev.color }}>{ev.type}</span>
                  <p className="font-bold text-gray-900 text-xs leading-snug mt-0.5 group-hover:text-primary transition-colors line-clamp-2">{ev.titre}</p>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    📍 {ev.lieu}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ RACCOURCIS ══════════════ */}
      <section>
        <h2 className="font-black text-gray-900 mb-4 text-sm sm:text-base">Accès rapides</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Soumettre un abstract", desc: "Pour le 9ème Congrès", icon: "📝", href: "/abstracts", color: "#31B9AE" },
            { label: "Annuaire SOBUP", desc: "119 membres", icon: "📇", href: "/annuaire", color: "#e67e22" },
            { label: "Médiathèque", desc: "Photos & vidéos", icon: "🎬", href: "/mediatheque", color: "#7c3aed" },
            { label: "Vendredis SOBUP", desc: "Cas cliniques", icon: "🫁", href: "/evenements", color: "#0ea5e9" },
          ].map((s) => (
            <Link key={s.label} href={s.href}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{s.icon}</div>
              <p className="font-black text-gray-900 text-xs sm:text-sm leading-tight">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
              <div className="flex items-center gap-1 text-xs font-bold mt-3" style={{ color: s.color }}>
                Accéder <ArrowUpRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
