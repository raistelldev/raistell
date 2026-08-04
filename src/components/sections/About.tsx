import { Section, SectionHeading } from "@/components/Section";
import { Placeholder } from "@/components/Placeholder";

export function About() {
  return (
    <Section id="ueber-uns" tone="light">
      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* Bild-/Grafik-Mockup */}
        <div className="order-last md:order-first">
          <Placeholder label="Platzhalter – Team- oder Portraitfoto" ratio="aspect-4/3" />
        </div>

        {/* Text */}
        <div>
          <SectionHeading
            eyebrow="Über uns"
            title="Die Brücke zwischen zwei Welten"
            intro="Wir verbinden die Reichweite von Creatorn mit den Zielen von Unternehmen der erneuerbaren Energien."
          />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
            <p>
              Als Vermittler kennen wir beide Seiten: Wir verstehen, wie Creator
              arbeiten, und wir wissen, worauf es Marken in der grünen Branche
              ankommt.
            </p>
            <p>
              Wir starten frisch und mit klarem Fokus – persönlich, ehrlich und
              ohne unnötigen Ballast. Genau das geben wir an unsere Partner
              weiter.
            </p>
          </div>

          <ul className="mt-8 space-y-3">
            {[
              "Persönliche Betreuung statt anonymer Plattform",
              "Passgenaue Auswahl nach Werten & Zielgruppe",
              "Transparente Konditionen und klare Absprachen",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Namensherkunft: Raisting + Telstar = Raistell */}
      <div className="mt-20 border-t border-line pt-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          Woher der Name kommt
        </p>
        <h3 className="mt-4 max-w-2xl font-brand text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Ein Name, inspiriert von Verbindung über Distanz.
        </h3>

        <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {[
            {
              n: "01",
              title: "Raisting",
              text: "Ein deutscher Ort mit besonderer Geschichte in der Satellitenkommunikation. Dort wurde Deutschlands erste kommerziell betriebene Satelliten-Bodenstation errichtet.",
            },
            {
              n: "02",
              title: "Telstar",
              text: "Ein früher Kommunikationssatellit, der Fernsehsignale zwischen Europa und Nordamerika übertrug. Seine Oberfläche war mit Solarzellen bedeckt.",
            },
          ].map((item) => (
            <div key={item.n} className="border-t border-line pt-6">
              <span className="font-brand text-sm font-semibold tracking-widest text-brand">
                {item.n}
              </span>
              <h4 className="mt-5 font-brand text-xl font-semibold text-ink">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-3xl text-base leading-relaxed text-ink-soft">
          Aus <span className="font-semibold text-ink">Raisting</span> und{" "}
          <span className="font-semibold text-ink">Telstar</span> entstand{" "}
          <span className="font-semibold text-ink">Raistell</span>. Die historische
          Idee dahinter bleibt aktuell: Verbindungen schaffen, die ohne den richtigen
          Vermittler nicht entstehen würden.
        </p>
      </div>
    </Section>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
