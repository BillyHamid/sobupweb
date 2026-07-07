import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const FROM = process.env.RESEND_FROM ?? "SOBUP <onboarding@resend.dev>";
const SECRETARIAT = process.env.SOBUP_SECRETARIAT_EMAIL ?? "ouattarabillyhamid@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

  const newPassword = generatePassword();
  const { error: updErr } = await supabase.auth.admin.updateUserById(id, { password: newPassword });
  if (updErr) return NextResponse.json({ error: "Erreur mise à jour du mot de passe." }, { status: 500 });

  const { data: profile } = await supabase.from("profiles").select("prenom").eq("user_id", id).single();
  await supabase.from("profiles").update({ generated_password: newPassword }).eq("user_id", id);

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && user.email) {
    const resend = new Resend(apiKey);
    try {
      await resend.emails.send({
        from: FROM, to: user.email,
        subject: "🔑 Réinitialisation de votre mot de passe SOBUP",
        html: `<div style="font-family:system-ui;max-width:560px;margin:24px auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#065E52">🔑 Nouveau mot de passe</h2>
          <p style="color:#475569;line-height:1.6">Bonjour ${profile?.prenom ?? ""},</p>
          <p style="color:#475569;line-height:1.6">Le Bureau SOBUP a réinitialisé votre mot de passe. Vos nouveaux identifiants :</p>
          <div style="margin:16px 0;padding:16px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:10px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase">Email</p>
            <p style="margin:0 0 12px;font-family:monospace;font-size:14px;color:#0f172a;font-weight:700">${user.email}</p>
            <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase">Nouveau mot de passe</p>
            <p style="margin:0;font-family:monospace;font-size:18px;color:#0f172a;font-weight:800">${newPassword}</p>
          </div>
          <p style="text-align:center;margin:20px 0">
            <a href="${SITE_URL}/espace-membre" style="display:inline-block;padding:10px 24px;background:#31B9AE;color:#fff;text-decoration:none;border-radius:8px;font-weight:700">Me connecter</a>
          </p>
          <p style="color:#94a3b8;font-size:12px">🔒 L'ancien mot de passe ne fonctionne plus. Question ? <a href="mailto:${SECRETARIAT}">${SECRETARIAT}</a></p>
        </div>`,
      });
    } catch (err) { console.warn("[members/reset]", err); }
  }

  return NextResponse.json({ ok: true, newPassword });
}
