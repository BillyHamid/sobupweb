"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GTTJoinModal from "./GTTJoinModal";
import { useSessionUser } from "@/lib/userSession";

interface Props {
  gttName: string;
  gttColor: string;
  label?: string;
  variant?: "sidebar" | "card";
}

export default function GTTJoinButton(props: Props) {
  return (
    <Suspense fallback={<GTTJoinButtonFallback {...props} />}>
      <GTTJoinButtonInner {...props} />
    </Suspense>
  );
}

function GTTJoinButtonFallback({ gttColor, label = "Rejoindre ce groupe", variant = "sidebar" }: Props) {
  return (
    <button
      className={`font-bold text-white text-sm ${variant === "sidebar" ? "block w-full text-center py-2.5 rounded-xl" : "inline-block px-5 py-2.5 rounded-xl"}`}
      style={{ background: gttColor }}
      disabled
    >
      {label}
    </button>
  );
}

function GTTJoinButtonInner({ gttName, gttColor, label = "Rejoindre ce groupe", variant = "sidebar" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const user = useSessionUser();

  // Vérification en temps réel si déjà membre du GTT
  const alreadyMember = !!user?.gttMemberships?.some(
    (m) => m.name.toLowerCase() === gttName.toLowerCase()
  );

  // Auto-ouvrir le formulaire si on revient avec ?join=1 et qu'on est connecté
  useEffect(() => {
    if (user && !alreadyMember && searchParams?.get("join") === "1") {
      setOpen(true);
    }
  }, [user, alreadyMember, searchParams]);

  const handleClick = () => {
    if (!user) {
      setShowAuthGate(true);
      return;
    }
    if (alreadyMember) return;
    setOpen(true);
  };

  const handleGoToLogin = () => {
    // Mémoriser où revenir et ce qu'il faut faire après la connexion
    const returnTo = `${pathname}?join=1`;
    if (typeof window !== "undefined") {
      localStorage.setItem("sobup_after_login_redirect", returnTo);
    }
    setShowAuthGate(false);
    router.push(`/espace-membre?next=${encodeURIComponent(returnTo)}`);
  };

  // Si déjà membre → afficher un badge "Membre ✓"
  if (alreadyMember) {
    return (
      <div
        className={`font-bold text-white text-sm flex items-center justify-center gap-2 ${variant === "sidebar" ? "w-full py-2.5 rounded-xl" : "inline-flex px-5 py-2.5 rounded-xl"}`}
        style={{ background: "#22c55e" }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Vous êtes membre de ce GTT
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`font-bold text-white text-sm transition-all hover:-translate-y-0.5 ${variant === "sidebar" ? "block w-full text-center py-2.5 rounded-xl" : "inline-block px-5 py-2.5 rounded-xl"}`}
        style={{ background: gttColor }}
      >
        {label}
      </button>

      {/* Modale de connexion requise */}
      {showAuthGate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuthGate(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${gttColor}15`, border: `2px solid ${gttColor}` }}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke={gttColor} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Connexion requise</h3>
              <p className="text-sm text-gray-500 mb-1">
                Vous devez être <strong>membre SOBUP connecté</strong> pour rejoindre le <strong>{gttName}</strong>.
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Connectez-vous à votre espace membre pour accéder à cette fonctionnalité.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAuthGate(false)}
                  className="flex-1 px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                  Annuler
                </button>
                <button
                  onClick={handleGoToLogin}
                  className="flex-1 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: gttColor }}>
                  Se connecter →
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Pas encore membre SOBUP ?{" "}
                <a href="/adhesion" className="font-bold hover:underline" style={{ color: gttColor }}>
                  Adhérer →
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modale formulaire (uniquement si connecté) */}
      {open && user && (
        <GTTJoinModal
          gttName={gttName}
          gttColor={gttColor}
          user={user}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
