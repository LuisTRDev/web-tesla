import { NextResponse } from "next/server";
import { settings } from "@/data/settings";
import { todayISO } from "@/lib/utils";
import { QR_ANIMATIONS, qrSplashResponse, type QrAnimation } from "@/lib/qr-splash";

/**
 * Enlace corto de los QR impresos: /qr/<lugar> → página de campaña con el origen (utm) para medir cada medio.
 * - Los QR impresos nunca cambian; el destino sí: si ya pasó la fecha de cierre de inscripciones
 *   (settings.admissionDeadline), llevan a la página de Admisión en lugar de la de campaña.
 * - Si el colegio eligió una animación (settings.qrIntro), se muestra un instante antes de entrar; con ?anim=<nombre> se puede probar otra.
 * - Lleva el origen como utm_source (p. ej. "volante" o "volante-014" para códigos numerados).
 */
export function qrRedirect(request: Request, canal?: string) {
  const source = (canal ?? "qr").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "qr";
  const closed = !!settings.admissionDeadline && todayISO() > settings.admissionDeadline;
  const dest = closed ? "campana" : settings.qrIntro.destination;
  const phone = settings.contact.whatsapp[0];
  const path = closed ? "/admision" : dest === "contacto" ? "/contacto" : dest === "inicio" ? "/" : `/admision-${settings.admissionYear}`;
  // WhatsApp directo: si no hay número escrito en el panel, cae a la página de campaña
  const toWhatsapp = dest === "whatsapp" && !!phone;
  const url = toWhatsapp ? new URL(`https://wa.me/${phone}`) : new URL(path, request.url);
  if (toWhatsapp) url.searchParams.set("text", settings.contact.whatsappButton.defaultMessage);
  else {
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", "impreso");
    url.searchParams.set("utm_campaign", `admision-${settings.admissionYear}`);
  }
  const asked = new URL(request.url).searchParams.get("anim");
  const anim = (QR_ANIMATIONS as readonly string[]).includes(asked ?? "") ? (asked as QrAnimation) : settings.qrIntro.animation;
  if (anim === "ninguna") return NextResponse.redirect(url, 307);
  return qrSplashResponse({
    anim,
    dest: url.toString(),
    name: settings.shortName,
    line: settings.qrIntro.text,
    seconds: settings.qrIntro.seconds,
    logo: "/images/logo-escudo.png",
  });
}
