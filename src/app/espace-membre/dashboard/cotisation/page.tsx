"use client";

import { CreditCard, CheckCircle2, Calendar, Download, Receipt, ShieldCheck } from "lucide-react";

const historique = [
  { annee: "2026", date: "12 janvier 2026", montant: "30 000 F CFA", methode: "Mobile Money", statut: "Payée", color: "#22c55e" },
  { annee: "2025", date: "8 janvier 2025", montant: "25 000 F CFA", methode: "Virement bancaire", statut: "Payée", color: "#22c55e" },
  { annee: "2024", date: "15 janvier 2024", montant: "25 000 F CFA", methode: "Espèces", statut: "Payée", color: "#22c55e" },
  { annee: "2023", date: "20 février 2023", montant: "25 000 F CFA", methode: "Mobile Money", statut: "Payée", color: "#22c55e" },
  { annee: "2022", date: "5 mars 2022", montant: "25 000 F CFA", methode: "Espèces", statut: "Payée", color: "#22c55e" },
];

export default function CotisationPage() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">

      {/* En-tête */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Ma cotisation</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Gérez votre cotisation annuelle et consultez l&apos;historique de vos paiements.</p>
      </div>

      {/* Carte statut */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden p-5 sm:p-7 lg:p-8 text-white relative"
        style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 70%, #31B9AE 130%)" }}>
        {/* Décors */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #7EEAE4, transparent)" }} />

        <div className="relative grid lg:grid-cols-3 gap-5 sm:gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "#22c55e" }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/90 px-2 py-0.5 rounded-full"
                style={{ background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.3)" }}>
                Cotisation 2026 — Payée
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Vous êtes à jour ✓</h2>
            <p className="text-white/75 text-xs sm:text-sm max-w-md leading-relaxed mb-5">
              Votre cotisation 2026 a été enregistrée le <strong>12 janvier 2026</strong>. Elle vous donne accès à tous les services de la SOBUP jusqu&apos;au <strong>31 décembre 2026</strong>.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black text-white hover:-translate-y-0.5 transition-all"
                style={{ background: "#e67e22" }}>
                <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Télécharger le reçu
              </button>
              <button className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black border-2 hover:-translate-y-0.5 transition-all"
                style={{ color: "#7EEAE4", borderColor: "rgba(126,234,228,0.4)", background: "rgba(49,185,174,0.1)" }}>
                Historique complet
              </button>
            </div>
          </div>

          {/* Mini bloc info */}
          <div className="rounded-2xl p-4 sm:p-5 backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "#7EEAE4" }}>Détails</p>
            <div className="space-y-2 text-xs">
              {[
                { l: "Montant 2026", v: "30 000 F CFA" },
                { l: "Date du paiement", v: "12 janv. 2026" },
                { l: "Mode", v: "Mobile Money" },
                { l: "Référence", v: "SOBUP-2026-EK-042" },
                { l: "Échéance suivante", v: "31 déc. 2026" },
              ].map((d) => (
                <div key={d.l} className="flex justify-between gap-2">
                  <span className="text-white/65 shrink-0">{d.l}</span>
                  <span className="font-bold text-white text-right truncate">{d.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Avantages */}
      <section>
        <h2 className="font-black text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Vos avantages en tant que membre à jour</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: "🎓", titre: "Formations gratuites", desc: "Accès à toutes les formations SOBUP" },
            { icon: "📰", titre: "Newsletter trimestrielle", desc: "Accès anticipé aux numéros" },
            { icon: "👥", titre: "GTT thématiques", desc: "Rejoindre tous les groupes" },
            { icon: "🏅", titre: "Attestations DPC", desc: "Validation officielle de votre formation" },
            { icon: "📚", titre: "Bibliothèque numérique", desc: "Accès complet aux ressources" },
            { icon: "🎤", titre: "Tarif congrès réduit", desc: "Jusqu'à -50% sur les inscriptions" },
            { icon: "🤝", titre: "Annuaire des membres", desc: "Réseau professionnel SOBUP" },
            { icon: "📨", titre: "Messagerie sécurisée", desc: "Communication entre membres" },
          ].map((a) => (
            <div key={a.titre} className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{a.icon}</div>
              <p className="font-black text-gray-900 text-xs sm:text-sm leading-tight">{a.titre}</p>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-snug">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Historique */}
      <section>
        <h2 className="font-black text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Historique de mes cotisations</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Vue tableau (≥ sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-wider text-gray-500">Année</th>
                  <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-wider text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-wider text-gray-500">Montant</th>
                  <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-wider text-gray-500 hidden md:table-cell">Méthode</th>
                  <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-wider text-gray-500">Statut</th>
                  <th className="text-right px-6 py-3 text-xs font-black uppercase tracking-wider text-gray-500">Reçu</th>
                </tr>
              </thead>
              <tbody>
                {historique.map((h, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-black text-gray-900 text-sm">{h.annee}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{h.date}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm whitespace-nowrap">{h.montant}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 hidden md:table-cell">
                      <span className="flex items-center gap-1.5"><CreditCard className="w-3 h-3" />{h.methode}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1"
                        style={{ background: "#f0fdf4", color: "#22c55e" }}>
                        <CheckCircle2 className="w-3 h-3" /> {h.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all hover:-translate-y-0.5"
                        style={{ color: "#31B9AE", borderColor: "#31B9AE" }}>
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vue cartes (mobile uniquement) */}
          <div className="sm:hidden divide-y divide-gray-100">
            {historique.map((h, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-black text-gray-900 text-base">{h.annee}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {h.date}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0"
                    style={{ background: "#f0fdf4", color: "#22c55e" }}>
                    <CheckCircle2 className="w-2.5 h-2.5" /> {h.statut}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{h.montant}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <CreditCard className="w-3 h-3" /> {h.methode}
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all"
                    style={{ color: "#31B9AE", borderColor: "#31B9AE" }}>
                    <Download className="w-3 h-3" /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <div className="rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-4 border border-gray-100" style={{ background: "#f0f9ff" }}>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "#0ea5e9" }}>
          <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <p className="font-black text-gray-900 text-sm">Paiements sécurisés 100%</p>
          <p className="text-xs text-gray-500 mt-0.5">Tous les paiements sont traités via des passerelles sécurisées (Mobile Money, virement bancaire, cartes). Vos données ne sont jamais stockées par la SOBUP.</p>
        </div>
      </div>
    </div>
  );
}
