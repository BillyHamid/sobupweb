import PageHero from "@/components/PageHero";
import Link from "next/link";

export default function FormationsPage() {
  return (
    <>
      <PageHero
        title="Formations"
        subtitle="Modules de formation en ligne, webinaires en direct et replays — accessibles à votre rythme, pour tous les membres."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Formations" }]}
        tag="Formation continue"
      />

      {/* Stats */}
      <section className="bg-background py-8 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "12", label: "Modules disponibles", icon: "📚" },
            { value: "380+", label: "Membres inscrits", icon: "👥" },
            { value: "100%", label: "Gratuit pour les membres", icon: "🎁" },
            { value: "🏅", label: "Attestation automatique", icon: "" },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl" style={{ background: "#f0fafa" }}>
              <p className="text-2xl font-black mb-1" style={{ color: "#31B9AE" }}>{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formations à venir — Inscriptions ouvertes */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-1 w-10 rounded-full" style={{ background: "#e67e22" }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#e67e22" }}>📢 À venir</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 section-title">Formations à venir</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl">Rejoignez nos prochaines sessions — inscriptions ouvertes.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full text-white shadow" style={{ background: "#e67e22" }}>
              ⭐ Inscriptions ouvertes
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🩻", title: "Échographie thoracique", desc: "Formation pratique à l'échographie pleuro-pulmonaire au lit du patient.", href: "/formations/echographie-thoracique" },
              { icon: "🫁", title: "Pleuroscopie médicale", desc: "Module pratique de pleuroscopie médicale et diagnostic des épanchements pleuraux.", href: "/formations/pleuroscopie-medicale" },
              { icon: "✍️", title: "Rédaction scientifique", desc: "De la recherche bibliographique à la publication — IMRaD, soumission et peer review.", href: "/formations/redaction-scientifique" },
            ].map((f) => (
              <div key={f.title} className="bg-background rounded-2xl border-2 p-6 hover:shadow-xl hover:-translate-y-1 transition-all card-shadow flex flex-col" style={{ borderColor: "rgba(230,126,34,.15)" }}>
                <span className="text-4xl block mb-3">{f.icon}</span>
                <h3 className="font-black text-gray-900 text-lg mb-2 leading-tight">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{f.desc}</p>
                <div className="flex gap-2">
                  <Link href={f.href} className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-colors hover:bg-orange-50" style={{ color: "#e67e22", borderColor: "#e67e22" }}>
                    En savoir plus
                  </Link>
                  <Link href="/espace-membre" className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:-translate-y-0.5" style={{ background: "#e67e22" }}>
                    S&apos;inscrire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
