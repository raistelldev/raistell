/*
  Schachbrett-Wrapper für die One-Page-Sektionen.
  tone="light" und tone="alt" wechseln sich ab (Schachbrett-Optik).
*/
export function Section({
  id,
  tone = "light",
  className = "",
  children,
}: {
  id: string;
  tone?: "light" | "alt" | "brand" | "dark";
  className?: string;
  children: React.ReactNode;
}) {
  const bg =
    tone === "dark"
      ? "bg-dark"
      : tone === "brand"
        ? "bg-brand"
        : tone === "alt"
          ? "bg-surface-alt"
          : "bg-page";
  return (
    <section id={id} className={`scroll-mt-24 ${bg} ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 md:py-32">
        {children}
      </div>
    </section>
  );
}

/* Einheitliche Sektions-Überschrift. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  onDark = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  onDark?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`mb-4 text-sm font-semibold uppercase tracking-widest ${
            onDark ? "text-on-dark/75" : "text-brand"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-brand text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1] ${
          onDark ? "text-on-dark" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-base leading-relaxed ${
            onDark ? "text-on-dark/85" : "text-ink-soft"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
