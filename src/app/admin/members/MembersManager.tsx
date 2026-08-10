"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Search, Mail, Phone, Building2, MapPin, Award,
  X, Save, AlertTriangle, Loader2, KeyRound, CheckCircle2, User as UserIcon,
  Copy,
} from "lucide-react";

export type MemberRow = {
  user_id: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  specialite: string | null;
  etablissement: string | null;
  ville: string | null;
  role: string | null;
  joined_at: number | null;
  notes: string | null;
  is_bureau: boolean;
  status: string;
  cotisation_year: number | null;
  cotisation_paid_at: string | null;
  gtt_memberships: unknown;
  generated_password: string | null;
  email: string | null;
  auth_created_at: string | null;
  created_at: string;
};

const CURRENT_YEAR = new Date().getFullYear();

type EditState = {
  user_id?: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  specialite: string;
  etablissement: string;
  ville: string;
  role: string;
  joined_at: string;
  notes: string;
  is_bureau: boolean;
  status: string;
  cotisation_year: string;
};

const EMPTY: EditState = {
  prenom: "", nom: "", email: "", telephone: "", specialite: "",
  etablissement: "", ville: "", role: "", joined_at: String(CURRENT_YEAR),
  notes: "", is_bureau: false, status: "active", cotisation_year: String(CURRENT_YEAR),
};

