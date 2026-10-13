import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import SchoolImage from "@/components/ui/SchoolImage";
import type { TeamMember } from "@/types";

/** EQUIPO: quienes dirigen y acompañan a los estudiantes. Rostros reales generan confianza. */
export default function Team({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;
  const hasPending = members.some((member) => !member.name);

  return (
    <section id="equipo" aria-labelledby="equipo-titulo" className="bg-tiza py-24 md:py-32">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <Reveal className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="equipo-titulo" className="text-balance font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold leading-[0.96] tracking-[-0.03em] text-noche">
              Nuestro equipo.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-niebla">Personas que acompañan de cerca a cada estudiante, todos los días.</p>
          </div>
          {hasPending && <DraftBadge label="Nombres y fotos por confirmar" />}
        </Reveal>

        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <li key={member.id}>
              <Reveal delay={index * 0.07}>
                <SchoolImage
                  src={member.image}
                  alt={member.name ? `${member.name}, ${member.role}` : member.role}
                  label={`Retrato: ${member.role}`}
                  tone="light"
                  className="aspect-[4/5] rounded-panel"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <p className="mt-5 text-sm font-semibold text-rojo-700">{member.role}</p>
                <h3 className="mt-1 font-display text-2xl font-bold leading-tight tracking-[-0.015em] text-noche">{member.name ?? "[NOMBRE Y APELLIDO]"}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-niebla">{member.bio ?? "[ESPECIALIDAD O BREVE DESCRIPCIÓN]"}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
