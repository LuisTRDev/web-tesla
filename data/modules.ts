import raw from "@/content/modules.json";
import navigationRaw from "@/content/navegacion.json";
import { palette } from "@/data/appearance";
import { list, rec, str, strings, text } from "@/lib/content";

/**
 * MÓDULOS DEL SITIO
 * Cada sección es una página propia con su personalidad: color de cabecera, acento,
 * motivo gráfico y frase. La navegación, la portada, el pie de cada módulo ("siguiente")
 * y la transición de color al cambiar de página leen todo desde aquí.
 * El orden del arreglo es el orden de recorrido.
 *
 * Los TEXTOS (nombre en el menú, título, introducción, resumen y descripción para Google) se editan
 * desde el panel (content/modules.json). El diseño (colores y motivos) vive aquí, en el código.
 */

export type Motif = "escudo" | "plano" | "escalones" | "chispas" | "pelicula" | "periodico" | "ondas" | "relieve";

export interface ModuleTheme {
  /** Tono del fondo de la cabecera. Decide si la barra de navegación usa texto claro u oscuro. */
  tone: "dark" | "light";
  /** Clase de fondo de la cabecera (y de la cortina de transición). */
  bg: string;
  /** Color de texto principal sobre `bg`. */
  text: string;
  /** Texto secundario sobre `bg`. */
  muted: string;
  /** Color de acento en hex (línea de energía, puntos, detalles). */
  accent: string;
}

export interface SiteModule {
  id: string;
  number: string;
  label: string;
  href: string;
  /** Rótulo pequeño sobre el título; por defecto, `label`. */
  kicker?: string;
  /** Frase principal de la cabecera del módulo. */
  title: string;
  intro: string;
  /** Resumen corto para la portada y el enlace "siguiente módulo". */
  teaser: string;
  /** Descripción que muestran Google y las redes al compartir la página. */
  seoDescription: string;
  /** Título para Google (opcional); por defecto, el nombre del menú. */
  seoTitle?: string;
  /** Imagen al compartir la página en redes (opcional). */
  shareImage?: string;
  /** false = oculta del menú y de la portada (la página sigue existiendo). */
  inMenu: boolean;
  motif: Motif;
  theme: ModuleTheme;
}

/** Diseño fijo de cada módulo. Los textos se combinan con content/modules.json por `id`. */
const design: Array<{ id: string; motif: Motif; theme: ModuleTheme; fallback: { label: string; title: string } }> = [
  {
    id: "nosotros",
    motif: "escudo",
    theme: { tone: "light", bg: "bg-tiza", text: "text-noche", muted: "text-tinta/75", accent: palette.rojo },
    fallback: { label: "Nosotros", title: "Pasión por educar." },
  },
  {
    id: "propuesta",
    motif: "plano",
    theme: { tone: "dark", bg: "bg-noche", text: "text-white", muted: "text-white/70", accent: palette.arco },
    fallback: { label: "Propuesta educativa", title: "Una educación pensada para el futuro." },
  },
  {
    id: "niveles",
    motif: "escalones",
    theme: { tone: "dark", bg: "bg-marino", text: "text-white", muted: "text-white/75", accent: palette.filamento },
    fallback: { label: "Niveles", title: "Cada etapa, un descubrimiento." },
  },
  {
    id: "actividades",
    motif: "chispas",
    theme: { tone: "dark", bg: "bg-rojo-700", text: "text-white", muted: "text-white/85", accent: palette.filamento },
    fallback: { label: "Actividades", title: "Aprender también ocurre fuera del aula." },
  },
  {
    id: "galeria",
    motif: "pelicula",
    theme: { tone: "dark", bg: "bg-noche-900", text: "text-white", muted: "text-white/70", accent: palette.filamento },
    fallback: { label: "Galería", title: "El año, en imágenes." },
  },
  {
    id: "noticias",
    motif: "periodico",
    theme: { tone: "light", bg: "bg-white", text: "text-noche", muted: "text-tinta/75", accent: palette.rojo },
    fallback: { label: "Noticias", title: "Lo que está pasando en Nikola Tesla." },
  },
  {
    id: "admision",
    motif: "ondas",
    theme: { tone: "light", bg: "bg-filamento", text: "text-noche", muted: "text-noche/80", accent: palette.noche },
    fallback: { label: "Admisión", title: "¿Listos para comenzar esta historia?" },
  },
  {
    id: "contacto",
    motif: "relieve",
    theme: { tone: "light", bg: "bg-arco-100", text: "text-noche", muted: "text-tinta/75", accent: palette.rojo },
    fallback: { label: "Contacto", title: "Conversemos." },
  },
];

