import raw from "@/content/testimonials.json";
import type { Testimonial } from "@/types";
import { bool, list, rec, str } from "@/lib/content";

const roles: Testimonial["role"][] = ["Padre de familia", "Madre de familia", "Estudiante", "Docente"];

/** Testimonios (con autorización de quien los firma). Se editan desde el panel (/admin → Testimonios). */
export const testimonials: Testimonial[] = list(rec(raw).items).map((item, index) => ({
  id: str(item.id, `testimonio-${index + 1}`),
  quote: str(item.quote),
  author: str(item.author),
  role: roles.includes(item.role as Testimonial["role"]) ? (item.role as Testimonial["role"]) : "Padre de familia",
  isPlaceholder: bool(item.isPlaceholder),
}));
