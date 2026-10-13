import type { NewsPost } from "@/types";

/**
 * Noticias y comunicados. Las publicaciones marcadas con isPlaceholder son ejemplos de diseño.
 * Tabla sugerida en Supabase: news (slug, title, excerpt, body, date, category, image).
 */
export const news: NewsPost[] = [
  {
    slug: "ejemplo-admision-2027",
    title: "[EJEMPLO] Inicia el proceso de Admisión 2027",
    excerpt: "[DESCRIPCIÓN PENDIENTE] Resumen de la publicación en una o dos líneas.",
    body: ["[CONTENIDO PENDIENTE] Aquí irá el texto completo de la publicación."],
    date: "2026-10-05",
    category: "Admisión",
    image: null,
    isPlaceholder: true,
  },
  {
    slug: "ejemplo-feria-escolar",
    title: "[EJEMPLO] Así vivimos la feria escolar",
    excerpt: "[DESCRIPCIÓN PENDIENTE] Resumen de la publicación en una o dos líneas.",
    body: ["[CONTENIDO PENDIENTE] Aquí irá el texto completo de la publicación."],
    date: "2026-09-21",
    category: "Actividades",
    image: null,
    isPlaceholder: true,
  },
  {
    slug: "ejemplo-comunicado",
    title: "[EJEMPLO] Comunicado para padres de familia",
    excerpt: "[DESCRIPCIÓN PENDIENTE] Resumen de la publicación en una o dos líneas.",
    body: ["[CONTENIDO PENDIENTE] Aquí irá el texto completo de la publicación."],
    date: "2026-09-08",
    category: "Comunicados",
    image: null,
    isPlaceholder: true,
  },
  {
    slug: "ejemplo-juegos-deportivos",
    title: "[EJEMPLO] Resultados de los juegos deportivos",
    excerpt: "[DESCRIPCIÓN PENDIENTE] Resumen de la publicación en una o dos líneas.",
    body: ["[CONTENIDO PENDIENTE] Aquí irá el texto completo de la publicación."],
    date: "2026-09-12",
    category: "Deportes",
    image: null,
    isPlaceholder: true,
  },
];
