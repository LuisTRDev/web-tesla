/**
 * REVISIONES DE SALUD DEL SITIO (solo servidor)
 * Cosas que se pueden romper sin querer al editar desde el panel: enlaces a páginas que no existen,
 * documentos cuyo archivo falta y fotos demasiado pesadas. Las muestra el panel en Inicio (lib/pending.ts).
 */
import fs from "node:fs";
import path from "node:path";
import { banners } from "@/data/banner";
import { documents } from "@/data/documents";
import { events } from "@/data/events";
import { footerConfig, extraLinks, menuCta } from "@/data/navigation";
import { modules } from "@/data/modules";
import { allExtraPages, extraPages } from "@/data/pages-extra";
import { news } from "@/data/news";
import { levels } from "@/data/levels";
import { settings } from "@/data/settings";

const publicDir = path.join(process.cwd(), "public");

/** Rutas internas que existen hoy. */
function knownRoutes(): Set<string> {
  const routes = new Set<string>(["/", "/admision", `/admision-${settings.admissionYear}`, "/calendario", "/documentos", "/contacto"]);
  for (const section of modules) routes.add(section.href);
  for (const level of levels) routes.add(`/niveles/${level.slug}`);
  for (const post of news) routes.add(`/noticias/${post.slug}`);
  for (const page of extraPages) routes.add(`/p/${page.slug}`);
  return routes;
}

export interface BrokenLink {
  where: string;
  href: string;
  /** Motivo en palabras sencillas. */
  reason: string;
}

/** Enlaces del menú, avisos, pie de página, eventos y páginas nuevas que apuntan a algo que no existe. */
export function findBrokenLinks(): BrokenLink[] {
  const routes = knownRoutes();
  const unpublished = new Set(allExtraPages.filter((page) => !page.published).map((page) => `/p/${page.slug}`));
  const found: BrokenLink[] = [];

  const check = (where: string, href: string | null | undefined) => {
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return;
    const route = href.split(/[?#]/)[0].replace(/(.)\/+$/, "$1");
    if (route.startsWith("/qr") || route.startsWith("/admin") || route.startsWith("/images/") || route.startsWith("/documentos/")) return;
    if (routes.has(route)) return;
    found.push({ where, href, reason: unpublished.has(route) ? "esa página está en borrador" : "esa página no existe" });
  };

  for (const link of extraLinks) check(`Menú: ${link.label}`, link.href);
  for (const link of footerConfig.links) check(`Pie de página: ${link.label}`, link.href);
  check("Botón destacado del menú", menuCta.href);
  for (const banner of banners) check(`Aviso: ${banner.text.slice(0, 40)}`, banner.linkUrl);
  for (const event of events) check(`Evento: ${event.title}`, event.link);
  for (const page of allExtraPages) check(`Página: ${page.title}`, page.buttonUrl);
  return found;
}

/** Documentos publicados cuyo archivo no está en el sitio. */
export const missingDocuments = (): string[] => documents.filter((item) => !item.fileExists).map((item) => item.title);

/** Fotos y videos de public/ más pesados de lo recomendado (el mismo criterio de scripts/check-images.mjs). */
export function heavyFiles(): string[] {
  const limits: Record<string, number> = { ".jpg": 2, ".jpeg": 2, ".png": 2, ".webp": 2, ".avif": 2, ".mp4": 8, ".webm": 8 };
  const heavy: string[] = [];
  const walk = (dir: string) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stats = fs.statSync(full);
      if (stats.isDirectory()) {
        if (name !== "admin") walk(full);
        continue;
      }
      const limit = limits[path.extname(name).toLowerCase()];
      if (limit && stats.size > limit * 1024 * 1024) heavy.push(path.relative(publicDir, full).split(path.sep).join("/"));
    }
  };
  try {
    walk(path.join(publicDir, "images"));
  } catch {
    /* sin carpeta de imágenes */
  }
  return heavy;
}
