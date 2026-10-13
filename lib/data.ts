/**
 * CAPA DE DATOS
 * La interfaz nunca importa los archivos de /data directamente para listas dinámicas:
 * pide los datos a estas funciones. Hoy devuelven datos locales; mañana pueden consultar
 * Supabase o un CMS sin tocar ningún componente.
 *
 * Ejemplo con Supabase:
 *
 *   export async function getGalleryEvents(): Promise<GalleryEvent[]> {
 *     const { data, error } = await supabase
 *       .from("gallery_events")
 *       .select("*, media:gallery_media(*)")
 *       .order("date", { ascending: false });
 *     if (error) throw error;
 *     return data.map(mapGalleryEvent);
 *   }
 */
import type { Achievement, Activity, FaqItem, GalleryEvent, Level, NewsPost, TeamMember, Testimonial } from "@/types";
import { achievements } from "@/data/achievements";
import { activities } from "@/data/activities";
import { faq } from "@/data/faq";
import { team } from "@/data/team";
import { galleryEvents } from "@/data/gallery";
import { levels } from "@/data/levels";
import { news } from "@/data/news";
import { testimonials } from "@/data/testimonials";
import { sortEvents } from "@/lib/gallery";

export async function getGalleryEvents(limit?: number): Promise<GalleryEvent[]> {
  const sorted = sortEvents(galleryEvents);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getNews(limit?: number): Promise<NewsPost[]> {
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  return news.find((post) => post.slug === slug) ?? null;
}

export async function getLevels(): Promise<Level[]> {
  return levels;
}

export async function getLevelBySlug(slug: string): Promise<Level | null> {
  return levels.find((level) => level.slug === slug) ?? null;
}

export async function getActivities(): Promise<Activity[]> {
  return activities;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonials;
}

export async function getFaq(): Promise<FaqItem[]> {
  return faq;
}

export async function getTeam(): Promise<TeamMember[]> {
  return team;
}

export async function getAchievements(): Promise<Achievement[]> {
  return achievements;
}
