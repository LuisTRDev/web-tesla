import raw from "@/content/levels.json";
import type { Level } from "@/types";
import { bool, list, rec, str, strings, text } from "@/lib/content";

/**
 * Niveles educativos: el colegio ofrece Primaria y Secundaria. Se editan desde el panel (/admin → Niveles).
 * No se inventan grados: si `grades` está vacío se muestra "por confirmar".
 */
export const levels: Level[] = list(rec(raw).items).map((item, index) => {
  const grades = strings(item.grades);
  const name = str(item.name);
  return {
    slug: str(item.slug, name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || `nivel-${index + 1}`),
    name,
    summary: str(item.summary),
    description: str(item.description),
    grades: grades.length > 0 ? grades : null,
    image: text(item.image),
    confirmed: bool(item.confirmed),
  };
});
