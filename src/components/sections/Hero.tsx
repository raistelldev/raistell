"use client";

import { ProjectFilm } from "@/components/project-film/ProjectFilm";
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
        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="max-w-lg text-xs font-semibold uppercase leading-relaxed tracking-[0.16em] text-on-dark/65">{content.eyebrow}</p>
            <h1 className="mt-5 max-w-2xl break-words hyphens-auto font-brand text-[2.125rem] font-semibold leading-[1.08] tracking-tight min-[380px]:hyphens-manual min-[380px]:text-[2.5rem] sm:text-5xl lg:text-[3.5rem]">{content.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-on-dark/80 sm:text-lg">{content.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={cta.href} className="inline-flex items-center justify-center gap-4 rounded-theme bg-on-dark px-6 py-3.5 text-sm font-semibold text-brand-strong transition-colors hover:bg-brand-soft">{cta.label}<span aria-hidden="true">↗</span></a>
              <a href={isCompany ? "#pilot" : "#loesung"} className="rounded-theme px-4 py-3 text-center text-sm font-medium text-on-dark/80 underline decoration-on-dark/30 underline-offset-4 hover:text-on-dark">{isCompany ? "Pilotangebot ansehen" : "Mehr erfahren"}</a>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-on-dark/60">{isCompany ? "Erstgespräch kostenlos und unverbindlich. Umsetzung nach individuellem Angebot." : "Kostenlose Bewerbung. Du entscheidest bei jedem Projekt selbst."}</p>
          </div>
          {isCompany ? <div className="mx-auto w-full max-w-xl min-w-0 lg:max-w-none"><ProjectFilm /></div> : (
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

