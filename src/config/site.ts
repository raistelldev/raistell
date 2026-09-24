/*
  ============================================================
  ZENTRALE INHALTE / KONFIGURATION
  ------------------------------------------------------------
  Firmenname, Navigation, Texte und Kontaktdaten an EINER Stelle.
  ============================================================
*/

export const site = {
  name: "Raistell",
  /** Kanonische Origin für Sitemap, robots und Metadata (ohne trailing slash). */
  url: "https://raistell.de",
  contact: {
    email: "kontakt@raistell.de",
    phone: "",
  },
  legal: {
    providerName: "[Vor- und Nachname / Firma]",
    street: "[Straße und Hausnummer]",
    city: "[PLZ und Ort]",
    country: "Bosnien und Herzegowina",
  },
} as const;

export type Audience = "firma" | "creator";

export type NavItem = { label: string; href: string };

/** Die zwei zentralen CTAs. */
export const ctas = {
  company: {
    label: "Pilotprojekt besprechen",
    shortLabel: "Projekt besprechen",
    href: "/?role=firma#kontakt",
    role: "firma" as const,
  },
  creator: {
    label: "Als Creator bewerben",
    finalLabel: "Teil unseres Creator-Netzwerks werden",
    href: "/?role=creator#kontakt",
    role: "creator" as const,
  },
} as const;

export const navByAudience: Record<Audience, NavItem[]> = {
  firma: [
    { label: "Start", href: "#start" },
    { label: "Pilotangebot", href: "#pilot" },
    { label: "Leistungen", href: "#leistungen" },
    { label: "Ablauf", href: "#ablauf" },
    { label: "FAQ", href: "#faq" },
    { label: "Über uns", href: "#ueber-uns" },
  ],
  creator: [
    { label: "Start", href: "#start" },
    { label: "Lösung", href: "#loesung" },
    { label: "Ablauf", href: "#ablauf" },
    { label: "Kontakt", href: "#kontakt" },
    { label: "FAQ", href: "#faq" },
    { label: "Über uns", href: "#ueber-uns" },
  ],
};

/** @deprecated – Footer/Header nutzen navByAudience; Fallback für Legacy. */
export const navItems = navByAudience.firma;

export const formOptions = {
  platforms: ["Instagram", "YouTube", "TikTok", "LinkedIn", "Andere"] as const,
  followerRanges: [
    "unter 10.000",
    "10.000–50.000",
    "50.000–100.000",
    "über 100.000",
  ] as const,
  seeking: [
    "Website und Verkaufsgespräche",
    "Eigene Social-Media-Kanäle",
    "Bezahlte Werbung",
    "Veröffentlichung beim Creator",
    "Noch offen / Beratung gewünscht",
  ] as const,
  budgets: [
    "Noch offen / Beratung gewünscht",
    "Bis 2.500 €",
    "2.500–5.000 €",
    "5.000–10.000 €",
    "Über 10.000 €",
  ] as const,
} as const;

/* ---------- Funnel: Unternehmen ---------- */

