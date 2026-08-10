"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * Modale partagée du back-office.
 * - Plein écran sur mobile, centrée sur desktop.
 * - Corps scrollable avec dégradé de fin quand du contenu reste caché.
 * - Ferme sur Échap et sur clic backdrop.
 */
export default function AdminModal({
  title,
  subtitle,
  onClose,
  footer,
  children,
  maxWidth = "max-w-2xl",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Détecte s'il reste du contenu sous la zone visible
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const check = () => {
      setHasMore(el.scrollHeight - el.scrollTop - el.clientHeight > 24);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", check); ro.disconnect(); };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`bg-white w-full ${maxWidth} flex flex-col shadow-2xl sm:rounded-2xl sm:max-h-[min(94vh,900px)] animate-modal-in`}
      >
        {/* En-tête */}
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h3 className="font-black text-gray-900 text-base sm:text-lg leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps scrollable — overflow directement sur le flex-1 */}
        <div
          ref={bodyRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 py-5 space-y-4"
        >
          {children}
        </div>

        {/* Pied fixe — le dégradé se pose au-dessus, ancré sur le pied */}
        <div className="relative shrink-0 border-t border-gray-100 bg-white sm:rounded-b-2xl">
          {hasMore && (
            <div
              className="pointer-events-none absolute inset-x-0 -top-12 h-12"
              style={{ background: "linear-gradient(to top, rgba(255,255,255,.95), transparent)" }}
              aria-hidden="true"
            />
          )}
          <div className="px-5 sm:px-6 py-4 flex flex-wrap gap-3 items-center">
            {footer}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(16px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-in { animation: modal-in .3s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .animate-modal-in { animation: none; }
        }
      `}</style>
    </div>
  );
}

/* ─── Champs partagés ─── */

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border-2 border-gray-100 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none focus:ring-4 focus:ring-[#31B9AE]/10 transition-all";

export function AdminField({
  label, value, onChange, placeholder, type = "text", error, hint, disabled,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string; hint?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} ${error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""} ${
          disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
        }`}
      />
      {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
      {!error && hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function AdminTextarea({
  label, value, onChange, placeholder, rows = 4, hint, mono,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; hint?: string; mono?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputCls} resize-y ${mono ? "font-mono" : ""}`}
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function AdminSelect({
  label, value, options, onChange, labels,
}: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; labels?: Record<string, string>;
}) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => <option key={o} value={o}>{labels?.[o] ?? o}</option>)}
      </select>
    </div>
  );
}
