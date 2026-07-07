import { createPublicClient } from "@/lib/supabase/server";
import EventsListClient from "./EventsListClient";

export const dynamic = "force-dynamic";

export default async function EvenementsPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("events")
    .select("id, slug, type, display_date, time_range, location, title, excerpt, description, badge_label, badge_bg, badge_color, gtt, image_url, has_page")
    .eq("published", true)
    .order("event_date", { ascending: true });

  return <EventsListClient events={data ?? []} />;
}
