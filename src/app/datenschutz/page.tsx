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
      <p className="rounded-xl border border-brand/20 bg-brand/5 p-4">
        <strong>Entwurf zur Prüfung.</strong> Diese Fassung beschreibt die
        vorgesehenen Datenverarbeitungen. Rechtsgrundlagen, ergänzende Speicherfristen,
        Dienstleistervereinbarungen und mögliche internationale
        Datenübermittlungen sind vor der Veröffentlichung zu vervollständigen.
      </p>
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
        E-Mail:{" "}
        <a className="text-brand underline" href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
      </p>

      <h2>2. Projektanfragen und Creator-Bewerbungen</h2>
      <p>
        Über unsere Formulare können Sie eine Projektanfrage oder
        Creator-Bewerbung übermitteln. Wir verarbeiten Ihre Kontaktdaten und die
        von Ihnen angegebenen Projekt- beziehungsweise Profildaten, um Ihre
        Anfrage zu bearbeiten und eine mögliche Zusammenarbeit zu prüfen.
        Dazu gehören je nach Formular etwa Unternehmen, Ansprechpartner,
        E-Mail-Adresse, geplanter Einsatz, Profil-Link, Region und gewünschte
        Kooperationsart sowie freiwillige Angaben.
      </p>
      <p>
        Die Angaben werden in einer Datenbank bei Neon gespeichert und über
        einen geschützten Verwaltungsbereich bearbeitet. Für Anfragen und
        Creator-Profile ohne zustande gekommene Zusammenarbeit ist eine
        Aufbewahrung von sechs Monaten ab Eingang vorgesehen. Creator-Profile
        werden in diesem Zeitraum auch zur Prüfung passender Projekte genutzt.
        Ein Kennenlerngespräch allein hebt diese Frist nicht auf. Eine frühere
        Löschung, insbesondere bei Wegfall des Zwecks oder einem berechtigten
        Löschverlangen, bleibt möglich.
      </p>
      <p>
        Kommt eine Zusammenarbeit zustande, sind die erforderlichen Projekt-
        und Vertragsdaten nach den dafür geltenden Zwecken und gesetzlichen
        Aufbewahrungspflichten zu behandeln. Die dafür konkreten Fristen sind
        noch gesondert festzulegen. Der tägliche Löschlauf für erfolglose
        Anfragen ist technisch vorbereitet, aber in dieser Vorschau noch nicht
        aktiviert. Die Frist muss auch bei Exporten und zugehörigen Daten in
        anderen Diensten berücksichtigt werden.
      </p>

      <h2>3. Website und E-Mail-Kontakt</h2>
      <p>
        Für den Betrieb der Website ist Netlify vorgesehen. Beim Aufruf der
        Website werden technisch erforderliche Verbindungsdaten, darunter die
        IP-Adresse, an den Hosting-Dienst übermittelt. Die konkreten
        Protokollierungs- und Löschfristen sind noch zu prüfen.
      </p>
      <p>
        Für die Domain wird united-domains genutzt. Für die E-Mail-Kommunikation
        ist Google Workspace vorgesehen. Bei Kontakt per E-Mail werden Ihre
        Absenderadresse und der Nachrichteninhalt zur Bearbeitung Ihres
        Anliegens verarbeitet. Google Workspace muss noch reaktiviert und die
        Erreichbarkeit von {site.contact.email} vor dem Start bestätigt werden.
      </p>

      <h2>4. Geplante Terminbuchung</h2>
      <p>
        Eine direkte Verlinkung zu Calendly ist für den Live-Start geplant,
        in dieser Vorschau aber noch nicht eingerichtet. Es ist kein Kalender
        eingebettet. Formulardaten werden nicht zur Vorausfüllung an Calendly
        übergeben.
      </p>
      <p>
        Vor Aktivierung der Buchungslinks sind diese Hinweise auf die
        tatsächliche Einrichtung abzustimmen. Informationen zum vorgesehenen
        Dienst stehen in den{" "}
        <a className="text-brand underline" href="https://calendly.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">
          Datenschutzhinweisen von Calendly
        </a>.
      </p>
      <p>
        Künftige Buchungen bei Calendly und Einträge in einem verbundenen
        Kalender werden nicht automatisch von der Löschfunktion unserer
        Anfragedatenbank erfasst. Dienstleistervereinbarungen, gesonderte
        Löschabläufe und mögliche internationale Übermittlungen sind vor
        der Nutzung zu klären.
      </p>

      <h2>5. Speicherung im Browser</h2>
      <p>
        Die Auswahl zwischen Unternehmen und Creator wird in der
        Seitenadresse festgehalten. Unsere Formulare legen Name und
        E-Mail-Adresse nicht zur Kalender-Vorausfüllung im Browser ab.
        Für die Anmeldung im Verwaltungsbereich wird ein Sitzungscookie mit
        einer Gültigkeit von sieben Tagen verwendet.
      </p>

      <h2>6. Noch zu vervollständigen</h2>
      <p>
        Die endgültige Erklärung muss die jeweils anwendbaren Rechtsgrundlagen,
        Speicherfristen, genauen Dienstleister und Empfänger, Regelungen zu
        internationalen Datenübermittlungen sowie die Betroffenenrechte und
        zuständigen Beschwerdestellen benennen. Dabei sind der Betreiberstandort
        in Bosnien und Herzegowina und die Ausrichtung des Angebots auf den
        EU-Raum zu berücksichtigen. Diese Punkte sind noch nicht abschließend
        geprüft.
      </p>
    </LegalLayout>
  );
}
