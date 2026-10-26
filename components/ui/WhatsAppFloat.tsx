"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocialIcon from "@/components/ui/SocialIcon";
import { appearance } from "@/data/appearance";
import { settings } from "@/data/settings";
import { cn, whatsappLink } from "@/lib/utils";

/**
 * Botón flotante de WhatsApp, presente en todo el sitio.
 * Aparece tras bajar un poco (no tapa el hero) y el mensaje indica desde qué página escribe la familia.
 * Queda debajo del menú móvil (z-40), así que no estorba cuando el menú está abierto.
 */
export default function WhatsAppFloat() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { defaultMessage, messages, label, side } = settings.contact.whatsappButton;
  // Mensaje de la página: el de la ruta más específica; si no hay, el de admisión o el general.
  const match = messages
    .filter((entry) => (entry.path === "/" ? pathname === "/" : pathname === entry.path || pathname.startsWith(`${entry.path}/`)))
    .sort((a, b) => b.path.length - a.path.length)[0];
  const message = (match?.message ?? (pathname.startsWith("/admision") ? "Hola, quisiera información sobre la Admisión {año} en la I.E.P. Nikola Tesla." : defaultMessage)).split("{año}").join(String(settings.admissionYear));
  const href = whatsappLink(settings.contact.whatsapp[0] ?? null, message);
  if (!href || !appearance.effects.whatsappFloat) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={cn(
        "group fixed bottom-5 z-30 flex h-14 items-center gap-2.5 rounded-full bg-[#25D366] pl-4 pr-4 text-white shadow-[0_10px_30px_-8px_rgba(7,10,28,0.55)] transition-all duration-500 hover:bg-[#1EBE5A] md:bottom-8 md:pr-5",
        side === "izquierda" ? "left-5 md:left-8" : "right-5 md:right-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0",
      )}
    >
      <SocialIcon name="whatsapp" className="h-7 w-7" />
      {label && <span className="hidden text-[15px] font-semibold md:inline">{label}</span>}
    </a>
  );
}
