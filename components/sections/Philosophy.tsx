import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import { philosophy } from "@/data/philosophy";

/**
 * FILOSOFÍA: los conceptos se leen como una sola frase tipográfica grande.
 * Al pasar el cursor (o enfocar), cada palabra se enciende y muestra su explicación.
 * El contenido se edita en data/philosophy.ts.
 */
export default function Philosophy() {
  const hasDrafts = philosophy.some((concept) => !concept.confirmed);

  return (
    <section aria-labelledby="filosofia-titulo" className="relative overflow-hidden bg-white py-24 md:py-36">
      {/* Anillos de campo, muy tenues */}
      <svg aria-hidden="true" viewBox="0 0 800 800" className="pointer-events-none absolute -right-64 -top-40 h-[820px] w-[820px] text-noche/[0.07]" fill="none" stroke="currentColor">
        {[120, 190, 260, 330, 400].map((radius) => (
          <circle key={radius} cx="400" cy="400" r={radius} strokeWidth="1.2" />
        ))}
      </svg>

      <div className="relative mx-auto max-w-site px-5 md:px-10">
        <Reveal className="max-w-2xl">
          <h2 id="filosofia-titulo" className="font-display text-[clamp(1.6rem,3vw,2.3rem)] font-bold leading-tight tracking-[-0.02em] text-noche">
            Nikola Tesla imaginó el futuro antes de construirlo. Esa es la actitud que queremos despertar.
          </h2>
          {hasDrafts && <DraftBadge label="Conceptos propuestos, por confirmar" className="mt-5" />}
        </Reveal>

        <ul className="mt-14 border-t border-noche/15 md:mt-20">
          {philosophy.map((concept, index) => (
            <li key={concept.id} className="border-b border-noche/15">
              <Reveal delay={index * 0.04} y={18}>
                <div tabIndex={0} className="group grid cursor-default gap-2 py-6 outline-offset-0 md:grid-cols-12 md:items-baseline md:gap-10 md:py-7">
                  <h3 className="font-display text-[clamp(2.3rem,7.2vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-noche/25 transition-colors duration-500 group-hover:text-noche group-focus-visible:text-noche md:col-span-8 max-md:text-noche">
                    {concept.title}
                    <span aria-hidden="true" className="ml-3 inline-block h-[0.14em] w-[0.14em] translate-y-[-0.1em] rounded-full bg-filamento opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100" />
                  </h3>
                  <p className="max-w-sm text-base leading-relaxed text-niebla transition-colors duration-500 group-hover:text-tinta md:col-span-4 md:text-lg">
                    {concept.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
