"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ctas, site } from "@/config/site";

type Role = "creator" | "firma";

const CALENDLY_HEIGHT = 750;
const READY_FALLBACK_MS = 8_000;

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

function buildCalendlyEmbedUrl(
  baseUrl: string,
  prefill: { name?: string; email?: string },
) {
  const url = new URL(baseUrl);
  url.searchParams.set("embed_type", "Inline");
  url.searchParams.set("hide_gdpr_banner", "1");
  if (typeof window !== "undefined") {
    url.searchParams.set("embed_domain", window.location.hostname);
  }
  if (prefill.name) url.searchParams.set("name", prefill.name);
  if (prefill.email) url.searchParams.set("email", prefill.email);
  return url.toString();
}

function isCalendlyReadyMessage(data: unknown) {
  if (!data || typeof data !== "object") return false;
  const event = (data as { event?: unknown }).event;
  if (typeof event !== "string" || !event.startsWith("calendly.")) return false;
  return (
    event === "calendly.event_type_viewed" ||
    event === "calendly.profile_page_viewed" ||
    event === "calendly.page_height" ||
    event === "calendly.date_and_time_selected" ||
    event === "calendly.event_scheduled"
  );
}

export function ThankYouContent() {
  const params = useSearchParams();
  const roleParam = params.get("role");
  const role: Role = roleParam === "creator" ? "creator" : "firma";
  const text = copy[role];
  const name = params.get("name")?.trim() ?? "";
  const email = params.get("email")?.trim() ?? "";
  const calendlyUrl =
    (role === "creator"
      ? process.env.NEXT_PUBLIC_CALENDLY_URL_CREATOR
      : process.env.NEXT_PUBLIC_CALENDLY_URL_FIRMA
    )?.trim() ?? "";

  const [visible, setVisible] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");
  const [calendarReady, setCalendarReady] = useState(false);

  const openUrl = useMemo(() => {
    if (!calendlyUrl) return "";
    try {
      const url = new URL(calendlyUrl);
      if (name) url.searchParams.set("name", name);
      if (email) url.searchParams.set("email", email);
      return url.toString();
    } catch {
      return calendlyUrl;
    }
  }, [calendlyUrl, name, email]);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!calendlyUrl) {
      setIframeSrc("");
      return;
    }
    try {
      setCalendarReady(false);
      setIframeSrc(
        buildCalendlyEmbedUrl(calendlyUrl, {
          ...(name ? { name } : {}),
          ...(email ? { email } : {}),
        }),
      );
    } catch {
      setIframeSrc("");
    }
  }, [calendlyUrl, name, email]);

  useEffect(() => {
    if (!iframeSrc || calendarReady) return;

    function onMessage(e: MessageEvent) {
      if (
        typeof e.origin === "string" &&
        !e.origin.includes("calendly.com")
      ) {
        return;
      }
      if (isCalendlyReadyMessage(e.data)) setCalendarReady(true);
    }

    window.addEventListener("message", onMessage);
    const fallback = window.setTimeout(
      () => setCalendarReady(true),
      READY_FALLBACK_MS,
    );

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(fallback);
    };
  }, [iframeSrc, calendarReady]);

  return (
    <main className="relative flex flex-1 flex-col bg-dark">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 20%, rgba(19,122,114,0.28) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(225,239,236,0.08) 0%, transparent 50%)",
        }}
      />

      <div
        className={`relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-16 text-center transition-all duration-700 ease-out sm:py-20 ${
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

        {iframeSrc ? (
          <div className="mt-12 w-full text-left">
            <p className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-brand">
              {text.calendlyHint}
            </p>

            <div
              className="relative overflow-hidden rounded-theme border border-line/30 bg-surface"
              style={{ minHeight: CALENDLY_HEIGHT }}
            >
              {/* Buffer sits on top; iframe always loads underneath (must stay visible to Calendly) */}
              {!calendarReady && (
                <div
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-surface px-6"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div className="relative h-11 w-11" aria-hidden>
                    <span className="absolute inset-0 rounded-full border-2 border-brand/20" />
                    <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink">
                      Kalender wird geladen …
                    </p>
                    <p className="mt-1.5 text-xs text-ink-soft">
                      Terminauswahl erscheint gleich hier
                    </p>
                  </div>
                  <div className="w-full max-w-sm space-y-3 px-4" aria-hidden>
                    <div className="h-10 animate-pulse rounded-theme bg-brand-soft/70" />
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square animate-pulse rounded-md bg-brand-soft/50"
                          style={{ animationDelay: `${(i % 7) * 80}ms` }}
                        />
                      ))}
                    </div>
                    <div className="h-3 w-[66%] animate-pulse rounded-full bg-brand-soft/40" />
                  </div>
                </div>
              )}

              <iframe
                title="Calendly Terminbuchung"
                src={iframeSrc}
                className="block w-full border-0"
                style={{ minWidth: "320px", height: CALENDLY_HEIGHT }}
                onLoad={() => {
                  // Paint delay; postMessage may already have cleared the buffer
                  window.setTimeout(() => setCalendarReady(true), 1200);
                }}
              />
            </div>

            <p className="mt-3 text-center text-xs text-on-dark/60">
              Kalender leer?{" "}
              <a
                href={openUrl || calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline hover:text-brand-soft"
              >
                Termin in neuem Tab öffnen
              </a>
            </p>
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
