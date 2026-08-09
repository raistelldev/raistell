import { site } from "@/config/site";

/* Nur Firmenname als Text – Bildmarke nur als Favicon (Tab). */
export function Logo({
  variant = "inline",
  className = "",
}: {
  variant?: "stacked" | "inline";
  className?: string;
}) {
  return (
    <a
      href="#start"
      aria-label={`${site.name} – zur Startseite`}
      className={`font-brand font-semibold tracking-tight ${
        variant === "stacked" ? "text-lg" : "text-xl"
      } ${className || "text-ink"}`}
    >
      {site.name}
    </a>
  );
}
