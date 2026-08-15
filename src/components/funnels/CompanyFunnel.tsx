import { Section, SectionHeading } from "@/components/Section";
import { companyFunnel } from "@/config/site";

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

        {/* Mobile: vertikale Prozess-Schiene */}
        <ol className="mt-12 md:hidden">
          {f.whyRaistell.points.map((point, i) => {
            const last = i === f.whyRaistell.points.length - 1;
            return (
              <li key={point} className="flex gap-4">
                <div className="flex w-4 shrink-0 flex-col items-center" aria-hidden>
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-brand ring-4 ring-brand-soft" />
                  {!last && (
                    <span className="mt-1 w-px flex-1 bg-gradient-to-b from-brand/50 to-brand/15" />
                  )}
                </div>
                <p
                  className={`font-brand text-xl font-semibold leading-snug text-ink ${
                    last ? "pb-0" : "pb-8"
                  }`}
                >
                  {point}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Desktop: horizontale Prozesskette */}
        <ol className="mt-16 hidden grid-cols-5 gap-0 md:grid">
          {f.whyRaistell.points.map((point, i) => {
            const last = i === f.whyRaistell.points.length - 1;
            return (
              <li key={point} className="relative px-3 first:pl-0 last:pr-0">
                <div className="flex items-center" aria-hidden>
                  <span className="h-3 w-3 shrink-0 rounded-full bg-brand ring-4 ring-brand-soft" />
                  {!last && (
                    <span className="mx-2 h-px min-w-0 flex-1 bg-gradient-to-r from-brand/55 to-brand/20" />
                  )}
                </div>
                <p className="mt-5 font-brand text-lg font-semibold leading-snug text-ink lg:text-xl">
                  {point}
                </p>
              </li>
            );
          })}
        </ol>
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
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {step.text}
              </p>
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
    </>
  );
}
