"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Bell, ArrowRight, Sparkles, Check } from "lucide-react";

export default function MesFormationsPage() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="-m-6 lg:-m-8 min-h-[calc(100vh-72px)] relative overflow-hidden flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0B3D38 0%, #065E52 50%, #0a2724 100%)" }}>

      {/* ── Couche de particules / orbes flous ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grand orbe haut-droit */}
        <div
          className="absolute rounded-full"
          style={{
            top: "-15%", right: "-10%",
            width: "55vw", height: "55vw",
            background: "radial-gradient(circle, rgba(126,234,228,0.22) 0%, transparent 60%)",
            filter: "blur(60px)",
            animation: "orbFloat 18s ease-in-out infinite",
          }}
        />
        {/* Orbe bas-gauche */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-20%", left: "-10%",
            width: "50vw", height: "50vw",
            background: "radial-gradient(circle, rgba(230,126,34,0.18) 0%, transparent 60%)",
            filter: "blur(70px)",
            animation: "orbFloat 22s ease-in-out infinite reverse",
          }}
        />
        {/* Orbe central, lent */}
        <div
          className="absolute rounded-full"
          style={{
            top: "30%", left: "30%",
            width: "30vw", height: "30vw",
            background: "radial-gradient(circle, rgba(49,185,174,0.15) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "orbFloat 26s ease-in-out infinite",
          }}
        />

        {/* Grille de points */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Anneaux décoratifs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "50%", left: "50%",
            width: "600px", height: "600px",
            transform: "translate(-50%, -50%)",
            border: "1px solid rgba(126,234,228,0.08)",
            animation: "spinSlow 60s linear infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "50%", left: "50%",
            width: "850px", height: "850px",
            transform: "translate(-50%, -50%)",
            border: "1px dashed rgba(126,234,228,0.06)",
            animation: "spinSlow 90s linear infinite reverse",
          }}
        />
      </div>

      {/* ── Contenu central ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center">

        {/* Icône centrale animée */}
        <div className="relative inline-block mb-8 animate-fadeUp">
          <div className="absolute inset-0 rounded-3xl blur-2xl opacity-60"
            style={{ background: "linear-gradient(135deg, #31B9AE, #7EEAE4)" }} />
          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #31B9AE 0%, #7EEAE4 100%)",
              boxShadow: "0 20px 60px -10px rgba(49,185,174,0.5)",
            }}
          >
            <GraduationCap className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
          {/* Étincelle */}
          <span
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce"
            style={{ background: "#e67e22", animationDuration: "2.5s" }}
          >
            <Sparkles className="w-4 h-4" />
          </span>
        </div>

        {/* Pill "Coming soon" */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 animate-fadeUp"
          style={{
            background: "rgba(126,234,228,0.12)",
            border: "1px solid rgba(126,234,228,0.25)",
            animationDelay: "100ms",
          }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: "#7EEAE4" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#7EEAE4" }} />
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: "#7EEAE4" }}>
            En préparation
          </span>
        </div>

        {/* Titre principal */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-[1.05] animate-fadeUp tracking-tight"
          style={{ animationDelay: "200ms" }}>
          Les formations<br />
          arrivent{" "}
          <span
            style={{
              backgroundImage: "linear-gradient(135deg, #7EEAE4 0%, #31B9AE 50%, #e67e22 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            très bientôt.
          </span>
        </h1>

        {/* Sous-titre */}
        <p className="text-white/65 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10 animate-fadeUp"
          style={{ animationDelay: "300ms" }}>
          Notre équipe pédagogique prépare un catalogue de formations
          d&apos;excellence pour vous accompagner dans votre pratique quotidienne.
        </p>

        {/* CTA — notification + retour */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-fadeUp"
          style={{ animationDelay: "400ms" }}>

          {subscribed ? (
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white"
              style={{ background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.4)" }}>
              <Check className="w-4 h-4" style={{ color: "#7EEAE4" }} />
              Vous serez prévenu au lancement
            </div>
          ) : (
            <button
              onClick={() => setSubscribed(true)}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black text-white shadow-xl hover:-translate-y-0.5 transition-all"
              style={{
                background: "linear-gradient(135deg, #31B9AE 0%, #065E52 100%)",
                boxShadow: "0 10px 30px -5px rgba(49,185,174,0.5)",
              }}
            >
              <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Me prévenir au lancement
            </button>
          )}

          <Link
            href="/espace-membre/dashboard"
            className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl text-sm font-bold text-white/80 hover:text-white border-2 transition-all hover:-translate-y-0.5 hover:bg-white/5"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            Retour au tableau de bord <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* ── Animations ── */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(40px, -30px) scale(1.05); }
          66%      { transform: translate(-30px, 40px) scale(0.95); }
        }
        @keyframes spinSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 800ms cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}
