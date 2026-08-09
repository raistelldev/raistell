"use client";

import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { useAudience } from "@/components/AudienceContext";
import { navByAudience, site } from "@/config/site";

export function Footer() {
  const pathname = usePathname();
  const { audience } = useAudience();
  const navItems = navByAudience[audience];

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-dark">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Logo variant="inline" className="text-on-dark" />
            <p className="mt-4 max-w-xs text-sm text-on-dark/75">
              Creator-Kooperationen für Unternehmen der Energiewende –
              Photovoltaik, Wärmepumpe und Smart Energy.
            </p>
          </div>

          <nav aria-label="Footer-Navigation">
            <p className="text-sm font-semibold text-on-dark">Navigation</p>
            <ul className="mt-3 space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-on-dark/75 hover:text-on-dark"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-on-dark">Rechtliches</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="/impressum"
                  className="text-sm text-on-dark/75 hover:text-on-dark"
                >
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href="/datenschutz"
                  className="text-sm text-on-dark/75 hover:text-on-dark"
                >
                  Datenschutzerklärung
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-on-dark/15 pt-6 text-xs text-on-dark/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.
          </p>
          <p>Prototyp / MVP – Inhalte sind Platzhalter.</p>
        </div>
      </div>
    </footer>
  );
}
