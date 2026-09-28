import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Betreiber- und Kontaktangaben von ${site.name}.`,
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  const { legal } = site;

  return (
    <LegalLayout title="Impressum">
      <p className="rounded-xl border border-brand/20 bg-brand/5 p-4">
        <strong>Entwurf zur Prüfung.</strong> Vor der Veröffentlichung sind der
        Unternehmensstatus, die erforderlichen Anbieterangaben und die
        Erreichbarkeit der Kontaktadresse abschließend zu klären.
      </p>

      <h2>Betreiber</h2>
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
        E-Mail:{" "}
        <a className="text-brand underline" href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
      </p>
    </LegalLayout>
  );
}
