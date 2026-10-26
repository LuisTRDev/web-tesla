import type { Metadata } from "next";
import Activities from "@/components/sections/Activities";
import ButtonLink from "@/components/ui/ButtonLink";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";
import { getActivities } from "@/lib/data";
import { moduleMetadata } from "@/lib/seo";

const mod = getModule("actividades");

export const metadata: Metadata = moduleMetadata(mod);

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <>
      <ModuleHeader module={mod}>
        <ButtonLink href="/galeria" variant="outline-light" className="hero-in mt-10">
          Ver las actividades en la galería
        </ButtonLink>
      </ModuleHeader>
      <Activities activities={activities} showIntro={false} />
      <NextModule current={mod.id} />
    </>
  );
}
