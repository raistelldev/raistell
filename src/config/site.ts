/*
  ============================================================
  ZENTRALE INHALTE / KONFIGURATION
  ------------------------------------------------------------
  Firmenname, Navigation, Texte und Kontaktdaten an EINER
  Stelle. Zum Anpassen des Prototyps nur diese Datei ändern.

  ============================================================
*/

export const site = {
  name: "Raistell",
  claim: "Wir verbinden Marken mit Menschen.",
  subclaim:
    "Vermittlung zwischen Influencern und Unternehmen im Bereich der erneuerbaren Energien.",

  contact: {
    email: "kontakt@raistell.de",
    // Optionale Kontaktangaben – bei Bedarf ausfüllen.
    phone: "",
  },

  /*
    Rechtliche Angaben (Platzhalter).
    Anbieter sitzt in Bosnien und Herzegowina (außerhalb EU/EWR), die Seite
    richtet sich aber an den deutschen Markt -> deutsche Informationspflichten
    gelten (Marktortprinzip). Adresse ist die echte Geschäftsadresse im Ausland.
  */
  legal: {
    providerName: "[Vor- und Nachname / Firma]",
    street: "[Straße und Hausnummer]",
    city: "[PLZ und Ort]",
    country: "Bosnien und Herzegowina",
    registerInfo: "[Registernummer / JIB, falls vorhanden]",
    // Vertreter in der EU nach Art. 27 DSGVO (für Anbieter ohne EU-Niederlassung).
    euRepresentative: {
      name: "[Name des EU-Vertreters]",
      address: "[Anschrift in einem EU-Mitgliedstaat]",
      email: "[E-Mail des EU-Vertreters]",
    },
  },
} as const;

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Start", href: "#start" },
  { label: "Dienstleistungen", href: "#dienstleistungen" },
  { label: "Kontakt", href: "#kontakt" },
  { label: "Über uns", href: "#ueber-uns" },
];

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: "handshake" | "megaphone" | "chart" | "users";
  long: string;
  points: string[];
};

/** Inhalte für die Dienstleistungen-Sektion (Unternehmen / Creator). */
export const pilot = {
  company: {
    title: "Raistell Pilot",
    subtitle: "Ein klarer Einstieg in eine glaubwürdige Creator-Kooperation.",
    description:
      "Wir finden heraus, was Ihr Unternehmen erreichen will, wählen den passenden Creator aus und organisieren die Zusammenarbeit – von der Idee bis zur Veröffentlichung.",
    included: [
      "Ziel- und Fit-Check",
      "Auswahl und Match-Prüfung des passenden Creators",
      "Gemeinsames Briefing",
      "Klärung von Vergütung, Timing, Rechten und Freigaben",
      "Ein Ansprechpartner bis zur Veröffentlichung",
      "Kurzes Review nach dem Livegang",
    ],
    formats: [
      {
        id: "sponsoring",
        title: "Sponsoring",
        recommended: true,
        text: "Eine kurze, glaubwürdige Erwähnung Ihres Unternehmens oder Produkts. Einfach, schnell umsetzbar – der ideale Einstieg.",
      },
      {
        id: "projekt-content",
        title: "Projekt-Content",
        recommended: false,
        text: "Einblicke in eine Baustelle, Montage oder ein konkretes Kundenprojekt.",
      },
      {
        id: "vertrauensformat",
        title: "Vertrauensformat",
        recommended: false,
        text: "Kundenstimmen oder Vorher-Nachher-Formate, die echte Ergebnisse zeigen.",
      },
      {
        id: "partnerschaft",
        title: "Partnerschaft",
        recommended: false,
        text: "Regelmäßige Zusammenarbeit über mehrere Themen und einen längeren Zeitraum.",
      },
    ],
    formatsNote: "Mehr als ein Creator? Auf Anfrage möglich.",
    benefit:
      "Ihr Produkt wird sichtbar. Ihre Leistung wird verständlicher. Vertrauen entsteht über die Stimme des Creators – nicht über Werbung allein.",
    cta: "Erste Creator-Kooperation prüfen",
    ctaHref: "/?role=firma#kontakt",
  },
  creator: {
    title: "Du bleibst die Stimme deiner Community.",
    description:
      "Wir bringen dich mit Unternehmen zusammen, die zu dir passen – und übernehmen den Rahmen drumherum.",
    benefits: [
      {
        title: "Passende Anfragen",
        text: "Keine beliebigen Sponsoren. Nur Unternehmen, die geprüft wurden und zu deinem Kanal passen.",
      },
      {
        title: "Klare Bedingungen",
        text: "Vergütung, Timing, Rechte und Freigaben werden vorab geklärt – nicht erst im Nachhinein verhandelt.",
      },
      {
        title: "Volle kreative Freiheit",
        text: "Der Stil, die Sprache, die Einordnung – das bleibt bei dir.",
      },
      {
        title: "Weniger Aufwand",
        text: "Wir kümmern uns um Briefing, Kommunikation und offene Fragen.",
      },
      {
        title: "Wir sagen auch Nein",
        text: "Wenn ein Unternehmen oder ein Format nicht zu dir passt, kommt die Anfrage gar nicht erst bei dir an.",
      },
      {
        title: "Mehr als eine Kampagne",
        text: "Aus einer Kooperation kann eine echte, langfristige Partnerschaft werden.",
      },
    ],
    note: "Keine automatische Exklusivität. Keine Massenanfragen. Jede Kooperation wird einzeln geprüft.",
    cta: "Interesse anmelden",
    ctaHref: "/?role=creator#kontakt",
  },
} as const;

/** Detailseiten unter /dienstleistungen/[slug] – Formate aus dem Pilot. */
export const services: Service[] = [
  {
    slug: "sponsoring",
    title: "Sponsoring",
    description: "Klarer Einstieg",
    icon: "handshake",
    long: "Eine kurze, glaubwürdige Erwähnung Ihres Unternehmens oder Produkts. Einfach, schnell umsetzbar – der ideale Einstieg.",
    points: [
      "Schneller, klarer Einstieg",
      "Passender Creator-Fit",
      "Saubere Abstimmung von Leistung und Gegenleistung",
    ],
  },
  {
    slug: "projekt-content",
    title: "Projekt-Content",
    description: "Baustelle, Montage, Einblick",
    icon: "megaphone",
    long: "Einblicke in eine Baustelle, Montage oder ein konkretes Kundenprojekt.",
    points: [
      "Einblicke von der Baustelle und Montage",
      "Authentischer Projekt-Content",
      "Glaubwürdige Darstellung Ihrer Arbeit",
    ],
  },
  {
    slug: "vertrauensformat",
    title: "Vertrauensformat",
    description: "Kundenstimme, Vorher-Nachher",
    icon: "chart",
    long: "Kundenstimmen oder Vorher-Nachher-Formate, die echte Ergebnisse zeigen.",
    points: [
      "Kundenstimmen und Erfahrungsberichte",
      "Vorher-Nachher-Darstellungen",
      "Vertrauen durch nachvollziehbare Ergebnisse",
    ],
  },
  {
    slug: "partnerschaft",
    title: "Partnerschaft",
    description: "Regelmäßige Themen und Regionen",
    icon: "users",
    long: "Regelmäßige Zusammenarbeit über mehrere Themen und einen längeren Zeitraum.",
    points: [
      "Regelmäßige Themenplanung",
      "Regionale Schwerpunkte",
      "Kontinuierliche Zusammenarbeit",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
