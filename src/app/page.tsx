"use client";

import { useState } from "react";
import { IntroSplash } from "@/components/IntroSplash";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/*
  One-Page mit Intro bei jedem Aufruf.
  Schachbrett: Start (INK) → Dienstleistungen (Mist) → Kontakt (INK) → Über uns (Warm White).
*/
export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered && <IntroSplash onEnter={() => setEntered(true)} />}
      <main
        className={
          entered
            ? "opacity-100 transition-opacity duration-500"
            : "pointer-events-none opacity-0"
        }
        aria-hidden={!entered}
      >
        <Hero />
        <Services />
        <Contact />
        <About />
      </main>
    </>
  );
}
