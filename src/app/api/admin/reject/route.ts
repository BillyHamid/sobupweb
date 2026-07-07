import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const FROM = process.env.RESEND_FROM ?? "SOBUP <onboarding@resend.dev>";
const SECRETARIAT = process.env.SOBUP_SECRETARIAT_EMAIL ?? "ouattarabillyhamid@gmail.com";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id, reason } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "id requis." }, { status: 400 });
  const rejectionReason = (reason ?? "").toString().trim() || "Motif non précisé";

  const supabase = createAdminClient();
  const { data: request, error: reqErr } = await supabase
    .from("adhesion_requests")
    .select("*")
    .eq("id", id)
    .single();
  if (reqErr || !request) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }

  await supabase
    .from("adhesion_requests")
    .update({
      status: "rejected",
      rejection_reason: rejectionReason,
      validated_at: new Date().toISOString(),
      validated_by: "bureau",
    })
    .eq("id", id);

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const resend = new Resend(apiKey);
    try {
      await resend.emails.send({
        from: FROM,
        to: request.email,
        subject: "À propos de votre demande d'adhésion SOBUP",
        html: `<div style="font-family:system-ui;max-width:560px;margin:24px auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#0f172a;font-weight:800;margin:0 0 12px">Demande d'adhésion à clarifier</h2>
          <p style="color:#475569;line-height:1.6">Bonjour ${request.prenom},</p>
          <p style="color:#475569;line-height:1.6">Nous n'avons pas pu valider votre demande d'adhésion pour la raison suivante :</p>
          <p style="margin:16px 0;padding:14px;background:#fef2f2;border-left:3px solid #dc2626;border-radius:6px;color:#7f1d1d;font-style:italic">${rejectionReason}</p>
          <p style="color:#475569;line-height:1.6">N'hésitez pas à nous contacter pour clarifier la situation : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a> ou WhatsApp +226 62 47 58 01.</p>
          <p style="color:#94a3b8;font-size:12px;margin-top:18px">— Bureau SOBUP</p>
        </div>`,
      });
    } catch (err) {
      console.warn("[admin/reject] Resend error", err);
    }
  }

  return NextResponse.json({ ok: true });
}
