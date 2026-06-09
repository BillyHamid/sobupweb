"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const hide = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 500);
    };

    if (document.readyState === "complete") {
      const t = setTimeout(hide, 400);
      return () => clearTimeout(t);
    }

    window.addEventListener("load", hide);
    const fallback = setTimeout(hide, 3000);
    return () => {
      window.removeEventListener("load", hide);
      clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity .5s ease",
      }}
    >
      <div className="sobup-loader">
        <Image
          src="/logo.png"
          alt="SOBUP"
          width={120}
          height={120}
          priority
          className="sobup-loader-logo"
        />
        <div className="sobup-loader-ring" />
      </div>

      <style>{`
        .sobup-loader {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sobup-loader-logo {
          animation: sobup-pulse 1.6s ease-in-out infinite;
        }
        .sobup-loader-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 3px solid var(--primary-light);
          border-top-color: var(--primary);
          animation: sobup-spin 1s linear infinite;
        }
        @keyframes sobup-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(.92); opacity: .75; }
        }
        @keyframes sobup-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
