import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { sendMail, escapeHtml, emailLayout, SECRETARIAT } from "@/lib/mail";

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

  const { error: updateErr } = await supabase
    .from("adhesion_requests")
    .update({
      status: "rejected",
      rejection_reason: rejectionReason,
      validated_at: new Date().toISOString(),
      validated_by: "bureau",
    })
    .eq("id", id);
  if (updateErr) {
    console.error("[admin/reject] update adhesion_requests", updateErr);
    return NextResponse.json(
      { error: `Demande non mise à jour : ${updateErr.message}` },
      { status: 500 }
    );
  }

  const safeReason = escapeHtml(rejectionReason).replace(/\n/g, "<br/>");
  const html = emailLayout(`
    <div style="padding:32px 32px 8px;text-align:center">
      <h2 style="margin:0 0 6px;color:#0f172a;font-weight:800;font-size:20px">Demande d'adhésion à clarifier</h2>
      <p style="margin:0;color:#64748b;font-size:14px">Société Burkinabè de Pneumologie</p>
    </div>
    <div style="padding:16px 32px 28px">
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Bonjour <strong>${escapeHtml(request.prenom)}</strong>,</p>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Nous n'avons pas pu valider votre demande d'adhésion pour la raison suivante :</p>
      <div style="margin:16px 0;padding:14px;background:#fef2f2;border-left:3px solid #dc2626;border-radius:6px">
        <p style="margin:0;color:#7f1d1d;font-size:13px;line-height:1.6;font-style:italic">${safeReason}</p>
      </div>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">N'hésitez pas à nous contacter pour clarifier la situation : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a> ou WhatsApp <strong>+226 76 58 01 03</strong>.</p>
      <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">Vous pouvez répondre directement à ce mail.</p>
    </div>`);

  const mail = await sendMail(
    {
      to: request.email,
      replyTo: SECRETARIAT,
      subject: "À propos de votre demande d'adhésion SOBUP",
      html,
    },
    "reject"
  );

  return NextResponse.json({
    ok: true,
    emailSent: mail.sent,
    warning: mail.sent
      ? undefined
      : `Demande refusée, mais l'email n'a pas pu être envoyé au demandeur (${mail.error}).`,
  });
}
