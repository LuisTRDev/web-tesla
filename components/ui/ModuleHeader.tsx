import type { CSSProperties, ReactNode } from "react";
import ModuleMotif from "@/components/ui/ModuleMotif";
import WaveLine from "@/components/ui/WaveLine";
import type { ModuleTheme, Motif, SiteModule } from "@/data/modules";
import { cn } from "@/lib/utils";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** Motivos que ocupan el lado derecho: el texto deja ese espacio libre. */
const reserveRight: Partial<Record<Motif, string>> = {
  escudo: "lg:pr-[40%]",
  escalones: "md:pr-[32%]",
  periodico: "lg:pr-[38%]",
  chispas: "lg:pr-[26%]",
};

interface ModuleHeaderProps {
  module: SiteModule;
  /** Sustituyen la frase, la introducción o el tema del módulo (p. ej., en el detalle de un nivel). */
  title?: string;
  intro?: string | null;
  kicker?: string;
  theme?: ModuleTheme;
  /** Elemento del motivo a resaltar (p. ej., el escalón del nivel actual). */
  highlight?: number;
  /** Título más pequeño, para frases largas (p. ej., el titular de una noticia). */
  compact?: boolean;
  children?: ReactNode;
}

/**
 * Cabecera de cada módulo: número, nombre, frase grande y un motivo gráfico propio.
 * Es lo primero que ve la familia al entrar a una sección, así que cada una se siente distinta.
 */
export default function ModuleHeader({ module, title, intro, kicker, theme = module.theme, highlight, compact = false, children }: ModuleHeaderProps) {
  const text = intro === undefined ? module.intro : intro;

  return (
    <header className={cn("relative isolate overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44", theme.bg, theme.text)}>
      <ModuleMotif motif={module.motif} accent={theme.accent} highlight={highlight} />

      <div className={cn("relative mx-auto max-w-site px-5 md:px-10", reserveRight[module.motif])}>
        <p className="hero-in flex items-center gap-3 text-sm font-semibold" style={delay(0.1)}>
          <span className="tabular-nums">{module.number}</span>
          <span aria-hidden="true" className="h-px w-10 bg-current opacity-40" />
          <span>{kicker ?? module.kicker ?? module.label}</span>
        </p>
        <h1
          className={cn(
            "hero-in mt-6 text-balance font-display font-extrabold leading-[0.92] tracking-[-0.04em]",
            compact ? "max-w-[24ch] text-[clamp(2.1rem,5vw,4.4rem)] leading-[1]" : "max-w-[15ch] text-[clamp(2.7rem,8vw,7rem)]",
          )}
          style={delay(0.2)}
        >
          {title ?? module.title}
        </h1>
        <WaveLine className="mt-8 max-w-md" color={theme.accent} />
        {text && (
          <p className={cn("hero-in mt-6 max-w-2xl text-lg leading-relaxed md:text-xl", theme.muted)} style={delay(0.35)}>
            {text}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
