# Institución Educativa Privada “Nikola Tesla” · Sitio web

Sitio institucional construido con **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion**.

## Cómo ejecutarlo

Requiere Node.js 18.17 o superior.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilación de producción
npm run start
npm run panel    # web + panel de edición en local (http://localhost:3000/admin), sin iniciar sesión
```

## Estructura

```
app/          Rutas: portada y un módulo por sección (/nosotros, /propuesta, /niveles, /actividades, /galeria,
              /noticias, /admision, /contacto), detalles de nivel y noticia, transición entre módulos (template.tsx), SEO
components/
  layout/     Navbar y Footer
  sections/   Bloques de contenido que componen cada módulo (Hero, About, Proposal, Levels, ModuleIndex, ...)
  gallery/    Explorador de galería y visor a pantalla completa
  ui/         Piezas reutilizables (ModuleHeader, ModuleMotif, NextModule, SchoolImage, ButtonLink, Reveal, ...)
content/      Contenido editable en JSON (lo edita el panel /admin)
data/         Lee y valida el contenido; diseño fijo de los módulos (data/modules.ts)
lib/          Capa de datos (data.ts, content.ts), utilidades, seguimiento de campañas y agrupación de la galería
public/admin/ Panel de edición: config.yml (campos), previews.js (vistas previas), preview.css (generado)
scripts/      Estilos de las vistas previas y aviso de imágenes pesadas
types/        Tipos compartidos, listos para mapear a tablas
```

## Módulos

El sitio está dividido en módulos: cada sección es una página propia con su personalidad (color de
cabecera, acento, motivo gráfico y frase). Todo se define en `data/modules.ts`, y de ahí lo leen el menú,
el índice de la portada, la cabecera de cada módulo, el enlace "Siguiente" al pie y la cortina de color
que aparece al cambiar de sección. Para cambiar el orden, el color o la frase de un módulo, se edita solo ese archivo.
Cada nivel (Primaria y Secundaria) tiene además su propio color en `levelThemes`.

## Panel de edición (para la clienta)

El contenido de la web se edita desde un panel (**Decap CMS**) en `/admin`, sin tocar código y sin base de datos.
Cada cambio publicado se guarda como un commit en este repositorio y Netlify actualiza la web en 1 o 2 minutos.

- **Cómo entrar:** en el pie de página, 5 clics seguidos sobre el logo (no hay botón visible). Pide iniciar sesión con GitHub.
- **Vista previa:** mientras se edita, el panel muestra cómo quedará cada sección (`public/admin/previews.js`).
- **Orientación:** migas y botón Volver, índice de saltos, listas tipo acordeón, ayuda lateral por pantalla, guía con globos y modo práctica (`public/admin/panel-guide.js`, `guide.css`, `tutoriales.js`).
- **Guía para la clienta:** [docs/GUIA_PANEL.md](docs/GUIA_PANEL.md)
- **Configuración técnica (una sola vez):** [docs/CONFIGURAR_PANEL.md](docs/CONFIGURAR_PANEL.md)
- **Herramientas incluidas:** Inicio (saludo, buscador “¿qué quieres cambiar?”, acciones, lista de pendientes por prioridad, mapa de la web y últimos cambios), secciones con tarjetas, formularios con pestañas, resumen y confirmación al publicar, Campaña y QR (diseñador de afiches, volantes y stickers con QR de la identidad del colegio: 9 formatos, plantillas de estilo, forma y color de puntos y esquinas, escudo central, etiqueta, contenido variable —web, WhatsApp, llamada, mapa, contacto—, semáforo y prueba de lectura con cámara, series numeradas, animación, PDF para la imprenta y diseños guardados; más generador de enlaces), Resultados, Ayuda con tutoriales, recorrido de bienvenida, optimizador de fotos y aviso destacado sobre el menú.
- **Probarlo en local sin iniciar sesión:** `npm run panel` y abrir http://localhost:3000/admin

## Dónde se edita cada cosa

El contenido vive en **`content/*.json`** (lo edita el panel). Los archivos de `data/` solo lo leen, lo validan y le
ponen valores de respaldo; los componentes no cambian al editar contenido.

| Qué | Archivo | Sección del panel |
|---|---|---|
| WhatsApp, redes, dirección, dominio, año de admisión, fecha del contador, fotos principales, cifras | `content/settings.json` | Datos del colegio |
| Menú, títulos, introducciones y descripción para Google de cada sección | `content/modules.json` | Páginas y textos |
| Aviso de la portada y textos de la página de campaña | `content/pages.json` | Páginas y textos |
| Texto de "Nosotros" y valores | `content/philosophy.json` | Nosotros |
| Equipo, logros, testimonios | `content/team.json`, `achievements.json`, `testimonials.json` | Nosotros |
| Pilares, niveles, actividades, "Así se vive" | `content/pillars.json`, `levels.json`, `activities.json`, `experience.json` | Propuesta, niveles y actividades |
| Pasos, requisitos, fechas y vacantes de admisión | `content/admission.json` | Admisión y preguntas frecuentes |
| Preguntas frecuentes | `content/faq.json` | Admisión y preguntas frecuentes |
| Galería (eventos, fotos, videos) | `content/gallery.json` | Galería |
| Noticias (un archivo por noticia; con fecha futura se publican solas ese día) | `content/noticias/*.json` | Noticias |
| Avisos destacados sobre el menú (varios, con color, fechas y páginas) | `content/banner.json` | Páginas y textos |
| Calendario de eventos (un archivo por evento) | `content/eventos/*.json` | Calendario de eventos |
| Documentos para descargar (archivos en `public/documentos/`) | `content/documentos.json` | Documentos para descargar |
| Páginas nuevas (`/p/nombre`) | `content/paginas/*.json` | Páginas nuevas |
| Orden de la portada, menú y pie de página, colores y efectos | `content/portada.json`, `navegacion.json`, `apariencia.json` | Personalizar la web |

Lo que sigue en el código (lo cambia el desarrollador): colores y motivos de cada módulo (`data/modules.ts`),
tipografías (`app/layout.tsx`; los colores salen de `data/appearance.ts`), logo (`components/ui/Logo.tsx`),
ilustraciones (`components/ui/Illustration.tsx`), campos y vistas previas del panel (`public/admin/`).
Google Analytics: variable `NEXT_PUBLIC_GA_ID` (ver `.env.example`).

Si el panel guarda un campo vacío o falta uno, `lib/content.ts` lo convierte a "pendiente" o a un valor de respaldo,
así que un cambio mal hecho no rompe la web. Un JSON con sintaxis inválida sí detiene el build de Netlify (la web publicada sigue intacta).

## Contenido pendiente (no se inventó ningún dato)

Todo lo que falta aparece en la web entre corchetes, por ejemplo `[WHATSAPP OFICIAL]`, y como
marcos con el rótulo `[FOTO PENDIENTE]` o con una ilustración. Además, el contenido provisional lleva una
etiqueta "Por confirmar".

Antes de publicar (todo se hace desde el panel):

1. Datos del colegio: dirección de la web, WhatsApp, redes, horario, resolución y código modular.
2. Subir fotos (y el video de la portada, si hay).
3. Confirmar los textos (casilla "Confirmado por el colegio").
4. Reemplazar eventos, noticias y testimonios de ejemplo.
5. Verificar la búsqueda del mapa.
6. Desmarcar "Mostrar etiquetas Por confirmar".
7. Poner la fecha real de cierre de inscripciones (contador de la campaña).
8. El logo oficial ya está en `public/images/logo-escudo.png`.

## Agregar un evento a la galería

Desde el panel: **Galería → Eventos → Añadir**. Se elige el título, la fecha, la categoría y se suben las fotos;
para videos, el archivo .mp4 o el enlace de YouTube/Vimeo ("Insertar desde URL"). La web lo ubica sola en su año y mes.

## Conectar Supabase (o un CMS) más adelante

Los componentes no leen `/data` para las listas dinámicas: piden todo a `lib/data.ts`
(`getGalleryEvents`, `getNews`, `getLevels`, ...). Para migrar basta con cambiar el interior de esas
funciones; la interfaz no se toca.

Tablas sugeridas:

- `gallery_events` (id, title, description, date, category, cover_image)
- `gallery_media` (id, event_id, type, url, thumbnail, caption, date)
- `news` (slug, title, excerpt, body, date, category, image)
- `testimonials` (id, quote, author, role)

Si las imágenes se sirven desde Supabase Storage, autorizar el dominio en `next.config.mjs` → `images.remotePatterns`.

## Identidad visual

- **Paleta:** noche `#0D1230`, tiza `#EEF0F7`, blanco, filamento `#FFB627` (acento, con moderación), arco `#A9ADFF` (líneas).
- **Tipografía:** Bricolage Grotesque (títulos) y Figtree (texto).
- **Gesto de marca:** la "línea de energía", una onda fina que cruza el hero y reaparece en los titulares.
- **Animación:** entradas con desenfoque a nítido, líneas de campo que reaccionan al cursor y transiciones al interactuar. Todo respeta `prefers-reduced-motion`.
