/**
 * LISTA DE PENDIENTES
 * Revisa el contenido real de la web y dice qué falta para dejarla lista para la campaña.
 * La muestra el panel (/admin → Inicio) a través de /admin/api/pendientes.
 *
 * Cada punto indica a dónde ir a corregirlo (`to`: sección/archivo del panel y, si se conoce, `field`: la ruta
 * del campo con las etiquetas de public/admin/config.yml) y su prioridad:
 *   1 = bloquea la campaña · 2 = importante · 3 = cuando puedas.
 * Para añadir una comprobación, agrega un elemento a `items` con `done` calculado desde los datos.
 */
import { achievements } from "@/data/achievements";
import { activities } from "@/data/activities";
import { admissionInfo, admissionSteps } from "@/data/admission";
import { experienceShots } from "@/data/experience";
import { faq } from "@/data/faq";
import { galleryEvents } from "@/data/gallery";
import { levels } from "@/data/levels";
import { aboutText, philosophy } from "@/data/philosophy";
import { pillars } from "@/data/pillars";
import { settings } from "@/data/settings";
import { team } from "@/data/team";
import { testimonials } from "@/data/testimonials";
import { news } from "@/data/news";
import { documents } from "@/data/documents";
import { events } from "@/data/events";
import { navLinks } from "@/data/navigation";
import { teamTasks } from "@/data/tasks";
import { todayISO } from "@/lib/utils";
import { findBrokenLinks, heavyFiles, missingDocuments } from "@/lib/health";

export type Priority = 1 | 2 | 3;

export interface PendingItem {
  label: string;
  done: boolean;
  /** Detalle corto, por ejemplo "2 de 6". */
  detail?: string;
  /** Sección del panel donde se corrige, p. ej. "colegio/entries/settings". */
  to: string;
  /** Ruta del campo dentro del formulario (etiquetas), si se conoce. */
  field?: string[];
  priority: Priority;
  /** Nombre de la sección, para agrupar. */
  section: string;
}

const hasPlaceholder = (value: string) => /\[[^\]]*[A-ZÁÉÍÓÚÑ]{3,}[^\]]*\]/.test(value);

function item(section: string, to: string, priority: Priority, label: string, done: boolean, field?: string[], detail?: string): PendingItem {
  return { section, to, priority, label, done, field, detail };
}

/** "Todos cumplen": done cuando count === total. */
function all(section: string, to: string, priority: Priority, label: string, count: number, total: number, field?: string[]): PendingItem {
  return item(section, to, priority, label, total > 0 && count === total, field, `${count} de ${total}`);
}

