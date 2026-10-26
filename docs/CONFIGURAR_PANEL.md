# Configurar el panel de edición (una sola vez)

El panel es **Decap CMS** (`/admin`). El código ya está listo; falta conectar el inicio de sesión con GitHub y
dar acceso a la clienta. Son unos 15 minutos.

**Cómo funciona:** la clienta inicia sesión con su cuenta de GitHub, edita en formularios y, al publicar, Decap hace un
commit en `main` del repositorio `LuisTRDev/web-tesla`. Netlify detecta el commit y vuelve a construir la web.

## Antes de empezar

- Sitio ya publicado en **Netlify** y conectado al repositorio (rama `main`).
- Comando de build de Netlify: `npm run build` (el valor por defecto). Es importante: ese comando ejecuta `prebuild`, que
  genera `public/admin/preview.css` y avisa de imágenes pesadas.
- La dirección final del sitio. Decap usa la dirección desde la que se abre el panel; no hay que escribirla en `config.yml`.

## 1. Crear la cuenta de GitHub de la clienta e invitarla

1. La clienta crea una cuenta gratuita en https://github.com/signup (o la creas tú con su correo).
2. En GitHub, abre el repositorio → **Settings → Collaborators → Add people**, busca su usuario y dale permiso de **escritura (Write)**.
3. Ella acepta la invitación (le llega por correo y también en https://github.com/notifications).

Recomendación: pídele que active la **verificación en dos pasos** (GitHub → Settings → Password and authentication). Es la mejor protección del panel.

> Quien tenga permiso de escritura puede editar todo el repositorio desde GitHub. Dale solo ese permiso y retíralo (Settings → Collaborators) cuando deje de trabajar con el colegio.

## 2. Crear una “OAuth App” en GitHub (la crea el dueño del repositorio)

1. GitHub → tu foto → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Completa:
   - **Application name:** `Panel Nikola Tesla`
   - **Homepage URL:** la dirección de la web (por ejemplo `https://www.tudominio.com`)
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
3. Pulsa **Register application**.
4. Copia el **Client ID** y pulsa **Generate a new client secret** para copiar el **Client secret** (solo se muestra una vez).

## 3. Registrar el proveedor en Netlify

1. Netlify → tu sitio → **Site configuration → Access & security → OAuth** (según la versión del panel, “Access control → OAuth”).
2. **Authentication providers → Install provider → GitHub**.
3. Pega el **Client ID** y el **Client secret** y guarda.

No hace falta cambiar `public/admin/config.yml`: con `backend: github` Decap usa por defecto el servicio de OAuth de Netlify
(`https://api.netlify.com`). La dirección del sitio debe estar en Netlify (dominio propio o `*.netlify.app`).

> Netlify ha ido retirando algunos servicios (Identity y Git Gateway). El OAuth con GitHub sigue la guía oficial de Decap, pero
> si Netlify cambiara ese menú y no lo encuentras, la alternativa es un proveedor OAuth propio: ver
> https://decapcms.org/docs/external-oauth-clients/ y poner `base_url` y `auth_endpoint` bajo `backend:` en `config.yml`.

## 4. Probar

1. Abre `https://tu-sitio/admin` (o 5 clics sobre el logo del pie de página).
2. **Iniciar sesión con GitHub** → autorizar.
3. Cambia algo pequeño (por ejemplo, la frase del pie de página) y **Publicar → Publicar ahora**.
4. En GitHub verás un commit nuevo (“Panel: actualizar …”) y en Netlify un deploy. En 1 o 2 minutos el cambio está en la web.
5. Deshaz la prueba editando de nuevo.

Si al iniciar sesión se cierra la ventana sin entrar: revisa que el *callback URL* sea exactamente `https://api.netlify.com/auth/done` y
que el navegador no bloquee ventanas emergentes.

## Herramientas del panel (Inicio, Campaña y QR, Resultados, Ayuda)

El panel incluye cuatro páginas propias en la barra superior. Los datos opcionales se completan en **`public/admin/panel-config.js`**
(si un valor está vacío, esa función simplemente no aparece):

| Valor | Para qué |
|---|---|
| `netlifySiteId` | ID del sitio en Netlify (Site configuration → General). Activa en **Inicio** el indicador “publicando / listo”. Requiere activar el *deploy status badge* en Netlify. |
| `supportWhatsapp` | Tu WhatsApp (con 51…). Activa el botón “Pedir ayuda por WhatsApp” en **Ayuda**. |
| `lookerUrl` | Informe de Looker Studio para incrustar en **Resultados** (la clienta también puede pegarlo ella). |
| `videos` | Videos de los tutoriales de **Ayuda**: `{ publicar: "https://www.youtube.com/embed/ID" }`. Los ids: inicio, texto, foto, publicar, noticias, galeria, listas, admision, aviso, qr, version. |

- **Inicio** calcula los pendientes al construir la web (`lib/pending.ts` → `/admin/api/pendientes`). Cada punto lleva su **prioridad** (1 = bloquea la campaña, 2 = importante, 3 = cuando puedas) y el **campo exacto** donde se corrige; para añadir una comprobación, agrega un elemento en ese archivo. Los últimos cambios se leen de GitHub con el token de la sesión (`panel-config.js` → `repo`).
- **Textos y atajos del panel** (`secciones.js`): nombres, descripciones y tarjetas de cada sección, mapa de la web, buscador de “¿qué quieres cambiar?”, pestañas de los formularios largos (`tabs`) y ejemplos de texto (`examples`). Las rutas de campo usan las etiquetas de `config.yml` (se ignora “(opcional)” / “(si quieres)”).
- **Capa amigable sobre Decap** (`panel-ux.js`, `panel-ui.js`, `admin-ux.css`): pestañas, confirmación al quitar elementos, barra “cambios sin publicar”, ventana “Revisar y publicar”, pantalla de éxito, indicador de estado, botones flotantes (inicio, ver en la web, solo vista previa, celular, ayuda) y portadas de sección (`seccion.html`). Todo se apoya en los nombres de clase de Decap (`ControlContainer`, `SortableListItem`, `BackStatusChanged`…); al actualizar Decap (`DECAP_VERSION` en `app/admin/route.ts`), repasar el panel.
- **Recorrido de bienvenida** (`tour.js`): se muestra una vez por navegador; se repite desde Ayuda. Para forzarlo a todos, sube `KEY` a `tesla-recorrido-v2`.
- **Optimizador de fotos** (`photo-optimizer.js`): al subir una imagen (JPG/PNG/WebP) la reduce a 2000 px y la guarda como WebP calidad 82. No toca GIF ni SVG. Los valores están al inicio del archivo.
- **Campo “Descripción para Google”** (widget `seo-descripcion` en `panel-ui.js`): contador de caracteres y vista previa de Google.
- **Clic en la vista previa → campo** (`panel-ui.js`, función `onPreviewClick`): al hacer clic en la vista previa, el formulario se desplaza al campo, lo despliega si está dentro de una lista plegada y lo resalta. Orden de búsqueda: 1) un campo cuyo valor sea exactamente el texto pulsado; 2) la marca `data-field` del elemento o de un ancestro (fotos y textos compuestos), con la ruta `[etiqueta, nº de elemento, etiqueta…]` — se escribe en `previews.js` con el ayudante `F([...], props)`; 3) el campo cuyo valor, el más largo, esté contenido en el texto. Las etiquetas de la ruta deben coincidir con las de `config.yml` (se ignora el sufijo “(opcional)”). Al añadir una vista previa nueva, los textos se enlazan solos; solo las fotos necesitan la marca.
- **Ayuda contextual**: el botón “? Ayuda” abre el tutorial de la sección actual (los ids de sección están en `ayuda.html`).

