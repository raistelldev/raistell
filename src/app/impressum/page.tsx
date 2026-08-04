import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `Impressum – ${site.name}`,
};

export default function ImpressumPage() {
  const { legal } = site;

  return (
    <LegalLayout title="Impressum">
      <p>
        Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz). Der Anbieter hat seinen
        Sitz außerhalb der EU, die Website richtet sich an den deutschen Markt.
      </p>

      <h2>Diensteanbieter</h2>
      <p>
        {legal.providerName}
        <br />
        {legal.street}
        <br />
        {legal.city}
        <br />
        {legal.country}
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: {site.contact.email}
        {site.contact.phone ? (
          <>
            <br />
            Telefon: {site.contact.phone}
          </>
        ) : null}
      </p>

      <h2>Registereintrag / Kennnummer</h2>
      <p>{legal.registerInfo}</p>

      <h2>Umsatzsteuer</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer bzw. Steuernummer:
        <br />
        [falls vorhanden eintragen]
      </p>

      <h2>Vertreter in der EU</h2>
      <p>
        Da der Anbieter keine Niederlassung in der EU hat, ist folgende Stelle
        als Vertreter in der Europäischen Union benannt (siehe auch
        Datenschutzerklärung, Art. 27 DSGVO):
        <br />
        {legal.euRepresentative.name}
        <br />
        {legal.euRepresentative.address}
        <br />
        E-Mail: {legal.euRepresentative.email}
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
        einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </LegalLayout>
  );
}
