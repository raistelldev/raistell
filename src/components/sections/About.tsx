import { Section, SectionHeading } from "@/components/Section";
import { about } from "@/config/site";

export function About() {
  const { name } = about;
  return (
    <Section id="ueber-uns" tone="light">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading eyebrow={about.eyebrow} title={about.title} />
        <div className="space-y-5">{about.paragraphs.map((paragraph) => <p key={paragraph} className="text-base leading-relaxed text-ink-soft">{paragraph}</p>)}</div>
      </div>
      <details className="group mt-12 border-y border-line">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-base font-semibold text-ink [&::-webkit-details-marker]:hidden">
          Die Geschichte hinter dem Namen Raistell<span aria-hidden="true" className="text-xl font-normal text-brand transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="pb-8">
          <h3 className="max-w-2xl text-2xl font-semibold tracking-tight">{name.intro}</h3>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-soft">{name.lead}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">{name.inspiration}</p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">{name.parts.map((part) => <div key={part.title} className="border-l-2 border-brand/40 pl-5"><p className="text-sm font-semibold text-brand">{part.title}</p><p className="mt-3 text-sm leading-relaxed text-ink-soft">{part.text}</p></div>)}</div>
          <p className="mt-8 text-xl font-semibold">{name.formed}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft">{name.meaning}</p>
          <p className="mt-5 text-sm text-ink-soft">{name.closer}</p>
          <p className="mt-3 text-xl font-semibold text-brand">{name.tagline}</p>
        </div>
      </details>
    </Section>
  );
}
