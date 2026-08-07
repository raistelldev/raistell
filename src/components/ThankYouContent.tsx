"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ctas, site } from "@/config/site";

type Role = "creator" | "firma";

const copy: Record<
  Role,
  { title: string; body: string; next: string; calendlyHint: string }
> = {
  firma: {
    title: "Danke – wir melden uns bei Ihnen.",
    body: "Ihre Anfrage ist bei uns angekommen. Wählen Sie jetzt einen Termin für Ihr kostenloses Erstgespräch.",
    next: "Nach der Buchung erhalten Sie eine Bestätigung inkl. Google-Meet-Link.",
    calendlyHint: "Termin für Ihr Erstgespräch wählen",
  },
  creator: {
    title: "Schön, dass du dabei sein willst.",
    body: "Deine Anfrage ist angekommen. Wähle jetzt einen Termin, damit wir dich kennenlernen können.",
    next: "Nach der Buchung erhältst du eine Bestätigung inkl. Google-Meet-Link.",
    calendlyHint: "Termin zum Kennenlernen wählen",
  },
};

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string };
      }) => void;
    };
  }
}

export function ThankYouContent() {
  const params = useSearchParams();
  const roleParam = params.get("role");
  const role: Role = roleParam === "creator" ? "creator" : "firma";
  const text = copy[role];
  const name = params.get("name")?.trim() ?? "";
  const email = params.get("email")?.trim() ?? "";
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ?? "";
  const [visible, setVisible] = useState(false);

  const widgetUrl = useMemo(() => {
    if (!calendlyUrl) return "";
    const url = new URL(calendlyUrl);
    url.searchParams.set("hide_gdpr_banner", "1");
    return url.toString();
  }, [calendlyUrl]);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!widgetUrl) return;

    const parent = document.getElementById("calendly-embed");
    if (!parent) return;

    parent.innerHTML = "";

    function mount() {
      if (!parent || !window.Calendly) return;
      window.Calendly.initInlineWidget({
        url: widgetUrl,
        parentElement: parent,
        prefill: {
          ...(name ? { name } : {}),
          ...(email ? { email } : {}),
        },
      });
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-calendly="true"]',
    );

    if (window.Calendly) {
      mount();
      return;
    }

    const script =
      existing ??
      Object.assign(document.createElement("script"), {
        src: "https://assets.calendly.com/assets/external/widget.js",
        async: true,
      });
    script.dataset.calendly = "true";
    script.onload = mount;

    if (!existing) {
      document.body.appendChild(script);
    }

    return () => {
      script.onload = null;
    };
  }, [widgetUrl, name, email]);

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-dark">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 20%, rgba(19,122,114,0.28) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(225,239,236,0.08) 0%, transparent 50%)",
        }}
      />

      <div
        className={`relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-20 text-center transition-all duration-700 ease-out sm:py-28 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div
          className={`mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-brand/40 bg-brand/15 transition-transform duration-700 delay-150 ${
            visible ? "scale-100" : "scale-75"
          }`}
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-brand"
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="text-sm font-semibold uppercase tracking-widest text-on-dark/70">
          {site.name}
        </p>
        <h1 className="mt-4 font-brand text-3xl font-semibold tracking-tight text-on-dark sm:text-4xl md:text-5xl">
          {text.title}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-on-dark/85">
          {text.body}
        </p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-on-dark/65">
          {text.next}
        </p>

        {widgetUrl ? (
          <div className="mt-12 w-full text-left">
            <p className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-brand">
              {text.calendlyHint}
            </p>
            <div
              id="calendly-embed"
              className="min-h-[700px] w-full overflow-hidden rounded-theme border border-line/30 bg-surface"
            />
          </div>
        ) : (
          <p className="mt-10 max-w-md text-sm text-on-dark/65">
            Terminbuchung ist noch nicht konfiguriert. Bitte schreiben Sie an{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-brand underline hover:text-brand-soft"
            >
              {site.contact.email}
            </a>
            .
          </p>
        )}

        <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/"
            className="rounded-theme bg-on-dark px-6 py-3 text-center text-sm font-semibold text-brand-strong transition-colors hover:bg-brand-soft"
          >
            Zur Startseite
          </Link>
          {role === "firma" ? (
            <Link
              href="/#ablauf"
              className="rounded-theme border-2 border-brand px-6 py-3 text-center text-sm font-semibold text-on-dark transition-colors hover:bg-brand hover:text-on-brand"
            >
              Ablauf ansehen
            </Link>
          ) : (
            <a
              href={`mailto:${site.contact.email}`}
              className="rounded-theme border-2 border-brand px-6 py-3 text-center text-sm font-semibold text-on-dark transition-colors hover:bg-brand hover:text-on-brand"
            >
              {site.contact.email}
            </a>
          )}
        </div>

        <p className="mt-12 text-xs text-on-dark/50">
          {role === "firma"
            ? ctas.company.label
            : ctas.creator.finalLabel}{" "}
          · Anfrage erhalten
        </p>
      </div>
    </main>
  );
}
