import raw from "@/content/portada.json";
import { bool, list, rec, str } from "@/lib/content";

/**
 * ORDEN DE LA PORTADA. Después de la presentación (hero), la portada muestra estas secciones en este orden.
 * Se ordena y se muestra u oculta desde el panel (/admin → Personalizar la web → Orden de la portada).
 */
export const HOME_SECTIONS = ["modulos", "eventos", "noticias", "testimonios", "logros", "documentos", "preguntas", "admision"] as const;
export type HomeSectionId = (typeof HOME_SECTIONS)[number];

/** Lo que se muestra si la sección no aparece en el panel (por ejemplo, una sección añadida después). */
const defaultShown: Record<HomeSectionId, boolean> = { modulos: true, eventos: false, noticias: true, testimonios: false, logros: false, documentos: false, preguntas: false, admision: true };

const configured = list(rec(raw).sections)
  .map((entry) => ({ id: str(entry.id) as HomeSectionId, show: bool(entry.show, true) }))
  .filter((entry, index, all) => HOME_SECTIONS.includes(entry.id) && all.findIndex((other) => other.id === entry.id) === index);

const missing = HOME_SECTIONS.filter((id) => !configured.some((entry) => entry.id === id)).map((id) => ({ id, show: defaultShown[id] }));

/** Secciones de la portada, en orden, con su estado (visible u oculta). */
export const homeSections: Array<{ id: HomeSectionId; show: boolean }> = [...configured, ...missing];
