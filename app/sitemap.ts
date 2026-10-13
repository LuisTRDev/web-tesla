import type { MetadataRoute } from "next";
import { modules } from "@/data/modules";
import { settings } from "@/data/settings";
import { getLevels, getNews } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = settings.siteUrl;
  const [levels, news] = await Promise.all([getLevels(), getNews()]);

  const staticRoutes: MetadataRoute.Sitemap = ["", ...modules.map((module) => module.href)].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...levels.map((level) => ({ url: `${base}/niveles/${level.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    // Las publicaciones de ejemplo no se envían a los buscadores.
    ...news
      .filter((post) => !post.isPlaceholder)
      .map((post) => ({ url: `${base}/noticias/${post.slug}`, lastModified: post.date, priority: 0.5 })),
  ];
}
