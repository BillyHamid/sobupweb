"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Image as ImageIcon, Star, Eye, EyeOff,
  X, Save, AlertTriangle, Upload, Loader2,
} from "lucide-react";

type Post = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  gtt: string | null;
  display_date: string | null;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

const CATEGORIES = ["Actualités", "Congrès", "Recommandations", "Recherche", "Formation", "Santé publique", "GTT"];

type EditState = {
  id?: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  gtt: string;
  display_date: string;
  published: boolean;
  featured: boolean;
};

const EMPTY: EditState = {
  title: "", category: "Actualités", excerpt: "", content: "",
  image_url: "", gtt: "", display_date: "", published: true, featured: false,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogManager({ initialPosts, loadError }: { initialPosts: Post[]; loadError: string | null }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [posts] = useState<Post[]>(initialPosts);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function openNew() {
    setEditing({ ...EMPTY });
  }
  function openEdit(p: Post) {
    setEditing({
      id: p.id, title: p.title, category: p.category, excerpt: p.excerpt ?? "",
      content: p.content, image_url: p.image_url ?? "", gtt: p.gtt ?? "",
      display_date: p.display_date ?? "", published: p.published, featured: p.featured,
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/blog/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Upload échoué"); return; }
      setEditing((s) => s ? { ...s, image_url: data.url } : s);
      flash("ok", "✓ Image uploadée");
    } catch { flash("err", "Connexion impossible."); }
    finally { setUploading(false); e.target.value = ""; }
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title.trim() || !editing.content.trim()) {
      flash("err", "Titre et contenu obligatoires.");
      return;
    }
    setSaving(true);
    try {
      const url = editing.id ? `/api/admin/blog/${editing.id}` : "/api/admin/blog";
      const method = editing.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title, category: editing.category,
          excerpt: editing.excerpt || null, content: editing.content,
          image_url: editing.image_url || null, gtt: editing.gtt || null,
          display_date: editing.display_date || null,
          published: editing.published, featured: editing.featured,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", editing.id ? "✓ Article modifié" : "✓ Article créé");
      setEditing(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Article supprimé");
      setConfirmDelete(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-white sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Actualités</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts.length} article{posts.length > 1 ? "s" : ""} · gestion du blog public</p>
        </div>
        <button onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:-translate-y-0.5 shadow-lg"
          style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      <div className="px-4 sm:px-8 py-5 sm:py-6">
        {loadError && (
          <div className="mb-5 p-4 rounded-xl border flex items-start gap-2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{loadError} — vérifie que la migration SQL <code>blog_posts</code> a été exécutée.</p>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <ImageIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-700 text-base mb-1">Aucun article pour l&apos;instant</p>
            <p className="text-sm text-gray-400 mb-5">Vous pouvez créer un nouvel article, ou importer les 10 anciens articles historiques de la SOBUP.</p>
            <button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  const res = await fetch("/api/admin/blog/seed", { method: "POST" });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
                  flash("ok", `✓ ${data.inserted} article(s) importé(s)`);
                  startTransition(() => router.refresh());
                } catch { flash("err", "Connexion impossible."); }
                finally { setSaving(false); }
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              style={{ borderColor: "#31B9AE", color: "#31B9AE" }}
            >
              📥 Importer les 10 articles existants
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="relative h-40 bg-gray-100">
                  {p.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {p.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full shadow-sm"
                        style={{ background: "#e67e22" }}>
                        <Star className="w-2.5 h-2.5" /> Vedette
                      </span>
                    )}
                    {!p.published && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full shadow-sm bg-gray-500">
                        <EyeOff className="w-2.5 h-2.5" /> Brouillon
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#31B9AE" }}>
                    {p.category}
                  </span>
                  <h3 className="font-black text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    {p.display_date ?? formatDate(p.created_at)}
                  </p>
                  <div className="mt-auto flex gap-2">
                    <button onClick={() => openEdit(p)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all"
                      style={{ borderColor: "#31B9AE", color: "#31B9AE" }}>
                      <Pencil className="w-3 h-3" /> Modifier
                    </button>
                    <button onClick={() => setConfirmDelete(p.id)}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all"
                      style={{ borderColor: "#fecaca", color: "#dc2626" }}
                      title="Supprimer">
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
        <div className="fixed inset-0 z-40 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="bg-white w-full max-w-2xl flex flex-col shadow-2xl sm:rounded-2xl sm:max-h-[min(94vh,900px)]">
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="font-black text-gray-900 text-lg">
                {editing.id ? "Modifier l'article" : "Nouvel article"}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1 min-h-0 space-y-4">
              <Field label="Titre *" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Ex : Tournée de convivialité du Bureau" />
              <div className="grid sm:grid-cols-2 gap-3">
                <SelectField label="Catégorie" value={editing.category} options={CATEGORIES}
                  onChange={(v) => setEditing({ ...editing, category: v })} />
                <Field label="Date affichée" value={editing.display_date} onChange={(v) => setEditing({ ...editing, display_date: v })} placeholder="Ex : 24 Avr 2026" />
              </div>
              <Field label="GTT (optionnel)" value={editing.gtt} onChange={(v) => setEditing({ ...editing, gtt: v })} placeholder="Ex : GT Tuberculose" />
              <Field label="Résumé (1-2 phrases)" value={editing.excerpt} onChange={(v) => setEditing({ ...editing, excerpt: v })} placeholder="Court résumé visible sur la liste du blog" />

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">Image de couverture</label>
                {editing.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-100 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={editing.image_url} alt="Aperçu" className="w-full h-44 object-cover" />
                    <button onClick={() => setEditing({ ...editing, image_url: "" })}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 text-xs font-bold text-red-600 shadow-sm hover:bg-white">
                      Retirer
                    </button>
                  </div>
                ) : null}
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Upload en cours…" : (editing.image_url ? "Remplacer l'image" : "Téléverser une image")}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload}
                    disabled={uploading} className="hidden" />
                </label>
                <p className="text-[11px] text-gray-400 mt-1">JPG, PNG ou WEBP — 5 Mo max</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">Contenu *</label>
                <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={10}
                  placeholder="Le texte complet de l'article. Sautez 2 lignes pour créer un paragraphe."
                  className="w-full px-3.5 py-3 rounded-lg border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all resize-y font-mono" />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#31B9AE]" />
                  <Eye className="w-4 h-4 text-gray-400" />
                  Publié (visible sur le site)
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-orange-500" />
                  <Star className="w-4 h-4 text-orange-500" />
                  Mettre à la une
                </label>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3 items-center shrink-0 bg-white">
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
            </div>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Supprimer l&apos;article ?</h3>
            <p className="text-sm text-gray-500 mb-6">Cette action est irréversible. L&apos;image associée sera aussi supprimée.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={() => handleDelete(confirmDelete)} disabled={saving}
                className="flex-1 py-2.5 rounded-lg text-sm font-black text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "#dc2626" }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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
