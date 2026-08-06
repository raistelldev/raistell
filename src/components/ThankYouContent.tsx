"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ctas, site } from "@/config/site";

type Role = "creator" | "firma";

const copy: Record<
  Role,
  { title: string; body: string; next: string }
> = {
  firma: {
    title: "Danke – wir melden uns bei Ihnen.",
    body: "Ihre Anfrage ist bei uns angekommen. Wir prüfen kurz, was passt, und melden uns persönlich für Ihr kostenloses Erstgespräch.",
    next: "In der Zwischenzeit können Sie gerne noch einmal unseren Ablauf ansehen.",
  },
  creator: {
    title: "Schön, dass du dabei sein willst.",
    body: "Deine Anfrage ist angekommen. Wir schauen uns dein Profil in Ruhe an und melden uns, wenn es passt – ohne Massenmails, ohne Druck.",
    next: "Bis dahin: einfach weiter machen, was deinen Content ausmacht.",
  },
};

export function ThankYouContent() {
  const params = useSearchParams();
  const roleParam = params.get("role");
  const role: Role = roleParam === "creator" ? "creator" : "firma";
  const text = copy[role];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-dark">
      {/* Ruhiger Glow – Markenfarben, keine Purple-AI-Optik */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 20%, rgba(19,122,114,0.28) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(225,239,236,0.08) 0%, transparent 50%)",
        }}
      />

      <div
        className={`relative mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center transition-all duration-700 ease-out sm:py-28 ${
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
