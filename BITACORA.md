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

- Subido a GitHub el commit 2ac2afe con toda la campaña (sin línea de Claude).
- Panel de edición para la clienta con **Decap CMS** en `/admin`, sin base de datos. Se hizo todo el plan de las 6 fases:
  - **Contenido a JSON**: los datos de `data/*.ts` pasaron a `content/*.json` (y una noticia por archivo en `content/noticias/`). Los `data/*.ts` ahora solo leen y validan con `lib/content.ts` (valores de respaldo). Se comprobó con un script que el contenido resultante es idéntico al anterior.
  - **Panel**: `public/admin/config.yml` (7 secciones en español, con ayudas, validaciones y carpetas de fotos), página `app/admin/route.ts` (Decap 3.16.3 fijo, `noindex`, fuera del robots), `es-fixes.js` (traduce "Add" e "Insert from URL").
  - **Vistas previas** en vivo de cada sección (`public/admin/previews.js` + `preview.css` generado con Tailwind en `predev`/`prebuild`). Se probó en Edge: las 15 vistas se dibujan sin errores y editar y publicar escribe el JSON correcto.
  - **Acceso secreto**: 5 clics seguidos (en menos de 3 s) sobre el logo del pie de página abren `/admin` (`SecretAdminTrigger.tsx`). Se probó: 4 clics no abren, el 5.º sí. El panel pide iniciar sesión con GitHub; no hay clave por defecto.
  - **Ahora editable desde el panel** (antes fijo en el código): textos de portada y de la página de campaña (`content/pages.json`), titulares y descripción para Google de cada sección (`content/modules.json`), requisitos, fechas y vacantes de admisión, ilustración elegible por pilar/actividad, video del hero (`images.heroVideo`) e imagen para compartir (`images.share`).
  - Seguridad y orden: validación de WhatsApp (51 + 9 dígitos) y año, aviso en el build de imágenes de más de 2 MB (`scripts/check-images.mjs`), `npm run panel` para probar en local sin iniciar sesión.
  - Documentos: `docs/GUIA_PANEL.md` (para la clienta) y `docs/CONFIGURAR_PANEL.md` (para ti). README y PENDIENTES actualizados.
- **No se hizo (a propósito)**: conversión de fotos a WebP al subirlas (Next.js ya sirve WebP/AVIF) y revisión Borrador→Aprobado (queda como opción comentada en `config.yml`: `publish_mode`).
- **Pendiente para mañana (configuración, no código)**: invitar a la clienta como colaboradora en GitHub, crear la OAuth App de GitHub (callback `https://api.netlify.com/auth/done`) y pegar Client ID y Secret en Netlify (Site configuration → Access & security → OAuth). Pasos en `docs/CONFIGURAR_PANEL.md`. Sin eso, el panel abre pero no deja iniciar sesión en la web publicada.
- Estos cambios del panel **aún no están en un commit**.

## 2026-10-26

- Dijiste: "hazlo todo" con la primera tanda de mejoras del panel y que el QR de los volantes (se reparten en diciembre) **no sea genérico, sino con la identidad del colegio**. Se hizo y se probó con el navegador (Edge) y con decodificadores de QR.
- **QR con identidad** (`public/admin/qr-designer.js`, página "Campaña y QR"): puntos redondeados en azul noche, ojos en azul marino con centro rojo (colores del escudo), escudo al centro con borde amarillo filamento, y tarjetas con el fondo, la tipografía y la línea de energía de la web. Tres formatos: **banda horizontal** (pie de volante, ancho A4 a 300 dpi), **tarjeta vertical** 4:5 (afiche y redes) y **QR solo** (PNG y SVG vectorial). Calidad ×1/×2/×3.
  - Cada lugar (volante, afiche, banner, redes, libreta…) tiene su **enlace corto** `/qr/<lugar>` que redirige a `/admision-2027?utm_source=<lugar>&…` (en `next.config.mjs`), así se mide cuántas familias vienen del volante.
  - **Verificación de lectura:** ZXing lee 54 de 54 combinaciones (3 formatos × 3 direcciones × 3 lugares × normal/foto); jsQR lee todas salvo el "QR solo" gigante de 2400 px (rareza de ese decodificador; la versión reducida y desenfocada, que imita una foto de celular, sí). Para llegar ahí hubo que **llenar más los puntos y redondear menos los ojos**: la primera versión (puntos muy separados) no se leía. Los valores están en `TUNE`; si se cambian, repetir la prueba. Falta probar con celulares reales y una prueba de imprenta.
  - Aviso en la herramienta si la dirección de la web aún es de prueba (`example.com`): **no imprimir hasta poner el dominio real** en "Datos del colegio".
