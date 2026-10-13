import type { MetadataRoute } from "next";
import { settings } from "@/data/settings";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${settings.siteUrl}/sitemap.xml`,
  };
}
