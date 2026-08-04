import type { Service } from "@/config/site";

/* Schlichte Linien-Icons für die Dienstleistungen. */
export function ServiceIcon({
  name,
  className = "",
}: {
  name: Service["icon"];
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "handshake":
      return (
        <svg {...common}>
          <path d="M8 13l2.5 2.5a1.5 1.5 0 002 .1L17 12" />
          <path d="M3 8l3-1 5 4M21 8l-3-1-4 3" />
          <path d="M14 6l-2 1-2-1" />
        </svg>
      );
    case "megaphone":
      return (
        <svg {...common}>
          <path d="M4 10v4a1 1 0 001 1h2l8 4V5L7 9H5a1 1 0 00-1 1z" />
          <path d="M18 9a3 3 0 010 6" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 20V4M4 20h16" />
          <path d="M8 16v-3M12 16V8M16 16v-6" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="3" />
          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a3 3 0 010 5.74" />
        </svg>
      );
  }
}
