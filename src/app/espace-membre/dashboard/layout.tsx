"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, User, Users, GraduationCap,
  CreditCard, Bell, Search, LogOut, ChevronRight, Sparkles,
  Home,
} from "lucide-react";
import { useSessionUser, clearSessionUser } from "@/lib/userSession";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSessionUser();
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) router.replace("/espace-membre");
  }, [mounted, user, router]);

  const nbGtt = user?.gttMemberships?.length ?? 0;
  const navigation = [
    { label: "Tableau de bord", href: "/espace-membre/dashboard", icon: LayoutDashboard, badge: undefined as string | undefined },
    { label: "Mon profil", href: "/espace-membre/dashboard/profil", icon: User, badge: undefined as string | undefined },
    { label: "Mes GTT", href: "/espace-membre/dashboard/gtt", icon: Users, badge: nbGtt > 0 ? String(nbGtt) : undefined },
    { label: "Mes formations", href: "/espace-membre/dashboard/formations", icon: GraduationCap, badge: undefined as string | undefined },
    { label: "Ma cotisation", href: "/espace-membre/dashboard/cotisation", icon: CreditCard, badge: undefined as string | undefined },
  ];

  const handleLogout = () => {
    clearSessionUser();
    router.push("/espace-membre");
  };

  if (!mounted) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "#f8fafc" }}>

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "linear-gradient(180deg, #0B3D38 0%, #065E52 100%)" }}
      >
        <div className="h-full flex flex-col">

          {/* Logo + brand */}
          <div className="px-6 py-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="SOBUP" className="w-11 h-11 object-contain" />
              <div>
                <p className="font-black text-white text-lg leading-none">SOBUP</p>
                <p className="text-[10px] text-white/50 mt-1 uppercase tracking-widest">Espace membre</p>
              </div>
            </Link>
          </div>

          {/* Profil mini */}
          <div className="px-4 pt-5 pb-4">
            <Link href="/espace-membre/dashboard/profil"
              className="flex items-center gap-3 p-3 rounded-2xl transition-colors hover:bg-white/5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg"
                style={{ background: "linear-gradient(135deg, #31B9AE, #7EEAE4)" }}>
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-sm truncate">{user.name}</p>
                <p className="text-[11px] text-white/55 truncate">{user.role}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 pb-4 overflow-y-auto">
            <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-white/35">Menu principal</p>
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${
                        isActive
                          ? "text-white shadow-lg"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                      style={isActive ? { background: "rgba(49,185,174,0.18)", borderLeft: "3px solid #7EEAE4" } : {}}>
                      <Icon className="w-4 h-4 shrink-0" style={isActive ? { color: "#7EEAE4" } : {}} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                          style={{ background: isActive ? "#7EEAE4" : "#e67e22", color: isActive ? "#0B3D38" : "#fff" }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <p className="px-3 mt-6 mb-2 text-[10px] font-black uppercase tracking-widest text-white/35">Accès rapide</p>
            <ul className="space-y-1">
              {[
                { label: "Site SOBUP", href: "/", icon: Home },
                { label: "Newsletter", href: "/journal", icon: Sparkles },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.href}>
                    <Link href={s.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-white/55 hover:text-white hover:bg-white/5 transition-colors">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {s.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom — carte cotisation + logout */}
          <div className="p-4 border-t border-white/10">
            <div className="p-4 rounded-2xl mb-3" style={{ background: "rgba(126,234,228,0.08)", border: "1px solid rgba(126,234,228,0.15)" }}>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#7EEAE4" }}>Cotisation 2026</p>
              <p className="text-white text-sm font-black mb-2">À jour ✓</p>
              <Link href="/espace-membre/dashboard/cotisation"
                className="text-[11px] font-bold text-white/70 hover:text-white flex items-center gap-1">
                Voir détails <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Burger mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 shrink-0"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            {/* Logo mobile (visible si pas de search) */}
            <Link href="/" className="lg:hidden flex items-center gap-2 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="SOBUP" className="w-7 h-7 object-contain" />
              <span className="font-black text-sm" style={{ color: "#31B9AE" }}>SOBUP</span>
            </Link>

            {/* Search — masquée sur mobile, visible à partir de md */}
            <div className="hidden md:block flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans l'espace membre..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-gray-50"
              />
            </div>

            {/* Spacer pour mobile */}
            <div className="flex-1 md:hidden" />

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Bouton recherche mobile (alternative au champ caché) */}
              <button
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>

              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Notifications">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#e67e22" }} />
              </button>

              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-100">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
                  style={{ background: "linear-gradient(135deg, #31B9AE, #065E52)" }}>
                  {user.avatar}
                </div>
                <p className="text-xs font-bold text-gray-700 hidden lg:block truncate max-w-[140px]">
                  {user.name.split(" ").slice(0, 2).join(" ")}
                </p>
              </div>

              {/* Avatar seul sur mobile */}
              <Link
                href="/espace-membre/dashboard/profil"
                className="sm:hidden w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs"
                style={{ background: "linear-gradient(135deg, #31B9AE, #065E52)" }}
                aria-label="Mon profil"
              >
                {user.avatar}
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-5 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
