import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

export function Logo({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/#start"
      aria-label={`${site.name} – zur Startseite`}
      className={`inline-flex items-center gap-2.5 ${className}`}
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={40}
        height={38}
        className={`h-8 w-auto md:h-9 ${onDark ? "brightness-0 invert" : ""}`}
      />
      <span
        className={`font-brand text-[0.95rem] font-semibold uppercase tracking-[0.2em] md:text-base ${
          onDark ? "text-on-dark" : "text-ink"
        }`}
      >
        {site.name}
      </span>
    </Link>
  );
}
