"use client";

import Link from "next/link";
import {
  Eye, Inbox, Users, Newspaper, Calendar, Image as ImageIcon,
  TrendingUp, ArrowUpRight, ExternalLink, Video, FileText,
} from "lucide-react";

type Stats = {
  totalViews: number;
  pendingAdhesions: number;
  approvedAdhesions: number;
  totalMembers: number;
  activeMembers: number;
  bureauMembers: number;
  publishedPosts: number;
  upcomingEvents: number;
  mediaCount: number;
  photosCount: number;
  videosCount: number;
  documentsCount: number;
  weekAdhesions: number;
  weekPosts: number;
  weekEvents: number;
  weekApprovals: number;
};

function fmt(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export default function DashboardView({ stats }: { stats: Stats }) {
  const weekMax = Math.max(stats.weekAdhesions, stats.weekPosts, stats.weekEvents, stats.weekApprovals, 1);

  return (
    <div>
      {/* En-tête */}
      <div className="px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-30">
        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#31B9AE" }}>Bureau SOBUP</p>
        <h1 className="text-xl font-black text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-0.5">Vue d&apos;ensemble de l&apos;activité de la plateforme</p>
      </div>

      <div className="px-8 py-6">
        {/* ─── Metric cards principales ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <MetricCard
            label="Visites du site"
            value={fmt(stats.totalViews)}
            sub="depuis le lancement"
            icon={Eye}
            accent="#7c3aed"
          />
          <MetricCard
            label="Adhésions en attente"
            value={fmt(stats.pendingAdhesions)}
            sub={stats.pendingAdhesions > 0 ? "à traiter dans le back-office" : "aucune à traiter"}
            icon={Inbox}
            accent="#e67e22"
            href="/admin/adhesions"
            highlight={stats.pendingAdhesions > 0}
          />
          <MetricCard
            label="Membres actifs"
            value={fmt(stats.activeMembers)}
            sub={`sur ${fmt(stats.totalMembers)} total · ${fmt(stats.bureauMembers)} au Bureau`}
            icon={Users}
            accent="#31B9AE"
            href="/admin/members"
          />
          <MetricCard
            label="Articles publiés"
            value={fmt(stats.publishedPosts)}
            sub="sur le blog SOBUP"
            icon={Newspaper}
            accent="#2563eb"
            href="/admin/blog"
          />
          <MetricCard
            label="Événements à venir"
            value={fmt(stats.upcomingEvents)}
            sub="dans l&apos;agenda"
            icon={Calendar}
            accent="#0891b2"
            href="/admin/events"
          />
          <MetricCard
            label="Médiathèque"
            value={fmt(stats.mediaCount)}
            sub={`${fmt(stats.photosCount)} photos · ${fmt(stats.videosCount)} vidéos · ${fmt(stats.documentsCount)} docs`}
            icon={ImageIcon}
            accent="#db2777"
            href="/admin/media"
          />
        </section>

        {/* ─── Activité récente ─── */}
        <section className="bg-white rounded-xl border border-gray-100 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-gray-900 text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: "#31B9AE" }} />
                Activité des 7 derniers jours
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Ce qui a bougé récemment sur la plateforme</p>
            </div>
          </div>

          <div className="space-y-3">
            <ActivityBar label="Nouvelles demandes d'adhésion" value={stats.weekAdhesions} max={weekMax} color="#e67e22" />
            <ActivityBar label="Adhésions validées" value={stats.weekApprovals} max={weekMax} color="#31B9AE" />
            <ActivityBar label="Articles publiés" value={stats.weekPosts} max={weekMax} color="#2563eb" />
            <ActivityBar label="Événements créés" value={stats.weekEvents} max={weekMax} color="#0891b2" />
          </div>

          {(stats.weekAdhesions + stats.weekApprovals + stats.weekPosts + stats.weekEvents) === 0 && (
            <p className="text-xs text-gray-400 italic mt-4 text-center py-4">
              Aucune activité cette semaine. C&apos;est le bon moment pour publier une actualité.
            </p>
          )}
        </section>

        {/* ─── Breakdown média ─── */}
        <section className="grid sm:grid-cols-3 gap-3 mb-8">
          <MiniCard icon={ImageIcon} label="Photos" value={fmt(stats.photosCount)} color="#3b82f6" />
          <MiniCard icon={Video} label="Vidéos" value={fmt(stats.videosCount)} color="#f43f5e" />
          <MiniCard icon={FileText} label="Documents PDF" value={fmt(stats.documentsCount)} color="#f59e0b" />
        </section>

        {/* ─── Statistiques externes ─── */}
        <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-black text-gray-900 text-base mb-1">Statistiques détaillées</h2>
          <p className="text-xs text-gray-500 mb-5">
            Pour les rapports d&apos;audience approfondis (géographie, appareils, sources de trafic…),
            consultez les dashboards spécialisés.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            <ExternalCard
              title="Vercel Analytics"
              subtitle="Trafic global, pays, appareils"
              detail="Sans cookie · Toutes les visites"
              href="https://vercel.com/dashboard"
              gradient="linear-gradient(135deg, #000 0%, #333 100%)"
            />
            <ExternalCard
              title="Google Analytics"
              subtitle="Rapports détaillés, comportement"
              detail="Uniquement les visiteurs ayant accepté"
              href="https://analytics.google.com/"
              gradient="linear-gradient(135deg, #E37400 0%, #FF9900 100%)"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label, value, sub, icon: Icon, accent, href, highlight,
}: {
  label: string; value: string; sub: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string; href?: string; highlight?: boolean;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between mb-3">
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${accent}18`, color: accent }}
        >
          <Icon className="w-4 h-4" />
        </span>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        )}
      </div>
      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-900 tabular-nums leading-none mb-1.5">{value}</p>
      <p className="text-xs text-gray-500">{sub}</p>
    </>
  );

  const baseCls = "bg-white rounded-xl border p-5 shadow-sm transition-all";
  const borderCls = highlight ? "border-amber-300" : "border-gray-100";

  return href ? (
    <Link href={href} className={`group ${baseCls} ${borderCls} hover:shadow-md hover:-translate-y-0.5`}>
      {content}
    </Link>
  ) : (
    <div className={`${baseCls} ${borderCls}`}>{content}</div>
  );
}

function ActivityBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-4">
      <p className="text-sm text-gray-700 min-w-[210px] flex-1">{label}</p>
      <div className="flex-1 h-2 rounded-full bg-gray-50 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(pct, value > 0 ? 4 : 0)}%`, background: color }}
        />
      </div>
      <p className="text-sm font-black text-gray-900 tabular-nums w-8 text-right">{value}</p>
    </div>
  );
}

function MiniCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
      <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}18`, color }}>
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xl font-black text-gray-900 tabular-nums leading-none">{value}</p>
      </div>
    </div>
  );
}

function ExternalCard({ title, subtitle, detail, href, gradient }: {
  title: string; subtitle: string; detail: string; href: string; gradient: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-xl overflow-hidden text-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg block"
      style={{ background: gradient }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-black text-base">{title}</h3>
        <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-sm opacity-90 mb-1">{subtitle}</p>
      <p className="text-[11px] opacity-70">{detail}</p>
    </a>
  );
}
