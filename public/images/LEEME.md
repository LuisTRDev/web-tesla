# Fotos del sitio

Cada carpeta corresponde a una sección de la web. Para usar una foto, cópiala en su carpeta y escribe la ruta en el archivo de `data/` indicado. La ruta empieza en `/images/...`, sin `public`.

| Carpeta | Sección de la web | Archivo donde va la ruta |
|---|---|---|
| `generales/` | Portada (hero), Nosotros y Admisión | `data/settings.ts` → `images` |
| `niveles/primaria/` | Nivel Primaria | `data/levels.ts` |
| `niveles/secundaria/` | Nivel Secundaria | `data/levels.ts` |
| `equipo/` | Nosotros → Nuestro equipo (retratos verticales) | `data/team.ts` |
| `pilares/` | Propuesta (pilares) | `data/pillars.ts` |
| `experiencia/` | Experiencia (clases, recreos, docentes, eventos) | `data/experience.ts` |
| `actividades/<tipo>/` | Actividades: ciencia, tecnología, arte, deportes, cultura, proyectos, eventos, escolares | `data/activities.ts` |
| `noticias/` | Noticias (una foto por noticia) | `data/news.ts` |
| `galeria/<año>/<mes>-<evento>/` | Galería, p. ej. `galeria/2026/10-aniversario/` | `data/gallery.ts` |

## Nombres de archivo

- Usa minúsculas, sin tildes, sin ñ y sin espacios. Separa las palabras con guiones: `aula-primaria-02.jpg`.
- Numera las fotos para que se ordenen solas: `-01`, `-02`, `-03`…
- Es mejor que la foto no lleve textos ni logos encima, porque el diseño puede recortar los bordes.

Ejemplo de ruta en `data/levels.ts`:

```ts
image: "/images/niveles/primaria/aula-primaria-01.png",
```
