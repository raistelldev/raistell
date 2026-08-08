import { Section, SectionHeading } from "@/components/Section";
import { Faq } from "@/components/sections/Faq";
import { creatorFunnel } from "@/config/site";

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CreatorFunnel() {
  const f = creatorFunnel;

  return (
    <>
      <Section id="problem" tone="light">
        <SectionHeading eyebrow={f.problem.eyebrow} title={f.problem.title} />
        <ul className="mt-10 max-w-2xl space-y-5">
          {f.problem.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-base text-ink sm:text-lg">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="loesung" tone="alt">
        <SectionHeading
          eyebrow={f.solution.eyebrow}
          title={f.solution.title}
          intro={f.solution.text}
        />
      </Section>

      <Section id="warum-raistell" tone="light">
        <SectionHeading
          eyebrow={f.whyRaistell.eyebrow}
          title={f.whyRaistell.title}
        />
        <ul className="mt-10 max-w-2xl space-y-4">
          {f.whyRaistell.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-base text-ink">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              {point}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="ablauf" tone="alt">
        <SectionHeading eyebrow={f.process.eyebrow} title={f.process.title} />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {f.process.steps.map((step) => (
            <li key={step.n} className="border-t border-line pt-5">
              <span className="font-brand text-sm font-semibold tracking-widest text-brand">
                {step.n}
              </span>
              <h3 className="mt-4 font-brand text-xl font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="wen-wir-suchen" tone="light">
        <SectionHeading eyebrow={f.seeking.eyebrow} title={f.seeking.title} />
        <ul className="mt-10 max-w-2xl space-y-4">
          {f.seeking.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-base text-ink">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              {point}
            </li>
          ))}
        </ul>
      </Section>

      <Faq
        eyebrow={f.faq.eyebrow}
        title={f.faq.title}
        items={f.faq.items}
        tone="alt"
      />
    </>
  );
}
