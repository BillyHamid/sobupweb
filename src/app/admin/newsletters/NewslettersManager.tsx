"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Save, Loader2, Upload, AlertTriangle,
  FileText, Eye, EyeOff, Newspaper, ExternalLink, ArrowUp, ArrowDown,
} from "lucide-react";
import AdminModal, { AdminField, AdminTextarea } from "../AdminModal";

export type Highlight = { icon: string; label: string; desc: string };

export type Newsletter = {
  id: string;
  numero: number;
  title: string;
  period: string;
  description: string | null;
  highlights: Highlight[] | null;
  cover_url: string | null;
  pdf_url: string;
  pdf_size: string | null;
  published_at: string;
  published: boolean;
};

type EditState = {
  id?: string;
  numero: string;
  title: string;
  period: string;
  description: string;
  highlights: Highlight[];
  cover_url: string;
  pdf_url: string;
  pdf_size: string;
  published_at: string;
  published: boolean;
};

const EMPTY: EditState = {
  numero: "", title: "Newsletter SOBUP", period: "", description: "",
  highlights: [{ icon: "📰", label: "", desc: "" }],
  cover_url: "", pdf_url: "", pdf_size: "",
  published_at: new Date().toISOString().slice(0, 10),
  published: true,
};

const ICON_SUGGESTIONS = ["🏛️", "📜", "🎖️", "🔬", "📰", "🩺", "🫁", "🎓", "🤝", "📊", "🌍", "💡"];

