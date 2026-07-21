"use client";

import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "sobup_analytics_consent";

/**
 * Bannière de consentement RGPD.
 * S'affiche une seule fois par navigateur (jusqu'à ce que l'utilisateur choisisse).
 * Émet l'événement `sobup_consent_changed` que GoogleAnalytics écoute.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function respond(choice: "accepted" | "refused") {
    localStorage.setItem(CONSENT_KEY, choice);
    window.dispatchEvent(new Event("sobup_consent_changed"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-labelledby="consent-title"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[70] max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-6 animate-consent-in"
      style={{ boxShadow: "0 20px 40px rgba(15,26,29,0.15), 0 4px 12px rgba(15,26,29,0.08)" }}
    >
      <button
        onClick={() => respond("refused")}
        aria-label="Fermer et refuser"
        className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#E8F9F7", color: "#065E52" }}
        >
          <Cookie className="w-4 h-4" />
        </div>
        <div>
          <h2 id="consent-title" className="text-sm font-black text-gray-900 leading-tight">
            Vos données, votre choix
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Cookies et statistiques anonymes</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 leading-relaxed mb-4">
        Nous utilisons des cookies anonymes (Google Analytics) pour comprendre comment le site est utilisé et
        l&apos;améliorer. Aucune donnée personnelle n&apos;est collectée. Vous pouvez refuser sans
        conséquence sur votre navigation.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => respond("refused")}
          className="flex-1 py-2 px-4 rounded-lg text-xs font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Refuser
        </button>
        <button
          onClick={() => respond("accepted")}
          className="flex-1 py-2 px-4 rounded-lg text-xs font-black text-white shadow-sm transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)" }}
        >
          Accepter
        </button>
      </div>

      <style>{`
        @keyframes consent-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-consent-in { animation: consent-in .35s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
    </div>
  );
}
