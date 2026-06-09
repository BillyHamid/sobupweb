import PageHero from "@/components/PageHero";

const bureau = [
  { title: "Président", name: "Dr Abdoul Risgou OUEDRAOGO (MCA)", institution: "CHU Tengadogo", photo: "/bureau/dr-ouedraogo-abdoul-risgou.jpeg" },
  { title: "Secrétaire Général", name: "Dr Soumaila MAIGA", institution: "CHU Yalgado Ouédraogo", photo: "/bureau/dr-maiga-soumaila.jpeg" },
  { title: "Secrétaire Générale Adjointe", name: "Dr Sandrine Nadège DAMOUE", institution: "CHU Bogodogo", photo: "/bureau/dr-damoue-sandrine-nadege.jpeg" },
  { title: "Trésorière", name: "Dr Eleonore SIAMBO/SENI", institution: "CHR Ziniaré", photo: "/bureau/dr-siamboseni-eleonore.jpeg" },
  { title: "Secrétaire aux Activités Scientifiques", name: "Dr Adama SOURABIE", institution: "CHU Souro Sanou", photo: "/bureau/dr-sourabie-adama.jpeg" },
  { title: "Secrétaire Adjoint aux Activités Scientifiques", name: "Dr Ghislain BOUGMA", institution: "", photo: "/bureau/dr-bougma-ghislain.jpeg" },
  { title: "Secrétaire à la Formation et à la Recherche", name: "Dr Arnaud TIENDREBEOGO", institution: "CHU Yalgado Ouédraogo", photo: "/bureau/dr-tiendrebeogo-arnaud.jpeg" },
  { title: "Secrétaire Adjoint à la Formation et à la Recherche", name: "Dr R. M. I. Tanguy NIKIEMA", institution: "CHR Manga", photo: "/bureau/dr-nikiema-tanguy.jpeg" },
  { title: "Secrétaire à la Mobilisation des Ressources", name: "Dr Boureima KOUMBEM", institution: "CHU Pédiatrie Charles de Gaulles", photo: "/bureau/dr-koumbem-boureima.jpeg" },
  { title: "Secrétaire à la Communication", name: "Dr Aly COULIBALY", institution: "CHR Koudougou", photo: "/bureau/dr-coulibaly-aly.jpeg" },
  { title: "Rédacteur en Chef", name: "Dr Edem KUNAKEY", institution: "CHU Guadeloupe", photo: "/bureau/dr-kunakey-edem.png" },
  { title: "Rédacteur en Chef Adjoint", name: "Dr Dimitri SOUBEIGA", institution: "CHR Banfora", photo: "/bureau/dr-soubeiga-dimitri.jpeg" },
  { title: "Représentante des Résidents en Pneumologie", name: "Dr Nouria BATIEBO/YAO", institution: "CHU Yalgado Ouédraogo", photo: "/bureau/dr-batieboyao-nouria.jpeg" },
];

const honoraires = [
  { title: "Président d'Honneur", name: "Pr Martial OUEDRAOGO", institution: "CHU Yalgado Ouédraogo", photo: "/bureau/pr-martial-ouedraogo.png" },
];

