"use client";

import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { navItems } from "@/config/site";

export function Header() {
  const [open, setOpen] = useState(false);

  // Menü bei Wechsel auf Desktop-Breite schließen
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-page/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        {/* ---------- MOBILE (< md): Name mittig, Burger rechts ---------- */}
        <div className="relative flex h-16 items-center justify-center md:hidden">
          <Logo variant="stacked" />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            className="absolute right-0 inline-flex h-11 w-11 items-center justify-center rounded-theme text-ink hover:bg-surface-alt"
          >
            {open ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <BurgerIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* ---------- DESKTOP (>= md): Logo links, Nav rechts ---------- */}
        <div className="hidden h-16 items-center justify-between md:flex">
          <Logo variant="inline" />
          <nav aria-label="Hauptnavigation">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-theme px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-alt hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#kontakt"
                  className="ml-2 rounded-theme bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong"
                >
                  Beratung anfragen
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* ---------- MOBILE Ausklapp-Navigation ---------- */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Hauptnavigation mobil"
          className="border-t border-line bg-page md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-theme px-3 py-3 text-base font-medium text-ink hover:bg-surface-alt"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="px-1 py-2">
              <a
                href="#kontakt"
                onClick={() => setOpen(false)}
                className="block rounded-theme bg-brand px-4 py-3 text-center text-base font-semibold text-on-brand hover:bg-brand-strong"
              >
                Beratung anfragen
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function BurgerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
