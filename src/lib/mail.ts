import { Resend } from "resend";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Couche d'envoi partagée par toutes les routes qui envoient des mails.
 *
 * Pourquoi ce fichier existe : le SDK Resend ne **lève pas** d'exception quand
 * l'API refuse un envoi — il résout avec `{ data: null, error }`. Un
 * `await resend.emails.send(...)` entouré d'un simple try/catch laisse donc
 * passer tous les refus en silence (domaine non vérifié, quota, adresse
 * invalide…). `sendMail` lit toujours `error` et le remonte.
 */

export const SECRETARIAT =
  process.env.SOBUP_SECRETARIAT_EMAIL ?? "ouattarabillyhamid@gmail.com";
export const FROM = process.env.RESEND_FROM ?? "SOBUP <onboarding@resend.dev>";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const LOGO_CID = "sobup-logo";

/**
 * Retourne la liste des adresses en copie cachée à ajouter à tous les mails.
 * Configurable via l'env `SOBUP_BCC_EMAILS` (virgules).
 * Retourne `undefined` si vide — évite les headers BCC inutiles.
 */
export function getBccList(): string[] | undefined {
  const raw = process.env.SOBUP_BCC_EMAILS;
  if (!raw) return undefined;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length > 0 ? list : undefined;
}

/** Logo inline (CID) — lu une seule fois pour tout le processus. */
let logoCache: string | null | undefined;
export async function getLogoBase64(): Promise<string | null> {
  if (logoCache !== undefined) return logoCache;
  try {
    const file = await readFile(path.join(process.cwd(), "public", "logo.png"));
    logoCache = file.toString("base64");
  } catch (err) {
    console.warn("[mail] logo.png illisible — mails envoyés sans logo.", err);
    logoCache = null;
  }
  return logoCache;
}

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ─── Gabarit visuel commun ─── */

export function emailHeader() {
  return `<div style="background:linear-gradient(135deg,#0B3D38 0%,#065E52 55%,#31B9AE 100%);padding:28px 32px;border-radius:16px 16px 0 0;text-align:center"><img src="cid:${LOGO_CID}" alt="SOBUP" width="72" height="72" style="display:inline-block;background:#fff;padding:8px;border-radius:50%;box-shadow:0 4px 12px rgba(0,0,0,.15)"/><p style="margin:14px 0 0;color:#fff;font-family:system-ui,-apple-system,sans-serif;font-size:11px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;opacity:.85">Société Burkinabè de Pneumologie</p></div>`;
}

export function emailFooter() {
  return `<div style="padding:18px 24px;border-top:1px solid #e2e8f0;text-align:center;background:#f8fafc;border-radius:0 0 16px 16px"><p style="margin:0;font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94a3b8">SOBUP — Société Burkinabè de Pneumologie · Ouagadougou, Burkina Faso</p><p style="margin:4px 0 0;font-family:system-ui,-apple-system,sans-serif;font-size:11px;color:#94a3b8">Contact : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE;text-decoration:none">${SECRETARIAT}</a></p></div>`;
}

/** Enveloppe un contenu dans la carte SOBUP (header + corps + footer). */
export function emailLayout(inner: string) {
  return `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">${emailHeader()}${inner}${emailFooter()}</div>`;
}

/* ─── Envoi ─── */

export type MailResult = { sent: boolean; id?: string; error?: string };

export type SendMailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  /** Ajoute les BCC configurés (défaut : oui). */
  bcc?: boolean;
  /** Joint le logo en CID pour que `emailHeader()` s'affiche (défaut : oui). */
  logo?: boolean;
};

/**
 * Envoie un mail et **remonte toujours l'échec**.
 * `context` sert de préfixe de log, ex. "adhesion" → `[mail:adhesion]`.
 */
export async function sendMail(
  opts: SendMailOptions,
  context: string
): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    const error = "RESEND_API_KEY absente — aucun mail envoyé.";
    console.error(`[mail:${context}] ${error}`);
    return { sent: false, error };
  }

  const attachments =
    opts.logo === false
      ? undefined
      : await getLogoBase64().then((b64) =>
          b64 ? [{ filename: "logo.png", content: b64, contentId: LOGO_CID }] : undefined
        );

  try {
    const resend = new Resend(apiKey);
    const resp = await resend.emails.send({
      from: FROM,
      to: opts.to,
      bcc: opts.bcc === false ? undefined : getBccList(),
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
      attachments,
    });

    // Le SDK ne throw pas : c'est ICI que se trouvent les vrais refus.
    if (resp.error) {
      const error = resp.error.message ?? String(resp.error);
      console.error(`[mail:${context}] refusé par Resend → ${error}`, {
        to: opts.to,
        from: FROM,
      });
      return { sent: false, error };
    }

    console.log(`[mail:${context}] envoyé à ${opts.to} · id=${resp.data?.id}`);
    return { sent: true, id: resp.data?.id };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[mail:${context}] exception réseau → ${error}`);
    return { sent: false, error };
  }
}
