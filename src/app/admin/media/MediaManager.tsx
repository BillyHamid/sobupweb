"use client";
import { uploadDirect } from "@/lib/uploadDirect";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Image as ImageIcon, Video, FileText, Upload, Loader2,
  X, AlertTriangle, Eye, EyeOff, Star, Pencil, Save,
} from "lucide-react";

export type MediaItem = {
  id: string;
  kind: "photo" | "video" | "document";
  title: string | null;
  description: string | null;
  file_url: string;
  file_path: string | null;
  file_size_bytes: number | null;
  file_type: string | null;
  album_ordinal: string | null;
  album_year: string | null;
  gtt: string | null;
  display_date: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
};

type Tab = "photo" | "video" | "document";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: "photo", label: "Photos", icon: ImageIcon, color: "#3b82f6" },
  { id: "video", label: "Vidéos", icon: Video, color: "#f43f5e" },
  { id: "document", label: "Documents", icon: FileText, color: "#f59e0b" },
];

const ACCEPT: Record<Tab, string> = {
  photo: "image/jpeg,image/png,image/webp",
  video: "video/mp4,video/quicktime",
  document: "application/pdf",
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

type EditState = {
  id?: string;
  title: string;
  description: string;
  album_ordinal: string;
  album_year: string;
  gtt: string;
  display_date: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: EditState = {
  title: "", description: "", album_ordinal: "", album_year: "",
  gtt: "", display_date: "", featured: false, published: true,
};

export default function MediaManager({ initialItems, loadError }: { initialItems: MediaItem[]; loadError: string | null }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [items] = useState<MediaItem[]>(initialItems);
  const [tab, setTab] = useState<Tab>("photo");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  const filtered = useMemo(() => items.filter((i) => i.kind === tab), [items, tab]);
  const counts = useMemo(() => ({
    photo: items.filter((i) => i.kind === "photo").length,
    video: items.filter((i) => i.kind === "video").length,
    document: items.filter((i) => i.kind === "document").length,
  }), [items]);

  // Groupement des photos par album
  const photoAlbums = useMemo(() => {
    if (tab !== "photo") return null;
    const groups: Record<string, MediaItem[]> = {};
    for (const it of filtered) {
      const key = `${it.album_ordinal ?? "Sans album"} — ${it.album_year ?? "?"}`;
      (groups[key] ??= []).push(it);
    }
    return Object.entries(groups);
  }, [filtered, tab]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    let success = 0, failed = 0;
    let lastError = "";
    for (const file of Array.from(files)) {
      try {
        // Envoi direct vers Supabase : les vidéos dépassent largement la
        // limite de 4,5 Mo imposée par Vercel aux fonctions serverless.
        const data = await uploadDirect(file, { bucket: "media", folder: tab });
        await fetch("/api/admin/media", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: tab,
            title: tab !== "photo" ? file.name.replace(/\.[^.]+$/, "") : null,
            file_url: data.url, file_path: data.path,
            file_size_bytes: data.size, file_type: file.type,
          }),
        });
        success++;
      } catch (err) {
        lastError = err instanceof Error ? err.message : "erreur inconnue";
        console.warn("[media/upload]", file.name, lastError);
        failed++;
      }
    }
    if (success) flash("ok", `✓ ${success} fichier${success > 1 ? "s" : ""} uploadé${success > 1 ? "s" : ""}${failed ? ` · ${failed} échoué${failed > 1 ? "s" : ""}` : ""}`);
    else if (failed) flash("err", `${failed} upload${failed > 1 ? "s" : ""} échoué${failed > 1 ? "s" : ""} — ${lastError}`);
    setUploading(false);
    e.target.value = "";
    startTransition(() => router.refresh());
  }

  function openEdit(item: MediaItem) {
    setEditing({
      id: item.id,
      title: item.title ?? "", description: item.description ?? "",
      album_ordinal: item.album_ordinal ?? "", album_year: item.album_year ?? "",
      gtt: item.gtt ?? "", display_date: item.display_date ?? "",
      featured: item.featured, published: item.published,
    });
  }

  async function handleSaveEdit() {
    if (!editing?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media/${editing.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title || null,
          description: editing.description || null,
          album_ordinal: editing.album_ordinal || null,
          album_year: editing.album_year || null,
          gtt: editing.gtt || null,
          display_date: editing.display_date || null,
          featured: editing.featured,
          published: editing.published,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Modifié");
      setEditing(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function handleDelete(item: MediaItem) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Supprimé");
      setConfirmDelete(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function seedInitial() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/media/seed", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      if (data.skipped) flash("ok", data.message);
      else flash("ok", `✓ ${data.inserted} médias importés`);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-white sticky top-0 z-30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-gray-900">Médiathèque</h1>
            <p className="text-sm text-gray-500 mt-0.5">Photos, vidéos et documents publics</p>
          </div>
          <label
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer ${
              uploading ? "opacity-60 pointer-events-none" : ""
            }`}
            style={{ background: `linear-gradient(135deg, ${activeTab.color} 0%, ${activeTab.color}CC 100%)` }}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Upload en cours…" : `Ajouter ${tab === "photo" ? "des photos" : tab === "video" ? "une vidéo" : "un document"}`}
            <input type="file" accept={ACCEPT[tab]} multiple={tab === "photo"}
              onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
        </div>

        {/* Onglets */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl w-fit">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  active ? "text-white shadow-sm" : "text-gray-500 hover:bg-white"
                }`}
                style={active ? { background: t.color } : {}}>
                <Icon className="w-4 h-4" /> {t.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${active ? "bg-white/25" : "bg-gray-200 text-gray-500"}`}>
                  {counts[t.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-6">
        {loadError && (
          <div className="mb-5 p-4 rounded-xl border flex items-start gap-2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{loadError} — vérifie que la table <code>media_items</code> est créée.</p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <p className="font-black text-gray-700 text-base mb-1">Médiathèque vide</p>
            <p className="text-sm text-gray-400 mb-5">Importez les 46 médias existants du site en un clic, ou uploadez de nouveaux fichiers.</p>
            <button onClick={seedInitial} disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 transition-colors disabled:opacity-60"
              style={{ borderColor: "#31B9AE", color: "#31B9AE" }}>
              📥 Importer les médias existants
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <p className="font-black text-gray-700">Aucun {activeTab.label.toLowerCase().slice(0, -1)} pour l&apos;instant.</p>
            <p className="text-sm text-gray-400 mt-1">Cliquez sur « Ajouter » en haut à droite.</p>
          </div>
        ) : tab === "photo" && photoAlbums ? (
          <div className="space-y-8">
            {photoAlbums.map(([album, list]) => (
              <div key={album}>
                <div className="flex items-baseline justify-between mb-3 pb-2 border-b-2" style={{ borderColor: "#eff6ff" }}>
                  <h3 className="font-black text-gray-900 text-lg">{album}</h3>
                  <span className="text-xs font-bold text-gray-400">{list.length} photo{list.length > 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {list.map((it) => (
                    <PhotoCard key={it.id} item={it} onEdit={() => openEdit(it)} onDelete={() => setConfirmDelete(it)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((it) =>
              tab === "video"
                ? <VideoRow key={it.id} item={it} onEdit={() => openEdit(it)} onDelete={() => setConfirmDelete(it)} />
                : <DocumentRow key={it.id} item={it} onEdit={() => openEdit(it)} onDelete={() => setConfirmDelete(it)} />
            )}
          </div>
        )}
      </div>

      {/* Modal édition */}
      {editing && (
        <div className="fixed inset-0 z-40 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="bg-white w-full max-w-lg flex flex-col shadow-2xl sm:rounded-2xl sm:max-h-[min(94vh,900px)]">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-black text-gray-900 text-lg">Modifier le média</h3>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1 min-h-0 space-y-4">
              {tab === "photo" ? (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Album" value={editing.album_ordinal} onChange={(v) => setEditing({ ...editing, album_ordinal: v })} placeholder="Ex : 1ᵉʳ Congrès" />
                  <Field label="Année" value={editing.album_year} onChange={(v) => setEditing({ ...editing, album_year: v })} placeholder="2026" />
                </div>
              ) : (
                <>
                  <Field label="Titre" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
                  <Field label="GTT / Organisateur" value={editing.gtt} onChange={(v) => setEditing({ ...editing, gtt: v })} />
                </>
              )}
              {tab === "document" && (
                <>
                  <Field label="Date affichée" value={editing.display_date} onChange={(v) => setEditing({ ...editing, display_date: v })} placeholder="Ex : Avril 2026" />
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">Description</label>
                    <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3}
                      className="w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all resize-y" />
                  </div>
                </>
              )}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#31B9AE]" />
                  <Eye className="w-4 h-4 text-gray-400" /> Publié
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-orange-500" />
                  <Star className="w-4 h-4 text-orange-500" /> À la une
                </label>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3 items-center shrink-0 bg-white">
              <button onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSaveEdit} disabled={saving}
                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Supprimer ce média ?</h3>
            <p className="text-sm text-gray-500 mb-6">Le fichier sera aussi supprimé du stockage. Action irréversible.</p>
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

function PhotoCard({ item, onEdit, onDelete }: { item: MediaItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.file_url} alt="" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-1.5">
        <button onClick={onEdit}
          className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Modifier"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={onDelete}
          className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
      {!item.published && (
        <span className="absolute top-1.5 left-1.5 text-[9px] font-black uppercase text-white px-1.5 py-0.5 rounded bg-gray-700/80">Brouillon</span>
      )}
    </div>
  );
}

function VideoRow({ item, onEdit, onDelete }: { item: MediaItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
      <div className="sm:w-48 h-40 sm:h-auto shrink-0 bg-black">
        <video src={`${item.file_url}#t=0.5`} controls preload="metadata" playsInline className="w-full h-full object-cover" />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-black text-gray-900 text-sm">{item.title ?? "Sans titre"}</h4>
              {item.featured && <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />}
              {!item.published && <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
            </div>
            {item.gtt && <p className="text-xs font-semibold" style={{ color: "#f43f5e" }}>{item.gtt}</p>}
            <p className="text-[11px] text-gray-400 mt-1">{formatSize(item.file_size_bytes)}</p>
          </div>
        </div>
        <div className="mt-auto flex gap-2">
          <button onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
            <Pencil className="w-3 h-3" /> Modifier
          </button>
          <button onClick={onDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 className="w-3 h-3" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({ item, onEdit, onDelete }: { item: MediaItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
      <div className="w-12 h-14 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
        <FileText className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4 className="font-black text-gray-900 text-sm">{item.title ?? "Sans titre"}</h4>
          {item.featured && <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />}
          {!item.published && <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
        </div>
        {item.description && <p className="text-xs text-gray-500 line-clamp-2 mb-1">{item.description}</p>}
        <div className="flex flex-wrap gap-3 text-[11px] text-gray-400">
          {item.gtt && <span>{item.gtt}</span>}
          {item.display_date && <span>· {item.display_date}</span>}
          {item.file_size_bytes && <span>· {formatSize(item.file_size_bytes)}</span>}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <a href={item.file_url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
          Ouvrir
        </a>
        <button onClick={onEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
          <Pencil className="w-3 h-3" />
        </button>
        <button onClick={onDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-red-200 text-red-600 hover:bg-red-50">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
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
