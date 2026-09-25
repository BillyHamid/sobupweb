import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { APPLICATION_BUCKET } from "@/lib/formations";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const { id } = await params;
  const kind = new URL(req.url).searchParams.get("type");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !["cv", "motivation"].includes(kind ?? "")) return NextResponse.json({ error: "Document invalide." }, { status: 400 });
  try {
    const db = createAdminClient();
    const { data, error } = await db.from("formation_applications").select("cv_path, motivation_path").eq("id", id).single();
    if (error || !data) return NextResponse.json({ error: "Candidature introuvable." }, { status: 404 });
    const path = kind === "cv" ? data.cv_path : data.motivation_path;
    if (!path || !path.startsWith(`${id}/`)) return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
    const { data: file, error: downloadError } = await db.storage.from(APPLICATION_BUCKET).download(path);
    if (downloadError || !file) throw new Error("Téléchargement impossible");
    const ext = path.split(".").pop();
    return new Response(file, { headers: { "Content-Type": "application/octet-stream", "Content-Disposition": `attachment; filename="${kind}-${id}.${ext}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return NextResponse.json({ error: "Téléchargement indisponible. Réessayez." }, { status: 503 }); }
}
