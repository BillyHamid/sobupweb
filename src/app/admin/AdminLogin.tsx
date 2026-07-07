"use client";

import { useState } from "react";
import { Lock, AlertTriangle } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Mot de passe incorrect.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)" }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-8 py-7 text-center"
          style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 55%, #31B9AE 100%)" }}>
          <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-white text-xl font-black mb-1">Espace Bureau SOBUP</h1>
          <p className="text-white/70 text-xs">Accès réservé aux membres du Bureau</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label htmlFor="pwd" className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
              Mot de passe
            </label>
            <input
              id="pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full px-3.5 py-3 rounded-lg border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg border" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-black text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 shadow-lg"
            style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed pt-2">
            🔒 Ne partagez ce mot de passe qu'aux membres du Bureau.<br/>
            Session valable 7 jours après connexion.
          </p>
        </form>
      </div>
    </div>
  );
}
