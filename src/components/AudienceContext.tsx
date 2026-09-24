"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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

function subscribeAudience(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener("raistell:audience", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("raistell:audience", onChange);
  };
}

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const audience = useSyncExternalStore(subscribeAudience, audienceFromUrl, () => "firma" as Audience);
  const setAudience = useCallback((next: Audience) => writeAudienceToUrl(next), []);

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
