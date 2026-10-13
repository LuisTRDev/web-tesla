import type { GalleryEvent, GalleryMedia } from "@/types";

/**
 * GALERÍA: Año → Mes → Evento → Fotos y videos.
 *
 * Estos eventos son EJEMPLOS para mostrar el diseño (isPlaceholder: true).
 * Para publicar un evento real:
 *   1. Sube las fotos a /public/images/galeria/... (o a Supabase Storage).
 *   2. Agrega un objeto GalleryEvent con su fecha, categoría y lista `media`.
 *   3. En videos usa type: "video" y la URL de YouTube, Vimeo o del archivo .mp4.
 *
 * Tabla sugerida en Supabase: gallery_events (id, title, description, date, category, cover_image)
 * y gallery_media (id, event_id, type, url, thumbnail, caption, date).
 */

/** Genera elementos pendientes para un evento de ejemplo. */
function pendingMedia(eventId: string, date: string, photos: number, videos = 0): GalleryMedia[] {
  const items: GalleryMedia[] = [];
  for (let i = 1; i <= photos; i++) {
    items.push({ id: `${eventId}-foto-${i}`, type: "image", url: null, caption: `[FOTO ${i} DEL EVENTO]`, date });
  }
  for (let i = 1; i <= videos; i++) {
    items.push({ id: `${eventId}-video-${i}`, type: "video", url: null, thumbnail: null, caption: `[VIDEO ${i} DEL EVENTO]`, date });
  }
  return items;
}

function sampleEvent(id: string, title: string, date: string, category: string, photos: number, videos = 0): GalleryEvent {
  return {
    id,
    title,
    description: "[DESCRIPCIÓN PENDIENTE] Breve relato de la actividad: qué se hizo, quiénes participaron y qué se aprendió.",
    date,
    category,
    coverImage: null,
    media: pendingMedia(id, date, photos, videos),
    isPlaceholder: true,
  };
}

export const galleryEvents: GalleryEvent[] = [
  sampleEvent("2026-10-aniversario", "Aniversario", "2026-10-23", "Eventos", 6, 1),
  sampleEvent("2026-10-concurso", "Concurso", "2026-10-16", "Académico", 4),
  sampleEvent("2026-10-actividad-cientifica", "Actividad científica", "2026-10-09", "Ciencia", 5, 1),
  sampleEvent("2026-10-dia-del-estudiante", "Día del estudiante", "2026-10-02", "Celebraciones", 5),
  sampleEvent("2026-09-visita-educativa", "Visita educativa", "2026-09-25", "Académico", 4),
  sampleEvent("2026-09-feria-escolar", "Feria escolar", "2026-09-18", "Ciencia", 6, 1),
  sampleEvent("2026-09-juegos-deportivos", "Juegos deportivos", "2026-09-11", "Deportes", 5),
  sampleEvent("2025-12-clausura", "Clausura del año escolar", "2025-12-19", "Eventos", 5, 1),
  sampleEvent("2025-07-fiestas-patrias", "Fiestas Patrias", "2025-07-24", "Celebraciones", 4),
];
