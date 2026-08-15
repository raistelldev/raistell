import { Section, SectionHeading } from "@/components/Section";
import { about } from "@/config/site";

export function About() {
  const { name } = about;
  const [origin, ...principles] = about.paragraphs;
  const claim = principles[principles.length - 1];
  const work = principles.slice(0, -1);

  return (
    <Section id="ueber-uns" tone="alt">
      <SectionHeading eyebrow={about.eyebrow} title={about.title} />

      <p className="mt-8 max-w-3xl border-l-2 border-brand pl-5 text-lg leading-relaxed text-ink-soft sm:pl-6 sm:text-xl">
        {origin}
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {work.map((paragraph) => (
          <div key={paragraph} className="border-t border-line pt-5">
            <span
              className="mb-4 block h-1.5 w-1.5 rounded-full bg-brand"
              aria-hidden
            />
            <p className="text-base leading-relaxed text-ink">{paragraph}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t-2 border-brand pt-6">
        <p className="max-w-3xl font-brand text-2xl font-semibold leading-snug text-ink sm:text-3xl">
          {claim}
        </p>
      </div>

      <div className="mt-20 border-t border-line pt-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          {name.title}
        </p>
        <h3 className="mt-4 max-w-2xl font-brand text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {name.intro}
        </h3>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {name.lead}
        </p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {name.inspiration}
        </p>

        <div
          className="mt-14 hidden items-center md:flex"
          aria-hidden
        >
          <span className="h-3 w-3 shrink-0 rounded-full bg-brand ring-4 ring-brand-soft" />
          <span className="mx-3 h-px min-w-0 flex-1 bg-gradient-to-r from-brand/55 to-brand/20" />
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand/35 font-brand text-lg font-semibold text-brand">
            +
          </span>
          <span className="mx-3 h-px min-w-0 flex-1 bg-gradient-to-r from-brand/20 to-brand/55" />
          <span className="h-3 w-3 shrink-0 rounded-full bg-brand ring-4 ring-brand-soft" />
        </div>

        <div className="mt-0 grid gap-10 md:mt-8 md:grid-cols-2 md:gap-12">
          {name.parts.map((part, i) => {
            const last = i === name.parts.length - 1;
            return (
              <div key={part.title} className="flex gap-4 md:block md:gap-0">
                <div
                  className="flex w-4 shrink-0 flex-col items-center md:hidden"
                  aria-hidden
                >
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-brand ring-4 ring-brand-soft" />
                  {!last && (
                    <span className="mt-1 w-px flex-1 bg-gradient-to-b from-brand/50 to-brand/15" />
                  )}
                </div>
                <div className={last ? "pb-0" : "pb-8 md:pb-0"}>
                  <p className="text-sm font-semibold uppercase tracking-widest text-brand">
                    {part.title}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-ink">
                    {part.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-10">
          <span className="font-brand text-lg font-semibold text-ink-soft sm:text-xl">
            Raisting
          </span>
          <span className="font-brand text-xl text-brand" aria-hidden>
            +
          </span>
          <span className="font-brand text-lg font-semibold text-ink-soft sm:text-xl">
            Telstar
          </span>
          <span className="font-brand text-xl text-brand" aria-hidden>
            →
          </span>
          <span className="font-brand text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Raistell
          </span>
        </div>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {name.meaning}
        </p>

        <p className="mt-12 max-w-3xl border-t border-line pt-10 font-brand text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">
          {name.closer}
        </p>
        <p className="mt-4 font-brand text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
          {name.tagline}
        </p>
      </div>
    </Section>
  );
}
