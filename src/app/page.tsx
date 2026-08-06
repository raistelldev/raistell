"use client";

import { useAudience } from "@/components/AudienceContext";
import { Hero } from "@/components/sections/Hero";
import { CompanyFunnel } from "@/components/funnels/CompanyFunnel";
import { CreatorFunnel } from "@/components/funnels/CreatorFunnel";
import { Contact } from "@/components/sections/Contact";

/*
  Zwei getrennte Funnel – Umschalter im Hero:
  Unternehmen → Schritt für Schritt zum Erstgespräch
  Creator → Schritt für Schritt zum Netzwerk
*/
export default function Home() {
  const { audience } = useAudience();

  return (
    <main>
      <Hero />
      {audience === "firma" ? <CompanyFunnel /> : <CreatorFunnel />}
      <Contact />
    </main>
  );
}
