"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, ArrowUpRight, Activity, Trash2, MessageSquare } from "lucide-react";
import { removeGTTMembership, getSessionUser, useSessionUser, type SessionUser } from "@/lib/userSession";

// Catalogue de tous les GTT disponibles, pour proposer "Découvrir d'autres GTT"
const gttCatalog: { name: string; href: string; color: string; coordinateur: string; desc: string; membres: number }[] = [
  { name: "GT Tuberculose", href: "/gtt/tuberculose", color: "#dc2626", coordinateur: "Pr Kadiatou BONCOUNGOU", desc: "Tuberculose pulmonaire, TB-MDR et lutte antituberculeuse au Burkina Faso.", membres: 24 },
  { name: "GT Asthme & Allergie", href: "/gtt/asthme-allergie", color: "#31B9AE", coordinateur: "Dr Sandrine DAMOUE", desc: "Asthme sévère, allergies respiratoires, recommandations nationales.", membres: 22 },
  { name: "GT Oncologie thoracique", href: "/gtt/oncologie-thoracique", color: "#e67e22", coordinateur: "Dr Ghislain BOUGMA", desc: "Cancers bronchopulmonaires, mésothéliome, RCP nationale.", membres: 19 },
  { name: "GT Tabac & BPCO", href: "/gtt/tabac-bpco", color: "#0ea5e9", coordinateur: "Dr Aly COULIBALY", desc: "Sevrage tabagique, BPCO, formation à la spirométrie.", membres: 18 },
  { name: "GT Pneumo-pédiatrie", href: "/gtt/pneumo-pediatrie", color: "#0ea5e9", coordinateur: "Dr Éléonore SIAMBO", desc: "Pneumonies de l'enfant, asthme pédiatrique, mucoviscidose.", membres: 16 },
  { name: "GT Sommeil & VNI", href: "/gtt/sommeil-vni", color: "#7c3aed", coordinateur: "Dr Arnaud TIENDREBEOGO", desc: "Syndrome d'apnée du sommeil, VNI.", membres: 31 },
  { name: "GT Imagerie thoracique", href: "/gtt/imagerie-thoracique", color: "#7c3aed", coordinateur: "Dr Adama SOURABIE", desc: "Radiographie, scanner, échographie thoracique.", membres: 14 },
  { name: "GT Endoscopie bronchique", href: "/gtt/endoscopie-bronchique", color: "#dc2626", coordinateur: "Dr Aly COULIBALY", desc: "Bronchoscopie, EBUS, biopsies guidées.", membres: 9 },
  { name: "GT EFR", href: "/gtt/efr", color: "#22c55e", coordinateur: "Dr Arnaud TIENDREBEOGO", desc: "Explorations fonctionnelles respiratoires.", membres: 12 },
  { name: "GT Infections non TB", href: "/gtt/infections-non-tb", color: "#f59e0b", coordinateur: "Dr Tanguy NIKIEMA", desc: "Pneumonies communautaires, nosocomiales, mycoses.", membres: 13 },
  { name: "GT Environnement & Travail", href: "/gtt/environnement-travail", color: "#0891b2", coordinateur: "Dr Aly COULIBALY", desc: "Silicose, pneumoconioses, pollution.", membres: 11 },
];

const findGTTInfo = (name: string) =>
  gttCatalog.find((g) => g.name.toLowerCase() === name.toLowerCase());

