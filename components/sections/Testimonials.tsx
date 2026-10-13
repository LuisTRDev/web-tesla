"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import DraftBadge from "@/components/ui/DraftBadge";
import type { Testimonial } from "@/types";

/** TESTIMONIOS: una sola cita grande a la vez, con controles claros y sin reproducción automática. */
export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  if (testimonials.length === 0) return null;

  const total = testimonials.length;
  const current = testimonials[index];
  const go = (step: number) => setIndex((value) => (value + step + total) % total);

  return (
    <section aria-labelledby="testimonios-titulo" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="testimonios-titulo" className="text-balance font-display text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-noche">
              Lo que dice nuestra comunidad.
            </h2>
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Testimonio anterior"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-noche/25 text-noche transition-colors hover:bg-noche hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Testimonio siguiente"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-noche/25 text-noche transition-colors hover:bg-noche hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="ml-2 text-sm font-medium tabular-nums text-niebla">
                {index + 1} de {total}
              </span>
            </div>
          </div>

          <div className="min-h-[300px] lg:col-span-8" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={current.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="text-balance font-display text-[clamp(1.6rem,3.6vw,3rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-noche">
                  “{current.quote}”
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-center gap-3 border-t border-noche/15 pt-5 text-[15px]">
                  <span className="font-semibold text-noche">{current.author}</span>
                  <span className="text-niebla">{current.role}</span>
                  {current.isPlaceholder && <DraftBadge label="Espacio reservado" />}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
