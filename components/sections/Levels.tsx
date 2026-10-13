"use client";

import Link from "next/link";
import { useState } from "react";
import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import SchoolImage from "@/components/ui/SchoolImage";
import type { Level } from "@/types";
import { cn } from "@/lib/utils";

function Grades({ level, tone }: { level: Level; tone: "dark" | "light" }) {
  if (!level.grades) {
    return <DraftBadge tone={tone} label="[GRADOS POR CONFIRMAR]" />;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {level.grades.map((grade) => (
        <li key={grade} className="rounded-full border border-white/35 px-3 py-1 text-[13px] font-medium">
          {grade}
        </li>
      ))}
    </ul>
  );
}

/**
 * NIVELES
 * Escritorio: tres paneles horizontales; el activo se expande y revela su contenido.
 * Móvil: carrusel horizontal con ajuste por tarjeta (deslizar con el dedo).
 */
export default function Levels({ levels, showIntro = true }: { levels: Level[]; showIntro?: boolean }) {
  const [active, setActive] = useState(0);

  return (
    <section id="niveles" className={cn("bg-tiza", showIntro ? "py-24 md:py-36" : "py-16 md:py-24")}>
      {showIntro && (
        <div className="mx-auto mb-12 max-w-site px-5 md:px-10 lg:mb-16">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-[12ch] text-balance font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-noche">
              Cada etapa, un descubrimiento.
            </h2>
            <p className="max-w-sm text-lg leading-relaxed text-niebla">
              Acompañamos a nuestros estudiantes desde la primaria hasta el final de la secundaria.
            </p>
          </Reveal>
        </div>
      )}

      {/* Escritorio: paneles que se expanden */}
      <Reveal className="mx-auto hidden max-w-site px-10 lg:block">
        <div className="flex h-[620px] gap-3">
          {levels.map((level, index) => {
            const isActive = index === active;
            return (
              <article
                key={level.slug}
                onMouseEnter={() => setActive(index)}
                className={cn(
                  "group relative basis-0 overflow-hidden rounded-panel text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  isActive ? "grow-[3.4]" : "grow",
                )}
              >
                <SchoolImage
                  cover
                  src={level.image}
                  alt={`Nivel ${level.name}`}
                  label={`Estudiantes de ${level.name}`}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  imgClassName="transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  labelClassName="items-start justify-start"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noche via-noche/55 to-noche/10" />

                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-label={`Ver nivel ${level.name}`}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="absolute inset-0"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-8">
                  <h3 className="font-display text-[clamp(2.2rem,3.6vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">{level.name}</h3>
                  <div className={cn("grid transition-[grid-template-rows,opacity] duration-700", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <div className="overflow-hidden">
                      <p className="mt-3 font-display text-xl font-semibold text-filamento">{level.summary}</p>
                      <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-white/80">{level.description}</p>
                      <div className="mt-5">
                        <Grades level={level} tone="dark" />
                      </div>
                      <Link
                        href={`/niveles/${level.slug}`}
                        tabIndex={isActive ? 0 : -1}
                        className="pointer-events-auto mt-6 inline-flex min-h-[46px] items-center rounded-full bg-white px-6 text-[15px] font-semibold text-noche transition-colors hover:bg-filamento"
                      >
                        Conocer nivel
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Reveal>

      {/* Móvil y tablet: carrusel deslizable */}
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:px-10 lg:hidden">
        {levels.map((level) => (
          <article key={level.slug} className="relative flex min-h-[520px] w-[84vw] max-w-[420px] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-panel text-white">
            <SchoolImage cover src={level.image} alt={`Nivel ${level.name}`} label={`Estudiantes de ${level.name}`} sizes="84vw" labelClassName="items-start justify-start" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noche via-noche/60 to-noche/10" />
            <div className="relative p-6">
              <h3 className="font-display text-5xl font-extrabold leading-none tracking-[-0.03em]">{level.name}</h3>
              <p className="mt-3 font-display text-lg font-semibold text-filamento">{level.summary}</p>
              <p className="mt-2 text-base leading-relaxed text-white/80">{level.description}</p>
              <div className="mt-4">
                <Grades level={level} tone="dark" />
              </div>
              <Link href={`/niveles/${level.slug}`} className="mt-5 inline-flex min-h-[46px] items-center rounded-full bg-white px-6 text-[15px] font-semibold text-noche">
                Conocer nivel
              </Link>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 px-5 text-sm text-niebla md:px-10 lg:hidden">Desliza para ver los dos niveles</p>
    </section>
  );
}
