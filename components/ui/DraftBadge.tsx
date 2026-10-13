import { settings } from "@/data/settings";
import { cn } from "@/lib/utils";

/**
 * Etiqueta visible para contenido provisional (propuestas, ejemplos, datos sin confirmar).
 * Se oculta en todo el sitio con `showDraftBadges: false` en data/settings.ts.
 */
export default function DraftBadge({
  label = "Por confirmar",
  tone = "light",
  className,
}: {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  if (!settings.showDraftBadges) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dashed px-2.5 py-0.5 align-middle text-[11px] font-medium leading-5",
        tone === "light" ? "border-tinta/35 text-tinta/70" : "border-white/40 text-white/75",
        className,
      )}
    >
      {label}
    </span>
  );
}
