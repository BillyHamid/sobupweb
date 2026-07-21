"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "sobup_view_counted";

/**
 * Compteur visible du nombre total de visites du site.
 * - Incrémente le compteur une seule fois par session (via localStorage flag).
 * - Se rafraîchit automatiquement.
 * - N'affiche rien tant qu'on n'a pas de valeur (évite le "0" qui saute à un grand nombre).
 */
export default function VisitCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === "1";

    const url = "/api/analytics/track";
    fetch(url, { method: alreadyCounted ? "GET" : "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.total === "number") {
          setTotal(data.total);
          if (!alreadyCounted) sessionStorage.setItem(SESSION_KEY, "1");
        }
      })
      .catch(() => {
        /* offline ou API indisponible — on n'affiche rien */
      });
  }, []);

  if (total === null || total < 1) return null;

  const formatted = new Intl.NumberFormat("fr-FR").format(total);

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs text-gray-400"
      title="Nombre total de visites depuis le lancement de sobup.online"
    >
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: "#31B9AE", boxShadow: "0 0 0 2px rgba(49,185,174,0.15)" }}
      />
      <span className="tabular-nums font-medium text-gray-500">{formatted}</span>
      <span>visites</span>
    </span>
  );
}
