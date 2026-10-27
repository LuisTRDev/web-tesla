"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
}

interface Props {
  steps: TimelineStep[];
  /** Cierre de inscripciones (AAAA-MM-DD). Si falta, la línea termina en el último paso. */
  deadline: string | null;
  deadlineLabel: string;
}

/**
 * Línea de tiempo del proceso de admisión. Una línea de energía baja con el scroll, enciende cada hito al pasar
 * y llega al cierre de inscripciones (con los días que faltan). Sin JavaScript o con "reducir movimiento" se ve completa.
 */
export default function AdmissionTimeline({ steps, deadline, deadlineLabel }: Props) {
  const box = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(1);
  const [days, setDays] = useState<number | null>(null);
  const total = steps.length + (deadline ? 1 : 0);

  useEffect(() => {
    if (deadline) {
      const ms = new Date(`${deadline}T23:59:59`).getTime() - Date.now();
      setDays(ms > 0 ? Math.ceil(ms / 86_400_000) : 0);
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = box.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const reach = window.innerHeight * 0.62;
      setProgress(Math.max(0, Math.min(1, (reach - r.top) / r.height)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [deadline]);

  const lit = (index: number) => progress >= (index + 0.35) / total;

  return (
    <ol ref={box} className="relative mt-12 space-y-10 pl-14 md:pl-20">
      <span aria-hidden="true" className="absolute bottom-3 left-[19px] top-3 w-[3px] rounded-full bg-noche/20 md:left-[27px]" />
      <span
        aria-hidden="true"
        className="absolute left-[19px] top-3 w-[3px] origin-top rounded-full bg-noche shadow-[0_0_14px_rgba(13,18,48,0.55)] md:left-[27px]"
        style={{ height: `calc((100% - 1.5rem) * ${progress})` }}
      />
      <span
        aria-hidden="true"
        className="absolute left-[12px] h-[17px] w-[17px] rounded-full bg-white shadow-[0_0_0_4px_rgba(13,18,48,0.9),0_0_22px_6px_rgba(255,255,255,0.9)] md:left-[20px]"
        style={{ top: `calc(0.75rem + (100% - 1.5rem) * ${progress} - 8px)`, opacity: progress > 0.01 && progress < 0.995 ? 1 : 0, transition: "opacity .3s" }}
      />
      {steps.map((step, index) => (
        <li key={step.id} className={cn("relative transition-all duration-700", lit(index) ? "opacity-100" : "opacity-45")}>
          <span
            className={cn(
              "absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-noche font-display text-lg font-extrabold transition-all duration-500 md:-left-20 md:h-14 md:w-14 md:text-2xl",
              lit(index) ? "scale-100 bg-noche text-filamento shadow-[0_0_0_6px_rgba(13,18,48,0.15)]" : "scale-90 bg-filamento text-noche",
            )}
          >
            {index + 1}
          </span>
          <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">{step.title}</h3>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-noche/75">{step.description}</p>
        </li>
      ))}
      {deadline && (
        <li className={cn("relative transition-all duration-700", lit(steps.length) ? "opacity-100" : "opacity-45")}>
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-noche text-xl transition-all duration-500 md:-left-20 md:h-14 md:w-14 md:text-2xl",
              lit(steps.length) ? "bg-rojo text-white shadow-[0_0_0_6px_rgba(224,60,38,0.25)]" : "bg-filamento",
            )}
          >
            ⚡
          </span>
          <h3 className="font-display text-2xl font-bold leading-tight md:text-3xl">Cierre de inscripciones</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-noche/75">
            {deadlineLabel}
            {days !== null && days > 0 && <strong className="ml-2 rounded-full bg-noche px-3 py-1 text-sm text-filamento">Faltan {days} {days === 1 ? "día" : "días"}</strong>}
            {days === 0 && <strong className="ml-2 rounded-full bg-noche px-3 py-1 text-sm text-white">Inscripciones cerradas</strong>}
          </p>
        </li>
      )}
    </ol>
  );
}
