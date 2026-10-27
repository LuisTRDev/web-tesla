import { settings } from "@/data/settings";
import { qrScannerResponse } from "@/lib/qr-scanner";

export const dynamic = "force-dynamic";

/** Escáner Tesla: cámara con el efecto elegido en el panel (Datos del colegio → Animación del QR) sobre el QR. */
export function GET() {
  return qrScannerResponse({
    anim: settings.qrIntro.animation,
    name: settings.shortName,
    seconds: settings.qrIntro.seconds,
    logo: "/images/logo-escudo.png",
  });
}
