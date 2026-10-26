import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import SchoolImage from "@/components/ui/SchoolImage";
import type { Activity } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Composición tipo revista: cada posición tiene un tamaño distinto.
 * Móvil (2 columnas) y escritorio (12 columnas) tienen su propio ritmo.
 * Si hay más actividades que posiciones, el patrón se repite.
 */
const layout = [
  "col-span-2 row-span-2 lg:col-span-7 lg:row-span-2",
  "col-span-1 row-span-2 lg:col-span-5 lg:row-span-1",
  "col-span-1 row-span-1 lg:col-span-5 lg:row-span-1",
  "col-span-1 row-span-1 lg:col-span-4 lg:row-span-2",
  "col-span-2 row-span-1 lg:col-span-4 lg:row-span-1",
  "col-span-1 row-span-2 lg:col-span-4 lg:row-span-1",
  "col-span-1 row-span-1 lg:col-span-4 lg:row-span-1",
  "col-span-1 row-span-1 lg:col-span-4 lg:row-span-1",
];

export default function Activities({ activities, showIntro = true }: { activities: Activity[]; showIntro?: boolean }) {
  const hasDrafts = activities.some((activity) => !activity.confirmed);

  return (
    <section id="actividades" className={cn("bg-white", showIntro ? "py-24 md:py-36" : "py-16 md:py-24")}>
      <div className="mx-auto max-w-site px-5 md:px-10">
        {showIntro ? (
          <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 className="text-balance font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-noche lg:col-span-9">
              Aprender también ocurre fuera del aula.
            </h2>
            <div className="lg:col-span-3">
              <p className="text-lg leading-relaxed text-niebla">Talleres y actividades para que cada estudiante encuentre lo suyo.</p>
              {hasDrafts && <DraftBadge label="Actividades de ejemplo" className="mt-4" />}
            </div>
          </Reveal>
        ) : (
          hasDrafts && <DraftBadge label="Actividades de ejemplo" />
        )}

        <ul className="mt-10 grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[200px] lg:mt-20 lg:auto-rows-[230px] lg:grid-cols-12 lg:gap-4">
          {activities.map((activity, index) => (
            <li key={activity.id} data-spark className={cn("group relative overflow-hidden rounded-3xl text-white", layout[index % layout.length])}>
              <SchoolImage
                cover
                src={activity.image}
                alt={`Actividad: ${activity.title}`}
                label={`Foto de ${activity.title}`}
                illustration={activity.id}
                sizes="(min-width: 1024px) 50vw, 100vw"
                imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                labelClassName="items-start justify-start"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noche/90 via-noche/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <h3 className="font-display text-[clamp(1.25rem,2.6vw,2.2rem)] font-bold leading-none tracking-[-0.02em]">{activity.title}</h3>
                <p className="mt-2 hidden max-w-xs text-[15px] leading-snug text-white/80 transition-opacity duration-500 md:block lg:opacity-0 lg:group-hover:opacity-100">
                  {activity.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
