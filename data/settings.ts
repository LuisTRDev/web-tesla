import type { SiteSettings } from "@/types";

/**
 * CONFIGURACIÓN CENTRAL DEL SITIO
 * Todo dato institucional vive aquí. Cambia un valor y se actualiza en toda la web.
 * Los valores en `null` se muestran como placeholders visibles, por ejemplo [WHATSAPP OFICIAL].
 */
export const settings: SiteSettings = {
  name: "Institución Educativa Privada “Nikola Tesla”",
  shortName: "Nikola Tesla",
  kicker: "Institución Educativa Privada",
  tagline: "Donde la curiosidad se convierte en futuro.",
  concept: "Educación que despierta la curiosidad y prepara para el futuro.",
  footerPhrase: "Educación, curiosidad y futuro.",
  description:
    "Institución Educativa Privada “Nikola Tesla”, ubicada en Nuevo Imperial, Cañete, Lima. Conoce nuestra propuesta educativa, actividades, comunidad y proceso de admisión.",
  admissionYear: 2027,

  // TODO: reemplazar por el dominio real antes de publicar.
  siteUrl: "https://www.example.com",

  location: {
    address: "Mz. B Lote 13",
    district: "Nuevo Imperial",
    province: "Cañete",
    region: "Lima",
    country: "Perú",
    mapQuery: "Nuevo Imperial, Cañete, Lima, Perú",
  },

  contact: {
    // Solo dígitos con código de país. El primero es el principal (formulario y botones de WhatsApp).
    whatsapp: ["51960209798", "51982565433"],
    hours: null,
  },

  // Respaldo oficial. Se muestra en el pie de página y en Admisión.
  legal: {
    resolution: null,
    modularCode: null,
  },

  social: {
    facebook: "https://www.facebook.com/search/top?q=instituci%C3%B3n%20educativa%20privada%20%22nikola%20tesla%22",
    instagram: null,
    tiktok: "https://www.tiktok.com/@colegio.tesla.canete",
    youtube: null,
  },

  // Etiquetas "Por confirmar" sobre contenido provisional. Cambiar a false al publicar.
  showDraftBadges: true,

  // Fotos principales. Coloca los archivos en /public/images y escribe la ruta, p. ej. "/images/hero.jpg".
  images: {
    hero: null,
    about: null,
    aboutDetail: null,
    admission: null,
  },

  // Cifras de la sección "Nosotros". No inventar: completar con datos reales.
  stats: [
    { id: "trayectoria", value: null, label: "Años de trayectoria" },
    { id: "estudiantes", value: null, label: "Estudiantes" },
    { id: "docentes", value: null, label: "Docentes" },
  ],
};
