import raw from "@/content/pillars.json";
import type { Pillar } from "@/types";
import { bool, list, rec, str, text } from "@/lib/content";

/** Pilares de la propuesta educativa. Se editan desde el panel (/admin → Propuesta educativa). */
export const pillars: Pillar[] = list(rec(raw).items).map((item, index) => {
  const id = str(item.id, `pilar-${index + 1}`);
  return {
    id,
    number: String(index + 1).padStart(2, "0"),
    title: str(item.title),
    description: str(item.description),
    image: text(item.image),
    illustration: text(item.illustration) ?? id,
    confirmed: bool(item.confirmed),
  };
});
