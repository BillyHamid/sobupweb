"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X, Send, Check, AlertTriangle, Calendar, MapPin,
} from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const FONCTIONS = [
  "Médecin généraliste",
  "Médecin spécialiste",
  "Infirmier(ère)",
  "Étudiant(e)",
];

const GRADES = [
  "Assistant",
  "Maître-assistant",
  "Maître de conférences agrégé",
  "Professeur titulaire",
];

type Form = {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  fonction: string;
  specialite: string;
  estEHU: "" | "oui" | "non";
  grade: string;
  lieuExercice: string;
  motivation: string;
};

type FormErrors = Partial<Record<keyof Form, string>>;

const ACCENT = "#31B9AE";
const EMPTY_FORM: Form = {
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  fonction: "",
  specialite: "",
  estEHU: "",
  grade: "",
  lieuExercice: "",
  motivation: "",
};

export default function JourneeInscriptionButton({
  label,
  variant = "primary",
}: {
  label: string;
  variant?: "primary" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const isSpecialiste = form.fonction === "Médecin spécialiste";
  const isEHU = form.estEHU === "oui";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function setField<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  }

  function validate() {
    const e: FormErrors = {};
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.email.trim()) e.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.telephone.trim()) e.telephone = "Requis";
    if (!form.fonction) e.fonction = "Sélectionnez votre fonction";
    if (isSpecialiste && !form.specialite.trim()) e.specialite = "Précisez la spécialité";
    if (!form.estEHU) e.estEHU = "Requis";
    if (isEHU && !form.grade) e.grade = "Précisez votre grade";
    if (!form.lieuExercice.trim()) e.lieuExercice = "Requis";
    if (!form.motivation.trim() || form.motivation.trim().length < 20) {
      e.motivation = "Minimum 20 caractères";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/inscriptions/journee-regionale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setServerError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setServerError("Connexion impossible. Vérifiez votre réseau.");
    }
  }

  function reset() {
    setForm(EMPTY_FORM);
    setErrors({});
    setStatus("idle");
    setServerError("");
  }

  const inputCls = (k: keyof Form) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:border-transparent ${
      errors[k] ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-gray-200 bg-white focus:ring-[#31B9AE]/30"
    }`;

  const primaryCls =
    "group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-sm shadow-lg transition-all hover:-translate-y-0.5";
  const primaryStyle = { background: "#e67e22", boxShadow: "0 12px 34px rgba(230,126,34,.4)" };
  const ghostCls =
    "inline-flex items-center px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-white/20";
  const ghostStyle = {
    color: "#fff",
    background: "rgba(255,255,255,.1)",
    border: "1px solid rgba(255,255,255,.25)",
  } as const;

  return (
    <>
      <button
        type="button"
        onClick={() => { reset(); setOpen(true); }}
        className={variant === "primary" ? primaryCls : ghostCls}
        style={variant === "primary" ? primaryStyle : ghostStyle}
      >
        {label}
        {variant === "primary" && (
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {open && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="jr-inscription-title"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-md jr-fade"
        >
          <div className="relative w-full max-w-2xl max-h-[95vh] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col jr-up">

            {/* ── Hero compact ── */}
            <div className="relative px-6 sm:px-8 pt-6 pb-5 shrink-0 overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 55%, #31B9AE 100%)" }}>
              <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full opacity-30 pointer-events-none"
                style={{ background: "radial-gradient(circle, #31B9AE 0%, transparent 70%)", filter: "blur(20px)" }} />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #e67e22 0%, transparent 70%)", filter: "blur(24px)" }} />
              <div className="absolute inset-0 opacity-[.08] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

              <div className="relative flex items-start justify-between gap-4">
                <div className="text-white">
                  <p className="text-[10px] font-black uppercase tracking-[.22em] opacity-80 mb-1">
                    Inscription gratuite
                  </p>
                  <h2 id="jr-inscription-title" className="text-lg sm:text-xl font-black leading-tight mb-2.5">
                    1ère Journée Scientifique Régionale
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.18)" }}>
                      <Calendar className="w-3.5 h-3.5" />
                      <strong className="font-bold">19 – 21 Nov 2026</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.18)" }}>
                      <MapPin className="w-3.5 h-3.5" />
                      Koudougou
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors shrink-0 backdrop-blur-sm"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Corps scrollable ── */}
            <div className="px-6 sm:px-8 py-5 overflow-y-auto flex-1 min-h-0">
              {status === "success" ? (
                <SuccessState onClose={() => setOpen(false)} />
              ) : (
                <div className="space-y-4">

                  {/* Identité */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Prénom *</label>
                      <input
                        value={form.prenom}
                        onChange={(e) => setField("prenom", e.target.value)}
                        placeholder="Aristide"
                        className={inputCls("prenom")}
                      />
                      {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Nom *</label>
                      <input
                        value={form.nom}
                        onChange={(e) => setField("nom", e.target.value)}
                        placeholder="Kaboré"
                        className={inputCls("nom")}
                      />
                      {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                    </div>
                  </div>

                  {/* Email + Téléphone */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="votre@email.com"
                        className={inputCls("email")}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Téléphone *</label>
                      <input
                        type="tel"
                        value={form.telephone}
                        onChange={(e) => setField("telephone", e.target.value)}
                        placeholder="+226 70 00 00 00"
                        className={inputCls("telephone")}
                      />
                      {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                    </div>
                  </div>

                  {/* Fonction */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Fonction *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {FONCTIONS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              fonction: f,
                              specialite: f === "Médecin spécialiste" ? prev.specialite : "",
                              estEHU: "",
                              grade: "",
                            }));
                            setErrors({});
                          }}
                          className="px-3 py-2.5 rounded-lg border-2 text-sm font-medium text-left transition-all"
                          style={form.fonction === f
                            ? { borderColor: ACCENT, background: `${ACCENT}12`, color: ACCENT }
                            : { borderColor: "#e5e7eb", color: "#6b7280" }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    {errors.fonction && <p className="text-red-500 text-xs mt-1">{errors.fonction}</p>}
                  </div>

                  {/* Spécialité (conditionnel) */}
                  {isSpecialiste && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Spécialité *</label>
                      <input
                        value={form.specialite}
                        onChange={(e) => setField("specialite", e.target.value)}
                        placeholder="Ex : Pneumologie, Cardiologie, Pédiatrie…"
                        className={inputCls("specialite")}
                      />
                      {errors.specialite && <p className="text-red-500 text-xs mt-1">{errors.specialite}</p>}
                    </div>
                  )}

                  {/* EHU */}
                  {form.fonction !== "" && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Êtes-vous enseignant hospitalo-universitaire (EHU) ? *
                      </label>
                      <div className="flex gap-3">
                        {(["oui", "non"] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({ ...prev, estEHU: v, grade: "" }));
                              setErrors((er) => ({ ...er, estEHU: undefined, grade: undefined }));
                            }}
                            className="flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all capitalize"
                            style={form.estEHU === v
                              ? { borderColor: ACCENT, background: `${ACCENT}12`, color: ACCENT }
                              : { borderColor: "#e5e7eb", color: "#6b7280" }}
                          >
                            {v === "oui" ? "Oui" : "Non"}
                          </button>
                        ))}
                      </div>
                      {errors.estEHU && <p className="text-red-500 text-xs mt-1">{errors.estEHU}</p>}
                    </div>
                  )}

                  {/* Grade EHU */}
                  {isEHU && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Grade *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {GRADES.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setField("grade", g)}
                            className="px-3 py-2.5 rounded-lg border-2 text-xs font-medium text-left transition-all"
                            style={form.grade === g
                              ? { borderColor: ACCENT, background: `${ACCENT}12`, color: ACCENT }
                              : { borderColor: "#e5e7eb", color: "#6b7280" }}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                      {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                    </div>
                  )}

                  {/* Lieu d'exercice */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Lieu d&apos;exercice *</label>
                    <input
                      value={form.lieuExercice}
                      onChange={(e) => setField("lieuExercice", e.target.value)}
                      placeholder="Hôpital, CHU, clinique…"
                      className={inputCls("lieuExercice")}
                    />
                    {errors.lieuExercice && <p className="text-red-500 text-xs mt-1">{errors.lieuExercice}</p>}
                  </div>

                  {/* Motivation */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Pourquoi souhaitez-vous participer à cette journée ? *
                    </label>
                    <textarea
                      value={form.motivation}
                      onChange={(e) => setField("motivation", e.target.value)}
                      rows={3}
                      placeholder="Décrivez votre intérêt pour cette journée scientifique, votre expérience ou les sujets sur lesquels vous souhaitez échanger…"
                      className={inputCls("motivation") + " resize-none"}
                    />
                    {errors.motivation && <p className="text-red-500 text-xs mt-1">{errors.motivation}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">
                      Minimum 20 caractères ({form.motivation.trim().length}/20)
                    </p>
                  </div>

                  {/* Honeypot anti-bot */}
                  <input
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute left-[-9999px] w-0 h-0 opacity-0"
                    aria-hidden="true"
                  />

                  {status === "error" && (
                    <div className="flex items-start gap-2.5 p-3 rounded-lg border" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#dc2626" }} />
                      <p className="text-xs text-red-700 leading-relaxed font-medium">{serverError}</p>
                    </div>
                  )}

                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    En soumettant ce formulaire, vous acceptez que la SOBUP utilise vos données
                    uniquement pour gérer votre inscription. Aucune diffusion à des tiers.
                  </p>
                </div>
              )}
            </div>

            {/* ── Footer collant avec actions ── */}
            {status !== "success" && (
              <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-gray-100 bg-white flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="ml-auto inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)", boxShadow: "0 8px 24px rgba(230,126,34,.4)" }}
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Confirmer mon inscription
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <style>{`
            @keyframes jr-fade { from { opacity: 0 } to { opacity: 1 } }
            @keyframes jr-up   { from { opacity: 0; transform: translateY(24px) scale(.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
            @keyframes jr-pop  { 0% { transform: scale(.5); opacity: 0 } 60% { transform: scale(1.1); opacity: 1 } 100% { transform: scale(1) } }
            @keyframes jr-ring { 0% { box-shadow: 0 0 0 0 rgba(49,185,174,.55) } 100% { box-shadow: 0 0 0 22px rgba(49,185,174,0) } }
            .jr-fade { animation: jr-fade .25s ease both }
            .jr-up   { animation: jr-up .4s cubic-bezier(.22,1,.36,1) both }
            .jr-pop  { animation: jr-pop .55s cubic-bezier(.22,1,.36,1) both }
            .jr-ring { animation: jr-ring 1.6s ease-out infinite }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="py-6 text-center">
      <div className="relative mx-auto mb-5 w-20 h-20">
        <span className="absolute inset-0 rounded-full jr-ring" />
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center jr-pop"
          style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>
      </div>
      <h3 className="font-black text-slate-900 text-xl mb-2">Inscription enregistrée !</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-sm mx-auto">
        Un email de confirmation vient de vous être envoyé. Le secrétariat de la SOBUP
        vous recontactera prochainement avec le programme détaillé.
      </p>
      <button
        onClick={onClose}
        className="px-7 py-3 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5 shadow-lg"
        style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}
      >
        Fermer
      </button>
    </div>
  );
}
