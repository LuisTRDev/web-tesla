"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SchoolImage from "@/components/ui/SchoolImage";
import type { GalleryEvent } from "@/types";
import { formatDate, toEmbedUrl } from "@/lib/utils";

interface LightboxProps {
  event: GalleryEvent;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

/**
 * Visor a pantalla completa.
 * Teclado: ← → para navegar, Esc para cerrar. Móvil: deslizar a los lados.
 * Soporta fotos, videos en archivo y videos de YouTube o Vimeo.
 */
export default function Lightbox({ event, index, onIndexChange, onClose }: LightboxProps) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<number | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const total = event.media.length;
  const media = event.media[index];
  const hasImage = media.type === "image" && !!media.url;

  const changeZoom = useCallback((next: number) => {
    const value = Math.max(1, Math.min(4, next));
    setZoom(value);
    const width = imageRef.current?.offsetWidth ?? 0;
    const height = imageRef.current?.offsetHeight ?? 0;
    const limitX = width * (value - 1) / 2;
    const limitY = height * (value - 1) / 2;
    setOffset((old) => ({ x: Math.max(-limitX, Math.min(limitX, old.x)), y: Math.max(-limitY, Math.min(limitY, old.y)) }));
  }, []);

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    pointers.current.clear();
    pinch.current = null;
  }, [index, event.id]);

  const go = useCallback(
    (step: number) => onIndexChange((index + step + total) % total),
    [index, total, onIndexChange],
  );

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  const embed = media.type === "video" && media.url ? toEmbedUrl(media.url) : null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${event.title}, elemento ${index + 1} de ${total}`}
      className="fixed inset-0 z-[80] flex flex-col bg-noche text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8 md:py-5">
        <p className="text-sm font-medium tabular-nums text-white/70">
          {index + 1} / {total}
        </p>
        <div className="flex items-center gap-2">
        {hasImage && <div className="flex items-center gap-1 rounded-full border border-white/25 px-1" aria-label="Controles de zoom">
          <button type="button" onClick={() => changeZoom(zoom - 0.5)} disabled={zoom <= 1} aria-label="Reducir imagen" className="h-10 w-10 rounded-full text-xl hover:bg-white/15 disabled:opacity-35">−</button>
          <button type="button" onClick={() => changeZoom(1)} aria-label="Restablecer zoom" className="min-h-10 min-w-[3.5rem] rounded-full text-sm tabular-nums hover:bg-white/15">{Math.round(zoom * 100)}%</button>
          <button type="button" onClick={() => changeZoom(zoom + 0.5)} disabled={zoom >= 4} aria-label="Ampliar imagen" className="h-10 w-10 rounded-full text-xl hover:bg-white/15 disabled:opacity-35">+</button>
        </div>}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold transition-colors hover:bg-white hover:text-noche"
        >
          Cerrar
        </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 md:px-24"
        onTouchStart={(e) => {
          touchStart.current = zoom === 1 && e.touches.length === 1 ? e.touches[0].clientX : null;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current === null || zoom > 1 || e.touches.length) return;
          const delta = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <motion.div
          key={media.id}
          className="relative flex h-full w-full items-center justify-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {media.type === "video" && media.url ? (
            embed ? (
              <iframe
                src={embed}
                title={media.caption ?? event.title}
                className="absolute inset-0 h-full w-full rounded-2xl"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video src={media.url} poster={media.thumbnail ?? undefined} controls playsInline className="absolute inset-0 h-full w-full rounded-2xl bg-black object-contain" />
            )
          ) : media.type === "image" && media.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imageRef}
              src={media.url}
              alt={media.caption ?? event.title}
              draggable={false}
              className={"h-auto max-h-full w-auto max-w-full touch-none rounded-2xl object-contain " + (zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in")}
              style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
              onDoubleClick={() => changeZoom(zoom > 1 ? 1 : 2)}
              onWheel={(e) => { e.preventDefault(); changeZoom(zoom + (e.deltaY < 0 ? 0.25 : -0.25)); }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
                if (pointers.current.size === 2) {
                  const [a, b] = Array.from(pointers.current.values());
                  pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom };
                  touchStart.current = null;
                }
              }}
              onPointerMove={(e) => {
                const previous = pointers.current.get(e.pointerId);
                if (!previous) return;
                pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
                if (pointers.current.size === 2 && pinch.current) {
                  const [a, b] = Array.from(pointers.current.values());
                  changeZoom(pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, pinch.current.distance));
                } else if (zoom > 1 && pointers.current.size === 1 && imageRef.current) {
                  const image = imageRef.current;
                  const limitX = image.offsetWidth * (zoom - 1) / 2;
                  const limitY = image.offsetHeight * (zoom - 1) / 2;
                  setOffset((old) => ({ x: Math.max(-limitX, Math.min(limitX, old.x + e.clientX - previous.x)), y: Math.max(-limitY, Math.min(limitY, old.y + e.clientY - previous.y)) }));
                }
              }}
              onPointerUp={(e) => { pointers.current.delete(e.pointerId); pinch.current = null; }}
              onPointerCancel={(e) => { pointers.current.delete(e.pointerId); pinch.current = null; touchStart.current = null; }}
            />
          ) : (
            <SchoolImage
              cover
              src={media.type === "image" ? media.url : null}
              alt={media.caption ?? event.title}
              label={media.type === "video" ? "Video del evento" : "Fotografía del evento"}
              sizes="100vw"
              imgClassName="!object-contain"
              labelClassName="items-center justify-center text-center"
              className="rounded-2xl bg-noche-800"
            />
          )}
        </motion.div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-noche/70 backdrop-blur transition-colors hover:bg-white hover:text-noche md:left-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Siguiente"
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-noche/70 backdrop-blur transition-colors hover:bg-white hover:text-noche md:right-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 md:px-8 md:pb-7">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-8">
          <div>
            <h2 className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] md:text-3xl">{event.title}</h2>
            <p className="mt-1 text-sm text-white/65">
              <time dateTime={event.date}>{formatDate(event.date)}</time>
              <span className="mx-2 text-white/30">|</span>
              {event.category}
            </p>
          </div>
          <p className="max-w-xl text-[15px] leading-relaxed text-white/75 max-md:mt-2">{media.caption ?? event.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
