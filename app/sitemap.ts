import type { MetadataRoute } from "next";
import { modules } from "@/data/modules";
import { settings } from "@/data/settings";
import { tourScenes } from "@/data/tour";
import { getDocuments, getExtraPages, getLevels, getNews } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = settings.siteUrl;
  const [levels, news] = await Promise.all([getLevels(), getNews()]);

  const staticRoutes: MetadataRoute.Sitemap = ["", ...modules.map((module) => module.href)].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const hasDocuments = (await getDocuments()).some((item) => item.fileExists);
  const extraRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/calendario`, changeFrequency: "weekly", priority: 0.6 },
    ...(tourScenes.length > 0 ? [{ url: `${base}/recorrido`, changeFrequency: "monthly" as const, priority: 0.6 }] : []),
    ...(hasDocuments ? [{ url: `${base}/documentos`, changeFrequency: "monthly" as const, priority: 0.5 }] : []),
    ...(await getExtraPages()).map((page) => ({ url: `${base}/p/${page.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  return [
    ...staticRoutes,
    ...extraRoutes,
    { url: `${base}/admision-${settings.admissionYear}`, changeFrequency: "weekly" as const, priority: 0.9 },
    ...levels.map((level) => ({ url: `${base}/niveles/${level.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    // Las publicaciones de ejemplo no se envían a los buscadores.
    ...news
      .filter((post) => !post.isPlaceholder)
      .map((post) => ({ url: `${base}/noticias/${post.slug}`, lastModified: post.date, priority: 0.5 })),
  ];
}
