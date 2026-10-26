import Image from "next/image";
import Illustration, { hasIllustration } from "@/components/ui/Illustration";
import { cn } from "@/lib/utils";

interface SchoolImageProps {
  /** Ruta o URL de la foto real. Si es null se muestra un placeholder claramente identificado. */
  src?: string | null;
  alt: string;
  /** Descripción de la foto que debería ir aquí. Se muestra en el placeholder. */
  label: string;
  /** true = ocupa todo el contenedor padre (que debe tener position). */
  cover?: boolean;
  tone?: "dark" | "light";
  className?: string;
  imgClassName?: string;
  /** Posición del rótulo del placeholder dentro del marco. */
  labelClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Ilustración de línea que se muestra en lugar del placeholder mientras no hay foto (ver Illustration.tsx). */
  illustration?: string;
}

/**
 * ÚNICO punto de entrada para fotografías del colegio.
 * Para reemplazar un placeholder basta con pasar `src` (desde /data o desde el CMS).
 * Usa next/image: formatos modernos, tamaños responsivos y carga diferida automática.
 */
export default function SchoolImage({
  src,
  alt,
  label,
  cover = false,
  tone = "dark",
  className,
  imgClassName,
  labelClassName = "items-end justify-start",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  illustration,
}: SchoolImageProps) {
  return (
    <div
      className={cn(
        cover ? "absolute inset-0" : "relative",
        "overflow-hidden",
        tone === "dark" ? "bg-noche-700" : "bg-tiza-300",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", imgClassName)} />
      ) : hasIllustration(illustration) ? (
        <Illustration name={illustration} tone={tone} />
      ) : (
        <div
          role="img"
          aria-label={`Fotografía pendiente: ${label}`}
          className={cn(
            "absolute inset-0 flex p-4 md:p-5",
            tone === "dark" ? "ph-dark text-white/65" : "ph-light text-tinta/60",
            labelClassName,
            imgClassName,
          )}
        >
          <span className="max-w-[22ch] text-[11px] font-medium leading-snug">
            [FOTO PENDIENTE]
            <br />
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
