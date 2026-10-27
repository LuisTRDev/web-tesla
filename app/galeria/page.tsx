import type { Metadata } from "next";
import GalleryExplorer from "@/components/gallery/GalleryExplorer";
import GalleryStories from "@/components/gallery/GalleryStories";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { getModule } from "@/data/modules";
import { tourScenes } from "@/data/tour";
import { getGalleryEvents } from "@/lib/data";
import { moduleMetadata } from "@/lib/seo";

const mod = getModule("galeria");

export const metadata: Metadata = moduleMetadata(mod);

export default async function GalleryPage() {
  const events = await getGalleryEvents();

  return (
    <>
      <ModuleHeader module={mod} />
      <section className="bg-noche-900 pb-24 pt-12 text-white md:pb-36 md:pt-16">
        <div className="mx-auto max-w-site px-5 md:px-10">
          {tourScenes.length > 0 && (
            <a href="/recorrido" data-spark className="mb-8 flex items-center justify-between gap-4 rounded-panel border border-white/15 bg-white/5 p-5 transition-colors hover:border-filamento">
              <span>
                <span className="block font-display text-xl font-bold">🌐 Recorrido virtual 360°</span>
                <span className="mt-1 block text-sm text-white/70">Camina por el colegio desde tu casa.</span>
              </span>
              <span aria-hidden="true" className="text-2xl text-filamento">→</span>
            </a>
          )}
          <GalleryStories events={events} />
          <GalleryExplorer events={events} />
        </div>
      </section>
      <NextModule current={mod.id} />
    </>
  );
}
