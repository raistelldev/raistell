/*
  Neutraler Bild-/Grafik-Platzhalter für den Prototyp.
  Später durch echte Illustration oder Foto ersetzen.
  onDark=true: Variante für grüne/dunkle Hintergründe.
*/
export function Placeholder({
  label = "Platzhalter-Grafik",
  className = "",
  ratio = "aspect-4/3",
  onDark = false,
}: {
  label?: string;
  className?: string;
  ratio?: string;
  onDark?: boolean;
}) {
  const frame = onDark
    ? "border-on-brand/25 bg-on-brand/10"
    : "border-line bg-surface-alt";
  const text = onDark ? "text-on-brand/85" : "text-ink-soft";
  const tag = onDark
    ? "bg-on-brand/15 text-on-brand/90"
    : "bg-surface/70 text-ink-soft";
  const chip = onDark
    ? "bg-on-brand/15 text-on-brand"
    : "bg-brand-soft text-brand-strong";

  return (
    <div
      className={`relative flex ${ratio} w-full items-center justify-center overflow-hidden rounded-theme border ${frame} ${className}`}
    >
      <span
        className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ${tag}`}
      >
        Platzhalter
      </span>
      <div className={`flex flex-col items-center gap-4 px-6 text-center ${text}`}>
        <span className={`flex h-14 w-14 items-center justify-center rounded-full ${chip}`}>
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 17l4.5-4 3.5 3 3-2.5L20 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
