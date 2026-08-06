"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Audience } from "@/config/site";

type AudienceContextValue = {
  audience: Audience;
  setAudience: (next: Audience) => void;
};

const AudienceContext = createContext<AudienceContextValue | null>(null);

function audienceFromUrl(): Audience {
  if (typeof window === "undefined") return "firma";
  const value = new URLSearchParams(window.location.search).get("role");
  return value === "creator" ? "creator" : "firma";
}

function writeAudienceToUrl(next: Audience) {
  const url = new URL(window.location.href);
  url.searchParams.set("role", next);
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new CustomEvent("raistell:audience", { detail: next }));
}

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>("firma");

  useEffect(() => {
    setAudienceState(audienceFromUrl());
    const sync = () => setAudienceState(audienceFromUrl());
    const onCustom = (e: Event) => {
      const next = (e as CustomEvent<Audience>).detail;
      if (next === "firma" || next === "creator") setAudienceState(next);
    };
    window.addEventListener("popstate", sync);
    window.addEventListener("raistell:audience", onCustom);
    window.addEventListener("raistell:contact-role", onCustom);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("raistell:audience", onCustom);
      window.removeEventListener("raistell:contact-role", onCustom);
    };
  }, []);

  const setAudience = useCallback((next: Audience) => {
    setAudienceState(next);
    writeAudienceToUrl(next);
  }, []);

  const value = useMemo(
    () => ({ audience, setAudience }),
    [audience, setAudience],
  );

  return (
    <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>
  );
}

export function useAudience() {
  const ctx = useContext(AudienceContext);
  if (!ctx) {
    throw new Error("useAudience must be used within AudienceProvider");
  }
  return ctx;
}
