"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Section } from "@/components/Section";
import { pilot } from "@/config/site";

type Audience = "company" | "creator";
type FormatId = (typeof pilot.company.formats)[number]["id"];

export function Services() {
  const [audience, setAudience] = useState<Audience>("company");
  const [activeFormat, setActiveFormat] = useState<FormatId>(
    pilot.company.formats[0].id,
  );

  const activeFormatData =
    pilot.company.formats.find((f) => f.id === activeFormat) ??
    pilot.company.formats[0];

  return (
    <Section id="dienstleistungen" tone="alt">
      {/* Segmented Control */}
      <div className="mx-auto flex w-full max-w-md justify-center">
        <div
          role="tablist"
          aria-label="Zielgruppe"
          className="flex w-full rounded-full border border-line bg-surface p-1"
        >
          {(
            [
              { id: "company", label: "Für Unternehmen" },
              { id: "creator", label: "Für Creator" },
            ] as const
          ).map((tab) => {
            const active = audience === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setAudience(tab.id)}
                className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand text-on-brand shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {audience === "company" ? (
        <CompanyView
          activeFormat={activeFormat}
          setActiveFormat={setActiveFormat}
          activeFormatData={activeFormatData}
        />
      ) : (
        <CreatorView />
      )}
    </Section>
  );
}

function CompanyView({
  activeFormat,
  setActiveFormat,
  activeFormatData,
}: {
  activeFormat: FormatId;
  setActiveFormat: (id: FormatId) => void;
  activeFormatData: (typeof pilot.company.formats)[number];
}) {
  const { company } = pilot;

  return (
    <div className="mt-10 sm:mt-12 md:mt-14">
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand">
          Dienstleistungen
        </p>
        <h2 className="font-brand text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
          {company.title}
        </h2>
        <p className="mt-4 text-base font-medium leading-relaxed text-ink sm:mt-5">
          {company.subtitle}
        </p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          {company.description}
        </p>
      </div>

      {/* Was inklusive ist */}
      <div className="mt-12 sm:mt-14 md:mt-16">
        <h3 className="font-brand text-xl font-semibold text-ink sm:text-2xl">
          Was inklusive ist
        </h3>
        <ul className="mt-5 space-y-3 sm:mt-6">
          {company.included.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-ink sm:text-base">
              <Check
                className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                strokeWidth={2}
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Format-Tabs */}
      <div className="mt-12 sm:mt-14 md:mt-16">
        <h3 className="font-brand text-xl font-semibold text-ink sm:text-2xl">
          Wählen Sie Ihr Format
        </h3>

        <div
          role="tablist"
          aria-label="Formate"
          className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-6 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {company.formats.map((format) => {
            const active = activeFormat === format.id;
            return (
              <button
                key={format.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFormat(format.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-brand text-on-brand"
                    : "border border-line bg-surface text-ink-soft hover:text-ink"
                }`}
              >
                {format.title}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          className="mt-5 rounded-theme border border-line bg-surface p-5 sm:mt-6 sm:p-6"
        >
          {activeFormatData.recommended && (
            <span className="mb-3 inline-block rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              Empfohlener Einstieg
            </span>
          )}
          <h4 className="font-brand text-lg font-semibold text-ink">
            {activeFormatData.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
            {activeFormatData.text}
          </p>
        </div>

        <p className="mt-4 text-sm text-ink-soft">{company.formatsNote}</p>
      </div>

      {/* Was Sie davon haben + CTA */}
      <div className="mt-12 sm:mt-14 md:mt-16">
        <h3 className="font-brand text-xl font-semibold text-ink sm:text-2xl">
          Was Sie davon haben
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          {company.benefit}
        </p>

        <a
          href={company.ctaHref}
          onClick={() => setContactRole("firma")}
          className="mt-8 inline-flex w-full items-center justify-center rounded-theme bg-brand px-6 py-3.5 text-center text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong sm:w-auto"
        >
          {company.cta}
        </a>
      </div>
    </div>
  );
}

function CreatorView() {
  const { creator } = pilot;

  return (
    <div className="mt-10 sm:mt-12 md:mt-14">
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand">
          Für Creator
        </p>
        <h2 className="font-brand text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
          {creator.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:mt-5">
          {creator.description}
        </p>
      </div>

      <div className="mt-10 sm:mt-12">
        <h3 className="font-brand text-xl font-semibold text-ink sm:text-2xl">
          Was du bekommst
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {creator.benefits.map((card) => (
            <div
              key={card.title}
              className="rounded-theme border border-line bg-surface p-5 sm:p-6"
            >
              <h4 className="font-brand text-base font-semibold text-ink sm:text-lg">
                {card.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-soft sm:mt-8">{creator.note}</p>

      <a
        href={creator.ctaHref}
        onClick={() => setContactRole("creator")}
        className="mt-8 inline-flex w-full items-center justify-center rounded-theme bg-brand px-6 py-3.5 text-center text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong sm:w-auto"
      >
        {creator.cta}
      </a>
    </div>
  );
}

/** Kontakt-Formular auf passende Rolle setzen (Unternehmen / Creator). */
function setContactRole(role: "firma" | "creator") {
  window.dispatchEvent(
    new CustomEvent("raistell:contact-role", { detail: role }),
  );
}
