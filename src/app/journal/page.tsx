import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Highlight = { icon: string; label: string; desc: string };

type Newsletter = {
  id: string;
  numero: number;
  title: string;
  period: string;
  description: string | null;
  highlights: Highlight[] | null;
  cover_url: string | null;
  pdf_url: string;
  pdf_size: string | null;
};

export default async function JournalPage() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("newsletters")
    .select("id, numero, title, period, description, highlights, cover_url, pdf_url, pdf_size")
    .eq("published", true)
    .order("numero", { ascending: false });

  const all: Newsletter[] = data ?? [];
  const latest = all[0] ?? null;
  const archives = all.slice(1);

  if (!latest) {
    return (
      <section className="relative overflow-hidden text-white flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 70px)", background: "linear-gradient(160deg, #0B3D38 0%, #065E52 45%, #0a7265 100%)" }}>
        <div className="text-center px-4">
          <h1 className="text-2xl font-black mb-3">Newsletter SOBUP</h1>
          <p className="text-white/70 mb-6">Aucun numéro publié pour l&apos;instant.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)" }}>
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </section>
    );
  }

  const highlights: Highlight[] = Array.isArray(latest.highlights) ? latest.highlights : [];

  return (
    <>
      <section
        className="relative overflow-hidden text-white"
        style={{
          minHeight: archives.length > 0 ? "auto" : "calc(100vh - 70px)",
          background: "linear-gradient(160deg, #0B3D38 0%, #065E52 45%, #0a7265 100%)",
        }}
      >
        {/* Texture points */}
        <div className="absolute inset-0 pointer-events-none opacity-[.08]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Blobs flottants */}
        <div className="absolute pointer-events-none rounded-full"
          style={{
            top: "-100px", right: "-80px", width: "440px", height: "440px",
            background: "radial-gradient(circle, rgba(49,185,174,.42) 0%, transparent 70%)",
            filter: "blur(45px)", animation: "j-float 9s ease-in-out infinite",
          }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{
            bottom: "-80px", left: "-60px", width: "340px", height: "340px",
            background: "radial-gradient(circle, rgba(230,126,34,.28) 0%, transparent 70%)",
            filter: "blur(55px)", animation: "j-float 11s ease-in-out infinite reverse",
          }} />
        {/* Anneau tournant */}
        <div className="absolute pointer-events-none hidden md:block"
          style={{
            top: "10%", right: "6%", width: "260px", height: "260px", borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,.15)", animation: "j-spin 34s linear infinite",
          }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-20">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors mb-10"
            style={{ animation: "j-fade .6s ease both" }}>
            ← Retour à l&apos;accueil
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* COUVERTURE */}
            <div className="relative flex justify-center lg:justify-start" style={{ animation: "j-fadeup .8s ease both" }}>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-40 pointer-events-none"
                style={{ background: "radial-gradient(circle, #e67e22 0%, transparent 70%)", filter: "blur(8px)" }} />
              <div className="relative rounded-2xl overflow-hidden bg-white max-w-md w-full transition-transform duration-500 hover:rotate-0"
                style={{ transform: "rotate(-2.5deg)", boxShadow: "0 30px 80px rgba(0,0,0,.55), 0 8px 20px rgba(0,0,0,.25)" }}>
                {latest.cover_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={latest.cover_url} alt={`${latest.title} N°${latest.numero} — ${latest.period}`}
                    className="w-full h-auto block" />
                ) : (
                  <div className="w-full flex items-center justify-center bg-gray-100 text-gray-400" style={{ aspectRatio: "1/1.41" }}>
                    <span className="text-6xl">📰</span>
                  </div>
                )}
                <div className="absolute top-5 -right-1 px-4 py-1.5 text-[11px] font-black text-white tracking-widest shadow-lg"
                  style={{ background: "#e67e22", clipPath: "polygon(0 0, 100% 0, 100% 100%, 8px 100%, 0 75%)" }}>
                  NOUVEAU
                </div>
              </div>
            </div>

            {/* INFOS */}
            <div style={{ animation: "j-fadeup .8s ease both", animationDelay: ".15s" }}>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(49,185,174,.22)", border: "1px solid rgba(49,185,174,.4)", color: "#7EEAE4" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#7EEAE4", animation: "j-pulse 2s ease-in-out infinite" }} />
                Bulletin d&apos;information · Numéro {latest.numero}
              </span>

              <h1 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
                <span className="block">{latest.title}</span>
                <span className="block" style={{ color: "#7EEAE4" }}>{latest.period}</span>
              </h1>

              <div className="mb-6 rounded-full" style={{ width: "60px", height: "4px", background: "#e67e22" }} />

              {latest.description && (
                <p className="text-base md:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "rgba(255,255,255,.78)" }}>
                  {latest.description}
                </p>
              )}

              {highlights.length > 0 && (
                <div className="mb-9">
                  <p className="text-[11px] font-black uppercase tracking-[.2em] mb-3" style={{ color: "rgba(126,234,228,.75)" }}>
                    Au sommaire
                  </p>
                  <div className={`grid gap-2.5 ${highlights.length > 6 ? "sm:grid-cols-2 lg:grid-cols-2" : "sm:grid-cols-2"}`}>
                    {highlights.map((h, i) => (
                      <div key={`${h.label}-${i}`} className="flex items-start gap-3 px-4 py-3 rounded-xl"
                        style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)" }}>
                        <span className="text-xl shrink-0 leading-none mt-0.5" aria-hidden>{h.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white leading-tight">{h.label}</p>
                          {h.desc && (
                            <p className="text-xs mt-0.5 leading-snug" style={{ color: "rgba(255,255,255,.6)" }}>{h.desc}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <a href={latest.pdf_url} download
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-black text-white text-base transition-all hover:-translate-y-1"
                  style={{ background: "#e67e22", boxShadow: "0 16px 40px rgba(230,126,34,.5)" }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                  </svg>
                  Télécharger le PDF
                  {latest.pdf_size && <span className="text-xs font-normal opacity-80">· {latest.pdf_size}</span>}
                </a>
                <a href={latest.pdf_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all hover:bg-white/20"
                  style={{ color: "#fff", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.25)" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Lire en ligne
                </a>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes j-fadeup { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes j-fade { from { opacity: 0; } to { opacity: 1; } }
          @keyframes j-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-24px); } }
          @keyframes j-spin { to { transform: rotate(360deg); } }
          @keyframes j-pulse { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
        `}</style>
      </section>

      {/* ═══════════ ARCHIVES ═══════════ */}
      {archives.length > 0 && (
        <section className="py-16" style={{ background: "#f0fafa" }}>
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-10">
              <p className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>
                Numéros précédents
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 section-title">
                Archives du bulletin
              </h2>
              <p className="mt-3 text-sm text-gray-500 max-w-2xl mx-auto">
                Retrouvez tous les numéros parus du bulletin d&apos;information de la SOBUP.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {archives.map((n) => (
                <a key={n.id} href={n.pdf_url} target="_blank" rel="noopener noreferrer"
                  className="group bg-background rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 card-shadow flex flex-col">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden"
                    style={{ height: 260 }}>
                    {n.cover_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={n.cover_url} alt={`${n.title} N°${n.numero}`}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-5xl text-gray-300">📰</span>
                    )}
                    <span className="absolute top-3 left-3 text-[11px] font-black text-white px-2.5 py-1 rounded-full shadow-sm"
                      style={{ background: "#e67e22" }}>
                      N°{n.numero}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#31B9AE" }}>
                      {n.period}
                    </p>
                    <h3 className="font-black text-gray-900 text-sm leading-snug mb-2 group-hover:text-primary transition-colors">
                      {n.title}
                    </h3>
                    {n.description && (
                      <p className="text-xs text-gray-500 line-clamp-3 mb-3">{n.description}</p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: "#e67e22" }}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                      </svg>
                      Télécharger{n.pdf_size ? ` · ${n.pdf_size}` : ""}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