## Orientación en los formularios (panel-guide.js)

Capa sobre Decap que se apoya en sus nombres de clase (`ControlContainer`, `SortableListItem`, `StyledListItemTopBar`, `TopBarContainer`…); al actualizar `DECAP_VERSION`, repasa el panel. Si algo cambia, solo se pierde esta capa: los formularios siguen funcionando.

- **Datos que la configuran (`secciones.js`):** `tabs` (pestañas de un formulario), `advanced` (etiquetas de campos que se ocultan hasta pulsar “Avanzado”), `limits` (largo recomendado → contador), `helpFor` (qué tutorial abre la ayuda en un formulario) y `examples` (el primero se muestra como texto de muestra dentro del campo, salvo que la ayuda ya diga “Ejemplo”). Las etiquetas se comparan sin “(opcional)” ni “(si quieres)”.
- **Formularios sin pestañas** con 4 o más campos reciben el índice “Ir a:” (se genera solo).
- **Listas:** el título de cada elemento es el valor de su primer campo de texto; al abrir una lista con 3 o más elementos solo el primero queda abierto y siempre hay uno solo abierto. Decap abre los elementos con retraso y pierde clics si se piden varios a la vez: por eso se espera a que las alturas se estabilicen (`whenSettled`) y se pliega de uno en uno (`closeMany`).
- **Ayuda lateral y tutoriales:** `tutoriales.js` define `window.TESLA_TUTORIALS` (id, topics, title, time, steps en HTML, tip). Un tutorial nuevo aparece solo en Ayuda y en el selector del panel lateral; para que se sugiera en un formulario, agrega la colección en `topics` o la entrada en `helpFor`. Videos: `panel-config.js` → `videos { id: "https://www.youtube.com/embed/…" }` (guiones en `docs/VIDEOS_TUTORIALES.md`).
- **Guía por pantalla (globos):** se muestra una vez por formulario (`localStorage tesla-coach-seen`) y se repite con “🧭 Guía”. Los pasos se arman con lo que haya en pantalla (primer campo, vista previa, pestañas o índice, listas, herramientas, barra de publicar).
- **Modo práctica:** `sessionStorage tesla-practice`. Intercepta “Publicar ahora” de Decap y “Revisar y publicar”; salir recarga la página y descarta lo escrito.
- **Preferencias del navegador:** `tesla-big` (letra grande), `tesla-adv` (mostrar avanzadas), `tesla-practiced` y `tesla-first-hidden` (Inicio → Tu primer día).
- **Barra inferior:** siempre visible en un formulario (`panel-ux.js`): “Todo publicado” con “Ver mi web”, o “Tienes cambios sin publicar” con Descartar y Revisar y publicar.
- **No incluido:** deshacer el borrado de un elemento de una lista (Decap no lo permite). Se mantiene la confirmación antes de quitar y la opción de salir sin publicar.

