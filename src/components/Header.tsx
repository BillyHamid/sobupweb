"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "Accueil", href: "/" },
  {
    name: "À propos",
    href: "/a-propos",
    children: [
      { name: "Présentation & historique", href: "/a-propos" },
      { name: "Vision, mission & valeurs", href: "/a-propos#vision" },
      { name: "Bureau & gouvernance", href: "/gouvernance" },
    ],
  },
  {
    name: "GTT",
    href: "/gtt",
    children: [
      { name: "Tous les groupes de travail", href: "/gtt" },
      { name: "GT Tuberculose", href: "/gtt/tuberculose" },
      { name: "GT Asthme & Allergie", href: "/gtt/asthme-allergie" },
      { name: "GT Oncologie thoracique", href: "/gtt/oncologie-thoracique" },
      { name: "GT Tabac & BPCO", href: "/gtt/tabac-bpco" },
      { name: "GT Pneumo-pédiatrie", href: "/gtt/pneumo-pediatrie" },
      { name: "GT Sommeil & VNI", href: "/gtt/sommeil-vni" },
      { name: "GT Imagerie thoracique", href: "/gtt/imagerie-thoracique" },
      { name: "GT Endoscopie bronchique", href: "/gtt/endoscopie-bronchique" },
      { name: "GT EFR", href: "/gtt/efr" },
      { name: "GT Infections non TB", href: "/gtt/infections-non-tb" },
      { name: "GT Environnement & Travail", href: "/gtt/environnement-travail" },
    ],
  },
  {
    name: "Événements",
    href: "/evenements",
    children: [
      { name: "Agenda scientifique", href: "/evenements" },
      { name: "Congrès SOBUP", href: "/evenements/9eme-congres" },
      { name: "1ère Journée Scientifique Régionale", href: "/evenements/journee-regionale" },
      { name: "Soumettre un abstract", href: "/abstracts" },
    ],
  },
  {
    name: "Formations",
    href: "/formations",
    children: [
      { name: "Échographie thoracique", href: "/formations/echographie-thoracique" },
      { name: "Pleuroscopie médicale", href: "/formations/pleuroscopie-medicale" },
      { name: "Rédaction scientifique", href: "/formations/redaction-scientifique" },
    ],
  },
  {
    name: "Publications",
    href: "/publications",
    children: [
      { name: "Blog SOBUP", href: "/blog" },
      { name: "Publication Scientifique", href: "/publications-scientifiques" },
      { name: "Newsletter SOBUP", href: "/journal" },
      { name: "Mediatheque", href: "/mediatheque" },
    ],
  },
  {
    name: "Annuaire",
    href: "/annuaire",
    children: [
      { name: "Annuaire des pneumologues", href: "/annuaire" },
      { name: "Liste des membres de la SOBUP", href: "/annuaire/membres" },
      { name: "Carte interactive", href: "/carte" },
    ],
  },
  { name: "Nous contacter", href: "/contact", button: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ── Top bar ── */}
      <div className="banniere-sobup text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between text-sm text-white/80">
          <p className="hidden sm:block italic font-semibold">
            « La santé respiratoire, un droit pour tout Burkinabè »
          </p>
          <div className="flex items-center gap-4 ml-auto">
            <a href="mailto:sobup01@gmail.com" className="hidden md:flex items-center gap-1 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              sobup01@gmail.com
            </a>
            <div className="w-px h-3 bg-white/20 hidden md:block"/>
            <Link href="/espace-membre" className="hover:text-white transition-colors font-medium">Connexion</Link>
            <Link href="/adhesion"
              className="font-bold text-white px-3 py-1 rounded transition-colors"
              style={{ background: "#e67e22" }}>
              Adhérer
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className="bg-background border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-[90px] items-center gap-1">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/logo.png"
                alt="Logo SOBUP"
                width={160}
                height={160}
                className="h-40 w-40 object-contain"
                priority
              />
              <div className="hidden sm:block">
                <p className="font-black text-4xl leading-none" style={{ color: "#E91E63" }}>
                  SOBUP
                </p>
                <p className="text-xs text-gray-400 font-semibold leading-tight mt-1">
                  Société Burkinabè de Pneumologie
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0 ml-2 flex-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative"
                  onMouseEnter={() => item.children && setOpenSub(item.name)}
                  onMouseLeave={() => setOpenSub(null)}>
                  {item.button ? (
                    <Link href={item.href}
                      className="flex items-center px-3 py-1.5 text-base font-bold text-white rounded-lg transition-all whitespace-nowrap hover:opacity-90 hover:-translate-y-0.5 ml-1"
                      style={{ background: "#e67e22" }}>
                      {item.name}
                    </Link>
                  ) : (
                  <Link href={item.href}
                    className="flex items-center gap-0.5 px-2.5 py-2 text-base font-bold rounded-lg transition-colors whitespace-nowrap"
                    style={{ color: openSub === item.name ? "#31B9AE" : "#334155" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#31B9AE"; (e.currentTarget as HTMLAnchorElement).style.background = "#E8F9F7"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = openSub === item.name ? "#31B9AE" : "#334155"; (e.currentTarget as HTMLAnchorElement).style.background = ""; }}>
                    {item.name}
                    {item.children && (
                      <svg className="w-3 h-3 opacity-40 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                      </svg>
                    )}
                  </Link>
                  )}
                  {item.children && openSub === item.name && (
                    <div className="absolute left-0 top-full w-72 bg-background rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {item.children.map((child) => (
                        <Link key={child.name} href={child.href}
                          className="block px-4 py-3 text-sm font-semibold transition-colors"
                          style={{ color: "#475569" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#E8F9F7"; (e.currentTarget as HTMLAnchorElement).style.color = "#31B9AE"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = ""; (e.currentTarget as HTMLAnchorElement).style.color = "#475569"; }}
                          onClick={() => setOpenSub(null)}>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden ml-auto p-2 rounded-lg transition-colors"
              style={{ color: "#31B9AE" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu">
              {mobileOpen
                ? <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t py-4 px-4" style={{ background: "#f0fafa" }}>
            {navigation.map((item) => (
              <div key={item.name}>
                <button
                  className="w-full flex items-center justify-between px-3 py-3 text-base font-bold rounded-lg transition-colors"
                  style={{ color: "#334155" }}
                  onClick={() => {
                    if (item.children) setMobileSub(mobileSub === item.name ? null : item.name);
                    else setMobileOpen(false);
                  }}>
                  {item.children
                    ? <><span>{item.name}</span>
                      <svg className={`w-4 h-4 transition-transform ${mobileSub === item.name ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg></>
                    : <Link href={item.href}
                        className={`w-full text-left${item.button ? " font-bold text-white px-3 py-1 rounded" : ""}`}
                        style={item.button ? { color: "#fff", background: "#e67e22" } : {}}
                        onClick={() => setMobileOpen(false)}>{item.name}</Link>
                  }
                </button>
                {item.children && mobileSub === item.name && (
                  <div className="pl-4 mb-1">
                    {item.children.map((child) => (
                      <Link key={child.name} href={child.href}
                        className="block px-3 py-2 text-sm font-medium transition-colors"
                        style={{ color: "#64748b" }}
                        onClick={() => setMobileOpen(false)}>
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-gray-200 mt-3 pt-3 flex gap-2">
              <Link href="/espace-membre"
                className="flex-1 text-center py-2.5 text-sm font-bold rounded-lg border-2"
                style={{ color: "#31B9AE", borderColor: "#31B9AE" }}
                onClick={() => setMobileOpen(false)}>Connexion</Link>
              <Link href="/adhesion"
                className="flex-1 text-center py-2.5 text-sm font-bold text-white rounded-lg"
                style={{ background: "#e67e22" }}
                onClick={() => setMobileOpen(false)}>Adhérer</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
