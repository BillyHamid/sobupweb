import { NextResponse } from "next/server";
import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getBccList } from "@/lib/mail";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const SECRETARIAT = process.env.SOBUP_SECRETARIAT_EMAIL ?? "ouattarabillyhamid@gmail.com";
const FROM = process.env.RESEND_FROM ?? "SOBUP <onboarding@resend.dev>";
const LOGO_CID = "sobup-logo";

const STATUTS = ["soumis", "en_evaluation", "accepte", "refuse"] as const;
type Statut = (typeof STATUTS)[number];

const STATUT_LABELS: Record<Statut, string> = {
  soumis: "Soumis",
  en_evaluation: "En évaluation",
  accepte: "Accepté",
  refuse: "Refusé",
};

const TYPE_LABELS: Record<string, string> = {
  oral: "Communication orale",
  poster: "Poster",
};

let logoCache: string | null = null;
async function getLogoBase64() {
  if (logoCache) return logoCache;
  const file = await readFile(path.join(process.cwd(), "public", "logo.png"));
  logoCache = file.toString("base64");
  return logoCache;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

/** Email de décision envoyé à l'auteur — uniquement sur action explicite de l'admin. */
async function sendDecisionEmail(row: {
  email: string;
  auteur_principal: string;
  titre: string;
  type: string;
  event_title: string | null;
  status: Statut;
  review_note: string | null;
  reference: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY manquant" };

  const accepte = row.status === "accepte";
  const safe = {
    auteur: escapeHtml(row.auteur_principal),
    titre: escapeHtml(row.titre),
    type: escapeHtml(TYPE_LABELS[row.type] ?? row.type),
    evenement: escapeHtml(row.event_title ?? "l'événement SOBUP"),
    reference: row.reference ? escapeHtml(row.reference) : "",
    commentaire: row.review_note ? escapeHtml(row.review_note).replace(/\n/g, "<br/>") : "",
  };

  const header = `
    <div style="background:linear-gradient(135deg,#0B3D38 0%,#065E52 55%,#31B9AE 100%);padding:28px 32px;border-radius:16px 16px 0 0;text-align:center">
      <img src="cid:${LOGO_CID}" alt="SOBUP" width="72" height="72" style="display:inline-block;background:#fff;padding:8px;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.15)" />
      <p style="margin:14px 0 0;color:#fff;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;opacity:.85">Société Burkinabè de Pneumologie</p>
    </div>`;

  const footer = `
    <div style="padding:18px 24px;border-top:1px solid #e2e8f0;text-align:center;background:#f8fafc;border-radius:0 0 16px 16px">
      <p style="margin:0;font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94a3b8">SOBUP — Société Burkinabè de Pneumologie · Ouagadougou, Burkina Faso</p>
      <p style="margin:4px 0 0;font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94a3b8">Contact : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE;text-decoration:none">${SECRETARIAT}</a></p>
    </div>`;

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
      ${header}
      <div style="padding:32px;text-align:center">
        <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:${accepte ? "linear-gradient(135deg,#31B9AE 0%,#065E52 100%)" : "#94a3b8"};line-height:56px;margin-bottom:16px">
          <span style="color:#fff;font-size:26px;font-weight:900">${accepte ? "✓" : "!"}</span>
        </div>
        <h2 style="margin:0 0 8px;color:#0f172a;font-weight:800;font-size:22px">
          ${accepte ? "Votre abstract est accepté" : "Décision du comité scientifique"}
        </h2>
        <p style="margin:0;color:#64748b;font-size:14px">${safe.evenement}${safe.reference ? ` · Réf. ${safe.reference}` : ""}</p>
      </div>
      <div style="padding:0 32px 32px">
        <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Bonjour <strong>${safe.auteur}</strong>,</p>
        <div style="margin:0 0 18px;padding:16px;background:${accepte ? "#E8F9F7" : "#f8fafc"};border:1px solid ${accepte ? "#31B9AE40" : "#e2e8f0"};border-radius:12px">
          ${safe.type ? `<p style="margin:0 0 4px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.12em">${safe.type}</p>` : ""}
          <p style="margin:0;font-size:16px;font-weight:800;color:#0f172a;line-height:1.4">${safe.titre}</p>
        </div>
        ${
          accepte
            ? `<p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Le comité scientifique a le plaisir de vous informer que votre travail a été <strong style="color:#065E52">retenu</strong> pour ${safe.evenement}.</p>
               <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Pour présenter votre travail, vous devez être <strong>inscrit(e) à l'événement</strong>. Le secrétariat vous transmettra prochainement le créneau de présentation et les consignes de format.</p>`
            : `<p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Après examen attentif, le comité scientifique n'a pas retenu votre soumission pour cette édition. Le nombre de créneaux disponibles est limité et la sélection a été particulièrement compétitive.</p>
               <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Nous vous encourageons vivement à soumettre de nouveau lors des prochaines rencontres de la SOBUP.</p>`
        }
        ${
          safe.commentaire
            ? `<div style="margin:18px 0 0;padding:16px;background:#f8fafc;border-left:3px solid #31B9AE;border-radius:6px">
                 <p style="margin:0 0 8px;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.1em">Commentaire du comité</p>
                 <p style="margin:0;font-size:13px;color:#334155;line-height:1.7">${safe.commentaire}</p>
               </div>`
            : ""
        }
        <p style="color:#94a3b8;line-height:1.6;font-size:12px;margin:22px 0 0">Pour toute question, répondez directement à ce mail.</p>
      </div>
      ${footer}
    </div>`;

  const logoBase64 = await getLogoBase64().catch(() => null);
  const resend = new Resend(apiKey);
  const resp = await resend.emails.send({
    from: FROM,
    to: row.email,
    bcc: getBccList(),
    replyTo: SECRETARIAT,
    subject: accepte
      ? `Abstract accepté — ${row.titre.slice(0, 60)} · SOBUP`
      : `Décision du comité scientifique — SOBUP`,
    html,
    attachments: logoBase64
      ? [{ filename: "logo.png", content: logoBase64, contentId: LOGO_CID }]
      : undefined,
  });
  if (resp.error) {
    console.error("[abstracts] email décision refusé :", resp.error);
    return { sent: false, reason: resp.error.message };
  }
  return { sent: true };
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  const patch: Record<string, unknown> = {};
  if ("status" in body) {
    if (!STATUTS.includes(body.status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 422 });
    }
    patch.status = body.status;
    // Horodate la décision dès qu'elle est tranchée
    patch.reviewed_at =
      body.status === "accepte" || body.status === "refuse" ? new Date().toISOString() : null;
  }
  if ("review_note" in body) patch.review_note = body.review_note || null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Rien à modifier." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("abstracts")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Abstract introuvable." }, { status: 500 });
  }

  // Email de décision seulement si l'admin l'a explicitement demandé
  let emailWarning: string | undefined;
  if (body.notify === true && (data.status === "accepte" || data.status === "refuse")) {
    try {
      const res = await sendDecisionEmail(data);
      if (!res.sent) emailWarning = `Statut enregistré, mais l'email n'a pas été envoyé (${res.reason}).`;
    } catch (err) {
      console.error("[abstracts] email décision erreur", err);
      emailWarning = "Statut enregistré, mais l'envoi de l'email a échoué.";
    }
  }

  return NextResponse.json({
    abstract: data,
    statutLabel: STATUT_LABELS[data.status as Statut],
    warning: emailWarning,
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { id } = await ctx.params;
  const supabase = createAdminClient();

  // Nettoie le fichier joint dans le Storage avant de supprimer la ligne
  const { data: row } = await supabase.from("abstracts").select("file_url").eq("id", id).single();
  if (row?.file_url) {
    const key = String(row.file_url).split("/abstracts/").pop();
    if (key) await supabase.storage.from("abstracts").remove([decodeURIComponent(key)]);
  }

  const { error } = await supabase.from("abstracts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