export default function NewslettersManager({
  initialNewsletters, loadError,
}: { initialNewsletters: Newsletter[]; loadError: string | null }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [items] = useState<Newsletter[]>(initialNewsletters);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Newsletter | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function openNew() {
    const nextNum = items.length > 0 ? Math.max(...items.map((n) => n.numero)) + 1 : 1;
    setEditing({ ...EMPTY, numero: String(nextNum) });
  }

  function openEdit(n: Newsletter) {
    setEditing({
      id: n.id,
      numero: String(n.numero),
      title: n.title,
      period: n.period,
      description: n.description ?? "",
      highlights: (n.highlights && n.highlights.length > 0) ? n.highlights : [{ icon: "📰", label: "", desc: "" }],
      cover_url: n.cover_url ?? "",
      pdf_url: n.pdf_url,
      pdf_size: n.pdf_size ?? "",
      published_at: n.published_at,
      published: n.published,
    });
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, kind: "pdf" | "cover") {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    kind === "pdf" ? setUploadingPdf(true) : setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);
      const res = await fetch("/api/admin/newsletters/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Upload échoué"); return; }
      setEditing((s) => s ? (kind === "pdf"
        ? { ...s, pdf_url: data.url, pdf_size: data.humanSize }
        : { ...s, cover_url: data.url }) : s);
      flash("ok", kind === "pdf" ? "✓ PDF téléversé" : "✓ Couverture téléversée");
    } catch { flash("err", "Connexion impossible."); }
    finally {
      kind === "pdf" ? setUploadingPdf(false) : setUploadingCover(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.numero || !editing.title.trim() || !editing.period.trim() || !editing.pdf_url) {
      flash("err", "Numéro, titre, période et fichier PDF sont obligatoires.");
      return;
    }
    setSaving(true);
    try {
      const url = editing.id ? `/api/admin/newsletters/${editing.id}` : "/api/admin/newsletters";
      const res = await fetch(url, {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: Number(editing.numero),
          title: editing.title.trim(),
          period: editing.period.trim(),
          description: editing.description.trim() || null,
          highlights: editing.highlights.filter((h) => h.label.trim()),
          cover_url: editing.cover_url || null,
          pdf_url: editing.pdf_url,
          pdf_size: editing.pdf_size || null,
          published_at: editing.published_at,
          published: editing.published,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", editing.id ? "✓ Newsletter modifiée" : "✓ Newsletter publiée");
      setEditing(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function handleDelete(n: Newsletter) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/newsletters/${n.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Newsletter supprimée");
      setConfirmDelete(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function seedFirst() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/newsletters/seed", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", data.skipped ? data.message : "✓ Newsletter N°1 importée");
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  function updateHighlight(i: number, field: keyof Highlight, value: string) {
    if (!editing) return;
    const next = [...editing.highlights];
    next[i] = { ...next[i], [field]: value };
    setEditing({ ...editing, highlights: next });
  }

  /** Déplace une rubrique d'un cran vers le haut (-1) ou vers le bas (+1). */
  function moveHighlight(i: number, delta: -1 | 1) {
    if (!editing) return;
    const target = i + delta;
    if (target < 0 || target >= editing.highlights.length) return;
    const next = [...editing.highlights];
    [next[i], next[target]] = [next[target], next[i]];
    setEditing({ ...editing, highlights: next });
  }

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-white sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Newsletters</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {items.length} numéro{items.length > 1 ? "s" : ""} · bulletin d&apos;information SOBUP
          </p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
          <Plus className="w-4 h-4" /> Nouveau numéro
        </button>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-6">
        {loadError && (
          <div className="mb-5 p-4 rounded-xl border flex items-start gap-2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{loadError} — vérifie que la table <code>newsletters</code> est créée.</p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <Newspaper className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-700 text-base mb-1">Aucune newsletter</p>
            <p className="text-sm text-gray-400 mb-5">
              Importez le numéro 1 existant, ou créez directement un nouveau numéro.
            </p>
            <button onClick={seedFirst} disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 transition-colors disabled:opacity-60"
              style={{ borderColor: "#31B9AE", color: "#31B9AE" }}>
              📥 Importer la Newsletter N°1
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((n) => (
              <div key={n.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" style={{ height: 220 }}>
                  {n.cover_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={n.cover_url} alt={`Couverture ${n.title} N°${n.numero}`} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <FileText className="w-12 h-12 text-gray-300" />
                  )}
                  <span className="absolute top-2 left-2 text-[11px] font-black text-white px-2.5 py-1 rounded-full shadow-sm"
                    style={{ background: "#e67e22" }}>
                    N°{n.numero}
                  </span>
                  {!n.published && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full bg-gray-600">
                      <EyeOff className="w-2.5 h-2.5" /> Brouillon
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-black text-gray-900 text-sm leading-snug">{n.title}</h3>
                  <p className="text-xs font-bold mb-2" style={{ color: "#31B9AE" }}>{n.period}</p>
                  {n.description && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{n.description}</p>}
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-3">
                    <FileText className="w-3 h-3" />
                    PDF{n.pdf_size ? ` · ${n.pdf_size}` : ""}
                    <a href={n.pdf_url} target="_blank" rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 font-bold hover:underline" style={{ color: "#31B9AE" }}>
                      Ouvrir <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <button onClick={() => openEdit(n)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all"
                      style={{ borderColor: "#31B9AE", color: "#31B9AE" }}>
                      <Pencil className="w-3 h-3" /> Modifier
                    </button>
                    <button onClick={() => setConfirmDelete(n)}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold border-2"
                      style={{ borderColor: "#fecaca", color: "#dc2626" }} title="Supprimer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal édition */}
      {editing && (
        <AdminModal
          title={editing.id ? `Modifier la Newsletter N°${editing.numero}` : "Nouveau numéro"}
          subtitle="Le numéro le plus récent apparaît en vedette sur la page Journal"
          onClose={() => setEditing(null)}
          footer={
            <>
              <button onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </>
          }
        >
          <>
            {/* ─── 1. Identification ─── */}
            <FormSection step={1} title="Identification du numéro">
              <AdminField label="Titre *" value={editing.title}
                onChange={(v) => setEditing({ ...editing, title: v })}
                placeholder="Newsletter SOBUP"
                hint="Titre principal affiché en gros sur la page Journal" />
              <div className="grid sm:grid-cols-2 gap-3">
                <AdminField label="Numéro *" value={editing.numero} type="number"
                  onChange={(v) => setEditing({ ...editing, numero: v })} placeholder="2"
                  hint="Le plus élevé passe en vedette" />
                <AdminField label="Période *" value={editing.period}
                  onChange={(v) => setEditing({ ...editing, period: v })} placeholder="Juillet 2026"
                  hint="Affiché sous le titre" />
              </div>
              <AdminTextarea label="Description" value={editing.description} rows={3}
                onChange={(v) => setEditing({ ...editing, description: v })}
                placeholder="Phrase d'accroche : de quoi parle ce numéro ?" />
            </FormSection>

            {/* ─── 2. Sommaire ─── */}
            <FormSection step={2} title="Sommaire du numéro"
              caption={`${editing.highlights.length} rubrique${editing.highlights.length > 1 ? "s" : ""} · ajoutez-en autant que nécessaire`}>
              <div className="space-y-2.5">
                {editing.highlights.map((h, i) => (
                  <div key={i}
                    className="rounded-xl border-2 border-gray-100 bg-gray-50/60 p-3 transition-colors focus-within:border-[#31B9AE]/40 focus-within:bg-white">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-black tabular-nums shrink-0"
                        style={{ background: "#E8F9F7", color: "#065E52" }}>
                        {i + 1}
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                        Rubrique {i + 1}
                      </span>
                      <div className="ml-auto flex items-center gap-0.5">
                        <button type="button" onClick={() => moveHighlight(i, -1)} disabled={i === 0}
                          className="p-1.5 rounded-md text-gray-400 hover:bg-white hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Monter" aria-label={`Monter la rubrique ${i + 1}`}>
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => moveHighlight(i, 1)} disabled={i === editing.highlights.length - 1}
                          className="p-1.5 rounded-md text-gray-400 hover:bg-white hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          title="Descendre" aria-label={`Descendre la rubrique ${i + 1}`}>
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {editing.highlights.length > 1 && (
                          <button type="button"
                            onClick={() => setEditing({ ...editing, highlights: editing.highlights.filter((_, j) => j !== i) })}
                            className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors ml-0.5"
                            title="Supprimer cette rubrique" aria-label={`Supprimer la rubrique ${i + 1}`}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="shrink-0">
                        <input value={h.icon} onChange={(e) => updateHighlight(i, "icon", e.target.value)}
                          maxLength={4} aria-label={`Icône de la rubrique ${i + 1}`}
                          className="w-14 px-2 py-2 rounded-lg border-2 border-gray-100 bg-white text-xl text-center focus:border-[#31B9AE] focus:outline-none" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <input value={h.label} onChange={(e) => updateHighlight(i, "label", e.target.value)}
                          placeholder="Titre de la rubrique — ex. Vie de la société"
                          className="w-full px-3 py-2 rounded-lg border-2 border-gray-100 text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal bg-white focus:border-[#31B9AE] focus:outline-none" />
                        <input value={h.desc} onChange={(e) => updateHighlight(i, "desc", e.target.value)}
                          placeholder="Précision — ex. L'Assemblée Générale Élective"
                          className="w-full px-3 py-2 rounded-lg border-2 border-gray-100 text-sm text-gray-600 placeholder:text-gray-400 bg-white focus:border-[#31B9AE] focus:outline-none" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2 pl-16">
                      {ICON_SUGGESTIONS.map((ic) => (
                        <button key={ic} type="button" onClick={() => updateHighlight(i, "icon", ic)}
                          className={`w-7 h-7 rounded-md text-base leading-none transition-all ${
                            h.icon === ic ? "ring-2 ring-[#31B9AE] bg-white" : "hover:bg-white opacity-60 hover:opacity-100"
                          }`}
                          title={`Choisir ${ic}`} aria-label={`Icône ${ic}`}>
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button type="button"
                onClick={() => setEditing({ ...editing, highlights: [...editing.highlights, { icon: "📰", label: "", desc: "" }] })}
                className="w-full mt-2.5 py-2.5 rounded-xl border-2 border-dashed text-sm font-bold transition-colors hover:bg-[#E8F9F7]/50 inline-flex items-center justify-center gap-2"
                style={{ borderColor: "#31B9AE60", color: "#065E52" }}>
                <Plus className="w-4 h-4" /> Ajouter une rubrique
              </button>
            </FormSection>

            {/* ─── 3. Fichiers ─── */}
            <FormSection step={3} title="Fichiers du numéro">
              <div className="rounded-xl border-2 p-4" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: "#92400e" }}>
                  Fichier PDF *
                </label>
                {editing.pdf_url && (
                  <div className="flex items-center gap-3 mb-2.5 p-2.5 rounded-lg bg-white border border-amber-200">
                    <FileText className="w-5 h-5 shrink-0" style={{ color: "#d97706" }} />
                    <a href={editing.pdf_url} target="_blank" rel="noopener noreferrer"
                      className="flex-1 min-w-0 text-sm font-bold text-gray-900 truncate hover:underline">
                      PDF téléversé{editing.pdf_size && ` · ${editing.pdf_size}`}
                    </a>
                    <button type="button" onClick={() => setEditing({ ...editing, pdf_url: "", pdf_size: "" })}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 shrink-0">
                      Retirer
                    </button>
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 bg-white cursor-pointer hover:bg-amber-50 transition-colors"
                  style={{ borderColor: "#fde68a", color: "#92400e" }}>
                  {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadingPdf ? "Upload…" : editing.pdf_url ? "Remplacer le PDF" : "Téléverser le PDF"}
                  <input type="file" accept="application/pdf" onChange={(e) => handleUpload(e, "pdf")}
                    disabled={uploadingPdf} className="hidden" />
                </label>
                <p className="text-[11px] mt-1.5" style={{ color: "#92400e" }}>PDF uniquement · 30 Mo max</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Image de couverture
                </label>
                {editing.cover_url && (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-100 mb-2 bg-gray-50 flex items-center justify-center" style={{ height: 180 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editing.cover_url} alt="Aperçu couverture" className="max-w-full max-h-full object-contain" />
                    <button type="button" onClick={() => setEditing({ ...editing, cover_url: "" })}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 text-xs font-bold text-red-600 shadow-sm hover:bg-white">
                      Retirer
                    </button>
                  </div>
                )}
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                  {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadingCover ? "Upload…" : editing.cover_url ? "Remplacer" : "Téléverser la couverture"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleUpload(e, "cover")}
                    disabled={uploadingCover} className="hidden" />
                </label>
                <p className="text-[11px] text-gray-400 mt-1">JPG/PNG/WEBP · format portrait recommandé</p>
              </div>
            </FormSection>

            {/* ─── 4. Publication ─── */}
            <FormSection step={4} title="Publication" last>
              <div className="grid sm:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                    Date de parution
                  </label>
                  <input type="date" value={editing.published_at}
                    onChange={(e) => setEditing({ ...editing, published_at: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all" />
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer pb-2.5">
                  <input type="checkbox" checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#31B9AE]" />
                  <Eye className="w-4 h-4 text-gray-400" /> Visible sur le site
                </label>
              </div>
            </FormSection>
          </>
        </AdminModal>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Supprimer la Newsletter N°{confirmDelete.numero} ?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Le PDF et la couverture seront aussi supprimés du stockage. Action irréversible.
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

/** Section numérotée du formulaire, avec séparateur. */
function FormSection({
  step, title, caption, children, last,
}: {
  step: number; title: string; caption?: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <section className={last ? "" : "pb-5 mb-1 border-b border-gray-100"}>
      <div className="flex items-baseline gap-2.5 mb-3">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black tabular-nums shrink-0"
          style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)", color: "white" }}>
          {step}
        </span>
        <div className="min-w-0">
          <h4 className="text-sm font-black text-gray-900 leading-tight">{title}</h4>
          {caption && <p className="text-[11px] text-gray-400 mt-0.5">{caption}</p>}
        </div>
      </div>
      <div className="space-y-3 sm:pl-9">{children}</div>
    </section>
  );
}

