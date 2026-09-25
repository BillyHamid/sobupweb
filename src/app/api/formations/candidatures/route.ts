import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { APPLICATION_BUCKET, APPLICATION_FILE_TYPES, MAX_APPLICATION_FILE_SIZE, validModuleSelection } from "@/lib/formations";

export const runtime = "nodejs";
const MAX_BODY = 4 * 1024 * 1024 + 64 * 1024;
const fail = (error: string, status = 422) => NextResponse.json({ error }, { status });

async function documentFile(value: FormDataEntryValue | null, required: boolean) {
  if (!(value instanceof File) || !value.size) {
    if (required) throw new Error("Veuillez joindre votre CV.");
    return null;
  }
  if (value.size > MAX_APPLICATION_FILE_SIZE) throw new Error("Chaque document doit peser au maximum 2 Mo.");
  const ext = value.name.split(".").pop()?.toLowerCase() ?? "";
  const contentType = APPLICATION_FILE_TYPES[ext];
  if (!contentType) throw new Error("Documents acceptés : PDF, DOC ou DOCX.");
  const bytes = Buffer.from(await value.arrayBuffer());
  const valid = ext === "pdf" ? bytes.subarray(0, 5).toString() === "%PDF-"
    : ext === "doc" ? bytes.subarray(0, 8).equals(Buffer.from("d0cf11e0a1b11ae1", "hex"))
    : bytes.subarray(0, 4).equals(Buffer.from("504b0304", "hex")) && bytes.includes(Buffer.from("word/"));
  if (!valid) throw new Error("Un document ne correspond pas au format annoncé. Exportez-le en PDF et réessayez.");
  return { bytes, ext, contentType };
}

export async function POST(req: Request) {
  // Bound the streamed body too: Content-Length alone is not trustworthy.
  if (Number(req.headers.get("content-length")) > MAX_BODY) return fail("Les documents sont trop volumineux (2 Mo maximum chacun).", 413);
  let form: FormData;
  try {
    const reader = req.body?.getReader();
    if (!reader) return fail("Formulaire manquant.", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) { await reader.cancel(); return fail("Les documents sont trop volumineux.", 413); }
      chunks.push(value);
    }
    form = await new Response(Buffer.concat(chunks), { headers: { "content-type": req.headers.get("content-type") ?? "" } }).formData();
  } catch { return fail("Formulaire invalide.", 400); }
  const field = (key: string) => typeof form.get(key) === "string" ? (form.get(key) as string).trim() : "";
  if (field("website")) return fail("Le formulaire n’a pas pu être envoyé.", 400);
  const nom = field("nom"), prenom = field("prenom"), contact = field("contact");
  const requestId = field("requestId");
  if (!nom || !prenom || nom.length > 100 || prenom.length > 100) return fail("Nom et prénom requis (100 caractères maximum chacun).");
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhone = /^[+\d\s().-]+$/.test(contact) && contact.replace(/\D/g, "").length >= 8 && contact.replace(/\D/g, "").length <= 15;
  if (contact.length > 180 || (!isEmail && !isPhone)) return fail("Indiquez un numéro de téléphone valide ou une adresse email.");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return fail("Rechargez la page avant de soumettre votre candidature.");
  let modules: unknown;
  try { modules = JSON.parse(field("modules")); } catch { return fail("Choisissez au moins un module valide."); }
  if (!validModuleSelection(modules)) return fail("Choisissez un, deux ou trois modules distincts parmi les modules 1, 2 et 3.");
  modules.sort();
  let cv, motivation;
  try { cv = await documentFile(form.get("cv"), true); motivation = await documentFile(form.get("motivation"), false); }
  catch (error) { return fail((error as Error).message); }
  if (!cv) return fail("Veuillez joindre votre CV.");
  const fingerprint = createHash("sha256").update(JSON.stringify({ nom, prenom, contact, modules })).update(cv.bytes).update(motivation?.bytes ?? Buffer.alloc(0)).digest("hex");
  const uploaded: string[] = [];
  try {
    const db = createAdminClient();
    const { data: existing, error: lookupError } = await db.from("formation_applications").select("id, fingerprint").eq("request_id", requestId).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return existing.fingerprint === fingerprint ? NextResponse.json({ reference: `RESPIRE-${existing.id}` }) : fail("Cette candidature a déjà été envoyée avec d’autres informations. Rechargez la page pour un nouveau dossier.", 409);
    const normalizedContact = isEmail ? contact.toLowerCase() : contact.replace(/\D/g, "");
    const { count, error: countError } = await db.from("formation_applications").select("id", { count: "exact", head: true }).eq("contact_normalized", normalizedContact).gte("created_at", new Date(Date.now() - 60_000).toISOString());
    if (countError) throw countError;
    if (count && count > 0) return fail("Une candidature vient d’être reçue pour ce contact. Patientez une minute avant un nouvel envoi.", 429);
    const id = randomUUID();
    for (const [kind, file] of [["cv", cv], ["motivation", motivation]] as const) {
      if (!file) continue;
      const path = `${id}/${kind}.${file.ext}`;
      const { error } = await db.storage.from(APPLICATION_BUCKET).upload(path, file.bytes, { contentType: file.contentType, upsert: false });
      if (error) throw error;
      uploaded.push(path);
    }
    const { error } = await db.from("formation_applications").insert({ id, request_id: requestId, fingerprint, nom, prenom, contact, contact_normalized: normalizedContact, modules, cv_path: uploaded[0], motivation_path: uploaded[1] ?? null });
    if (error) {
      if (error.code === "23505") {
        const { data: duplicate } = await db.from("formation_applications").select("id, fingerprint").eq("request_id", requestId).maybeSingle();
        await db.storage.from(APPLICATION_BUCKET).remove(uploaded);
        uploaded.length = 0;
        if (duplicate?.fingerprint === fingerprint) return NextResponse.json({ reference: `RESPIRE-${duplicate.id}` });
        return fail("Cette candidature a déjà été envoyée. Rechargez la page pour un nouveau dossier.", 409);
      }
      throw error;
    }
    return NextResponse.json({ reference: `RESPIRE-${id}` }, { status: 201 });
  } catch (error) {
    console.error("[formations/candidatures] Enregistrement impossible", error instanceof Error ? error.message : "Erreur de stockage ou de base de données");
    if (uploaded.length) {
      try {
        const db = createAdminClient();
        // A lost response can follow a successful INSERT. Keep its documents.
        const { data: saved, error: checkError } = await db.from("formation_applications").select("id, fingerprint").eq("request_id", requestId).maybeSingle();
        if (saved?.fingerprint === fingerprint) return NextResponse.json({ reference: `RESPIRE-${saved.id}` });
        if (!checkError) await db.storage.from(APPLICATION_BUCKET).remove(uploaded);
      } catch { console.error("[formations/candidatures] État de l’enregistrement non confirmé ; documents conservés"); }
    }
    return fail("L’enregistrement est momentanément indisponible. Votre candidature n’a pas pu être confirmée ; réessayez plus tard.", 503);
  }
}
