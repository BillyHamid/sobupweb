"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  LayoutDashboard, Inbox, Newspaper, Calendar, Users, Image as ImageIcon,
  FileText, BookOpen, Settings, LogOut, RefreshCw, Mail, Menu, X,
  ClipboardList, FileSignature,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard, enabled: true },
  { href: "/admin/adhesions", label: "Adhésions", icon: Inbox, enabled: true },
  { href: "/admin/blog", label: "Actualités", icon: Newspaper, enabled: true },
  { href: "/admin/newsletters", label: "Newsletters", icon: Mail, enabled: true },
  { href: "/admin/events", label: "Événements", icon: Calendar, enabled: true },
  { href: "/admin/registrations", label: "Inscriptions", icon: ClipboardList, enabled: true },
  { href: "/admin/abstracts", label: "Abstracts", icon: FileSignature, enabled: true },
  { href: "/admin/members", label: "Membres", icon: Users, enabled: true },
  { href: "/admin/media", label: "Médiathèque", icon: ImageIcon, enabled: true },
  { href: "/admin/documents", label: "Documents", icon: FileText, enabled: false },
  { href: "/admin/annuaire", label: "Annuaire", icon: BookOpen, enabled: false },
  { href: "/admin/settings", label: "Paramètres", icon: Settings, enabled: false },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Ferme le drawer à chaque navigation
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Bloque le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin";
  }

  const currentLabel = NAV.find((n) => pathname?.startsWith(n.href))?.label ?? "Administration";

  const navContent = (
    <>
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#31B9AE" }}>Bureau</p>
          <h1 className="text-base font-black text-gray-900 leading-tight">SOBUP Admin</h1>
        </div>
        <button
          onClick={() => setDrawerOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          const cls = `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            active ? "text-white shadow-sm"
              : item.enabled ? "text-gray-600 hover:bg-gray-50"
              : "text-gray-300 cursor-not-allowed"
          }`;
          const style = active ? { background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" } : {};

          if (!item.enabled) {
            return (
              <span key={item.href} className={cls} style={style} title="Bientôt disponible">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                <span className="text-[9px] font-black uppercase tracking-wider opacity-60">Bientôt</span>
              </span>
            );
          }
          return (
            <Link key={item.href} href={item.href} className={cls} style={style}>
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-gray-100 space-y-1">
        <button
          onClick={() => startTransition(() => router.refresh())}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
          Rafraîchir
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen lg:flex" style={{ background: "#f8fafc" }}>
      {/* ── Barre mobile ── */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-widest leading-none" style={{ color: "#31B9AE" }}>
            SOBUP Admin
          </p>
          <p className="text-sm font-black text-gray-900 truncate leading-tight">{currentLabel}</p>
        </div>
        <button
          onClick={() => startTransition(() => router.refresh())}
          className="ml-auto p-2 rounded-lg text-gray-400 hover:bg-gray-50"
          aria-label="Rafraîchir"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* ── Drawer mobile ── */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setDrawerOpen(false); }}
        >
          <aside className="w-64 max-w-[85vw] h-full bg-white flex flex-col shadow-2xl animate-drawer-in">
            {navContent}
          </aside>
          <style>{`
            @keyframes drawer-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
            .animate-drawer-in { animation: drawer-in .25s cubic-bezier(.22,1,.36,1) both; }
          `}</style>
        </div>
      )}

      {/* ── Sidebar desktop ── */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen">
        {navContent}
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
