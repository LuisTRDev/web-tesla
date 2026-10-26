import raw from "@/content/achievements.json";
import type { Achievement } from "@/types";
import { bool, list, rec, str, text } from "@/lib/content";

/** Logros de la institución y sus estudiantes. Se editan desde el panel (/admin → Logros). */
export const achievements: Achievement[] = list(rec(raw).items).map((item, index) => ({
  id: str(item.id, `logro-${index + 1}`),
  year: text(item.year),
  title: str(item.title),
  description: str(item.description),
  isPlaceholder: bool(item.isPlaceholder),
}));
