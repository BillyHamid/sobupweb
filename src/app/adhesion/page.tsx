"use client";

import { useState } from "react";
import Link from "next/link";

const OM_NUMBER   = "54 32 32 68";
const WAVE_NUMBER = "54 32 32 68";
const WA_NUMBER   = "22662475801";
const AMOUNT      = "30 000";

const specialites = [
  "Pneumologue",
  "DES Pneumologie (résident / interne)",
  "Médecin généraliste",
  "Pédiatre",
  "Paramédical",
  "Chercheur",
  "Autre",
];

interface FormData {
  nom: string; prenom: string; email: string;
  telephone: string; specialite: string;
  etablissement: string; ville: string;
}
const empty: FormData = { nom:"", prenom:"", email:"", telephone:"", specialite:"", etablissement:"", ville:"" };

export default function AdhesionPage() {
  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState<FormData>(empty);
  const [errors, setErrors]       = useState<Partial<FormData>>({});
  const [payMethod, setPayMethod] = useState<"om"|"wave">("om");

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e: Partial<FormData> = {};
    if (!form.prenom.trim())        e.prenom        = "Ce champ est requis";
    if (!form.nom.trim())           e.nom           = "Ce champ est requis";
    if (!form.email.trim())         e.email         = "Ce champ est requis";
    if (!form.telephone.trim())     e.telephone     = "Ce champ est requis";
    if (!form.specialite)           e.specialite    = "Veuillez choisir une spécialité";
    if (!form.etablissement.trim()) e.etablissement = "Ce champ est requis";
    if (!form.ville.trim())         e.ville         = "Ce champ est requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const waMessage = encodeURIComponent(
    `Bonjour,\n\nJe souhaite adhérer à la SOBUP.\n\n` +
    `Nom : ${form.prenom} ${form.nom}\n` +
    `Email : ${form.email}\n` +
    `Tél : ${form.telephone}\n` +
    `Spécialité : ${form.specialite}\n` +
    `Établissement : ${form.etablissement}, ${form.ville}\n\n` +
    `Veuillez trouver ci-joint ma preuve de paiement de ${AMOUNT} XOF.\n\nMerci.`
  );

  const field = (label: string, key: keyof FormData, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        value={form[key]}
        onChange={set(key)}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition
          focus:ring-2 focus:ring-[#31B9AE]/30 focus:border-[#31B9AE]
          ${errors[key] ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#f8f9fa" }}>

      {/* Header page */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4 py-6 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Adhésion à la SOBUP</h1>
            <p className="text-sm text-gray-500">Cotisation annuelle · {AMOUNT} XOF</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">

        {/* Barre de progression */}
        {step < 3 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              {["Informations", "Paiement", "Confirmation"].map((label, i) => (
                <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={
                        i < step  ? { background: "#31B9AE", color: "white" } :
                        i === step ? { background: "#0f172a", color: "white" } :
                                     { background: "#e2e8f0", color: "#94a3b8" }
                      }
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span
                      className="text-sm font-medium hidden sm:block"
                      style={{ color: i <= step ? "#0f172a" : "#94a3b8" }}
                    >{label}</span>
                  </div>
                  {i < 2 && (
                    <div className="flex-1 h-px mx-2" style={{ background: i < step ? "#31B9AE" : "#e2e8f0" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ÉTAPE 1 ── */}
        {step === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-base font-bold text-gray-900 mb-1">Informations personnelles</h2>
            <p className="text-sm text-gray-500 mb-6">Ces informations seront utilisées pour créer votre dossier d&apos;adhésion.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {field("Prénom", "prenom", { placeholder: "Prénom" })}
                {field("Nom", "nom", { placeholder: "Nom de famille" })}
              </div>
              {field("Email", "email", { type: "email", placeholder: "exemple@hopital.bf" })}
              {field("Téléphone", "telephone", { type: "tel", placeholder: "XX XX XX XX" })}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                <select
                  value={form.specialite}
                  onChange={set("specialite")}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition
                    focus:ring-2 focus:ring-[#31B9AE]/30 focus:border-[#31B9AE]
                    ${errors.specialite ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"}`}
                >
                  <option value="">Sélectionner une spécialité</option>
                  {specialites.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.specialite && <p className="text-red-500 text-xs mt-1">{errors.specialite}</p>}
              </div>

              {field("Établissement / Hôpital", "etablissement", { placeholder: "CHU Yalgado Ouédraogo…" })}
              {field("Ville", "ville", { placeholder: "Ouagadougou" })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Annuler</Link>
              <button
                onClick={() => { if (validate()) setStep(1); }}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#31B9AE" }}
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 ── */}
        {step === 1 && (
          <div className="space-y-4">

            {/* Montant */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-1">Montant à régler</p>
              <p className="text-4xl font-black text-gray-900">
                {AMOUNT} <span className="text-xl font-semibold text-gray-400">XOF</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">Cotisation annuelle — valable 12 mois</p>
            </div>

            {/* Choix méthode */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Choisissez votre méthode de paiement</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {(["om","wave"] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayMethod(m)}
                    className="flex items-center gap-3 px-4 py-4 rounded-lg border-2 transition-all text-left"
                    style={payMethod === m
                      ? { borderColor: "#31B9AE", background: "#f0fdf4" }
                      : { borderColor: "#e2e8f0", background: "white" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m === "om" ? "/orange-money.png" : "/wave.jpeg"}
                      alt={m === "om" ? "Orange Money" : "Wave"}
                      className="h-8 w-auto object-contain shrink-0"
                    />
                    <span className="text-sm font-semibold text-gray-800">
                      {m === "om" ? "Orange Money" : "Wave"}
                    </span>
                    {payMethod === m && (
                      <span className="ml-auto w-4 h-4 rounded-full shrink-0 flex items-center justify-center" style={{ background: "#31B9AE" }}>
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Instructions */}
              <div className="rounded-lg p-4" style={{ background: "#f8f9fa", border: "1px solid #e2e8f0" }}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Instructions de paiement
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>1. Ouvrez votre application <strong>{payMethod === "om" ? "Orange Money" : "Wave"}</strong></p>
                  <p>2. Effectuez un transfert de <strong>{AMOUNT} XOF</strong> au :</p>
                  <div className="my-2 px-4 py-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
                    <span className="text-2xl font-black tracking-wider text-gray-900">
                      {payMethod === "om" ? OM_NUMBER : WAVE_NUMBER}
                    </span>
                    <span className="text-xs text-gray-400">SOBUP</span>
                  </div>
                  <p>3. En motif, indiquez : <strong>{form.prenom} {form.nom} — Adhésion SOBUP</strong></p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#31B9AE" }}
              >
                J&apos;ai effectué le paiement
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">Envoyez votre preuve de paiement</h2>
              <p className="text-sm text-gray-500 mb-6">
                Prenez une capture d&apos;écran de votre reçu et envoyez-la via WhatsApp. Votre compte sera activé sous <strong>48h ouvrables</strong>.
              </p>

              {/* Récap */}
              <div className="rounded-lg border border-gray-100 divide-y divide-gray-100 mb-6 text-sm">
                {[
                  ["Adhérent",      `${form.prenom} ${form.nom}`],
                  ["Spécialité",    form.specialite],
                  ["Établissement", `${form.etablissement}, ${form.ville}`],
                  ["Montant réglé", `${AMOUNT} XOF`],
                  ["Mode",          payMethod === "om" ? "Orange Money" : "Wave"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center px-4 py-3">
                    <span className="w-36 text-gray-400 shrink-0">{label}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              </div>

              <a
                href={`https://wa.me/${WA_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTimeout(() => setStep(3), 800)}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-lg font-semibold text-white text-sm transition-all hover:opacity-90"
                style={{ background: "#25D366" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Envoyer la preuve par WhatsApp
              </a>
              <p className="text-center text-xs text-gray-400 mt-2">+226 62 47 58 01</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                J&apos;ai déjà envoyé la preuve
              </button>
            </div>
          </div>
        )}

        {/* ── SUCCÈS ── */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "#f0fdf4", border: "2px solid #31B9AE" }}
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#31B9AE" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
              Votre dossier est en cours de traitement. Vous recevrez vos identifiants de connexion sous <strong>48h ouvrables</strong>.
            </p>

            <div className="text-left rounded-lg border border-gray-100 divide-y divide-gray-100 mb-8 text-sm">
              {[
                "Vérification de la preuve de paiement par l'équipe SOBUP",
                "Création de votre compte dans l'espace membre",
                "Envoi de vos identifiants par WhatsApp ou email",
                "Accès à votre espace membre et à vos GTT",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                    style={{ background: "#31B9AE" }}
                  >{i + 1}</span>
                  <span className="text-gray-600">{t}</span>
                </div>
              ))}
            </div>

            <Link
              href="/"
              className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "#31B9AE" }}
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
