import { createAdminClient } from "@/lib/supabase/admin";
import BlogManager from "./BlogManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return <BlogManager initialPosts={data ?? []} loadError={error?.message ?? null} />;
}
