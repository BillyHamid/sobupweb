import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { APPLICATION_BUCKET, APPLICATION_FILE_TYPES, MAX_APPLICATION_FILE_SIZE, PROFESSIONS, RESPIRE_MODULES, validModuleSelection } from "@/lib/formations";
import { sendMail, escapeHtml, emailLayout, SECRETARIAT, SITE_URL } from "@/lib/mail";

export const runtime = "nodejs";
const MAX_BODY = 4 * 1024 * 1024 + 64 * 1024;
const PAYMENT_DEADLINE = "5 décembre 2026";
const fail = (error: string, status = 422) => NextResponse.json({ error }, { status });

/**
 * Prévient le secrétariat et accuse réception au candidat.
 * Renvoie un avertissement lisible si un envoi a échoué — la candidature,
 * elle, est déjà enregistrée et ne doit jamais être présentée comme perdue.
 */
async function notifyApplication(app: {
  id: string; nom: string; prenom: string; telephone: string; email: string;
  profession: string; specialite: string; lieuExercice: string; modules: number[];
  cv: { bytes: Buffer; ext: string; contentType: string };
}): Promise<string | undefined> {
  const reference = `RESPIRE-${app.id}`;
  const safe = {
    nom: escapeHtml(app.nom), prenom: escapeHtml(app.prenom),
    telephone: escapeHtml(app.telephone), email: escapeHtml(app.email),
    profession: escapeHtml(app.profession),
    specialite: app.specialite ? escapeHtml(app.specialite) : "",
    lieu: escapeHtml(app.lieuExercice),
  };
  const chosen = RESPIRE_MODULES.filter(m => app.modules.includes(m.id));
  const modulesHtml = chosen
    .map(m => `<li style="margin:0 0 6px"><strong>Module ${m.id}</strong> · ${escapeHtml(m.title)}</li>`)
    .join("");
  const whatsapp = app.telephone.replace(/\D/g, "");

  const row = (label: string, value: string, alt: boolean) =>
    `<tr${alt ? ` style="background:#f8fafc"` : ""}><td style="padding:10px 14px;color:#64748b;width:40%;border-top:1px solid #e2e8f0">${label}</td><td style="padding:10px 14px;color:#0f172a;border-top:1px solid #e2e8f0">${value}</td></tr>`;

  const secretariatHtml = emailLayout(`
    <div style="padding:28px 32px 8px">
      <h2 style="margin:0 0 6px;color:#065e52;font-weight:800;font-size:20px">Nouvelle candidature RESPIRE-BF</h2>
      <p style="margin:0 0 20px;color:#64748b;font-size:13px">Référence <strong style="color:#0f172a">${reference}</strong></p>
      <table style="width:100%;font-size:14px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        ${row("Candidat", `<strong>${safe.prenom} ${safe.nom}</strong>`, true)}
        ${row("Email", `<a href="mailto:${safe.email}" style="color:#31B9AE">${safe.email}</a>`, false)}
        ${row("WhatsApp", `<a href="https://wa.me/${whatsapp}" style="color:#25D366;font-weight:600">${safe.telephone}</a>`, true)}
        ${row("Profession", safe.profession, false)}
        ${safe.specialite ? row("Spécialité", safe.specialite, true) : ""}
        ${row("Lieu d’exercice", safe.lieu, !safe.specialite)}
      </table>
      <div style="margin-top:18px;padding:16px;background:#e8f9f7;border:1px solid #31B9AE40;border-radius:12px">
        <p style="margin:0 0 8px;font-size:11px;font-weight:800;color:#065e52;text-transform:uppercase;letter-spacing:.12em">Modules demandés</p>
        <ul style="margin:0;padding-left:18px;font-size:14px;color:#0f172a">${modulesHtml}</ul>
      </div>
      <p style="margin:18px 0 0;font-size:13px;color:#475569">📎 Le CV du candidat est joint à ce message.</p>
      <div style="margin:22px 0 0;text-align:center">
        <a href="${SITE_URL}/admin/formations" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px">Ouvrir le back-office →</a>
      </div>
      <p style="margin:18px 0 0;font-size:12px;color:#94a3b8;line-height:1.6">Vous pouvez répondre directement à ce mail pour contacter le candidat.</p>
    </div>`);

  const candidatHtml = emailLayout(`
    <div style="padding:32px;text-align:center">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);line-height:56px;margin-bottom:16px"><span style="color:#fff;font-size:28px;font-weight:900">✓</span></div>
      <h2 style="margin:0 0 8px;color:#0f172a;font-weight:800;font-size:22px">Candidature bien reçue</h2>
      <p style="margin:0;color:#64748b;font-size:14px">Formation RESPIRE-BF</p>
    </div>
    <div style="padding:0 32px 32px">
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Bonjour <strong>${safe.prenom}</strong>,</p>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 18px">Votre dossier a bien été transmis à l’équipe RESPIRE-BF. Conservez la référence ci-dessous pour tous vos échanges avec la SOBUP.</p>
      <div style="margin:0 0 20px;padding:18px;background:#e8f9f7;border:1px solid #31B9AE40;border-radius:12px;text-align:center">
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065e52;text-transform:uppercase;letter-spacing:.14em">Votre référence</p>
        <p style="margin:0;font-size:16px;font-weight:900;color:#0f172a;word-break:break-all">${reference}</p>
      </div>
      <p style="margin:0 0 8px;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.1em">Modules demandés</p>
      <ul style="margin:0 0 20px;padding-left:18px;font-size:14px;color:#0f172a;line-height:1.7">${modulesHtml}</ul>
      <div style="margin:0 0 18px;padding:14px;background:#fff7ed;border-left:3px solid #e67e22;border-radius:6px">
        <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6">Votre inscription et le paiement des frais sont attendus au plus tard le <strong>${PAYMENT_DEADLINE}</strong>.</p>
      </div>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0">Le dépôt d’une candidature ne constitue ni un paiement ni une confirmation d’admission. L’équipe reviendra vers vous après examen de votre dossier.</p>
      <p style="color:#94a3b8;line-height:1.6;font-size:12px;margin:20px 0 0">Pour toute question, répondez directement à ce mail.</p>
    </div>`);

  const cvAttachment = [{
    filename: `CV-${app.nom}-${app.prenom}.${app.cv.ext}`.replace(/\s+/g, "-"),
    content: app.cv.bytes.toString("base64"),
  }];

  const [secretariat, candidat] = await Promise.all([
    sendMail({
      to: SECRETARIAT, replyTo: app.email,
      subject: `Candidature RESPIRE-BF — ${app.prenom} ${app.nom}`,
      html: secretariatHtml, attachments: cvAttachment,
    }, "formations/secretariat"),
    sendMail({
      to: app.email, replyTo: SECRETARIAT,
      subject: `Candidature RESPIRE-BF bien reçue — ${reference}`,
      html: candidatHtml,
    }, "formations/candidat"),
  ]);

  if (!candidat.sent) return "Votre candidature est bien enregistrée, mais l’accusé de réception n’a pas pu vous être envoyé par email. Conservez précieusement votre référence.";
  if (!secretariat.sent) return "Votre candidature est bien enregistrée. La notification interne n’a pas pu être envoyée ; contactez le secrétariat si vous restez sans nouvelle.";
  return undefined;
}

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
  const nom = field("nom"), prenom = field("prenom");
  const telephone = field("telephone"), email = field("email");
  const profession = field("profession"), specialite = field("specialite");
  const lieuExercice = field("lieuExercice");
  const requestId = field("requestId");
  if (!nom || !prenom || nom.length > 100 || prenom.length > 100) return fail("Nom et prénom requis (100 caractères maximum chacun).");
  const digits = telephone.replace(/\D/g, "");
  if (!/^[+\d\s().-]+$/.test(telephone) || digits.length < 8 || digits.length > 15 || telephone.length > 40) return fail("Indiquez un numéro WhatsApp valide.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) return fail("Indiquez une adresse email valide.");
  if (!PROFESSIONS.includes(profession as (typeof PROFESSIONS)[number])) return fail("Choisissez votre profession.");
  if (profession === "Médecin spécialiste" && !specialite) return fail("Indiquez votre spécialité.");
  if (specialite.length > 120) return fail("Spécialité trop longue (120 caractères maximum).");
  if (!lieuExercice || lieuExercice.length > 160) return fail("Indiquez votre lieu d’exercice (160 caractères maximum).");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return fail("Rechargez la page avant de soumettre votre candidature.");
  let modules: unknown;
  try { modules = JSON.parse(field("modules")); } catch { return fail("Choisissez au moins un module valide."); }
  if (!validModuleSelection(modules)) return fail("Choisissez un, deux ou trois modules distincts parmi les modules 1, 2 et 3.");
  modules.sort();
  let cv;
  try { cv = await documentFile(form.get("cv"), true); }
  catch (error) { return fail((error as Error).message); }
  if (!cv) return fail("Veuillez joindre votre CV.");
  const fingerprint = createHash("sha256").update(JSON.stringify({ nom, prenom, telephone, email, profession, specialite, lieuExercice, modules })).update(cv.bytes).digest("hex");
  const uploaded: string[] = [];
  try {
    const db = createAdminClient();
    const { data: existing, error: lookupError } = await db.from("formation_applications").select("id, fingerprint").eq("request_id", requestId).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return existing.fingerprint === fingerprint ? NextResponse.json({ reference: `RESPIRE-${existing.id}` }) : fail("Cette candidature a déjà été envoyée avec d’autres informations. Rechargez la page pour un nouveau dossier.", 409);
    // L'email sert de clé anti-doublon : c'est l'identifiant le plus stable.
    const normalizedContact = email.toLowerCase();
    const { count, error: countError } = await db.from("formation_applications").select("id", { count: "exact", head: true }).eq("contact_normalized", normalizedContact).gte("created_at", new Date(Date.now() - 60_000).toISOString());
    if (countError) throw countError;
    if (count && count > 0) return fail("Une candidature vient d’être reçue pour ce contact. Patientez une minute avant un nouvel envoi.", 429);
    const id = randomUUID();
    const cvPath = `${id}/cv.${cv.ext}`;
    const { error: uploadError } = await db.storage.from(APPLICATION_BUCKET).upload(cvPath, cv.bytes, { contentType: cv.contentType, upsert: false });
    if (uploadError) throw uploadError;
    uploaded.push(cvPath);
    // `motivation_path` reste en base pour les candidatures déjà reçues ;
    // la lettre de motivation n'est simplement plus demandée.
    const { error } = await db.from("formation_applications").insert({ id, request_id: requestId, fingerprint, nom, prenom, telephone, email: normalizedContact, profession, specialite: specialite || null, lieu_exercice: lieuExercice, contact: email, contact_normalized: normalizedContact, modules, cv_path: cvPath, motivation_path: null });
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
    // La candidature est enregistrée : l'envoi des mails ne doit plus pouvoir
    // la faire échouer. `sendMail` ne lève jamais, il renvoie l'échec.
    const warning = await notifyApplication({
      id, nom, prenom, telephone, email, profession, specialite, lieuExercice, modules, cv,
    });
    return NextResponse.json({ reference: `RESPIRE-${id}`, warning }, { status: 201 });
  } catch (error) {
    // On journalise l'erreur brute : un message générique masquerait la cause
    // réelle (colonne manquante, quota de stockage, RLS…) et rendrait tout
    // diagnostic impossible depuis les logs.
    console.error("[formations/candidatures] Enregistrement impossible", error);
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
