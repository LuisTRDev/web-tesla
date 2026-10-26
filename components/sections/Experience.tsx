import Reveal from "@/components/ui/Reveal";
import SchoolImage from "@/components/ui/SchoolImage";
import { experienceShots, experienceWords } from "@/data/experience";

/**
 * EXPERIENCIA: fotografías grandes en formato cinematográfico con rótulos flotantes,
 * y una cinta de verbos que se desplaza muy despacio.
 */
export default function Experience() {
  const [main, ...rest] = experienceShots;
  const words = [...experienceWords, ...experienceWords];

  return (
    <section aria-labelledby="experiencia-titulo" className="overflow-hidden bg-noche py-24 text-white md:py-36">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <Reveal>
          <h2 id="experiencia-titulo" className="text-balance font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
            Así se vive Nikola Tesla.
          </h2>
        </Reveal>

        <Reveal className="mt-12 md:mt-16">
          <figure className="relative">
            <SchoolImage
              src={main.image}
              alt={main.caption}
              label={`Gran fotografía horizontal: ${main.label}`}
              illustration={main.illustration}
              className="aspect-[4/5] rounded-panel sm:aspect-[16/9] lg:aspect-[21/9]"
              sizes="100vw"
              labelClassName="items-start justify-start"
            />
            <figcaption className="absolute bottom-5 left-5 max-w-[16rem] rounded-2xl bg-white px-5 py-4 text-noche md:bottom-8 md:left-8">
              <span className="block text-[13px] font-semibold text-niebla">{main.label}</span>
              <span className="mt-1 block font-display text-xl font-bold leading-tight tracking-[-0.01em]">{main.caption}</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {rest.map((shot, index) => (
            <Reveal key={shot.id} delay={index * 0.1} className={index === 1 ? "md:translate-y-10" : undefined}>
              <figure className="relative">
                <SchoolImage
                  src={shot.image}
                  alt={shot.caption}
                  label={`Foto: ${shot.label}`}
                  illustration={shot.illustration}
                  className="aspect-[4/3] rounded-3xl md:aspect-[4/5]"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  labelClassName="items-start justify-start"
                />
                <figcaption className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-gradient-to-t from-noche/95 to-transparent p-5 pt-16">
                  <span className="block text-[13px] font-semibold text-filamento">{shot.label}</span>
                  <span className="mt-1 block text-lg font-medium leading-snug">{shot.caption}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="mt-24 flex overflow-hidden md:mt-36">
        <div className="marquee-track flex shrink-0 items-center whitespace-nowrap">
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className="flex items-center font-display text-[clamp(3rem,9vw,8rem)] font-extrabold leading-none tracking-[-0.04em] text-white/[0.09]">
              {word}
              <span className="mx-8 inline-block h-3 w-3 rounded-full bg-filamento/70 md:mx-12" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
