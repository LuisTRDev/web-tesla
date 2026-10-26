import raw from "@/content/gallery.json";
import type { GalleryEvent, GalleryMedia } from "@/types";
import { bool, isoDate, list, rec, str, text } from "@/lib/content";

/**
 * GALERÍA: Año → Mes → Evento → Fotos y videos. Se edita desde el panel (/admin → Galería).
 * En videos se usa la URL de YouTube, Vimeo o el archivo .mp4. Un elemento sin archivo se muestra
 * como "pendiente" (útil en los eventos de ejemplo).
 */
export const galleryEvents: GalleryEvent[] = list(rec(raw).items).map((event, index) => {
  const id = str(event.id, `evento-${index + 1}`);
  const date = isoDate(event.date);
  const media: GalleryMedia[] = list(event.media).map((item, position) => ({
    id: str(item.id, `${id}-${position + 1}`),
    type: item.type === "video" ? "video" : "image",
    url: text(item.url),
    thumbnail: text(item.thumbnail),
    caption: text(item.caption) ?? undefined,
    date: isoDate(item.date, date) || undefined,
  }));
  return {
    id,
    title: str(event.title),
    description: str(event.description),
    date,
    category: str(event.category, "Eventos"),
    coverImage: text(event.coverImage),
    media,
    isPlaceholder: bool(event.isPlaceholder),
  };
});
