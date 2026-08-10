import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { emailHeader, emailFooter, emailLayout, LOGO_CID, SECRETARIAT, SITE_URL } from "@/lib/mail";

/**
 * Aperçu des mails transactionnels, pour relire la mise en page sans
 * déclencher d'envoi réel. Réservé aux admins connectés.
 * Le logo est inline en CID dans les vrais mails : ici on le remplace par
 * l'URL publique pour que le navigateur l'affiche.
 */

const SAMPLE = {
  prenom: "Aminata",
  nom: "Ouédraogo",
  email: "aminata.ouedraogo@example.bf",
  password: "Kf7mQx2ParZ9",
  annee: new Date().getFullYear(),
  motif: "Preuve de paiement non reçue après deux relances.",
};

function adhesionRecue() {
  return `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
    ${emailHeader()}
    <div style="padding:32px;text-align:center">
      <div style="display:inline-block;width:52px;height:52px;border-radius:50%;background:#fff7ed;line-height:52px;margin-bottom:14px"><span style="font-size:24px">⏳</span></div>
      <h2 style="margin:0 0 6px;color:#0f172a;font-weight:800;font-size:20px">Demande bien reçue</h2>
      <p style="margin:0;color:#64748b;font-size:14px">Adhésion à la SOBUP</p>
    </div>
    <div style="padding:0 32px 28px">
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Bonjour <strong>${SAMPLE.prenom}</strong>,</p>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Nous avons bien reçu votre demande d'adhésion à la Société Burkinabè de Pneumologie.</p>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">📌 <strong>Prochaine étape</strong> : envoyez la preuve de votre paiement (cotisation 30 000 XOF) au secrétariat sur WhatsApp <strong>+226 76 58 01 03</strong> si ce n'est pas déjà fait.</p>
      <div style="margin:20px 0;padding:14px;background:#fff7ed;border-left:3px solid #e67e22;border-radius:6px">
        <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6">Vos identifiants de connexion vous seront envoyés par email sous <strong>48h ouvrables</strong> après vérification de la preuve de paiement.</p>
      </div>
      <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">Pour toute question, vous pouvez répondre à ce mail ou contacter <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a>.</p>
    </div>
    ${emailFooter()}
  </div>`;
}

function identifiants() {
  return `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
    ${emailHeader()}
    <div style="padding:32px;text-align:center">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);line-height:56px;margin-bottom:14px"><span style="color:#fff;font-size:28px;font-weight:900">✓</span></div>
      <h2 style="margin:0 0 6px;color:#0f172a;font-weight:800;font-size:22px">Bienvenue dans la SOBUP !</h2>
      <p style="margin:0;color:#64748b;font-size:14px">Votre adhésion est confirmée</p>
    </div>
    <div style="padding:0 32px 28px">
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 14px">Bonjour <strong>${SAMPLE.prenom}</strong>,</p>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 18px">Votre cotisation pour l'année ${SAMPLE.annee} a été enregistrée. Voici vos identifiants de connexion à votre espace membre SOBUP :</p>
      <div style="margin:20px 0;padding:18px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px">
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Email</p>
        <p style="margin:0 0 14px;font-family:monospace;font-size:14px;color:#0f172a;font-weight:700">${SAMPLE.email}</p>
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Mot de passe temporaire</p>
        <p style="margin:0;font-family:monospace;font-size:18px;color:#0f172a;font-weight:800;letter-spacing:.05em">${SAMPLE.password}</p>
      </div>
      <div style="margin:24px 0;text-align:center">
        <a href="${SITE_URL}/espace-membre" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px">Me connecter à mon espace</a>
      </div>
      <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">🔒 Pour votre sécurité, changez ce mot de passe lors de votre première connexion. Pour toute question, contactez <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a>.</p>
    </div>
    ${emailFooter()}
  </div>`;
}

function refus() {
  return emailLayout(`
    <div style="padding:32px 32px 8px;text-align:center">
      <h2 style="margin:0 0 6px;color:#0f172a;font-weight:800;font-size:20px">Demande d'adhésion à clarifier</h2>
      <p style="margin:0;color:#64748b;font-size:14px">Société Burkinabè de Pneumologie</p>
    </div>
    <div style="padding:16px 32px 28px">
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Bonjour <strong>${SAMPLE.prenom}</strong>,</p>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Nous n'avons pas pu valider votre demande d'adhésion pour la raison suivante :</p>
      <div style="margin:16px 0;padding:14px;background:#fef2f2;border-left:3px solid #dc2626;border-radius:6px">
        <p style="margin:0;color:#7f1d1d;font-size:13px;line-height:1.6;font-style:italic">${SAMPLE.motif}</p>
      </div>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">N'hésitez pas à nous contacter pour clarifier la situation : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a> ou WhatsApp <strong>+226 76 58 01 03</strong>.</p>
    </div>`);
}