- **Resto de la tanda**:
  - **Inicio** con lista de pendientes y porcentaje (`lib/pending.ts`, `/admin/api/pendientes`): hoy 10 % (3 de 31). Botón "Completar" lleva a cada sección.
  - **Menú superior propio** (Inicio, Campaña y QR, Resultados, Ayuda, Ver la web) y al entrar abre Inicio. Decap 3.16 no trae `registerAdditionalLink`, así que se inyectan los enlaces y las páginas se muestran en un iframe (`panel-ui.js`).
  - **Ayuda** con 11 tutoriales paso a paso, buscador, preguntas frecuentes y glosario; hueco para videos (`panel-config.js` → `videos`); botón flotante "? Ayuda" que abre el tutorial de la sección actual.
  - **Recorrido de bienvenida** de 5 pantallas (`tour.js`), repetible desde Ayuda.
  - **Optimizador de fotos** (`photo-optimizer.js`): reduce a 2000 px y convierte a WebP. Prueba: JPG de 1290 KB → 194 KB.
  - **Descripción para Google** con contador y vista previa (widget `seo-descripcion`). La descripción del colegio medía 168 caracteres; se acortó a 153.
  - **Aviso destacado** sobre el menú, con fechas y cierre (`content/banner.json`, `AnnouncementBar.tsx`); queda **apagado**. Probado: empuja el menú, se cierra y no vuelve en la visita.
  - **Noticias y eventos con fecha futura** se publican solos ese día (necesita reconstrucción diaria: `.github/workflows/rebuild-diario.yml` + secreto `NETLIFY_BUILD_HOOK`).
  - **Resultados**: guía para medir con Google Analytics / Looker Studio.
  - **Estilo del panel** con la paleta del colegio, escudo en la pantalla de entrada (`logo_url`), vista previa en celular, textos en español.
  - **Copia semanal** de `content/` y fotos (`.github/workflows/backup-semanal.yml`).
- Nuevo `distDir` por variable `NEXT_DIST_DIR` en `next.config.mjs` para poder probar un build sin pisar `npm run dev`.
- Probado: 16 vistas previas sin errores, guardado real desde el panel, gesto de 5 clics, `tsc`, `lint` y `build`.
- **No se hizo**: historial con botón de restaurar dentro del panel (se explica cómo con GitHub), modo de revisión (queda comentado en `config.yml`), texto alternativo editable en las fotos (ya se genera desde los títulos).
- **Pendiente tuyo**: configuración de acceso (OAuth de GitHub en Netlify), poner el dominio real y publicar antes de imprimir, completar `panel-config.js` (WhatsApp de soporte, ID de Netlify) y grabar los videos de los tutoriales si se quieren.
- Estos cambios **todavía no están en un commit**.

- Pediste que, al hacer clic en la vista previa, el panel te lleve al campo correspondiente de la izquierda. Hecho: los **textos se enlazan solos** (por coincidir con el valor del campo) y las **fotos y textos compuestos** (dirección, WhatsApp, cifras, portada) llevan una marca `data-field` en `previews.js` (ayudante `F`). Si el campo está en un elemento de lista plegado, se despliega; luego se desplaza, se enfoca y se resalta en amarillo. Al pasar el cursor, la vista previa resalta con borde punteado el elemento pulsable. Probado en el navegador con 9 clics (textos, fotos, cifras, WhatsApp y elementos de lista). Nota: al cambiar de entrada solo por la dirección (sin pasar por la lista) Decap puede mostrar un instante la vista previa anterior; navegando con el menú no ocurre.

