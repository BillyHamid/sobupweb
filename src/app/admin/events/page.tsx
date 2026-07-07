import { createAdminClient } from "@/lib/supabase/admin";
import EventsManager from "./EventsManager";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: true });
  return <EventsManager initialEvents={data ?? []} loadError={error?.message ?? null} />;
}
