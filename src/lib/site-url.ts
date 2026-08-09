import { site } from "@/config/site";

/** Absolute Site-URL ohne trailing slash (Env überschreibt Config). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  return fromEnv || site.url;
}
