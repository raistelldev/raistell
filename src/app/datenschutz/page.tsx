import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Datenschutzerklärung von ${site.name}.`,
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  const { legal } = site;

  return (
    <LegalLayout title="Datenschutzerklärung">
      <h2>1. Verantwortliche Stelle</h2>
      <p>
        {legal.providerName}
        <br />
        {legal.street}
        <br />
        {legal.city}
        <br />
        {legal.country}
        <br />
        E-Mail: {site.contact.email}
      </p>

      <h2>2. Erhebung und Speicherung personenbezogener Daten</h2>
      <p>
        Wenn Sie unser Kontaktformular nutzen, verarbeiten wir die von Ihnen
        angegebenen Daten (z. B. Name, E-Mail-Adresse und Angaben zu Ihrer
        Rolle) ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. a und b DSGVO.
      </p>

      <h2>3. Terminbuchung</h2>
      <p>
        Für Termine nutzen wir einen externen Dienst (z. B. Calendly). Es gelten
        die Datenschutzhinweise des jeweiligen Anbieters.
      </p>

      <h2>4. Cookies</h2>
      <p>
        Diese Website verwendet ausschließlich technisch notwendige Cookies.
        Nicht notwendige Cookies werden nur mit Ihrer Einwilligung gesetzt.
      </p>

      <h2>5. Ihre Rechte</h2>
      <p>
        Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung,
        Einschränkung der Verarbeitung, Datenübertragbarkeit sowie ein
        Widerspruchsrecht. Zudem können Sie sich bei einer Aufsichtsbehörde
        beschweren.
      </p>

      <h2>6. Hosting</h2>
      <p>
        [Angaben zum Hosting-Anbieter und Auftragsverarbeitungsvertrag ergänzen.]
      </p>
    </LegalLayout>
  );
}
