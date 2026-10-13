import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Admission from "@/components/sections/Admission";
import ButtonLink from "@/components/ui/ButtonLink";
import DraftBadge from "@/components/ui/DraftBadge";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import SchoolImage from "@/components/ui/SchoolImage";
import { getModule, levelThemes } from "@/data/modules";
import { getLevelBySlug, getLevels } from "@/lib/data";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const levels = await getLevels();
  return levels.map((level) => ({ slug: level.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const level = await getLevelBySlug(params.slug);
  if (!level) return { title: "Nivel no encontrado" };
  return {
    title: `Nivel ${level.name}`,
    description: `Nivel ${level.name} en la Institución Educativa Privada “Nikola Tesla”, Nuevo Imperial, Cañete. ${level.summary}`,
    alternates: { canonical: `/niveles/${level.slug}` },
  };
}

export default async function LevelPage({ params }: PageProps) {
  const [level, levels] = await Promise.all([getLevelBySlug(params.slug), getLevels()]);
  if (!level) notFound();
  const others = levels.filter((item) => item.slug !== level.slug);

  return (
    <>
      <ModuleHeader
        module={getModule("niveles")}
        kicker={`Niveles · ${level.name}`}
        title={level.name}
        intro={level.summary}
        theme={levelThemes[level.slug]}
        highlight={levels.findIndex((item) => item.slug === level.slug)}
      />

      <section className="bg-tiza py-20 md:py-28">
        <div className="mx-auto grid max-w-site gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <SchoolImage
              src={level.image}
              alt={`Estudiantes del nivel ${level.name}`}
              label={`Estudiantes de ${level.name}`}
              tone="light"
              className="aspect-[4/3] rounded-panel"
              sizes="(min-width: 1024px) 58vw, 100vw"
              priority
            />
          </div>
          <div className="lg:col-span-5">
            {!level.confirmed && <DraftBadge label="Contenido por confirmar" className="mb-5" />}
            <p className="text-xl leading-relaxed text-tinta/85">{level.description}</p>

            <h2 className="mt-10 font-display text-2xl font-bold tracking-[-0.02em] text-noche">Grados</h2>
            {level.grades ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {level.grades.map((grade) => (
                  <li key={grade} className="rounded-full border border-noche/25 px-4 py-1.5 text-[15px] font-medium text-noche">
                    {grade}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[17px] text-niebla">[GRADOS POR CONFIRMAR]</p>
            )}

            <div className="mt-12 border-t border-noche/15 pt-8">
              <p className="text-sm font-semibold text-niebla">Otros niveles</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {others.map((item) => (
                  <ButtonLink key={item.slug} href={`/niveles/${item.slug}`} variant="outline-dark">
                    {item.name}
                  </ButtonLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Admission />
      <NextModule current="niveles" />
    </>
  );
}
