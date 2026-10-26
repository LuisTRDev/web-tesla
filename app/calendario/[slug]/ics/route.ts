import { events } from "@/data/events";
import { settings } from "@/data/settings";
import { addDays } from "@/lib/utils";

/** Descarga de un evento en formato .ics (Apple, Outlook, Google Calendar…). Se genera al construir la web. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

const escape = (value: string) => value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const compact = (iso: string) => iso.replace(/-/g, "");

export function GET(_request: Request, { params }: { params: { slug: string } }) {
  const event = events.find((item) => item.slug === params.slug);
  if (!event) return new Response("No encontrado", { status: 404 });

  const where = event.place ?? `${settings.location.address}, ${settings.location.district}, ${settings.location.province}`;
  const description = [event.time ? `Hora: ${event.time}` : "", event.description ?? "", settings.name].filter(Boolean).join("\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${settings.shortName}//Calendario//ES`,
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@${new URL(settings.siteUrl).hostname}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;VALUE=DATE:${compact(event.date)}`,
    `DTEND;VALUE=DATE:${compact(addDays(event.endDate ?? event.date, 1))}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(description)}`,
    `LOCATION:${escape(where)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(lines.join("\r\n"), {
    headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": `attachment; filename="${event.slug}.ics"` },
  });
}
