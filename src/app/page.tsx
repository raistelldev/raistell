import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/*
  One-Page-Aufbau. Sektionen liegen untereinander und sind per Anker (#)
  verlinkt. Ink/Hell-Schachbrett mit Teal-Akzenten:
  Start (INK) → Dienstleistungen (hell) → Kontakt (INK) → Über uns (hell).
*/
export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Contact />
      <About />
    </main>
  );
}
