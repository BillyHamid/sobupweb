"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Bell, Star } from "lucide-react";
import Image from "next/image";

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="relative max-w-4xl mx-auto rounded-[32px] bg-zinc-950 text-white overflow-hidden shadow-2xl">
          {/* Background blobs */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-teal-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-[60px] -ml-24 -mb-24 pointer-events-none" />

          <div className="relative z-10 p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10">
            {/* Left */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-zinc-700">
                  <Image src="/logo.png" width={72} height={72} alt="SOBUP" className="object-contain w-16 h-16" />
                </div>
                <span className="ml-3 flex items-center gap-1.5 py-1 px-3 bg-white/5 rounded-full border border-white/10">
                  <Star className="w-2.5 h-2.5 fill-zinc-100 text-zinc-100" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/90">+500 membres abonnés</span>
                </span>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-black mb-4 tracking-tighter leading-none uppercase"
              >
                Actualités <span className="text-teal-400 italic">scientifiques</span>{" "}
                <br />dans votre boîte mail.
              </motion.h2>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm">
                Recevez chaque mois les dernières publications, congrès, formations et recommandations en pneumologie africaine.
              </p>
            </div>

            {/* Right */}
            <div className="lg:w-1/2 w-full">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <span className="text-4xl block mb-3">✅</span>
                    <p className="text-white font-bold text-sm">Merci pour votre inscription !</p>
                    <p className="text-zinc-400 text-xs mt-1">Vous recevrez notre prochaine newsletter.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-white/40 mb-1">
                        <Bell className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Abonnement newsletter</span>
                      </div>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 group-focus-within:text-white transition-colors" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Votre adresse email professionnelle"
                          className="w-full h-12 pl-11 pr-4 bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl focus:border-white/30 focus:outline-none transition-all font-bold text-xs"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-white text-zinc-950 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      S&apos;abonner à la newsletter
                      <Send className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-center text-[9px] text-white/30 font-bold uppercase tracking-widest">
                      Pas de spam. Désinscription à tout moment.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
