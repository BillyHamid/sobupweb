"use client";

import { useState } from "react";
import Link from "next/link";

export default function EspaceMembrePage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const isSignup = mode === "signup";

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all";
  const ringStyle = { "--tw-ring-color": "#31B9AE" } as React.CSSProperties;

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

        {/* Card */}
        <div className="bg-background rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Onglets Connexion / Inscription */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl mb-6" style={{ background: "#f0fafa" }}>
            {([["signin", "Connexion"], ["signup", "Inscription"]] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className="py-2.5 rounded-lg text-sm font-bold transition-all"
                style={mode === key ? { background: "#31B9AE", color: "white" } : { color: "#64748b" }}
              >
                {label}
              </button>
            ))}
          </div>

          <form className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom complet</label>
                <input type="text" placeholder="Dr Prénom Nom" className={inputCls} style={ringStyle} />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email professionnel</label>
              <input type="email" placeholder="votre.email@hopital.bf" className={inputCls} style={ringStyle} />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mot de passe</label>
              <input type="password" placeholder="••••••••" className={inputCls} style={ringStyle} />
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirmer le mot de passe</label>
                <input type="password" placeholder="••••••••" className={inputCls} style={ringStyle} />
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

        {/* Accès direct */}
        <div className="mt-6 bg-background rounded-2xl border border-gray-100 p-5 card-shadow">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Accès rapide après connexion</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "🔬", label: "Mes GTT" },
              { icon: "🎓", label: "Mes formations" },
              { icon: "📜", label: "Mes attestations" },
              { icon: "💳", label: "Ma cotisation" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold text-gray-600" style={{ background: "#f0fafa" }}>
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Connexion sécurisée SSL · Support : <a href="mailto:contact@sobup.bf" style={{ color: "#31B9AE" }}>contact@sobup.bf</a>
        </p>
      </div>
    </div>
  );
}
