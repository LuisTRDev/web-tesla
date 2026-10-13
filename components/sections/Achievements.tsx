import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import type { Achievement } from "@/types";

/** LOGROS: lo que nuestros estudiantes han conseguido. Sobre fondo oscuro, para que destaque. */
export default function Achievements({ items }: { items: Achievement[] }) {
  if (items.length === 0) return null;
  const hasPlaceholders = items.some((item) => item.isPlaceholder);

  return (
    <section id="logros" aria-labelledby="logros-titulo" className="bg-noche py-24 text-white md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <Reveal className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <h2 id="logros-titulo" className="text-balance font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold leading-[0.96] tracking-[-0.03em]">
            Nuestros logros.
          </h2>
          {hasPlaceholders && <DraftBadge label="Espacios reservados" tone="dark" />}
        </Reveal>

        <ol className="grid border-t border-white/15 md:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.id} className="border-b border-white/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <Reveal delay={index * 0.08}>
                <span className="font-display text-5xl font-extrabold leading-none tracking-[-0.03em] text-filamento">{item.year ?? "[AÑO]"}</span>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight">{item.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-white/70">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
