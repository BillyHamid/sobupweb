import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { getBccList } from "@/lib/mail";
import { readFile } from "node:fs/promises";
import path from "node:path";

const FROM = process.env.RESEND_FROM ?? "SOBUP <onboarding@resend.dev>";
const SECRETARIAT = process.env.SOBUP_SECRETARIAT_EMAIL ?? "ouattarabillyhamid@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });

  const supabase = createAdminClient();

  // 1) Charger la demande
  const { data: request, error: reqErr } = await supabase
    .from("adhesion_requests")
    .select("*")
    .eq("id", id)
    .single();
  if (reqErr || !request) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }
  if (request.status === "approved") {
    return NextResponse.json({ error: "Cette demande est déjà validée." }, { status: 409 });
  }

  // 2) Créer le compte utilisateur dans Supabase Auth
  const password = generatePassword();
  const { data: userData, error: userErr } = await supabase.auth.admin.createUser({
    email: request.email,
    password,
    email_confirm: true,
    user_metadata: {
      prenom: request.prenom,
      nom: request.nom,
    },
  });
  if (userErr) {
    // Si l'utilisateur existe déjà, on récupère son ID pour ne pas bloquer
    if (userErr.message?.includes("already")) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email. Vérifiez en base." },
        { status: 409 }
      );
    }
    console.error("[admin/validate] createUser", userErr);
    return NextResponse.json({ error: "Erreur création du compte." }, { status: 500 });
  }
  const userId = userData.user.id;

  // 3) Créer le profil
  const currentYear = new Date().getFullYear();
  const { error: profileErr } = await supabase.from("profiles").insert({
    user_id: userId,
    prenom: request.prenom,
    nom: request.nom,
    telephone: request.telephone,
    specialite: request.specialite,
    etablissement: request.etablissement,
    ville: request.ville,
    cotisation_year: currentYear,
    cotisation_paid_at: new Date().toISOString().slice(0, 10),
  });
  if (profileErr) {
    console.warn("[admin/validate] profile insert", profileErr);
  }

  // 4) Marquer la demande comme validée et stocker le mot de passe (pour récupération admin)
  const { error: updateErr } = await supabase
    .from("adhesion_requests")
    .update({
      status: "approved",
      validated_at: new Date().toISOString(),
      validated_by: "bureau",
      generated_password: password,
    })
    .eq("id", id);
  if (updateErr) {
    console.error("[admin/validate] update adhesion_requests", updateErr);
    return NextResponse.json(
      { error: `Compte créé mais demande non mise à jour : ${updateErr.message}. Vérifiez que la colonne 'generated_password' existe (voir le SQL de migration).` },
      { status: 500 }
    );
  }

  // 5) Email avec les identifiants
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    const logoBase64 = await getLogoBase64();
    const attachments = logoBase64
      ? [{ filename: "logo.png", content: logoBase64, contentId: LOGO_CID }]
      : undefined;

    const html = `
      <div style="font-family:system-ui;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#0B3D38 0%,#065E52 55%,#31B9AE 100%);padding:24px;text-align:center">
          <img src="cid:${LOGO_CID}" alt="SOBUP" width="64" height="64" style="background:#fff;padding:6px;border-radius:50%"/>
          <p style="margin:10px 0 0;color:#fff;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase">Société Burkinabè de Pneumologie</p>
        </div>
        <div style="padding:32px;text-align:center">
          <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);line-height:56px;margin-bottom:14px">
            <span style="color:#fff;font-size:28px;font-weight:900">✓</span>
          </div>
          <h2 style="margin:0 0 6px;color:#0f172a;font-weight:800;font-size:22px">Bienvenue dans la SOBUP !</h2>
          <p style="margin:0;color:#64748b;font-size:14px">Votre adhésion est confirmée</p>
        </div>
        <div style="padding:0 32px 28px">
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Bonjour <strong>${request.prenom}</strong>,</p>
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 18px">Votre cotisation pour l'année ${currentYear} a été enregistrée. Voici vos identifiants de connexion à votre espace membre SOBUP :</p>
          <div style="margin:20px 0;padding:18px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Email</p>
            <p style="margin:0 0 14px;font-family:monospace;font-size:14px;color:#0f172a;font-weight:700">${request.email}</p>
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Mot de passe temporaire</p>
            <p style="margin:0;font-family:monospace;font-size:18px;color:#0f172a;font-weight:800;letter-spacing:.05em">${password}</p>
          </div>
          <div style="margin:24px 0;text-align:center">
            <a href="${SITE_URL}/espace-membre" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px">Me connecter à mon espace</a>
          </div>
          <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">🔒 Pour votre sécurité, changez ce mot de passe lors de votre première connexion. Pour toute question, contactez <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a>.</p>
        </div>
        <div style="padding:14px 24px;border-top:1px solid #e2e8f0;text-align:center;background:#f8fafc;border-radius:0 0 16px 16px">
          <p style="margin:0;font-size:11px;color:#94a3b8">SOBUP — Société Burkinabè de Pneumologie</p>
        </div>
      </div>`;

    try {
      await resend.emails.send({
        from: FROM,
        to: request.email,
        bcc: getBccList(),
        subject: "✓ Bienvenue dans la SOBUP — vos identifiants de connexion",
        html,
        attachments,
      });
    } catch (err) {
      console.warn("[admin/validate] Resend error", err);
    }
  }

  return NextResponse.json({ ok: true });
}
