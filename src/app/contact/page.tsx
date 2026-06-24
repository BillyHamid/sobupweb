import PageHero from "@/components/PageHero";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Building2, ExternalLink } from "lucide-react";

const SOBUP_EMAIL = "sobup01@gmail.com";
const SOBUP_ADDRESS = "Service de Pneumologie, CHU Yalgado Ouédraogo, Ouagadougou, Burkina Faso";

const contactCards = [
  {
    icon: Building2,
    title: "Siège social",
    lines: [
      "Service de Pneumologie",
      "CHU Yalgado Ouédraogo",
      "Ouagadougou, Burkina Faso",
    ],
    accent: "#31B9AE",
    bg: "#E8F9F7",
  },
  {
    icon: Mail,
    title: "Email",
    lines: [SOBUP_EMAIL],
    href: `mailto:${SOBUP_EMAIL}`,
    accent: "#065E52",
    bg: "#E8F9F7",
  },
  {
    icon: Clock,
    title: "Disponibilité",
    lines: ["Lun – Ven : 8h – 17h", "Samedi : 8h – 12h"],
    accent: "#e67e22",
    bg: "#FFF4E6",
  },
];

const subjects = [
  "Adhésion & cotisation",
  "Groupes de Travail Thématiques",
  "Événements & congrès",
  "Formations & EPU",
  "Journal scientifique",
  "Partenariat scientifique",
  "Presse & communication",
  "Autre",
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Échangeons ensemble"
        subtitle="Une question, une suggestion ou un projet à partager ? L'équipe SOBUP vous répond généralement sous 48 heures."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
        tag="Nous contacter"
        shape="arrow-down"
      />

      {/* ─── Bandeau d'accès rapide ─── */}
      <section className="bg-background border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: Mail, label: "Écrire un email", value: SOBUP_EMAIL, href: `mailto:${SOBUP_EMAIL}`, color: "#31B9AE" },
            { icon: MessageCircle, label: "Envoyer un message", value: "Formulaire ci-dessous", href: "#contact-form", color: "#065E52" },
            { icon: MapPin, label: "Nous rendre visite", value: "CHU Yalgado Ouédraogo", href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SOBUP_ADDRESS)}`, color: "#e67e22" },
          ].map((q) => {
            const Icon = q.icon;
            return (
              <a
                key={q.label}
                href={q.href}
                target={q.href.startsWith("http") ? "_blank" : undefined}
                rel={q.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 p-4 rounded-2xl border-2 border-transparent transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "#f8fafc" }}
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: q.color, color: "white" }}>
                  <Icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">{q.label}</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{q.value}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
              </a>
            );
          })}
        </div>
      </section>

      {/* ─── Bloc principal ─── */}
      <section id="contact-form" className="py-16" style={{ background: "#f0fafa" }}>
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-5 gap-8">

          {/* ─── Formulaire ─── */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm">
            <div className="mb-7">
              <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: "#31B9AE" }}>Formulaire</p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-sm text-gray-500">
                Tous les champs sont obligatoires. Vous recevrez un accusé de réception par email.
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Nom complet</label>
                  <input
                    type="text"
                    placeholder="Dr Kaboré Aristide"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Téléphone <span className="text-gray-300 font-normal normal-case">(optionnel)</span></label>
                  <input
                    type="tel"
                    placeholder="+226 70 00 00 00"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Sujet</label>
                  <select
                    defaultValue=""
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none transition-all text-gray-700"
                  >
                    <option value="" disabled>Choisir un sujet…</option>
                    {subjects.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Message</label>
                <textarea
                  rows={6}
                  placeholder="Décrivez votre demande en quelques lignes…"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 text-sm bg-gray-50 focus:bg-white focus:border-[#31B9AE] focus:outline-none transition-all resize-none"
                />
              </div>

              <label className="flex items-start gap-3 text-xs text-gray-500 cursor-pointer">
                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded accent-[#31B9AE]" />
                <span>
                  J&apos;accepte que la SOBUP utilise mes données personnelles uniquement pour répondre à ma demande.
                  Aucune diffusion à des tiers.
                </span>
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)", boxShadow: "0 10px 28px rgba(49,185,174,.35)" }}
              >
                Envoyer le message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* ─── Colonne infos ─── */}
          <div className="lg:col-span-2 space-y-5">
            {contactCards.map((c) => {
              const Icon = c.icon;
              const content = (
                <div className="flex items-start gap-4">
                  <span
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: c.bg, color: c.accent }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: c.accent }}>
                      {c.title}
                    </p>
                    {c.lines.map((line, i) => (
                      <p key={i} className="text-sm text-gray-700 leading-relaxed font-medium">{line}</p>
                    ))}
                  </div>
                </div>
              );
              return c.href ? (
                <a
                  key={c.title}
                  href={c.href}
                  className="group block bg-white rounded-2xl p-5 border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={c.title}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {content}
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* ─── Bloc carte + CTA ─── */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#31B9AE" }}>Nous trouver</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-tight">
              Au cœur du CHU Yalgado Ouédraogo
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Le secrétariat de la SOBUP est hébergé au sein du Service de Pneumologie du CHU Yalgado Ouédraogo,
              référence nationale en pathologies respiratoires à Ouagadougou.
            </p>
            <div className="space-y-3 mb-6">
              {[
                { icon: MapPin, text: "Avenue Oubritenga, Ouagadougou — Burkina Faso" },
                { icon: Phone, text: "Standard CHU Yalgado : +226 25 30 66 04" },
                { icon: Mail, text: SOBUP_EMAIL },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.text} className="flex items-center gap-3 text-sm text-gray-700">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: "#31B9AE" }} />
                    <span>{row.text}</span>
                  </div>
                );
              })}
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SOBUP_ADDRESS)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#e67e22" }}
            >
              Ouvrir dans Google Maps
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100" style={{ height: "380px" }}>
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(SOBUP_ADDRESS)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="Localisation SOBUP — CHU Yalgado Ouédraogo"
            />
          </div>
        </div>
      </section>
    </>
  );
}