export default function MesGTTPage() {
  const reactiveUser = useSessionUser();
  const pathname = usePathname();
  // Filet de sécurité : on garde aussi un user lu à chaque entrée sur la page
  const [latestUser, setLatestUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setLatestUser(getSessionUser());
  }, [pathname]);

  // On prend le plus à jour des deux (par nombre de GTT)
  const user = (() => {
    const a = reactiveUser;
    const b = latestUser;
    if (!a) return b;
    if (!b) return a;
    return (b.gttMemberships?.length ?? 0) > (a.gttMemberships?.length ?? 0) ? b : a;
  })();

  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  if (!user) return null;

  const userMemberships = user.gttMemberships ?? [];
  const userGTTNames = userMemberships.map((m) => m.name.toLowerCase());
  const disponibles = gttCatalog.filter((g) => !userGTTNames.includes(g.name.toLowerCase())).slice(0, 4);

  const handleRemove = (gttName: string) => {
    removeGTTMembership(gttName);
    setConfirmRemove(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* En-tête */}
      <div className="flex items-start justify-between flex-wrap gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">Mes Groupes de Travail</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Suivez les actualités, échangez avec vos pairs et accédez aux ressources des GTT.</p>
        </div>
        <Link href="/gtt"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white hover:-translate-y-0.5 transition-all shrink-0"
          style={{ background: "#31B9AE" }}>
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Explorer tous les GTT</span>
          <span className="sm:hidden">Explorer</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { value: String(userMemberships.length), label: "GTT actifs", labelShort: "GTT", icon: Users, color: "#31B9AE" },
          { value: String(userMemberships.length * 4), label: "Discussions", labelShort: "Discus.", icon: MessageSquare, color: "#e67e22" },
          { value: String(userMemberships.length * 7), label: "Documents", labelShort: "Docs", icon: FileText, color: "#7c3aed" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}15` }}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: s.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-black text-gray-900">{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.labelShort}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mes GTT */}
      {userMemberships.length > 0 ? (
        <section>
          <h2 className="font-black text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Mes GTT ({userMemberships.length})</h2>
          <div className="space-y-3 sm:space-y-4">
            {userMemberships.map((m) => {
              const info = findGTTInfo(m.name);
              const color = info?.color ?? m.color ?? "#31B9AE";
              const joinedDate = new Date(m.joinedAt).toLocaleDateString("fr-FR", {
                day: "numeric", month: "long", year: "numeric",
              });

              return (
                <div key={m.name} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="grid lg:grid-cols-4 gap-0">
                    <div className="lg:col-span-2 p-4 sm:p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `${color}15` }}>
                          <Users className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-black text-gray-900 text-sm sm:text-base">{m.name}</h3>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full"
                              style={{ background: `${color}15`, color }}>
                              ✓ Actif
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{info?.desc ?? ""}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1 mt-3">
                        {info?.coordinateur && (
                          <p className="line-clamp-1">👨‍⚕️ Coordinateur : <strong className="text-gray-700">{info.coordinateur}</strong></p>
                        )}
                        <p>📅 Adhéré le <strong className="text-gray-700">{joinedDate}</strong></p>
                        {m.fonction && (
                          <p className="line-clamp-1">🏥 Profil : <strong className="text-gray-700">{m.fonction}{m.lieuExercice ? ` · ${m.lieuExercice}` : ""}</strong></p>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-2 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-gray-100" style={{ background: "#fafbfc" }}>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {[
                          { label: "Membres", value: info?.membres ?? "—", icon: Users },
                          { label: "Discussions", value: 4, icon: MessageSquare },
                          { label: "Documents", value: 7, icon: FileText },
                        ].map((s) => {
                          const Icon = s.icon;
                          return (
                            <div key={s.label} className="text-center p-2 rounded-xl bg-white border border-gray-100">
                              <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />
                              <p className="text-base sm:text-lg font-black text-gray-900">{s.value}</p>
                              <p className="text-[9px] sm:text-[10px] text-gray-400">{s.label}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => setConfirmRemove(m.name)}
                          className="text-xs font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3 h-3" /> Quitter
                        </button>
                        {info?.href && (
                          <Link href={info.href}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:-translate-y-0.5 transition-all"
                            style={{ background: color }}>
                            Accéder <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        // État vide
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 p-6 sm:p-10 lg:p-14 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#E8F9F7" }}>
            <Users className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: "#31B9AE" }} />
          </div>
          <h3 className="font-black text-gray-900 text-base sm:text-lg mb-2">Vous n&apos;avez rejoint aucun GTT</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed">
            Les Groupes de Travail Thématiques (GTT) sont au cœur de la vie scientifique de la SOBUP.
            Choisissez les groupes qui correspondent à vos centres d&apos;intérêt et commencez à collaborer.
          </p>
          <Link href="/gtt"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black text-white hover:-translate-y-0.5 transition-all hover:shadow-lg"
            style={{ background: "#31B9AE" }}>
            <Activity className="w-4 h-4" /> Explorer les 11 GTT de la SOBUP
          </Link>
        </div>
      )}

      {/* GTT à découvrir (suggestions) */}
      {disponibles.length > 0 && (
        <section>
          <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-black text-gray-900 text-sm sm:text-base">
                {userMemberships.length > 0 ? "Découvrir d'autres GTT" : "GTT recommandés"}
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Cliquez sur un groupe pour consulter sa page et rejoindre
              </p>
            </div>
            <Link href="/gtt" className="text-xs font-bold flex items-center gap-1 shrink-0" style={{ color: "#31B9AE" }}>
              <span className="hidden sm:inline">Voir tous</span><ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {disponibles.map((gtt) => (
              <Link key={gtt.name} href={gtt.href}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all block">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
                  style={{ background: `${gtt.color}15` }}>
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: gtt.color }} />
                </div>
                <p className="font-black text-gray-900 text-xs sm:text-sm leading-snug mb-1">{gtt.name}</p>
                <p className="text-[11px] sm:text-xs text-gray-400 mb-2 sm:mb-3">{gtt.membres} membres</p>
                <div className="text-xs font-bold flex items-center gap-1" style={{ color: gtt.color }}>
                  Découvrir <ArrowUpRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Modale confirmation quitter ── */}
      {confirmRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmRemove(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "#fef2f2" }}>
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Quitter ce GTT ?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Vous êtes sur le point de quitter <strong>{confirmRemove}</strong>. Vous perdrez l&apos;accès aux discussions et documents de ce groupe.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmRemove(null)}
                  className="flex-1 px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                  Annuler
                </button>
                <button onClick={() => handleRemove(confirmRemove)}
                  className="flex-1 px-5 py-2.5 rounded-xl font-bold text-white text-sm bg-red-600 hover:bg-red-700 transition-colors">
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
