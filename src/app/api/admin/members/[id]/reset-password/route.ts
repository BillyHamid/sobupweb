import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { sendMail, escapeHtml, emailLayout, SECRETARIAT, SITE_URL } from "@/lib/mail";

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = createAdminClient();

  const { data: userData, error: uErr } = await supabase.auth.admin.getUserById(id);
  if (uErr || !userData?.user) {
    return NextResponse.json({ error: "Compte introuvable." }, { status: 404 });
  }
  const user = userData.user;
  if (!user.email) {
    return NextResponse.json(
      { error: "Ce compte n'a pas d'adresse email — impossible d'envoyer le mot de passe." },
      { status: 422 }
    );
  }

  const newPassword = generatePassword();
  const { error: updErr } = await supabase.auth.admin.updateUserById(id, { password: newPassword });
  if (updErr) {
    console.error("[members/reset] updateUserById", updErr);
    return NextResponse.json({ error: "Erreur mise à jour du mot de passe." }, { status: 500 });
  }

  const { data: profile } = await supabase
    .from("profiles").select("prenom").eq("user_id", id).single();

  // Mémorisation pour la récupération par l'admin — non bloquant.
  const { error: traceErr } = await supabase
    .from("profiles").update({ generated_password: newPassword }).eq("user_id", id);
  if (traceErr) {
    console.warn("[members/reset] mot de passe non mémorisé :", traceErr.message);
  }

  const html = emailLayout(`
    <div style="padding:32px 32px 8px;text-align:center">
      <h2 style="margin:0 0 6px;color:#0f172a;font-weight:800;font-size:20px">🔑 Nouveau mot de passe</h2>
      <p style="margin:0;color:#64748b;font-size:14px">Espace membre SOBUP</p>
    </div>
    <div style="padding:16px 32px 28px">
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Bonjour <strong>${escapeHtml(profile?.prenom ?? "")}</strong>,</p>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 18px">Le Bureau SOBUP a réinitialisé votre mot de passe. Voici vos nouveaux identifiants :</p>
      <div style="margin:20px 0;padding:18px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px">
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Email</p>
        <p style="margin:0 0 14px;font-family:monospace;font-size:14px;color:#0f172a;font-weight:700">${escapeHtml(user.email)}</p>
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Nouveau mot de passe</p>
        <p style="margin:0;font-family:monospace;font-size:18px;color:#0f172a;font-weight:800;letter-spacing:.05em">${newPassword}</p>
      </div>
      <div style="margin:24px 0;text-align:center">
        <a href="${SITE_URL}/espace-membre" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px">Me connecter</a>
      </div>
      <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">🔒 L'ancien mot de passe ne fonctionne plus. Pour toute question : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a>.</p>
    </div>`);

  const mail = await sendMail(
    {
      to: user.email,
      replyTo: SECRETARIAT,
      subject: "🔑 Réinitialisation de votre mot de passe SOBUP",
      html,
    },
    "members/reset"
  );

  return NextResponse.json({
    ok: true,
    newPassword,
    emailSent: mail.sent,
    warning: mail.sent
      ? undefined
      : `Mot de passe réinitialisé, mais l'email n'a pas pu être envoyé (${mail.error}) — communiquez-le au membre.`,
  });
}
