"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Newspaper, Calendar, Users, Image as ImageIcon, FileText, BookOpen, Settings, LogOut, RefreshCw } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled?: boolean;
};

const NAV: NavItem[] = [
  { href: "/admin/adhesions", label: "Adhésions", icon: Inbox, enabled: true },
  { href: "/admin/blog", label: "Actualités", icon: Newspaper, enabled: true },
  { href: "/admin/events", label: "Événements", icon: Calendar, enabled: true },
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

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#f8fafc" }}>
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#31B9AE" }}>Bureau</p>
          <h1 className="text-base font-black text-gray-900 leading-tight">SOBUP Admin</h1>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            const cls =
              `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                active ? "text-white shadow-sm" :
                item.enabled ? "text-gray-600 hover:bg-gray-50" : "text-gray-300 cursor-not-allowed"
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
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
