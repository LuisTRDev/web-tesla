import raw from "@/content/faq.json";
import type { FaqItem } from "@/types";
import { bool, list, rec, str } from "@/lib/content";

/**
 * Preguntas frecuentes de las familias. Se editan desde el panel (/admin → Preguntas frecuentes).
 * Solo las respuestas marcadas como confirmadas se envían a Google como datos estructurados (FAQPage).
 */
export const faq: FaqItem[] = list(rec(raw).items).map((item, index) => ({
  id: str(item.id, `pregunta-${index + 1}`),
  question: str(item.question),
  answer: str(item.answer),
  confirmed: bool(item.confirmed),
}));
