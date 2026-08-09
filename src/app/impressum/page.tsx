import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { getImpressum } from "@/lib/db";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum und Anbieterkennzeichnung von ${site.name}.`,
  alternates: { canonical: "/impressum" },
};

export const dynamic = "force-dynamic";

export default async function ImpressumPage() {
  const legal = await getImpressum();

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
        E-Mail: {legal.email}
        {legal.phone ? (
          <>
            <br />
            Telefon: {legal.phone}
          </>
        ) : null}
      </p>

      <h2>Registereintrag / Kennnummer</h2>
      <p>{legal.registerInfo}</p>

      <h2>Umsatzsteuer</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer bzw. Steuernummer:
        <br />
        {legal.vatInfo}
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
