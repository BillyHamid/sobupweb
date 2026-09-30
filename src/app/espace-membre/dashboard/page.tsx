"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, GraduationCap, UserRound, Users } from "lucide-react";
import { useSessionUser } from "@/lib/userSession";
import { FORMATIONS } from "@/data/formations";

const shortcuts = [
  { label: "Mon profil", description: "Consulter mes coordonnées", href: "/espace-membre/dashboard/profil", icon: UserRound },
  { label: "Mes GTT", description: "Voir mes groupes de travail", href: "/espace-membre/dashboard/gtt", icon: Users },
  { label: "Formations", description: "Explorer les formations publiées", href: "/espace-membre/dashboard/formations", icon: GraduationCap },
  { label: "Événements", description: "Consulter l’agenda SOBUP", href: "/evenements", icon: CalendarDays },
  { label: "Publications", description: "Lire les ressources scientifiques", href: "/publications", icon: BookOpen },
];

export default function DashboardHomePage() {
  const user = useSessionUser();
  const memberships = user?.gttMemberships ?? [];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-[#0b3d38] to-[#065e52] p-7 text-white sm:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7eeae4]">Espace membre SOBUP</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Bonjour {user?.name ?? "membre SOBUP"}</h1>
        <p className="mt-4 max-w-2xl text-white/75">Retrouvez votre profil, vos groupes de travail et les activités publiées par la SOBUP.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href="/espace-membre/dashboard/gtt" className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[#31b9ae] hover:shadow-md">
          <Users className="h-7 w-7 text-[#08796c]" />
          <p className="mt-4 text-3xl font-black text-[#0b3d38]">{memberships.length}</p>
          <p className="mt-1 font-semibold text-slate-700">GTT rejoint{memberships.length > 1 ? "s" : ""}</p>
          <p className="mt-2 text-sm text-slate-500">D’après votre profil membre.</p>
        </Link>
        <Link href="/espace-membre/dashboard/formations" className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[#31b9ae] hover:shadow-md">
          <GraduationCap className="h-7 w-7 text-[#08796c]" />
          <p className="mt-4 text-3xl font-black text-[#0b3d38]">{FORMATIONS.length}</p>
          <p className="mt-1 font-semibold text-slate-700">Formation{FORMATIONS.length > 1 ? "s" : ""} publiée{FORMATIONS.length > 1 ? "s" : ""}</p>
          <p className="mt-2 text-sm text-slate-500">Consultez le programme et les modalités de candidature.</p>
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-black text-[#0b3d38]">Accès rapides</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shortcuts.map(({ label, description, href, icon: Icon }) => (
            <Link key={href} href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#31b9ae] hover:shadow-md">
              <div className="flex items-start justify-between"><Icon className="h-6 w-6 text-[#08796c]" /><ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-[#08796c]" /></div>
              <h3 className="mt-4 font-bold text-[#0b3d38]">{label}</h3>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
