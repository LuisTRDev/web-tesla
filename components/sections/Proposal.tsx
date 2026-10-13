"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import SchoolImage from "@/components/ui/SchoolImage";
import { pillars } from "@/data/pillars";
import { cn } from "@/lib/utils";

/**
 * PROPUESTA EDUCATIVA: índice interactivo en lugar de tarjetas.
 * Escritorio: la lista a la izquierda controla la imagen y el texto de la derecha.
 * Móvil: acordeón; el pilar activo se despliega con su imagen debajo.
 */
export default function Proposal({ showIntro = true }: { showIntro?: boolean }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = pillars[active];
  const hasDrafts = pillars.some((pillar) => !pillar.confirmed);

  return (
    <section id="propuesta" className={cn("relative overflow-hidden bg-noche text-white", showIntro ? "py-24 md:py-36" : "pb-24 pt-4 md:pb-36")}>
      {/* Retícula científica muy sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #A9ADFF 1px, transparent 1px), linear-gradient(to bottom, #A9ADFF 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
      />

      <div className="relative mx-auto max-w-site px-5 md:px-10">
        <Reveal>
          {showIntro && (
            <h2 className="mb-6 max-w-[14ch] text-balance font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
              Una educación pensada para el futuro.
            </h2>
          )}
          {hasDrafts && <DraftBadge tone="dark" label="Descripciones propuestas" />}
        </Reveal>

        <div className={cn("grid gap-10 lg:grid-cols-12 lg:gap-14", showIntro ? "mt-14 lg:mt-20" : "mt-8")}>
          <ol className="border-t border-white/15 lg:col-span-7">
            {pillars.map((pillar, index) => {
              const isActive = index === active;
              return (
                <li key={pillar.id} className="border-b border-white/15">
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className="group flex w-full items-baseline gap-5 py-5 text-left md:gap-8 md:py-6"
                  >
                    <span className={cn("w-8 shrink-0 text-sm font-semibold tabular-nums transition-colors duration-300", isActive ? "text-filamento" : "text-white/40")}>
                      {pillar.number}
                    </span>
                    <span
                      className={cn(
                        "font-display text-[clamp(1.6rem,4.4vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.025em] transition-[color,transform] duration-500",
                        isActive ? "text-white lg:translate-x-3" : "text-white/40 group-hover:text-white/75",
                      )}
                    >
                      {pillar.title}
                    </span>
                  </button>

                  {/* Detalle en móvil y tablet */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        className="overflow-hidden lg:hidden"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="pb-7 pl-[52px] md:pl-16">
                          <p className="max-w-md text-[17px] leading-relaxed text-white/75">{pillar.description}</p>
                          <SchoolImage
                            src={pillar.image}
                            alt={pillar.title}
                            label={`Foto que represente: ${pillar.title}`}
                            className="mt-5 aspect-[16/10] rounded-2xl"
                            sizes="90vw"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>

          {/* Panel fijo en escritorio */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-panel bg-noche-700">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.id}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SchoolImage cover src={current.image} alt={current.title} label={`Foto que represente: ${current.title}`} sizes="38vw" labelClassName="items-start justify-start" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noche via-noche/80 to-transparent p-7 pt-24">
                  <p className="text-sm font-semibold text-filamento">{current.number}</p>
                  <p aria-live="polite" className="mt-2 text-xl leading-snug text-white">
                    {current.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
