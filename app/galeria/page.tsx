import type { Metadata } from "next";
import GalleryExplorer from "@/components/gallery/GalleryExplorer";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";
import { getGalleryEvents } from "@/lib/data";

const mod = getModule("galeria");

export const metadata: Metadata = {
  title: mod.label,
  description: mod.seoDescription,
  alternates: { canonical: mod.href },
};

export default async function GalleryPage() {
  const events = await getGalleryEvents();

  return (
    <>
      <ModuleHeader module={mod} />
      <section className="bg-noche-900 pb-24 pt-12 text-white md:pb-36 md:pt-16">
        <div className="mx-auto max-w-site px-5 md:px-10">
          <GalleryExplorer events={events} />
        </div>
      </section>
      <NextModule current={mod.id} />
    </>
  );
}
