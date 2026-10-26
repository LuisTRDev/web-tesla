import raw from "@/content/experience.json";
import type { ExperienceShot } from "@/types";
import { list, rec, str, strings, text } from "@/lib/content";

const r = rec(raw);

/** Fotografías grandes de la sección "Así se vive Nikola Tesla". Se editan desde el panel (/admin → Experiencia). */
export const experienceShots: ExperienceShot[] = list(r.shots).map((item, index) => {
  const id = str(item.id, `momento-${index + 1}`);
  return {
    id,
    label: str(item.label),
    caption: str(item.caption),
    image: text(item.image),
    illustration: text(item.illustration) ?? id,
  };
});

/** Palabras del marquee. Verbos de la experiencia de aprender. */
export const experienceWords: string[] = strings(r.words);
