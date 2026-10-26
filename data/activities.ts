import raw from "@/content/activities.json";
import type { Activity } from "@/types";
import { bool, list, rec, str, text } from "@/lib/content";

/**
 * Actividades y talleres. Se editan desde el panel (/admin → Actividades).
 * El orden importa: los primeros ocupan los espacios más grandes de la composición.
 */
export const activities: Activity[] = list(rec(raw).items).map((item, index) => {
  const id = str(item.id, `actividad-${index + 1}`);
  return {
    id,
    title: str(item.title),
    description: str(item.description),
    image: text(item.image),
    illustration: text(item.illustration) ?? id,
    confirmed: bool(item.confirmed),
  };
});
