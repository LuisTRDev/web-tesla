"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { campaignTag, captureCampaign, trackEvent } from "@/lib/track";

/**
 * Seguimiento global de contactos, sin tocar cada botón:
 * - Guarda el origen del anuncio (utm_*) al entrar a la web.
 * - Cada clic en un enlace de WhatsApp se registra como evento `whatsapp_click` en Analytics,
 *   con la página desde la que se escribió, y el mensaje lleva el origen: "(vía facebook)".
 */
export default function ClickTracker() {
  const pathname = usePathname();

  useEffect(() => captureCampaign(), [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href^='https://wa.me/']") as HTMLAnchorElement | null;
      if (!link) return;
      const tag = campaignTag();
      if (tag && !link.href.includes(encodeURIComponent(tag))) {
        const url = new URL(link.href);
        const text = url.searchParams.get("text");
        if (text) {
          url.searchParams.set("text", `${text}${tag}`);
          link.href = url.toString();
        }
      }
      trackEvent("whatsapp_click", { page: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
