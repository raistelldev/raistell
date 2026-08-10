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
    label: "Kostenloses Erstgespräch vereinbaren",
    shortLabel: "Erstgespräch vereinbaren",
    href: "/?role=firma#kontakt",
    role: "firma" as const,
  },
  creator: {
    label: "Netzwerk beitreten",
    finalLabel: "Teil unseres Creator-Netzwerks werden",
    href: "/?role=creator#kontakt",
    role: "creator" as const,
  },
} as const;

export const navByAudience: Record<Audience, NavItem[]> = {
  firma: [
    { label: "Start", href: "#start" },
    { label: "Warum", href: "#problem" },
    { label: "Ablauf", href: "#ablauf" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontakt", href: "#kontakt" },
  ],
  creator: [
    { label: "Start", href: "#start" },
    { label: "Lösung", href: "#loesung" },
    { label: "Ablauf", href: "#ablauf" },
    { label: "FAQ", href: "#faq" },
    { label: "Kontakt", href: "#kontakt" },
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
    "Einmalige Creator-Kooperation",
    "Langfristige Creator-Zusammenarbeit",
    "Projektbegleitung mit Content",
    "Ich bin noch unsicher / Beratung",
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
  hero: {
    eyebrow: "Für Unternehmen der Energiewende",
    title: "Authentische Creator für Photovoltaik, Wärmepumpe und Smart Energy.",
    subtitle:
      "Wir verbinden Unternehmen aus den Bereichen Photovoltaik, Wärmepumpe und Smart Energy mit sorgfältig ausgewählten Creatorn, die Vertrauen schaffen und Ihre Produkte verständlich präsentieren.",
  },
  problem: {
    eyebrow: "Das Problem",
    title: "Gute Produkte allein reichen heute nicht mehr.",
    points: [
      "Menschen kaufen dort, wo Vertrauen entsteht.",
      "Klassische Werbung wird zunehmend ignoriert.",
      "Authentische Creator können komplexe Produkte verständlich erklären.",
    ],
  },
  whyCreators: {
    eyebrow: "Warum Creator?",
    title: "Werbebanner verkaufen. Creator schaffen Vertrauen.",
    ad: {
      label: "Ein Banner sagt:",
      text: "„Kauf dieses Produkt.“",
    },
    creator: {
      label: "Ein Creator sagt:",
      text: "„Lass mich dir zeigen, warum.“",
    },
  },
  whyRaistell: {
    eyebrow: "Warum Raistell?",
    title: "Wir übernehmen den gesamten Prozess.",
    points: [
      "Passende Creator finden",
      "Briefing",
      "Vertragsabwicklung",
      "Projektkoordination",
      "Qualitätssicherung",
    ],
  },
  process: {
    title: "In vier einfachen Schritten zur Creator-Kooperation.",
    steps: [
      {
        n: "01",
        title: "Erstgespräch",
        text: "Wir lernen Ihr Unternehmen, Ihre Ziele und Ihr Projekt kennen.",
      },
      {
        n: "02",
        title: "Creator Matching",
        text: "Wir wählen einen passenden Creator aus unserem Netzwerk aus.",
      },
      {
        n: "03",
        title: "Content-Produktion",
        text: "Wir koordinieren Briefing, Abstimmung und Produktion bis zur Freigabe.",
      },
      {
        n: "04",
        title: "Veröffentlichung",
        text: "Der Content geht live und Sie erhalten die vereinbarten Ergebnisse.",
      },
    ],
  },
  trust: {
    eyebrow: "Warum uns vertrauen?",
    title: "Klarer Fokus. Saubere Abläufe.",
    points: [
      "Fokus auf die Energiewende",
      "Regional passende Creator",
      "Standardisierte Briefings",
      "Strukturierte Projektabwicklung",
      "Ein laufender Ansprechpartner",
    ],
  },
  founding: {
    eyebrow: "Warum wir Raistell gegründet haben",
    title: "Weil Unternehmen und Creator oft nicht zusammenfinden.",
    text: "Während meiner Arbeit im Vertrieb der Energiewende fiel mir immer wieder auf, dass Unternehmen und Creator oft nicht zusammenfinden – obwohl beide voneinander profitieren könnten. Genau daraus entstand Raistell.",
    name: {
      title: "Woher der Name kommt",
      intro: "Ein Name, inspiriert von Verbindung über Distanz.",
      parts: [
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
      ],
      closing:
        "Aus Raisting und Telstar entstand Raistell. Die Idee dahinter bleibt bis heute dieselbe: Verbindungen schaffen, die ohne den richtigen Partner nicht entstehen würden.",
    },
  },
  faq: {
    eyebrow: "",
    title: "FAQ",
    items: [
      {
        q: "Was kostet eine Zusammenarbeit?",
        a: "Die Kosten richten sich nach dem Umfang des Projekts sowie dem ausgewählten Creator. Im kostenlosen Erstgespräch besprechen wir Ihre Ziele und erstellen eine individuelle Empfehlung.",
      },
      {
        q: "Wie werden Creator ausgewählt?",
        a: "Jeder Creator wird hinsichtlich Themengebiet, Region und Content-Qualität geprüft. So stellen wir sicher, dass Unternehmen und Creator fachlich und menschlich zusammenpassen.",
      },
      {
        q: "Wer besitzt die Nutzungsrechte?",
        a: "Die Nutzungsrechte werden vor Projektbeginn transparent vereinbart. So wissen beide Seiten von Anfang an, welche Inhalte wie verwendet werden dürfen.",
      },
      {
        q: "Wie lange dauert ein Projekt?",
        a: "Die Projektdauer hängt vom Umfang und den individuellen Anforderungen ab. Nach dem Erstgespräch erhalten Sie eine realistische Einschätzung des weiteren Ablaufs.",
      },
      {
        q: "Gibt es Mindestlaufzeiten?",
        a: "Nein. Jede Zusammenarbeit wird individuell geplant und auf die jeweiligen Projektziele abgestimmt.",
      },
      {
        q: "Was passiert, wenn aktuell kein passender Creator verfügbar ist?",
        a: "Qualität steht für uns an erster Stelle. Sollte aktuell kein passender Creator verfügbar sein, kommunizieren wir das offen und suchen gemeinsam nach einer geeigneten Lösung.",
      },
      {
        q: "Wie startet eine Zusammenarbeit?",
        a: "Die Zusammenarbeit beginnt mit einem unverbindlichen Erstgespräch. Dabei lernen wir Ihr Unternehmen und Ihre Ziele kennen und besprechen die nächsten Schritte.",
      },
    ],
  },
  closing: {
    title:
      "Lassen Sie uns unverbindlich besprechen, welche Creator zu Ihrem Unternehmen passen.",
  },
} as const;

/* ---------- Funnel: Creator ---------- */

export const creatorFunnel = {
  hero: {
    eyebrow: "Für Creator",
    title: "Finde passende Kooperationen mit Unternehmen der Energiewende.",
    subtitle:
      "Wir bringen Creator und Unternehmen zusammen, die fachlich, regional und menschlich zueinander passen.",
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
    title: "Wir bringen die richtigen Partner zusammen.",
    text: "Mit klaren Abläufen – damit du dich auf deinen Content konzentrieren kannst.",
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
        text: "Bewirb dich mit deinem Profil und deinen Kanälen.",
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
        text: "Nach erfolgreichem Projekt erhältst du deine Vergütung.",
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
        a: "Sobald ein Unternehmen zu deinem Profil passt, melden wir uns bei dir.",
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
