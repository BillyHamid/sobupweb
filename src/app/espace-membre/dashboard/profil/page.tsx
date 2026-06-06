"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Camera, Mail, MapPin, Calendar, Briefcase, GraduationCap, Edit3 } from "lucide-react";
import { useSessionUser, getSessionUser, type SessionUser } from "@/lib/userSession";

export default function ProfilPage() {
  const [tab, setTab] = useState<"info" | "professionnel" | "securite">("info");
  const reactiveUser = useSessionUser();
  const pathname = usePathname();
  const [latest, setLatest] = useState<SessionUser | null>(null);

  useEffect(() => {
    setLatest(getSessionUser());
  }, [pathname]);

  const user = (latest?.gttMemberships?.length ?? 0) > (reactiveUser?.gttMemberships?.length ?? 0)
    ? latest
    : reactiveUser;

  const Field = ({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) => (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </label>
      <div className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 font-medium">
        {value}
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl">

      {/* En-tête profil */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden">
        {/* Bannière */}
        <div className="h-24 sm:h-32 relative" style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 70%, #31B9AE 130%)" }}>
          <div className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-8 flex items-end gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-black text-2xl sm:text-3xl border-4 border-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #31B9AE, #7EEAE4)" }}>
                {user.avatar}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-14 sm:pt-16 pb-5 sm:pb-6 px-4 sm:px-8 flex items-start justify-between flex-wrap gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">{user.name}</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{user.role}</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
              <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full" style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                ✓ Cotisation à jour
              </span>
              {user.isBureau && (
                <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full" style={{ background: "#fff7ed", color: "#e67e22" }}>
                  Bureau Exécutif
                </span>
              )}
              <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                Membre depuis {user.joinedAt}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white hover:-translate-y-0.5 transition-all shrink-0"
            style={{ background: "#31B9AE" }}>
            <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Modifier mon profil</span>
            <span className="sm:hidden">Modifier</span>
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {[
            { key: "info", label: "Informations", labelLong: "Informations personnelles" },
            { key: "professionnel", label: "Professionnel", labelLong: "Profil professionnel" },
            { key: "securite", label: "Sécurité", labelLong: "Sécurité du compte" },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as "info" | "professionnel" | "securite")}
              className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold transition-colors border-b-2 whitespace-nowrap shrink-0 ${
                tab === t.key ? "" : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              style={tab === t.key ? { borderColor: "#31B9AE", color: "#31B9AE" } : {}}>
              <span className="sm:hidden">{t.label}</span>
              <span className="hidden sm:inline">{t.labelLong}</span>
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {tab === "info" && (
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Nom complet" value={user.name} />
              <Field label="Email professionnel" value={user.email} icon={Mail} />
              <Field label="Ville" value={user.ville ?? "—"} icon={MapPin} />
              <Field label="Pays" value="Burkina Faso" icon={MapPin} />
              <Field label="Membre depuis" value={user.joinedAt} icon={Calendar} />
              <Field label="Statut SOBUP" value={user.isBureau ? "Bureau Exécutif · Membre actif" : "Membre actif"} icon={Briefcase} />
            </div>
          )}

          {tab === "professionnel" && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Spécialité" value={user.specialite ?? "—"} icon={Briefcase} />
                <Field label="Fonction SOBUP" value={user.role} icon={Briefcase} />
                <Field label="Établissement" value={user.etablissement ?? "—"} icon={MapPin} />
                <Field label="Diplôme" value="DES Pneumologie" icon={GraduationCap} />
              </div>
              {user.gttMemberships && user.gttMemberships.length > 0 ? (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Groupes de travail</label>
                  <div className="flex flex-wrap gap-2">
                    {user.gttMemberships.map((g) => (
                      <span key={g.name} className="text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{ background: "#E8F9F7", color: "#31B9AE" }}>{g.name}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Groupes de travail</label>
                  <p className="text-xs text-gray-400 italic">
                    Vous n&apos;avez rejoint aucun GTT. <a href="/gtt" className="font-bold hover:underline" style={{ color: "#31B9AE" }}>Explorer les GTT →</a>
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "securite" && (
            <div className="max-w-md space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" />
              </div>
              <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all"
                style={{ background: "#31B9AE" }}>
                Mettre à jour le mot de passe
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
