import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";
import { RESPIRE_MODULES } from "@/lib/formations";

export const dynamic = "force-dynamic";

export default async function FormationApplicationsPage({ searchParams }: { searchParams: Promise<{ module?: string; page?: string }> }) {
  if (!(await isAdminAuthenticated())) return null;
  const filters = await searchParams;
  const moduleId = ["1", "2", "3"].includes(filters.module ?? "") ? Number(filters.module) : 0;
  const page = Math.max(1, Math.min(10000, Number.parseInt(filters.page ?? "1", 10) || 1));
  const pageSize = 30;
  const db = createAdminClient();
  let query = db.from("formation_applications").select("id, nom, prenom, contact, modules, motivation_path, created_at", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
  if (moduleId) query = query.contains("modules", [moduleId]);
  const { data, error, count } = await query;
  return <div className="space-y-6 p-5 sm:p-8">
    <div><p className="text-xs font-bold uppercase tracking-widest text-[#08796c]">RESPIRE-BF</p><h1 className="mt-2 text-2xl font-black text-slate-900">Candidatures aux formations</h1><p className="mt-2 text-sm text-slate-500">Coordonnées, modules demandés et documents privés des candidats.</p></div>
    <form className="flex flex-wrap items-end gap-3"><label className="text-sm font-medium">Filtrer par module<select name="module" defaultValue={String(moduleId)} className="mt-2 block rounded-lg border border-slate-300 bg-white p-3"><option value="0">Tous les modules</option>{RESPIRE_MODULES.map(m => <option key={m.id} value={m.id}>Module {m.id} — {m.title}</option>)}</select></label><button className="rounded-lg bg-[#065e52] px-4 py-3 text-sm font-bold text-white">Filtrer</button></form>
    {error ? <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Chargement des candidatures impossible. Vérifiez la connexion Supabase et l’application du script supabase-formations.sql.</div> : <>
      <p className="text-sm text-slate-600">{count ?? 0} candidature(s)</p>
      {!data?.length ? <p className="rounded-xl bg-white p-8 text-slate-500">Aucune candidature pour cette sélection.</p> : <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50"><tr>{["Candidat", "Contact", "Modules", "Documents", "Reçue le"].map(t => <th key={t} scope="col" className="p-4">{t}</th>)}</tr></thead><tbody>{data.map(row => <tr key={row.id} className="border-t border-slate-100"><td className="p-4"><p className="font-semibold">{row.prenom} {row.nom}</p><p className="mt-1 max-w-52 break-all text-xs text-slate-400">RESPIRE-{row.id}</p></td><td className="max-w-60 break-words p-4">{row.contact}</td><td className="p-4">{(row.modules as number[]).map(id => `M${id}`).join(" · ")}</td><td className="p-4"><div className="flex flex-col gap-2"><a className="font-semibold text-[#08796c] underline" href={`/api/admin/formations/${row.id}/document?type=cv`}>Télécharger le CV</a>{row.motivation_path && <a className="text-[#08796c] underline" href={`/api/admin/formations/${row.id}/document?type=motivation`}>Lettre de motivation</a>}</div></td><td className="whitespace-nowrap p-4">{new Date(row.created_at).toLocaleString("fr-FR", { timeZone: "Africa/Ouagadougou" })}</td></tr>)}</tbody></table></div>}
      <nav aria-label="Pagination" className="flex gap-4 text-sm font-semibold text-[#08796c]">{page > 1 && <Link href={`?module=${moduleId}&page=${page - 1}`}>Page précédente</Link>}{page * pageSize < (count ?? 0) && <Link href={`?module=${moduleId}&page=${page + 1}`}>Page suivante</Link>}</nav>
    </>}
  </div>;
}
