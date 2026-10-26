import { EventCard } from "@/components/sections/Events";
import ModuleHeader from "@/components/ui/ModuleHeader";
import Reveal from "@/components/ui/Reveal";
import { calendarTheme, pageModule } from "@/data/modules";
import { settings } from "@/data/settings";
import { getPastEvents, getUpcomingEvents } from "@/lib/data";
import { moduleMetadata } from "@/lib/seo";
import { parseISODate } from "@/lib/utils";
import type { SchoolEvent } from "@/types";

const mod = pageModule({
  id: "calendario",
  label: "Calendario",
  title: "Lo que viene en Nikola Tesla.",
  intro: "Reuniones, actividades, celebraciones y fechas importantes del año escolar. Agrégalas a tu calendario con un clic.",
  seoDescription: `Calendario de eventos, reuniones y actividades de la Institución Educativa Privada “Nikola Tesla” de ${settings.location.district}, ${settings.location.province}.`,
  motif: "ondas",
  theme: calendarTheme,
});

export const metadata = moduleMetadata(mod, "Calendario de eventos");

const monthOf = (iso: string) => new Intl.DateTimeFormat("es-PE", { month: "long", year: "numeric" }).format(parseISODate(iso));

function groupByMonth(items: SchoolEvent[]): Array<[string, SchoolEvent[]]> {
  const groups = new Map<string, SchoolEvent[]>();
  for (const item of items) groups.set(monthOf(item.date), [...(groups.get(monthOf(item.date)) ?? []), item]);
  return Array.from(groups.entries());
}

export default async function CalendarPage() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  // Los eventos de ejemplo no se envían a Google.
  const real = upcoming.filter((event) => !event.isPlaceholder);

  const jsonLd = real.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: event.place ?? settings.name, address: `${settings.location.address}, ${settings.location.district}, ${settings.location.province}` },
    ...(event.description ? { description: event.description } : {}),
    organizer: { "@type": "Organization", name: settings.name, url: settings.siteUrl },
  }));

  return (
    <>
      <ModuleHeader module={mod} />
      <section className="bg-tiza py-16 md:py-24">
        <div className="mx-auto max-w-site px-5 md:px-10">
          {upcoming.length === 0 ? (
            <p className="max-w-xl text-lg text-niebla">Por ahora no hay eventos programados. Vuelve pronto o escríbenos por WhatsApp.</p>
          ) : (
            <div className="space-y-14">
              {groupByMonth(upcoming).map(([month, items]) => (
                <div key={month}>
                  <h2 className="mb-5 font-display text-2xl font-extrabold capitalize tracking-[-0.02em] text-noche md:text-3xl">{month}</h2>
                  <ul className="grid gap-4 lg:grid-cols-2">
                    {items.map((event, index) => (
                      <li key={event.slug}>
                        <Reveal delay={(index % 2) * 0.06} className="h-full">
                          <EventCard event={event} />
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <details className="mt-16 border-t border-noche/15 pt-8">
              <summary className="cursor-pointer font-display text-xl font-bold text-noche">Eventos pasados ({past.length})</summary>
              <ul className="mt-6 grid gap-3 md:grid-cols-2">
                {past.slice(0, 20).map((event) => (
                  <li key={event.slug} className="flex gap-3 text-[15px] text-niebla">
                    <time dateTime={event.date} className="w-28 shrink-0 font-semibold text-noche">
                      {new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric" }).format(parseISODate(event.date))}
                    </time>
                    <span>{event.title}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </section>
      {jsonLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}
