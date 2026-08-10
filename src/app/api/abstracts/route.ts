import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getBccList } from "@/lib/mail";
import { createAdminClient } from "@/lib/supabase/admin";

const SECRETARIAT = process.env.SOBUP_SECRETARIAT_EMAIL ?? "ouattarabillyhamid@gmail.com";
const FROM = process.env.RESEND_FROM ?? "SOBUP <onboarding@resend.dev>";
const LOGO_CID = "sobup-logo";
const BUCKET = "abstracts";
// 4 Mo : Vercel plafonne le corps des requêtes serverless à ~4,5 Mo et
// répond 413 avant d'exécuter cette route. Annoncer 5 Mo serait mensonger.
const MAX_FILE = 4 * 1024 * 1024;
const ALLOWED_EXT = ["pdf", "doc", "docx"];

let logoCache: string | null = null;
async function getLogoBase64() {
  if (logoCache) return logoCache;
  const file = await readFile(path.join(process.cwd(), "public", "logo.png"));
  logoCache = file.toString("base64");
  return logoCache;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function countWords(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function slugifyFilename(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const base = name.slice(0, name.length - ext.length - 1)
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "abstract";
  return `${Date.now()}-${base}.${ext}`;
}

const TYPE_LABELS: Record<string, string> = {
  oral: "Communication orale",
  poster: "Poster",
};

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v.trim() : "";
  };

  // Honeypot anti-bot
  if (get("honeypot") !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const type = get("type");
  const auteurPrincipal = get("auteurPrincipal");
  const email = get("email");
  const telephone = get("telephone");
  const coAuteurs = get("coAuteurs");
  const etablissement = get("etablissement");
  const titre = get("titre");
  const texte = get("texte");
  const motsCles = get("motsCles");
  const eventSlug = get("eventSlug") || "journee-regionale";
  const eventTitle = get("eventTitle") || "Journée Scientifique Régionale";

  const required = { type, auteurPrincipal, email, titre, texte };
  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    return NextResponse.json({ error: `Champs manquants : ${missing.join(", ")}` }, { status: 422 });
  }
  if (!TYPE_LABELS[type]) {
    return NextResponse.json({ error: "Type de soumission invalide." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 422 });
  }
  const words = countWords(texte);
  if (words < 50) {
    return NextResponse.json({ error: "L'abstract doit contenir au moins 50 mots." }, { status: 422 });
  }
  if (words > 300) {
    return NextResponse.json({ error: `L'abstract dépasse 300 mots (${words} mots).` }, { status: 422 });
  }

  // ─── Fichier joint optionnel → Supabase Storage ───
  let fileUrl: string | null = null;
  let fileName: string | null = null;
  let fileSize: number | null = null;

  const file = form.get("fichier");
  if (file instanceof File && file.size > 0) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json({ error: "Format accepté : PDF, DOC ou DOCX." }, { status: 422 });
    }
    if (file.size > MAX_FILE) {
      return NextResponse.json({ error: "Le fichier dépasse 4 Mo." }, { status: 422 });
    }
    try {
      const supabase = createAdminClient();
      const key = slugifyFilename(file.name);
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(key, await file.arrayBuffer(), {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
      if (upErr) {
        console.error("[abstracts] upload error", upErr);
        return NextResponse.json({ error: "Le fichier n'a pas pu être téléversé." }, { status: 500 });
      }
      fileUrl = supabase.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
      fileName = file.name;
      fileSize = file.size;
    } catch (err) {
      console.error("[abstracts] storage unavailable", err);
      return NextResponse.json({ error: "Service de téléversement indisponible." }, { status: 503 });
    }
  }

  // ─── Enregistrement en base ───
  let reference = "";
  try {
    const supabase = createAdminClient();
    const { data, error: dbError } = await supabase
      .from("abstracts")
      .insert({
        event_slug: eventSlug,
        event_title: eventTitle,
        type,
        titre,
        auteur_principal: auteurPrincipal,
        email: email.toLowerCase(),
        telephone: telephone || null,
        co_auteurs: coAuteurs || null,
        etablissement: etablissement || null,
        texte,
        mots_cles: motsCles || null,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        status: "soumis",
      })
      .select("id, reference, created_at")
      .single();
    if (dbError || !data) {
      console.error("[abstracts] insert error", dbError);
      return NextResponse.json(
        { error: "Impossible d'enregistrer votre abstract. Réessayez dans quelques minutes." },
        { status: 500 }
      );
    }
    // Le trigger SQL remplit `reference` (ABS-2026-001). Repli sur l'id
    // si le trigger n'est pas encore installé.
    reference =
      data.reference ||
      `ABS-${new Date(data.created_at).getFullYear()}-${String(data.id).slice(0, 6).toUpperCase()}`;
  } catch (err) {
    console.error("[abstracts] supabase unavailable", err);
    return NextResponse.json(
      { error: "Service temporairement indisponible. Réessayez dans quelques minutes." },
      { status: 503 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[abstracts] RESEND_API_KEY manquant — abstract enregistré sans email.");
    return NextResponse.json(
      {
        ok: true,
        reference,
        warning:
          "Abstract enregistré. L'accusé de réception par email n'a pas pu être envoyé, mais le comité scientifique a bien reçu votre soumission.",
      },
      { status: 201 }
    );
  }

  const resend = new Resend(apiKey);
  const safe = {
    auteur: escapeHtml(auteurPrincipal),
    email: escapeHtml(email),
    telephone: telephone ? escapeHtml(telephone) : "",
    coAuteurs: coAuteurs ? escapeHtml(coAuteurs) : "",
    etablissement: etablissement ? escapeHtml(etablissement) : "",
    titre: escapeHtml(titre),
    texte: escapeHtml(texte).replace(/\n/g, "<br/>"),
    motsCles: motsCles ? escapeHtml(motsCles) : "",
    typeLabel: TYPE_LABELS[type],
    evenement: escapeHtml(eventTitle),
    fileName: fileName ? escapeHtml(fileName) : "",
  };

  const header = `
    <div style="background:linear-gradient(135deg,#0B3D38 0%,#065E52 55%,#31B9AE 100%);padding:28px 32px;border-radius:16px 16px 0 0;text-align:center">
      <img src="cid:${LOGO_CID}" alt="SOBUP" width="72" height="72" style="display:inline-block;background:#fff;padding:8px;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.15)" />
      <p style="margin:14px 0 0;color:#fff;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;opacity:.85">Société Burkinabè de Pneumologie</p>
    </div>`;

  const footer = `
    <div style="padding:18px 24px;border-top:1px solid #e2e8f0;text-align:center;background:#f8fafc;border-radius:0 0 16px 16px">
      <p style="margin:0;font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94a3b8">SOBUP — Société Burkinabè de Pneumologie · Ouagadougou, Burkina Faso</p>
      <p style="margin:4px 0 0;font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94a3b8">Contact : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE;text-decoration:none">${SECRETARIAT}</a></p>
    </div>`;

  const row = (label: string, value: string, alt: boolean) =>
    `<tr${alt ? ` style="background:#f8fafc"` : ""}><td style="padding:10px 14px;color:#64748b;width:38%;border-top:1px solid #e2e8f0">${label}</td><td style="padding:10px 14px;color:#0f172a;border-top:1px solid #e2e8f0">${value}</td></tr>`;

  const comiteHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
      ${header}
      <div style="padding:28px 32px">
        <h2 style="margin:0 0 6px;color:#065E52;font-weight:800;font-size:20px">Nouvel abstract soumis</h2>
        <p style="margin:0 0 20px;color:#64748b;font-size:13px">Référence <strong style="color:#0f172a">${reference}</strong> · ${safe.evenement}</p>
        <div style="padding:16px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px;margin-bottom:18px">
          <p style="margin:0 0 4px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.12em">${safe.typeLabel}</p>
          <p style="margin:0;font-size:16px;font-weight:800;color:#0f172a;line-height:1.4">${safe.titre}</p>
        </div>
        <table style="width:100%;font-size:14px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
          ${row("Auteur principal", `<strong>${safe.auteur}</strong>`, true)}
          ${row("Email", `<a href="mailto:${safe.email}" style="color:#31B9AE">${safe.email}</a>`, false)}
          ${safe.telephone ? row("Téléphone", safe.telephone, true) : ""}
          ${safe.coAuteurs ? row("Co-auteurs", safe.coAuteurs, false) : ""}
          ${safe.etablissement ? row("Service / Établissement", safe.etablissement, true) : ""}
          ${safe.motsCles ? row("Mots clés", safe.motsCles, false) : ""}
          ${row("Nombre de mots", String(words), true)}
          ${safe.fileName ? row("Fichier joint", `<a href="${fileUrl}" style="color:#31B9AE">${safe.fileName}</a>`, false) : ""}
        </table>
        <div style="margin-top:18px;padding:16px;background:#f8fafc;border-left:3px solid #31B9AE;border-radius:6px">
          <p style="margin:0 0 8px;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.1em">Résumé</p>
          <p style="margin:0;font-size:13px;color:#334155;line-height:1.7;text-align:justify">${safe.texte}</p>
        </div>
        <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;line-height:1.6">Retrouvez cet abstract dans le portail d'administration, rubrique <strong>Abstracts</strong>, pour le classer et exporter la liste complète.</p>
      </div>
      ${footer}
    </div>`;

  const auteurHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
      ${header}
      <div style="padding:32px;text-align:center">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);line-height:56px;margin-bottom:16px">
          <span style="color:#fff;font-size:28px;font-weight:900">✓</span>
        </div>
        <h2 style="margin:0 0 8px;color:#0f172a;font-weight:800;font-size:22px">Abstract bien reçu</h2>
        <p style="margin:0;color:#64748b;font-size:14px">${safe.evenement}</p>
      </div>
      <div style="padding:0 32px 32px">
        <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Bonjour <strong>${safe.auteur}</strong>,</p>
        <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 18px">Le comité scientifique de la SOBUP confirme la réception de votre soumission. Conservez la référence ci-dessous pour tout échange avec le secrétariat.</p>
        <div style="margin:0 0 20px;padding:18px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px;text-align:center">
          <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.14em">Votre référence</p>
          <p style="margin:0;font-size:20px;font-weight:900;color:#0f172a;letter-spacing:.05em">${reference}</p>
        </div>
        <table style="width:100%;font-size:13px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
          ${row("Type", safe.typeLabel, true)}
          ${row("Titre", `<strong>${safe.titre}</strong>`, false)}
          ${safe.coAuteurs ? row("Co-auteurs", safe.coAuteurs, true) : ""}
          ${safe.fileName ? row("Fichier joint", safe.fileName, false) : ""}
        </table>
        <p style="color:#475569;line-height:1.7;font-size:14px;margin:20px 0 0">Votre travail va être évalué par le comité scientifique. Vous serez informé(e) par email de la décision après la clôture des soumissions. En cas d'acceptation, vous devrez être inscrit(e) à l'événement pour présenter votre travail.</p>
        <p style="color:#94a3b8;line-height:1.6;font-size:12px;margin:20px 0 0">Pour toute question, répondez directement à ce mail.</p>
      </div>
      ${footer}
    </div>`;

  const logoBase64 = await getLogoBase64().catch(() => null);
  const attachments = logoBase64
    ? [{ filename: "logo.png", content: logoBase64, contentId: LOGO_CID }]
    : undefined;

  try {
    const comiteResp = await resend.emails.send({
      from: FROM,
      to: SECRETARIAT,
      bcc: getBccList(),
      replyTo: email,
      subject: `Abstract ${TYPE_LABELS[type]} — ${auteurPrincipal} · ${reference}`,
      html: comiteHtml,
      attachments,
    });
    if (comiteResp.error) console.error("[abstracts] Resend comité refusé :", comiteResp.error);

    const auteurResp = await resend.emails.send({
      from: FROM,
      to: email,
      bcc: getBccList(),
      subject: `Accusé de réception — Abstract ${reference} · SOBUP`,
      html: auteurHtml,
      attachments,
    });
    if (auteurResp.error) {
      console.error("[abstracts] Resend auteur refusé :", auteurResp.error);
      return NextResponse.json(
        {
          ok: true,
          reference,
          warning:
            "Abstract enregistré, mais l'accusé de réception n'a pas pu être envoyé à votre adresse. Le comité scientifique a bien reçu votre soumission.",
        },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error("[abstracts] Resend error inattendue", err);
    return NextResponse.json(
      {
        ok: true,
        reference,
        warning: "Abstract enregistré, mais l'envoi des emails a échoué. Le comité y a bien accès.",
      },
      { status: 201 }
    );
  }

  return NextResponse.json({ ok: true, reference }, { status: 201 });
}
