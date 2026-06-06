"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addGTTMembership, type SessionUser } from "@/lib/userSession";

const fonctions = [
  "Médecin généraliste",
  "Médecin spécialiste",
  "Infirmier(ère)",
  "Étudiant(e)",
];

const grades = [
  "Assistant",
  "Maître-assistant",
  "Maître de conférences agrégé",
  "Professeur titulaire",
];

interface Form {
  fonction: string;
  specialite: string;
  estEHU: "" | "oui" | "non";
  grade: string;
  lieuExercice: string;
  motivation: string;
}

type FormErrors = Partial<Record<keyof Form, string>>;

interface Props {
  gttName: string;
  gttColor: string;
  user: SessionUser;
  onClose: () => void;
}

export default function GTTJoinModal({ gttName, gttColor, user, onClose }: Props) {
  const router = useRouter();

  const initialForm: Form = {
    fonction: user.specialite ? "Médecin spécialiste" : "",
    specialite: user.specialite ?? "",
    estEHU: "",
    grade: "",
    lieuExercice: user.etablissement ?? "",
    motivation: "",
  };

  const [form, setForm] = useState<Form>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [k]: e.target.value }));
      setErrors(er => ({ ...er, [k]: undefined }));
    };

  const isSpecialiste = form.fonction === "Médecin spécialiste";
  const isEHU = form.estEHU === "oui";

  function validate() {
    const e: FormErrors = {};
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

  const handleSubmit = () => {
    if (!validate()) return;

    const result = addGTTMembership({
      name: gttName,
      color: gttColor,
      joinedAt: new Date().toISOString(),
      motivation: form.motivation,
      fonction: form.fonction,
      lieuExercice: form.lieuExercice,
    });

    if (!result) {
      // Echec : pas connecté ou erreur d'écriture
      alert(
        "Votre session a expiré. Veuillez vous reconnecter pour rejoindre ce GTT."
      );
      return;
    }

    setSent(true);
  };

  const inputCls = (k: keyof Form) =>
    `w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:border-transparent ${errors[k] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: gttColor }}>
              Rejoindre le groupe
            </p>
            <h2 className="text-lg font-black text-gray-900">{gttName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 shrink-0 ml-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {!sent ? (
          <div className="p-6 space-y-5">

            {/* Récap utilisateur connecté */}
            <div className="p-4 rounded-xl flex items-center gap-3" style={{ background: `${gttColor}08`, border: `1px solid ${gttColor}30` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
                style={{ background: gttColor }}>
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white shrink-0"
                style={{ background: gttColor }}>
                ✓ Membre
              </span>
            </div>

            {/* Fonction */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Fonction *</label>
              <div className="grid grid-cols-2 gap-2">
                {fonctions.map(f => (
                  <button
                    key={f} type="button"
                    onClick={() => { setForm(prev => ({ ...prev, fonction: f, specialite: f === "Médecin spécialiste" ? prev.specialite : "", estEHU: "", grade: "" })); setErrors({}); }}
                    className="px-3 py-2.5 rounded-lg border-2 text-sm font-medium text-left transition-all"
                    style={form.fonction === f
                      ? { borderColor: gttColor, background: `${gttColor}12`, color: gttColor }
                      : { borderColor: "#e5e7eb", color: "#6b7280" }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {errors.fonction && <p className="text-red-500 text-xs mt-1">{errors.fonction}</p>}
            </div>

            {/* Spécialité (si médecin spécialiste) */}
            {isSpecialiste && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Spécialité *</label>
                <input
                  value={form.specialite} onChange={set("specialite")}
                  type="text" placeholder="Ex : Pneumologie, Cardiologie, Pédiatrie…"
                  className={inputCls("specialite")}
                />
                {errors.specialite && <p className="text-red-500 text-xs mt-1">{errors.specialite}</p>}
              </div>
            )}

            {/* Enseignant HU */}
            {form.fonction !== "" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Êtes-vous enseignant hospitalo-universitaire (EHU) ? *
                </label>
                <div className="flex gap-3">
                  {(["oui", "non"] as const).map(v => (
                    <button
                      key={v} type="button"
                      onClick={() => { setForm(prev => ({ ...prev, estEHU: v, grade: "" })); setErrors(er => ({ ...er, estEHU: "", grade: "" })); }}
                      className="flex-1 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all capitalize"
                      style={form.estEHU === v
                        ? { borderColor: gttColor, background: `${gttColor}12`, color: gttColor }
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
                  {grades.map(g => (
                    <button
                      key={g} type="button"
                      onClick={() => { setForm(prev => ({ ...prev, grade: g })); setErrors(er => ({ ...er, grade: "" })); }}
                      className="px-3 py-2.5 rounded-lg border-2 text-xs font-medium text-left transition-all"
                      style={form.grade === g
                        ? { borderColor: gttColor, background: `${gttColor}12`, color: gttColor }
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
              <input value={form.lieuExercice} onChange={set("lieuExercice")} type="text" placeholder="Hôpital, CHU, clinique…" className={inputCls("lieuExercice")} />
              {errors.lieuExercice && <p className="text-red-500 text-xs mt-1">{errors.lieuExercice}</p>}
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Pourquoi souhaitez-vous rejoindre ce GTT ? *
              </label>
              <textarea
                value={form.motivation} onChange={set("motivation")}
                rows={3}
                placeholder="Décrivez votre intérêt pour ce groupe de travail, votre expérience ou les contributions que vous souhaitez apporter…"
                className={inputCls("motivation") + " resize-none"}
              />
              {errors.motivation && <p className="text-red-500 text-xs mt-1">{errors.motivation}</p>}
              <p className="text-[10px] text-gray-400 mt-1">Minimum 20 caractères ({form.motivation.length}/20)</p>
            </div>

            {/* Bouton submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: gttColor }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              Confirmer mon adhésion au {gttName}
            </button>

            <p className="text-center text-[10px] text-gray-400">
              Votre adhésion sera ajoutée à votre espace personnel SOBUP.
              Le coordinateur du GTT sera notifié.
            </p>
          </div>

        ) : (

          /* Écran succès */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"
              style={{ background: gttColor }}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Bienvenue dans le {gttName} ! 🎉</h3>
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">
              Votre adhésion a bien été enregistrée dans votre espace personnel.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Vous pouvez désormais accéder aux discussions, documents et événements de ce groupe depuis votre tableau de bord.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                Continuer à explorer
              </button>
              <button
                onClick={() => { onClose(); router.push("/espace-membre/dashboard/gtt"); }}
                className="flex-1 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: gttColor }}>
                Voir mes GTT →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
