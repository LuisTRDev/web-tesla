# Institución Educativa Privada “Nikola Tesla” · Sitio web

Sitio institucional construido con **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion**.

## Cómo ejecutarlo

Requiere Node.js 18.17 o superior.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # compilación de producción
npm run start
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
data/         Contenido editable (settings, gallery, news, levels, activities, testimonials, ...)
lib/          Capa de datos (data.ts), utilidades y agrupación de la galería
types/        Tipos compartidos, listos para mapear a tablas
```

## Módulos

El sitio está dividido en módulos: cada sección es una página propia con su personalidad (color de
cabecera, acento, motivo gráfico y frase). Todo se define en `data/modules.ts`, y de ahí lo leen el menú,
el índice de la portada, la cabecera de cada módulo, el enlace "Siguiente" al pie y la cortina de color
que aparece al cambiar de sección. Para cambiar el orden, el color o la frase de un módulo, se edita solo ese archivo.
Cada nivel (Primaria y Secundaria) tiene además su propio color en `levelThemes`.

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| WhatsApp, redes, dirección, dominio, año de admisión | `data/settings.ts` |
| Fotos principales (hero, nosotros) | `data/settings.ts` → `images` |
| Texto de "Nosotros" y conceptos de filosofía | `data/philosophy.ts` |
| Pilares de la propuesta educativa | `data/pillars.ts` |
| Niveles y grados | `data/levels.ts` |
| Actividades y talleres | `data/activities.ts` |
| Galería (eventos, fotos, videos) | `data/gallery.ts` |
| Noticias | `data/news.ts` |
| Testimonios | `data/testimonials.ts` |
| Proceso de admisión | `data/admission.ts` |
| Preguntas frecuentes (Admisión y Contacto) | `data/faq.ts` |
| Equipo directivo y docentes (Nosotros) | `data/team.ts` |
| Logros (Nosotros) | `data/achievements.ts` |
| Horario de atención, resolución y código modular | `data/settings.ts` → `contact` y `legal` |
| Google Analytics | variable `NEXT_PUBLIC_GA_ID` (ver `.env.example`) |
| Módulos: orden, colores, frases, motivos | `data/modules.ts` |
| Colores y tipografías | `tailwind.config.ts` y `app/layout.tsx` |
| Logo | `components/ui/Logo.tsx` |

## Contenido pendiente (no se inventó ningún dato)

Todo lo que falta aparece en la web entre corchetes, por ejemplo `[WHATSAPP OFICIAL]`, y como
marcos rayados con el rótulo `[FOTO PENDIENTE]`. Además, el contenido provisional lleva una etiqueta
"Por confirmar".

Antes de publicar:

1. Completar `data/settings.ts`: `siteUrl`, `contact`, `social.facebook`.
2. Reemplazar fotos: copiar los archivos a `public/images/...` y escribir la ruta en el campo `image`/`url` correspondiente.
3. Validar con la institución los textos marcados con `confirmed: false` y cambiarlos a `true`.
4. Reemplazar eventos, noticias y testimonios de ejemplo (`isPlaceholder: true`).
5. Verificar el punto del mapa (`location.mapQuery`).
6. Poner `showDraftBadges: false` para ocultar las etiquetas "Por confirmar".
7. El logo oficial ya está en `public/images/logo-escudo.png` (favicon: `app/icon.png`, iOS: `app/apple-icon.png`). Sus colores (rojo y azul marino) ya forman parte de la paleta en `tailwind.config.ts`.

## Agregar un evento a la galería

En `data/gallery.ts`:

```ts
{
  id: "2026-11-feria-de-ciencias",
  title: "Feria de ciencias",
  description: "Nuestros estudiantes presentaron sus proyectos...",
  date: "2026-11-14",
  category: "Ciencia",
  coverImage: "/images/galeria/2026-11-feria/portada.jpg",
  media: [
    { id: "f1", type: "image", url: "/images/galeria/2026-11-feria/01.jpg", caption: "Proyecto de 5.º grado" },
    { id: "v1", type: "video", url: "https://www.youtube.com/watch?v=XXXXXXXX", thumbnail: "/images/galeria/2026-11-feria/video.jpg" },
  ],
}
```

La web lo ubica sola en su año y mes. Los videos aceptan enlaces de YouTube, Vimeo o archivos `.mp4`.

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
