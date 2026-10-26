import raw from "@/content/navegacion.json";
import { navModules } from "@/data/modules";
import { bool, link, list, rec, str } from "@/lib/content";
import type { NavLink } from "@/types";

/**
 * MENÚ Y PIE DE PÁGINA. Se editan desde el panel (/admin → Personalizar la web → Menú y pie de página).
 * El menú principal es: Inicio, las secciones que no se ocultaron y los enlaces extra que se añadieron.
 */
const r = rec(raw);
const cta = rec(r.cta);
const footer = rec(r.footer);

const toLink = (entry: Record<string, unknown>): NavLink | null => {
  const href = link(entry.href);
  const label = str(entry.label).trim();
  return href && label ? { label, href } : null;
};

/** Enlaces extra del menú (páginas nuevas, documentos, enlaces externos). */
export const extraLinks: NavLink[] = list(r.extraLinks).map(toLink).filter((entry): entry is NavLink => entry !== null);

export const navLinks: NavLink[] = [{ label: "Inicio", href: "/" }, ...navModules.map((module) => ({ label: module.label, href: module.href })), ...extraLinks];

export const menuCta = {
  show: bool(cta.show, true),
  label: str(cta.label, "Admisiones") || "Admisiones",
  href: link(cta.href) ?? "/admision",
};

export const footerConfig = {
  showExplore: bool(footer.showExplore, true),
  links: list(footer.links).map(toLink).filter((entry): entry is NavLink => entry !== null),
  legalText: str(footer.legalText).trim(),
  showWatermark: bool(footer.showWatermark, true),
};
