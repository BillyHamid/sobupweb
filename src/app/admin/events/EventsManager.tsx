"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Image as ImageIcon, Star, Eye, EyeOff,
  X, Save, AlertTriangle, Upload, Loader2, Calendar, MapPin, Users,
  Paperclip, FileText, Download,
} from "lucide-react";

type Event = {
  id: string;
  slug: string;
  type: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  event_date: string;          // ISO date
  display_date: string;
  time_range: string | null;
  location: string;
  gtt: string | null;
  image_url: string | null;
  badge_label: string;
  badge_color: string;
  badge_bg: string;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_size: number | null;
  has_page: boolean;
  published: boolean;
  featured: boolean;
};

const TYPES = [
  "Congrès", "Journée", "EPU", "Formation", "Webinaire", "Atelier", "Conférence",
  "Appel à candidatures",
];

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

const BADGE_PRESETS = [
  { label: "À venir", color: "#64748b", bg: "#f1f5f9" },
  { label: "Inscriptions ouvertes", color: "#259689", bg: "#E8F9F7" },
  { label: "Complet", color: "#dc2626", bg: "#fef2f2" },
  { label: "Reporté", color: "#d97706", bg: "#fef3c7" },
  { label: "Terminé", color: "#475569", bg: "#e2e8f0" },
];

type EditState = {
  id?: string;
  type: string;
  title: string;
  excerpt: string;
  description: string;
  event_date: string;
  display_date: string;
  time_range: string;
  location: string;
  gtt: string;
  image_url: string;
  badge_label: string;
  badge_color: string;
  badge_bg: string;
  attachment_url: string;
  attachment_name: string;
  attachment_size: number | null;
  has_page: boolean;
  published: boolean;
  featured: boolean;
};

const EMPTY: EditState = {
  type: "Atelier", title: "", excerpt: "", description: "",
  event_date: "", display_date: "", time_range: "", location: "", gtt: "",
  image_url: "", badge_label: "À venir", badge_color: "#64748b", badge_bg: "#f1f5f9",
  attachment_url: "", attachment_name: "", attachment_size: null,
  has_page: false, published: true, featured: false,
};