## El diseñador de afiches y QR

- Está en **Campaña y QR** y lo dibuja `public/admin/qr-designer.js` con la librería MIT *qrcode-generator* (`public/admin/vendor/qrcode.js`), corrección de errores nivel **H** (tolera el escudo al centro).
- **Editable:** 8 formatos (`FORMATS`: tarjeta 4:5, cuadrado, historia 9:16, volante A5 y afiche A4 a 300 dpi, banda A4, banner 16:9 y QR solo), 5 temas de color (`THEMES`) y 5 acentos (`ACCENTS`), foto de fondo con velo, alineación, escudo/nombre, título en 2 líneas con tamaño, frase, etiquetas, beneficios, fecha límite, WhatsApp, dirección, textos extra, texto bajo el QR, tamaño y color de esquinas del QR, enlace y pie. Los controles se generan desde la lista `GROUPS`: para añadir uno, se agrega un campo allí, su valor en el estado `st` y su dibujo en la función del elemento correspondiente.
- **QR (personalización completa):** el estado `st` y la lista `GROUPS` de `qr-designer.js` definen cada opción. La forma de los puntos, las esquinas y el escudo se dibujan en `geometry()` y `drawQR()` (con rutas SVG, así que el SVG exportado es idéntico al PNG); los colores salen de `PALETTE`; las plantillas, de `PRESETS`; el contenido, de `payload()` (url, WhatsApp, tel, correo, mapa, vCard, Wi-Fi, texto).
- **Semáforo y pruebas** (`analyze()`, `readTest()`): comprueban contraste, tamaño del escudo según el nivel de corrección (`EC_AREA`, medido con pruebas de lectura: sobre ~13 % deja de leerse), margen, formas decorativas, densidad y tamaño mínimo de impresión. La prueba de lectura usa **ZXing** (`vendor/zxing.min.js`, Apache-2.0, el más tolerante) y **jsQR** (`vendor/jsQR.js`, Apache-2.0); basta con que lea uno, como en un celular. Mirar el panel de la cámara requiere permiso del navegador (solo en HTTPS o localhost).
- **Series y ZIP:** `zipStore()` crea ZIP sin compresión y sin librerías; cada código usa `/qr/<serie>-NNN` (la ruta acepta cualquier nombre). La animación WebM usa `MediaRecorder` (Chrome y Edge).
- **Diseños guardados:** `localStorage` (`tesla-qr-disenos`), con exportar/importar a archivo JSON. **PDF** para la imprenta: una página con el tamaño exacto (A5 148 × 210 mm, A4 210 × 297 mm), generada sin librerías (`pdfFromJpegDataUrl`).
- **Composición:** los elementos se apilan (`drawStack`) o van en columna junto al QR (`drawSide`) y el conjunto se reduce solo si no cabe, así que los textos largos no se salen. El QR siempre va sobre blanco con zona de silencio.
- Identidad: puntos redondeados en azul noche, ojos en azul marino con centro rojo (colores del escudo), recuadro del escudo con borde amarillo filamento y tarjetas con el fondo, la tipografía y la línea de energía de la web.
- **Verificado:** 70 combinaciones (8 formatos × 5 colores, centrado, foto de fondo ruidosa, QR al 70 % y 130 %, esquinas de otro color, estilo clásico, todo activado y textos muy largos) se leen con ZXing, tanto en la imagen final como reducida y desenfocada para imitar una foto de celular. Aun así, **hay que probarlo con celulares reales y pedir una prueba impresa**.
- La forma del estilo “marca” está ajustada con esas pruebas (`TUNE` al inicio de `qr-designer.js`). Si se cambia (puntos más pequeños o ojos más redondos), repetir la prueba de lectura: los puntos demasiado separados hacen fallar algunos lectores.
- El estilo “Clásico” (cuadrado, un solo color) queda como alternativa por si una imprenta o un fondo complican el de marca.

