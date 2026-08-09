"use client";

import { useId, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAudience } from "@/components/AudienceContext";
import { Section, SectionHeading } from "@/components/Section";
import { formOptions, site } from "@/config/site";

export function Contact() {
  const router = useRouter();
  const { audience, setAudience } = useAudience();
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [platformError, setPlatformError] = useState(false);
  const [seeking, setSeeking] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isCompany = audience === "firma";

  useEffect(() => {
    setPlatforms([]);
    setPlatformError(false);
    setSeeking([]);
    setSubmitError(null);
  }, [audience]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    if (audience === "creator" && platforms.length === 0) {
      setPlatformError(true);
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data: Record<string, unknown> = { role: audience };

    for (const [key, value] of fd.entries()) {
      if (typeof value !== "string") continue;
      if (key === "platforms" || key === "seeking") continue;
      data[key] = value;
    }

    if (audience === "creator") {
      data.platforms = platforms;
    } else {
      data.seeking = seeking;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await res.json()) as {
        ok?: boolean;
        error?: string;
        name?: string;
        email?: string;
        role?: string;
      };

      if (!res.ok || !result.ok) {
        setSubmitError(
          result.error ?? "Senden fehlgeschlagen. Bitte erneut versuchen.",
        );
        return;
      }

      const params = new URLSearchParams({
        role: result.role ?? audience,
        name: result.name ?? "",
        email: result.email ?? "",
      });
      router.push(`/danke?${params.toString()}`);
    } catch {
      setSubmitError(
        "Netzwerkfehler. Bitte Verbindung prüfen und erneut versuchen.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const submitLabel = "Termin buchen";

  const questionsLine =
    audience === "firma"
      ? "Fragen? Schreiben Sie uns:"
      : "Fragen? Wir helfen gerne weiter:";

  const heading =
    audience === "firma"
      ? {
          title: "Kostenloses Erstgespräch vereinbaren",
          intro:
            "Unverbindlich und kostenlos. Wir melden uns persönlich bei Ihnen.",
        }
      : {
          title: "Teil unseres Creator-Netzwerks werden",
          intro: "Kurz bewerben – wir melden uns, wenn es passt.",
        };

  return (
    <Section id="kontakt" tone="dark">
      <SectionHeading
        eyebrow="Nächster Schritt"
        title={heading.title}
        intro={heading.intro}
        center
        onDark
      />

      <div className="mx-auto mt-8 flex w-full max-w-md justify-center px-0">
        <div
          role="tablist"
          aria-label="Für wen sind Sie hier?"
          className="flex w-full rounded-full border border-on-dark/20 bg-dark-strong/50 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isCompany}
            onClick={() => setAudience("firma")}
            className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors ${
              isCompany
                ? "bg-on-dark text-brand-strong"
                : "text-on-dark/70 hover:text-on-dark"
            }`}
          >
            Unternehmen
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isCompany}
            onClick={() => setAudience("creator")}
            className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors ${
              !isCompany
                ? "bg-on-dark text-brand-strong"
                : "text-on-dark/70 hover:text-on-dark"
            }`}
          >
            Creator
          </button>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-2xl rounded-theme border border-line bg-surface p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4" key={audience}>
          {audience === "creator" ? (
            <CreatorFields
              platforms={platforms}
              setPlatforms={(next) => {
                setPlatforms(next);
                if (next.length > 0) setPlatformError(false);
              }}
              platformError={platformError}
            />
          ) : (
            <CompanyFields seeking={seeking} setSeeking={setSeeking} />
          )}

          <label className="flex items-start gap-2 pt-2 text-xs text-ink-soft">
            <input type="checkbox" required className="mt-0.5" />
            <span>
              Ich habe die{" "}
              <a
                href="/datenschutz"
                className="text-brand underline hover:text-brand-strong"
              >
                Datenschutzerklärung
              </a>{" "}
              gelesen und stimme der Verarbeitung meiner Daten zu.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-theme bg-brand px-6 py-3.5 text-base font-semibold text-on-brand transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Wird gesendet …" : submitLabel}
          </button>
          {submitError && (
            <p className="text-center text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}
          <p className="text-center text-xs text-ink-soft">
            {questionsLine}{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="text-brand hover:text-brand-strong"
            >
              {site.contact.email}
            </a>
          </p>
        </form>
      </div>
    </Section>
  );
}

function CreatorFields({
  platforms,
  setPlatforms,
  platformError,
}: {
  platforms: string[];
  setPlatforms: (next: string[]) => void;
  platformError: boolean;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required>
          <input id="name" name="name" type="text" required className={inputCls} />
        </Field>
        <Field label="E-Mail" htmlFor="email" required>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Telefonnummer" htmlFor="phone" required>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Region" htmlFor="region-creator" required>
          <input
            id="region-creator"
            name="region"
            type="text"
            required
            placeholder="München, Bayern / DACH"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="text"
            className={inputCls}
          />
        </Field>
      </div>

      <MultiSelect
        label="Plattform"
        hint="Mehrfachauswahl möglich"
        name="platforms"
        options={formOptions.platforms}
        selected={platforms}
        onChange={setPlatforms}
        required
        error={platformError}
        errorMessage="Bitte mindestens eine Plattform wählen."
        placeholder="Plattformen wählen"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Followerzahl" htmlFor="reach" required>
          <Select id="reach" name="reach" required defaultValue="">
            <option value="" disabled>
              Bitte wählen
            </option>
            {formOptions.followerRanges.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Themengebiet" htmlFor="topic" required>
          <input
            id="topic"
            name="topic"
            type="text"
            required
            placeholder="z. B. Energiewende, Handwerk"
            className={inputCls}
          />
        </Field>
      </div>

      <Field
        label="Was macht deinen Content aus?"
        htmlFor="about"
        required
      >
        <textarea
          id="about"
          name="about"
          rows={4}
          required
          placeholder="Erzähl uns kurz über deinen Content …"
          className={inputCls}
        />
      </Field>

      <div className="border-t border-line pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Optional
        </p>
        <Field label="Preisvorstellung" htmlFor="price" optional>
          <input
            id="price"
            name="price"
            type="text"
            placeholder="z. B. ab 500 €"
            className={inputCls}
          />
        </Field>
      </div>
    </>
  );
}

function CompanyFields({
  seeking,
  setSeeking,
}: {
  seeking: string[];
  setSeeking: (next: string[]) => void;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Unternehmen" htmlFor="company" required>
          <input
            id="company"
            name="company"
            type="text"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Ansprechpartner" htmlFor="contact" required>
          <input
            id="contact"
            name="contact"
            type="text"
            required
            className={inputCls}
          />
        </Field>
        <Field label="E-Mail" htmlFor="email" required>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Telefon" htmlFor="phone" required>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Region" htmlFor="region-firma" required>
          <input
            id="region-firma"
            name="region"
            type="text"
            required
            placeholder="München, Bayern / DACH"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="text"
            className={inputCls}
          />
        </Field>
        <Field label="Branche" htmlFor="industry" required>
          <input
            id="industry"
            name="industry"
            type="text"
            required
            placeholder="z. B. Photovoltaik"
            className={inputCls}
          />
        </Field>
      </div>

      <MultiSelect
        label="Welche Art der Zusammenarbeit suchen Sie?"
        hint="Mehrfachauswahl möglich"
        name="seeking"
        options={formOptions.seeking}
        selected={seeking}
        onChange={setSeeking}
        optional
        placeholder="Bitte wählen"
      />

      <Field label="Budget" htmlFor="budget" optional>
        <Select id="budget" name="budget" defaultValue="">
          <option value="">Keine Angabe</option>
          {formOptions.budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Nachricht" htmlFor="message" required>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Kurz, worum es geht …"
          className={inputCls}
        />
      </Field>
    </>
  );
}

function MultiSelect({
  label,
  hint,
  name,
  options,
  selected,
  onChange,
  required,
  optional,
  error,
  errorMessage,
  placeholder,
}: {
  label: string;
  hint?: string;
  name: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  required?: boolean;
  optional?: boolean;
  error?: boolean;
  errorMessage?: string;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option],
    );
  }

  const summary =
    selected.length === 0 ? placeholder : selected.join(", ");

  return (
    <div ref={rootRef}>
      <p className="mb-1.5 text-sm font-medium text-ink">
        {label}
        {required && <span className="text-brand"> *</span>}
        {optional && (
          <span className="ml-1 text-xs font-normal text-ink-soft">
            (optional)
          </span>
        )}
      </p>
      {hint && <p className="mb-2 text-xs text-ink-soft">{hint}</p>}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`${inputCls} flex cursor-pointer items-center justify-between gap-3 text-left ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
        }`}
      >
        <span
          className={`min-w-0 flex-1 ${
            selected.length ? "text-ink" : "text-ink-soft"
          }`}
        >
          {summary}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={`h-4 w-4 shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-multiselectable
          className="mt-2 space-y-1 rounded-theme border border-line bg-page p-2"
        >
          {options.map((option) => {
            const active = selected.includes(option);
            return (
              <li key={option}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => toggle(option)}
                  className={`flex w-full items-center gap-3 rounded-theme px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-brand-soft font-semibold text-brand"
                      : "text-ink hover:bg-surface-alt"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      active
                        ? "border-brand bg-brand text-on-brand"
                        : "border-line bg-surface"
                    }`}
                    aria-hidden
                  >
                    {active && (
                      <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selected.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}

      {error && errorMessage && (
        <p className="mt-1.5 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-theme border border-line bg-page px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand-soft";

function Field({
  label,
  htmlFor,
  children,
  required,
  optional,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-brand"> *</span>}
        {optional && (
          <span className="ml-1 text-xs font-normal text-ink-soft">(optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}

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
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
