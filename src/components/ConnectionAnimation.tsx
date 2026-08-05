/**
 * Animiertes SVG-Verbindungsmotiv:
 * Raistell (Diamant) verbindet Unternehmen und Creator.
 */
export function ConnectionAnimation({ className = "" }: { className?: string }) {
  return (
    <div
      className={`connection-anim mx-auto w-full max-w-xl sm:max-w-3xl md:max-w-none md:scale-125 md:origin-center ${className}`}
    >
      <svg
        viewBox="0 0 760 420"
        className="block h-auto w-full overflow-visible text-brand"
        role="img"
        aria-label="Raistell verbindet Unternehmen und Creator"
      >
        <defs>
          <path id="conn-path-left" d="M380 130 L155 295" fill="none" />
          <path id="conn-path-right" d="M380 130 L605 295" fill="none" />
        </defs>

        {/* Gestrichelte Verbindungslinien */}
        <use
          href="#conn-path-left"
          className="fill-none stroke-brand"
          strokeWidth="2.5"
          strokeDasharray="8 8"
        />
        <use
          href="#conn-path-right"
          className="fill-none stroke-brand"
          strokeWidth="2.5"
          strokeDasharray="8 8"
        />

        {/* Laufende Punkte */}
        <circle className="connection-dot fill-brand" r="7">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="0s">
            <mpath href="#conn-path-left" />
          </animateMotion>
        </circle>
        <circle className="connection-dot fill-brand" r="7">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.1s">
            <mpath href="#conn-path-right" />
          </animateMotion>
        </circle>

        {/* Unternehmen – links */}
        <g transform="translate(155 295)">
          <circle className="connection-pulse connection-pulse-a stroke-brand" r="102" />
          <circle r="94" className="fill-page stroke-ink" strokeWidth="3" />
          <text
            y="-12"
            textAnchor="middle"
            className="fill-ink font-brand text-[22px] font-bold"
          >
            Unternehmen
          </text>
          <text
            y="18"
            textAnchor="middle"
            className="fill-ink-soft font-sans text-[15px] font-semibold"
          >
            geprüft &amp; passend
          </text>
        </g>

        {/* Creator – rechts */}
        <g transform="translate(605 295)">
          <circle className="connection-pulse connection-pulse-b stroke-brand" r="102" />
          <circle r="94" className="fill-page stroke-brand" strokeWidth="3" />
          <text
            y="-12"
            textAnchor="middle"
            className="fill-ink font-brand text-[22px] font-bold"
          >
            Creator
          </text>
          <text
            y="18"
            textAnchor="middle"
            className="fill-ink-soft font-sans text-[15px] font-semibold"
          >
            ausgewählt &amp; passend
          </text>
        </g>

        {/* Raistell – Diamant oben mittig */}
        <g transform="translate(380 130)">
          <text
            y="-68"
            textAnchor="middle"
            className="fill-on-dark font-brand text-lg font-bold uppercase tracking-[0.16em]"
          >
            raistell
          </text>
          <rect
            x="-42"
            y="-42"
            width="84"
            height="84"
            rx="10"
            className="fill-ink stroke-brand"
            strokeWidth="3"
            transform="rotate(45)"
          />
        </g>
      </svg>
    </div>
  );
}
