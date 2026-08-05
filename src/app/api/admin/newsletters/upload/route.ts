import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const PDF_TYPES = ["application/pdf"];
const IMG_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 30 * 1024 * 1024; // 30 Mo

function humanSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".0", "")} Mo`;
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "FormData attendu." }, { status: 400 });

  const file = form.get("file");
  const kind = String(form.get("kind") || ""); // "pdf" | "cover"
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }

  const allowed = kind === "pdf" ? PDF_TYPES : kind === "cover" ? IMG_TYPES : null;
  if (!allowed) {
    return NextResponse.json({ error: "Type invalide (pdf ou cover)." }, { status: 400 });
  }
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: kind === "pdf" ? "Le fichier doit être un PDF." : "Format image non supporté (JPG, PNG, WEBP)." },
      { status: 422 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: `Fichier trop lourd (max ${MAX_SIZE / 1024 / 1024} Mo).` }, { status: 422 });
  }

  const ext = kind === "pdf" ? "pdf" : (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const fileName = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = createAdminClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from("newsletters").upload(fileName, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    console.error("[newsletters/upload]", error);
    return NextResponse.json({ error: "Upload impossible." }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from("newsletters").getPublicUrl(fileName);
  return NextResponse.json(
    { url: pub.publicUrl, path: fileName, size: file.size, humanSize: humanSize(file.size) },
    { status: 201 }
  );
}