export default function MembersManager({ initialMembers, loadError }: { initialMembers: MemberRow[]; loadError: string | null }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [members] = useState<MemberRow[]>(initialMembers);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<MemberRow | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter((m) =>
      [m.prenom, m.nom, m.email, m.specialite, m.etablissement, m.ville, m.role]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [members, query]);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function openNew() { setEditing({ ...EMPTY }); }
  function openEdit(m: MemberRow) {
    setEditing({
      user_id: m.user_id,
      prenom: m.prenom ?? "", nom: m.nom ?? "", email: m.email ?? "",
      telephone: m.telephone ?? "", specialite: m.specialite ?? "",
      etablissement: m.etablissement ?? "", ville: m.ville ?? "",
      role: m.role ?? "", joined_at: String(m.joined_at ?? CURRENT_YEAR),
      notes: m.notes ?? "", is_bureau: !!m.is_bureau,
      status: m.status ?? "active",
      cotisation_year: String(m.cotisation_year ?? CURRENT_YEAR),
    });
  }
  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); flash("ok", "✓ Copié"); }
    catch { flash("err", "Impossible de copier."); }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.prenom.trim() || !editing.nom.trim() || !editing.email.trim()) {
      flash("err", "Prénom, nom et email requis."); return;
    }
    setSaving(true);
    try {
      const payload = {
        prenom: editing.prenom.trim(),
        nom: editing.nom.trim(),
        email: editing.email.trim().toLowerCase(),
        telephone: editing.telephone.trim() || null,
        specialite: editing.specialite.trim() || null,
        etablissement: editing.etablissement.trim() || null,
        ville: editing.ville.trim() || null,
        role: editing.role.trim() || null,
        joined_at: Number(editing.joined_at) || CURRENT_YEAR,
        notes: editing.notes.trim() || null,
        is_bureau: editing.is_bureau,
        status: editing.status,
        cotisation_year: Number(editing.cotisation_year) || CURRENT_YEAR,
      };
      const url = editing.user_id ? `/api/admin/members/${editing.user_id}` : "/api/admin/members";
      const method = editing.user_id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", editing.user_id ? "✓ Membre modifié" : "✓ Membre créé, identifiants envoyés par email");
      setEditing(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function handleDelete(m: MemberRow) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/members/${m.user_id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Membre supprimé");
      setConfirmDelete(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function resetPassword(m: MemberRow) {
    if (!confirm(`Réinitialiser le mot de passe de ${m.prenom} ${m.nom} ?\nL'ancien ne fonctionnera plus, un nouveau sera envoyé par email.`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/members/${m.user_id}/reset-password`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", `✓ Nouveau mot de passe envoyé à ${m.email}`);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function toggleCotisation(m: MemberRow) {
    const isPaidCurrent = m.cotisation_year === CURRENT_YEAR;
    const payload = isPaidCurrent
      ? { cotisation_year: null, cotisation_paid_at: null }
      : { cotisation_year: CURRENT_YEAR, cotisation_paid_at: new Date().toISOString().slice(0, 10) };
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/members/${m.user_id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", isPaidCurrent ? "Cotisation retirée" : `✓ Cotisation ${CURRENT_YEAR} marquée payée`);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  const stats = useMemo(() => ({
    total: members.length,
    aJour: members.filter((m) => m.cotisation_year === CURRENT_YEAR).length,
    bureau: members.filter((m) => m.is_bureau).length,
  }), [members]);

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-white sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Membres</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {stats.total} membre{stats.total > 1 ? "s" : ""} · {stats.aJour} à jour · {stats.bureau} au Bureau
          </p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
          <Plus className="w-4 h-4" /> Ajouter un membre
        </button>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-6">
        {loadError && (
          <div className="mb-5 p-4 rounded-xl border flex items-start gap-2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{loadError}</p>
          </div>
        )}

        <div className="mb-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, email, spécialité, ville…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all" />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <UserIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-700 text-base">{members.length === 0 ? "Aucun membre" : "Aucun résultat"}</p>
            <p className="text-sm text-gray-400 mt-1">
              {members.length === 0 ? "Cliquez sur « Ajouter un membre » pour créer le premier compte." : "Essayez un autre terme de recherche."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((m) => {
              const paid = m.cotisation_year === CURRENT_YEAR;
              return (
                <div key={m.user_id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
                      style={{ background: m.is_bureau ? "linear-gradient(135deg,#e67e22,#d35400)" : "linear-gradient(135deg,#31B9AE,#065E52)" }}>
                      {(m.prenom?.[0] ?? "?").toUpperCase()}{(m.nom?.[0] ?? "").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-black text-gray-900 text-sm">{m.prenom} {m.nom}</h3>
                        {m.is_bureau && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: "#fff7ed", color: "#e67e22" }}>
                            <Award className="w-2.5 h-2.5 inline mr-0.5" /> Bureau
                          </span>
                        )}
                        {m.status === "inactive" && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactif</span>
                        )}
                        {paid ? (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ background: "#E8F9F7", color: "#065E52" }}>
                            <CheckCircle2 className="w-2.5 h-2.5" /> Cotisation {CURRENT_YEAR}
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                            Non à jour {CURRENT_YEAR}
                          </span>
                        )}
                      </div>
                      {m.role && <p className="text-xs font-semibold text-gray-500 mb-1">{m.role}</p>}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        {m.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {m.email}</span>}
                        {m.telephone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {m.telephone}</span>}
                        {m.specialite && <span className="flex items-center gap-1.5">🩺 {m.specialite}</span>}
                        {m.etablissement && <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {m.etablissement}</span>}
                        {m.ville && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {m.ville}</span>}
                      </div>
                    </div>
                  </div>

                  {m.generated_password && (
                    <div className="mx-4 mb-3 p-3 rounded-lg border flex items-center gap-2" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                      <KeyRound className="w-3.5 h-3.5 shrink-0" style={{ color: "#d97706" }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#92400e" }}>Mot de passe (dernier envoyé)</p>
                        <code className="font-mono text-sm font-black text-gray-900 select-all">{m.generated_password}</code>
                      </div>
                      <button onClick={() => m.generated_password && copy(m.generated_password)}
                        className="p-1.5 rounded-md bg-white border border-amber-200 text-amber-700 hover:bg-amber-50"
                        title="Copier">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="px-4 pb-4 flex flex-wrap gap-2">
                    <button onClick={() => toggleCotisation(m)} disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                      style={paid
                        ? { borderColor: "#e2e8f0", color: "#64748b" }
                        : { borderColor: "#31B9AE", color: "#31B9AE" }}>
                      <CheckCircle2 className="w-3 h-3" />
                      {paid ? `Annuler cotisation ${CURRENT_YEAR}` : `Marquer cotisation ${CURRENT_YEAR} payée`}
                    </button>
                    <button onClick={() => openEdit(m)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                      <Pencil className="w-3 h-3" /> Modifier
                    </button>
                    <button onClick={() => resetPassword(m)} disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-amber-200 text-amber-700 hover:bg-amber-50">
                      <KeyRound className="w-3 h-3" /> Réinitialiser mdp
                    </button>
                    <button onClick={() => setConfirmDelete(m)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3 h-3" /> Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal édition */}
      {editing && (
        <div className="fixed inset-0 z-40 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="bg-white w-full max-w-2xl flex flex-col shadow-2xl sm:rounded-2xl sm:max-h-[min(94vh,900px)]">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-black text-gray-900 text-lg">{editing.user_id ? "Modifier le membre" : "Ajouter un membre"}</h3>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1 min-h-0 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Prénom *" value={editing.prenom} onChange={(v) => setEditing({ ...editing, prenom: v })} />
                <Field label="Nom *" value={editing.nom} onChange={(v) => setEditing({ ...editing, nom: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Email *" value={editing.email} type="email" onChange={(v) => setEditing({ ...editing, email: v })}
                  disabled={!!editing.user_id} help={editing.user_id ? "L'email ne peut pas être modifié après création." : undefined} />
                <Field label="Téléphone" value={editing.telephone} type="tel" onChange={(v) => setEditing({ ...editing, telephone: v })} placeholder="+226 70 00 00 00" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Spécialité" value={editing.specialite} onChange={(v) => setEditing({ ...editing, specialite: v })} placeholder="Pneumologie, Médecine générale…" />
                <Field label="Année d'entrée SOBUP" value={editing.joined_at} onChange={(v) => setEditing({ ...editing, joined_at: v })} placeholder="2010" />
              </div>
              <Field label="Établissement" value={editing.etablissement} onChange={(v) => setEditing({ ...editing, etablissement: v })} placeholder="CHU Yalgado Ouédraogo" />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Ville" value={editing.ville} onChange={(v) => setEditing({ ...editing, ville: v })} placeholder="Ouagadougou" />
                <Field label="Fonction au Bureau" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} placeholder="Ex : Secrétaire Général" />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <SelectField label="Statut" value={editing.status} options={["active", "inactive", "suspended"]}
                  labels={{ active: "Actif", inactive: "Inactif", suspended: "Suspendu" }}
                  onChange={(v) => setEditing({ ...editing, status: v })} />
                <Field label="Année cotisation" value={editing.cotisation_year} onChange={(v) => setEditing({ ...editing, cotisation_year: v })} placeholder={String(CURRENT_YEAR)} />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">Notes internes</label>
                <textarea value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={3}
                  placeholder="Notes privées visibles uniquement par le Bureau…"
                  className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all resize-y" />
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input type="checkbox" checked={editing.is_bureau} onChange={(e) => setEditing({ ...editing, is_bureau: e.target.checked })}
                  className="w-4 h-4 rounded accent-orange-500" />
                <Award className="w-4 h-4 text-orange-500" /> Membre du Bureau exécutif
              </label>

              {!editing.user_id && (
                <div className="rounded-xl p-3 border" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    ℹ️ Un mot de passe sera généré automatiquement et envoyé par email à l&apos;adresse fournie.
                    L&apos;utilisateur pourra se connecter immédiatement sur <code>/espace-membre</code>.
                  </p>
                </div>
              )}
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3 items-center shrink-0 bg-white">
              <button onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving}
                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Enregistrement…" : editing.user_id ? "Enregistrer" : "Créer et envoyer les identifiants"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Supprimer ce membre ?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Le compte et le profil de <strong>{confirmDelete.prenom} {confirmDelete.nom}</strong> seront supprimés définitivement.
              Cette action est irréversible.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">Annuler</button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={saving}
                className="flex-1 py-2.5 rounded-lg text-sm font-black text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "#dc2626" }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-2xl font-bold text-sm text-white"
          style={{ background: toast.type === "ok" ? "#31B9AE" : "#dc2626" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, disabled, help }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; disabled?: boolean; help?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <input type={type} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 transition-all ${
          disabled ? "bg-gray-100 cursor-not-allowed" :
          "bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10"
        }`} />
      {help && <p className="text-[11px] text-gray-400 mt-1">{help}</p>}
    </div>
  );
}

function SelectField({ label, value, options, labels, onChange }: {
  label: string; value: string; options: string[]; labels?: Record<string, string>; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all">
        {options.map((o) => <option key={o} value={o}>{labels?.[o] ?? o}</option>)}
      </select>
    </div>
  );
}
