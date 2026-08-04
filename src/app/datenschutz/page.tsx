import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `Datenschutzerklärung – ${site.name}`,
};

export default function DatenschutzPage() {
  const { legal } = site;

  return (
    <LegalLayout title="Datenschutzerklärung">
      <h2>1. Datenschutz auf einen Blick</h2>
      <p>
        Der Schutz Ihrer persönlichen Daten ist uns wichtig. Auch wenn der
        Anbieter außerhalb der EU sitzt, richtet sich das Angebot an Personen in
        Deutschland. Daher gilt die Datenschutz-Grundverordnung (DSGVO) gemäß
        Art. 3 Abs. 2 DSGVO (Marktortprinzip).
      </p>

      <h2>2. Verantwortliche Stelle</h2>
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

      <h2>3. Vertreter in der EU (Art. 27 DSGVO)</h2>
      <p>
        Da die verantwortliche Stelle keine Niederlassung in der Europäischen
        Union hat, ist gemäß Art. 27 DSGVO folgender Vertreter in der EU benannt:
        <br />
        {legal.euRepresentative.name}
        <br />
        {legal.euRepresentative.address}
        <br />
        E-Mail: {legal.euRepresentative.email}
      </p>

      <h2>4. Erhebung und Speicherung personenbezogener Daten</h2>
      <p>
        Wenn Sie unser Kontaktformular nutzen, verarbeiten wir die von Ihnen
        angegebenen Daten (z. B. Name, E-Mail-Adresse und Angaben zu Ihrer
        Rolle) ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. a und b DSGVO.
      </p>

      <h2>5. Terminbuchung</h2>
      <p>
        Für die Vereinbarung von Terminen ist die Einbindung eines externen
        Dienstes (z. B. Calendly) vorgesehen. Sobald dieser aktiv ist, werden die
        dortigen Datenschutzhinweise sowie die Grundlage einer etwaigen
        Datenübermittlung in Drittländer hier ergänzt.
      </p>

      <h2>6. Cookies</h2>
      <p>
        Diese Website verwendet ausschließlich technisch notwendige Cookies.
        Nicht notwendige Cookies werden nur mit Ihrer Einwilligung gesetzt.
      </p>

      <h2>7. Ihre Rechte</h2>
      <p>
        Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung,
        Einschränkung der Verarbeitung, Datenübertragbarkeit sowie ein
        Widerspruchsrecht. Zudem können Sie sich bei einer Aufsichtsbehörde
        beschweren.
      </p>

      <h2>8. Hosting</h2>
      <p>
        [Angaben zum Hosting-Anbieter und Auftragsverarbeitungsvertrag ergänzen.]
      </p>
    </LegalLayout>
  );
}
