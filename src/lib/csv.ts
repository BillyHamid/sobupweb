/**
 * Génère un CSV compatible Excel (séparateur `;`, BOM UTF-8).
 * Excel FR interprète la virgule comme séparateur décimal — d'où le point-virgule.
 */
export function toCsv(
  headers: { key: string; label: string }[],
  rows: Record<string, unknown>[]
): string {
  const escape = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/\r?\n/g, " ").trim();
    // Guillemets doublés si le contenu contient un séparateur, un guillemet ou un retour
    return /[";]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const head = headers.map((h) => escape(h.label)).join(";");
  const body = rows.map((r) => headers.map((h) => escape(r[h.key])).join(";"));
  // ﻿ = BOM, indispensable pour que Excel lise les accents correctement
  return "﻿" + [head, ...body].join("\r\n");
}

/** En-têtes HTTP pour forcer le téléchargement d'un CSV. */
export function csvHeaders(filename: string): HeadersInit {
  return {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store",
  };
}

/** Formate une date ISO en JJ/MM/AAAA HH:MM pour les exports. */
export function csvDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
