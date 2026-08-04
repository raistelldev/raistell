"use client";

import { useEffect, useState } from "react";
import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";

type Role = "creator" | "firma";

function roleFromUrl(): Role | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("role");
  if (value === "firma" || value === "creator") return value;
  return null;
}

export function Contact() {
  const [role, setRole] = useState<Role>("creator");
  const [sent, setSent] = useState(false);

  // Rolle aus URL / CTA (Dienstleistungen) übernehmen
  useEffect(() => {
    const syncFromUrl = () => {
      const next = roleFromUrl();
      if (next) setRole(next);
    };
    const syncFromEvent = (event: Event) => {
      const next = (event as CustomEvent<Role>).detail;
      if (next === "firma" || next === "creator") setRole(next);
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("raistell:contact-role", syncFromEvent);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("raistell:contact-role", syncFromEvent);
    };
  }, []);

  return (
    <Section id="kontakt" tone="dark">
      <SectionHeading
        eyebrow="Kontakt"
        title="Lassen Sie uns sprechen"
        intro="Schreiben Sie uns oder buchen Sie direkt einen Termin. Sagen Sie uns zuerst, wer Sie sind – dann zeigen wir die passenden Felder."
        center
        onDark
      />

      {/* Umschalter Creator / Unternehmen */}
      <div className="mt-8 flex justify-center">
        <div
          role="tablist"
          aria-label="Ich bin"
          className="inline-flex rounded-full border border-line bg-surface p-1"
        >
          <ToggleButton active={role === "creator"} onClick={() => setRole("creator")}>
            Ich bin Creator
          </ToggleButton>
          <ToggleButton active={role === "firma"} onClick={() => setRole("firma")}>
            Ich bin Unternehmen
          </ToggleButton>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        {/* Formular */}
        <div className="rounded-theme border border-line bg-surface p-6 sm:p-8 lg:col-span-3">
          {sent ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-ink">Danke für Ihre Nachricht!</p>
              <p className="mt-2 text-sm text-ink-soft">
                (Mockup – es wird noch nichts versendet oder gespeichert.)
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-sm font-medium text-brand hover:text-brand-strong"
              >
                Neues Formular
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              {/* Gemeinsame Felder */}
              <Field label="Name" htmlFor="name">
                <input id="name" name="name" type="text" required className={inputCls} />
              </Field>
              <Field label="E-Mail" htmlFor="email">
                <input id="email" name="email" type="email" required className={inputCls} />
              </Field>

              {/* Rollen-spezifische Beispiel-Felder */}
              {role === "creator" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Plattform" htmlFor="platform">
                    <Select id="platform" name="platform" defaultValue="">
                      <option value="" disabled>
                        Bitte wählen
                      </option>
                      <option>Instagram</option>
                      <option>TikTok</option>
                      <option>YouTube</option>
                      <option>LinkedIn</option>
                      <option>Andere</option>
                    </Select>
                  </Field>
                  <Field label="Profil / Handle" htmlFor="handle">
                    <input id="handle" name="handle" type="text" placeholder="@…" className={inputCls} />
                  </Field>
                  <Field label="Reichweite (Follower)" htmlFor="reach">
                    <Select id="reach" name="reach" defaultValue="">
                      <option value="" disabled>
                        Bitte wählen
                      </option>
                      <option>unter 10 Tsd.</option>
                      <option>10–50 Tsd.</option>
                      <option>50–250 Tsd.</option>
                      <option>über 250 Tsd.</option>
                    </Select>
                  </Field>
                  <Field label="Themenbereich" htmlFor="topic">
                    <input id="topic" name="topic" type="text" placeholder="z. B. Nachhaltigkeit" className={inputCls} />
                  </Field>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Unternehmen" htmlFor="company">
                    <input id="company" name="company" type="text" required className={inputCls} />
                  </Field>
                  <Field label="Website" htmlFor="website">
                    <input id="website" name="website" type="url" placeholder="https://…" className={inputCls} />
                  </Field>
                  <Field label="Ihre Rolle" htmlFor="position">
                    <input id="position" name="position" type="text" placeholder="z. B. Marketing" className={inputCls} />
                  </Field>
                  <Field label="Budgetrahmen (optional)" htmlFor="budget">
                    <Select id="budget" name="budget" defaultValue="">
                      <option value="" disabled>
                        Bitte wählen
                      </option>
                      <option>noch offen</option>
                      <option>bis 5.000 €</option>
                      <option>5.000–20.000 €</option>
                      <option>über 20.000 €</option>
                    </Select>
                  </Field>
                </div>
              )}

              <Field label="Nachricht" htmlFor="message">
                <textarea id="message" name="message" rows={4} required className={inputCls} />
              </Field>

              <label className="flex items-start gap-2 text-xs text-ink-soft">
                <input type="checkbox" required className="mt-0.5" />
                <span>
                  Ich habe die{" "}
                  <a href="/datenschutz" className="text-brand underline hover:text-brand-strong">
                    Datenschutzerklärung
                  </a>{" "}
                  gelesen und stimme der Verarbeitung meiner Daten zu.
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-theme bg-brand px-6 py-3 text-base font-semibold text-on-brand transition-colors hover:bg-brand-strong"
              >
                Nachricht senden
              </button>
              <p className="text-center text-xs text-ink-soft">
                Mockup – später mit Datenbank verbunden. Kontakt:{" "}
                <a href={`mailto:${site.contact.email}`} className="text-brand hover:text-brand-strong">
                  {site.contact.email}
                </a>
              </p>
            </form>
          )}
        </div>

        {/* Calendly-Terminbuchung (Mockup) */}
        <CalendlyMockup className="lg:col-span-2" />
      </div>
    </Section>
  );
}

