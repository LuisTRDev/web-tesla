import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import { settings } from "@/data/settings";
import { addDays, cn, formatEventDates, parseISODate } from "@/lib/utils";
import type { SchoolEvent } from "@/types";

const categoryColors: Record<string, string> = {
  Reunión: "bg-marino text-white",
  Académico: "bg-noche text-white",
  Cultural: "bg-rojo-700 text-white",
  Deportivo: "bg-rojo-700 text-white",
  Admisión: "bg-filamento text-noche",
  Feriado: "bg-arco-100 text-noche",
  Otro: "bg-tiza-200 text-noche",
};

const compact = (iso: string) => iso.replace(/-/g, "");

/** Enlace para agregar el evento a Google Calendar (el archivo .ics sirve para el resto de calendarios). */
export function googleCalendarUrl(event: SchoolEvent): string {
  const end = addDays(event.endDate ?? event.date, 1);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${compact(event.date)}/${compact(end)}`,
    details: [event.time ? `Hora: ${event.time}` : "", event.description ?? "", settings.name].filter(Boolean).join("\n"),
    location: event.place ?? `${settings.location.address}, ${settings.location.district}, ${settings.location.province}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function EventCard({ event, tone = "light" }: { event: SchoolEvent; tone?: "light" | "dark" }) {
  const date = parseISODate(event.date);
  const month = new Intl.DateTimeFormat("es-PE", { month: "short" }).format(date).replace(".", "");
  const weekday = new Intl.DateTimeFormat("es-PE", { weekday: "long" }).format(date);
  const dark = tone === "dark";
  const linkClass = cn("underline decoration-2 underline-offset-4", dark ? "text-white" : "text-noche");

  return (
    <article className={cn("flex h-full gap-5 rounded-panel p-5 md:p-6", dark ? "bg-white/[0.06] ring-1 ring-white/15" : "bg-white ring-1 ring-noche/10")}>
      <div aria-hidden="true" className={cn("flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl", categoryColors[event.category] ?? categoryColors.Otro)}>
        <span className="font-display text-3xl font-extrabold leading-none">{date.getDate()}</span>
        <span className="mt-1 text-[12px] font-bold uppercase tracking-[0.08em]">{month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold", dark ? "text-white/70" : "text-niebla")}>
          <span>{event.category}</span>
          <span className="font-normal capitalize">
            <time dateTime={event.date}>{event.endDate ? formatEventDates(event.date, event.endDate) : weekday}</time>
            {event.time ? ` · ${event.time}` : ""}
          </span>
          {event.isPlaceholder && <DraftBadge label="Ejemplo" tone={tone} />}
        </p>
        <h3 className={cn("mt-1.5 font-display text-xl font-bold leading-tight tracking-[-0.01em] md:text-2xl", dark ? "text-white" : "text-noche")}>{event.title}</h3>
        {event.place && <p className={cn("mt-1 text-[15px]", dark ? "text-white/70" : "text-niebla")}>{event.place}</p>}
        {event.description && <p className={cn("mt-3 text-[15px] leading-relaxed", dark ? "text-white/80" : "text-tinta/85")}>{event.description}</p>}
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold">
          <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer" className={cn("underline decoration-2 underline-offset-4", dark ? "text-filamento" : "text-noche")}>
            Agregar a Google Calendar
          </a>
          <a href={`/calendario/${event.slug}/ics`} download className={linkClass}>
            Descargar (.ics)
          </a>
          {event.link &&
            (/^https?:\/\//.test(event.link) ? (
              <a href={event.link} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {event.linkText ?? "Más información"}
              </a>
            ) : (
              <Link href={event.link} className={linkClass}>
                {event.linkText ?? "Más información"}
              </Link>
            ))}
        </p>
      </div>
    </article>
  );
}

/** PRÓXIMOS EVENTOS (portada): los siguientes eventos del calendario. No se muestra si no hay ninguno. */
export default function Events({ events }: { events: SchoolEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section id="calendario" aria-labelledby="calendario-titulo" className="bg-noche py-24 text-white md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <Reveal className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 id="calendario-titulo" className="max-w-[16ch] text-balance font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
            Próximos eventos.
          </h2>
          <ButtonLink href="/calendario" variant="outline-light" className="self-start md:self-auto">
            Ver el calendario completo
          </ButtonLink>
        </Reveal>
        <ul className="grid gap-4 lg:grid-cols-2">
          {events.map((event, index) => (
            <li key={event.slug}>
              <Reveal delay={(index % 2) * 0.06} className="h-full">
                <EventCard event={event} tone="dark" />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
