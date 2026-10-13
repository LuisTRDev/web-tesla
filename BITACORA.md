# Bitácora de conversaciones con Claude

Registro de lo que vamos hablando y haciendo en el proyecto, para retomar el contexto en cada sesión.
Las entradas más recientes van al final.

---

## 2026-10-09

- Preguntaste si recuerdo conversaciones anteriores. Revisé la memoria del proyecto y estaba vacía, así que no había nada guardado de sesiones previas.
- Pediste un archivo donde se vaya guardando lo que hablamos y se creó esta bitácora (`BITACORA.md`).
- Proyecto: `iep-nikola-tesla`, una app Next.js con Tailwind y TypeScript (carpetas `app/`, `components/`, `data/`, `lib/` y `types/`).
- Fotos de Niveles: se añadió una foto de aula para Primaria (`public/images/niveles/primaria/aula-primaria-01.png`) y otra para Secundaria (`public/images/niveles/secundaria/aula-secundaria-01.png`), enlazadas desde `data/levels.ts`.
- Se creó la estructura de carpetas `public/images/` organizada por sección (generales, niveles, pilares, experiencia, actividades/<tipo>, noticias, galeria/<año>), con una guía en `public/images/LEEME.md`.
- Ojo: las dos fotos traen incrustados el logo y la franja con el nombre del colegio, y el diseño podría recortarlos. Si existen, conviene usar las versiones originales sin texto.
- Fotos de Actividades: se añadió una foto a "Actividades escolares" (`public/images/actividades/escolares/actividad-escolar-01.png`, la feria de las regiones con la mazamorra morada) y otra a "Cultura" (`public/images/actividades/cultura/cultura-01.png`, la escenificación inca), enlazadas desde `data/activities.ts`. La foto de Cultura trae incrustada abajo la franja "COLEGIO NIKOLA TESLA".
- Preguntaste qué le falta a la web para ser una presentación profesional. Revisé el sitio y te di una lista por prioridad:
  1. Contenido real: fotos reales (incluido el hero), textos de propuesta y niveles, grados, noticias, testimonios, datos de admisión y cifras.
  2. Conversión: botón flotante de WhatsApp, campaña de Admisión 2027 visible y tour del colegio en video.
  3. Confianza: docentes, logros, resolución de la UGEL y una sección de preguntas frecuentes.
  4. Técnico: dominio, analítica, ficha de Google Business, fotos optimizadas y apagar las etiquetas "Por confirmar".
- Se hicieron las mejoras que no dependen de información del colegio:
  - Botón flotante de WhatsApp en todo el sitio: aparece al bajar y, en Admisión, el mensaje menciona la admisión (`components/ui/WhatsAppFloat.tsx`).
  - Aviso "Admisión 2027 · Infórmate sobre el proceso" en el hero de la portada.
  - Preguntas frecuentes en Admisión y Contacto (`data/faq.ts`, `components/sections/Faq.tsx`). Las respuestas están pendientes y, cuando se confirman, se envían a Google como FAQPage.
  - "Nuestro equipo" y "Nuestros logros" en Nosotros (`data/team.ts`, `data/achievements.ts`), con espacios reservados. Fotos del equipo en `public/images/equipo/`.
  - Nuevos campos en `data/settings.ts`: teléfono, correo, horario (`contact`), resolución UGEL y código modular (`legal`). Se muestran en Contacto, en el pie de página y en Admisión.
  - Google Analytics 4 opcional mediante la variable `NEXT_PUBLIC_GA_ID` (`.env.example`).
  - Corregido un error en `formatPhone`: los números se mostraban como "51960209798" en lugar de "960 209 798".
  - Lista de lo que hay que pedirle al colegio en `PENDIENTES_COLEGIO.md`.
  - Pendiente: convertir las fotos PNG a JPG o WebP. No hay ninguna herramienta instalada para hacerlo; mientras tanto, Next.js las optimiza al servirlas.
- Se quitaron el teléfono y el correo de toda la web (tipos, settings, Contacto, pie de página, datos para Google y documentación) porque por ahora el colegio no los tendrá. Se mantiene el horario de atención. Si más adelante los tienen, hay que volver a añadirlos.
