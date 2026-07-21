"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "sobup_analytics_consent";

/**
 * Charge Google Analytics 4 uniquement si l'utilisateur a donné son consentement.
 * Écoute les changements de consentement (via l'événement personnalisé émis par ConsentBanner).
 */
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => setConsented(localStorage.getItem(CONSENT_KEY) === "accepted");
    check();
    const handler = () => check();
    window.addEventListener("sobup_consent_changed", handler);
    return () => window.removeEventListener("sobup_consent_changed", handler);
  }, []);

  if (!consented || !gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=Lax;Secure'
          });
        `}
      </Script>
    </>
  );
}