export function getPending() {
  const S = "colegio/entries/settings";
  const broken = findBrokenLinks();
  const missingFiles = missingDocuments();
  const heavy = heavyFiles();
  const items: PendingItem[] = [
    // ── Bloquean la campaña
    item("Datos del colegio", S, 1, "Poner la dirección real de la web", !settings.siteUrl.includes("example.com"), ["Dirección de la web"]),
    item("Datos del colegio", S, 1, "Escribir el número de WhatsApp", settings.contact.whatsapp.length > 0, ["Contacto", "Números de WhatsApp"]),
    item("Datos del colegio", S, 1, "Confirmar la fecha de cierre de inscripciones", !!settings.admissionDeadline, ["Último día de inscripciones"]),
    item("Datos del colegio", S, 1, "Subir la foto o el video de la portada", !!(settings.images.hero || settings.images.heroVideo), ["Fotos y video principales", "Foto de la portada"]),
    all("Admisión", "admision/entries/admission", 1, "Confirmar los pasos de admisión", admissionSteps.filter((step) => step.confirmed).length, admissionSteps.length, ["Pasos del proceso"]),
    all("Admisión", "admision/entries/admission", 1, "Escribir requisitos, fechas y vacantes", admissionInfo.filter((entry) => !hasPlaceholder(entry.text)).length, admissionInfo.length, ["Requisitos, fechas y vacantes"]),
    item("Antes de publicar", S, 1, "Desactivar las etiquetas “Por confirmar”", !settings.showDraftBadges, ["Mostrar etiquetas “Por confirmar”"]),

    // ── Importantes
    item("Datos del colegio", S, 2, "Escribir el horario de atención", !!settings.contact.hours, ["Contacto", "Horario de atención"]),
    item("Datos del colegio", S, 2, "Escribir la resolución de funcionamiento (UGEL)", !!settings.legal.resolution, ["Respaldo oficial", "Resolución de funcionamiento (UGEL)"]),
    item("Datos del colegio", S, 2, "Escribir el código modular", !!settings.legal.modularCode, ["Respaldo oficial", "Código modular"]),
    item("Datos del colegio", S, 2, "Poner el enlace oficial de Facebook", !!settings.social.facebook && !settings.social.facebook.includes("/search/"), ["Redes sociales", "Facebook"]),
    item("Datos del colegio", S, 2, "Poner el enlace de Instagram", !!settings.social.instagram, ["Redes sociales", "Instagram"]),
    all("Datos del colegio", S, 2, "Completar las cifras (años, estudiantes, docentes)", settings.stats.filter((stat) => stat.value).length, settings.stats.length, ["Cifras del colegio"]),
    all("Admisión", "admision/entries/faq", 2, "Confirmar las respuestas de preguntas frecuentes", faq.filter((entry) => entry.confirmed).length, faq.length),
    all("Niveles", "propuesta/entries/levels", 2, "Confirmar la descripción de los niveles", levels.filter((entry) => entry.confirmed).length, levels.length),
    all("Niveles", "propuesta/entries/levels", 2, "Escribir los grados de cada nivel", levels.filter((entry) => entry.grades).length, levels.length),
    item("Nosotros", "nosotros/entries/philosophy", 2, "Confirmar el texto de Quiénes somos y los valores", aboutText.confirmed && philosophy.every((entry) => entry.confirmed)),
    all("Nosotros", "nosotros/entries/team", 2, "Escribir el nombre del equipo", team.filter((member) => member.name).length, team.length),
    item("Noticias", "noticias", 2, "Publicar al menos una noticia real", news.some((post) => !post.isPlaceholder)),
    item("Galería", "galeria/entries/gallery", 2, "Crear al menos un evento real en la galería", galleryEvents.some((event) => !event.isPlaceholder)),

    // ── Salud del sitio (se rompe sin querer al editar)
    item("Salud del sitio", "personalizar/entries/navegacion", 2, "Arreglar los enlaces que llevan a una página que no existe", broken.length === 0, undefined, broken.length ? broken.map((entry) => entry.where + " → " + entry.href + " (" + entry.reason + ")").join(" · ") : undefined),
    item("Salud del sitio", "documentos/entries/documentos", 2, "Subir el archivo de los documentos que lo tienen vacío o borrado", missingFiles.length === 0, undefined, missingFiles.length ? missingFiles.join(", ") : undefined),
    item("Documentos", "documentos/entries/documentos", 2, "Subir al menos un documento (reglamento, lista de útiles, ficha)", documents.length > 0),

    // ── Cuando puedas
    all("Propuesta", "propuesta/entries/pillars", 3, "Confirmar los pilares", pillars.filter((entry) => entry.confirmed).length, pillars.length),
    all("Propuesta", "propuesta/entries/pillars", 3, "Subir foto de cada pilar", pillars.filter((entry) => entry.image).length, pillars.length),
    all("Niveles", "propuesta/entries/levels", 3, "Subir foto de cada nivel", levels.filter((entry) => entry.image).length, levels.length),
    all("Actividades", "propuesta/entries/activities", 3, "Confirmar las actividades", activities.filter((entry) => entry.confirmed).length, activities.length),
    all("Actividades", "propuesta/entries/activities", 3, "Subir foto de cada actividad", activities.filter((entry) => entry.image).length, activities.length),
    all("Actividades", "propuesta/entries/experience", 3, "Subir las fotos de “Así se vive”", experienceShots.filter((entry) => entry.image).length, experienceShots.length),
    all("Nosotros", "nosotros/entries/team", 3, "Subir la foto de cada persona del equipo", team.filter((member) => member.image).length, team.length),
    item("Nosotros", "nosotros/entries/achievements", 3, "Cambiar los logros de ejemplo por reales", achievements.length > 0 && achievements.every((entry) => !entry.isPlaceholder)),
    item("Nosotros", "nosotros/entries/testimonials", 3, "Cambiar los testimonios de ejemplo por reales", testimonials.length > 0 && testimonials.every((entry) => !entry.isPlaceholder)),
    item("Noticias", "noticias", 3, "Borrar las noticias de ejemplo", news.every((post) => !post.isPlaceholder)),
    item("Galería", "galeria/entries/gallery", 3, "Borrar los eventos de ejemplo", galleryEvents.every((event) => !event.isPlaceholder)),
    item("Calendario", "calendario", 3, "Agregar al menos un evento real al calendario", events.some((event) => !event.isPlaceholder)),
    item("Calendario", "calendario", 3, "Borrar los eventos de ejemplo del calendario", events.every((event) => !event.isPlaceholder)),
    item("Salud del sitio", "medios", 3, "Reducir las fotos de más de 2 MB", heavy.length === 0, undefined, heavy.length ? heavy.join(", ") : undefined),
    item("Salud del sitio", "personalizar/entries/navegacion", 3, "Mantener el menú corto (10 enlaces o menos)", navLinks.length <= 10, undefined, `${navLinks.length} enlaces`),
  ];

  // Notas y tareas del equipo: vencidas o para los próximos 3 días = urgentes
  const today = todayISO();
  const soon = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
  teamTasks.forEach((task) => {
    const priority: Priority = task.due && task.due <= soon ? 1 : task.due ? 2 : 3;
    const detail = [task.due && (task.due < today ? "vencida · " + task.due : "para el " + task.due), task.who].filter(Boolean).join(" · ") || undefined;
    items.push(item("Tareas del equipo", "personalizar/entries/tareas", priority, (task.kind === "nota" ? "Nota: " : "") + task.title, task.done, undefined, detail));
  });

  const done = items.filter((entry) => entry.done).length;
  return {
    percent: Math.round((done / items.length) * 100),
    done,
    total: items.length,
    updatedAt: new Date().toISOString(),
    items,
  };
}
