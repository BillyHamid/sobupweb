"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authenticate, MEMBERS } from "@/data/members";

export default function EspaceMembrePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get("next");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const isSignup = mode === "signup";

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all";
  const ringStyle = { "--tw-ring-color": "#31B9AE" } as React.CSSProperties;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignup) {
      // Simulation : inscription désactivée — orienter vers contact
      setError("L'inscription se fait par adhésion. Contactez le secrétariat SOBUP.");
      return;
    }

    const member = authenticate(email, password);
    if (!member) {
      setError("Identifiants invalides. Vérifiez votre email et mot de passe.");
      return;
    }

    // Stocker le membre connecté (sans le mot de passe)
    if (typeof window !== "undefined") {
      const { password: _pwd, ...safe } = member;
      void _pwd;
      localStorage.setItem("sobup_user", JSON.stringify(safe));
      window.dispatchEvent(new Event("sobup_user_changed"));
    }

    // Si une intention de redirection existe (ex: depuis "Rejoindre un GTT"), on l'honore
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
          <p className="text-sm text-gray-500 mt-1">
            {isSignup ? "Créez votre compte SOBUP" : "Connectez-vous à votre compte SOBUP"}
          </p>
        </div>

        {/* Bandeau d'intention si redirection depuis un GTT */}
        {nextUrl && !isSignup && (
          <div className="mb-5 p-3 rounded-xl border flex items-start gap-2.5"
            style={{ background: "#fff7ed", borderColor: "#fdba74" }}>
            <span className="text-lg shrink-0">🔐</span>
            <div>
              <p className="text-xs font-black text-gray-900">Connexion requise pour adhérer</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Identifiez-vous pour rejoindre le GTT. Vous serez automatiquement renvoyé après votre connexion.
              </p>
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-background rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Onglets Connexion / Inscription */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl mb-6" style={{ background: "#f0fafa" }}>
            {([["signin", "Connexion"], ["signup", "Inscription"]] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => { setMode(key); setError(null); }}
                className="py-2.5 rounded-lg text-sm font-bold transition-all"
                style={mode === key ? { background: "#31B9AE", color: "white" } : { color: "#64748b" }}
              >
                {label}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom complet</label>
                <input type="text" placeholder="Dr Prénom Nom" className={inputCls} style={ringStyle} />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email professionnel</label>
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
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mot de passe</label>
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

            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" className={inputCls} style={ringStyle} />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl text-xs font-bold border" style={{ background: "#fef2f2", color: "#dc2626", borderColor: "#fecaca" }}>
                ⚠ {error}
              </div>
            )}

            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="font-semibold hover:underline" style={{ color: "#31B9AE" }}>
                  Mot de passe oublié ?
                </a>
              </div>
            )}

            {isSignup && (
              <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded mt-0.5" />
                <span>J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité de la SOBUP.</span>
              </label>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#31B9AE" }}
            >
              {isSignup ? "Créer mon compte" : "Se connecter"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative text-center">
              <span className="bg-background px-3 text-xs text-gray-400">ou</span>
            </div>
          </div>

          {isSignup ? (
            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{" "}
              <button type="button" onClick={() => setMode("signin")} className="font-black hover:underline" style={{ color: "#31B9AE" }}>
                Se connecter →
              </button>
            </p>
          ) : (
            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <button type="button" onClick={() => setMode("signup")} className="font-black hover:underline" style={{ color: "#e67e22" }}>
                Créer un compte →
              </button>
            </p>
          )}
        </div>

        {/* Comptes de démo */}
        {!isSignup && (
          <div className="mt-6 bg-background rounded-2xl border border-gray-100 p-5 card-shadow">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between text-left"
            >
              <div>
                <p className="text-xs font-black text-gray-700 uppercase tracking-wide">🔑 Comptes de démonstration</p>
                <p className="text-xs text-gray-400 mt-0.5">Cliquez sur un membre pour pré-remplir le formulaire</p>
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
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0"
                      style={{ background: m.isBureau ? "#31B9AE" : "#94a3b8" }}>
                      {m.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{m.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{m.email}</p>
                    </div>
                    {m.isBureau && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: "#E8F9F7", color: "#31B9AE" }}>BUREAU</span>
                    )}
                  </button>
                ))}
                <div className="mt-3 p-3 rounded-lg text-xs font-medium" style={{ background: "#fff7ed", color: "#92400e" }}>
                  💡 Mot de passe pour tous les comptes démo : <strong>sobup2026</strong>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Connexion sécurisée SSL · Support : <a href="mailto:sobup01@gmail.com" style={{ color: "#31B9AE" }}>sobup01@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
