import raw from "@/content/team.json";
import type { TeamMember } from "@/types";
import { list, rec, str, text } from "@/lib/content";

/**
 * Equipo directivo y docentes. Se edita desde el panel (/admin → Equipo).
 * Las fotos requieren autorización para publicarse.
 */
export const team: TeamMember[] = list(rec(raw).items).map((item, index) => ({
  id: str(item.id, `miembro-${index + 1}`),
  name: text(item.name),
  role: str(item.role),
  bio: text(item.bio),
  image: text(item.image),
}));
