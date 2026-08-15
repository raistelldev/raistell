"use client";

import { useAudience } from "@/components/AudienceContext";
import { Hero } from "@/components/sections/Hero";
import { CompanyFunnel } from "@/components/funnels/CompanyFunnel";
import { CreatorFunnel } from "@/components/funnels/CreatorFunnel";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { About } from "@/components/sections/About";
import { companyFunnel, creatorFunnel } from "@/config/site";

/*
  Zwei getrennte Funnel – Umschalter im Hero:
  Unternehmen → Schritt für Schritt zum Erstgespräch
  Creator → Schritt für Schritt zum Netzwerk
*/
export default function Home() {
  const { audience } = useAudience();
  const faq = audience === "firma" ? companyFunnel.faq : creatorFunnel.faq;

  return (
    <main>
      <Hero />
      {audience === "firma" ? <CompanyFunnel /> : <CreatorFunnel />}
      <Contact />
      <Faq
        eyebrow={faq.eyebrow}
        title={faq.title}
        items={faq.items}
        tone="light"
      />
      <About />
    </main>
  );
}
