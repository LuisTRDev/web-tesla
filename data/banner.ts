import raw from "@/content/banner.json";
import { bool, isoDate, rec, str, text } from "@/lib/content";
import { todayISO } from "@/lib/utils";

/**
 * AVISO DESTACADO: barra fina sobre el menú, para campañas ("Matrícula abierta hasta el…").
 * Se activa y se programa desde el panel (/admin → Páginas y textos → Aviso destacado).
 */
const r = rec(raw);

export const banner = {
  enabled: bool(r.enabled),
  text: str(r.text),
  linkText: str(r.linkText),
  linkUrl: str(r.linkUrl),
  /** Primer día en que se muestra (AAAA-MM-DD). Vacío = desde ya. */
  startDate: text(r.startDate) ? isoDate(r.startDate) : null,
  /** Último día en que se muestra. Vacío = sin fecha de fin. */
  endDate: text(r.endDate) ? isoDate(r.endDate) : null,
};

/** ¿Debe mostrarse hoy? (hora de Lima) */
export function isBannerActive(today = todayISO()): boolean {
  if (!banner.enabled || !banner.text) return false;
  if (banner.startDate && today < banner.startDate) return false;
  if (banner.endDate && today > banner.endDate) return false;
  return true;
}
