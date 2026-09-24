import { Section, SectionHeading } from "@/components/Section";
import { companyFunnel } from "@/config/site";

export function CompanyFunnel() {
  const f = companyFunnel;
  return (
    <>
      <Section id="pilot" tone="light">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow={f.pilot.eyebrow} title={f.pilot.title} intro={f.pilot.intro} />
            <p className="mt-6 text-sm leading-relaxed text-ink-soft">Für Unternehmen aus Photovoltaik, Wärmepumpe und Smart Energy, die ein Projekt zeigen können und ihre Inhalte gezielt einsetzen möchten.</p>
            <a href="#kontakt" className="mt-8 inline-flex items-center gap-5 rounded-theme bg-brand px-6 py-3.5 text-sm font-semibold text-on-brand hover:bg-brand-strong">Pilotprojekt anfragen <span aria-hidden="true">↗</span></a>
          </div>
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">Das ist enthalten</p>
            <ul className="mt-6 divide-y divide-line">{f.pilot.points.map((point) => <li key={point} className="flex gap-3 py-4 text-sm leading-relaxed first:pt-0"><span aria-hidden="true" className="font-semibold text-brand">✓</span>{point}</li>)}</ul>
            <p className="mt-5 border-t border-line pt-5 text-xs leading-relaxed text-ink-soft">{f.pilot.scope}</p>
          </div>
        </div>
        <div className="mt-12 grid gap-4 border-y border-line py-6 md:grid-cols-[0.8fr_1.2fr] md:gap-12"><p className="text-lg font-semibold leading-snug text-ink">{f.pilot.budgetTitle}</p><p className="text-sm leading-relaxed text-ink-soft">{f.pilot.budgetText}</p></div>
      </Section>
      <Section id="einsatz" tone="alt">
        <SectionHeading eyebrow="Ein Video mit einer Aufgabe" title="Dort einsetzen, wo Kunden Fragen haben." />
        <div className="mt-10 grid gap-8 md:grid-cols-3">{f.uses.map((use, i) => <article key={use.title} className="border-t border-brand/25 pt-6"><span className="text-sm font-semibold text-brand">0{i + 1}</span><h3 className="mt-4 text-xl font-semibold">{use.title}</h3><p className="mt-3 text-sm leading-relaxed text-ink-soft">{use.text}</p><p className="mt-5 text-xs font-semibold text-brand">{use.channel}</p></article>)}</div>
      </Section>
      <Section id="leistungen" tone="light">
        <SectionHeading eyebrow="Klar getrennte Leistungen" title="Welche Inhalte Sie erhalten. Wo sie erscheinen." intro="Content-Produktion, Creator-Reichweite und Werbeausspielung erfüllen unterschiedliche Aufgaben. Wir klären vorab, was Ihr Projekt braucht." />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">{f.services.map((service, i) => <article key={service.number} className={`flex flex-col rounded-xl border p-6 sm:p-7 ${i === 0 ? "border-brand/30 bg-surface-alt" : "border-line bg-surface"}`}><div className="flex items-center justify-between gap-4 text-xs font-semibold text-brand"><span>{service.number}</span><span>{service.label}</span></div><h3 className="mt-7 text-2xl font-semibold leading-tight">{service.title}</h3><p className="mb-7 mt-4 text-sm leading-relaxed text-ink-soft">{service.text}</p><p className="mt-auto border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink">{service.detail}</p></article>)}</div>
      </Section>
      <Section id="ablauf" tone="alt">
        <SectionHeading eyebrow="So arbeiten wir zusammen" title={f.process.title} />
        <ol className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{f.process.steps.map((step) => <li key={step.n} className="border-t border-brand/25 pt-5"><span className="text-sm font-semibold tracking-widest text-brand">{step.n}</span><h3 className="mt-4 text-xl font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.text}</p></li>)}</ol>
      </Section>
    </>
  );
}
