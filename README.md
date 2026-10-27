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
npm run typecheck    # revisión de tipos
npm run check:panel  # revisa que el panel pueda abrir (config.yml, archivos de contenido y campos); corre solo antes de `build`
npm run test:qr      # prueba el diseñador de QR (plantillas, formas de punto y degradados)
```

Guía para quien trabaje en el código (y para Claude Code): [CLAUDE.md](CLAUDE.md). Historial de lo hecho: [BITACORA.md](BITACORA.md). Lo que falta del colegio: [PENDIENTES_COLEGIO.md](PENDIENTES_COLEGIO.md).

## Estructura

```
app/          Rutas: portada y un módulo por sección (/nosotros, /propuesta, /niveles, /actividades, /galeria,
              /noticias, /admision, /contacto), detalles de nivel y noticia, transición entre módulos (template.tsx), SEO.
              Además: /admision-AAAA (campaña), /qr/<lugar> (enlaces cortos de los QR), /escanear (Escáner Tesla),
              /recorrido (recorrido virtual 360°), /admin (panel) y app/fonts.ts (pares de letras elegibles)
components/
  layout/     Navbar y Footer
  sections/   Bloques de contenido que componen cada módulo (Hero, About, Proposal, Levels, ModuleIndex, ...)
  gallery/    Explorador de galería, visor a pantalla completa, historias tipo "stories" y visor 360° (Pannellum)
  ui/         Piezas reutilizables (ModuleHeader, ModuleMotif, NextModule, SchoolImage, ButtonLink, Reveal, ...), fondo y cursor
              eléctricos, "Cómo llegar", tarjeta para compartir, calendario de visitas y extras de formularios
  layout/     (además) aviso de privacidad/cookies y permiso para Google Analytics
content/      Contenido editable en JSON (lo edita el panel /admin)
data/         Lee y valida el contenido; diseño fijo de los módulos (data/modules.ts)
lib/          Capa de datos (data.ts, content.ts), utilidades, seguimiento de campañas y agrupación de la galería;
              QR: qr-redirect.ts (destino), qr-splash.ts (animación al escanear), qr-scanner.ts (Escáner Tesla);
              send-form.ts (formularios al correo), markdown.tsx (texto con formato de las noticias)
public/admin/ Panel de edición: config.yml (campos), previews.js (vistas previas), preview.css (generado), mobile.css/js (celular),
              panel-errors.js, panel-extras.js, preview-device.js, plantillas.html, qr-designer.js y las demás herramientas
public/vendor Librerías servidas desde la propia web (Pannellum 2.5.6, licencia MIT)
scripts/      Estilos de las vistas previas, aviso de imágenes pesadas, check-panel.mjs y test-qr-designer.mjs
.github/      Flujos: reconstrucción diaria, copia semanal y recordatorio mensual de copia
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
- **Celular y vista previa fiel:** en pantallas angostas el formulario ocupa todo el ancho, la vista previa se abre con un botón flotante (👁 / ✏️), hay una barra inferior con Inicio, Noticia, Campaña y Contenido; en pantallas anchas la vista previa se puede ver como **celular (390 px, con marco)** o pantalla completa.
- **Errores y guardado:** resumen “Faltan N cosas para publicar” con un botón por campo, avisos claros (sin conexión, sesión vencida…), aviso fijo sin internet y copia automática del borrador en el aparato (`local_backup`).
- **Otros del panel:** menú “Aa” (letra grande y más contraste), globo rojo con pendientes urgentes en Inicio, tarjetas de Inicio que se pueden ocultar y fijar, Ctrl + K o `/` para buscar, plantillas de textos, notas y tareas del equipo, comprobador de calidad antes de publicar (espacios dobles, MAYÚSCULAS, tildes olvidadas), copia de seguridad descargable, redirecciones y enlaces cortos, editor de texto con formato en las noticias.
- **Probarlo en local sin iniciar sesión:** `npm run panel`, abrir http://localhost:3000/admin y pulsar “Iniciar sesión”.

## QR, campaña y escáner

