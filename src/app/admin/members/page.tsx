import { createAdminClient } from "@/lib/supabase/admin";
import MembersManager, { type MemberRow } from "./MembersManager";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const supabase = createAdminClient();

  const [{ data: profiles, error: pErr }, { data: usersData, error: uErr }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.auth.admin.listUsers({ page: 1, perPage: 500 }),
  ]);

  const usersById = new Map((usersData?.users ?? []).map((u) => [u.id, u]));
  const members: MemberRow[] = (profiles ?? []).map((p) => {
    const u = usersById.get(p.user_id);
    return { ...p, email: u?.email ?? null, auth_created_at: u?.created_at ?? null };
  });

  return <MembersManager initialMembers={members} loadError={(pErr ?? uErr)?.message ?? null} />;
}
