import CountUp from "@/components/ui/CountUp";
import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import SchoolImage from "@/components/ui/SchoolImage";
import WaveLine from "@/components/ui/WaveLine";
import { aboutText } from "@/data/philosophy";
import { settings } from "@/data/settings";
import { palette } from "@/data/appearance";

/** NOSOTROS: composición editorial con titular, texto, dos fotografías, cita y cifras. */
export default function About() {
  return (
    <section id="nosotros" className="relative bg-tiza py-24 md:py-36">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-balance font-display text-[clamp(3rem,9.5vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em] text-noche">
                {aboutText.title}
              </h2>
            </Reveal>
            <WaveLine className="mt-8 max-w-sm" color={palette.filamento600} />
          </div>
          <div className="lg:col-span-5 lg:pt-6">
            <Reveal delay={0.1}>
              {!aboutText.confirmed && <DraftBadge label="Texto propuesto" className="mb-4" />}
              {aboutText.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-5 text-lg leading-relaxed text-tinta/85 md:text-xl">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <SchoolImage
              src={settings.images.about}
              alt="Estudiantes en clase"
              label="Estudiantes y docente en clase (horizontal)"
              tone="light"
              className="aspect-[4/3] rounded-panel md:aspect-[16/10]"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </Reveal>

          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <Reveal delay={0.12}>
              <blockquote className="text-balance font-display text-[clamp(1.9rem,4.2vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.025em] text-noche">
                “{aboutText.quote}”
              </blockquote>
            </Reveal>
            <Reveal delay={0.2} className="hidden lg:block">
              <SchoolImage
                src={settings.images.aboutDetail}
                alt="Detalle de una actividad escolar"
                label="Detalle: manos trabajando, experimento o proyecto"
                tone="light"
                className="aspect-[5/4] rounded-panel"
                sizes="36vw"
              />
            </Reveal>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-1 border-t border-noche/15 sm:grid-cols-3 lg:mt-24">
          {settings.stats.map((stat, index) => (
            <Reveal key={stat.id} delay={index * 0.08} className="flex flex-col-reverse border-b border-noche/15 py-7 sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0">
              <dt className="mt-3 text-[15px] font-medium text-niebla">{stat.label}</dt>
              <dd className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.03em] text-noche">
                {stat.value ? <CountUp value={stat.value} /> : <span className="text-noche/30">[DATO]</span>}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
