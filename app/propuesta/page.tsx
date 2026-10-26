import type { Metadata } from "next";
import Experience from "@/components/sections/Experience";
import Proposal from "@/components/sections/Proposal";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";
import { moduleMetadata } from "@/lib/seo";

const mod = getModule("propuesta");

export const metadata: Metadata = moduleMetadata(mod);

export default function ProposalPage() {
  return (
    <>
      <ModuleHeader module={mod} />
      <Proposal showIntro={false} />
      <Experience />
      <NextModule current={mod.id} />
    </>
  );
}
