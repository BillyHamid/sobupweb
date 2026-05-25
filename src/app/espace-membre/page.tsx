import Link from "next/link";

export default function EspaceMembrePage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: "#f0fafa" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="SOBUP" className="w-20 h-20 mx-auto mb-3"/>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Espace membre</h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre compte SOBUP</p>
        </div>

        {/* Card */}
        <div className="bg-background rounded-3xl shadow-xl p-8 border border-gray-100">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email professionnel</label>
              <input type="email" placeholder="votre.email@hopital.bf"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ "--tw-ring-color": "#31B9AE" } as React.CSSProperties}/>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Mot de passe</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ "--tw-ring-color": "#31B9AE" } as React.CSSProperties}/>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded"/>
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <a href="#" className="font-semibold hover:underline" style={{ color: "#31B9AE" }}>
                Mot de passe oublié ?
              </a>
            </div>
            <button type="submit"
              className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#31B9AE" }}>
              Se connecter
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"/></div>
            <div className="relative text-center"><span className="bg-background px-3 text-xs text-gray-400">ou</span></div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Pas encore membre ?{" "}
            <Link href="/adhesion" className="font-black hover:underline" style={{ color: "#e67e22" }}>
              Adhérer à la SOBUP →
            </Link>
          </p>
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
