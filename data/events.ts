import fs from "node:fs";
import path from "node:path";
import type { SchoolEvent } from "@/types";
import { bool, isoDate, link, oneOf, rec, str, text } from "@/lib/content";

/**
 * Calendario de eventos: un archivo por evento en content/eventos/. Se crean desde el panel (/admin → Calendario).
 * El nombre del archivo es la dirección (slug). Solo se usa en el servidor (lee archivos).
 */
const dir = path.join(process.cwd(), "content", "eventos");

export const EVENT_CATEGORIES = ["Reunión", "Académico", "Cultural", "Deportivo", "Admisión", "Feriado", "Otro"] as const;

function readEvents(): SchoolEvent[] {
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const data = rec(JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")));
        const date = isoDate(data.date);
        const endDate = isoDate(data.endDate);
        return {
          slug: file.replace(/\.json$/, ""),
          title: str(data.title),
          date,
          endDate: endDate && endDate > date ? endDate : null,
          time: text(data.time),
          place: text(data.place),
          category: oneOf(data.category, EVENT_CATEGORIES, "Otro"),
          description: text(data.description),
          image: text(data.image),
          link: link(data.link),
          linkText: text(data.linkText),
          isPlaceholder: bool(data.isPlaceholder),
        };
      })
      .filter((event) => event.title && event.date);
  } catch {
    return [];
  }
}

export const events: SchoolEvent[] = readEvents();
