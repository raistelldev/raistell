"use client";

import { useAudience } from "@/components/AudienceContext";
import { companyFunnel, creatorFunnel, ctas } from "@/config/site";

export function Hero() {
  const { audience, setAudience } = useAudience();
  const isCompany = audience === "firma";
  const content = isCompany ? companyFunnel.hero : creatorFunnel.hero;
  const cta = isCompany ? ctas.company : ctas.creator;
  return (
    <section id="start" className="scroll-mt-16 overflow-hidden bg-dark text-on-dark">
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-8">
        <div role="group" aria-label="Ansicht auswählen" className="flex w-fit rounded-full border border-on-dark/20 bg-dark-strong/40 p-1">
          {(["firma", "creator"] as const).map((role) => (
            <button key={role} type="button" aria-pressed={audience === role} onClick={() => setAudience(role)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${audience === role ? "bg-on-dark text-brand-strong" : "text-on-dark/75 hover:text-on-dark"}`}>
              {role === "firma" ? "Für Unternehmen" : "Für Creator"}
            </button>
          ))}
        </div>
        <div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="max-w-lg text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-on-dark/65">{content.eyebrow}</p>
            <h1 className="mt-5 max-w-2xl font-brand text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">{content.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-on-dark/80 sm:text-lg">{content.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#kontakt" className="inline-flex items-center justify-center gap-4 rounded-theme bg-on-dark px-6 py-3.5 text-sm font-semibold text-brand-strong transition-colors hover:bg-brand-soft">{cta.label}<span aria-hidden="true">↗</span></a>
              <a href={isCompany ? "#pilot" : "#loesung"} className="rounded-theme px-4 py-3 text-center text-sm font-medium text-on-dark/80 underline decoration-on-dark/30 underline-offset-4 hover:text-on-dark">{isCompany ? "Pilotangebot ansehen" : "Mehr erfahren"}</a>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-on-dark/60">{isCompany ? "Erstgespräch kostenlos und unverbindlich. Umsetzung nach individuellem Angebot." : "Kostenlose Bewerbung. Du entscheidest bei jedem Projekt selbst."}</p>
          </div>
          {isCompany ? <ProjectStoryboard /> : (
            <div className="rounded-2xl border border-on-dark/15 bg-dark-strong/40 p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-dark/55">Zwei Wege zur Zusammenarbeit</p>
              <div className="mt-7 border-b border-on-dark/15 pb-7">
                <span className="text-sm text-on-dark/55">01</span>
                <h2 className="mt-2 text-2xl font-semibold">Dein Können vor der Kamera.</h2>
                <p className="mt-3 text-sm leading-relaxed text-on-dark/70">Produziere Inhalte für Unternehmen. Hier zählt die Qualität deiner Arbeit – auch ohne große Community.</p>
              </div>
              <div className="pt-7">
                <span className="text-sm text-on-dark/55">02</span>
                <h2 className="mt-2 text-2xl font-semibold">Dein Thema. Dein Publikum.</h2>
                <p className="mt-3 text-sm leading-relaxed text-on-dark/70">Veröffentliche passende Kooperationen auf deinem Kanal. Inhalt, Honorar und Rechte werden vorab vereinbart.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProjectStoryboard() {
  return (
    <div className="rounded-2xl border border-on-dark/20 bg-dark-strong/50 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-widest text-on-dark/55"><span>Aus einem Projekt wird Content</span><span aria-hidden="true">01 / 04</span></div>
      <div className="relative mt-5 overflow-hidden rounded-xl bg-surface-alt p-6 text-ink sm:p-7">
        <p className="relative z-10 text-[10px] font-semibold uppercase tracking-widest text-brand">Beispielkonzept · keine Kundenreferenz</p>
        <div className="my-6 flex items-center gap-5" aria-hidden="true">
          <div className="grid -skew-y-6 grid-cols-3 gap-1 rounded-md bg-ink p-2 shadow-lg">{Array.from({ length: 9 }, (_, i) => <span key={i} className="h-6 w-9 rounded-sm border border-on-dark/20 bg-on-dark/10 sm:h-7 sm:w-11" />)}</div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/25 text-brand"><svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="m8 5 11 7-11 7Z" /></svg></span>
        </div>
        <p className="text-xs font-medium text-brand">Das Hauptvideo</p>
        <p className="mt-2 max-w-xs text-xl font-semibold leading-snug sm:text-2xl">Was passiert am Tag der PV-Installation?</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">{["Vorbereitung", "Einblicke", "Übergabe"].map((label, i) => <div key={label} className="rounded-lg border border-on-dark/15 px-2.5 py-3 sm:px-3"><span className="text-[10px] uppercase tracking-wide text-on-dark/45">Ausschnitt 0{i + 1}</span><p className="mt-1.5 text-xs font-medium text-on-dark/90">{label}</p></div>)}</div>
      <p className="mt-5 text-xs leading-relaxed text-on-dark/60">Ein Hauptvideo + drei Kurzvideos. Gemeinsam auf Ihren geplanten Einsatz abgestimmt.</p>
    </div>
  );
}
