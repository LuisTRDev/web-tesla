"use client";

import { useEffect, useState } from "react";
import DraftBadge from "@/components/ui/DraftBadge";
import { settings } from "@/data/settings";
import { cn, formatDate } from "@/lib/utils";

const UNITS = [
  { key: "days", label: "días" },
  { key: "hours", label: "horas" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "seg" },
] as const;

function remaining(deadline: Date, now: number) {
  const total = Math.max(0, deadline.getTime() - now);
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor(total / 3_600_000) % 24,
    minutes: Math.floor(total / 60_000) % 60,
    seconds: Math.floor(total / 1000) % 60,
  };
}

/**
 * Contador regresivo hacia el cierre de inscripciones (settings.admissionDeadline).
 * Se calcula en el navegador para evitar diferencias al hidratar; antes de eso muestra guiones.
 * Sin fecha configurada no se muestra nada.
 */
export default function Countdown({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const iso = settings.admissionDeadline;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!iso) return null;
  // Cierra al final del día indicado.
  const deadline = new Date(`${iso}T23:59:59`);
  const time = now === null ? null : remaining(deadline, now);
  const closed = time !== null && time.total === 0;
  const dark = tone === "dark";

  return (
    <div className={className}>
      <p className={cn("text-sm font-semibold uppercase tracking-[0.08em]", dark ? "text-white/70" : "text-noche/70")}>
        {closed ? "Inscripciones cerradas" : `Inscripciones abiertas hasta el ${formatDate(iso)}`}
        <DraftBadge label="Fecha por confirmar" tone={dark ? "dark" : "light"} className="ml-3 normal-case tracking-normal" />
      </p>
      {!closed && (
        <div role="timer" aria-label="Tiempo restante de inscripciones" className="mt-4 flex gap-3 md:gap-4">
          {UNITS.map(({ key, label }) => (
            <div
              key={key}
              className={cn(
                "flex min-w-[68px] flex-col items-center rounded-2xl border px-3 py-3 md:min-w-[92px] md:py-4",
                dark ? "border-white/20 bg-white/10 backdrop-blur-sm" : "border-noche/25 bg-noche/10",
              )}
            >
              <span
                className={cn("font-display text-3xl font-extrabold tabular-nums leading-none md:text-5xl", dark && "text-filamento [text-shadow:0_0_22px_rgba(255,182,39,0.55)]")}
                suppressHydrationWarning
              >
                {time ? String(time[key]).padStart(2, "0") : "--"}
              </span>
              <span className={cn("mt-2 text-[11px] font-medium uppercase tracking-[0.08em]", dark ? "text-white/65" : "text-noche/70")}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
