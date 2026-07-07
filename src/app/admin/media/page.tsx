import { createAdminClient } from "@/lib/supabase/admin";
import MediaManager, { type MediaItem } from "./MediaManager";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("media_items")
    .select("*")
    .order("kind", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return <MediaManager initialItems={(data ?? []) as MediaItem[]} loadError={error?.message ?? null} />;
}
