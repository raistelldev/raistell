import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceIcon } from "@/components/ServiceIcon";
import { getService, services, site } from "@/config/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    return { title: "Dienstleistung" };
  }

  const title = service.title;
  const description = service.description;

  return {
    title,
    description,
    alternates: { canonical: `/dienstleistungen/${slug}` },
    openGraph: {
      title: `${title} – ${site.name}`,
      description,
      url: `/dienstleistungen/${slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <a
        href="/#ablauf"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-strong"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Zum Ablauf
      </a>

      <div className="mt-10">
        <div className="flex items-center gap-3">
          <ServiceIcon name={service.icon} className="h-7 w-7 text-brand" />
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Dienstleistung
          </p>
        </div>
        <h1 className="mt-6 font-brand text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          {service.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{service.description}</p>
      </div>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-ink-soft">
        <p>{service.long}</p>
      </div>

      <ul className="mt-8 space-y-3">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm text-ink">
            <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {point}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-12 rounded-theme bg-brand p-8 text-center">
        <h2 className="font-brand text-xl font-semibold text-on-brand">Passt das zu Ihnen?</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-on-brand/85">
          Lassen Sie uns unverbindlich sprechen – wir melden uns mit einem
          passenden Vorschlag.
        </p>
        <a
          href="/?role=firma#kontakt"
          className="mt-6 inline-flex rounded-theme bg-on-brand px-6 py-3 text-sm font-semibold text-brand-strong transition-colors hover:bg-brand-soft"
        >
          Kostenloses Erstgespräch vereinbaren
        </a>
      </div>

    </main>
  );
}
