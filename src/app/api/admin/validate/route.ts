import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { sendMail, emailHeader, emailFooter, SECRETARIAT, SITE_URL } from "@/lib/mail";

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

  let userId: string;
  /** true = le compte préexistait, on l'a repris (on ne devra pas le supprimer). */
  let adopted = false;

  if (userErr) {
    if (/already|exists|registered|duplicate/i.test(userErr.message ?? "")) {
      /**
       * Un compte existe déjà pour cet email. C'est le cas typique d'une
       * validation précédente interrompue : le compte avait été créé, puis
       * l'étape suivante a échoué avant l'envoi des identifiants. On reprend
       * ce compte et on lui attribue un nouveau mot de passe, au lieu de
       * bloquer le Bureau avec une erreur 409.
       */
      const { data: list, error: listErr } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      const existing = list?.users.find(
        (u) => u.email?.toLowerCase() === String(request.email).toLowerCase()
      );
      if (listErr || !existing) {
        console.error("[admin/validate] compte existant introuvable", listErr);
        return NextResponse.json(
          { error: "Un compte existe déjà avec cet email mais reste introuvable. Vérifiez dans Supabase." },
          { status: 409 }
        );
      }
      const { error: pwdErr } = await supabase.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      if (pwdErr) {
        console.error("[admin/validate] reprise du compte", pwdErr);
        return NextResponse.json(
          { error: `Compte existant non réutilisable : ${pwdErr.message}` },
          { status: 500 }
        );
      }
      userId = existing.id;
      adopted = true;
      console.log("[admin/validate] compte existant repris pour", request.email);
    } else {
      console.error("[admin/validate] createUser", userErr);
      return NextResponse.json({ error: `Erreur création du compte : ${userErr.message}` }, { status: 500 });
    }
  } else {
    userId = userData.user.id;
  }

  /**
   * Si la suite échoue sur un compte qu'on vient de créer, on le supprime :
   * sans ça toute nouvelle tentative repartirait sur un état incohérent.
   * Un compte repris (`adopted`) préexistait au Bureau — on n'y touche pas.
   */
  async function rollbackUser() {
    if (adopted) return;
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      console.error("[admin/validate] rollback impossible — compte orphelin", userId, error);
    }
  }

  // 3) Créer ou mettre à jour le profil.
  //    `upsert` plutôt qu'`insert` : sur un compte repris, le profil existe
  //    déjà et un insert échouerait sur la contrainte d'unicité.
  const currentYear = new Date().getFullYear();
  const { error: profileErr } = await supabase.from("profiles").upsert(
    {
      user_id: userId,
      prenom: request.prenom,
      nom: request.nom,
      telephone: request.telephone,
      specialite: request.specialite,
      etablissement: request.etablissement,
      ville: request.ville,
      cotisation_year: currentYear,
      cotisation_paid_at: new Date().toISOString().slice(0, 10),
    },
    { onConflict: "user_id" }
  );
  if (profileErr) {
    console.error("[admin/validate] profile insert", profileErr);
    await rollbackUser();
    return NextResponse.json(
      { error: `Profil non créé : ${profileErr.message}` },
      { status: 500 }
    );
  }

  // 4) Marquer la demande comme validée.
  //    `generated_password` sert à la récupération par l'admin, mais la colonne
  //    peut manquer selon l'état des migrations : dans ce cas on valide quand
  //    même et on continue jusqu'à l'envoi des identifiants, qui est l'essentiel.
  const baseUpdate = {
    status: "approved",
    validated_at: new Date().toISOString(),
    validated_by: "bureau",
  };

  let passwordStored = true;
  let { error: updateErr } = await supabase
    .from("adhesion_requests")
    .update({ ...baseUpdate, generated_password: password })
    .eq("id", id);

  if (updateErr && /generated_password/.test(updateErr.message)) {
    console.warn(
      "[admin/validate] colonne generated_password absente — validation sans mémorisation du mot de passe. Lancez la migration SQL."
    );
    passwordStored = false;
    ({ error: updateErr } = await supabase
      .from("adhesion_requests")
      .update(baseUpdate)
      .eq("id", id));
  }

  if (updateErr) {
    console.error("[admin/validate] update adhesion_requests", updateErr);
    await rollbackUser();
    return NextResponse.json(
      { error: `Demande non mise à jour : ${updateErr.message}` },
      { status: 500 }
    );
  }

  // 5) Email avec les identifiants — c'est l'étape qui compte pour le membre,
  //    donc son échec doit être remonté explicitement au Bureau.
  const html = `
      <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:24px auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
        ${emailHeader()}
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
        ${emailFooter()}
      </div>`;

  const mail = await sendMail(
    {
      to: request.email,
      replyTo: SECRETARIAT,
      subject: "✓ Bienvenue dans la SOBUP — vos identifiants de connexion",
      html,
    },
    "validate/identifiants"
  );

  const warnings: string[] = [];
  if (adopted) {
    warnings.push(
      "Un compte existait déjà pour cet email (validation précédente interrompue) : il a été repris et un nouveau mot de passe a été généré."
    );
  }
  if (!mail.sent) {
    warnings.push(
      `Le compte est créé mais l'email d'identifiants n'a pas pu être envoyé (${mail.error}). ` +
        `Communiquez le mot de passe au membre : ${password}`
    );
  }
  if (!passwordStored) {
    warnings.push(
      "Le mot de passe n'a pas pu être mémorisé pour la récupération admin — lancez la migration SQL (colonne generated_password)."
    );
  }

  return NextResponse.json({
    ok: true,
    emailSent: mail.sent,
    adopted,
    // Filet de sécurité : sans email, le Bureau doit pouvoir lire le mot de passe.
    password: mail.sent ? undefined : password,
    warning: warnings.length ? warnings.join(" ") : undefined,
  });
}
