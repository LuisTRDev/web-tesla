import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PanoramaViewer from "@/components/gallery/PanoramaViewer";
import { settings } from "@/data/settings";
import { tourIntro, tourScenes } from "@/data/tour";

export const metadata: Metadata = {
  title: "Recorrido virtual 360°",
  description: `Conoce ${settings.shortName} desde tu casa: recorrido virtual en 360° por nuestras instalaciones.`,
  alternates: { canonical: "/recorrido" },
};

/** Recorrido virtual 360°. Sin escenas cargadas desde el panel, la página no existe. */
export default function TourPage() {
  if (tourScenes.length === 0) notFound();
  return (
    <section className="bg-noche-900 pb-24 pt-36 text-white md:pb-36 md:pt-44">
      <div className="mx-auto max-w-site px-5 md:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.1em] text-filamento">Conócenos sin salir de casa</p>
        <h1 className="mt-3 text-balance font-display text-[clamp(2.4rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">Recorrido virtual 360°</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{tourIntro}</p>
        <div className="mt-10">
          <PanoramaViewer scenes={tourScenes} />
        </div>
      </div>
    </section>
  );
}