function motDePasse() {
  return emailLayout(`
    <div style="padding:32px 32px 8px;text-align:center">
      <h2 style="margin:0 0 6px;color:#0f172a;font-weight:800;font-size:20px">🔑 Nouveau mot de passe</h2>
      <p style="margin:0;color:#64748b;font-size:14px">Espace membre SOBUP</p>
    </div>
    <div style="padding:16px 32px 28px">
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 12px">Bonjour <strong>${SAMPLE.prenom}</strong>,</p>
      <p style="color:#475569;line-height:1.7;font-size:14px;margin:0 0 18px">Le Bureau SOBUP a réinitialisé votre mot de passe. Voici vos nouveaux identifiants :</p>
      <div style="margin:20px 0;padding:18px;background:#E8F9F7;border:1px solid #31B9AE40;border-radius:12px">
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Email</p>
        <p style="margin:0 0 14px;font-family:monospace;font-size:14px;color:#0f172a;font-weight:700">${SAMPLE.email}</p>
        <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#065E52;text-transform:uppercase;letter-spacing:.1em">Nouveau mot de passe</p>
        <p style="margin:0;font-family:monospace;font-size:18px;color:#0f172a;font-weight:800;letter-spacing:.05em">${SAMPLE.password}</p>
      </div>
      <div style="margin:24px 0;text-align:center">
        <a href="${SITE_URL}/espace-membre" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#31B9AE 0%,#065E52 100%);color:#fff;text-decoration:none;border-radius:10px;font-weight:800;font-size:14px">Me connecter</a>
      </div>
      <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin:18px 0 0">🔒 L'ancien mot de passe ne fonctionne plus. Pour toute question : <a href="mailto:${SECRETARIAT}" style="color:#31B9AE">${SECRETARIAT}</a>.</p>
    </div>`);
}

const TEMPLATES: Record<string, { label: string; html: () => string }> = {
  "adhesion-recue": { label: "1. Demande d'adhésion reçue (au demandeur)", html: adhesionRecue },
  identifiants: { label: "2. Adhésion validée — identifiants (au membre)", html: identifiants },
  refus: { label: "3. Adhésion refusée (au demandeur)", html: refus },
  "mot-de-passe": { label: "4. Réinitialisation du mot de passe (au membre)", html: motDePasse },
};

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const which = new URL(req.url).searchParams.get("t");
  const nav = Object.entries(TEMPLATES)
    .map(
      ([k, v]) =>
        `<a href="?t=${k}" style="display:block;padding:8px 12px;border-radius:8px;text-decoration:none;font:600 13px system-ui;color:${
          k === which ? "#fff" : "#334155"
        };background:${k === which ? "#065E52" : "#fff"};border:1px solid #e2e8f0;margin-bottom:6px">${v.label}</a>`
    )
    .join("");

  const body = which && TEMPLATES[which]
    ? TEMPLATES[which].html().replaceAll(`cid:${LOGO_CID}`, "/logo.png")
    : `<p style="font:14px system-ui;color:#64748b;padding:24px">Choisissez un modèle à gauche.</p>`;

  const page = `<!doctype html><html lang="fr"><head><meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Aperçu des mails SOBUP</title></head>
    <body style="margin:0;background:#f1f5f9">
      <div style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:16px;padding:16px">
        <div style="flex:0 0 300px;min-width:260px">
          <p style="font:800 11px system-ui;letter-spacing:.14em;text-transform:uppercase;color:#94a3b8;margin:0 0 10px">Mails du processus d'adhésion</p>
          ${nav}
          <p style="font:12px system-ui;color:#94a3b8;line-height:1.6;margin-top:14px">Aperçu seulement — aucun envoi n'est déclenché depuis cette page.</p>
        </div>
        <div style="flex:1 1 620px;min-width:320px">${body}</div>
      </div>
    </body></html>`;

  return new NextResponse(page, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
