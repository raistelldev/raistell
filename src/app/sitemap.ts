import type { MetadataRoute } from "next";
import { services } from "@/config/site";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}/dienstleistungen/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...servicePages,
  ];
}
