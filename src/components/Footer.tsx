import Link from "next/link";

const footerLinks = {
  "La SOBUP": [
    { name: "Présentation", href: "/a-propos" },
    { name: "Gouvernance", href: "/gouvernance" },
    { name: "Statuts", href: "/statuts" },
    { name: "Adhérer", href: "/adhesion" },
  ],
  "Scientifique": [
    { name: "Groupes de travail", href: "/gtt" },
    { name: "Recommandations", href: "/recommandations" },
    { name: "Journal SOBUP", href: "/journal" },
    { name: "Blog", href: "/blog" },
  ],
  "Activités": [
    { name: "Événements", href: "/evenements" },
    { name: "Formations", href: "/formations" },
    { name: "Webinaires", href: "/formations/webinaires" },
    { name: "Médiathèque", href: "/mediatheque" },
  ],
  "Ressources": [
    { name: "Annuaire", href: "/annuaire" },
    { name: "Carte interactive", href: "/carte" },
    { name: "Newsletter", href: "/newsletter" },
    { name: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-secondary font-semibold text-sm uppercase tracking-wide mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 text-center mb-4">
            Partenaires scientifiques
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
            <span className="hover:text-secondary transition-colors">SAPLF</span>
            <span className="text-gray-700">|</span>
            <span className="hover:text-secondary transition-colors">PATS</span>
            <span className="text-gray-700">|</span>
            <span className="hover:text-secondary transition-colors">PNT</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <p className="text-sm font-medium">SOBUP</p>
              <p className="text-xs text-gray-500">
                Société Burkinabè de Pneumologie
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} SOBUP. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
