"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GalleryEvent } from "@/types";
import { sortEvents } from "@/lib/gallery";
import { cn, formatShortDate } from "@/lib/utils";

const SLIDE_MS = 5000;

interface Story {
  event: GalleryEvent;
  slides: { url: string; caption?: string }[];
  cover: string;
}

/**
 * Galería tipo "stories" (como Instagram): una fila de círculos, uno por evento, que abre las fotos a pantalla completa
 * con barras de progreso. Toca a la derecha/izquierda (o usa las flechas) para avanzar/retroceder, mantén presionado
 * para pausar y desliza hacia abajo o pulsa Esc para cerrar. Solo aparecen eventos con fotos reales subidas.
 */
export default function GalleryStories({ events }: { events: GalleryEvent[] }) {
  const stories = useMemo<Story[]>(
    () =>
      sortEvents(events)
        .map((event) => {
          const slides = event.media.filter((m) => m.type === "image" && m.url).map((m) => ({ url: m.url as string, caption: m.caption }));
          return { event, slides, cover: event.coverImage || slides[0]?.url || "" };
        })
        .filter((story) => story.slides.length > 0 && story.cover),
    [events],
  );
  const [open, setOpen] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const paused = useRef(false);
  const startY = useRef(0);

  const close = useCallback(() => setOpen(null), []);
  const openStory = (index: number) => {
    setOpen(index);
    setSlide(0);
  };
  const next = useCallback(() => {
    if (open === null) return;
    if (slide < stories[open].slides.length - 1) setSlide(slide + 1);
    else if (open < stories.length - 1) {
      setOpen(open + 1);
      setSlide(0);
    } else close();
  }, [open, slide, stories, close]);
  const prev = useCallback(() => {
    if (open === null) return;
    if (slide > 0) setSlide(slide - 1);
    else if (open > 0) {
      setOpen(open - 1);
      setSlide(0);
    }
  }, [open, slide]);

  // marca como vista la historia abierta
  useEffect(() => {
    if (open !== null) setSeen((prevSeen) => new Set(prevSeen).add(stories[open].event.id));
  }, [open, stories]);

  // avance automático (se pausa al mantener presionado)
  useEffect(() => {
    if (open === null) return;
    let elapsed = 0;
    const tick = window.setInterval(() => {
      if (paused.current) return;
      elapsed += 100;
      if (elapsed >= SLIDE_MS) next();
    }, 100);
    return () => window.clearInterval(tick);
  }, [open, slide, next]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, next, prev, close]);

  if (stories.length === 0) return null;
  const current = open !== null ? stories[open] : null;

  return (
    <div className="mb-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-white/60">Momentos recientes</p>
      <ul className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        {stories.map((story, index) => (
          <li key={story.event.id} className="w-[84px] shrink-0 text-center">
            <button type="button" onClick={() => openStory(index)} className="group block w-full" aria-label={`Ver historia: ${story.event.title}`}>
              <span
                className={cn(
                  "block rounded-full p-[3px] transition-transform group-hover:scale-105",
                  seen.has(story.event.id) ? "bg-white/25" : "bg-gradient-to-tr from-filamento via-rojo to-arco",
                )}
              >
                <span className="block rounded-full bg-noche-900 p-[3px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={story.cover} alt="" loading="lazy" className="aspect-square w-full rounded-full object-cover" />
                </span>
              </span>
              <span className="mt-2 line-clamp-2 block text-[12px] font-medium leading-tight text-white/85">{story.event.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.event.title}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95"
          onPointerDown={(e) => {
            paused.current = true;
            startY.current = e.clientY;
          }}
          onPointerUp={(e) => {
            paused.current = false;
            if (e.clientY - startY.current > 90) close();
          }}
          onPointerCancel={() => (paused.current = false)}
        >
          <div className="relative h-full w-full max-w-[460px] md:h-[min(92vh,820px)] md:overflow-hidden md:rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={`${open}-${slide}`} src={current.slides[slide].url} alt={current.slides[slide].caption || current.event.title} className="story-in absolute inset-0 h-full w-full object-cover" draggable={false} />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/70 to-transparent" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute inset-x-3 top-3 flex gap-1.5" aria-hidden="true">
              {current.slides.map((_, i) => (
                <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                  <span
                    key={i === slide ? `run-${open}-${slide}` : `s-${i}`}
                    className={cn("block h-full bg-white", i < slide ? "w-full" : i === slide ? "story-bar" : "w-0")}
                  />
                </span>
              ))}
            </div>
            <div className="absolute inset-x-4 top-8 flex items-center justify-between text-white">
              <div>
                <p className="font-display text-lg font-bold leading-tight">{current.event.title}</p>
                <p className="text-xs text-white/70">{formatShortDate(current.event.date)}</p>
              </div>
              <button type="button" onClick={close} onPointerDown={(e) => e.stopPropagation()} aria-label="Cerrar" className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-2xl backdrop-blur">
                ×
              </button>
            </div>
            {current.slides[slide].caption && <p className="absolute inset-x-5 bottom-8 text-center text-[16px] font-medium text-white drop-shadow">{current.slides[slide].caption}</p>}
            <button type="button" aria-label="Anterior" onClick={prev} className="absolute inset-y-24 left-0 w-1/3" />
            <button type="button" aria-label="Siguiente" onClick={next} className="absolute inset-y-24 right-0 w-2/3" />
          </div>
        </div>
      )}
      <style>{`
        @keyframes storyBar{from{width:0}to{width:100%}}
        @keyframes storyIn{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}
        .story-bar{animation:storyBar ${SLIDE_MS}ms linear forwards}
        .story-in{animation:storyIn .45s ease both}
        [aria-modal="true"]:active .story-bar{animation-play-state:paused}
        @media (prefers-reduced-motion:reduce){.story-in{animation:none}}
      `}</style>
    </div>
  );
}
