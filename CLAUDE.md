# CLAUDE.md · Guía para trabajar en este proyecto

Sitio institucional de la I.E.P. “Nikola Tesla” (Cañete, Perú): **Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion**, con un panel de edición **Decap CMS** en `/admin` que guarda cada cambio como commit en este repositorio (Netlify publica en 1–2 min). No hay base de datos ni servidor propio. Las personas que editan no saben programar: **todo lo que ven debe estar en español claro**.

## Antes de empezar cada sesión
1. Lee **`BITACORA.md`** (historial por sesión) y **`PENDIENTES_COLEGIO.md`** (lo que falta del colegio).
2. Al terminar, **actualiza `BITACORA.md`** con lo hecho, lo probado, lo no probado y lo que quedó pendiente. Sé honesto: separa “probado en el navegador” de “solo revisado en código”.
3. **Commits**: no añadas `Co-Authored-By: Claude` ni líneas de atribución a commits ni PR (preferencia de la dueña del proyecto). Antes de subir a `main`, haz `git pull --rebase origin main`: el panel publica commits (“Panel: actualizar …”) y suelen tocar `content/*.json`.
4. No inventes datos del colegio (teléfonos, fechas, resoluciones, costos). Lo que falta se muestra como `[DATO PENDIENTE]` y se lista en `PENDIENTES_COLEGIO.md`.

## Comandos
```bash
npm run dev          # web en :3000 (predev compila el CSS de las vistas previas)
npm run panel        # web + servidor local de Decap: http://localhost:3000/admin (botón “Iniciar sesión”, sin GitHub)
npm run typecheck    # tsc --noEmit
npm run build        # prebuild: CSS del panel + scripts/check-images.mjs + scripts/check-panel.mjs
npm run check:panel  # config.yml válido, archivos de contenido existen y son JSON, campos con name/widget
npm run test:qr      # diseñador de QR: 9 plantillas, 10 formas de punto, degradado de 3 colores
```
Siempre corre `npx tsc --noEmit`, `npm run check:panel` y `npm run build` antes de dar algo por terminado. Para el panel, ábrelo de verdad (ver “Cómo probar”).

## Mapa del proyecto
- `content/*.json` · contenido editable (lo escribe el panel). `data/*.ts` lo lee, valida y da valores de respaldo (`lib/content.ts`: `str`, `text`, `list`, `oneOf`…). Los componentes nunca leen el JSON directo.
- `app/` rutas. Además de los módulos de la web: `/admision-AAAA` (campaña), `/qr/[canal]` (enlace corto de los QR impresos → `lib/qr-redirect.ts`), **`/escanear`** (Escáner Tesla, `lib/qr-scanner.ts`), **`/recorrido`** (360°, 404 si no hay escenas), `/admin` (carga Decap).
- `lib/qr-splash.ts` · animación que se ve al escanear un QR (9 escenas en canvas, una sola página HTML sin React). `SCENES_JS` lo comparten la página de entrada y el Escáner Tesla.
- `public/admin/` · **el panel**: `config.yml` (campos), `previews.js` (vistas previas, réplicas aproximadas), `secciones.js` (tarjetas, buscador, pestañas), `panel-ux.js`/`panel-ui.js`/`panel-guide.js` (capa amigable sobre Decap), `mobile.css`+`mobile.js` (celular), `preview-device.js` (celular/pantalla), `panel-errors.js` (errores y “faltan N cosas”), `panel-extras.js` (menú Aa, globo de pendientes), `qr-designer.js` + `campana.html` (afiches y QR), `inicio.html`, `plantillas.html`, `ayuda.html`, `resultados.html`.
- `data/appearance.ts` + `content/apariencia.json` · paleta, **letras** (`app/fonts.ts`), **esquinas**, efectos (incluye `electric` y `revealSpeed`).
- `docs/GUIA_PANEL.md` (para la clienta) y `docs/CONFIGURAR_PANEL.md` (técnico).

## Trampas conocidas (ya nos mordieron)
- **Saltos de línea**: muchos archivos están en **CRLF**. Un reemplazo de texto de varias líneas hecho con scripts puede *no aplicarse sin avisar*. Después de editar con script, comprueba que el cambio existe (`grep`). La herramienta Edit sí tolera esto.
- **`public/admin/config.yml`**: una sangría mal puesta deja el **panel en blanco** (“Error loading the CMS configuration”). Corre `npm run check:panel` tras cada cambio. Al insertar un campo, cuenta los espacios del bloque vecino.
- **Tailwind en las vistas previas**: las clases nuevas de `previews.js` solo existen si se compilan en `public/admin/preview.css` (`npm run build:admin-css`).
- **`next/font`**: cada fuente debe ser una `const` en el módulo con valores literales (sin spread ni funciones). Ver `app/fonts.ts`.
- **Plantillas de texto (`` ` ``) con JS dentro** (`lib/qr-splash.ts`, `lib/qr-scanner.ts`): las barras invertidas hay que duplicarlas (`\\n`, `\\d`) y no puede haber `${` dentro del script del navegador. Revisa el HTML generado con `node --check`.
- **QR**: el texto se codifica en **UTF-8** (`qrcode.stringToBytes`); sin eso las tildes y eñes se leen mal.
- **Decap**: su editor exige 800 px de ancho (se corrige en `mobile.css`); el temporizador de un `MutationObserver` que se reinicia en cada cambio **nunca dispara** porque Decap muta el DOM sin parar (usa limitación, no “debounce”). El modo oscuro del panel se probó y se descartó. El modo `editorial_workflow` no funciona con el servidor local (solo `simple`).
- **`useEffect` y datos del colegio**: el sitio es estático; lo que dependa de la fecha (contador, “faltan N días”, horario de WhatsApp) se calcula en el navegador al montar.
- **Seguridad**: los enlaces de “Redirecciones” se validan en `next.config.mjs`; el calendario solo acepta `calendly.com` y `cal.com` (`data/settings.ts`); el Escáner Tesla solo abre solo direcciones de esta misma web; el lector de formato (`lib/markdown.tsx`) no admite HTML.

## Cómo probar (obligatorio para cambios del panel o de pantalla)
- **Panel real**: `npm run panel`, abrir `http://localhost:3000/admin/`, pulsar “Iniciar sesión”. Se puede controlar con `puppeteer-core` + Edge (`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`), por ejemplo a 390×800 para móvil. Los botones de la ventana “Revisar y publicar” se activan mejor con `element.click()` dentro de la página que con el clic del mouse simulado.
- **Cámara**: Edge con `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream --use-file-for-fake-video-capture=archivo.y4m` (un `.y4m` con un QR dentro sirve para probar `/escanear`).
- **Animaciones del QR**: `/qr/volante?anim=<nombre>&freeze=<ms>` congela un instante (solo para pruebas).
- Al terminar de probar, **restaura los `content/*.json` que cambiaste a propósito** (apariencia, settings, tareas, redirecciones) y detén los servidores.
- Nunca des por probado algo que no se abrió: dilo en la bitácora.

## Estilo
- Español neutro y claro en todo texto visible; ayudas con ejemplos; sin tecnicismos para la clienta.
- Comentarios en español, cortos, que expliquen el *por qué*.
- Contraste y tamaños pensados para celular (la mayoría de las familias entra desde el teléfono); respeta `prefers-reduced-motion`.
- Cada función nueva con campos en el panel debe tener: campo en `config.yml` con `hint`, valor de respaldo en `data/*.ts`, tipo en `types/index.ts`, y una línea en `docs/GUIA_PANEL.md`.
