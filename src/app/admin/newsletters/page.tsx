import { createAdminClient } from "@/lib/supabase/admin";
import NewslettersManager, { type Newsletter } from "./NewslettersManager";

export const dynamic = "force-dynamic";

export default async function AdminNewslettersPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletters")
    .select("*")
    .order("numero", { ascending: false });

  return (
    <NewslettersManager
      initialNewsletters={(data ?? []) as Newsletter[]}
      loadError={error?.message ?? null}
    />
  );
}
