"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Download, Search, Trash2, Mail, Phone, Building2, Briefcase, Award,
  MessageCircle, AlertTriangle, ClipboardList, StickyNote, Save, Loader2,
} from "lucide-react";
import AdminModal, { AdminTextarea } from "../AdminModal";

export type Registration = {
  id: string;
  event_slug: string;
  event_title: string | null;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  fonction: string | null;
  specialite: string | null;
  est_ehu: string | null;
  grade: string | null;
  lieu_exercice: string | null;
  motivation: string | null;
  notes: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function waLink(tel: string, prenom: string) {
  const num = tel.replace(/[^0-9]/g, "");
  const msg = encodeURIComponent(`Bonjour ${prenom}, nous confirmons votre inscription. L'équipe SOBUP.`);
  return `https://wa.me/${num}?text=${msg}`;
}

export default function RegistrationsManager({
  initialRegistrations, loadError,
}: { initialRegistrations: Registration[]; loadError: string | null }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [all] = useState<Registration[]>(initialRegistrations);
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Registration | null>(null);
  const [noteEditing, setNoteEditing] = useState<{ reg: Registration; value: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // Événements distincts présents dans les inscriptions
  const events = useMemo(() => {
    const map = new Map<string, { slug: string; title: string; count: number }>();
    for (const r of all) {
      const prev = map.get(r.event_slug);
      map.set(r.event_slug, {
        slug: r.event_slug,
        title: r.event_title ?? r.event_slug,
        count: (prev?.count ?? 0) + 1,
      });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [all]);

  const filtered = useMemo(() => {
    let list = eventFilter === "all" ? all : all.filter((r) => r.event_slug === eventFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) =>
        [r.prenom, r.nom, r.email, r.telephone, r.fonction, r.specialite, r.lieu_exercice]
          .filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return list;
  }, [all, eventFilter, query]);

  async function handleDelete(reg: Registration) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/registrations/${reg.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Inscription supprimée");
      setConfirmDelete(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  async function saveNote() {
    if (!noteEditing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/registrations/${noteEditing.reg.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: noteEditing.value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "✓ Note enregistrée");
      setNoteEditing(null);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setSaving(false); }
  }

  const exportUrl = eventFilter === "all"
    ? "/api/admin/registrations/export"
    : `/api/admin/registrations/export?event=${encodeURIComponent(eventFilter)}`;

  return (
    <div>
      <div className="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-white sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Inscriptions</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} inscription{filtered.length > 1 ? "s" : ""}
            {eventFilter !== "all" && ` · ${events.find((e) => e.slug === eventFilter)?.title ?? ""}`}
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
            <p className="text-sm text-red-700">{loadError} — vérifie que la table <code>event_registrations</code> est créée.</p>
          </div>
        )}

        {/* Filtres par événement */}
        {events.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterPill active={eventFilter === "all"} onClick={() => setEventFilter("all")}
              label="Tous les événements" count={all.length} />
            {events.map((e) => (
              <FilterPill key={e.slug} active={eventFilter === e.slug} onClick={() => setEventFilter(e.slug)}
                label={e.title} count={e.count} />
            ))}
          </div>
        )}

        {/* Recherche */}
        <div className="mb-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone, établissement…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all" />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
            <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="font-black text-gray-700 text-base">
              {all.length === 0 ? "Aucune inscription" : "Aucun résultat"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {all.length === 0
                ? "Les inscriptions apparaîtront ici dès qu'un participant remplira le formulaire."
                : "Essayez un autre terme de recherche."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r, i) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-4 flex items-start gap-4">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black tabular-nums shrink-0"
                    style={{ background: "#E8F9F7", color: "#065E52" }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black text-gray-900 text-sm">{r.prenom} {r.nom}</h3>
                      {r.est_ehu === "Oui" && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: "#fff7ed", color: "#e67e22" }}>
                          <Award className="w-2.5 h-2.5" /> EHU{r.grade ? ` · ${r.grade}` : ""}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400 ml-auto">{formatDate(r.created_at)}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-1">
                      <a href={`mailto:${r.email}`} className="flex items-center gap-1.5 hover:text-[#31B9AE]">
                        <Mail className="w-3 h-3" /> {r.email}
                      </a>
                      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {r.telephone}</span>
                      {r.fonction && <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {r.fonction}{r.specialite ? ` — ${r.specialite}` : ""}</span>}
                      {r.lieu_exercice && <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {r.lieu_exercice}</span>}
                    </div>
                    {events.length > 1 && r.event_title && (
                      <p className="text-[11px] font-bold" style={{ color: "#31B9AE" }}>{r.event_title}</p>
                    )}
                  </div>
                </div>

                {r.motivation && (
                  <div className="mx-4 mb-3 p-3 rounded-lg border-l-2" style={{ background: "#f8fafc", borderColor: "#31B9AE" }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Motivation</p>
                    <p className="text-xs text-gray-600 italic leading-relaxed">{r.motivation}</p>
                  </div>
                )}

                {r.notes && (
                  <div className="mx-4 mb-3 p-3 rounded-lg border" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#92400e" }}>Note interne</p>
                    <p className="text-xs" style={{ color: "#78350f" }}>{r.notes}</p>
                  </div>
                )}

                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  <a href={waLink(r.telephone, r.prenom)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:-translate-y-0.5"
                    style={{ background: "#25D366" }}>
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                  <button onClick={() => setNoteEditing({ reg: r, value: r.notes ?? "" })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                    <StickyNote className="w-3 h-3" /> {r.notes ? "Modifier la note" : "Ajouter une note"}
                  </button>
                  <button onClick={() => setConfirmDelete(r)}
                    className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-3 h-3" /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal note */}
      {noteEditing && (
        <AdminModal
          title="Note interne"
          subtitle={`${noteEditing.reg.prenom} ${noteEditing.reg.nom} · visible uniquement par le Bureau`}
          maxWidth="max-w-lg"
          onClose={() => setNoteEditing(null)}
          footer={
            <>
              <button onClick={() => setNoteEditing(null)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                Annuler
              </button>
              <button onClick={saveNote} disabled={saving}
                className="ml-auto inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </button>
            </>
          }
        >
          <AdminTextarea label="Note" value={noteEditing.value} rows={4}
            onChange={(v) => setNoteEditing({ ...noteEditing, value: v })}
            placeholder="Ex : a confirmé sa présence par téléphone · repas sans viande · arrive le 18 au soir…"
            hint="Cette note n'est jamais visible par le participant." />
        </AdminModal>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Supprimer cette inscription ?</h3>
            <p className="text-sm text-gray-500 mb-6">
              L&apos;inscription de <strong>{confirmDelete.prenom} {confirmDelete.nom}</strong> sera
              définitivement retirée de la liste. Action irréversible.
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-xl shadow-2xl font-bold text-sm text-white"
          style={{ background: toast.type === "ok" ? "#31B9AE" : "#dc2626" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function FilterPill({ active, onClick, label, count }: {
  active: boolean; onClick: () => void; label: string; count: number;
}) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
        active ? "text-white shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
      }`}
      style={active ? { background: "#31B9AE", borderColor: "#31B9AE" } : {}}>
      <span className="truncate max-w-[220px]">{label}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black tabular-nums ${
        active ? "bg-white/25" : "bg-gray-100 text-gray-500"
      }`}>
        {count}
      </span>
    </button>
  );
}
