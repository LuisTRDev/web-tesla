# Guiones para los videos del panel

Videos cortos (30 a 60 segundos) que se ven **dentro del panel**: al pulsar **❓ Ayuda** en un formulario, el video de esa pantalla aparece arriba del tutorial escrito; también salen en la página **Ayuda**.

## Cómo grabarlos y activarlos

1. Graba la pantalla (por ejemplo con el grabador de Windows: Win + Alt + R) mientras haces los pasos del guion, en el panel con datos de ejemplo. Sin voz basta con **subtítulos**; con voz, habla despacio.
2. Súbelo a **YouTube** como “No listado”.
3. Copia el id del video (lo que va después de `v=`) y ponlo en `public/admin/panel-config.js`, dentro de `videos`, con la clave del tutorial:

```js
videos: {
  publicar: "https://www.youtube.com/embed/XXXXXXXXXXX",
  texto: "https://www.youtube.com/embed/YYYYYYYYYYY",
},
```

4. Publica. El video aparece solo en la ayuda lateral y en la página Ayuda.

Si una clave no tiene video, simplemente no se muestra nada: no hace falta grabarlos todos.

## Guiones (en este orden de prioridad)

| Clave | Título | Qué se ve en pantalla (30–60 s) |
|---|---|---|
| `inicio` | Entrar y recorrer el panel | 5 clics al logo del pie de página → iniciar sesión → buscador de Inicio (“WhatsApp”) → te lleva al campo. |
| `texto` | Cambiar un texto | Abrir *Datos del colegio* → cambiar la frase de la portada → ver la vista previa cambiar → clic en un texto de la vista previa y que te lleve a su campo. |
| `publicar` | Publicar y ver el cambio | Barra “Tienes cambios sin publicar” → *Revisar y publicar* → *Publicar ahora* → pantalla “¡Publicado!” → *Ver mi web*. |
| `foto` | Subir o cambiar una foto | Campo de foto → *Elige una imagen* → *Subir* → elegir → aviso de “foto optimizada” → publicar. |
| `formularios` | Moverte por un formulario | Migas y *Volver*, pestañas o “Ir a:”, abrir un elemento de una lista (uno a la vez), *⚙️ Avanzado*, *🧭 Guía*, *❓ Ayuda*. |
| `practica` | Practicar sin miedo | *⋯ → Modo práctica* → escribir algo → intentar publicar (aviso de práctica) → *Salir y descartar*. |
| `noticias` | Publicar una noticia | *Nueva noticia* → título, fecha, categoría, resumen y texto → foto → publicar; mencionar la fecha futura para programarla. |
| `calendario` | Agregar un evento | *Calendario de eventos → Nuevo evento* → nombre, fecha, hora, tipo → publicar → ver `/calendario` y el botón “Agregar a Google Calendar”. |
| `documentos` | Subir documentos | *Documentos para descargar → Añadir documentos* → nombre, archivo PDF, categoría → publicar → ver `/documentos`. |
| `personalizar` | Portada, menú, colores y efectos | Arrastrar secciones de la portada → ocultar una → cambiar de paleta → apagar un efecto → publicar. |
| `aviso` | Avisos sobre el menú | Crear un aviso, elegir color y dónde se muestra, fechas → publicar → verlo en la web. |
| `qr` | Crear el afiche con QR | *Campaña y QR* → plantilla → formato → textos → semáforo de lectura → descargar PDF para la imprenta. |

## Consejos

- Un video = una tarea. Si pasa de 1 minuto, divídelo.
- Muestra primero **el resultado** (“así se verá en la web”) y luego los pasos.
- Usa un zoom del navegador de 110 % o 125 % para que se lea en celular.
- Evita mostrar datos reales de familias o teléfonos personales.
