import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";

type Body = {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  fonction?: string;
  specialite?: string;
  estEHU?: "oui" | "non" | "";
  grade?: string;
  lieuExercice?: string;
  motivation?: string;
  honeypot?: string;
};

const SECRETARIAT = process.env.SOBUP_SECRETARIAT_EMAIL ?? "ouattarabillyhamid@gmail.com";
const FROM = process.env.RESEND_FROM ?? "SOBUP <onboarding@resend.dev>";
const LOGO_CID = "sobup-logo";

let logoCache: string | null = null;
async function getLogoBase64() {
  if (logoCache) return logoCache;
  const file = await readFile(path.join(process.cwd(), "public", "logo.png"));
  logoCache = file.toString("base64");
  return logoCache;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  // Honeypot anti-bot — si rempli, on simule un succès silencieux
  if (body.honeypot && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const {
    prenom, nom, email, telephone,
    fonction, specialite, estEHU, grade, lieuExercice, motivation,
  } = body;
  const required = { prenom, nom, email, telephone, fonction, estEHU, lieuExercice, motivation };
  const missing = Object.entries(required)
    .filter(([, v]) => !v || String(v).trim() === "")
    .map(([k]) => k);
  if (missing.length) {
    return NextResponse.json({ error: `Champs manquants : ${missing.join(", ")}` }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return NextResponse.json({ error: "Email invalide." }, { status: 422 });
  }
  if (fonction === "Médecin spécialiste" && (!specialite || String(specialite).trim() === "")) {
    return NextResponse.json({ error: "Spécialité requise." }, { status: 422 });
  }
  if (estEHU === "oui" && (!grade || String(grade).trim() === "")) {
    return NextResponse.json({ error: "Grade requis." }, { status: 422 });
  }
  if (String(motivation).trim().length < 20) {
    return NextResponse.json({ error: "Motivation : 20 caractères minimum." }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[inscriptions] RESEND_API_KEY manquant — pas d'envoi de mail. Payload :", body);
    return NextResponse.json(
      {
        error:
          "Service d'inscription temporairement indisponible. Merci de réessayer plus tard ou de nous contacter par email.",
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);
  const safe = {
    prenom: escapeHtml(String(prenom)),
    nom: escapeHtml(String(nom)),
    email: escapeHtml(String(email)),
    telephone: escapeHtml(String(telephone)),
    fonction: escapeHtml(String(fonction)),
    specialite: specialite ? escapeHtml(String(specialite)) : "",
    estEHU: estEHU === "oui" ? "Oui" : "Non",
    grade: grade ? escapeHtml(String(grade)) : "",
    lieuExercice: escapeHtml(String(lieuExercice)),
    motivation: escapeHtml(String(motivation)).replace(/\n/g, "<br/>"),
  };

  const header = `
    <div style="background:linear-gradient(135deg,#0B3D38 0%,#065E52 55%,#31B9AE 100%);padding:28px 32px;border-radius:16px 16px 0 0;text-align:center">
      <img src="cid:${LOGO_CID}" alt="SOBUP" width="72" height="72" style="display:inline-block;background:#fff;padding:8px;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.15)" />
      <p style="margin:14px 0 0;color:#fff;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;opacity:.85">Société Burkinabè de Pneumologie</p>
    </div>
  `;

  const footer = `
    <div style="padding:18px 24px;border-top:1px solid #e2e8f0;text-align:center;background:#f8fafc;border-radius:0 0 16px 16px">
      <p style="margin:0;font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94a3b8">SOBUP — Société Burkinabè de Pneumologie · Ouagadougou, Burkina Faso</p>
      <p style="margin:4px 0 0;font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94a3b8">Contact : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE;text-decoration:none">${SECRETARIAT}</a></p>
    </div>
  `;

  const secretariatHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
      ${header}
      <div style="padding:28px 32px">
        <h2 style="margin:0 0 8px;color:#065E52;font-weight:800;font-size:20px">Nouvelle inscription reçue</h2>
        <p style="margin:0 0 20px;color:#64748b;font-size:14px">Journée Scientifique Régionale · 19 – 21 Nov 2026 · Koudougou</p>
        <table style="width:100%;font-size:14px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
          <tr style="background:#f8fafc"><td style="padding:10px 14px;color:#64748b;width:38%">Prénom & Nom</td><td style="padding:10px 14px;font-weight:600;color:#0f172a">${safe.prenom} ${safe.nom}</td></tr>
          <tr><td style="padding:10px 14px;color:#64748b;border-top:1px solid #e2e8f0">Email</td><td style="padding:10px 14px;border-top:1px solid #e2e8f0"><a href="mailto:${safe.email}" style="color:#31B9AE">${safe.email}</a></td></tr>
          <tr style="background:#f8fafc"><td style="padding:10px 14px;color:#64748b;border-top:1px solid #e2e8f0">Téléphone</td><td style="padding:10px 14px;color:#0f172a;border-top:1px solid #e2e8f0">${safe.telephone}</td></tr>
          <tr><td style="padding:10px 14px;color:#64748b;border-top:1px solid #e2e8f0">Fonction</td><td style="padding:10px 14px;color:#0f172a;border-top:1px solid #e2e8f0;font-weight:600">${safe.fonction}</td></tr>
          ${safe.specialite ? `<tr style="background:#f8fafc"><td style="padding:10px 14px;color:#64748b;border-top:1px solid #e2e8f0">Spécialité</td><td style="padding:10px 14px;color:#0f172a;border-top:1px solid #e2e8f0">${safe.specialite}</td></tr>` : ""}
          <tr${safe.specialite ? "" : ` style="background:#f8fafc"`}><td style="padding:10px 14px;color:#64748b;border-top:1px solid #e2e8f0">Enseignant HU</td><td style="padding:10px 14px;color:#0f172a;border-top:1px solid #e2e8f0">${safe.estEHU}</td></tr>
          ${safe.grade ? `<tr${safe.specialite ? ` style="background:#f8fafc"` : ""}><td style="padding:10px 14px;color:#64748b;border-top:1px solid #e2e8f0">Grade</td><td style="padding:10px 14px;color:#0f172a;border-top:1px solid #e2e8f0">${safe.grade}</td></tr>` : ""}
          <tr><td style="padding:10px 14px;color:#64748b;border-top:1px solid #e2e8f0">Lieu d'exercice</td><td style="padding:10px 14px;color:#0f172a;border-top:1px solid #e2e8f0">${safe.lieuExercice}</td></tr>
        </table>
        <div style="margin-top:18px;padding:14px;background:#f8fafc;border-left:3px solid #31B9AE;border-radius:6px">
          <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.1em">Motivation</p>
          <p style="margin:0;font-size:13px;color:#334155;line-height:1.6;font-style:italic">${safe.motivation}</p>
        </div>
        <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;line-height:1.6">Vous pouvez répondre directement à ce mail pour contacter l'inscrit.</p>
      </div>
      ${footer}
    </div>
  `;

  const confirmationHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
      ${header}
      <div style="padding:32px;text-align:center">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);line-height:56px;margin-bottom:16px">
          <span style="color:#fff;font-size:28px;font-weight:900">✓</span>
        </div>
        <h2 style="margin:0 0 8px;color:#0f172a;font-weight:800;font-size:22px">Inscription confirmée</h2>
        <p style="margin:0 0 24px;color:#64748b;font-size:14px">1ère Journée Scientifique Régionale</p>
      </div>
      <div style="padding:0 32px 32px">
        <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Bonjour <strong>${safe.prenom}</strong>,</p>
        <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Nous avons bien reçu votre inscription à la <strong style="color:#065E52">1ère Journée Scientifique Régionale</strong> de la SOBUP.</p>

        <div style="margin:24px 0;padding:18px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px">
          <table style="width:100%;font-size:13px">
            <tr>
              <td style="padding:6px 0;color:#065E52;font-weight:800;width:30%">📅 Dates</td>
              <td style="padding:6px 0;color:#0f172a;font-weight:600">19 – 21 Novembre 2026</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#065E52;font-weight:800">📍 Lieu</td>
              <td style="padding:6px 0;color:#0f172a;font-weight:600">Koudougou, Burkina Faso</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#065E52;font-weight:800">🎯 Format</td>
              <td style="padding:6px 0;color:#0f172a;font-weight:600">Présentiel</td>
            </tr>
          </table>
        </div>

        <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Le secrétariat de la SOBUP vous recontactera prochainement avec le <strong>programme détaillé</strong> et les <strong>modalités pratiques</strong>.</p>
        <p style="color:#94a3b8;line-height:1.6;font-size:12px;margin:24px 0 0">Pour toute question, vous pouvez répondre directement à ce mail ou contacter le secrétariat.</p>
      </div>
      ${footer}
    </div>
  `;

  const logoBase64 = await getLogoBase64().catch(() => null);
  const attachments = logoBase64
    ? [{
        filename: "logo.png",
        content: logoBase64,
        contentId: LOGO_CID,
      }]
    : undefined;

  try {
    // Mail au secrétariat
    const secResp = await resend.emails.send({
      from: FROM,
      to: SECRETARIAT,
      replyTo: String(email),
      subject: `Inscription Journée Régionale — ${safe.prenom} ${safe.nom}`,
      html: secretariatHtml,
      attachments,
    });
    if (secResp.error) {
      console.error("[inscriptions] Resend secrétariat refusé :", secResp.error);
    } else {
      console.log("[inscriptions] Mail secrétariat envoyé · id =", secResp.data?.id);
    }

    // Mail de confirmation à l'inscrit
    const confResp = await resend.emails.send({
      from: FROM,
      to: String(email),
      subject: "Confirmation — 1ère Journée Scientifique Régionale SOBUP",
      html: confirmationHtml,
      attachments,
    });
    if (confResp.error) {
      console.error("[inscriptions] Resend confirmation refusée :", confResp.error);
      return NextResponse.json(
        {
          ok: true,
          warning:
            "Inscription enregistrée, mais l'email de confirmation n'a pas pu être envoyé à votre adresse (limitation Resend en mode test : seul l'email du compte Resend est autorisé tant que le domaine n'est pas vérifié).",
        },
        { status: 201 }
      );
    }
    console.log("[inscriptions] Mail inscrit envoyé · id =", confResp.data?.id);
  } catch (err) {
    console.error("[inscriptions] Resend error inattendue", err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi. Merci de réessayer dans quelques minutes." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
