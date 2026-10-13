import Link from "next/link";
import { getNextModule } from "@/data/modules";
import { cn } from "@/lib/utils";

/** Cierre de cada módulo: invita a pasar al siguiente, ya vestido con el color de ese módulo. */
export default function NextModule({ current }: { current: string }) {
  const next = getNextModule(current);

  return (
    <nav aria-label="Siguiente sección" className={cn(next.theme.bg, next.theme.text)}>
      <Link href={next.href} className="group block">
        <div className="mx-auto flex max-w-site items-end justify-between gap-8 px-5 py-16 md:px-10 md:py-24">
          <div>
            <p className="flex items-center gap-3 text-sm font-semibold">
              <span>Siguiente</span>
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
              <span className="tabular-nums">{next.number}</span>
            </p>
            <p className="mt-4 font-display text-[clamp(2.4rem,7vw,6rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">{next.label}</p>
            <p className={cn("mt-4 max-w-md text-lg", next.theme.muted)}>{next.teaser}</p>
          </div>
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-current transition-transform duration-500 group-hover:translate-x-2 md:h-24 md:w-24"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-8 md:w-8" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </Link>
    </nav>
  );
}
