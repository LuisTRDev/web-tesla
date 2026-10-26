import type { Metadata } from "next";
import type { SiteModule } from "@/data/modules";

/**
 * Metadatos de una sección: el título para Google (el del panel o el nombre del menú), la descripción y,
 * si se eligió, la imagen que se ve al compartir la página en WhatsApp, Facebook, etc.
 */
export function moduleMetadata(mod: SiteModule, fallbackTitle?: string): Metadata {
  const title = mod.seoTitle ?? fallbackTitle ?? mod.label;
  return {
    title,
    description: mod.seoDescription,
    alternates: { canonical: mod.href },
    ...(mod.shareImage
      ? {
          openGraph: { title, description: mod.seoDescription, images: [mod.shareImage] },
          twitter: { card: "summary_large_image", title, description: mod.seoDescription, images: [mod.shareImage] },
        }
      : {}),
  };
}