export default function GouvernancePage() {
  return (
    <>
      <PageHero
        title="Bureau & Gouvernance"
        subtitle="Les instances dirigeantes de la SOBUP, élues par l'Assemblée Générale pour un mandat de 3 ans."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "À propos", href: "/a-propos" }, { label: "Gouvernance" }]}
        shape="diagonal-right"
      />

      {/* Bureau exécutif */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Mandat 2026–2028</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Bureau Exécutif</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bureau.map((member) => (
              <div key={member.title}
                className="bg-background rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group card-shadow text-center">
                <div
                  className={`relative flex items-center justify-center overflow-hidden ${member.photo ? "h-64" : "h-40"}`}
                  style={member.photo ? undefined : { background: "#E8F9F7" }}>
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={`Portrait — ${member.name}`}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl"
                      style={{ background: "#31B9AE" }}>
                      <span className="text-white">👨‍⚕️</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#5BCEC4" }}>
                    {member.title}
                  </p>
                  <h3 className="font-black text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-400">{member.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Présidents d'honneur */}
      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-2xl">🏅</span> Président d&apos;Honneur
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {honoraires.map((h) => (
              <div key={h.name} className="bg-background rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group card-shadow text-center">
                <div className={`relative flex items-center justify-center overflow-hidden ${h.photo ? "h-64" : "h-40"}`}
                  style={h.photo ? undefined : { background: "#fef0e6" }}>
                  {h.photo ? (
                    <img src={h.photo} alt={`Portrait — ${h.name}`} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl"
                      style={{ background: "#f59e0b" }}>
                      <span className="text-white">🏅</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#5BCEC4" }}>{h.title}</p>
                  <h3 className="font-black text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">{h.name}</h3>
                  <p className="text-xs text-gray-400">{h.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commissaire aux comptes */}
      <section className="py-12 bg-background border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-2xl">🔍</span> Commissaire aux comptes
          </h2>
          <div className="inline-block">
            <div className="bg-background rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group card-shadow text-center" style={{ width: "280px" }}>
              <div className="relative flex items-center justify-center overflow-hidden h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/bureau/marcel-kuire.jpeg"
                  alt="Portrait — Marcel KUIRE"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#5BCEC4" }}>
                  Commissaire aux comptes
                </p>
                <h3 className="font-black text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">
                  Marcel KUIRE
                </h3>
                <p className="text-xs text-gray-400">Hôpital du district de Boulmiougou</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conseillers techniques */}
      <section className="py-12" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-2xl">👥</span> Conseillers techniques
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: "Pr Gisèle BADOUM", institution: "CHU Yalgado Ouédraogo", title: "Conseiller Technique", photo: "/bureau/pr-gisele-badoum.jpeg" },
              { name: "Pr Kadiatou BONCOUNGOU", institution: "CHU Yalgado Ouédraogo", title: "Conseiller Technique", photo: "/bureau/pr-kadiatou-boncoungou.jpeg" },
              { name: "Dr Emile BIRBA", institution: "CHU Souro Sanou", title: "Conseiller Technique", photo: "/bureau/emile-birba.jpg" },
              { name: "Dr Adama ZIGANI", institution: "CNLAT", title: "Conseiller Technique", photo: "/bureau/zigani.jpeg" },
              { name: "Dr Célestine KI", institution: "SP CNLS/IST", title: "Conseiller Technique", photo: "/bureau/ki-celestine.jpeg" },
            ].map((person, i) => (
              <div key={i} className="bg-background rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group card-shadow text-center">
                <div
                  className={`relative flex items-center justify-center overflow-hidden ${person.photo ? "h-64" : "h-40"}`}
                  style={person.photo ? undefined : { background: "#E8F9F7" }}>
                  {person.photo ? (
                    <img
                      src={person.photo}
                      alt={`Portrait — ${person.name}`}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl"
                      style={{ background: "#31B9AE" }}>
                      <span className="text-white">👨‍⚕️</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#5BCEC4" }}>
                    {person.title}
                  </p>
                  <h3 className="font-black text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-xs text-gray-400">{person.institution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secrétariat */}
      <section className="py-12 bg-background border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-2xl">📝</span> Secrétariat
          </h2>
          <div className="inline-block">
            <div className="bg-background rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group card-shadow text-center" style={{ width: "280px" }}>
              <div className="relative flex items-center justify-center overflow-hidden h-64">
                <img src="/bureau/sylvie-dabone.jpeg" alt="Portrait — Sylvie DABONE" className="w-full h-full object-cover object-top" />
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#5BCEC4" }}>
                  Secrétariat
                </p>
                <h3 className="font-black text-gray-900 text-sm mb-1 group-hover:text-primary transition-colors">
                  Sylvie DABONE
                </h3>
                <p className="text-xs text-gray-400">CHU Yalgado Ouédraogo</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
