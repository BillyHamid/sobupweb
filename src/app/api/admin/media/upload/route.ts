import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const IMG_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const DOC_TYPES = ["application/pdf"];
const MAX_SIZE = 50 * 1024 * 1024; // 50 Mo

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "FormData attendu." }, { status: 400 });
  const file = form.get("file");
  const kind = String(form.get("kind") || "");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });

  const allowedForKind: Record<string, string[]> = {
    photo: IMG_TYPES, video: VIDEO_TYPES, document: DOC_TYPES,
  };
  const allowed = allowedForKind[kind];
  if (!allowed) return NextResponse.json({ error: "Type de média invalide (photo/video/document)." }, { status: 400 });
  if (!allowed.includes(file.type)) {
    const label = kind === "photo" ? "JPG/PNG/WEBP" : kind === "video" ? "MP4/MOV" : "PDF";
    return NextResponse.json({ error: `Format non supporté. Attendu : ${label}.` }, { status: 422 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: `Fichier trop lourd (max ${MAX_SIZE / 1024 / 1024} Mo).` }, { status: 422 });
  }

  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const fileName = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createAdminClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from("media").upload(fileName, bytes, {
    contentType: file.type, upsert: false,
  });
  if (error) {
    console.error("[media/upload]", error);
    return NextResponse.json({ error: "Upload impossible." }, { status: 500 });
  }
  const { data: pub } = supabase.storage.from("media").getPublicUrl(fileName);
  return NextResponse.json({
    url: pub.publicUrl, path: fileName,
    size: file.size, type: file.type,
  }, { status: 201 });
}
