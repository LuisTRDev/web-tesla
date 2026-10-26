import type { Metadata } from "next";
import Experience from "@/components/sections/Experience";
import Proposal from "@/components/sections/Proposal";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";

const mod = getModule("propuesta");

export const metadata: Metadata = {
  title: mod.label,
  description: mod.seoDescription,
  alternates: { canonical: mod.href },
};

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
