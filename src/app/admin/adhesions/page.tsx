import { createAdminClient } from "@/lib/supabase/admin";
import AdhesionsDashboard from "./AdhesionsDashboard";

export const dynamic = "force-dynamic";

export default async function AdhesionsPage() {
  const supabase = createAdminClient();

  const [{ data: pending }, { data: approved }, { data: rejected }] = await Promise.all([
    supabase.from("adhesion_requests").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    supabase.from("adhesion_requests").select("*").eq("status", "approved").order("validated_at", { ascending: false }),
    supabase.from("adhesion_requests").select("*").eq("status", "rejected").order("validated_at", { ascending: false }),
  ]);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();

  const [{ count: wkPending }, { count: wkApproved }, { count: wkRejected }] = await Promise.all([
    supabase.from("adhesion_requests").select("*", { count: "exact", head: true }).eq("status", "pending").gte("created_at", weekAgo),
    supabase.from("adhesion_requests").select("*", { count: "exact", head: true }).eq("status", "approved").gte("validated_at", weekAgo),
    supabase.from("adhesion_requests").select("*", { count: "exact", head: true }).eq("status", "rejected").gte("validated_at", weekAgo),
  ]);

  return (
    <AdhesionsDashboard
      pending={pending ?? []}
      approved={approved ?? []}
      rejected={rejected ?? []}
      stats={{
        pending: wkPending ?? 0,
        approved: wkApproved ?? 0,
        rejected: wkRejected ?? 0,
      }}
    />
  );
}
