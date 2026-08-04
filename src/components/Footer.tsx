import { Logo } from "./Logo";
import { navItems, site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-alt">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Logo variant="inline" />
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              Vermittlung zwischen Influencern und Unternehmen der erneuerbaren
              Energien – für den deutschen Markt.
            </p>
          </div>

          <nav aria-label="Footer-Navigation">
            <p className="text-sm font-semibold text-ink">Navigation</p>
            <ul className="mt-3 space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-ink-soft hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-sm font-semibold text-ink">Rechtliches</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="/impressum" className="text-sm text-ink-soft hover:text-ink">
                  Impressum
                </a>
              </li>
              <li>
                <a href="/datenschutz" className="text-sm text-ink-soft hover:text-ink">
                  Datenschutzerklärung
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.
          </p>
          <p>Prototyp / MVP – Inhalte sind Platzhalter.</p>
        </div>
      </div>
    </footer>
  );
}
