"use client";

import { useAudience } from "@/components/AudienceContext";
import { ConnectionAnimation } from "@/components/ConnectionAnimation";
import { companyFunnel, creatorFunnel, ctas } from "@/config/site";

export function Hero() {
  const { audience, setAudience } = useAudience();
  const isCompany = audience === "firma";
  const content = isCompany ? companyFunnel.hero : creatorFunnel.hero;
  const cta = isCompany ? ctas.company : ctas.creator;

  function scrollToContact() {
    setAudience(audience);
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="start" className="scroll-mt-16 bg-dark">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10">
        {/* Funnel-Wahl: klar, wohin zuerst */}
        <div
          role="tablist"
          aria-label="Für wen sind Sie hier?"
          className="mx-auto flex w-full max-w-md rounded-full border border-on-dark/20 bg-dark-strong/50 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isCompany}
            onClick={() => setAudience("firma")}
            className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors ${
              isCompany
                ? "bg-on-dark text-brand-strong"
                : "text-on-dark/70 hover:text-on-dark"
            }`}
          >
            Unternehmen
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isCompany}
            onClick={() => setAudience("creator")}
            className={`flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors ${
              !isCompany
                ? "bg-on-dark text-brand-strong"
                : "text-on-dark/70 hover:text-on-dark"
            }`}
          >
            Creator
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:py-16 md:grid-cols-2 md:gap-16 md:py-24 lg:gap-24">
        <div className="text-center md:text-left">
          <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-on-dark/75">
            {content.eyebrow}
          </p>
          <h1 className="font-brand text-3xl font-semibold leading-[1.12] tracking-tight text-on-dark sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            {content.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-on-dark/85 md:mx-0 md:text-lg">
            {content.subtitle}
          </p>

          <div className="mt-8 flex justify-center md:justify-start">
            <button
              type="button"
              onClick={scrollToContact}
              className="w-full rounded-theme bg-on-dark px-6 py-3.5 text-center text-base font-semibold text-brand-strong transition-colors hover:bg-brand-soft sm:w-auto"
            >
              {cta.label}
            </button>
          </div>
        </div>

        <div className="w-full md:order-last md:justify-self-stretch">
          <ConnectionAnimation />
        </div>
      </div>
    </section>
  );
}
