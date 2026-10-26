import type { Metadata } from "next";
import Levels from "@/components/sections/Levels";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";
import { getLevels } from "@/lib/data";
import { moduleMetadata } from "@/lib/seo";

const mod = getModule("niveles");

export const metadata: Metadata = moduleMetadata(mod);

export default async function LevelsPage() {
  const levels = await getLevels();

  return (
    <>
      <ModuleHeader module={mod} />
      <Levels levels={levels} showIntro={false} />
      <NextModule current={mod.id} />
    </>
  );
}
