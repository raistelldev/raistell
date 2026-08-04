"use client";

import { useEffect, useState } from "react";

/*
  Cookie-Hinweis (DSGVO-Platzhalter).
  Speichert die Auswahl lokal, damit der Hinweis nicht erneut erscheint.
  Für den Produktivbetrieb durch ein geprüftes Consent-Tool ersetzen.
*/
const STORAGE_KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function decide(value: "accepted" | "declined") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-Hinweis"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-theme border border-line bg-surface p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
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