## Personalización avanzada (colores, portada, menú, calendario, documentos, páginas nuevas)

Todo es contenido en `content/` (sin base de datos) y se edita desde el panel.

| Qué | Archivo de contenido | Lee | Notas |
|---|---|---|---|
| Colores y efectos | `content/apariencia.json` | `data/appearance.ts` | Tailwind lee los colores de variables CSS (`--c-noche`, `--c-filamento`…) que `app/layout.tsx` escribe en `<head>` con `cssVariables()`. Cinco paletas (`presets`); los colores sueltos derivan sus tonos con HSL. El código que necesita hex (SVG, estilos en línea) usa `palette`. |
| Orden y visibilidad de la portada | `content/portada.json` | `data/home.ts` → `app/page.tsx` | Las secciones que falten en el JSON se añaden con su valor por defecto (`defaultShown`). |
| Menú, botón destacado y pie | `content/navegacion.json` | `data/navigation.ts`, `data/modules.ts` | `hiddenModules` oculta secciones del menú y de la portada (la página sigue existiendo); la numeración y el "siguiente" saltan las ocultas. |
| Avisos (varios) | `content/banner.json` | `data/banner.ts` → `AnnouncementBar` | Color, fechas y páginas donde se muestra; si coinciden varios, rotan cada 7 s. Se filtran por fecha otra vez en el navegador. |
| Calendario | `content/eventos/*.json` | `data/events.ts`, `app/calendario/` | Un archivo por evento. `/calendario/<slug>/ics` genera el .ics al construir. Los eventos con fecha pasada salen solos de "Próximos" cuando la web se reconstruye (el flujo diario). |
| Documentos | `content/documentos.json` + `public/documentos/` | `data/documents.ts`, `app/documentos/` | El tamaño se lee del archivo al construir; si el archivo no existe, el documento no se muestra e Inicio avisa. |
| Páginas nuevas | `content/paginas/*.json` | `data/pages-extra.ts`, `app/p/[slug]/` | `published: false` = borrador (no existe, ni en el sitemap). Texto: `## ` subtítulo, `- ` lista. |
| WhatsApp por página | `content/settings.json` → `contact.whatsappButton` | `data/settings.ts` → `WhatsAppFloat` | Gana la ruta más específica; `{año}` se reemplaza por el año de admisión. |
| Título e imagen para Google/redes | `content/modules.json` (`seoTitle`, `shareImage`) | `lib/seo.ts` (`moduleMetadata`) | Las páginas nuevas usan `seoDescription` y `shareImage`. |

