import { createAdminClient } from "@/lib/supabase/admin";
import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

async function fetchStats() {
  const supabase = createAdminClient();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
  const todayIso = now.toISOString().slice(0, 10);

  const [
    siteStats,
    pendingAdhesions,
    approvedAdhesions,
    totalMembers,
    activeMembers,
    bureauMembers,
    publishedPosts,
    upcomingEvents,
    mediaCount,
    photosCount,
    videosCount,
    documentsCount,
    weekAdhesions,
    weekPosts,
    weekEvents,
    weekApprovals,
  ] = await Promise.all([
    supabase.from("site_stats").select("total_views").eq("id", 1).maybeSingle(),
    supabase.from("adhesion_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("adhesion_requests").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_bureau", true),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("published", true).gte("event_date", todayIso),
    supabase.from("media_items").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("media_items").select("*", { count: "exact", head: true }).eq("published", true).eq("kind", "photo"),
    supabase.from("media_items").select("*", { count: "exact", head: true }).eq("published", true).eq("kind", "video"),
    supabase.from("media_items").select("*", { count: "exact", head: true }).eq("published", true).eq("kind", "document"),
    supabase.from("adhesion_requests").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("events").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("adhesion_requests").select("*", { count: "exact", head: true }).eq("status", "approved").gte("validated_at", weekAgo),
  ]);

  return {
    totalViews: siteStats.data?.total_views ?? 0,
    pendingAdhesions: pendingAdhesions.count ?? 0,
    approvedAdhesions: approvedAdhesions.count ?? 0,
    totalMembers: totalMembers.count ?? 0,
    activeMembers: activeMembers.count ?? 0,
    bureauMembers: bureauMembers.count ?? 0,
    publishedPosts: publishedPosts.count ?? 0,
    upcomingEvents: upcomingEvents.count ?? 0,
    mediaCount: mediaCount.count ?? 0,
    photosCount: photosCount.count ?? 0,
    videosCount: videosCount.count ?? 0,
    documentsCount: documentsCount.count ?? 0,
    weekAdhesions: weekAdhesions.count ?? 0,
    weekPosts: weekPosts.count ?? 0,
    weekEvents: weekEvents.count ?? 0,
    weekApprovals: weekApprovals.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const stats = await fetchStats();
  return <DashboardView stats={stats} />;
}
