import raw from "@/content/philosophy.json";
import type { PhilosophyConcept } from "@/types";
import { bool, list, paragraphs, rec, str } from "@/lib/content";

/** Texto de la sección "Nosotros" y sus conceptos. Se edita desde el panel (/admin → Nosotros). */
const r = rec(raw);
const about = rec(r.about);

export const aboutText = {
  confirmed: bool(about.confirmed),
  title: str(about.title),
  quote: str(about.quote),
  paragraphs: paragraphs(about.paragraphs),
};

export const philosophy: PhilosophyConcept[] = list(r.items).map((item, index) => ({
  id: str(item.id, `concepto-${index + 1}`),
  title: str(item.title),
  description: str(item.description),
  confirmed: bool(item.confirmed),
}));
