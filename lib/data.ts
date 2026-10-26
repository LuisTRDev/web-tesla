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
import type { Achievement, Activity, ExtraPage, FaqItem, GalleryEvent, Level, NewsPost, SchoolDocument, SchoolEvent, TeamMember, Testimonial } from "@/types";
import { achievements } from "@/data/achievements";
import { activities } from "@/data/activities";
import { documents } from "@/data/documents";
import { events } from "@/data/events";
import { extraPages } from "@/data/pages-extra";
import { faq } from "@/data/faq";
import { team } from "@/data/team";
import { galleryEvents } from "@/data/gallery";
import { levels } from "@/data/levels";
import { news } from "@/data/news";
import { testimonials } from "@/data/testimonials";
import { sortEvents } from "@/lib/gallery";
import { todayISO } from "@/lib/utils";

/** Noticias y eventos con fecha futura no se muestran hasta ese día (publicación programada). */
const published = <T extends { date: string }>(items: T[]) => items.filter((item) => !item.date || item.date <= todayISO());

export async function getGalleryEvents(limit?: number): Promise<GalleryEvent[]> {
  const sorted = sortEvents(published(galleryEvents));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getNews(limit?: number): Promise<NewsPost[]> {
  const sorted = published(news).sort((a, b) => b.date.localeCompare(a.date));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  return published(news).find((post) => post.slug === slug) ?? null;
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

/** Eventos que todavía no terminaron, del más cercano al más lejano. */
export async function getUpcomingEvents(limit?: number): Promise<SchoolEvent[]> {
  const today = todayISO();
  const upcoming = events.filter((event) => (event.endDate ?? event.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}

/** Eventos ya terminados, del más reciente al más antiguo. */
export async function getPastEvents(): Promise<SchoolEvent[]> {
  const today = todayISO();
  return events.filter((event) => (event.endDate ?? event.date) < today).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getEventBySlug(slug: string): Promise<SchoolEvent | null> {
  return events.find((event) => event.slug === slug) ?? null;
}

export async function getDocuments(): Promise<SchoolDocument[]> {
  return documents;
}

export async function getExtraPages(): Promise<ExtraPage[]> {
  return extraPages;
}

export async function getExtraPage(slug: string): Promise<ExtraPage | null> {
  return extraPages.find((page) => page.slug === slug) ?? null;
}
