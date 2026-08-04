"use client";

import { useEffect, useState } from "react";

const LABEL = "Jetzt starten";

/**
 * Vollbild-Intro: Lava-Lamp-Rauch hinter dem Button.
 * Der Button baut sich aus Einzelteilen zusammen (rund / Tailwind-Pill).
 */
export function IntroSplash({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [assembled, setAssembled] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setAssembled(true), reduce ? 0 : 2300);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, []);

  function handleEnter() {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onEnter, 550);
  }

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-dark-strong transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Willkommen"
    >
      {/* Rauchiger Lava-Lamp-Hintergrund hinter dem Button */}
      <div className="intro-stage-lava pointer-events-none absolute inset-0" aria-hidden>
        <span className="intro-smoke intro-smoke-a" />
        <span className="intro-smoke intro-smoke-b" />
        <span className="intro-smoke intro-smoke-c" />
        <span className="intro-smoke intro-smoke-d" />
        <span className="intro-smoke intro-smoke-e" />
        <span className="intro-smoke-veil" />
      </div>

      <div className="intro-assemble relative">
        <span className="intro-impact" aria-hidden />

        <button
          type="button"
          onClick={handleEnter}
          disabled={!assembled || leaving}
          className={`intro-btn relative isolate h-14 w-[min(20rem,88vw)] rounded-full border-0 bg-transparent p-0 transition hover:-translate-y-0.5 hover:drop-shadow-[0_12px_28px_rgba(19,122,114,0.35)] disabled:hover:translate-y-0 disabled:hover:drop-shadow-none sm:h-16 sm:w-[22rem] ${
            assembled ? "intro-btn-ready cursor-pointer" : "cursor-default"
          }`}
          aria-label="Jetzt starten – zur Hauptseite"
        >
          <span className="intro-part intro-corner intro-corner-tl" aria-hidden />
          <span className="intro-part intro-corner intro-corner-tr" aria-hidden />
          <span className="intro-part intro-corner intro-corner-bl" aria-hidden />
          <span className="intro-part intro-corner intro-corner-br" aria-hidden />

          <span className="intro-part intro-edge intro-edge-t" aria-hidden />
          <span className="intro-part intro-edge intro-edge-b" aria-hidden />
          <span className="intro-part intro-edge intro-edge-l" aria-hidden />
          <span className="intro-part intro-edge intro-edge-r" aria-hidden />

          <span className="intro-part intro-fill absolute inset-0 rounded-full bg-dark shadow-lg shadow-dark-strong/40" aria-hidden />

          <span className="intro-label absolute inset-0 z-10 flex items-center justify-center font-brand text-lg font-semibold tracking-wide text-on-dark sm:text-xl">
            {LABEL.split("").map((char, i) => (
              <span
                key={`${char}-${i}`}
                className="intro-part intro-glyph inline-block"
                style={{ animationDelay: `${1.15 + i * 0.055}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </button>
      </div>
    </div>
  );
}
