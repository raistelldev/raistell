"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { site } from "@/config/site";

function safeCalendlyUrl(raw: string | undefined): string {
  try {
    const url = new URL(raw?.trim() || "");
    return url.protocol === "https:" && (url.hostname === "calendly.com" || url.hostname.endsWith(".calendly.com")) && !url.username && !url.password ? url.toString() : "";
  } catch { return ""; }
}

export function ThankYouContent() {
  const params = useSearchParams();
  const role = params.get("role") === "creator" ? "creator" : "firma";
  const isCompany = role === "firma";
  const calendlyUrl = safeCalendlyUrl(isCompany ? process.env.NEXT_PUBLIC_CALENDLY_URL_FIRMA : process.env.NEXT_PUBLIC_CALENDLY_URL_CREATOR);
  const [iframeSrc, setIframeSrc] = useState("");

  function loadCalendar() {
    const url = new URL(calendlyUrl);
    url.searchParams.set("embed_type", "Inline");
    url.searchParams.set("embed_domain", window.location.hostname);
    try {
      const raw = sessionStorage.getItem("raistell:booking-prefill");
      const saved = raw ? JSON.parse(raw) : null;
      if (saved?.role === role && typeof saved.name === "string" && typeof saved.email === "string") {
        url.searchParams.set("name", saved.name);
        url.searchParams.set("email", saved.email);
      }
      sessionStorage.removeItem("raistell:booking-prefill");
    } catch { /* Calendly also works without prefilling personal details. */ }
    setIframeSrc(url.toString());
  }

  return (
    <main className="flex-1 bg-dark text-on-dark">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
        <span aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-on-dark/25 text-2xl">✓</span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-on-dark/60">{isCompany ? "Projektanfrage" : "Creator-Bewerbung"}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{isCompany ? "Vielen Dank für Ihre Anfrage." : "Danke für deine Bewerbung."}</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-on-dark/80">{isCompany ? "Wir prüfen Ihre Angaben und melden uns unter der angegebenen E-Mail-Adresse, um die nächsten Schritte zu besprechen." : "Wir schauen uns dein Profil an und melden uns, wenn ein passendes Projekt ansteht. Eine Bewerbung ist noch keine Auftragszusage."}</p>
        {calendlyUrl && <div className="mt-10 rounded-xl border border-on-dark/20 p-5 sm:p-7">
          <h2 className="text-xl font-semibold">{isCompany ? "Optional: Wählen Sie schon einen Gesprächstermin." : "Optional: Wähle einen Termin zum Kennenlernen."}</h2>
          {!iframeSrc ? <>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-on-dark/70">Mit dem Laden des Kalenders wird eine Verbindung zu Calendly hergestellt. Name und E-Mail-Adresse aus dieser Anfrage werden, soweit verfügbar, zur Vorausfüllung übertragen.</p>
            <button type="button" onClick={loadCalendar} className="mt-6 rounded-theme bg-on-dark px-6 py-3 text-sm font-semibold text-brand-strong hover:bg-brand-soft">Kalender laden und Termin wählen</button>
          </> : <iframe title="Calendly Terminbuchung" src={iframeSrc} className="mt-6 h-[750px] w-full rounded-theme border-0 bg-surface" />}
          <p className="mt-4 text-xs text-on-dark/60"><a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Calendly in einem neuen Tab öffnen</a></p>
        </div>}
        <p className="mt-8 text-sm text-on-dark/70">{isCompany ? "Sie erreichen uns auch unter" : "Du erreichst uns auch unter"} <a href={`mailto:${site.contact.email}`} className="text-on-dark underline underline-offset-4">{site.contact.email}</a>.</p>
        <Link href={`/?role=${role}`} className="mt-8 inline-block rounded-theme border border-on-dark/30 px-6 py-3 text-sm font-semibold hover:bg-on-dark/10">Zur Startseite</Link>
      </div>
    </main>
  );
}
