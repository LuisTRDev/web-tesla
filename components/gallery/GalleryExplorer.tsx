"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Lightbox from "@/components/gallery/Lightbox";
import DraftBadge from "@/components/ui/DraftBadge";
import SchoolImage from "@/components/ui/SchoolImage";
import type { GalleryEvent } from "@/types";
import { getCategories, getYears, groupByMonth, sortEvents } from "@/lib/gallery";
import { cn, formatShortDate } from "@/lib/utils";

/**
 * Mosaico tipo revista: cada posición del evento tiene un tamaño distinto.
 * La cuadrícula es de 2 columnas en móvil y 4 en escritorio, con relleno denso.
 */
const mosaic = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-[42px] shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors duration-300",
        active ? "border-filamento bg-filamento text-noche" : "border-white/25 text-white/80 hover:border-white hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

/**
 * GALERÍA: Año → Mes → Evento.
 * Filtros por año y por categoría; cada evento abre un visor a pantalla completa.
 * Recibe los eventos por props, así que da igual si vienen de /data o de Supabase.
 * `maxEvents` limita cuántos eventos se muestran (útil en la portada).
 */
export default function GalleryExplorer({ events, maxEvents }: { events: GalleryEvent[]; maxEvents?: number }) {
  const reduce = useReducedMotion();
  const years = useMemo(() => getYears(events), [events]);
  const categories = useMemo(() => getCategories(events), [events]);
  const [year, setYear] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ eventId: string; index: number } | null>(null);

  const groups = useMemo(() => {
    const filtered = events.filter(
      (event) => (year === null || event.date.startsWith(String(year))) && (category === null || event.category === category),
    );
    // En la portada se limita la cantidad de eventos visibles (los más recientes del filtro).
    const sorted = sortEvents(filtered);
    return groupByMonth(typeof maxEvents === "number" ? sorted.slice(0, maxEvents) : sorted);
  }, [events, year, category, maxEvents]);

  const viewerEvent = viewer ? events.find((event) => event.id === viewer.eventId) ?? null : null;

  return (
    <div>
      {/* Filtros */}
      <div className="space-y-3">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por año">
          <FilterChip active={year === null} onClick={() => setYear(null)}>
            Todo
          </FilterChip>
          {years.map((value) => (
            <FilterChip key={value} active={year === value} onClick={() => setYear(value)}>
              {value}
            </FilterChip>
          ))}
        </div>
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            aria-pressed={category === null}
            onClick={() => setCategory(null)}
            className={cn("min-h-[40px] shrink-0 px-1 text-sm font-medium transition-colors", category === null ? "text-white underline decoration-filamento decoration-2 underline-offset-8" : "text-white/55 hover:text-white")}
          >
            Todas las categorías
          </button>
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
              className={cn("ml-4 min-h-[40px] shrink-0 px-1 text-sm font-medium transition-colors", category === value ? "text-white underline decoration-filamento decoration-2 underline-offset-8" : "text-white/55 hover:text-white")}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Meses y eventos */}
      <div className="mt-12 space-y-20 md:mt-16 md:space-y-28">
        {groups.length === 0 && <p className="py-16 text-lg text-white/70">No hay eventos con estos filtros. Prueba con otro año o categoría.</p>}

        {groups.map((group) => (
          <section key={group.key} aria-label={group.label}>
            <h3 className="sticky top-[72px] z-10 -mx-5 bg-noche/90 px-5 py-3 font-display text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.035em] backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
              {group.label}
            </h3>

            <div className="mt-8 space-y-14 md:mt-12 md:space-y-20">
              {group.events.map((event) => (
                <motion.article
                  key={event.id}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-6 lg:grid-cols-12 lg:gap-10"
                >
                  <header className="lg:col-span-3">
                    <p className="text-sm font-semibold text-filamento">
                      <time dateTime={event.date}>{formatShortDate(event.date)}</time>
                      <span className="mx-2 text-white/30">|</span>
                      <span className="text-white/70">{event.category}</span>
                    </p>
                    <h4 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.02] tracking-[-0.025em]">{event.title}</h4>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/65">{event.description}</p>
                    <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/55">
                      {event.media.filter((m) => m.type === "image").length} fotos
                      {event.media.some((m) => m.type === "video") && <span>y {event.media.filter((m) => m.type === "video").length} video(s)</span>}
                      {event.isPlaceholder && <DraftBadge tone="dark" label="Evento de ejemplo" />}
                    </p>
                  </header>

                  <ul className="grid grid-flow-dense auto-rows-[38vw] grid-cols-2 gap-2 sm:auto-rows-[190px] md:grid-cols-4 md:gap-3 lg:col-span-9 lg:auto-rows-[200px]">
                    {event.media.map((media, index) => (
                      <li key={media.id} className={cn("relative", mosaic[index % mosaic.length])}>
                        <button
                          type="button"
                          onClick={() => setViewer({ eventId: event.id, index })}
                          aria-label={`Abrir ${media.type === "video" ? "video" : "foto"} ${index + 1} de ${event.title}`}
                          className="group absolute inset-0 overflow-hidden rounded-2xl"
                        >
                          <SchoolImage
                            cover
                            src={media.type === "video" ? media.thumbnail ?? null : media.url}
                            alt={media.caption ?? event.title}
                            label={media.type === "video" ? "Miniatura del video" : "Foto del evento"}
                            sizes="(min-width: 1024px) 34vw, 50vw"
                            imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                            labelClassName="items-start justify-start text-left"
                          />
                          <span aria-hidden="true" className="absolute inset-0 bg-noche/0 transition-colors duration-500 group-hover:bg-noche/25" />
                          {media.type === "video" && (
                            <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-noche">
                              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                                <path d="M2 1l9 5-9 5z" />
                              </svg>
                              Video
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {viewer && viewerEvent && (
          <Lightbox
            event={viewerEvent}
            index={viewer.index}
            onIndexChange={(index) => setViewer({ eventId: viewerEvent.id, index })}
            onClose={() => setViewer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