- Pediste que el inicio y los lugares donde se hacen los cambios fueran mucho más amigables, con buen UX/UI y todo fácil de entender, y que **los afiches con QR tuvieran muchas más cosas editables**. Se hizo la lista completa que te propuse:
  - **Inicio rediseñado** (`inicio.html`): saludo, **buscador "¿qué quieres cambiar?"** (escribes "WhatsApp" y te lleva al campo exacto, con su pestaña abierta), 6 acciones grandes, **"lo siguiente que haría"**, pendientes **por prioridad** (1 bloquea la campaña, 2 importante, 3 cuando puedas) con botón "Completar" al campo exacto (`lib/pending.ts`), **mapa de la web** y **últimos cambios** leídos de GitHub con el token de la sesión (`panel-config.js` → `repo`). Los datos y textos en lenguaje de la clienta están en `public/admin/secciones.js`.
  - **Secciones con tarjetas** (`seccion.html`): al abrir una sección del menú ya no salen tarjetas vacías; cada tarjeta explica qué se puede cambiar, con "Editar" y "Ver en la web". El menú de la izquierda se llama "Secciones de la web" y tiene íconos; se renombraron las secciones (`config.yml`) para que coincidan con los títulos.
  - **Formularios** (`panel-ux.js`, `admin-ux.css`): **pestañas** en los formularios largos, etiquetas grandes y sin mayúsculas, "(opcional)" pasó a "(si quieres)", ayudas con 💡, elementos de lista como **tarjetas** con su título junto a la flecha, **confirmación "¿Quitar…?"** antes de borrar, 💡 **Ver ejemplos** (insertan texto de muestra) y botones de añadir más visibles.
  - **Publicar sin miedo**: barra "Tienes cambios sin publicar" con **Revisar y publicar** (lista de campos cambiados y aviso si alguno aún dice `[PENDIENTE]`), **Descartar** con confirmación, pantalla **"¡Publicado!"** con barra de espera y botón "Ver mi web", pantalla de error amable, e indicador "Todo publicado / Cambios sin publicar" en la barra del formulario.
  - **Vista previa**: botones flotantes en forma de ícono (ir al inicio, ver esta página en la web real, solo vista previa, celular, ayuda); al enfocar un campo se resalta su elemento en la vista previa.
  - **Afiches y QR** (`qr-designer.js`, `campana.html`, reescritos): **8 formatos** (tarjeta 4:5, cuadrado, historia 9:16, **volante A5 y afiche A4 a 300 dpi**, banda A4, banner 16:9, QR solo), 5 colores de fondo, 5 acentos, **foto de fondo** con velo, alineación, escudo y nombre, título en 2 líneas con tamaño, frase, etiquetas, **lista de beneficios**, fecha límite, WhatsApp, dirección, textos extra, texto bajo el QR, tamaño y color de esquinas del QR, enlace y pie, cada parte con su casilla para mostrarla u ocultarla. **Mis diseños** (guardar, abrir, duplicar, borrar, exportar e importar) y **PDF para la imprenta** en tamaño exacto (A5 148 × 210 mm, A4 210 × 297 mm). Los textos largos no se salen: el afiche se reduce solo.
  - **Verificación**: 70 combinaciones de afiche (8 formatos × 5 colores, centrado, foto de fondo ruidosa, QR 70 % y 130 %, otros colores de esquinas, estilo clásico, todo activado, textos muy largos) se leen con ZXing en la imagen final y reducida/desenfocada (simulando una foto de celular). Flujo del panel probado en el navegador: buscador → campo, pestañas, barra, resumen, publicar real (con restauración del contenido), éxito, confirmación al borrar, clic en la vista previa → campo, 16 vistas previas, guardado de diseños, foto de fondo y PDF. También se revisó en ancho de tablet.
  - **Descubierto**: en el editor, Decap no muestra la barra oscura superior (solo su barra de herramientas); el código detecta ambas. `registerAdditionalLink` no existe en Decap 3.16, así que el menú y las páginas propias se inyectan.
  - **Límites**: no hay botones de subir/bajar elementos (solo arrastrar, de Decap) ni "deshacer" tras borrar (por eso la confirmación); el historial con restaurar sigue siendo por GitHub; la capa depende de los nombres de clase de Decap (repasar al actualizar `DECAP_VERSION`).
  - **Para diciembre**: antes de imprimir, poner el **dominio real** en "Datos del colegio", publicar, descargar de nuevo el afiche y probarlo con celulares reales y una prueba de imprenta. Los textos por defecto del afiche son neutros (propuesta educativa, Primaria y Secundaria, agenda tu visita); la fecha límite y el WhatsApp salen apagados u opcionales hasta que se confirmen.

## 2026-10-27

- Pediste una lista completísima de todo lo que se puede personalizar solo en el QR y luego "hazlo todo". Se implementó en `public/admin/qr-designer.js` (reescrito) y `campana.html`:
  - **Contenido**: abrir la web (con enlace corto medible), **WhatsApp con mensaje escrito**, llamada, correo, mapa, tarjeta de contacto (vCard), Wi-Fi y texto; nivel de corrección L/M/Q/H y margen blanco de 3 a 6 módulos.
  - **Puntos**: cuadrados, redondeados, círculos, líquido (unidos), rombos, estrellas; tamaño y redondeo; 7 colores oscuros; **degradado** (vertical, horizontal, diagonal, radial) con segundo color; fondo blanco/crema/lila/transparente; modo **una tinta** (negro).
  - **Esquinas**: marco cuadrado, redondeado, círculo, hoja o gota; centro cuadrado, redondeado, círculo, rombo u hoja; grosor y colores por separado.
  - **Centro**: escudo, iniciales NT, texto corto, imagen subida o nada; tamaño (2–16 %), recuadro cuadrado/redondeado/círculo/sin recuadro, borde (color y grosor) y versión de un solo color.
  - **Recuadro**: radio, sombra, marco doble o punteado, inclinación ±8°, **chispas** de energía y **etiqueta** ("ESCANÉAME", cinta o burbuja, arriba o abajo).
  - **7 plantillas**: Marca, Clásico, Líquido, Suave, Energía, Tesla y Una tinta. Nuevo formato **sticker redondo**.
  - **Calidad**: **semáforo** (contraste, escudo según corrección, margen, formas decorativas, densidad, tamaño mínimo de impresión), **prueba de lectura** simulando un celular (7 condiciones) y **prueba con la cámara**.
  - **Salidas**: PNG, PDF A5/A4 exacto, **SVG vectorial** con todas las formas, **ZIP de serie numerada** (códigos `promotor-012`…) y de todos los lugares, **animación WebM**.
  - **Enlace corto con caducidad**: `/qr/<lugar>` ahora es una ruta (`app/qr/`, `lib/qr-redirect.ts`): pasada la fecha de cierre, lleva a `/admision` para que los QR impresos nunca queden rotos.
