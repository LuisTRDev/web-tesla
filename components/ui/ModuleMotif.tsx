import Image from "next/image";
import type { CSSProperties } from "react";
import type { Motif } from "@/data/modules";
import { cn } from "@/lib/utils";
import escudo from "@/public/images/logo-escudo.png";
import { palette } from "@/data/appearance";

/**
 * Motivo gráfico de cada módulo: decoración de fondo que le da carácter a su cabecera.
 * Todos son decorativos (aria-hidden) y no interceptan clics.
 */

/** Destellos de cuatro puntas para Actividades: [x, y, tamaño, opacidad]. */
const sparks: Array<[number, number, number, number]> = [
  [770, 190, 30, 0.9],
  [905, 170, 18, 0.6],
  [700, 300, 14, 0.5],
  [960, 290, 22, 0.7],
  [830, 360, 26, 0.8],
  [960, 430, 12, 0.5],
  [725, 455, 16, 0.6],
  [885, 480, 30, 0.9],
];

const sparkPath = (x: number, y: number, s: number) =>
  `M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s}Z`;

function FilmStrip({ className }: { className: string }) {
  return (
    <div className={`absolute inset-x-0 flex h-7 items-center gap-3 overflow-hidden border-white/10 bg-black/30 px-3 ${className}`}>
      {Array.from({ length: 60 }, (_, index) => (
        <span key={index} className="h-3 w-5 shrink-0 rounded-[3px] bg-white/[0.14]" />
      ))}
    </div>
  );
}

/** `highlight`: índice del elemento a resaltar (solo lo usa el motivo de escalones). */
export default function ModuleMotif({ motif, accent, highlight }: { motif: Motif; accent: string; highlight?: number }) {
  switch (motif) {
    // Nosotros: el escudo oficial, protagonista de la identidad.
    case "escudo":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <svg viewBox="0 0 800 800" className="absolute -right-56 top-10 h-[760px] w-[760px] text-noche/[0.07]" fill="none" stroke="currentColor">
            {[140, 210, 280, 350].map((radius) => (
              <circle key={radius} cx="400" cy="400" r={radius} strokeWidth="1.2" />
            ))}
          </svg>
          <div className="hero-in absolute right-[6%] top-1/2 hidden w-[min(30vw,380px)] -translate-y-[42%] lg:block" style={{ "--d": "0.45s" } as CSSProperties}>
            <Image src={escudo} alt="" sizes="380px" priority className="h-auto w-full drop-shadow-[0_24px_40px_rgba(13,18,48,0.18)]" />
          </div>
        </div>
      );

    // Propuesta: plano técnico, como la mesa de trabajo de un inventor.
    case "plano":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-[0.09]"
            style={{
              backgroundImage: `linear-gradient(to right, ${accent} 1px, transparent 1px), linear-gradient(to bottom, ${accent} 1px, transparent 1px)`,
              backgroundSize: "96px 96px",
            }}
          />
          <svg viewBox="0 0 400 400" className="absolute -right-24 top-16 h-[520px] w-[520px] opacity-40" fill="none" stroke={accent}>
            <circle cx="200" cy="200" r="150" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="200" cy="200" r="90" strokeWidth="1" />
            <path d="M200 20v360M20 200h360" strokeWidth="0.8" />
            <circle cx="200" cy="200" r="5" fill={accent} />
            <circle cx="306" cy="94" r="3.5" fill={accent} />
            <path d="M200 200L306 94" strokeWidth="1" />
          </svg>
        </div>
      );

    // Niveles: dos escalones que suben, uno por nivel (Primaria y Secundaria). En el detalle de un nivel, solo se enciende el suyo.
    case "escalones":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute bottom-0 right-[4%] hidden h-[78%] w-[24%] items-end gap-3 md:flex">
            {[
              { height: "55%", color: palette.rojo },
              { height: "90%", color: palette.arco },
            ].map((step, index) => {
              const dimmed = highlight !== undefined && highlight !== index;
              return (
                <span
                  key={step.color}
                  className={cn("hero-in flex-1 rounded-t-[22px]", dimmed ? "bg-current opacity-15" : "opacity-90")}
                  style={
                    {
                      height: step.height,
                      background: dimmed ? undefined : highlight === undefined ? step.color : accent,
                      "--d": `${0.3 + index * 0.12}s`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>
        </div>
      );

    // Actividades: destellos de energía.
    case "chispas":
      return (
        <svg aria-hidden="true" viewBox="0 0 1000 560" preserveAspectRatio="xMaxYMid slice" className="pointer-events-none absolute inset-0 -z-10 h-full w-full">
          {sparks.map(([x, y, size, opacity], index) => (
            <path key={index} d={sparkPath(x, y, size)} fill={index % 3 === 0 ? accent : "#FFFFFF"} opacity={opacity * 0.55} />
          ))}
          <circle cx="850" cy="320" r="170" fill="none" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="1.5" />
        </svg>
      );

    // Galería: perforaciones de película, como una sala de cine.
    case "pelicula":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <FilmStrip className="top-[72px] border-y" />
          <FilmStrip className="bottom-0 border-t" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,182,39,0.12),transparent_60%)]" />
        </div>
      );

    // Noticias: filetes y columnas de periódico.
    case "periodico":
      return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-0 hidden w-[34%] gap-6 border-l border-noche/10 px-6 lg:flex">
            {[0, 1, 2].map((column) => (
              <div key={column} className="flex flex-1 flex-col gap-2.5 pt-40">
                {Array.from({ length: 22 }, (_, line) => (
                  <span key={line} className="h-[3px] rounded-full bg-noche/[0.07]" style={{ width: `${70 + ((line * 37 + column * 11) % 30)}%` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      );

    // Admisión: ondas que se expanden, una invitación.
    case "ondas":
      return (
        <svg aria-hidden="true" viewBox="0 0 800 800" className="pointer-events-none absolute -right-[300px] top-1/2 -z-10 h-[680px] w-[680px] -translate-y-1/2 text-noche/[0.14]" fill="none" stroke="currentColor">
          {[90, 160, 230, 300, 370].map((radius) => (
            <circle key={radius} cx="400" cy="400" r={radius} strokeWidth="1.5" />
          ))}
        </svg>
      );

    // Contacto: curvas de nivel y un punto en el mapa.
    case "relieve":
      return (
        <svg aria-hidden="true" viewBox="0 0 600 500" preserveAspectRatio="xMaxYMid slice" className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-noche/[0.09]" fill="none" stroke="currentColor">
          {[0, 1, 2, 3, 4, 5].map((ring) => {
            const k = 40 + ring * 34;
            return (
              <path
                key={ring}
                d={`M${490 - k} 250 C${490 - k} ${200 - k * 0.6}, ${490 + k * 0.9} ${190 - k * 0.7}, ${490 + k} 250 S${490 - k * 0.4} ${310 + k * 0.8}, ${490 - k} 250Z`}
                strokeWidth="1.3"
              />
            );
          })}
          <path d="M490 226c-11 0-20 9-20 20 0 15 20 34 20 34s20-19 20-34c0-11-9-20-20-20z" fill={accent} stroke="none" />
          <circle cx="490" cy="246" r="7" fill="#FFFFFF" stroke="none" />
        </svg>
      );
  }
}
