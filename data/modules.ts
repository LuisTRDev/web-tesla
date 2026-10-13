import { settings } from "@/data/settings";

/**
 * MÓDULOS DEL SITIO
 * Cada sección es una página propia con su personalidad: color de cabecera, acento,
 * motivo gráfico y frase. La navegación, la portada, el pie de cada módulo ("siguiente")
 * y la transición de color al cambiar de página leen todo desde aquí.
 * El orden del arreglo es el orden de recorrido.
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
  motif: Motif;
  theme: ModuleTheme;
}

export const modules: SiteModule[] = [
  {
    id: "nosotros",
    number: "01",
    label: "Nosotros",
    href: "/nosotros",
    title: "Pasión por educar.",
    intro: "Una comunidad que forma con disciplina, liderazgo y excelencia, y que acompaña a cada estudiante a descubrir lo que puede llegar a ser.",
    teaser: "Quiénes somos, qué creemos y lo que dice nuestra comunidad.",
    motif: "escudo",
    theme: { tone: "light", bg: "bg-tiza", text: "text-noche", muted: "text-tinta/75", accent: "#E03C26" },
  },
  {
    id: "propuesta",
    number: "02",
    label: "Propuesta educativa",
    href: "/propuesta",
    title: "Una educación pensada para el futuro.",
    intro: "Los pilares que guían cómo enseñamos y cómo aprenden nuestros estudiantes, dentro y fuera del aula.",
    teaser: "Los pilares de nuestra forma de enseñar.",
    motif: "plano",
    theme: { tone: "dark", bg: "bg-noche", text: "text-white", muted: "text-white/70", accent: "#A9ADFF" },
  },
  {
    id: "niveles",
    number: "03",
    label: "Niveles",
    href: "/niveles",
    title: "Cada etapa, un descubrimiento.",
    intro: "Acompañamos a nuestros estudiantes desde la primaria hasta el final de la secundaria.",
    teaser: "Primaria y Secundaria.",
    motif: "escalones",
    theme: { tone: "dark", bg: "bg-marino", text: "text-white", muted: "text-white/75", accent: "#FFB627" },
  },
  {
    id: "actividades",
    number: "04",
    label: "Actividades",
    href: "/actividades",
    title: "Aprender también ocurre fuera del aula.",
    intro: "Talleres y actividades para que cada estudiante encuentre lo suyo.",
    teaser: "Ciencia, arte, deporte, cultura y más.",
    motif: "chispas",
    theme: { tone: "dark", bg: "bg-rojo-700", text: "text-white", muted: "text-white/85", accent: "#FFB627" },
  },
  {
    id: "galeria",
    number: "05",
    label: "Galería",
    href: "/galeria",
    title: "El año, en imágenes.",
    intro: "Todas nuestras actividades, organizadas por año, mes y evento. Toca cualquier imagen para verla en grande.",
    teaser: "Fotos y videos, mes a mes.",
    motif: "pelicula",
    theme: { tone: "dark", bg: "bg-noche-900", text: "text-white", muted: "text-white/70", accent: "#FFB627" },
  },
  {
    id: "noticias",
    number: "06",
    label: "Noticias",
    href: "/noticias",
    title: "Lo que está pasando en Nikola Tesla.",
    intro: "Comunicados, logros y actividades recientes de nuestra comunidad.",
    teaser: "Comunicados y novedades.",
    motif: "periodico",
    theme: { tone: "light", bg: "bg-white", text: "text-noche", muted: "text-tinta/75", accent: "#E03C26" },
  },
  {
    id: "admision",
    number: "07",
    label: "Admisión",
    href: "/admision",
    kicker: `Admisión ${settings.admissionYear}`,
    title: "¿Listos para comenzar esta historia?",
    intro: "Te acompañamos en cada paso para que tu familia forme parte de nuestra comunidad.",
    teaser: `Proceso de Admisión ${settings.admissionYear}.`,
    motif: "ondas",
    theme: { tone: "light", bg: "bg-filamento", text: "text-noche", muted: "text-noche/80", accent: "#0D1230" },
  },
  {
    id: "contacto",
    number: "08",
    label: "Contacto",
    href: "/contacto",
    title: "Conversemos.",
    intro: `Escríbenos o visítanos en ${settings.location.district}. Nos encantará conocer a tu familia.`,
    teaser: "Dirección, mapa y formulario.",
    motif: "relieve",
    theme: { tone: "light", bg: "bg-arco-100", text: "text-noche", muted: "text-tinta/75", accent: "#E03C26" },
  },
];

/** Tema de la portada y de páginas sin módulo (por ejemplo, 404). */
export const homeTheme: ModuleTheme = { tone: "dark", bg: "bg-noche", text: "text-white", muted: "text-white/70", accent: "#FFB627" };

/** Cada nivel tiene su propio color dentro del módulo Niveles. */
export const levelThemes: Record<string, ModuleTheme> = {
  primaria: { tone: "dark", bg: "bg-rojo-700", text: "text-white", muted: "text-white/85", accent: "#FFB627" },
  secundaria: { tone: "dark", bg: "bg-marino", text: "text-white", muted: "text-white/75", accent: "#A9ADFF" },
};

export function getModule(id: string): SiteModule {
  const found = modules.find((module) => module.id === id);
  if (!found) throw new Error(`Módulo desconocido: ${id}`);
  return found;
}

/** Módulo siguiente en el recorrido (el último vuelve al primero). */
export function getNextModule(id: string): SiteModule {
  const index = modules.findIndex((module) => module.id === id);
  return modules[(index + 1) % modules.length];
}

export function moduleForPath(pathname: string): SiteModule | null {
  return modules.find((module) => pathname === module.href || pathname.startsWith(`${module.href}/`)) ?? null;
}

/** Tema visual de una ruta: lo usan la barra de navegación y la cortina de transición. */
export function themeForPath(pathname: string): ModuleTheme {
  const level = pathname.match(/^\/niveles\/([^/]+)/);
  if (level && levelThemes[level[1]]) return levelThemes[level[1]];
  return moduleForPath(pathname)?.theme ?? homeTheme;
}
