import type { GalleryEvent } from "@/types";
import { parseISODate } from "@/lib/utils";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export interface GalleryMonthGroup {
  key: string;
  year: number;
  month: number;
  label: string;
  events: GalleryEvent[];
}

/** Ordena del evento más reciente al más antiguo. */
export function sortEvents(events: GalleryEvent[]): GalleryEvent[] {
  return [...events].sort((a, b) => b.date.localeCompare(a.date));
}

/** Años disponibles, del más reciente al más antiguo. */
export function getYears(events: GalleryEvent[]): number[] {
  return Array.from(new Set(events.map((e) => parseISODate(e.date).getFullYear()))).sort((a, b) => b - a);
}

export function getCategories(events: GalleryEvent[]): string[] {
  return Array.from(new Set(events.map((e) => e.category))).sort((a, b) => a.localeCompare(b, "es"));
}

/** Agrupa Año → Mes → Evento, ya ordenado para mostrar. */
export function groupByMonth(events: GalleryEvent[]): GalleryMonthGroup[] {
  const groups = new Map<string, GalleryMonthGroup>();
  for (const event of sortEvents(events)) {
    const d = parseISODate(event.date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    if (!groups.has(key)) {
      groups.set(key, { key, year, month, label: `${MONTHS[month]} ${year}`, events: [] });
    }
    groups.get(key)!.events.push(event);
  }
  return Array.from(groups.values());
}