export const companyFunnel = {
  "hero": {
    "eyebrow": "Creator-Inhalte für PV, Wärmepumpe und Smart Energy",
    "title": "Machen Sie Ihre Energieprojekte verständlich.",
    "subtitle": "Raistell entwickelt mit passenden Creatorn Videos aus echten Projekten – für Ihre Website, Werbung und Verkaufsgespräche. Ein klares Thema. Ein abgestimmter Umfang. Ein fester Ansprechpartner."
  },
  "pilot": {
    "eyebrow": "Das Pilotangebot",
    "title": "Ein echtes Projekt. Vier Videos mit klarer Aufgabe.",
    "intro": "Beginnen Sie mit einer Frage, die Ihre Interessenten vor der Entscheidung beschäftigt. Wir machen daraus Inhalte, die Sie im Alltag Ihres Unternehmens einsetzen können.",
    "points": [
      "Ein Briefing zu Zielgruppe, Thema und Einsatz",
      "Auswahl und Koordination eines passenden Creators",
      "Ein Hauptvideo und drei daraus geschnittene Kurzvideos",
      "Eine gebündelte Korrekturrunde zum vereinbarten Briefing",
      "Übergabe der freigegebenen Dateien in den vereinbarten Formaten"
    ],
    "scope": "Ein Projekt als Ausgangspunkt. Videolängen, Drehort, Anreise, Formate und Nutzungsrechte legen wir im Angebot fest. Zusätzliche Drehs, Varianten und Veröffentlichungen werden separat vereinbart.",
    "budgetTitle": "Sie kennen den Umfang und die Gesamtkosten vor dem Start.",
    "budgetText": "Das Angebot weist Raistells Leistung sowie Produktion, Creator-Honorar und vereinbarte Nutzungsrechte nachvollziehbar aus. Ein mögliches Werbebudget betrachten wir separat."
  },
  "uses": [
    {
      "title": "Vor der Beratung",
      "text": "Beantworten Sie wiederkehrende Fragen schon vor dem ersten Gespräch.",
      "channel": "Website & Terminvorbereitung"
    },
    {
      "title": "Nach dem Angebot",
      "text": "Zeigen Sie Interessenten, wie die Umsetzung bei einem echten Kunden aussieht.",
      "channel": "Vertrieb & Angebotsnachfassung"
    },
    {
      "title": "In Ihrer Werbung",
      "text": "Nutzen Sie verständliche Videoausschnitte in bestehenden Kampagnen – mit den passenden Rechten.",
      "channel": "Social Media & Anzeigen"
    }
  ],
  "services": [
    {
      "number": "01",
      "label": "Die Basis",
      "title": "Inhalte für Ihr Unternehmen",
      "text": "Ein Creator erklärt Ihr Projekt oder stellt Fragen an Kunden und Fachleute. Sie erhalten die vereinbarten Videos für Ihre eigenen Kanäle.",
      "detail": "Kanäle, Formate und Nutzungszeitraum stehen im Angebot."
    },
    {
      "number": "02",
      "label": "Optional ergänzen",
      "title": "Veröffentlichung beim Creator",
      "text": "Soll der Inhalt auch auf dem Creator-Profil erscheinen, prüfen wir die tatsächliche Zielgruppe und vereinbaren die Veröffentlichung gesondert.",
      "detail": "Für regionale Projekte zählt die Region des Publikums."
    },
    {
      "number": "03",
      "label": "Den Einsatz mitdenken",
      "title": "Videos für bezahlte Werbung",
      "text": "Wir berücksichtigen die geplante Werbenutzung bei Inhalt, Format und Rechten. Ihre Anzeigen schalten Sie oder Ihre betreuende Agentur.",
      "detail": "Werbebudget und Anzeigenbetreuung sind nicht automatisch enthalten."
    }
  ],
  "process": {
    "title": "Von der ersten Frage zum einsetzbaren Video.",
    "steps": [
      {
        "n": "01",
        "title": "Ziel klären",
        "text": "Wen möchten Sie erreichen? Welches Projekt können Sie zeigen? Wo sollen die Inhalte eingesetzt werden?"
      },
      {
        "n": "02",
        "title": "Umfang abstimmen",
        "text": "Sie erhalten einen Vorschlag für Inhalt und Creator sowie ein Angebot mit den Gesamtkosten."
      },
      {
        "n": "03",
        "title": "Produzieren & freigeben",
        "text": "Wir koordinieren die Produktion. Sie prüfen die fachlichen Angaben und geben gebündeltes Feedback."
      },
      {
        "n": "04",
        "title": "Einsetzen & weiterdenken",
        "text": "Sie erhalten die freigegebenen Dateien. Wir besprechen den Einsatz und mögliche nächste Themen."
      }
    ]
  },
  "faq": {
    "eyebrow": "Gut zu wissen",
    "title": "Ihre Fragen vor dem ersten Projekt.",
    "items": [
      {
        "q": "Für welche Unternehmen eignet sich das Pilotangebot?",
        "a": "Für Unternehmen aus Photovoltaik, Wärmepumpe und Smart Energy, die ihre Lösungen an einem konkreten Projekt erklären möchten. Ein guter Ausgangspunkt sind ein vorzeigbares Projekt, die erforderlichen Einverständnisse der Mitwirkenden und ein geplanter Einsatz für die Videos."
      },
      {
        "q": "Was kostet ein Pilotprojekt?",
        "a": "Produktion, Mitwirkende, Drehort und Nutzungsrechte bestimmen das Budget. Nach dem ersten Gespräch erhalten Sie ein Angebot mit dem konkreten Umfang und den Gesamtkosten. Creator-Honorar, zusätzliche Leistungen und ein mögliches Werbebudget werden transparent abgegrenzt."
      },
      {
        "q": "Müssen wir ein fertiges Konzept mitbringen?",
        "a": "Nein. Hilfreich sind ein geeignetes Projekt und Fragen, die Ihre Interessenten häufig stellen. Daraus entwickeln wir das Thema und stimmen den Umfang ab."
      },
      {
        "q": "Veröffentlicht der Creator die Videos auf seinem Profil?",
        "a": "Nur wenn es ausdrücklich vereinbart ist. Für eine Veröffentlichung prüfen wir zusätzlich, ob das Publikum des Creators zur Zielgruppe und gegebenenfalls zur Region passt. Die Produktion für Ihre eigenen Kanäle kann unabhängig davon beauftragt werden."
      },
      {
        "q": "Dürfen wir die Videos für Werbung nutzen?",
        "a": "Wenn die entsprechenden Nutzungsrechte vereinbart wurden. Nennen Sie den geplanten Einsatz bereits in Ihrer Anfrage. Kanäle, Zeitraum und weitere Bedingungen halten wir vor Projektbeginn fest."
      },
      {
        "q": "Wie lange dauert ein Projekt?",
        "a": "Das hängt unter anderem vom Drehort, den Mitwirkenden und den Freigaben ab. Den Zeitplan vereinbaren wir mit dem Projektumfang. Das Pilotangebot sieht eine gebündelte Korrekturrunde zum abgestimmten Briefing vor."
      },
      {
        "q": "Was wird im Pilot ausgewertet?",
        "a": "Wir betrachten, wie Sie die Inhalte einsetzen und welche Fragen sie beantworten. Reichweite, Anfragen oder Verkäufe lassen sich nur mit passender Ausspielung und verfügbaren Messdaten bewerten. Solche Ergebnisse sind keine garantierte Leistung des Produktionspakets."
      }
    ]
  }
} as const;