function CalendlyMockup({ className = "" }: { className?: string }) {
  const days = [
    { d: "Mo", n: 4 },
    { d: "Di", n: 5 },
    { d: "Mi", n: 6 },
    { d: "Do", n: 7 },
    { d: "Fr", n: 8 },
  ];
  const times = ["09:00", "10:30", "13:00", "15:30"];
  const [day, setDay] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);

  return (
    <div className={`rounded-theme border border-line bg-surface p-6 sm:p-8 ${className}`}>
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-brand" />
        <h3 className="text-lg font-semibold text-ink">Direkt Termin buchen</h3>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        15-minütiges Kennenlernen. Wählen Sie Tag und Uhrzeit.
      </p>

      {/* Tage */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Tag
        </p>
        <div className="grid grid-cols-5 gap-2">
          {days.map((x) => (
            <button
              key={x.n}
              type="button"
              onClick={() => setDay(x.n)}
              className={`flex flex-col items-center rounded-theme border py-2 text-sm transition-colors ${
                day === x.n
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-page text-ink hover:bg-surface-alt"
              }`}
            >
              <span className="text-[11px]">{x.d}</span>
              <span className="font-semibold">{x.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Uhrzeiten */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Uhrzeit
        </p>
        <div className="grid grid-cols-2 gap-2">
          {times.map((t) => (
            <button
              key={t}
              type="button"
              disabled={day === null}
              onClick={() => setTime(t)}
              className={`rounded-theme border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                time === t
                  ? "border-brand bg-brand text-on-brand"
                  : "border-line bg-page text-ink hover:bg-surface-alt"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={day === null || time === null}
        className="mt-6 w-full rounded-theme bg-brand px-4 py-3 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-40"
      >
        {day && time ? `Termin am ${day}. um ${time} buchen` : "Tag & Uhrzeit wählen"}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">
        Mockup – Calendly-Einbindung folgt später.
      </p>
    </div>
  );
}

/* --- kleine Bausteine --- */

const inputCls =
  "w-full rounded-theme border border-line bg-page px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-soft";

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5 ${
        active ? "bg-brand text-on-brand" : "text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

/* Dropdown mit exakt gleicher Größe/Styling wie die Textfelder. */
function Select({
  id,
  name,
  defaultValue,
  required,
  children,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className={`${inputCls} cursor-pointer appearance-none pr-10`}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
