import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import {
  sendMail, escapeHtml, emailHeader, emailFooter, SECRETARIAT, SITE_URL,
} from "@/lib/mail";

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

/** GET /api/admin/members — liste tous les membres (profiles + auth.users) */
export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const supabase = createAdminClient();

  const [{ data: profiles, error: pErr }, { data: usersData, error: uErr }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.auth.admin.listUsers({ page: 1, perPage: 500 }),
  ]);

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
  if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });

  const usersById = new Map(usersData.users.map((u) => [u.id, u]));
  const members = (profiles ?? []).map((p) => {
    const u = usersById.get(p.user_id);
    return { ...p, email: u?.email ?? null, auth_created_at: u?.created_at ?? null };
  });

  return NextResponse.json({ members });
}

/** POST /api/admin/members — création manuelle d'un membre */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { prenom, nom, email, telephone, specialite, etablissement, ville, role, joined_at, notes, is_bureau } = body;

  if (!prenom || !nom || !email) {
    return NextResponse.json({ error: "Prénom, nom et email requis." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return NextResponse.json({ error: "Email invalide." }, { status: 422 });
  }

  const supabase = createAdminClient();
  const password = generatePassword();

  // Créer l'utilisateur Auth
  const { data: userData, error: uErr } = await supabase.auth.admin.createUser({
    email: String(email).trim().toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: { prenom, nom },
  });
  if (uErr) {
    if (uErr.message?.includes("already")) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
    }
    console.error("[members] createUser", uErr);
    return NextResponse.json({ error: "Erreur création du compte." }, { status: 500 });
  }

  const userId = userData.user.id;
  const currentYear = new Date().getFullYear();

  const { data: profile, error: pErr } = await supabase.from("profiles").insert({
    user_id: userId,
    prenom: String(prenom).trim(),
    nom: String(nom).trim(),
    telephone: telephone ? String(telephone).trim() : null,
    specialite: specialite || null,
    etablissement: etablissement || null,
    ville: ville || null,
    role: role || null,
    joined_at: joined_at || currentYear,
    notes: notes || null,
    is_bureau: !!is_bureau,
    cotisation_year: currentYear,
    cotisation_paid_at: new Date().toISOString().slice(0, 10),
    generated_password: password,
    status: "active",
  }).select("*").single();

  if (pErr) {
    console.warn("[members] profile insert", pErr);
    return NextResponse.json({ error: `Compte créé mais profil non enregistré : ${pErr.message}` }, { status: 500 });
  }

  // Email de bienvenue avec identifiants
  const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        ${emailHeader()}
        <div style="padding:32px">
          <h2 style="margin:0 0 12px;color:#0f172a;font-weight:800;font-size:22px">Bienvenue dans la SOBUP 🎉</h2>
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Bonjour <strong>${escapeHtml(String(prenom))}</strong>,</p>
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 18px">Le Bureau SOBUP vient de vous créer un compte sur la plateforme. Voici vos identifiants :</p>
          <div style="margin:20px 0;padding:18px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Email</p>
            <p style="margin:0 0 14px;font-family:monospace;font-size:14px;color:#0f172a;font-weight:700">${email}</p>
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Mot de passe temporaire</p>
            <p style="margin:0;font-family:monospace;font-size:18px;color:#0f172a;font-weight:800;letter-spacing:.05em">${password}</p>
          </div>
          <div style="margin:24px 0;text-align:center">
            <a href="${SITE_URL}/espace-membre" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px">Me connecter</a>
          </div>
          <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">🔒 Pour votre sécurité, changez ce mot de passe lors de votre première connexion. Contact : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a></p>
        </div>
        ${emailFooter()}
      </div>`;

  const mail = await sendMail(
    {
      to: String(email),
      replyTo: SECRETARIAT,
      subject: "🎉 Bienvenue dans la SOBUP — vos identifiants",
      html,
    },
    "members/bienvenue"
  );

  return NextResponse.json(
    {
      member: { ...profile, email },
      emailSent: mail.sent,
      // Sans email, le Bureau doit pouvoir transmettre le mot de passe lui-même.
      password: mail.sent ? undefined : password,
      warning: mail.sent
        ? undefined
        : `Membre créé, mais l'email d'identifiants n'a pas pu être envoyé (${mail.error}). Mot de passe à communiquer : ${password}`,
    },
    { status: 201 }
  );
}
