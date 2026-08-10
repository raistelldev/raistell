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
    </LegalLayout>
  );
}
