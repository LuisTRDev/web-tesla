import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { modules } from "@/data/modules";
import { cn } from "@/lib/utils";

/**
 * PORTADA → ÍNDICE DE MÓDULOS
 * La portada ya no cuenta todo: presenta cada sección como una puerta con su propio color.
 */
export default function ModuleIndex() {
  return (
    <section aria-labelledby="modulos-titulo" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 id="modulos-titulo" className="max-w-[14ch] text-balance font-display text-[clamp(2.4rem,6.5vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-noche">
            Explora el colegio.
          </h2>
          <p className="max-w-sm text-lg leading-relaxed text-niebla">Cada sección tiene su espacio. Elige por dónde empezar.</p>
        </Reveal>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-4">
          {modules.map((module, index) => (
            <li key={module.id}>
              <Reveal delay={(index % 4) * 0.06} className="h-full">
                <Link
                  href={module.href}
                  className={cn(
                    "group relative flex h-full min-h-[240px] flex-col justify-between overflow-hidden rounded-panel p-6 transition-transform duration-500 hover:-translate-y-1 md:min-h-[300px] md:p-7",
                    module.theme.bg,
                    module.theme.text,
                    module.theme.tone === "light" && "ring-1 ring-inset ring-noche/10",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="text-sm font-semibold tabular-nums">{module.number}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-current opacity-60 transition-[opacity,transform] duration-500 group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                  <span>
                    <span aria-hidden="true" className="block h-1.5 w-10 rounded-full" style={{ background: module.theme.accent }} />
                    <span className="mt-4 block font-display text-[clamp(1.7rem,2.6vw,2.3rem)] font-extrabold leading-none tracking-[-0.025em]">{module.label}</span>
                    <span className={cn("mt-2 block text-[15px] leading-snug", module.theme.muted)}>{module.teaser}</span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
