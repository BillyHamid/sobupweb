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

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });

  const supabase = createAdminClient();

  // Récupérer la demande
  const { data: request, error: reqErr } = await supabase
    .from("adhesion_requests")
    .select("*")
    .eq("id", id)
    .single();
  if (reqErr || !request) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }
  if (request.status !== "approved") {
    return NextResponse.json({ error: "Cette demande n'est pas validée." }, { status: 400 });
  }

  // Trouver l'utilisateur Supabase Auth par email
  const { data: usersList, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    return NextResponse.json({ error: "Erreur lecture des comptes." }, { status: 500 });
  }
  const user = usersList.users.find((u) => u.email?.toLowerCase() === request.email.toLowerCase());
  if (!user) {
    return NextResponse.json({ error: "Aucun compte trouvé pour cet email." }, { status: 404 });
  }

  // Générer un nouveau mot de passe et mettre à jour
  const newPassword = generatePassword();
  const { error: updErr } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });
  if (updErr) {
    return NextResponse.json({ error: "Erreur mise à jour du mot de passe." }, { status: 500 });
  }

  // Mémoriser le mot de passe pour la récupération par l'admin.
  // La colonne peut manquer selon l'état des migrations : on continue quand
  // même, l'envoi du mot de passe au membre est l'essentiel.
  let passwordStored = true;
  const { error: traceErr } = await supabase
    .from("adhesion_requests")
    .update({ generated_password: newPassword })
    .eq("id", id);
  if (traceErr) {
    passwordStored = false;
    console.warn("[admin/reset-password] mot de passe non mémorisé :", traceErr.message);
  }

  const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        ${emailHeader()}
        <div style="padding:32px">
          <h2 style="margin:0 0 12px;color:#0f172a;font-weight:800;font-size:20px">🔑 Nouveau mot de passe</h2>
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Bonjour <strong>${escapeHtml(request.prenom)}</strong>,</p>
          <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 18px">Le Bureau SOBUP a réinitialisé votre mot de passe. Voici vos nouveaux identifiants :</p>
          <div style="margin:20px 0;padding:18px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Email</p>
            <p style="margin:0 0 14px;font-family:monospace;font-size:14px;color:#0f172a;font-weight:700">${request.email}</p>
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Nouveau mot de passe</p>
            <p style="margin:0;font-family:monospace;font-size:18px;color:#0f172a;font-weight:800;letter-spacing:.05em">${newPassword}</p>
          </div>
          <div style="margin:24px 0;text-align:center">
            <a href="${SITE_URL}/espace-membre" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px">Me connecter</a>
          </div>
          <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">🔒 L'ancien mot de passe ne fonctionne plus. Pour toute question : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a>.</p>
        </div>
        ${emailFooter()}
      </div>`;

  const mail = await sendMail(
    {
      to: request.email,
      replyTo: SECRETARIAT,
      subject: "🔑 Réinitialisation de votre mot de passe SOBUP",
      html,
    },
    "reset-password"
  );

  const warnings: string[] = [];
  if (!mail.sent) {
    warnings.push(`L'email n'a pas pu être envoyé au membre (${mail.error}) — communiquez-lui le mot de passe ci-dessus.`);
  }
  if (!passwordStored) {
    warnings.push("Mot de passe non mémorisé pour la récupération admin — lancez la migration SQL.");
  }

  // `newPassword` était déjà renvoyé : le Bureau l'affiche dans le back-office.
  return NextResponse.json({
    ok: true,
    newPassword,
    emailSent: mail.sent,
    warning: warnings.length ? warnings.join(" ") : undefined,
  });
}
