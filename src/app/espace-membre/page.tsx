"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authenticate, MEMBERS } from "@/data/members";

export default function EspaceMembrePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#f0fafa" }} />}>
      <EspaceMembreContent />
    </Suspense>
  );
}

type Step = {
  num: number;
  title: string;
  short: string;
  tip: string;
  icon: string;
};

const STEPS: Step[] = [
  {
    num: 1,
    title: "Adhésion",
    short: 'Cliquez sur le bouton « Adhérer »',
    icon: "📝",
    tip:
      "Cliquez sur le bouton orange « Adhérer » en haut de la page et laissez-vous guider : choix du type de membre, remplissage du formulaire d'adhésion, paiement de la cotisation et envoi de votre dossier. Aucune démarche par email n'est nécessaire.",
  },
  {
    num: 2,
    title: "Validation",
    short: "Identifiants reçus par email",
    icon: "✉️",
    tip:
      "Une fois votre dossier d'adhésion validé, vous recevez automatiquement un email avec votre identifiant (votre email pro) et un mot de passe temporaire. Conservez-les précieusement.",
  },
  {
    num: 3,
    title: "Connexion",
    short: "Saisir vos identifiants",
    icon: "🔐",
    tip:
      "Entrez l'email professionnel et le mot de passe fournis. Cochez « Se souvenir de moi » pour rester connecté sur cet appareil. En cas d'oubli, utilisez le lien « Mot de passe oublié ».",
  },
  {
    num: 4,
    title: "Espace membre",
    short: "Accès à votre dashboard",
    icon: "🚀",
    tip:
      "Vous accédez à votre espace personnel : cotisation, GTT, formations, ressources scientifiques, publications et historique de votre activité SOBUP.",
  },
];

function EspaceMembreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [openTip, setOpenTip] = useState<number | null>(null);

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all";
  const ringStyle = { "--tw-ring-color": "#31B9AE" } as React.CSSProperties;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const member = authenticate(email, password);
    if (!member) {
      setError("Identifiants invalides. Vérifiez votre email et mot de passe.");
      return;
    }

    if (typeof window !== "undefined") {
      const { password: _pwd, ...safe } = member;
      void _pwd;
      localStorage.setItem("sobup_user", JSON.stringify(safe));
      window.dispatchEvent(new Event("sobup_user_changed"));
    }

    let destination = "/espace-membre/dashboard";
    if (nextUrl) {
      destination = nextUrl;
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sobup_after_login_redirect");
      if (stored) {
        destination = stored;
        localStorage.removeItem("sobup_after_login_redirect");
      }
    }
    router.push(destination);
  };

  const fillDemo = (memberEmail: string) => {
    setEmail(memberEmail);
    setPassword("sobup2026");
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: "#f0fafa" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SOBUP" className="w-20 h-20 mx-auto mb-3" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Espace membre</h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre compte SOBUP</p>
        </div>

        {/* Bandeau d'intention si redirection */}
        {nextUrl && (
          <div
            className="mb-5 p-3 rounded-xl border flex items-start gap-2.5"
            style={{ background: "#fff7ed", borderColor: "#fdba74" }}
          >
            <span className="text-lg shrink-0">🔐</span>
            <div>
              <p className="text-xs font-black text-gray-900">Connexion requise pour adhérer</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Identifiez-vous pour rejoindre le GTT. Vous serez automatiquement renvoyé après votre connexion.
              </p>
            </div>
          </div>
        )}

        {/* Roadmap du processus (infobulles) */}
        <div className="mb-6 bg-background rounded-2xl border border-gray-100 p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-gray-700 uppercase tracking-wide">
              🗺️ Comment ça marche ?
            </p>
            <span className="text-[10px] text-gray-400">Survolez ou cliquez sur une étape</span>
          </div>

          <ol className="relative">
            {/* ligne verticale */}
            <span
              aria-hidden
              className="absolute left-[15px] top-2 bottom-2 w-0.5"
              style={{ background: "linear-gradient(to bottom, #31B9AE, #E8F9F7)" }}
            />

            {STEPS.map((s) => {
              const isOpen = openTip === s.num;
              return (
                <li key={s.num} className="relative pl-10 pb-3 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenTip(isOpen ? null : s.num)}
                    onMouseEnter={() => setOpenTip(s.num)}
                    onMouseLeave={() => setOpenTip(null)}
                    onFocus={() => setOpenTip(s.num)}
                    onBlur={() => setOpenTip(null)}
                    aria-expanded={isOpen}
                    aria-describedby={`tip-${s.num}`}
                    className="w-full text-left group"
                  >
                    {/* puce */}
                    <span
                      className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm transition-transform group-hover:scale-110"
                      style={{ background: "#31B9AE" }}
                    >
                      {s.num}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-sm">{s.icon}</span>
                      <p className="text-sm font-black text-gray-900">{s.title}</p>
                      <span
                        className="ml-auto text-[10px] font-bold rounded-full px-2 py-0.5"
                        style={{ background: "#E8F9F7", color: "#259689" }}
                        aria-hidden
                      >
                        i
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{s.short}</p>

                    {/* Infobulle */}
                    <div
                      id={`tip-${s.num}`}
                      role="tooltip"
                      className="overflow-hidden transition-all"
                      style={{
                        maxHeight: isOpen ? 200 : 0,
                        opacity: isOpen ? 1 : 0,
                        marginTop: isOpen ? 8 : 0,
                      }}
                    >
                      <div
                        className="relative p-3 rounded-xl text-[11px] leading-relaxed border"
                        style={{
                          background: "#F5FFFE",
                          borderColor: "#B7EDE7",
                          color: "#0f172a",
                        }}
                      >
                        <span
                          aria-hidden
                          className="absolute -top-1.5 left-4 w-3 h-3 rotate-45 border-l border-t"
                          style={{ background: "#F5FFFE", borderColor: "#B7EDE7" }}
                        />
                        {s.tip}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>

          <Link
            href="/adhesion"
            className="mt-4 p-3 rounded-lg text-[11px] font-bold flex items-center justify-between gap-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: "#e67e22", color: "white" }}
          >
            <span className="flex items-center gap-2">
              <span>🚀</span>
              <span>Pas encore membre ? Démarrez votre adhésion en ligne</span>
            </span>
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Card connexion */}
        <div className="bg-background rounded-3xl shadow-xl p-8 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Email professionnel
              </label>
              <input
                type="email"
                placeholder="prenom.nom@sobup.bf"
                className={inputCls}
                style={ringStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={inputCls}
                style={ringStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div
                className="p-3 rounded-xl text-xs font-bold border"
                style={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}
              >
                ⚠ {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="font-semibold hover:underline" style={{ color: "#31B9AE" }}>
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#31B9AE" }}
            >
              Se connecter
            </button>
          </form>
        </div>

        {/* Comptes de démo */}
        <div className="mt-6 bg-background rounded-2xl border border-gray-100 p-5 card-shadow">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <p className="text-xs font-black text-gray-700 uppercase tracking-wide">
                🔑 Comptes de démonstration
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Cliquez sur un membre pour pré-remplir le formulaire
              </p>
            </div>
            <span className="text-xs font-black" style={{ color: "#31B9AE" }}>
              {showDemo ? "Masquer" : "Afficher"}
            </span>
          </button>

          {showDemo && (
            <div className="mt-4 space-y-1 max-h-60 overflow-y-auto pr-1">
              {MEMBERS.map((m) => (
                <button
                  key={m.email}
                  type="button"
                  onClick={() => fillDemo(m.email)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0"
                    style={{ background: m.isBureau ? "#31B9AE" : "#94a3b8" }}
                  >
                    {m.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{m.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{m.email}</p>
                  </div>
                  {m.isBureau && (
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: "#E8F9F7", color: "#31B9AE" }}
                    >
                      BUREAU
                    </span>
                  )}
                </button>
              ))}
              <div
                className="mt-3 p-3 rounded-lg text-xs font-medium"
                style={{ background: "#fff7ed", color: "#92400e" }}
              >
                💡 Mot de passe pour tous les comptes démo : <strong>sobup2026</strong>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Connexion sécurisée SSL · Support :{" "}
          <a href="mailto:sobup01@gmail.com" style={{ color: "#31B9AE" }}>
            sobup01@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
