"use client";

import { useId, useState } from "react";
import { Section, SectionHeading } from "@/components/Section";

export type FaqItem = { q: string; a: string };

export function Faq({
  eyebrow,
  title,
  items,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  items: readonly FaqItem[];
  tone?: "light" | "alt" | "dark";
}) {
  const [open, setOpen] = useState<number | null>(0);
  const onDark = tone === "dark";
  const baseId = useId();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <Section id="faq" tone={tone}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionHeading eyebrow={eyebrow} title={title} onDark={onDark} />
      <ul className="mx-auto mt-12 max-w-3xl divide-y divide-line border-y border-line">
        {items.map((item, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;

          return (
            <li key={item.q}>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`flex w-full items-start justify-between gap-4 py-5 text-left transition-colors ${
                  onDark ? "text-on-dark hover:text-on-dark" : "text-ink hover:text-brand"
                }`}
              >
                <span className="font-brand text-base font-semibold sm:text-lg">
                  {item.q}
                </span>
                <span
                  className={`mt-1 shrink-0 text-lg leading-none ${onDark ? "text-on-dark/60" : "text-ink-soft"}`}
                  aria-hidden
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {/* Antwort immer im DOM für Crawler; visuell nur bei geöffnetem Panel */}
              <p
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`pb-5 pr-8 text-sm leading-relaxed sm:text-base ${
                  onDark ? "text-on-dark/80" : "text-ink-soft"
                } ${isOpen ? "" : "hidden"}`}
              >
                {item.a}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