- **Enlaces cortos** `/qr/<lugar>` (volante, afiche, banner…): llevan a la campaña, WhatsApp, Contacto o Inicio (se elige en *Datos del colegio → Animación del QR → A dónde llevan los QR impresos*; pasada la fecha de cierre siempre van a Admisión) con `utm_*` para medir cada medio.
- **Animación al escanear:** antes de entrar a la web se ve unos segundos una animación (átomo, rayos, bobina Tesla, línea de energía, chispas, constelaciones, circuito, fuegos artificiales o bandera del Perú), o ninguna. Es una sola página HTML con canvas (`lib/qr-splash.ts`), con botón “Saltar”, respeta “reducir movimiento” y tiene respaldo si falla JavaScript. Para probar una: `/qr/volante?anim=atomo`.
- **Escáner Tesla (`/escanear`):** abre la cámara, detecta el QR y dibuja el efecto elegido sobre el propio código; solo abre sola direcciones de esta misma web. **Modo entradas:** los QR `TESLA-TICKET|evento|nombre|n` (se generan en el diseñador, “🎟 Entradas con nombre”) se validan sin animación, avisan si ya ingresaron y exportan CSV; los ingresos viven **solo en ese celular**. La cámara exige HTTPS.
- **Diseñador de afiches y QR** (`public/admin/qr-designer.js`): 9 formatos, 9 plantillas (Marca, Clásico, Líquido, Suave, Energía, Tesla, **Neón**, **Fiesta**, Una tinta), 10 formas de punto, 12 colores, degradado de 3 colores, marca de agua, insignia en esquina, dibujo de fondo del recuadro, chispas, resplandor neón, etiqueta, inclinación, semáforo y prueba de lectura, PDF para la imprenta, **hoja de 20 códigos por página**, series numeradas, animación WebM con chispas que parpadean y entradas con nombre. El texto se codifica en UTF-8.

## Personalización de la web (desde el panel)

*Personalizar la web → Colores y efectos:* paleta, **letras** (4 pares + tamaño), **forma** de esquinas, efectos (rayos, chispas, **fondo y cursor eléctricos**, **velocidad de las apariciones**, cortina, WhatsApp). *Datos del colegio:* logo y favicon propios, **aviso de privacidad y cookies** (con él activo, Google Analytics solo carga si la persona acepta), **formularios al correo** (Web3Forms), mensaje de gracias y pregunta “¿cómo nos conociste?”, **calendario de visitas** (Calendly o Cal.com), **horario de atención del botón de WhatsApp**. *Galería:* **recorrido virtual 360°** (`/recorrido`) e historias tipo stories. *Página de campaña:* **línea de tiempo** del proceso con línea de energía que llega al cierre. *Contacto:* botones “Cómo llegar” (Google Maps, Waze, Uber). *Pie:* botón “Compartir esta página” que crea una tarjeta con el QR de esa página. *Noticias:* texto con formato, autor, fecha de actualización y “ocultar desde el día”.

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
| Orden de la portada, menú y pie de página, colores, letras, esquinas y efectos | `content/portada.json`, `navegacion.json`, `apariencia.json` | Personalizar la web |
| Recorrido virtual 360° (fotos panorámicas por lugar) | `content/recorrido.json` | Galería de fotos |
| Redirecciones y enlaces cortos (`/matricula` → …) | `content/redirects.json` | Personalizar la web |
| Notas y tareas del equipo (salen en el Inicio del panel) | `content/tareas.json` | Personalizar la web |
| Animación y destino de los QR, formularios al correo, calendario, aviso de privacidad, logo y favicon | `content/settings.json` (`qrIntro`, `forms`, `booking`, `privacy`, `images`) | Datos del colegio |

Lo que sigue en el código (lo cambia el desarrollador): colores y motivos de cada módulo (`data/modules.ts`),
tipografías disponibles (`app/fonts.ts`; cuál se usa y los colores salen de `data/appearance.ts`), el logo por defecto (`components/ui/Logo.tsx`),
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
- **Tipografía:** por defecto Bricolage Grotesque (títulos) y Figtree (texto); en el panel se puede cambiar a Clásica (Playfair Display + Source Sans 3), Moderna (Space Grotesk + Inter) o Redondeada (Nunito).
- **Gesto de marca:** la "línea de energía", una onda fina que cruza el hero y reaparece en los titulares.
- **Animación:** entradas con desenfoque a nítido, líneas de campo que reaccionan al cursor y transiciones al interactuar. Todo respeta `prefers-reduced-motion`.
