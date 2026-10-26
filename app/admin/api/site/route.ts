import { levels } from "@/data/levels";
import { settings } from "@/data/settings";

/** Datos del colegio para las herramientas del panel (generador de enlaces y de QR). */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      name: settings.name,
      shortName: settings.shortName,
      kicker: settings.kicker,
      tagline: settings.tagline,
      year: settings.admissionYear,
      siteUrl: settings.siteUrl,
      deadline: settings.admissionDeadline,
      location: settings.location,
      whatsapp: settings.contact.whatsapp,
      hours: settings.contact.hours,
      social: settings.social,
      images: { hero: settings.images.hero },
      levels: levels.map((level) => level.name),
    },
    { headers: { "x-robots-tag": "noindex, nofollow", "cache-control": "no-store" } },
  );
}
