/**
 * Tipos compartidos. Están pensados para mapear 1:1 con tablas de Supabase (o un CMS).
 * Convención: `null` significa "dato pendiente" y la interfaz muestra un placeholder visible.
 */

export interface SiteSettings {
  name: string;
  shortName: string;
  kicker: string;
  tagline: string;
  concept: string;
  footerPhrase: string;
  description: string;
  admissionYear: number;
  /** Último día de inscripciones (AAAA-MM-DD). null oculta el contador regresivo. */
  admissionDeadline: string | null;
  /** Dominio final del sitio (para SEO, sitemap y Open Graph). */
  siteUrl: string;
  location: {
    address: string;
    district: string;
    province: string;
    region: string;
    country: string;
    /** Texto que se envía a Google Maps para ubicar el mapa. */
    mapQuery: string;
  };
  contact: {
    /** Solo dígitos con código de país, por ejemplo "51999999999". El primero es el principal. */
    whatsapp: string[];
    /** Horario de atención, p. ej. "Lunes a viernes, 7:30 a. m. – 3:00 p. m.". null = pendiente. */
    hours: string | null;
    /** Botón flotante de WhatsApp: texto, lado de la pantalla y mensajes según la página. */
    whatsappButton: {
      label: string;
      side: "derecha" | "izquierda";
      defaultMessage: string;
      /** Mensaje por página; gana el que tenga la ruta más específica. */
      messages: Array<{ path: string; message: string }>;
    };
  };
  /** Datos oficiales que respaldan a la institución. null = pendiente. */
  legal: {
    /** Resolución de creación o funcionamiento (UGEL). */
    resolution: string | null;
    /** Código modular del MINEDU. */
    modularCode: string | null;
  };
  social: {
    facebook: string | null;
    instagram: string | null;
    tiktok: string | null;
    youtube: string | null;
  };
  /** Muestra etiquetas "Por confirmar" sobre el contenido provisional. Poner en false al publicar. */
  showDraftBadges: boolean;
  images: {
    hero: string | null;
    about: string | null;
    aboutDetail: string | null;
    admission: string | null;
    /** Video del hero (archivo .mp4 o .webm). Si existe, reemplaza a la foto de portada. */
    heroVideo: string | null;
    /** Imagen que aparece al compartir el sitio en redes. null = imagen generada automáticamente. */
    share: string | null;
  };
  stats: Stat[];
  /** Formularios al correo (Web3Forms). */
  forms: { emailKey: string | null };
  /** Calendario para agendar la visita (Calendly o Cal.com). */
  booking: { url: string | null };
  /** Animación breve al escanear un QR (antes de entrar a la web). */
  qrIntro: {
    animation: "ninguna" | "atomo" | "rayos" | "bobina" | "energia" | "chispas" | "constelaciones" | "circuito" | "fuegos" | "bandera";
    /** Frase bajo el nombre del colegio durante la animación. */
    text: string;
    seconds: number;
    /** A dónde llevan los QR impresos: la página de campaña, WhatsApp, Contacto o el Inicio. */
    destination: "campana" | "whatsapp" | "contacto" | "inicio";
  };
}

export interface Stat {
  id: string;
  value: string | null;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface PhilosophyConcept {
  id: string;
  title: string;
  description: string;
  /** false = propuesta de diseño, aún no validada por la institución. */
  confirmed: boolean;
}

export interface Pillar {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string | null;
  /** Ilustración que se muestra mientras no hay foto (ver components/ui/Illustration.tsx). */
  illustration?: string;
  confirmed: boolean;
}

export interface Level {
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** Grados que comprende el nivel. null = por confirmar. */
  grades: string[] | null;
  image: string | null;
  confirmed: boolean;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string | null;
  illustration?: string;
  confirmed: boolean;
}

export type MediaType = "image" | "video";

export interface GalleryMedia {
  id: string;
  type: MediaType;
  /** URL de la foto o del video (archivo, YouTube o Vimeo). null = pendiente. */
  url: string | null;
  thumbnail?: string | null;
  caption?: string;
  /** Fecha ISO (AAAA-MM-DD). */
  date?: string;
}

export interface GalleryEvent {
  id: string;
  title: string;
  description: string;
  /** Fecha ISO (AAAA-MM-DD). */
  date: string;
  category: string;
  coverImage: string | null;
  media: GalleryMedia[];
  /** true = evento de ejemplo para mostrar el diseño. */
  isPlaceholder?: boolean;
}

export interface NewsPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Párrafos del cuerpo de la publicación. */
  body: string[];
  /** Fecha ISO (AAAA-MM-DD). */
  date: string;
  category: string;
  image: string | null;
  isPlaceholder?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: "Padre de familia" | "Madre de familia" | "Estudiante" | "Docente";
  isPlaceholder?: boolean;
}

export interface AdmissionStep {
  id: string;
  title: string;
  description: string;
  confirmed: boolean;
}

export interface ExperienceShot {
  id: string;
  label: string;
  caption: string;
  image: string | null;
  illustration?: string;
}

export interface AdmissionInfo {
  title: string;
  text: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** false = respuesta pendiente de la institución. */
  confirmed: boolean;
}

export interface TeamMember {
  id: string;
  /** Nombre completo. null = pendiente. */
  name: string | null;
  role: string;
  /** Especialidad o breve descripción. null = pendiente. */
  bio: string | null;
  image: string | null;
}

export interface Achievement {
  id: string;
  /** Año del logro. null = pendiente. */
  year: string | null;
  title: string;
  description: string;
  isPlaceholder?: boolean;
}

export interface SchoolEvent {
  slug: string;
  title: string;
  /** Fecha de inicio (AAAA-MM-DD). */
  date: string;
  /** Fecha de fin, si dura varios días. */
  endDate: string | null;
  /** Hora en texto libre, por ejemplo "8:00 a. m.". */
  time: string | null;
  place: string | null;
  category: string;
  description: string | null;
  image: string | null;
  link: string | null;
  linkText: string | null;
  /** true = evento de ejemplo para mostrar el diseño. */
  isPlaceholder?: boolean;
}

export interface SchoolDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  /** Ruta del archivo (/documentos/…) o enlace externo. */
  file: string;
  date: string | null;
  extension: string;
  sizeLabel: string | null;
  /** false = el archivo no existe en public/ (se avisa en el panel). */
  fileExists: boolean;
  featured: boolean;
}

export interface ExtraPage {
  slug: string;
  title: string;
  kicker: string | null;
  intro: string | null;
  /** Párrafos. Una línea que empieza con "## " es un subtítulo y con "- " un punto de lista. */
  body: string[];
  image: string | null;
  imageCaption: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  documents: Array<{ title: string; file: string }>;
  seoDescription: string;
  shareImage: string | null;
  published: boolean;
  updated: string | null;
}
