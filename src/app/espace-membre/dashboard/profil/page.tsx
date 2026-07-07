"use client";

import { useCallback, useEffect, useState } from "react";
import { Camera, Mail, MapPin, Calendar, Briefcase, GraduationCap, Edit3, Save, X, Loader2, Check, AlertTriangle, Phone } from "lucide-react";
import { useSessionUser, type SessionUser } from "@/lib/userSession";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Profile = {
  user_id: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  ville: string | null;
  specialite: string | null;
  etablissement: string | null;
  role: string | null;
  joined_at: number | null;
  is_bureau: boolean;
  cotisation_year: number | null;
  gtt_memberships: unknown;
};

type Form = {
  prenom: string;
  nom: string;
  telephone: string;
  ville: string;
  specialite: string;
  etablissement: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CURRENT_YEAR = new Date().getFullYear();

function toForm(p: Profile): Form {
  return {
    prenom: p.prenom ?? "",
    nom: p.nom ?? "",
    telephone: p.telephone ?? "",
    ville: p.ville ?? "",
    specialite: p.specialite ?? "",
    etablissement: p.etablissement ?? "",
  };
}

function formatDisplayName(prenom: string, nom: string): string {
  const full = `${prenom} ${nom}`.trim();
  return full ? `Dr ${full}` : "";
}

function computeInitials(prenom: string, nom: string): string {
  const p = prenom.trim()[0] ?? "";
  const n = nom.trim()[0] ?? "";
  return `${p}${n}`.toUpperCase() || "?";
}

export default function ProfilPage() {
  const sessionUser = useSessionUser();
  const [tab, setTab] = useState<"info" | "professionnel" | "securite">("info");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileEmail, setProfileEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  // Charger le profil frais depuis Supabase (source de vérité)
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: sess } = await supabase.auth.getSession();
      const authUser = sess.session?.user;
      if (!authUser) { setLoadError("Session expirée. Reconnectez-vous."); return; }
      setProfileEmail(authUser.email ?? null);
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", authUser.id).single();
      if (error) { setLoadError(error.message); return; }
      setProfile(data as Profile);
    } catch (err) {
      console.error(err);
      setLoadError("Chargement impossible.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadProfile(); }, [loadProfile]);

  // Réinitialise le form quand le profil change ou qu'on sort de l'édition
  useEffect(() => {
    if (profile && !editing) setForm(toForm(profile));
  }, [profile, editing]);

  // Cleanup du toast à l'unmount
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  function flash(type: "ok" | "err", msg: string) { setToast({ type, msg }); }

  function startEdit() {
    if (!profile) return;
    setForm(toForm(profile));
    setFormErrors({});
    setEditing(true);
  }
  function cancelEdit() {
    if (profile) setForm(toForm(profile));
    setFormErrors({});
    setEditing(false);
  }

  function validateForm(f: Form): Partial<Record<keyof Form, string>> {
    const errs: Partial<Record<keyof Form, string>> = {};
    if (!f.prenom.trim()) errs.prenom = "Prénom requis.";
    if (!f.nom.trim()) errs.nom = "Nom requis.";
    if (f.telephone.trim() && !/^[+0-9\s()-]{6,}$/.test(f.telephone.trim())) {
      errs.telephone = "Numéro invalide.";
    }
    return errs;
  }

  async function saveProfile() {
    if (!form || !profile) return;
    const errs = validateForm(form);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.from("profiles").update({
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        telephone: form.telephone.trim() || null,
        ville: form.ville.trim() || null,
        specialite: form.specialite.trim() || null,
        etablissement: form.etablissement.trim() || null,
      }).eq("user_id", profile.user_id);
      if (error) { flash("err", error.message); return; }

      // Recharge le profil frais depuis Supabase
      await loadProfile();

      // Synchronise localStorage sobup_user (utilisé par la sidebar du dashboard)
      if (typeof window !== "undefined" && sessionUser) {
        const updated: SessionUser = {
          ...sessionUser,
          name: formatDisplayName(form.prenom, form.nom) || sessionUser.name,
          avatar: computeInitials(form.prenom, form.nom),
          specialite: form.specialite.trim() || undefined,
          etablissement: form.etablissement.trim() || undefined,
          ville: form.ville.trim() || undefined,
        };
        localStorage.setItem("sobup_user", JSON.stringify(updated));
        window.dispatchEvent(new Event("sobup_user_changed"));
      }

      flash("ok", "✓ Profil mis à jour");
      setEditing(false);
    } catch (err) {
      console.error(err);
      flash("err", "Erreur inattendue.");
    } finally { setSaving(false); }
  }

  if (loading || !profile || !form) {
    return (
      <div className="max-w-5xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          {loadError ? (
            <>
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-red-700 font-medium">{loadError}</p>
            </>
          ) : (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chargement du profil…</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const displayName = formatDisplayName(profile.prenom ?? "", profile.nom ?? "") || sessionUser?.name || "Membre SOBUP";
  const avatar = computeInitials(profile.prenom ?? "", profile.nom ?? "");
  const cotisationOk = profile.cotisation_year === CURRENT_YEAR;
  const gttList = Array.isArray(profile.gtt_memberships) ? (profile.gtt_memberships as { name?: string }[]) : [];

  return (
    <div className="space-y-5 sm:space-y-6 max-w-5xl">
      {/* En-tête */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden">
        <div className="h-24 sm:h-32 relative" style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 70%, #31B9AE 130%)" }}>
          <div className="absolute -bottom-10 sm:-bottom-12 left-4 sm:left-8 flex items-end gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-black text-2xl sm:text-3xl border-4 border-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #31B9AE, #7EEAE4)" }}>
                {avatar}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform" title="Bientôt disponible">
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-14 sm:pt-16 pb-5 sm:pb-6 px-4 sm:px-8 flex items-start justify-between flex-wrap gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight">{displayName}</h1>
            {profile.role && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{profile.role}</p>}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
              {cotisationOk ? (
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#E8F9F7", color: "#31B9AE" }}>
                  ✓ Cotisation {CURRENT_YEAR} à jour
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                  Cotisation {CURRENT_YEAR} non à jour
                </span>
              )}
              {profile.is_bureau && (
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#fff7ed", color: "#e67e22" }}>
                  Bureau Exécutif
                </span>
              )}
              {profile.joined_at && (
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
                  Membre depuis {profile.joined_at}
                </span>
              )}
            </div>
          </div>

          {tab !== "securite" && !editing && (
            <button onClick={startEdit}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white hover:-translate-y-0.5 transition-all shrink-0"
              style={{ background: "#31B9AE" }}>
              <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Modifier mon profil</span>
              <span className="sm:hidden">Modifier</span>
            </button>
          )}
          {tab !== "securite" && editing && (
            <div className="flex gap-2 shrink-0">
              <button onClick={cancelEdit} disabled={saving}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60">
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Annuler
              </button>
              <button onClick={saveProfile} disabled={saving}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black text-white shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
                {saving ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                Enregistrer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {(["info", "professionnel", "securite"] as const).map((k) => {
            const long = k === "info" ? "Informations personnelles" : k === "professionnel" ? "Profil professionnel" : "Sécurité du compte";
            const short = k === "info" ? "Informations" : k === "professionnel" ? "Professionnel" : "Sécurité";
            return (
              <button key={k} onClick={() => { setTab(k); if (k === "securite") setEditing(false); }}
                className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold transition-colors border-b-2 whitespace-nowrap shrink-0 ${
                  tab === k ? "" : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                style={tab === k ? { borderColor: "#31B9AE", color: "#31B9AE" } : {}}>
                <span className="sm:hidden">{short}</span>
                <span className="hidden sm:inline">{long}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {tab === "info" && (
            editing ? (
              <div className="grid sm:grid-cols-2 gap-5">
                <FormInput label="Prénom *" value={form.prenom} onChange={(v) => setForm({ ...form, prenom: v })} error={formErrors.prenom} />
                <FormInput label="Nom *" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} error={formErrors.nom} />
                <FormReadOnly label="Email professionnel" value={profileEmail ?? "—"} icon={Mail} hint="L'email ne peut pas être modifié ici." />
                <FormInput label="Téléphone" value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })}
                  placeholder="+226 70 00 00 00" icon={Phone} error={formErrors.telephone} />
                <FormInput label="Ville" value={form.ville} onChange={(v) => setForm({ ...form, ville: v })} icon={MapPin} placeholder="Ouagadougou" />
                <FormReadOnly label="Pays" value="Burkina Faso" icon={MapPin} />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                <FormReadOnly label="Nom complet" value={displayName} />
                <FormReadOnly label="Email professionnel" value={profileEmail ?? "—"} icon={Mail} />
                <FormReadOnly label="Téléphone" value={profile.telephone ?? "—"} icon={Phone} />
                <FormReadOnly label="Ville" value={profile.ville ?? "—"} icon={MapPin} />
                <FormReadOnly label="Pays" value="Burkina Faso" icon={MapPin} />
                <FormReadOnly label="Membre depuis" value={profile.joined_at ? String(profile.joined_at) : "—"} icon={Calendar} />
              </div>
            )
          )}

          {tab === "professionnel" && (
            <div className="space-y-5">
              {editing ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormInput label="Spécialité" value={form.specialite} onChange={(v) => setForm({ ...form, specialite: v })}
                    icon={Briefcase} placeholder="Pneumologie" />
                  <FormReadOnly label="Fonction SOBUP" value={profile.role ?? "—"} icon={Briefcase} hint="Modifiable par le Bureau." />
                  <FormInput label="Établissement" value={form.etablissement} onChange={(v) => setForm({ ...form, etablissement: v })}
                    icon={MapPin} placeholder="CHU Yalgado Ouédraogo" />
                  <FormReadOnly label="Diplôme" value="DES Pneumologie" icon={GraduationCap} />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormReadOnly label="Spécialité" value={profile.specialite ?? "—"} icon={Briefcase} />
                  <FormReadOnly label="Fonction SOBUP" value={profile.role ?? "—"} icon={Briefcase} />
                  <FormReadOnly label="Établissement" value={profile.etablissement ?? "—"} icon={MapPin} />
                  <FormReadOnly label="Diplôme" value="DES Pneumologie" icon={GraduationCap} />
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Groupes de travail</label>
                {gttList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {gttList.map((g) => (
                      <span key={g.name ?? Math.random()} className="text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{ background: "#E8F9F7", color: "#31B9AE" }}>{g.name}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    Vous n&apos;avez rejoint aucun GTT. <a href="/gtt" className="font-bold hover:underline" style={{ color: "#31B9AE" }}>Explorer les GTT →</a>
                  </p>
                )}
              </div>
            </div>
          )}

          {tab === "securite" && <PasswordChange onToast={flash} />}
        </div>
      </div>

      {toast && (
        <div role="status" aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-2xl font-bold text-sm text-white flex items-center gap-2"
          style={{ background: toast.type === "ok" ? "#31B9AE" : "#dc2626" }}>
          {toast.type === "ok" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─── Sous-composants (DÉFINIS HORS DU PARENT — sinon remount à chaque frappe) ─── */

function FormReadOnly({ label, value, icon: Icon, hint }: {
  label: string; value: string; icon?: React.ComponentType<{ className?: string }>; hint?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </label>
      <div className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 font-medium">{value}</div>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function FormInput({
  label, value, onChange, icon: Icon, placeholder, error,
}: {
  label: string; value: string; onChange: (v: string) => void;
  icon?: React.ComponentType<{ className?: string }>; placeholder?: string; error?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-900 placeholder:text-gray-400 transition-all bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-gray-100 focus:border-[#31B9AE] focus:ring-[#31B9AE]/10"
        }`} />
      {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
    </div>
  );
}

/* ─── Onglet Sécurité : changement de mot de passe ─── */

function PasswordChange({ onToast }: { onToast: (t: "ok" | "err", msg: string) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!current) { onToast("err", "Saisissez votre mot de passe actuel."); return; }
    if (next.length < 8) { onToast("err", "Le nouveau mot de passe doit faire au moins 8 caractères."); return; }
    if (next === current) { onToast("err", "Le nouveau mot de passe doit être différent de l'actuel."); return; }
    if (next !== confirmPwd) { onToast("err", "Les deux mots de passe ne correspondent pas."); return; }

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: sess } = await supabase.auth.getSession();
      const email = sess.session?.user.email;
      if (!email) { onToast("err", "Session expirée. Reconnectez-vous."); return; }

      // Vérifie le mot de passe actuel (re-sign in — Supabase ne fournit pas d'API reauth stateless en clientlib actuelle)
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password: current });
      if (signErr) { onToast("err", "Mot de passe actuel incorrect."); return; }

      const { error: updErr } = await supabase.auth.updateUser({ password: next });
      if (updErr) { onToast("err", updErr.message); return; }

      onToast("ok", "✓ Mot de passe mis à jour");
      setCurrent(""); setNext(""); setConfirmPwd("");
    } catch (err) {
      console.error(err);
      onToast("err", "Erreur inattendue.");
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="max-w-md space-y-5">
      <PwdField label="Mot de passe actuel" value={current} onChange={setCurrent} autoComplete="current-password" />
      <PwdField label="Nouveau mot de passe" value={next} onChange={setNext} autoComplete="new-password" hint="Minimum 8 caractères." />
      <PwdField label="Confirmer le nouveau mot de passe" value={confirmPwd} onChange={setConfirmPwd} autoComplete="new-password" />
      <button type="submit" disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Mise à jour…" : "Mettre à jour le mot de passe"}
      </button>
    </form>
  );
}

function PwdField({ label, value, onChange, autoComplete, hint }: {
  label: string; value: string; onChange: (v: string) => void; autoComplete: string; hint?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">{label}</label>
      <input type="password" value={value} onChange={(e) => onChange(e.target.value)} required
        autoComplete={autoComplete} minLength={autoComplete === "new-password" ? 8 : undefined}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all" />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
