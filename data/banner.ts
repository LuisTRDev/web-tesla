import raw from "@/content/banner.json";
import { bool, isoDate, link, list, oneOf, rec, str, text } from "@/lib/content";
import { todayISO } from "@/lib/utils";

/**
 * AVISOS DESTACADOS: barra fina sobre el menú, para campañas ("Matrícula abierta hasta el…").
 * Se crean y programan desde el panel (/admin → Títulos, portada y aviso → Avisos). Puede haber varios;
 * cada uno tiene su color, sus fechas y las páginas donde se muestra. Si hay más de uno visible a la vez, rotan.
 */
export const BANNER_COLORS = ["amarillo", "rojo", "azul", "oscuro"] as const;
export const BANNER_PLACES = ["todas", "portada", "admision", "nosotros-propuesta", "noticias-calendario"] as const;
export type BannerColor = (typeof BANNER_COLORS)[number];
export type BannerPlace = (typeof BANNER_PLACES)[number];

export interface BannerItem {
  id: string;
  text: string;
  linkText: string;
  linkUrl: string;
  /** Primer día en que se muestra (AAAA-MM-DD). null = desde ya. */
  startDate: string | null;
  /** Último día en que se muestra. null = sin fecha de fin. */
  endDate: string | null;
  color: BannerColor;
  where: BannerPlace;
}

const r = rec(raw);
// Compatibilidad: antes había un solo aviso con los campos sueltos.
const source = Array.isArray(r.items) ? list(r.items) : r.text ? [r] : [];

export const banners: BannerItem[] = source
  .filter((item) => bool(item.enabled) && str(item.text).trim())
  .map((item, index) => ({
    id: `aviso-${index + 1}`,
    text: str(item.text).trim(),
    linkText: str(item.linkText).trim(),
    linkUrl: link(item.linkUrl) ?? "",
    startDate: text(item.startDate) ? isoDate(item.startDate) : null,
    endDate: text(item.endDate) ? isoDate(item.endDate) : null,
    color: oneOf(item.color, BANNER_COLORS, "amarillo"),
    where: oneOf(item.where, BANNER_PLACES, "todas"),
  }))
  // Los que ya terminaron no se envían al navegador.
  .filter((item) => !(item.endDate && todayISO() > item.endDate));

/** ¿Cae la página (ruta) dentro de donde se muestra el aviso? */
export function bannerMatches(place: BannerPlace, pathname: string): boolean {
  switch (place) {
    case "portada":
      return pathname === "/";
    case "admision":
      return pathname.startsWith("/admision");
    case "nosotros-propuesta":
      return ["/nosotros", "/propuesta", "/niveles", "/actividades"].some((prefix) => pathname.startsWith(prefix));
    case "noticias-calendario":
      return ["/noticias", "/calendario", "/galeria"].some((prefix) => pathname.startsWith(prefix));
    default:
      return true;
  }
}

/** ¿Está en fechas hoy? (hora de Lima) */
export function isBannerActive(item: BannerItem, today = todayISO()): boolean {
  if (item.startDate && today < item.startDate) return false;
  if (item.endDate && today > item.endDate) return false;
  return true;
}

/** ¿Debe empujar el menú hacia abajo desde la primera carga? Solo los avisos de "todas las páginas". */
export const hasGlobalBanner = (today = todayISO()) => banners.some((item) => item.where === "todas" && isBannerActive(item, today));
