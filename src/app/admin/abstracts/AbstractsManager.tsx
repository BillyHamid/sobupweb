"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Download, Search, Trash2, Mail, Phone, Building2, Paperclip, FileSignature,
  AlertTriangle, Loader2, Save, Eye, Mic, LayoutGrid, Send, Users,
} from "lucide-react";
import AdminModal, { AdminTextarea } from "../AdminModal";

export type Abstract = {
  id: string;
  reference: string | null;
  event_slug: string | null;
  event_title: string | null;
  type: string;
  auteur_principal: string;
  email: string;
  telephone: string | null;
  co_auteurs: string | null;
  etablissement: string | null;
  titre: string;
  texte: string;
  mots_cles: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  status: Statut;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type Statut = "soumis" | "en_evaluation" | "accepte" | "refuse";

const STATUTS: Statut[] = ["soumis", "en_evaluation", "accepte", "refuse"];

const STATUT_META: Record<Statut, { label: string; bg: string; fg: string }> = {
  soumis: { label: "Soumis", bg: "#eff6ff", fg: "#1d4ed8" },
  en_evaluation: { label: "En évaluation", bg: "#fff7ed", fg: "#c2410c" },
  accepte: { label: "Accepté", bg: "#E8F9F7", fg: "#065E52" },
  refuse: { label: "Refusé", bg: "#fef2f2", fg: "#b91c1c" },
};

const TYPE_LABELS: Record<string, string> = {
  oral: "Communication orale",
  poster: "Poster",
};

function reference(a: Abstract) {
  return a.reference ?? `ABS-${new Date(a.created_at).getFullYear()}-${a.id.slice(0, 6).toUpperCase()}`;
}

function typeLabel(a: Abstract) {
  return TYPE_LABELS[a.type] ?? a.type;
}

function countWords(s: string | null) {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} Ko`
    : `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

export default function AbstractsManager({
  initialAbstracts, loadError,
}: { initialAbstracts: Abstract[]; loadError: string | null }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [all] = useState<Abstract[]>(initialAbstracts);
  const [statutFilter, setStatutFilter] = useState<Statut | "all">("all");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Abstract | null>(null);
  const [reviewing, setReviewing] = useState<{
    abs: Abstract; status: Statut; note: string; notify: boolean;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Abstract | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: all.length };
    for (const s of STATUTS) c[s] = all.filter((a) => a.status === s).length;
    return c;
  }, [all]);

  const filtered = useMemo(() => {
    let list = statutFilter === "all" ? all : all.filter((a) => a.status === statutFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((a) =>
        [a.titre, a.auteur_principal, a.email, a.co_auteurs, a.etablissement, a.mots_cles, a.reference, a.texte]
          .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return list;
  }, [all, statutFilter, query]);

  async function saveReview() {
    if (!reviewing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/abstracts/${reviewing.abs.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: reviewing.status,
          review_note: reviewing.note,
          notify: reviewing.notify,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash(
        data.warning ? "err" : "ok",
        data.warning ?? (reviewing.notify ? "✓ Statut enregistré et auteur notifié par email" : "✓ Statut enregistré")
      );
      setReviewing(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function handleDelete(a: Abstract) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/abstracts/${a.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Abstract supprimé");
      setConfirmDelete(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  const exportUrl = statutFilter === "all"
    ? "/api/admin/abstracts/export"
    : `/api/admin/abstracts/export?status=${statutFilter}`;

  const notifiable = reviewing?.status === "accepte" || reviewing?.status === "refuse";

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-white sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Abstracts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} soumission{filtered.length > 1 ? "s" : ""}
            {statutFilter !== "all" && ` · ${STATUT_META[statutFilter].label}`}
          </p>
        </div>
        <a href={exportUrl}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
          <Download className="w-4 h-4" /> Exporter en Excel
        </a>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-6">
        {loadError && (
          <div className="mb-5 p-4 rounded-xl border flex items-start gap-2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{loadError} — vérifie que la table <code>abstracts</code> est créée.</p>
          </div>
        )}

        {/* Filtres par statut */}
        <div className="flex flex-wrap gap-2 mb-4">
          <FilterPill active={statutFilter === "all"} onClick={() => setStatutFilter("all")}
            label="Tous" count={counts.all} />
          {STATUTS.map((s) => (
            <FilterPill key={s} active={statutFilter === s} onClick={() => setStatutFilter(s)}
              label={STATUT_META[s].label} count={counts[s]} color={STATUT_META[s].fg} />
          ))}
        </div>

        <div className="mb-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par titre, auteur, référence, mots clés, établissement…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all" />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <FileSignature className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-700 text-base">
              {all.length === 0 ? "Aucun abstract soumis" : "Aucun résultat"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {all.length === 0
                ? "Les soumissions apparaîtront ici dès qu'un auteur remplira le formulaire de la page Abstracts."
                : "Essayez un autre terme de recherche."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => {
              const meta = STATUT_META[a.status] ?? STATUT_META.soumis;
              return (
                <div key={a.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "#E8F9F7", color: "#065E52" }}>
                        {a.type === "oral" ? <Mic className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: meta.bg, color: meta.fg }}>
                            {meta.label}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">{typeLabel(a)}</span>
                          <span className="text-[10px] font-mono text-gray-300">{reference(a)}</span>
                          <span className="text-[10px] text-gray-400 ml-auto">{formatDate(a.created_at)}</span>
                        </div>
                        <h3 className="font-black text-gray-900 text-sm leading-snug mb-1.5">{a.titre}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                            {a.auteur_principal}
                          </span>
                          <a href={`mailto:${a.email}`} className="flex items-center gap-1.5 hover:text-[#31B9AE]">
                            <Mail className="w-3 h-3" /> {a.email}
                          </a>
                          {a.telephone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {a.telephone}</span>}
                          {a.etablissement && <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {a.etablissement}</span>}
                          <span className="text-gray-400">{countWords(a.texte)} mots</span>
                        </div>
                        {a.co_auteurs && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                            <Users className="w-3 h-3 shrink-0" /> {a.co_auteurs}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-2">{a.texte}</p>
                  </div>

                  {a.mots_cles && (
                    <div className="mx-4 mb-3 flex flex-wrap gap-1.5">
                      {a.mots_cles.split(/[,;]/).map((m) => m.trim()).filter(Boolean).map((m) => (
                        <span key={m} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "#f1f5f9", color: "#475569" }}>{m}</span>
                      ))}
                    </div>
                  )}
                  {a.review_note && (
                    <div className="mx-4 mb-3 p-3 rounded-lg border-l-2" style={{ background: "#f8fafc", borderColor: "#31B9AE" }}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Commentaire du comité{a.reviewed_at ? ` · ${formatDate(a.reviewed_at)}` : ""}
                      </p>
                      <p className="text-xs text-gray-600">{a.review_note}</p>
                    </div>
                  )}

                  <div className="px-4 pb-4 flex flex-wrap gap-2">
                    <button onClick={() => setViewing(a)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                      <Eye className="w-3 h-3" /> Lire l&apos;abstract
                    </button>
                    {a.file_url && (
                      <a href={a.file_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 text-[#065E52] hover:bg-[#E8F9F7]"
                        style={{ borderColor: "#31B9AE" }}>
                        <Paperclip className="w-3 h-3" /> {a.file_name ?? "Fichier"} {formatSize(a.file_size) && `· ${formatSize(a.file_size)}`}
                      </a>
                    )}
                    <button onClick={() => setReviewing({
                      abs: a, status: a.status, note: a.review_note ?? "", notify: false,
                    })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-white transition-all hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
                      <FileSignature className="w-3 h-3" /> Évaluer
                    </button>
                    <button onClick={() => setConfirmDelete(a)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-red-200 text-red-600 hover:bg-red-50">
                      <Trash2 className="w-3 h-3" /> Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lecture complète */}
      {viewing && (
        <AdminModal
          title={viewing.titre}
          subtitle={`${typeLabel(viewing)} · ${viewing.auteur_principal} · ${reference(viewing)}`}
          onClose={() => setViewing(null)}
          footer={
            <>
              {viewing.file_url && (
                <a href={viewing.file_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold border-2 text-[#065E52] hover:bg-[#E8F9F7]"
                  style={{ borderColor: "#31B9AE" }}>
                  <Paperclip className="w-4 h-4" /> Télécharger le fichier
                </a>
              )}
              <button onClick={() => setViewing(null)}
                className="ml-auto px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                Fermer
              </button>
            </>
          }
        >
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Auteur principal" value={viewing.auteur_principal} />
            <Info label="Email" value={viewing.email} />
            {viewing.telephone && <Info label="Téléphone" value={viewing.telephone} />}
            {viewing.etablissement && <Info label="Service / Établissement" value={viewing.etablissement} />}
            {viewing.co_auteurs && <Info label="Co-auteurs" value={viewing.co_auteurs} full />}
            <Info label="Événement cible" value={viewing.event_title ?? "—"} />
            <Info label="Nombre de mots" value={String(countWords(viewing.texte))} />
            {viewing.mots_cles && <Info label="Mots clés" value={viewing.mots_cles} full />}
          </dl>
          <div className="p-4 rounded-xl border-l-2" style={{ background: "#f8fafc", borderColor: "#31B9AE" }}>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Résumé</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap text-justify">{viewing.texte}</p>
          </div>
        </AdminModal>
      )}

      {/* Évaluation */}
      {reviewing && (
        <AdminModal
          title="Évaluer l'abstract"
          subtitle={`${reviewing.abs.titre.slice(0, 70)}${reviewing.abs.titre.length > 70 ? "…" : ""}`}
          onClose={() => setReviewing(null)}
          footer={
            <>
              <button onClick={() => setReviewing(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={saveReview} disabled={saving}
                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" />
                  : reviewing.notify ? <Send className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {reviewing.notify ? "Enregistrer et notifier" : "Enregistrer"}
              </button>
            </>
          }
        >
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Statut</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUTS.map((s) => {
                const m = STATUT_META[s];
                const on = reviewing.status === s;
                return (
                  <button key={s} type="button"
                    onClick={() => setReviewing({ ...reviewing, status: s, notify: false })}
                    className={`px-3 py-3 rounded-xl text-sm font-black border-2 transition-all ${
                      on ? "shadow-sm" : "border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                    style={on ? { background: m.bg, color: m.fg, borderColor: m.fg } : {}}>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <AdminTextarea label="Commentaire du comité" value={reviewing.note} rows={4}
            onChange={(v) => setReviewing({ ...reviewing, note: v })}
            placeholder="Remarques du comité sur ce travail…"
            hint="Conservé dans le back-office. Il n'est transmis à l'auteur que si vous cochez l'envoi de l'email ci-dessous." />

          {notifiable ? (
            <label className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors"
              style={{
                background: reviewing.notify ? "#E8F9F7" : "#f8fafc",
                borderColor: reviewing.notify ? "#31B9AE" : "#e5e7eb",
              }}>
              <input type="checkbox" checked={reviewing.notify}
                onChange={(e) => setReviewing({ ...reviewing, notify: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-[#31B9AE]" />
              <span>
                <span className="block text-sm font-black text-gray-900">
                  Envoyer la décision par email à l&apos;auteur
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  Un email {reviewing.status === "accepte" ? "d'acceptation" : "de refus"} sera envoyé à{" "}
                  <strong>{reviewing.abs.email}</strong>, avec le commentaire ci-dessus. Décoché, rien n&apos;est envoyé.
                </span>
              </span>
            </label>
          ) : (
            <p className="text-xs text-gray-400 px-1">
              L&apos;email de décision n&apos;est proposé que pour les statuts « Accepté » et « Refusé ».
            </p>
          )}
        </AdminModal>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Supprimer cet abstract ?</h3>
            <p className="text-sm text-gray-500 mb-6">
              « {confirmDelete.titre.slice(0, 80)} » et son fichier joint seront définitivement supprimés.
              Action irréversible — exportez d&apos;abord en Excel si besoin.
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] max-w-md px-5 py-3 rounded-xl shadow-2xl font-bold text-sm text-white text-center"
          style={{ background: toast.type === "ok" ? "#31B9AE" : "#dc2626" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function Info({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</dt>
      <dd className="text-sm text-gray-800 font-semibold mt-0.5 break-words">{value}</dd>
    </div>
  );
}

function FilterPill({ active, onClick, label, count, color }: {
  active: boolean; onClick: () => void; label: string; count: number; color?: string;
}) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
        active ? "text-white shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
      }`}
      style={active ? { background: color ?? "#31B9AE", borderColor: color ?? "#31B9AE" } : {}}>
      {label}
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black tabular-nums ${
        active ? "bg-white/25" : "bg-gray-100 text-gray-500"
      }`}>
        {count}
      </span>
    </button>
  );
}
