import { Section, SectionHeading } from "@/components/Section";
import { Faq } from "@/components/sections/Faq";
import { companyFunnel, ctas } from "@/config/site";

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

export function CompanyFunnel() {
  const f = companyFunnel;

  return (
    <>
      {/* Problem */}
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

      {/* Warum Creator */}
      <Section id="warum-creator" tone="alt">
        <SectionHeading
          eyebrow={f.whyCreators.eyebrow}
          title={f.whyCreators.title}
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="border-t-2 border-line pt-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
              {f.whyCreators.ad.label}
            </p>
            <p className="mt-4 font-brand text-2xl font-semibold text-ink-soft sm:text-3xl">
              {f.whyCreators.ad.text}
            </p>
          </div>
          <div className="border-t-2 border-brand pt-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
              {f.whyCreators.creator.label}
            </p>
            <p className="mt-4 font-brand text-2xl font-semibold text-ink sm:text-3xl">
              {f.whyCreators.creator.text}
            </p>
          </div>
        </div>
      </Section>

      {/* Warum Raistell */}
      <Section id="warum-raistell" tone="light">
        <SectionHeading
          eyebrow={f.whyRaistell.eyebrow}
          title={f.whyRaistell.title}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {f.whyRaistell.points.map((point, i) => (
            <li key={point} className="border-t border-line pt-5">
              <span className="font-brand text-sm font-semibold tracking-widest text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-brand text-lg font-semibold text-ink">{point}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Ablauf */}
      <Section id="ablauf" tone="alt">
        <SectionHeading title={f.process.title} />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {f.process.steps.map((step) => (
            <li key={step.n} className="border-t border-line pt-5">
              <span className="font-brand text-sm font-semibold tracking-widest text-brand">
                {step.n}
              </span>
              <h3 className="mt-4 font-brand text-xl font-semibold text-ink">
                {step.title}
              </h3>
            </li>
          ))}
        </ol>
      </Section>

      {/* Vertrauen */}
      <Section id="vertrauen" tone="light">
        <SectionHeading eyebrow={f.trust.eyebrow} title={f.trust.title} />
        <ul className="mt-10 max-w-2xl space-y-4">
          {f.trust.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-base text-ink">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              {point}
            </li>
          ))}
        </ul>
      </Section>

      {/* Gründung + Name */}
      <Section id="geschichte" tone="dark">
        <SectionHeading
          eyebrow={f.founding.eyebrow}
          title={f.founding.title}
          intro={f.founding.text}
          onDark
        />

        <div className="mt-16 border-t border-on-dark/20 pt-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-on-dark/75">
            {f.founding.name.title}
          </p>
          <h3 className="mt-4 max-w-2xl font-brand text-2xl font-semibold tracking-tight text-on-dark sm:text-3xl">
            {f.founding.name.intro}
          </h3>
          <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {f.founding.name.parts.map((part) => (
              <div key={part.n} className="border-t border-on-dark/20 pt-6">
                <span className="font-brand text-sm font-semibold tracking-widest text-on-dark/75">
                  {part.n}
                </span>
                <h4 className="mt-5 font-brand text-xl font-semibold text-on-dark">
                  {part.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-on-dark/80">
                  {part.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-12 max-w-3xl text-base leading-relaxed text-on-dark/85">
            {f.founding.name.closing}
          </p>
        </div>
      </Section>

      <Faq
        eyebrow={f.faq.eyebrow}
        title={f.faq.title}
        items={f.faq.items}
        tone="light"
      />

      {/* Closing CTA → Formular */}
      <section id="abschluss" className="scroll-mt-16 bg-surface-alt">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-20">
          <h2 className="font-brand text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-4xl">
            {f.closing.title}
          </h2>
          <a
            href="#kontakt"
            className="mt-8 inline-flex w-full items-center justify-center rounded-theme bg-brand px-6 py-3.5 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-strong sm:w-auto"
          >
            {ctas.company.label}
          </a>
        </div>
      </section>
    </>
  );
}