- **Verificación**: 170 combinaciones (todas las formas de puntos y esquinas, colores, degradados, escudos y tamaños, niveles de corrección, márgenes, los 8 tipos de contenido, las 7 plantillas en 6 formatos y los efectos del recuadro) se leen con ZXing, en la imagen final y reducida/desenfocada. SVG de las 7 plantillas validados y leídos. ZIP validados con JSZip, animación grabada (WebM) y cámara probada con un video falso. La ruta `/qr` se probó antes y después de la fecha de cierre.
- **Lo que la prueba descubrió y se corrigió**: el centro de esquinas en forma de **estrella** no se lee (se quitó); el escudo de ~15 % o más rompe la lectura (límites medidos: H 13 %, Q 7 %, M 4 %, L ninguno); los avisos del semáforo eran alarmistas (contraste del rojo, enlaces normales "densos"); el lector de jsQR del panel era más estricto que los celulares, así que ahora también usa ZXing.
- **Problema real encontrado en el contenido**: "Dirección de la web" quedó escrita sin `https://` (`colegionikolatesla.netlify.app`) y **rompía el build**. Ahora `webUrl()` (`lib/content.ts`) la corrige o usa un valor de respaldo.
- **No se hizo**: EPS y CMYK (el navegador no los produce; para imprenta usar PDF/SVG o la versión de una tinta), contador de escaneos dentro del panel (se mide en Google Analytics por `utm_source`), contraseña/aviso previo al abrir el QR, color por zonas y puntos de dos tamaños, rayos como forma de los puntos (no se leen).
- Estos cambios **todavía no están en un commit**.

## 2026-10-26 · Panel: personalización completa (sin base de datos)

- Pediste "todo lo que sea sin Supabase ni base de datos". Todo vive en `content/*.json` y se edita desde el panel:
  - **Colores y efectos** (`content/apariencia.json`, `data/appearance.ts`): 5 paletas (Tesla, Océano, Bosque, Vino, Grafito) y 5 colores sueltos opcionales. Tailwind ahora lee variables CSS (`--c-noche`…) que `app/layout.tsx` escribe en `<head>`; los hex del código pasan por `palette`. Efectos apagables: animación y rayos de la portada, chispas, línea de progreso, cortina entre secciones, botón de WhatsApp.
  - **Orden de la portada** (`content/portada.json`, `data/home.ts`): ordenar y mostrar/ocultar índice, eventos, noticias, testimonios, logros, documentos, preguntas y admisión.
  - **Menú y pie** (`content/navegacion.json`, `data/navigation.ts`): ocultar secciones del menú, enlaces extra, botón destacado editable, enlaces y texto legal en el pie, nombre grande de fondo opcional.
  - **Avisos múltiples** (`content/banner.json`): color, fechas, páginas donde se muestra y rotación; se migró el aviso único a la lista `items`.
  - **Calendario** (`content/eventos/*.json`, `/calendario`): evento con tipo/fecha/hora/lugar, "Agregar a Google Calendar", descarga `.ics` (`/calendario/<slug>/ics`), "Próximos eventos" en la portada y datos estructurados `Event` para Google. Hay 2 eventos de ejemplo.
  - **Documentos** (`content/documentos.json`, `public/documentos/`, `/documentos`): categorías, tamaño leído del archivo, y los de "Admisión" salen también en esa página. Si falta el archivo no se muestra.
  - **Páginas nuevas** (`content/paginas/*.json`, `/p/<nombre>`): texto con `## ` y `- `, foto, botón, archivos, borrador/publicada, SEO. Hay un borrador de ejemplo ("Reglamento interno").
  - **WhatsApp por página** (`settings.contact.whatsappButton`): texto, lado y mensaje según la página (`{año}` se reemplaza).
  - **SEO por página**: `seoTitle` y `shareImage` en cada sección (`lib/seo.ts`).
  - **Salud del sitio** (`lib/health.ts` → Inicio): enlaces rotos del menú/pie/avisos/eventos, documentos sin archivo y fotos de más de 2 MB. Ya detectó 2 PNG pesados en `public/images/actividades/`.
- Panel: nuevas secciones en el menú (Calendario, Documentos, Páginas nuevas, Personalizar la web), vistas previas de cada una, buscador, mapa de la web, acciones de Inicio y 4 tutoriales en Ayuda. Guías (`docs/GUIA_PANEL.md`, `docs/CONFIGURAR_PANEL.md`) y README actualizados.
- **Verificación**: `tsc`, `next build` (31 páginas) y validación de `config.yml` contra los JSON. Prueba real con otro contenido (paleta Bosque + acento propio, 3 avisos —uno vencido—, galería oculta, orden de portada cambiado, WhatsApp a la izquierda con mensaje por página, documento con archivo y otro sin archivo, página publicada con subtítulo y lista): todo se reflejó en el HTML y en el sitemap; después se restauró el contenido original.
- **No se hizo (necesita base de datos o servicio externo)**: bandeja de solicitudes de visita, estadísticas dentro del panel. **Límite**: el tema de la barra y de la cortina para `/p/*` es fijo (oscuro); las vistas previas del panel siempre usan la paleta Tesla.
- Estos cambios **todavía no están en un commit**.

## 2026-10-26 · Panel: orientación y facilidad de uso

