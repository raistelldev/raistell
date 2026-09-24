"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

/* Speichert die Cookie-Auswahl lokal, damit der Hinweis nicht erneut erscheint. */
const STORAGE_KEY = "cookie-consent";

function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function hasNoChoice() {
  try { return !localStorage.getItem(STORAGE_KEY); }
  catch { return true; }
}

export function CookieBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const visible = useSyncExternalStore(subscribeStorage, hasNoChoice, () => false);

  function decide(value: "accepted" | "declined") {
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* Choice still applies for this visit. */ }
    setDismissed(true);
  }

  if (pathname?.startsWith("/admin") || !visible || dismissed) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Cookie-Hinweis"
      className="border-t border-line bg-page px-5 py-4"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">
          Wir verwenden nur technisch notwendige Cookies. Details finden Sie in
          der{" "}
          <a href="/datenschutz" className="text-brand underline hover:text-brand-strong">
            Datenschutzerklärung
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded-theme border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface-alt"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-theme bg-brand px-4 py-2 text-sm font-semibold text-on-brand hover:bg-brand-strong"
          >
            Akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
