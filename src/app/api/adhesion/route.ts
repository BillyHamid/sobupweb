import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendMail, escapeHtml, emailHeader, emailFooter, SECRETARIAT,
} from "@/lib/mail";

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

const ADMIN_URL =
  process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/admin`
    : "http://localhost:3000/admin";

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

  // 2) Emails — la demande est déjà enregistrée, un échec d'envoi
  //    ne doit pas faire croire à l'utilisateur que rien n'a été reçu.
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

  const header = emailHeader();

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
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
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
        ${emailFooter()}
      </div>`;

  const [secResult, userResult] = await Promise.all([
    sendMail(
      {
        to: SECRETARIAT,
        replyTo: String(email),
        subject: `🔔 Nouvelle adhésion — ${safe.prenom} ${safe.nom}`,
        html: adminHtml,
      },
      "adhesion/secretariat"
    ),
    sendMail(
      {
        to: String(email),
        subject: "Demande d'adhésion bien reçue — SOBUP",
        html: userHtml,
      },
      "adhesion/demandeur"
    ),
  ]);

  // La demande est enregistrée : on renvoie un succès, mais on dit la vérité
  // sur l'email pour que le formulaire puisse afficher un avertissement.
  const warning = !userResult.sent
    ? "Votre demande est bien enregistrée, mais l'email de confirmation n'a pas pu vous être envoyé. Le secrétariat a été prévenu."
    : !secResult.sent
      ? "Votre demande est bien enregistrée. La notification interne n'a pas pu être envoyée, contactez le secrétariat si vous n'avez pas de retour sous 48h."
      : undefined;

  return NextResponse.json({ ok: true, id: requestId, warning }, { status: 201 });
}
