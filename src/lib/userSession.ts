/**
 * Helpers pour gérer la session utilisateur SOBUP côté client.
 * Stockage : localStorage.
 */

"use client";

import { useCallback, useEffect, useState } from "react";

export interface GTTMembership {
  name: string;
  color?: string;
  joinedAt: string;       // ISO date
  motivation?: string;
  fonction?: string;
  lieuExercice?: string;
}

export interface SessionUser {
  email: string;
  name: string;
  avatar: string;
  role: string;
  specialite?: string;
  etablissement?: string;
  ville?: string;
  joinedAt: string;
  isBureau?: boolean;
  gttMemberships?: GTTMembership[];
}

const KEY = "sobup_user";
const CHANGE_EVENT = "sobup_user_changed";

/* ─────────────────────────────────────────────
   LECTURE / ÉCRITURE BRUTE
───────────────────────────────────────────── */

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch (err) {
    console.error("[sobup] getSessionUser parse error", err);
    return null;
  }
}

export function setSessionUser(user: SessionUser): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(user));
    // Notifier tous les listeners (même onglet)
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: user }));
  } catch (err) {
    console.error("[sobup] setSessionUser error", err);
  }
}

export function clearSessionUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: null }));
}

/* ─────────────────────────────────────────────
   OPÉRATIONS GTT
───────────────────────────────────────────── */

export function isInGTT(gttName: string): boolean {
  const user = getSessionUser();
  if (!user || !user.gttMemberships) return false;
  return user.gttMemberships.some(
    (m) => m.name.toLowerCase() === gttName.toLowerCase()
  );
}

export function addGTTMembership(membership: GTTMembership): SessionUser | null {
  const user = getSessionUser();
  if (!user) {
    console.warn("[sobup] addGTTMembership: aucun utilisateur connecté");
    return null;
  }

  const existing = user.gttMemberships ?? [];
  if (existing.some((m) => m.name.toLowerCase() === membership.name.toLowerCase())) {
    return user; // déjà membre
  }

  const updated: SessionUser = {
    ...user,
    gttMemberships: [...existing, membership],
  };
  setSessionUser(updated);
  return updated;
}

export function removeGTTMembership(gttName: string): SessionUser | null {
  const user = getSessionUser();
  if (!user) return null;
  const updated: SessionUser = {
    ...user,
    gttMemberships: (user.gttMemberships ?? []).filter(
      (m) => m.name.toLowerCase() !== gttName.toLowerCase()
    ),
  };
  setSessionUser(updated);
  return updated;
}

/* ─────────────────────────────────────────────
   HOOK RÉACTIF
   Approche simple et robuste — pas de useSyncExternalStore
   pour éviter les soucis SSR / cache croisé entre pages.
───────────────────────────────────────────── */

export function useSessionUser(): SessionUser | null {
  const [user, setUser] = useState<SessionUser | null>(null);

  const refresh = useCallback(() => {
    setUser(getSessionUser());
  }, []);

  useEffect(() => {
    // Lecture initiale après hydration
    refresh();

    // Écoute des changements (même onglet)
    const onCustom = () => refresh();
    // Écoute des changements (autres onglets)
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY || e.key === null) refresh();
    };

    window.addEventListener(CHANGE_EVENT, onCustom);
    window.addEventListener("storage", onStorage);

    // Aussi : re-fetch quand on revient sur l'onglet (au cas où)
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener(CHANGE_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refresh]);

  return user;
}