const texts = list(rec(raw).items);

/** Secciones que la clienta quitó del menú y de la portada (Personalizar la web → Menú y pie de página). */
const hidden = strings(rec(navigationRaw).hiddenModules);

/** Todas las secciones (todas tienen página); el número sigue el orden de las visibles. */
export const modules: SiteModule[] = (() => {
  let visible = 0;
  return design.map((item, index) => {
    const copy = texts.find((entry) => entry.id === item.id) ?? {};
    const label = str(copy.label, item.fallback.label);
    const inMenu = !hidden.includes(item.id);
    if (inMenu) visible += 1;
    return {
      id: item.id,
      number: String(inMenu ? visible : design.length - index).padStart(2, "0"),
      label,
      href: `/${item.id}`,
      kicker: text(copy.kicker) ?? undefined,
      title: str(copy.title, item.fallback.title),
      intro: str(copy.intro),
      teaser: str(copy.teaser),
      seoDescription: str(copy.seoDescription),
      seoTitle: text(copy.seoTitle) ?? undefined,
      shareImage: text(copy.shareImage) ?? undefined,
      inMenu,
      motif: item.motif,
      theme: item.theme,
    };
  });
})();

/** Las que aparecen en el menú, la portada y el "siguiente". */
export const navModules: SiteModule[] = modules.filter((module) => module.inMenu);

/** Tema de la portada y de páginas sin módulo (por ejemplo, 404). */
export const homeTheme: ModuleTheme = { tone: "dark", bg: "bg-noche", text: "text-white", muted: "text-white/70", accent: palette.filamento };

/** Cada nivel tiene su propio color dentro del módulo Niveles. */
export const levelThemes: Record<string, ModuleTheme> = {
  primaria: { tone: "dark", bg: "bg-rojo-700", text: "text-white", muted: "text-white/85", accent: palette.filamento },
  secundaria: { tone: "dark", bg: "bg-marino", text: "text-white", muted: "text-white/75", accent: palette.arco },
};

export function getModule(id: string): SiteModule {
  const found = modules.find((module) => module.id === id);
  if (!found) throw new Error(`Módulo desconocido: ${id}`);
  return found;
}

/** Módulo siguiente en el recorrido, saltando los ocultos (el último vuelve al primero). */
export function getNextModule(id: string): SiteModule {
  const total = modules.length;
  const start = Math.max(0, modules.findIndex((module) => module.id === id));
  for (let step = 1; step <= total; step++) {
    const candidate = modules[(start + step) % total];
    if (candidate.inMenu) return candidate;
  }
  return modules[(start + 1) % total];
}

export function moduleForPath(pathname: string): SiteModule | null {
  return modules.find((module) => pathname === module.href || pathname.startsWith(`${module.href}/`)) ?? null;
}

/** Páginas que no son un módulo del menú (calendario, documentos y páginas nuevas): su cabecera y su tema. */
export const calendarTheme: ModuleTheme = { tone: "dark", bg: "bg-marino", text: "text-white", muted: "text-white/75", accent: palette.filamento };
export const documentsTheme: ModuleTheme = { tone: "light", bg: "bg-arco-100", text: "text-noche", muted: "text-tinta/75", accent: palette.rojo };
export const customPageTheme: ModuleTheme = { tone: "dark", bg: "bg-noche", text: "text-white", muted: "text-white/75", accent: palette.filamento };

/** Crea la "cabecera de módulo" de una página que no está en el menú (por ejemplo, /calendario). */
export function pageModule(page: Pick<SiteModule, "id" | "label" | "title" | "intro" | "seoDescription"> & Partial<SiteModule> & { motif: Motif; theme: ModuleTheme }): SiteModule {
  return { number: "+", href: `/${page.id}`, teaser: "", inMenu: false, ...page };
}

/** Tema visual de una ruta: lo usan la barra de navegación y la cortina de transición. */
export function themeForPath(pathname: string): ModuleTheme {
  const level = pathname.match(/^\/niveles\/([^/]+)/);
  if (level && levelThemes[level[1]]) return levelThemes[level[1]];
  if (pathname === "/calendario" || pathname.startsWith("/calendario/")) return calendarTheme;
  if (pathname === "/documentos") return documentsTheme;
  if (pathname.startsWith("/p/")) return customPageTheme;
  return moduleForPath(pathname)?.theme ?? homeTheme;
}
