import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "FormData attendu." }, { status: 400 });
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté (JPG, PNG, WEBP)." }, { status: 422 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: `Max ${MAX_SIZE / 1024 / 1024} Mo.` }, { status: 422 });
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createAdminClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from("event-images").upload(fileName, bytes, {
    contentType: file.type, upsert: false,
  });
  if (error) {
    console.error("[events/upload]", error);
    return NextResponse.json({ error: "Upload impossible." }, { status: 500 });
  }
  const { data: pub } = supabase.storage.from("event-images").getPublicUrl(fileName);
  return NextResponse.json({ url: pub.publicUrl, path: fileName }, { status: 201 });
}
