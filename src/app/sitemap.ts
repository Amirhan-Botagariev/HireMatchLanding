import { MetadataRoute } from "next";
import { locales } from "@/app/i18n/config";

const SITE_URL = "https://fastmatch.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [""];

  const items: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of pages) {
      const url = `${SITE_URL}/${locale}${p}`;
      items.push({
        url,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }
  return items;
}