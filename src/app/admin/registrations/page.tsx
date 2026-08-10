import { createAdminClient } from "@/lib/supabase/admin";
import RegistrationsManager, { type Registration } from "./RegistrationsManager";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("event_registrations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <RegistrationsManager
      initialRegistrations={(data ?? []) as Registration[]}
      loadError={error?.message ?? null}
    />
  );
}
