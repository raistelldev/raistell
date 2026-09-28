"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { site } from "@/config/site";

export function ThankYouContent() {
  const params = useSearchParams();
  const role = params.get("role") === "creator" ? "creator" : "firma";
  const isCompany = role === "firma";

  return (
    <main className="flex-1 bg-dark text-on-dark">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
        <span aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-on-dark/25 text-2xl">✓</span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-widest text-on-dark/60">{isCompany ? "Projektanfrage" : "Creator-Bewerbung"}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{isCompany ? "Vielen Dank für Ihre Anfrage." : "Danke für deine Bewerbung."}</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-on-dark/80">{isCompany ? "Wir prüfen Ihre Angaben und melden uns unter der angegebenen E-Mail-Adresse, um die nächsten Schritte zu besprechen." : "Wir schauen uns dein Profil an und melden uns, wenn ein passendes Projekt ansteht. Eine Bewerbung ist noch keine Auftragszusage."}</p>
        <p className="mt-8 text-sm text-on-dark/70">{isCompany ? "Sie erreichen uns auch unter" : "Du erreichst uns auch unter"} <a href={`mailto:${site.contact.email}`} className="text-on-dark underline underline-offset-4">{site.contact.email}</a>.</p>
        <Link href={`/?role=${role}`} className="mt-8 inline-block rounded-theme border border-on-dark/30 px-6 py-3 text-sm font-semibold hover:bg-on-dark/10">Zur Startseite</Link>
      </div>
    </main>
  );
}
