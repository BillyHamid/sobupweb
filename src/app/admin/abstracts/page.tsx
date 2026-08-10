import { createAdminClient } from "@/lib/supabase/admin";
import AbstractsManager, { type Abstract } from "./AbstractsManager";

export const dynamic = "force-dynamic";

export default async function AdminAbstractsPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("abstracts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AbstractsManager
      initialAbstracts={(data ?? []) as Abstract[]}
      loadError={error?.message ?? null}
    />
  );
}