- Pediste que el panel fuera menos caótico (listas desplegables tapadas por los bloques, difícil ubicarse) y más intuitivo. **Causa de las listas tapadas**: cada elemento de lista tenía `overflow: hidden`, que recortaba el menú; ahora los menús se abren por encima de todo.
- Capa nueva `public/admin/panel-guide.js` + `guide.css` + `tutoriales.js` (cargadas en `app/admin/route.ts`):
  - **Migas y Volver** (🏠 › Sección › Formulario) que avisan si hay cambios sin publicar, **índice "Ir a:"** en formularios sin pestañas y pestañas pegadas bajo la barra; pestañas nuevas en Menú/pie y Colores/efectos.
  - **Listas tipo acordeón**: título y número visibles en cada elemento, un solo elemento abierto a la vez, plegadas al abrir la lista, tocar la barra abre o cierra, **tarjeta de lista vacía** con botón grande. Se quitó la barra gris vacía de los grupos.
  - **Contadores** de caracteres, ejemplo como texto de muestra dentro del campo, **⚙️ Avanzado** (oculta lo que casi nunca se toca: Google, colores sueltos…), etiquetas más claras ("Dibujo que acompaña el texto" con emojis) y sin "(opcional)" repetido.
  - **❓ Ayuda lateral** con el tutorial de la pantalla (sin salir del formulario, con video si está en `panel-config.js`), **🧭 Guía** con globos (sale sola la primera vez por formulario), **modo práctica** (nada se publica) y **Ctrl + S**, letra grande.
  - **Barra inferior siempre visible**: "Todo publicado · Ver mi web" o "Tienes cambios sin publicar".
  - Inicio: acciones nuevas y tarjeta **"Tu primer día en el panel"** que se marca sola. Dos tutoriales nuevos ("Moverte por un formulario", "Practicar sin miedo") y los demás ahora viven en `tutoriales.js`. Guiones para grabar videos en `docs/VIDEOS_TUTORIALES.md`.
- **Se probó en un navegador real** (Edge controlado por script contra `npm run panel`): menú desplegable sobre los bloques vecinos, acordeón (abrir uno cierra los demás, plegado automático), galería con 9 eventos anidados, lista vacía, ayuda lateral, guía de 6 pasos, modo práctica (bloquea "Publicar ahora"), Ctrl + S, Volver con cambios, descartar sin diálogo del navegador, formulario nuevo, ancho de 1000 y 1280 px. Sin errores de consola.
- **Lo que la prueba descubrió**: Decap abre los elementos con retraso y pierde clics si se piden varios a la vez (se pliega de uno en uno esperando a que las alturas se estabilicen); y recargar con cambios hacía aparecer el "¿Salir del sitio?" del navegador (ya no).
- **No se hizo**: "deshacer" el borrado de un elemento de una lista (Decap no lo permite; se mantiene la confirmación y salir sin publicar) y grabar los videos (están los guiones). La capa depende de los nombres de clase de Decap: repasar al cambiar `DECAP_VERSION`.
- Estos cambios **todavía no están en un commit**.

## 2026-10-26 · Diseñador de QR: chispas reparadas y efectos nuevos

- **Chispas**: antes se apagaban al inclinar el recuadro y eran finas; ahora se dibujan dentro de la inclinación (siempre funcionan), con 4 tipos (rayos, destellos ✦, estelas de puntos, mezcla), cantidad (4–20), tamaño y color propios. No aparecen en "QR solo" ni en el sticker (no tienen recuadro/espacio).
- **Nuevo en Recuadro y efectos**: resplandor neón (suave/fuerte, con color) y color y grosor del borde del recuadro.
- Todo en `public/admin/qr-designer.js`. Revisado solo con `node --check`; **no se probó en navegador**. Sin commit.
- **Más efectos del QR** (mismo archivo): formas de punto hexágono, cruz, corazón y rayo; 5 colores nuevos y degradado de tres colores (también en SVG); marca de agua con el escudo difuminado (PNG/PDF, no SVG); insignia en una esquina del recuadro (círculo, sol, rombo; su tamaño se limita al margen para no tapar las esquinas del código); dibujo de fondo del recuadro (ondas, rejilla, puntos, rayos); la animación WebM ahora usa el recuadro completo con chispas que parpadean y resplandor; plantillas **Neón** y **Fiesta**. El semáforo avisa de las formas decorativas, marca de agua y dibujo de fondo. Aplicar una plantilla reinicia estos efectos. Solo `node --check`, **sin probar en navegador**, sin commit.

## 2026-10-26 · Animación al escanear el QR

- Al escanear un QR (`/qr/<lugar>`) ahora se ve unos segundos una animación del colegio y luego se entra a la web (con los mismos `utm_*` de siempre; el botón “Saltar ›” y el tiempo máximo evitan que alguien se quede atascado; sin JavaScript hay `meta refresh`). Archivos: `lib/qr-splash.ts` (página HTML con canvas, sin React), `lib/qr-redirect.ts`, ajuste `qrIntro` en `content/settings.json` / `data/settings.ts` / `types`.
- Cinco animaciones: ⚛️ átomo (el escudo es el núcleo), ⚡ rayos, 🔮 bobina Tesla, 〰️ línea de energía y ✨ chispas, o ninguna. Se elige en el panel: **Datos del colegio → Animación al escanear el QR** (animación, frase y duración 1,5–6 s). Vale para todos los QR ya impresos, sin reimprimir. Con `?anim=nombre` se prueba otra sin cambiar el ajuste (el diseñador de QR tiene el botón “Ver la animación”); `?freeze=<ms>` congela un instante (solo para pruebas).
- Probado: tipos, JS de la página y capturas reales en Edge de las 5 animaciones (a un instante fijo; la fluidez en celulares reales no se midió). Respeta “reducir movimiento” (dura 0,9 s). Sin commit.
- Corrección: el campo de la animación no se veía porque el formulario “Datos del colegio” usa pestañas y no estaba en ninguna; ahora hay la pestaña **⚡ Animación del QR**, una entrada en el buscador y el botón “⚙️ Elegir la animación activa” en el diseñador.

