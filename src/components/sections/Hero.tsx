import { ConnectionAnimation } from "@/components/ConnectionAnimation";
import { site } from "@/config/site";

export function Hero() {
  return (
    <section id="start" className="scroll-mt-16 bg-dark">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 md:grid-cols-2 md:gap-16 md:py-28 lg:gap-24">
        {/* Text + CTA – auf Mobile zuerst */}
        <div className="text-center md:text-left">
          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-on-dark/75">
            Trust Marketing für die Energiewende
          </p>
          <h1 className="font-brand text-4xl font-semibold leading-[1.1] tracking-tight text-on-dark sm:text-5xl md:text-6xl">
            {site.claim}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-on-dark/85 md:mx-0 md:text-lg">
            {site.subclaim}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href="#kontakt"
              className="w-full rounded-theme bg-on-dark px-6 py-3 text-center text-base font-semibold text-brand-strong transition-colors hover:bg-brand-soft sm:w-auto"
            >
              Erstgespräch anfragen
            </a>
            <a
              href="#dienstleistungen"
              className="w-full rounded-theme border-2 border-brand px-6 py-3 text-center text-base font-semibold text-on-dark transition-colors hover:bg-brand hover:text-on-brand sm:w-auto"
            >
              Leistungen ansehen
            </a>
          </div>
        </div>

        {/* Verbindungsmotiv – auf Mobile unter dem Text, Desktop rechts */}
        <div className="w-full md:order-last md:justify-self-stretch">
          <ConnectionAnimation />
        </div>
      </div>
    </section>
  );
}
