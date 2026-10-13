/** Une clases condicionales sin dependencias externas. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Convierte "2026-10-02" en una fecha local sin desfase de zona horaria. */
export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/** "2 de octubre de 2026" */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", year: "numeric" }).format(parseISODate(iso));
}

/** "2 oct" */
export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short" }).format(parseISODate(iso)).replace(".", "");
}

/** Enlace de WhatsApp con mensaje opcional. Devuelve null si no hay número configurado. */
export function whatsappLink(number: string | null, message?: string): string | null {
  if (!number) return null;
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "51960209798" → "960 209 798" (celular peruano sin código de país). */
export function formatPhone(number: string): string {
  const digits = number.replace(/\D/g, "").replace(/^51(?=\d{9}$)/, "");
  return digits.length === 9 ? digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : number;
}

/** Convierte enlaces de YouTube o Vimeo en su versión embebible. Devuelve null si es un archivo de video. */
export function toEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