## 2026-10-26 · Mejoras de web, QR y panel

- **Auditoría Lighthouse (móvil, producción)**: rendimiento 87–95, accesibilidad 95–97, buenas prácticas y SEO 100. Arreglado: nombre accesible del logo (ahora incluye el texto visible) y orden de encabezados en Contacto. **No se tocó**: el contraste de la palabra gigante del pie (decorativa, `aria-hidden`, intencional) y el LCP de la portada (la fuente y el CSS ya están optimizados; la medida alta es del entorno lento de prueba).
- **A dónde llevan los QR impresos** (nuevo, en Datos del colegio → Animación del QR): campaña (por defecto), WhatsApp con mensaje, Contacto o Inicio. Pasada la fecha de cierre siempre va a Admisión.
- **Escáner Tesla** (`/escanear`, `lib/qr-scanner.ts`): página con la cámara que detecta un QR (jsQR) y dibuja el efecto elegido sobre el propio código; al terminar abre la dirección si es de esta misma web, y si es de otra la muestra con un botón (no abre sola). Probado en Edge con una cámara falsa que mostraba un QR: detectó, dibujó el átomo sobre el código y entró a /admision-2027. **No probado en celulares reales** (iPhone/Android), donde la cámara exige HTTPS.
- **Prueba automática del diseñador de QR**: `npm run test:qr` (9 plantillas, 10 formas de punto, degradado de 3 colores).
- **Corrección**: la pestaña “Animación del QR” de Datos del colegio no se había guardado en una edición anterior (los archivos tienen saltos de línea de Windows y una sustitución de varias líneas no aplicó); ahora sí.
- **No se hizo**: estadísticas de escaneos por lugar (el sitio no tiene base de datos; hace falta Google Analytics o un servicio), deshacer el borrado de elementos de listas (Decap no lo permite), rellenar los datos “Por confirmar” (son datos reales del colegio que no puedo inventar), WebAR con marcador sobre el afiche impreso.

## 2026-10-26 · Tanda de mejoras: web, escáner y panel

**Web**
- **Línea de tiempo de Admisión** (`components/sections/AdmissionTimeline.tsx`, en la página de campaña): línea de energía que baja con el scroll, enciende cada paso y llega a “Cierre de inscripciones” con los días que faltan.
- **Fondo y cursor eléctricos** (`components/ui/ElectricField.tsx`): partículas unidas por líneas que siguen el mouse o el dedo. Se elige en **Colores y efectos → Fondo y cursor eléctricos** (apagado / suave / normal / intenso; por defecto suave). Se apaga con “reducir movimiento” y con la pestaña oculta.
- **Recorrido 360°** (`/recorrido`, `data/tour.ts`, `components/gallery/PanoramaViewer.tsx`): Pannellum 2.5.6 (MIT) servido desde `public/vendor/pannellum`. Se carga desde **Galería → Recorrido virtual 360°** (foto equirectangular por lugar). Sin lugares cargados la página no existe (404) y no sale en el mapa del sitio ni en la galería.
- **Galería tipo stories** (`components/gallery/GalleryStories.tsx`): círculos por evento (solo con fotos reales), barras de progreso, toque izquierda/derecha, mantener para pausar, deslizar hacia abajo o Esc para cerrar.
- **Cómo llegar** (`components/ui/Directions.tsx`, bajo el mapa de Contacto): Google Maps, Waze y Uber con la “Búsqueda para el mapa” de Datos del colegio.
- **Compartir página** (`components/ui/ShareCard.tsx`, en el pie): tarjeta 4:5 con escudo, título, QR de esa página y su dirección; comparte con el menú del celular o descarga el PNG.
- **Formularios al correo** (`lib/send-form.ts`, Web3Forms): además de abrir WhatsApp, cada formulario manda un correo si se pone la clave en Datos del colegio → Formularios al correo. **Agendar visita** (`components/ui/BookingEmbed.tsx`): calendario de Calendly o Cal.com incrustado si se pone su enlace (solo se aceptan esos dos dominios).