export default function EventsManager({ initialEvents, loadError }: { initialEvents: Event[]; loadError: string | null }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [events] = useState<Event[]>(initialEvents);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function openNew() { setEditing({ ...EMPTY }); }
  function openEdit(e: Event) {
    setEditing({
      id: e.id, type: e.type, title: e.title,
      excerpt: e.excerpt ?? "", description: e.description ?? "",
      event_date: e.event_date, display_date: e.display_date,
      time_range: e.time_range ?? "", location: e.location, gtt: e.gtt ?? "",
      image_url: e.image_url ?? "",
      badge_label: e.badge_label, badge_color: e.badge_color, badge_bg: e.badge_bg,
      attachment_url: e.attachment_url ?? "",
      attachment_name: e.attachment_name ?? "",
      attachment_size: e.attachment_size ?? null,
      has_page: e.has_page, published: e.published, featured: e.featured,
    });
  }

  async function handleAttachmentUpload(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file || !editing) return;
    setUploadingFile(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/events/upload-file", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Upload échoué"); return; }
      setEditing((s) => s ? {
        ...s,
        attachment_url: data.url,
        attachment_name: data.name,
        attachment_size: data.size,
      } : s);
      flash("ok", "✓ Fichier joint");
    } catch { flash("err", "Connexion impossible."); }
    finally { setUploadingFile(false); ev.target.value = ""; }
  }

  async function handleImageUpload(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/events/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Upload échoué"); return; }
      setEditing((s) => s ? { ...s, image_url: data.url } : s);
      flash("ok", "✓ Image uploadée");
    } catch { flash("err", "Connexion impossible."); }
    finally { setUploading(false); ev.target.value = ""; }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.event_date || !editing.display_date.trim() || !editing.location.trim()) {
      flash("err", "Titre, date, date affichée et lieu obligatoires.");
      return;
    }
    setSaving(true);
    try {
      const url = editing.id ? `/api/admin/events/${editing.id}` : "/api/admin/events";
      const method = editing.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editing,
          excerpt: editing.excerpt || null,
          description: editing.description || null,
          time_range: editing.time_range || null,
          gtt: editing.gtt || null,
          image_url: editing.image_url || null,
          attachment_url: editing.attachment_url || null,
          attachment_name: editing.attachment_name || null,
          attachment_size: editing.attachment_size ?? null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", editing.id ? "✓ Événement modifié" : "✓ Événement créé");
      setEditing(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Événement supprimé");
      setConfirmDelete(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-white sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Événements</h1>
          <p className="text-sm text-gray-500 mt-0.5">{events.length} événement{events.length > 1 ? "s" : ""} · gestion de l&apos;agenda public</p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
          <Plus className="w-4 h-4" /> Nouvel événement
        </button>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-6">
        {loadError && (
          <div className="mb-5 p-4 rounded-xl border flex items-start gap-2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{loadError} — vérifie que la table <code>events</code> a été créée.</p>
          </div>
        )}

        {events.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-700 text-base mb-1">Aucun événement</p>
            <p className="text-sm text-gray-400 mb-5">Importez les 4 événements actuels du site ou créez-en un nouveau.</p>
            <button disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  const res = await fetch("/api/admin/events/seed", { method: "POST" });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
                  flash("ok", `✓ ${data.inserted} événement(s) importé(s)`);
                  startTransition(() => router.refresh());
                } catch { flash("err", "Connexion impossible."); }
                finally { setSaving(false); }
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 transition-colors disabled:opacity-60"
              style={{ borderColor: "#31B9AE", color: "#31B9AE" }}>
              📥 Importer les 4 événements existants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
                <div className="md:w-56 h-44 md:h-auto shrink-0 relative bg-gray-100">
                  {ev.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full shadow-sm"
                      style={{ background: "#7c3aed" }}>
                      {ev.type}
                    </span>
                    {ev.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full shadow-sm"
                        style={{ background: "#e67e22" }}>
                        <Star className="w-2.5 h-2.5" />
                      </span>
                    )}
                    {!ev.published && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full shadow-sm bg-gray-500">
                        <EyeOff className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-black text-gray-900 text-base leading-tight">{ev.title}</h3>
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: ev.badge_bg, color: ev.badge_color }}>
                      {ev.badge_label}
                    </span>
                  </div>
                  {ev.excerpt && <p className="text-xs text-gray-500 line-clamp-2 mb-3">{ev.excerpt}</p>}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
                    <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {ev.display_date}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {ev.location}</span>
                    {ev.gtt && <span className="inline-flex items-center gap-1.5" style={{ color: "#31B9AE" }}><Users className="w-3.5 h-3.5" /> {ev.gtt}</span>}
                    {ev.attachment_url && (
                      <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: "#d97706" }}
                        title={ev.attachment_name ?? "Document joint"}>
                        <Paperclip className="w-3.5 h-3.5" />
                        {ev.attachment_name
                          ? (ev.attachment_name.length > 28 ? ev.attachment_name.slice(0, 28) + "…" : ev.attachment_name)
                          : "Document joint"}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex gap-2">
                    <button onClick={() => openEdit(ev)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                      style={{ borderColor: "#31B9AE", color: "#31B9AE" }}>
                      <Pencil className="w-3 h-3" /> Modifier
                    </button>
                    <button onClick={() => setConfirmDelete(ev.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                      style={{ borderColor: "#fecaca", color: "#dc2626" }}>
                      <Trash2 className="w-3 h-3" /> Supprimer
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
        <div className="fixed inset-0 z-40 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="bg-white w-full max-w-2xl flex flex-col shadow-2xl sm:rounded-2xl sm:max-h-[min(94vh,900px)]">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-black text-gray-900 text-lg">
                {editing.id ? "Modifier l'événement" : "Nouvel événement"}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1 min-h-0 space-y-4">
              <Field label="Titre *" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Ex : 2ème session de l'École de l'Asthme" />
              <div className="grid sm:grid-cols-2 gap-3">
                <SelectField label="Type *" value={editing.type} options={TYPES} onChange={(v) => setEditing({ ...editing, type: v })} />
                <DateField label="Date (pour tri) *" value={editing.event_date} onChange={(v) => setEditing({ ...editing, event_date: v })} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Date affichée *" value={editing.display_date} onChange={(v) => setEditing({ ...editing, display_date: v })} placeholder="Ex : 19 – 21 Novembre 2026" />
                <Field label="Horaire (optionnel)" value={editing.time_range} onChange={(v) => setEditing({ ...editing, time_range: v })} placeholder="Ex : 15h30 – 17h30" />
              </div>
              <Field label="Lieu *" value={editing.location} onChange={(v) => setEditing({ ...editing, location: v })} placeholder="Ex : CHUP Charles de Gaulle, Ouagadougou" />
              <Field label="GTT organisateur (optionnel)" value={editing.gtt} onChange={(v) => setEditing({ ...editing, gtt: v })} placeholder="Ex : GT Tuberculose" />
              <Field label="Résumé (1-2 phrases)" value={editing.excerpt} onChange={(v) => setEditing({ ...editing, excerpt: v })} placeholder="Court résumé visible sur la liste" />

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">Image de couverture</label>
                {editing.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-100 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editing.image_url} alt="Aperçu" className="w-full h-40 object-cover" />
                    <button onClick={() => setEditing({ ...editing, image_url: "" })}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 text-xs font-bold text-red-600 shadow-sm">
                      Retirer
                    </button>
                  </div>
                ) : null}
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Upload…" : (editing.image_url ? "Remplacer" : "Téléverser une image")}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                </label>
                <p className="text-[11px] text-gray-400 mt-1">JPG/PNG/WEBP — 5 Mo max. Recommandé : 1200×600.</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">Description complète (optionnelle)</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4}
                  placeholder="Détails sur le programme, les intervenants, le public visé…"
                  className="w-full px-3.5 py-3 rounded-lg border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all resize-y" />
              </div>

              {/* ── Fichier joint ── */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
                  Document joint (optionnel)
                </label>
                {editing.attachment_url ? (
                  <div className="rounded-xl p-3.5 border-2 mb-2 flex items-center gap-3"
                    style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                    <span className="w-10 h-11 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                      <FileText className="w-5 h-5 text-white" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{editing.attachment_name || "Document"}</p>
                      <p className="text-[11px] text-amber-700">{formatSize(editing.attachment_size)}</p>
                    </div>
                    <a href={editing.attachment_url} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors shrink-0"
                      title="Ouvrir le document">
                      <Download className="w-4 h-4" />
                    </a>
                    <button type="button"
                      onClick={() => setEditing({ ...editing, attachment_url: "", attachment_name: "", attachment_size: null })}
                      className="p-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 transition-colors shrink-0"
                      title="Retirer le document">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                  {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                  {uploadingFile ? "Téléversement…" : (editing.attachment_url ? "Remplacer le document" : "Joindre un document")}
                  <input type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                    onChange={handleAttachmentUpload} disabled={uploadingFile} className="hidden" />
                </label>
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                  PDF, Word, Excel, PowerPoint, JPG ou PNG — 20 Mo max.
                  Le visiteur pourra le télécharger depuis la fiche de l&apos;événement
                  (programme, plaquette, formulaire d&apos;inscription…).
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">Badge de statut</label>
                <div className="flex flex-wrap gap-2">
                  {BADGE_PRESETS.map((b) => (
                    <button key={b.label} type="button"
                      onClick={() => setEditing({ ...editing, badge_label: b.label, badge_color: b.color, badge_bg: b.bg })}
                      className={`text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${
                        editing.badge_label === b.label ? "ring-2 ring-offset-2" : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ background: b.bg, color: b.color, ...(editing.badge_label === b.label ? { boxShadow: `0 0 0 2px ${b.color}` } : {}) }}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#31B9AE]" />
                  <Eye className="w-4 h-4 text-gray-400" /> Publié
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-orange-500" />
                  <Star className="w-4 h-4 text-orange-500" /> À la une (page d&apos;accueil)
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editing.has_page} onChange={(e) => setEditing({ ...editing, has_page: e.target.checked })}
                    className="w-4 h-4 rounded accent-purple-500" />
                  Page dédiée
                </label>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                « Page dédiée » : si coché, le clic mène vers <code>/evenements/{editing.id ? "<slug>" : "[slug]"}</code> au lieu d&apos;ouvrir un popup. À réserver aux gros événements (Congrès, Journée Régionale) qui ont leur propre page développée.
              </p>
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3 items-center shrink-0 bg-white">
              <button onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving}
                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Supprimer l&apos;événement ?</h3>
            <p className="text-sm text-gray-500 mb-6">Cette action est irréversible. L&apos;image sera aussi supprimée.</p>
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

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all" />
    </div>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all" />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
