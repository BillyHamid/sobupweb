import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import AdminLogin from "./AdminLogin";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthenticated();
  if (!authed) return <AdminLogin />;
  return <AdminShell>{children}</AdminShell>;
}