/* ---------- Funnel: Creator ---------- */

export const creatorFunnel = {
  hero: {
    eyebrow: "Für Creator",
    title: "Zeige, wie Energielösungen im echten Leben funktionieren.",
    subtitle:
      "Du erklärst gern, stellst gute Fragen oder setzt Projekte verständlich in Szene? Bei Raistell geht es um Inhalte für Unternehmen und – wenn es passt – um Veröffentlichungen auf deinem Kanal.",
  },
  problem: {
    eyebrow: "Das Problem",
    title: "Die richtigen Kooperationen sind schwer zu finden.",
    points: [
      "Viele Anfragen passen nicht zu deinem Content.",
      "Unklare Briefings machen Projekte unnötig kompliziert.",
      "Faire und langfristige Kooperationen sind selten.",
    ],
  },
  solution: {
    eyebrow: "Unsere Lösung",
    title: "Gute Inhalte zählen. Passende Reichweite kann dazukommen.",
    text: "Für die reine Videoproduktion zählt die Qualität deiner Arbeit. Für Veröffentlichungen auf deinem Profil prüfen wir zusätzlich dein Publikum. Beide Leistungen stimmen wir vor jedem Projekt getrennt mit dir ab.",
  },
  whyRaistell: {
    eyebrow: "Warum Raistell?",
    title: "Was du von uns bekommst.",
    points: [
      "Unternehmen aus der Energiewende",
      "Passende Kooperationen statt Massenanfragen",
      "Klare Briefings",
      "Strukturierte Kommunikation",
      "Transparente Abläufe",
      "Ein Ansprechpartner",
    ],
  },
  process: {
    eyebrow: "So wirst du Teil unseres Netzwerks",
    title: "Von der Bewerbung bis zur Auszahlung.",
    steps: [
      {
        n: "01",
        title: "Bewerbung",
        text: "Bewirb dich mit deinem Profil oder Portfolio und passenden Arbeitsproben.",
      },
      {
        n: "02",
        title: "Kennenlernen",
        text: "Wir prüfen, ob dein Content zu unserem Netzwerk passt.",
      },
      {
        n: "03",
        title: "Aufnahme",
        text: "Nach erfolgreichem Gespräch wirst du Teil des Netzwerks.",
      },
      {
        n: "04",
        title: "Projekte",
        text: "Wir vermitteln passende Kooperationen.",
      },
      {
        n: "05",
        title: "Produktion",
        text: "Du produzierst den Content nach dem Briefing.",
      },
      {
        n: "06",
        title: "Auszahlung",
        text: "Honorar, Leistung und Zahlungsbedingungen werden vor jedem Projekt vereinbart.",
      },
    ],
  },
  seeking: {
    eyebrow: "Wen wir suchen",
    title: "Wir suchen Creator, die …",
    points: [
      "authentisch auftreten",
      "hochwertige Inhalte produzieren",
      "Interesse an erneuerbaren Energien haben",
      "langfristige Partnerschaften schätzen",
    ],
  },
  faq: {
    eyebrow: "",
    title: "FAQ",
    items: [
      {
        q: "Muss ich exklusiv mit Raistell arbeiten?",
        a: "Nein. Du entscheidest selbst, welche Kooperationen du annimmst.",
      },
      {
        q: "Kostet die Aufnahme etwas?",
        a: "Nein. Die Aufnahme in unser Netzwerk ist kostenlos.",
      },
      {
        q: "Muss ich jedes Projekt annehmen?",
        a: "Nein. Du entscheidest selbst, welche Projekte zu dir passen.",
      },
      {
        q: "Wann bekomme ich Anfragen?",
        a: "Wir melden uns, wenn ein Projekt zu deinem Profil passt. Eine Bewerbung ist keine Zusage für Aufträge.",
      },
      {
        q: "Wie werde ich bezahlt?",
        a: "Die Vergütung wird vor jedem Projekt transparent vereinbart.",
      },
    ],
  },
  closing: {
    title: "Teil unseres Creator-Netzwerks werden",
    text: "Bewirb dich unverbindlich – wir melden uns, wenn es passt.",
  },
} as const;