**QR y escáner**
- 4 efectos nuevos para la animación de entrada y el Escáner Tesla: 🌌 constelaciones, 🔌 circuito, 🎆 fuegos artificiales y 🇵🇪 bandera (ya son 9 en total).
- **Entradas con nombre**: en el diseñador (“🎟 Entradas con nombre para eventos”) se generan QR por familia (`TESLA-TICKET|evento|nombre|n`). El Escáner Tesla los reconoce sin animación, marca “✓ Entrada válida” o “⚠ ya ingresó a las hh:mm”, vibra, cuenta cuántos entraron y exporta CSV. **Los ingresos viven solo en el celular que escanea** (localStorage): un celular por puerta; borrar los datos del navegador los pierde.
- **Hoja para la imprenta**: PDF A4 a 300 dpi con 20 códigos de la serie por hoja (varias hojas en ZIP si hay más).
- **Corrección importante**: los QR ahora se generan en **UTF-8**; antes un texto con tilde o eñe (p. ej. “Pérez”) se leía mal en el celular.

**Panel**
- **Plantillas de textos** (`public/admin/plantillas.html`, menú “Plantillas”): 6 modelos con huecos (reunión, admisión, logro, aviso, recordatorio, evento); copiar o abrir en WhatsApp.
- **Atajos**: Ctrl + K o `/` abren el buscador del Inicio desde cualquier pantalla.
- **Copia de seguridad**: acción en Inicio que descarga el ZIP del repositorio (contenido y fotos) desde GitHub; hay que haber iniciado sesión en GitHub.
- **Ya existían** (no se rehicieron): el tablero de Inicio con porcentaje y pendientes por prioridad, el buscador “¿Qué quieres cambiar?”, y la publicación programada (noticias y eventos con fecha futura se ocultan hasta ese día; **al ser una web estática, solo aparecen cuando se vuelve a construir el sitio**: ya existe `.github/workflows/rebuild-diario.yml`, que necesita el secreto `NETLIFY_BUILD_HOOK`; si no está configurado, esas publicaciones no aparecen solas).

**No se hizo**: WebAR sobre el afiche impreso (exige celular real para ajustar), importar noticias/docentes desde Excel o CSV (Decap no tiene API para crear entradas desde una página propia), vista previa móvil en vivo dentro del editor (depende de clases internas de Decap que no se pudieron comprobar aquí).
**Probado**: `tsc`, `npm run build`, `npm run test:qr`, capturas en Edge de las animaciones nuevas, línea de tiempo, tarjeta de compartir y fondo eléctrico; escáner con cámara falsa (URL y entrada válida/repetida); descarga real de la hoja PDF y del ZIP de entradas. **No probado en celulares reales.** Sin commit.

## 2026-10-27 · Panel: vista previa fiel, errores y guardado, y versión para celular

Se probó **en el panel real** (Decap con `npm run panel`, Edge controlado por script a 390×800 y 1300–1400 px), no solo leyendo código.

- **Celular** (`public/admin/mobile.css`, `mobile.js`): Decap obliga a 800 px de ancho y pone formulario y vista previa lado a lado, así que en un celular la página se ensanchaba y no se veía el formulario. Ahora: una sola columna sin desborde, barra superior que se desliza, campos de 16 px (sin zoom en iPhone) y botones de 44–48 px, barra del editor pegada arriba con las pestañas "Ir a" debajo, botón flotante **👁 Ver cómo queda / ✏️ Volver a editar** para la vista previa a pantalla completa, y barra inferior con 4 accesos (Inicio, Noticia, Campaña, Contenido) que se esconde al editar para dejar la de “Publicar”. La ayuda flotante y los avisos no se tapan entre sí.
- **Vista previa fiel** (`preview-device.js`, `previews.js`): selector **📱 Celular / 💻 Pantalla** sobre la vista previa (recordado; por defecto celular). El celular se muestra con marco y 390 px de ancho real, así que la web responde con su diseño móvil de verdad. La previa de la portada ahora incluye menú con escudo, botón Admisiones, título grande y botones, como en la web. **Sigue siendo una réplica**: Decap no puede mostrar la web real con el borrador, y las animaciones, ilustraciones y la mayoría de las secciones solo se ven al publicar.
- **Errores y guardado** (`panel-errors.js`, `local_backup`): al publicar con campos obligatorios vacíos aparece **“Faltan N cosas para publicar”** con un botón por campo que lleva a él; avisos rojos de Decap reescritos en lenguaje claro (sin conexión, sesión vencida, conflicto, demasiadas publicaciones); aviso fijo **sin internet** y otro al volver; **copia automática del borrador** en el aparato (`local_backup: true`): se comprobó que un título escrito sobrevive a recargar el navegador.
- **Fallo corregido**: cuando faltaban campos, el panel decía “Revisa tu conexión a internet” (engañoso). Y “Publicar ahora” ya no se rinde a los 350 ms si el menú de Decap tarda en abrir (espera hasta 3 s y, si no abre, explica qué hacer).
- **No se hizo / límites**: no se probó en un celular real (solo emulación de Edge: tamaño, toque y viewport; no el teclado ni la cámara del aparato); las pruebas con `local_backup` cubren recargar, no cerrar el navegador por completo; el panel sigue cargando Decap desde unpkg (sin internet no abre). Sin commit.

## 2026-10-27 · Personalización y edición del panel (tanda grande)

