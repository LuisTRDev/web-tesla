import Image from "next/image";
import { settings } from "@/data/settings";
import { cn } from "@/lib/utils";
import escudo from "@/public/images/logo-escudo.png";

/**
 * Logotipo oficial: escudo de la institución + nombre.
 * El archivo vive en public/images/logo-escudo.png (fondo transparente).
 */
export default function Logo({ className, showKicker = true }: { className?: string; showKicker?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image src={escudo} alt="" priority sizes="48px" className="h-12 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-extrabold uppercase tracking-[0.02em]">{settings.shortName}</span>
        {showKicker && <span className="mt-1 text-[10.5px] font-medium opacity-70">{settings.kicker}</span>}
      </span>
    </span>
  );
}
