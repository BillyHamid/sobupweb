"use client";

import { useRef, useState } from "react";
import { Paperclip, X, Loader2, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";

const TYPES = [
  { value: "oral", label: "Communication orale", icon: "🎤" },
  { value: "poster", label: "Poster", icon: "📊" },
];

const MAX_FILE = 5 * 1024 * 1024;
const ALLOWED_EXT = ["pdf", "doc", "docx"];

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-[#31B9AE] focus:ring-2 focus:ring-[#31B9AE]/20 transition-all";

function countWords(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export default function AbstractForm({
  evenement,
}: {
  evenement: { slug: string; label: string; icon: string; color: string; bg: string };
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState("");
  const [auteurPrincipal, setAuteur] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [coAuteurs, setCoAuteurs] = useState("");
  const [etablissement, setEtablissement] = useState("");
  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [motsCles, setMotsCles] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [dragging, setDragging] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ reference: string; warning?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const words = countWords(texte);
  const wordsOver = words > 300;

  function pickFile(f: File | null) {
    setError(null);
    if (!f) { setFile(null); return; }
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext)) {
      setError("Format de fichier non accepté. Utilisez un PDF, DOC ou DOCX.");
      return;
    }
    if (f.size > MAX_FILE) {
      setError("Le fichier dépasse 5 Mo.");
      return;
    }
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!type) { setError("Choisissez le type de soumission (communication orale ou poster)."); return; }
    if (!auteurPrincipal.trim() || !email.trim() || !titre.trim() || !texte.trim()) {
      setError("Merci de remplir tous les champs marqués d'un astérisque.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("L'adresse email n'est pas valide.");
      return;
    }
    if (words < 50) { setError("L'abstract doit contenir au moins 50 mots."); return; }
    if (wordsOver) { setError(`L'abstract dépasse 300 mots (${words} mots actuellement).`); return; }

    const fd = new FormData();
    fd.set("type", type);
    fd.set("auteurPrincipal", auteurPrincipal.trim());
    fd.set("email", email.trim());
    fd.set("telephone", telephone.trim());
    fd.set("coAuteurs", coAuteurs.trim());
    fd.set("etablissement", etablissement.trim());
    fd.set("titre", titre.trim());
    fd.set("texte", texte.trim());
    fd.set("motsCles", motsCles.trim());
    fd.set("eventSlug", evenement.slug);
    fd.set("eventTitle", evenement.label);
    fd.set("honeypot", honeypot);
    if (file) fd.set("fichier", file);

    setSubmitting(true);
    try {
      const res = await fetch("/api/abstracts", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue. Merci de réessayer.");
        return;
      }
      setSuccess({ reference: data.reference ?? "", warning: data.warning });
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-background rounded-2xl p-8 sm:p-10 border border-gray-100 card-shadow text-center">
        <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#31B9AE 0%,#065E52 100%)" }}>
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Abstract bien reçu</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
          Le comité scientifique de la SOBUP a enregistré votre soumission. Un accusé de réception
          vous a été envoyé par email.
        </p>

        {success.reference && (
          <div className="inline-flex flex-col items-center gap-2 px-6 py-5 rounded-2xl border mb-6"
            style={{ background: "#E8F9F7", borderColor: "#31B9AE55" }}>
            <p className="text-[11px] font-black uppercase tracking-[.14em]" style={{ color: "#065E52" }}>
              Votre référence
            </p>
            <p className="text-xl font-black text-gray-900 tracking-wide">{success.reference}</p>
            <button type="button"
              onClick={() => {
                navigator.clipboard?.writeText(success.reference);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold mt-1" style={{ color: "#065E52" }}>
              {copied ? <><Check className="w-3 h-3" /> Copié</> : <><Copy className="w-3 h-3" /> Copier</>}
            </button>
          </div>
        )}

        {success.warning && (
          <div className="max-w-md mx-auto mb-6 p-4 rounded-xl border text-left flex items-start gap-2"
            style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#b45309" }} />
            <p className="text-xs" style={{ color: "#78350f" }}>{success.warning}</p>
          </div>
        )}

        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Votre travail sera évalué par le comité scientifique. La décision vous sera communiquée
          par email après la clôture des soumissions. En cas d&apos;acceptation, vous devrez être
          inscrit(e) à l&apos;événement pour présenter votre travail.
        </p>

        <button type="button"
          onClick={() => {
            setSuccess(null);
            setType(""); setAuteur(""); setEmail(""); setTelephone("");
            setCoAuteurs(""); setEtablissement(""); setTitre(""); setTexte("");
            setMotsCles(""); setFile(null);
          }}
          className="mt-7 px-6 py-3 rounded-xl text-sm font-black border-2 text-[#065E52] hover:bg-[#E8F9F7] transition-colors"
          style={{ borderColor: "#31B9AE" }}>
          Soumettre un autre abstract
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-2xl p-6 sm:p-8 border border-gray-100 card-shadow">
      <h2 className="text-xl font-black text-gray-900 mb-6">Formulaire de soumission</h2>
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Honeypot anti-bot */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
          value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
          className="absolute -left-[9999px] w-px h-px opacity-0" />

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Type de soumission *</label>
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map((t) => {
              const on = type === t.value;
              return (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                    on ? "shadow-sm" : "border-gray-200 hover:border-[#31B9AE]"
                  }`}
                  style={on ? { borderColor: "#31B9AE", background: "#E8F9F7" } : {}}>
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-xs font-bold" style={{ color: on ? "#065E52" : "#374151" }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Prénom & Nom (auteur principal) *</label>
            <input type="text" value={auteurPrincipal} onChange={(e) => setAuteur(e.target.value)}
              placeholder="Dr Aminata Ouédraogo" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com" className={inputCls} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Téléphone</label>
            <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)}
              placeholder="+226 70 00 00 00" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Service / Établissement</label>
            <input type="text" value={etablissement} onChange={(e) => setEtablissement(e.target.value)}
              placeholder="CHU Yalgado Ouédraogo — Pneumologie" className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Co-auteurs</label>
          <input type="text" value={coAuteurs} onChange={(e) => setCoAuteurs(e.target.value)}
            placeholder="Dupont A., Martin B., ..." className={inputCls} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Titre de l&apos;abstract *</label>
          <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)}
            placeholder="Titre complet de votre travail" className={inputCls} />
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-1.5 gap-3">
            <label className="block text-sm font-bold text-gray-700">
              Texte de l&apos;abstract * <span className="font-normal text-gray-400">(max. 300 mots)</span>
            </label>
            <span className={`text-xs font-black tabular-nums ${wordsOver ? "text-red-600" : "text-gray-400"}`}>
              {words} / 300
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">
            Structure recommandée : Introduction — Méthodes — Résultats — Conclusion — Mots clés
          </p>
          <textarea rows={9} value={texte} onChange={(e) => setTexte(e.target.value)}
            placeholder="Introduction : …&#10;Méthodes : …&#10;Résultats : …&#10;Conclusion : …&#10;Mots clés : …"
            className={`${inputCls} resize-y leading-relaxed ${wordsOver ? "border-red-300" : ""}`} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Mots clés</label>
          <input type="text" value={motsCles} onChange={(e) => setMotsCles(e.target.value)}
            placeholder="BPCO, spirométrie, biomasse" className={inputCls} />
          <p className="text-xs text-gray-400 mt-1">Séparez les mots clés par des virgules.</p>
        </div>

        <div className="rounded-xl border-2 p-4 flex items-center gap-3"
          style={{ borderColor: evenement.color, background: evenement.bg }}>
          <span className="text-2xl shrink-0">{evenement.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: evenement.color }}>
              Événement cible
            </p>
            <p className="text-sm font-black text-gray-900">{evenement.label}</p>
          </div>
        </div>

        {/* Fichier joint */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Fichier joint (optionnel)</label>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="sr-only"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
          {file ? (
            <div className="rounded-xl border-2 p-4 flex items-center gap-3" style={{ borderColor: "#31B9AE", background: "#E8F9F7" }}>
              <Paperclip className="w-5 h-5 shrink-0" style={{ color: "#065E52" }} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {file.size < 1024 * 1024
                    ? `${Math.round(file.size / 1024)} Ko`
                    : `${(file.size / 1024 / 1024).toFixed(1)} Mo`}
                </p>
              </div>
              <button type="button" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="p-1.5 rounded-lg hover:bg-white/70 text-gray-500 shrink-0" aria-label="Retirer le fichier">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault(); setDragging(false);
                pickFile(e.dataTransfer.files?.[0] ?? null);
              }}
              className="w-full border-2 border-dashed rounded-xl p-6 text-center transition-colors"
              style={{
                borderColor: dragging ? "#31B9AE" : "#e5e7eb",
                background: dragging ? "#E8F9F7" : "transparent",
              }}>
              <span className="text-3xl block mb-2">📎</span>
              <p className="text-sm font-semibold text-gray-600">
                Glisser-déposer un fichier ou cliquer pour sélectionner
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — max. 5 Mo</p>
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl border flex items-start gap-2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button type="submit" disabled={submitting}
          className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg,#31B9AE 0%,#065E52 100%)" }}>
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Envoi en cours…" : "Soumettre l'abstract"}
        </button>
        <p className="text-xs text-gray-400 text-center">
          Vous recevrez un accusé de réception par email avec votre numéro de référence.
        </p>
      </form>
    </div>
  );
}