/* ---------- Über uns (beide Funnels) ---------- */

export const about = {
  eyebrow: "Über uns",
  title: "Energie verständlich machen. Zusammenarbeit persönlich halten.",
  paragraphs: [
    "Die Idee zu Raistell entstand aus praktischer Erfahrung im Vertrieb der Energiewende. Gute Lösungen brauchen verständliche Erklärungen – und Menschen, die die richtigen Fragen stellen.",
    "Deshalb beginnt jedes Projekt mit Zuhören: Was möchten Ihre Kunden wissen? Was lässt sich an einem echten Projekt zeigen? Wir bringen Ihr Unternehmen und passende Creator zusammen und koordinieren die Umsetzung.",
    "Sie haben einen festen Ansprechpartner und wissen vor dem Start, welche Inhalte entstehen und wie Sie diese einsetzen können. Creator erhalten ein klares Briefing und Raum für ihre eigene, glaubwürdige Perspektive.",
  ],
  name: {
    title: "Wie der Name Raistell entstand",
    intro: "Ein Name, inspiriert von Verbindung über Distanz.",
    lead: "Bei der Suche nach einem Namen wollten wir kein beliebiges Kunstwort. Der Name sollte die Aufgabe von Raistell in sich tragen: die richtigen Menschen so miteinander zu verbinden, dass aus einem Kontakt eine vertrauensvolle Zusammenarbeit entstehen kann.",
    inspiration:
      "Die Inspiration dafür fanden wir in der Geschichte der Satellitenkommunikation.",
    parts: [
      {
        title: "Raisting",
        text: "Raisting ist ein deutscher Ort mit einer besonderen Rolle in dieser Geschichte. Dort wurde Deutschlands erste kommerziell betriebene Satelliten-Bodenstation errichtet – geschaffen, um Signale über große Entfernungen zu empfangen und Menschen einander näherzubringen.",
      },
      {
        title: "Telstar",
        text: "Telstar war ein früher Kommunikationssatellit, der Fernsehsignale zwischen Europa und Nordamerika übertrug. Selbst seine Oberfläche trug ein Detail, das beinahe wie eine leise Verbindung zu unserer heutigen Arbeit wirkt: Sie war mit Solarzellen bedeckt.",
      },
    ],
    formed: "Aus Raisting und Telstar entstand Raistell.",
    meaning:
      "Was damals Signale über Kontinente hinweg verband, steht heute sinnbildlich für unsere Arbeit: Unternehmen der Energiewende und glaubwürdige Creator sollen sich nicht nur finden, sondern wirklich zueinander passen.",
    closer: "Denn die richtige Verbindung kann mehr schaffen als Aufmerksamkeit.",
    tagline: "Aus Vertrauen wird Wirkung.",
  },
} as const;

/* Detailseiten Formate (Legacy / /dienstleistungen/[slug]) */

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: "handshake" | "megaphone" | "chart" | "users";
  long: string;
  points: string[];
};

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
