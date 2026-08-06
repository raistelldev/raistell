"use client";

import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { useAudience } from "@/components/AudienceContext";
import { ctas, navByAudience } from "@/config/site";

export function Header() {
  const { audience, setAudience } = useAudience();
  const navItems = navByAudience[audience];
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#start");
  const primaryCta = audience === "firma" ? ctas.company : ctas.creator;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setActiveHref("#start");
    const ids = navItems.map((item) => item.href.replace("#", ""));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveHref(`#${visible[0].target.id}`);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [navItems]);

  function navClass(href: string, mobile = false) {
    const active = activeHref === href;
    if (mobile) {
      return active
        ? "block rounded-theme px-3 py-3 text-base font-semibold text-brand"
        : "block rounded-theme px-3 py-3 text-base font-medium text-ink/75 hover:text-ink";
    }
    return active
      ? "rounded-full px-3 py-2 text-sm font-semibold text-brand"
      : "rounded-full px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-ink";
  }

  function goToForm(e: React.MouseEvent) {
    e.preventDefault();
    setAudience(audience);
    setOpen(false);
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  }

  const ctaLabel =
    audience === "firma" ? ctas.company.shortLabel : ctas.creator.label;

  return (
    <header className="header-facet sticky top-0 z-50 border-b border-line">
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="relative flex h-16 items-center justify-center md:hidden">
          <Logo variant="stacked" className="text-ink" />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            className="absolute right-0 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface/50"
          >
            {open ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <BurgerIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="hidden h-16 items-center justify-between md:flex">
          <Logo variant="inline" className="text-ink" />
          <nav aria-label="Hauptnavigation">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={activeHref === item.href ? "true" : undefined}
                    className={navClass(item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={primaryCta.href}
                  onClick={goToForm}
                  className="ml-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong"
                >
                  {ctaLabel}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Hauptnavigation mobil"
          className="header-facet relative border-t border-line md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-0.5 px-4 py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={activeHref === item.href ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className={navClass(item.href, true)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-1">
              <a
                href={primaryCta.href}
                onClick={goToForm}
                className="block rounded-full bg-brand px-4 py-3 text-center text-base font-semibold text-on-brand hover:bg-brand-strong"
              >
                {primaryCta.label}
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
