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

## 2026-10-13

- Se subió el proyecto a GitHub: https://github.com/LuisTRDev/web-tesla (rama `main`). El commit tiene como único autor a Luisillo <job.soft.1995@gmail.com>, sin la línea `Co-Authored-By: Claude`.
- Recuerda: en los próximos commits no se añade la línea de Claude.

## 2026-10-14

- Pediste un formato para que el administrador del colegio envíe las fotos y los textos de la web. Se crearon:
  - `fotos-web-nikola-tesla.zip` (ignorado en git): carpetas vacías con la misma estructura de `public/images/` (generales/portada, generales/nosotros, generales/admision, logo, equipo, pilares/<id>, niveles/<nivel>, experiencia/<id>, actividades/<tipo>, galeria/<año>/<mes-evento>, noticias), con un `LEEME.txt` en cada carpeta e `INSTRUCCIONES.txt` en la raíz. El admin las llena y devuelve un ZIP o RAR, que se copia directo a `public/images/`. Sustituye a la primera versión en Markdown (`FORMATO_FOTOS_COLEGIO.md`, ya borrada).
  - `FORMATO_TEXTOS_COLEGIO.md`: preguntas con códigos (`[GEN-01]`, `[NOS-01]`, `[PRO-01]`…) y el texto actual, para que respondan "OK" o escriban su versión.
- Cuando lleguen las respuestas, cada código indica el archivo de `data/` donde va: GEN → `settings.ts`, NOS → `philosophy.ts` y `settings.ts` (stats), EQU → `team.ts`, PRO → `pillars.ts`, NIV → `levels.ts`, ACT → `activities.ts`, LOG → `achievements.ts`, TES → `testimonials.ts`, ADM → `admission.ts`, FAQ → `faq.ts`, GAL → `gallery.ts`, NOT → `news.ts`.
- Se piden dos códigos modulares (Primaria y Secundaria), pero `settings.legal.modularCode` admite uno solo; habrá que ajustarlo cuando lleguen.

## 2026-10-25

- Preguntaste qué más mejorar y añadir de cara a la campaña de Admisión 2027, y qué hacer sin fotos, videos ni textos. Dijiste "hazlo todo" y se implementó lo que no depende de material del colegio:
  - **Página de campaña** `/admision-2027` (`app/admision-2027/page.tsx`): cabecera animada, contador regresivo, cifras animadas (solo las que tengan dato), "Por qué elegirnos" (sale de `data/pillars.ts`), pasos, formulario "Agenda tu visita" y preguntas frecuentes. Tiene su propia imagen para compartir. El hero y el sitemap ya apuntan a ella. La ruta lleva el año: si cambia `admissionYear`, hay que renombrar la carpeta.
  - **Contador regresivo** (`components/ui/Countdown.tsx`) con `settings.admissionDeadline`. La fecha `2027-02-26` es PROVISIONAL y lleva etiqueta "Fecha por confirmar"; con `null` se oculta. También aparece en el bloque amarillo de Admisión de la portada.
  - **Cifras animadas con resplandor** (`CountUp.tsx`), usadas en Nosotros y en la página de campaña.
  - **Hero**: sin foto muestra un fondo de aurora animado (en vez del marco "[FOTO PENDIENTE]") y, cada 4 a 9 segundos, un rayo breve dibujado en el canvas.
  - **Chispas** al pasar el cursor sobre elementos con `data-spark` (botones, tarjetas de módulos y actividades): `SparkTrail.tsx`. Solo en pantallas con ratón y sin `prefers-reduced-motion`.
  - **Barra de progreso de scroll** (`ScrollProgress.tsx`).
  - **Ilustraciones de línea SVG** (`Illustration.tsx`) para pilares, actividades y experiencia. `SchoolImage` recibe `illustration="id"` y las muestra mientras no haya foto; al poner la foto real desaparecen solas.
  - **Seguimiento de campañas** (`lib/track.ts`, `ClickTracker.tsx`): guarda `utm_source/medium/campaign`, registra `whatsapp_click`, `contact_form_submit` y `visit_request` en GA4 (si hay `NEXT_PUBLIC_GA_ID`) y añade "(vía facebook)" al mensaje de WhatsApp. Los anuncios deben enlazar con `?utm_source=facebook&utm_campaign=...`.
  - **Datos para Google**: `School` con `@id`, `image`, `areaServed` y `hasMap`.
- No se hizo: modo oscuro (toca todos los colores de la web), línea de tiempo de historia, tour 360, video del hero y galería en mosaico (necesitan material real).
- `tsc`, `next lint` y `next build` pasan sin errores. No se revisó visualmente en el navegador.
