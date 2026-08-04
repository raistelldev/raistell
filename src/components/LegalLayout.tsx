/* Einheitliches Layout für rechtliche Unterseiten. */
export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <a href="/" className="text-sm font-medium text-brand hover:text-brand-strong">
        ← Zurück zur Startseite
      </a>
      <h1 className="mt-4 font-brand text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {title}
      </h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_strong]:text-ink">
        {children}
      </div>
      <p className="mt-12 rounded-theme border border-line bg-surface-alt p-4 text-xs text-ink-soft">
        Hinweis: Platzhalter-Text für den Prototyp. Vor der Veröffentlichung
        durch rechtsverbindliche Angaben (z. B. anwaltlich geprüft) ersetzen.
      </p>
    </main>
  );
}
