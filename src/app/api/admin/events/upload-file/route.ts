import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const MAX_SIZE = 20 * 1024 * 1024; // 20 Mo

/** Nettoie un nom de fichier pour l'utiliser dans une URL Storage. */
function sanitizeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  return base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60) || "document";
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "FormData attendu." }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      { error: "Format non supporté. Acceptés : PDF, Word, Excel, PowerPoint, JPG, PNG." },
      { status: 422 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `Fichier trop lourd (max ${MAX_SIZE / 1024 / 1024} Mo).` },
      { status: 422 }
    );
  }

  const ext = ALLOWED_TYPES[file.type];
  const storagePath = `${Date.now()}-${sanitizeFileName(file.name)}.${ext}`;

  const supabase = createAdminClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from("event-files")
    .upload(storagePath, bytes, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[events/upload-file]", error);
    return NextResponse.json({ error: "Upload impossible." }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from("event-files").getPublicUrl(storagePath);
  return NextResponse.json(
    { url: pub.publicUrl, name: file.name, size: file.size },
    { status: 201 }
  );
}
