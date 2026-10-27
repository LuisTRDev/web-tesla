import raw from "@/content/recorrido.json";
import { list, rec, str, text } from "@/lib/content";

/**
 * RECORRIDO VIRTUAL 360°: fotos panorámicas (formato equirectangular, las que toma el modo "panorama" o una cámara 360°).
 * Se editan desde el panel (/admin → Galería de fotos → Recorrido virtual 360°). Sin escenas, la página no se muestra.
 */
const r = rec(raw);

export interface TourScene {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const tourIntro = str(r.intro, "Camina por el colegio desde tu casa. Arrastra para mirar alrededor.");
export const tourScenes: TourScene[] = list(r.scenes)
  .map((scene, index) => ({
    id: str(scene.id, `escena-${index + 1}`).replace(/[^a-zA-Z0-9_-]/g, "-"),
    title: str(scene.title),
    description: str(scene.description),
    image: text(scene.image) ?? "",
  }))
  .filter((scene) => scene.image);
