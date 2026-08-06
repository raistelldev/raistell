"use client";

import { useId, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAudience } from "@/components/AudienceContext";
import { Section, SectionHeading } from "@/components/Section";
import { ctas, formOptions, site } from "@/config/site";

export function Contact() {
  const router = useRouter();
  const { audience, setAudience } = useAudience();
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [platformError, setPlatformError] = useState(false);

  useEffect(() => {
    setPlatforms([]);
    setPlatformError(false);
  }, [audience]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (audience === "creator" && platforms.length === 0) {
      setPlatformError(true);
      return;
    }
    router.push(`/danke?role=${audience}`);
  }

  const submitLabel =
    audience === "firma" ? ctas.company.label : ctas.creator.finalLabel;

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

      <div className="mt-8 flex justify-center">
        <div
          role="tablist"
          aria-label="Ich bin"
          className="inline-flex rounded-full border border-line bg-surface p-1"
        >
          <ToggleButton
            active={audience === "firma"}
            onClick={() => setAudience("firma")}
          >
            Unternehmen
          </ToggleButton>
          <ToggleButton
            active={audience === "creator"}
            onClick={() => setAudience("creator")}
          >
            Creator
          </ToggleButton>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-theme border border-line bg-surface p-6 sm:p-8">
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
            <CompanyFields />
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
            className="w-full rounded-theme bg-brand px-6 py-3.5 text-base font-semibold text-on-brand transition-colors hover:bg-brand-strong"
          >
            {submitLabel}
          </button>
          <p className="text-center text-xs text-ink-soft">
            Fragen?{" "}
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
        <Field label="Region" htmlFor="region" required>
          <input
            id="region"
            name="region"
            type="text"
            required
            placeholder="z. B. Bayern / DACH"
            className={inputCls}
          />
        </Field>
      </div>

      <PlatformMultiSelect
        selected={platforms}
        onChange={setPlatforms}
        error={platformError}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Media Kit" htmlFor="mediakit" optional>
            <input
              id="mediakit"
              name="mediakit"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className={`${inputCls} file:mr-3 file:rounded file:border-0 file:bg-brand-soft file:px-2 file:py-1 file:text-xs file:font-semibold file:text-brand`}
            />
          </Field>
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
      </div>
    </>
  );
}

function CompanyFields() {
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
        <Field label="Bundesland" htmlFor="state" required>
          <Select id="state" name="state" required defaultValue="">
            <option value="" disabled>
              Bitte wählen
            </option>
            {formOptions.bundeslaender.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
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

      <Field label="Was wird gesucht?" htmlFor="seeking" required>
        <Select id="seeking" name="seeking" required defaultValue="">
          <option value="" disabled>
            Bitte wählen
          </option>
          {formOptions.seeking.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>

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

function PlatformMultiSelect({
  selected,
  onChange,
  error,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  error: boolean;
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

  function toggle(platform: string) {
    onChange(
      selected.includes(platform)
        ? selected.filter((p) => p !== platform)
        : [...selected, platform],
    );
  }

  const label =
    selected.length === 0
      ? "Plattformen wählen"
      : selected.length === 1
        ? selected[0]
        : `${selected.length} ausgewählt`;

  return (
    <div ref={rootRef}>
      <p className="mb-1.5 text-sm font-medium text-ink">
        Plattform <span className="text-brand">*</span>
      </p>
      <p className="mb-2 text-xs text-ink-soft">Mehrfachauswahl möglich</p>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={`${inputCls} flex cursor-pointer items-center justify-between text-left ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
        }`}
      >
        <span className={selected.length ? "text-ink" : "text-ink-soft"}>
          {label}
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
          {formOptions.platforms.map((platform) => {
            const active = selected.includes(platform);
            return (
              <li key={platform}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => toggle(platform)}
                  className={`flex w-full items-center gap-3 rounded-theme px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-brand-soft font-semibold text-brand"
                      : "text-ink hover:bg-surface-alt"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
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
                  {platform}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Für FormData / spätere Backend-Anbindung */}
      {selected.map((p) => (
        <input key={p} type="hidden" name="platforms" value={p} />
      ))}

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          Bitte mindestens eine Plattform wählen.
        </p>
      )}
    </div>
  );
}

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