- **Salud del sitio:** `lib/health.ts` revisa enlaces internos rotos (menú, pie, avisos, eventos, botones), documentos sin archivo y fotos de más de 2 MB; los muestra `lib/pending.ts` en **Inicio**.
- **Páginas fuera del menú** (`/calendario`, `/documentos`, `/p/*`): se crean con `pageModule()` (`data/modules.ts`) y el tema de la barra y de la cortina sale de `themeForPath()`. Para que aparezcan en el menú, la clienta las añade en **Menú y pie de página → Enlaces extra**.
- **Añadir una paleta:** agrega una entrada en `presets` (`data/appearance.ts`), su etiqueta en `presetLabels`, la opción en `config.yml` (`apariencia` → `Paleta`) y su muestra en `previews.js` (`PALETTES`). El texto sobre `filamento` es `noche`: el acento debe ser claro.
- **Añadir una sección a la portada:** añade su id en `HOME_SECTIONS` y `defaultShown` (`data/home.ts`), su componente en `app/page.tsx` y la opción en `config.yml` (`portada`).
- **No incluido a propósito:** bandeja de solicitudes y estadísticas dentro del panel (necesitan una base de datos o la API de Analytics). Las visitas se agendan por WhatsApp y se miden en Google Analytics.

## Medir la campaña (volantes, anuncios y WhatsApp)

1. **Enlaces cortos de los QR:** `/qr/volante`, `/qr/afiche`, `/qr/<lugar>` redirigen (`app/qr/`, `lib/qr-redirect.ts`) a `/admision-AAAA?utm_source=<lugar>&utm_medium=impreso&utm_campaign=admision-AAAA`. **Pasada la fecha de cierre** (`admissionDeadline`), llevan a `/admision` con los mismos parámetros, así los QR ya impresos nunca quedan rotos. La ruta se evalúa en cada visita (en Netlify corre como función).
2. **Google Analytics:** define `NEXT_PUBLIC_GA_ID` (`G-XXXXXXXXXX`) en Netlify y vuelve a publicar. La web envía `whatsapp_click`, `visit_request` y `contact_form_submit` con el origen. En Analytics marca los dos primeros como *eventos clave*.
3. **Informe:** en Looker Studio conecta la propiedad GA4 y crea un informe con visitas, origen y esos eventos; pega el enlace en `lookerUrl` (o en la página Resultados).

> Los QR se imprimen con la dirección que tenga la web **en ese momento**. Antes de imprimir: dominio real en `content/settings.json` → `siteUrl` (campo “Dirección de la web” del panel), web publicada, y probar `/qr/volante` desde un celular.

## Publicación programada, avisos y copias de seguridad

- **Noticias y eventos con fecha futura** no se muestran hasta ese día, y el **aviso destacado** puede tener fecha de inicio y fin. Para que aparezcan sin tocar nada, la web debe reconstruirse cada día:
  1. Netlify → Site configuration → Build & deploy → **Build hooks** → crea uno y copia la URL.
  2. GitHub → Settings → Secrets and variables → Actions → **New repository secret** llamado `NETLIFY_BUILD_HOOK` con esa URL.
  3. El flujo `.github/workflows/rebuild-diario.yml` la reconstruye cada madrugada (5:00 a. m. de Lima). Sin el secreto no hace nada.
- **Copia de seguridad semanal:** `.github/workflows/backup-semanal.yml` guarda `content/`, las fotos y `config.yml` en un ZIP (GitHub → Actions, 90 días). Es un respaldo extra: el historial de Git ya permite volver a cualquier versión.
- **Volver a una versión anterior:** GitHub → repositorio → `content/<archivo>.json` → *History* → abrir el commit bueno → *… → Revert*, o pedir a quien administre que haga `git revert` del commit “Panel: …”.
- **Avisos cuando ella publica:** Netlify → Site configuration → Build & deploy → *Deploy notifications* (correo o Slack al terminar cada deploy) y, en GitHub, *Watch → Custom → Commits* del repositorio.

## Usarlo en tu computadora (sin iniciar sesión)

```bash
npm install
npm run panel      # web en http://localhost:3000 y servidor local de Decap
```

Abre http://localhost:3000/admin y pulsa **Iniciar sesión**. Los cambios se guardan directo en `content/` y `public/images/` de tu
carpeta, sin commit (haz el commit tú). Es la forma de probar campos nuevos o corregir contenido sin depender de GitHub.