**Aspecto de la web** (Personalizar la web → Colores y efectos)
- **Letras**: 4 pares (Tesla, Clásica, Moderna, Redondeada) y tamaño base (normal / +6 % / +12 %). `app/fonts.ts` (Next exige cada fuente como constante con valores literales; las no elegidas no se precargan). Probado: la clásica se aplica y se ve.
- **Forma**: esquinas de tarjetas (variable `--r-panel`) y de los botones de `ButtonLink` y del aviso de privacidad (clase `btn-shape`). **No cambia** otros botones sueltos (p. ej. “Admisiones” del menú).
- **Velocidad de las apariciones** al hacer scroll (rápida / normal / lenta / sin animación).
- **Logo y favicon propios** (Datos del colegio → Fotos y video principales).

**Estructura y contenido**
- **Redirecciones y enlaces cortos** (`content/redirects.json` → `next.config.mjs`): validadas (se descartan rutas del sistema, caracteres raros, duplicadas y destinos no https). Probado con casos buenos y malos.
- **Noticias con formato** (negrita, cursiva, listas, enlaces, títulos, citas) con `lib/markdown.tsx` (sin HTML; enlaces seguros), más **autor**, **fecha de actualización** y **ocultar desde el día**. Las noticias anteriores en texto plano siguen igual.
- **Notas y tareas del equipo** (`content/tareas.json`): aparecen en el Inicio del panel con prioridad según la fecha (probado).

**Familias**
- **Aviso de privacidad y cookies** (texto editable): con él activo, Google Analytics solo carga si la persona acepta.
- **Formularios**: mensaje de gracias editable y pregunta opcional “¿Cómo nos conociste?” con opciones editables (llega en el mensaje y el correo).
- **Botón de WhatsApp con horario de atención** (hora de Lima): fuera de horario cambia su texto y avisa en el mensaje.

**Panel**
- **Inicio**: ocultar y fijar tarjetas (se recuerda en el aparato) y **globo rojo** en “Inicio” con los pendientes urgentes.
- **Menú “Aa”**: letra grande y más contraste. **El modo oscuro se probó y se descartó** (Decap tiene demasiados colores fijos y quedaba roto).
- **Comprobador de calidad** al publicar: espacios dobles, MAYÚSCULAS, títulos en minúscula y tildes olvidadas en ~17 palabras comunes.
- **Recordatorio mensual de copia** (`.github/workflows/copia-mensual.yml`): ZIP en GitHub Actions + un Issue que avisa por correo. **Ya existía** `backup-semanal.yml` (copia semanal); este flujo solo añade el aviso. No se pudo probar (solo corre dentro de GitHub).
- **Revisión del panel antes de publicar** (`scripts/check-panel.mjs`, `npm run check:panel`, ya en `prebuild`): durante esta tanda un error de sangría en `config.yml` dejó el panel en blanco (“Error loading the CMS configuration”); ahora el build falla antes de llegar a producción.

**Ya existía o quedó parcial**: historial de cambios (Inicio ya muestra “Tus últimos cambios”), resultados de campaña (Looker/Analytics), biblioteca de fotos (pestaña Medios de Decap), compresión de fotos al subir.
**No se hizo**: constructor de páginas por bloques, mostrar/ocultar cada sección de todas las páginas, duplicar página o noticia, páginas de mantenimiento, borradores con aprobación (el modo editorial de Decap no funciona con el servidor local, solo `simple`, y no se pudo probar), importar CSV/Excel, restaurar versiones desde el panel, pruebas A/B, cuentas por promotor con metas, generador de piezas para redes, tutoriales en video, avisos de publicación por correo (se configuran en Netlify), asistente de IA (servicio de pago). Sin commit.

## 2026-10-27 · Documentación y cierre de la tanda

- Se documentó todo lo hecho en la sesión: **`README.md`** (estructura, comandos, QR y escáner, personalización, tabla “dónde se edita cada cosa”), **`docs/GUIA_PANEL.md`** (secciones 17–22 nuevas para la clienta: letras y esquinas, QR y Escáner Tesla, formularios y calendario, noticias con formato y 360°, panel en celular, errores al publicar; “Qué NO se puede” y “Si algo sale mal” actualizadas), **`docs/CONFIGURAR_PANEL.md`** (qué activar y cómo se comporta cada función, archivos nuevos, límites) y **`PENDIENTES_COLEGIO.md`** (lo que el colegio debe aportar para activar las funciones nuevas).
- Se creó **`CLAUDE.md`** con la guía para trabajar en el proyecto: comandos, mapa, trampas conocidas (CRLF, sangría de `config.yml`, `next/font`, plantillas con JS, UTF-8 en QR, `MutationObserver` en Decap), cómo probar el panel real y la preferencia de no añadir coautor en los commits.
- Verificación final: `tsc`, `npm run check:panel`, `npm run test:qr` y `npm run build` sin errores.
- **Pendiente técnico (para la próxima sesión):** probar todo en celulares reales (web, panel, `/escanear`, QR impresos); probar `editorial_workflow` contra GitHub real; servir Decap desde la propia web (hoy depende de unpkg); configurar `NETLIFY_BUILD_HOOK` para las publicaciones programadas; las opciones no hechas de la lista de personalización (constructor de bloques, ocultar secciones por página, duplicar, importar CSV, restaurar versiones, pruebas A/B, generador de piezas, avisos por correo al publicar).
