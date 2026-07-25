import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getBccList } from "@/lib/mail";
import { readFile } from "node:fs/promises";
import path from "node:path";

type Body = {
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  specialite?: string;
  etablissement?: string;
  ville?: string;
  payment_method?: string;
  honeypot?: string;
};

const SECRETARIAT = process.env.SOBUP_SECRETARIAT_EMAIL ?? "ouattarabillyhamid@gmail.com";
const FROM = process.env.RESEND_FROM ?? "SOBUP <onboarding@resend.dev>";
const ADMIN_URL =
  process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
    : "http://localhost:3000/admin";
const LOGO_CID = "sobup-logo";

let logoCache: string | null = null;
async function getLogoBase64() {
  if (logoCache) return logoCache;
  try {
    const file = await readFile(path.join(process.cwd(), "public", "logo.png"));
    logoCache = file.toString("base64");
    return logoCache;
  } catch {
    return null;
  }
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

  if (body.honeypot && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const { prenom, nom, email, telephone, specialite, etablissement, ville, payment_method } = body;
  const required = { prenom, nom, email, telephone };
  const missing = Object.entries(required)
    .filter(([, v]) => !v || String(v).trim() === "")
    .map(([k]) => k);
  if (missing.length) {
    return NextResponse.json({ error: `Champs manquants : ${missing.join(", ")}` }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return NextResponse.json({ error: "Email invalide." }, { status: 422 });
  }

  // 1) Insertion dans Supabase
  let requestId: string | null = null;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("adhesion_requests")
      .insert({
        prenom: String(prenom).trim(),
        nom: String(nom).trim(),
        email: String(email).trim().toLowerCase(),
        telephone: String(telephone).trim(),
        specialite: specialite ? String(specialite).trim() : null,
        etablissement: etablissement ? String(etablissement).trim() : null,
        ville: ville ? String(ville).trim() : null,
        payment_method: payment_method ? String(payment_method).trim() : null,
        status: "pending",
      })
      .select("id")
      .single();
    if (error) throw error;
    requestId = data?.id ?? null;
  } catch (err) {
    console.error("[adhesion] Supabase insert error", err);
    return NextResponse.json(
      { error: "Impossible d'enregistrer votre demande. Réessayez dans quelques minutes." },
      { status: 500 }
    );
  }

  // 2) Emails (Resend) — non bloquant si pas de clé
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    const safe = {
      prenom: escapeHtml(String(prenom)),
      nom: escapeHtml(String(nom)),
      email: escapeHtml(String(email)),
      telephone: escapeHtml(String(telephone)),
      specialite: specialite ? escapeHtml(String(specialite)) : "—",
      etablissement: etablissement ? escapeHtml(String(etablissement)) : "—",
      ville: ville ? escapeHtml(String(ville)) : "—",
      payment_method: payment_method ? escapeHtml(String(payment_method)) : "—",
    };

    const logoBase64 = await getLogoBase64();
    const attachments = logoBase64
      ? [{ filename: "logo.png", content: logoBase64, contentId: LOGO_CID }]
      : undefined;

    const header = `<div style="background:linear-gradient(135deg,#0B3D38 0%,#065E52 55%,#31B9AE 100%);padding:24px;text-align:center;border-radius:16px 16px 0 0"><img src="cid:${LOGO_CID}" alt="SOBUP" width="64" height="64" style="background:#fff;padding:6px;border-radius:50%"/><p style="margin:10px 0 0;color:#fff;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase">Société Burkinabè de Pneumologie</p></div>`;

    const adminHtml = `
      <div style="font-family:system-ui;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        ${header}
        <div style="padding:24px">
          <h2 style="margin:0 0 6px;color:#065E52;font-weight:800;font-size:18px">🔔 Nouvelle demande d'adhésion</h2>
          <p style="margin:0 0 18px;color:#64748b;font-size:13px">À valider depuis le back-office</p>
          <table style="width:100%;font-size:13px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
            <tr style="background:#f8fafc"><td style="padding:10px;color:#64748b;width:35%">Nom complet</td><td style="padding:10px;font-weight:700;color:#0f172a">${safe.prenom} ${safe.nom}</td></tr>
            <tr><td style="padding:10px;color:#64748b;border-top:1px solid #e2e8f0">Email</td><td style="padding:10px;border-top:1px solid #e2e8f0"><a href="mailto:${safe.email}" style="color:#31B9AE">${safe.email}</a></td></tr>
            <tr style="background:#f8fafc"><td style="padding:10px;color:#64748b;border-top:1px solid #e2e8f0">Téléphone</td><td style="padding:10px;border-top:1px solid #e2e8f0">${safe.telephone}</td></tr>
            <tr><td style="padding:10px;color:#64748b;border-top:1px solid #e2e8f0">Spécialité</td><td style="padding:10px;border-top:1px solid #e2e8f0">${safe.specialite}</td></tr>
            <tr style="background:#f8fafc"><td style="padding:10px;color:#64748b;border-top:1px solid #e2e8f0">Établissement</td><td style="padding:10px;border-top:1px solid #e2e8f0">${safe.etablissement}</td></tr>
            <tr><td style="padding:10px;color:#64748b;border-top:1px solid #e2e8f0">Ville</td><td style="padding:10px;border-top:1px solid #e2e8f0">${safe.ville}</td></tr>
            <tr style="background:#f8fafc"><td style="padding:10px;color:#64748b;border-top:1px solid #e2e8f0">Mode de paiement</td><td style="padding:10px;border-top:1px solid #e2e8f0">${safe.payment_method}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center">
            <a href="${ADMIN_URL}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#e67e22 0%,#d35400 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px">Voir et valider →</a>
          </div>
          <p style="margin:18px 0 0;font-size:11px;color:#94a3b8;text-align:center">Vérifiez d'abord la preuve de paiement sur WhatsApp.</p>
        </div>
      </div>`;

    const userHtml = `
      <div style="font-family:system-ui;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        ${header}
        <div style="padding:32px;text-align:center">
          <div style="display:inline-block;width:52px;height:52px;border-radius:50%;background:#fff7ed;line-height:52px;margin-bottom:14px">
            <span style="font-size:24px">⏳</span>
          </div>
          <h2 style="margin:0 0 6px;color:#0f172a;font-weight:800;font-size:20px">Demande bien reçue</h2>
          <p style="margin:0;color:#64748b;font-size:14px">Adhésion à la SOBUP</p>
        </div>
        <div style="padding:0 32px 28px">
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Bonjour <strong>${safe.prenom}</strong>,</p>
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Nous avons bien reçu votre demande d'adhésion à la Société Burkinabè de Pneumologie.</p>
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">📌 <strong>Prochaine étape</strong> : envoyez la preuve de votre paiement (cotisation 30 000 XOF) au secrétariat sur WhatsApp <strong>+226 76 58 01 03</strong> si ce n'est pas déjà fait.</p>
          <div style="margin:20px 0;padding:14px;background:#fff7ed;border-left:3px solid #e67e22;border-radius:6px">
            <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6">Vos identifiants de connexion vous seront envoyés par email sous <strong>48h ouvrables</strong> après vérification de la preuve de paiement.</p>
          </div>
          <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">Pour toute question, vous pouvez répondre à ce mail ou contacter <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a>.</p>
        </div>
        <div style="padding:14px 24px;border-top:1px solid #e2e8f0;text-align:center;background:#f8fafc;border-radius:0 0 16px 16px">
          <p style="margin:0;font-size:11px;color:#94a3b8">SOBUP — Société Burkinabè de Pneumologie · Ouagadougou, Burkina Faso</p>
        </div>
      </div>`;

    try {
      await resend.emails.send({
        from: FROM,
        to: SECRETARIAT,
        bcc: getBccList(),
        replyTo: String(email),
        subject: `🔔 Nouvelle adhésion — ${safe.prenom} ${safe.nom}`,
        html: adminHtml,
        attachments,
      });
      await resend.emails.send({
        from: FROM,
        to: String(email),
        bcc: getBccList(),
        subject: "Demande d'adhésion bien reçue — SOBUP",
        html: userHtml,
        attachments,
      });
    } catch (err) {
      console.warn("[adhesion] Resend error (non-bloquant)", err);
    }
  }

  return NextResponse.json({ ok: true, id: requestId }, { status: 201 });
}
