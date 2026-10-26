import type { Metadata } from "next";
import Contact from "@/components/sections/Contact";
import Faq from "@/components/sections/Faq";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";
import { settings } from "@/data/settings";
import { getFaq } from "@/lib/data";
import { moduleMetadata } from "@/lib/seo";

const mod = getModule("contacto");

export const metadata: Metadata = moduleMetadata(mod);

export default async function ContactPage() {
  const faq = await getFaq();

  return (
    <>
      <ModuleHeader module={mod} />
      <Contact showIntro={false} />
      <Faq items={faq} />
      <NextModule current={mod.id} />
    </>
  );
}