## Dónde está cada cosa

| Archivo | Para qué |
|---|---|
| `public/admin/config.yml` | Secciones y campos del panel, textos de ayuda, carpetas de fotos |
| `public/admin/previews.js` | Vistas previas de cada sección (Tailwind) |
| `public/admin/preview.css` | Estilos de las vistas previas. **Se genera solo** (`npm run build:admin-css`); no editar |
| `public/admin/es-fixes.js` | Traduce los pocos textos que Decap deja en inglés |
| `public/admin/panel-ui.js` | Menú superior propio, widget de descripción para Google, ayuda contextual y vista móvil |
| `public/admin/panel-guide.js`, `guide.css` | Orientación: migas y botón Volver, índice de saltos, listas tipo acordeón con título, tarjeta de lista vacía, contadores, opciones avanzadas, ayuda lateral, guía por pantalla, modo práctica, Ctrl + S y letra grande |
| `public/admin/tutoriales.js` | Tutoriales (los usan la página Ayuda y la ayuda lateral de cada formulario) |
| `public/admin/panel-config.js` | Ajustes opcionales de las herramientas (ver arriba) |
| `public/admin/inicio.html`, `campana.html`, `resultados.html`, `ayuda.html` | Páginas propias del panel |
| `public/admin/qr-designer.js`, `vendor/qrcode.js` | Generador del QR con la identidad del colegio |
| `public/admin/photo-optimizer.js`, `tour.js`, `admin-theme.css`, `tools.css` | Optimizador de fotos, recorrido de bienvenida y estilos |
| `app/admin/api/*` | Datos del colegio y pendientes que leen las páginas del panel |
| `data/banner.ts`, `components/layout/AnnouncementBar.tsx` | Aviso destacado |
| `app/admin/route.ts` | Página `/admin` que carga Decap (versión fija; `noindex`) |
| `components/ui/SecretAdminTrigger.tsx` | 5 clics en el logo del pie de página abren `/admin` |
| `content/*.json`, `content/noticias/*.json`, `content/eventos/*.json`, `content/paginas/*.json` | El contenido que edita el panel |
| `lib/health.ts` | Revisión de enlaces rotos, documentos sin archivo y fotos pesadas |
| `data/*.ts`, `lib/content.ts` | Leen y validan ese contenido (valores de respaldo) |

## Cómo añadir un campo nuevo

1. Añádelo en `content/<archivo>.json` y en la colección correspondiente de `public/admin/config.yml`.
2. Léelo en el `data/<archivo>.ts` (con `str`, `text`, `list`… de `lib/content.ts`) y añádelo al tipo en `types/index.ts` si hace falta.
3. Muéstralo en el componente y en su vista previa de `previews.js`.
4. Prueba con `npm run panel`.

## Notas y límites

- **Publicar = commit directo a `main`.** Si prefieres revisar antes de publicar, quita el `#` de `publish_mode: editorial_workflow` en
  `config.yml`: la clienta guardará borradores, tú los apruebas en el panel (o en GitHub como Pull Request) y se publican al aprobarlos.
- **Fotos:** se suben al repositorio (`public/images/...`). El panel no las comprime; la guía pide menos de 2 MB y el build avisa de las pesadas
  (`scripts/check-images.mjs`). Next.js ya sirve versiones WebP/AVIF optimizadas al visitante.
- **Año de admisión:** la página de campaña vive en `/admision-2027`. Si cambia `admissionYear`, renombra la carpeta `app/admision-AAAA`.
- **Dirección de la web mal escrita:** `webUrl()` (en `lib/content.ts`) agrega `https://` si falta y, si no es una dirección válida, usa un valor de respaldo; así un “miweb.pe” escrito en el panel no rompe el build.
- **Un JSON con sintaxis inválida** (por editar a mano en GitHub) detiene el build de Netlify; la web publicada no se afecta. El panel siempre escribe JSON válido.
- **Dos personas editando a la vez** pueden pisarse; Decap avisa si el archivo cambió. Con una sola editora no es un problema.
- La versión de Decap está fija en `app/admin/route.ts` (`DECAP_VERSION`). Para actualizarla, cámbiala y vuelve a probar el panel.
- Vistas previas: no muestran los efectos animados (rayos, chispas) ni las ilustraciones SVG; esas se ven al publicar.
