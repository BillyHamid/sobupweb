import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Sondage invalide." }, { status: 400 });
  const body = await req.json().catch(() => null);
  if (typeof body?.is_open !== "boolean") return NextResponse.json({ error: "État invalide." }, { status: 422 });
  const db = createAdminClient();
  const { data, error } = await db.from("member_surveys").update({ is_open: body.is_open }).eq("id", id).select("id, is_open").single();
  if (error || !data) return NextResponse.json({ error: "Impossible de modifier le sondage." }, { status: 503 });
  return NextResponse.json(data);
}
