"use client";

import { useCallback, useEffect, useRef } from "react";
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
  const total = event.media.length;
  const media = event.media[index];

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
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold transition-colors hover:bg-white hover:text-noche"
        >
          Cerrar
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-3 md:px-24"
        onTouchStart={(e) => {
          touchStart.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <motion.div
          key={media.id}
          className="relative h-full w-full overflow-hidden rounded-2xl"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {media.type === "video" && media.url ? (
            embed ? (
              <iframe
                src={embed}
                title={media.caption ?? event.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <video src={media.url} poster={media.thumbnail ?? undefined} controls playsInline className="absolute inset-0 h-full w-full bg-black object-contain" />
            )
          ) : (
            <SchoolImage
              cover
              src={media.type === "image" ? media.url : null}
              alt={media.caption ?? event.title}
              label={media.type === "video" ? "Video del evento" : "Fotografía del evento"}
              sizes="100vw"
              imgClassName="!object-contain"
              labelClassName="items-center justify-center text-center"
              className="bg-noche-800"
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
