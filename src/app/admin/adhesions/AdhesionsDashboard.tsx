"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle, Check, X, Phone, Building2, MapPin, Briefcase,
  Mail, Eye, EyeOff, Copy, KeyRound, Clock, Ban,
} from "lucide-react";

type Request = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  specialite: string | null;
  etablissement: string | null;
  ville: string | null;
  payment_method: string | null;
  created_at: string;
  validated_at?: string | null;
  rejection_reason?: string | null;
  generated_password?: string | null;
};

type Stats = { pending: number; approved: number; rejected: number };
type Tab = "pending" | "approved" | "rejected";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function waLink(tel: string, prenom: string, msg?: string) {
  const num = tel.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(msg ?? `Bonjour ${prenom}, merci pour votre demande d'adhésion à la SOBUP. Pouvez-vous nous envoyer la preuve de votre paiement svp ?`);
  return `https://wa.me/${num}?text=${text}`;
}

export default function AdhesionsDashboard({
  pending, approved, rejected, stats,
}: {
  pending: Request[]; approved: Request[]; rejected: Request[]; stats: Stats;
}) {
  const router = useRouter();
  const [pendingTransition, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  // Inversion : on liste ceux MASQUÉS. Par défaut, tous les mots de passe sont visibles.
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  function flash(type: "ok" | "err", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  }
  function toggleHide(id: string) {
    setHidden((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      flash("ok", "✓ Mot de passe copié");
    } catch {
      flash("err", "Impossible de copier.");
    }
  }

  async function validate(req: Request) {
    if (!confirm(`Créer le compte de ${req.prenom} ${req.nom} et lui envoyer ses identifiants par email ?`)) return;
    setBusyId(req.id);
    try {
      const res = await fetch("/api/admin/validate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: req.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", `✓ Compte créé. Identifiants envoyés à ${req.email}`);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setBusyId(null); }
  }

  async function confirmReject() {
    if (!rejectingId) return;
    setBusyId(rejectingId);
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rejectingId, reason: rejectReason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", "Demande refusée. Email envoyé à l'adhérent.");
      setRejectingId(null); setRejectReason("");
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setBusyId(null); }
  }

  async function resetPassword(req: Request) {
    if (!confirm(`Réinitialiser le mot de passe de ${req.prenom} ${req.nom} ?\n\nL'ancien ne fonctionnera plus, un nouveau sera envoyé par email à ${req.email}.`)) return;
    setBusyId(req.id);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: req.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { flash("err", data.error ?? "Erreur."); return; }
      flash("ok", `✓ Nouveau mot de passe envoyé à ${req.email}`);
      startTransition(() => router.refresh());
    } catch { flash("err", "Connexion impossible."); }
    finally { setBusyId(null); }
  }

  const lists: Record<Tab, Request[]> = { pending, approved, rejected };
  const current = lists[tab];

  void pendingTransition;

  return (
    <div>
      <div className="px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-30">
        <h1 className="text-xl font-black text-gray-900">Gestion des adhésions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Valider, refuser ou consulter les demandes</p>
      </div>
      <div className="px-8 py-6">
        {/* Stats hebdo */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Cette semaine" value={stats.pending} sub="en attente" color="#e67e22" />
          <StatCard label="Validées" value={stats.approved} sub="cette semaine" color="#31B9AE" />
          <StatCard label="Refusées" value={stats.rejected} sub="cette semaine" color="#64748b" />
        </div>

        {/* Onglets */}
        <div className="flex items-center gap-1 mb-5 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <TabButton active={tab === "pending"} onClick={() => setTab("pending")} icon={Clock} label="En attente" count={pending.length} color="#e67e22" />
          <TabButton active={tab === "approved"} onClick={() => setTab("approved")} icon={Check} label="Validées" count={approved.length} color="#31B9AE" />
          <TabButton active={tab === "rejected"} onClick={() => setTab("rejected")} icon={Ban} label="Refusées" count={rejected.length} color="#64748b" />
        </div>

        {/* Liste */}
        {current.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <div className="space-y-4">
            {current.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                tab={tab}
                busy={busyId === req.id}
                isHidden={hidden.has(req.id)}
                onValidate={() => validate(req)}
                onRejectOpen={() => { setRejectingId(req.id); setRejectReason(""); }}
                onToggleHide={() => toggleHide(req.id)}
                onCopy={() => req.generated_password && copy(req.generated_password)}
                onResetPassword={() => resetPassword(req)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-2xl font-bold text-sm text-white animate-fade-up"
          style={{ background: toast.type === "ok" ? "#31B9AE" : "#dc2626" }}>
          {toast.msg}
        </div>
      )}

      {/* Modal refus */}
      {rejectingId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setRejectingId(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="font-black text-gray-900 text-lg mb-2">Refuser la demande</h3>
            <p className="text-sm text-gray-500 mb-4">Précisez la raison (l&apos;adhérent recevra ce motif par email) :</p>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} autoFocus rows={3}
              placeholder="Ex : Capture du paiement illisible — merci d'envoyer une photo plus nette."
              className="w-full px-3.5 py-3 rounded-lg border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-red-400 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all resize-none" />
            <div className="flex gap-2 mt-5">
              <button onClick={() => setRejectingId(null)} className="flex-1 py-2.5 rounded-lg text-sm font-bold border-2 border-gray-200 text-gray-500 hover:bg-gray-50">Annuler</button>
              <button onClick={confirmReject} disabled={busyId === rejectingId}
                className="flex-1 py-2.5 rounded-lg text-sm font-black text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "#dc2626" }}>
                {busyId === rejectingId ? "Envoi…" : "Confirmer le refus"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .animate-fade-up { animation: fade-up .3s ease both; }
      `}</style>
    </div>
  );
}

/* ─── Sous-composants ─── */

function StatCard({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      <p className="text-[11px] text-gray-500">{sub}</p>
    </div>
  );
}

function TabButton({
  active, onClick, icon: Icon, label, count, color,
}: {
  active: boolean; onClick: () => void; icon: React.ComponentType<{ className?: string }>;
  label: string; count: number; color: string;
}) {
  return (
    <button onClick={onClick}
      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all ${
        active ? "shadow-sm text-white" : "text-gray-500 hover:bg-gray-50"
      }`}
      style={active ? { background: color } : {}}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${active ? "bg-white/25" : "bg-gray-100 text-gray-500"}`}>
        {count}
      </span>
    </button>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, { title: string; sub: string }> = {
    pending: { title: "Aucune demande en attente", sub: "Toutes les demandes ont été traitées 👏" },
    approved: { title: "Aucune adhésion validée", sub: "Les adhésions validées apparaîtront ici." },
    rejected: { title: "Aucune demande refusée", sub: "Les demandes refusées apparaîtront ici." },
  };
  const m = messages[tab];
  return (
    <div className="bg-white rounded-xl p-12 border border-gray-100 text-center">
      <p className="font-black text-gray-700 text-base mb-1">{m.title}</p>
      <p className="text-sm text-gray-400">{m.sub}</p>
    </div>
  );
}

function RequestCard({
  req, tab, busy, isHidden,
  onValidate, onRejectOpen, onToggleHide, onCopy, onResetPassword,
}: {
  req: Request; tab: Tab; busy: boolean; isHidden: boolean;
  onValidate: () => void; onRejectOpen: () => void;
  onToggleHide: () => void; onCopy: () => void; onResetPassword: () => void;
}) {
  const badge = {
    pending: { label: "🟠 En attente", bg: "#fff7ed", color: "#e67e22" },
    approved: { label: "✓ Validée", bg: "#E8F9F7", color: "#31B9AE" },
    rejected: { label: "✗ Refusée", bg: "#f1f5f9", color: "#64748b" },
  }[tab];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-black text-gray-900 text-base leading-tight">{req.prenom} {req.nom}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {tab === "pending"
              ? `Reçue le ${formatDate(req.created_at)}`
              : tab === "approved"
              ? `Validée le ${formatDate(req.validated_at)}`
              : `Refusée le ${formatDate(req.validated_at)}`}
          </p>
        </div>
        <span className="shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: badge.bg, color: badge.color }}>
          {badge.label}
        </span>
      </div>

      {/* Coordonnées */}
      <div className="px-5 py-4 grid sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4 text-gray-300 shrink-0" />
          <a href={`mailto:${req.email}`} className="hover:text-[#31B9AE] truncate">{req.email}</a>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4 text-gray-300 shrink-0" /> {req.telephone}
        </div>
        {req.specialite && (
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4 text-gray-300 shrink-0" /> {req.specialite}
          </div>
        )}
        {req.etablissement && (
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4 text-gray-300 shrink-0" /><span className="truncate">{req.etablissement}</span>
          </div>
        )}
        {req.ville && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-300 shrink-0" /> {req.ville}
          </div>
        )}
        {req.payment_method && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Paiement :</span>
            <span className="font-semibold">{req.payment_method}</span>
          </div>
        )}
      </div>

      {/* Bloc mot de passe — visible uniquement sur les demandes validées */}
      {tab === "approved" && req.generated_password && (
        <div className="px-5 pb-4">
          <div className="rounded-xl p-4 border" style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" style={{ color: "#d97706" }} />
                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#92400e" }}>
                  Mot de passe envoyé à l&apos;adhérent
                </p>
              </div>
              <span className="text-[10px] text-amber-700 font-bold">🔒 Confidentiel</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-amber-200 font-mono text-base font-black text-gray-900 select-all tracking-wide">
                {isHidden ? "•".repeat(req.generated_password.length) : req.generated_password}
              </code>
              <button onClick={onToggleHide}
                className="p-2.5 rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                title={isHidden ? "Afficher" : "Masquer (utile en partage d'écran)"}>
                {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={onCopy}
                className="p-2.5 rounded-lg text-white transition-colors hover:opacity-90"
                style={{ background: "#d97706" }}
                title="Copier le mot de passe">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-amber-700 mt-2 leading-relaxed">
              ℹ️ Mot de passe à communiquer à l&apos;adhérent en cas de perte. Pour plus de sécurité, utilisez plutôt « Réinitialiser » qui génère un nouveau code.
            </p>
          </div>
        </div>
      )}

      {/* Motif de refus */}
      {tab === "rejected" && req.rejection_reason && (
        <div className="px-5 pb-4">
          <div className="rounded-xl p-3 border" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <p className="text-[11px] font-black uppercase tracking-widest text-red-700 mb-1">Motif</p>
            <p className="text-sm text-red-800 italic">{req.rejection_reason}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
        <a href={waLink(req.telephone, req.prenom)} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:-translate-y-0.5"
          style={{ background: "#25D366" }}>
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>

        {tab === "pending" && (
          <>
            <button onClick={onValidate} disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 shadow-sm"
              style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}>
              <Check className="w-3.5 h-3.5" />
              {busy ? "Traitement…" : "Valider l'adhésion"}
            </button>
            <button onClick={onRejectOpen} disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ borderColor: "#fecaca", color: "#dc2626", background: "#fff" }}>
              <X className="w-3.5 h-3.5" /> Refuser
            </button>
          </>
        )}

        {tab === "approved" && (
          <button onClick={onResetPassword} disabled={busy}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 shadow-sm"
            style={{ background: "linear-gradient(135deg, #e67e22 0%, #d35400 100%)" }}>
            <KeyRound className="w-3.5 h-3.5" />
            {busy ? "Envoi…" : "Réinitialiser le mot de passe"}
          </button>
        )}
      </div>
    </div>
  );
}
