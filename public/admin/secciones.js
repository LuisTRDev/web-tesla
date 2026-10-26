/*
 * MAPA DEL PANEL EN LENGUAJE DE LA CLIENTA
 * Un solo lugar con los nombres, descripciones, atajos, pestañas y ejemplos que usan Inicio, las secciones
 * y los formularios. Las "rutas de campo" son [etiqueta, nº de elemento, etiqueta…] y deben coincidir con las
 * etiquetas de public/admin/config.yml (se ignora el sufijo "(opcional)" / "(si quieres)").
 */
window.TESLA = (function () {
  var E = "/admin#/collections/";

  /* ───────── secciones del menú izquierdo ───────── */
  var sections = {
    colegio: {
      icon: "🏫",
      title: "Datos del colegio",
      desc: "Lo que se repite en toda la web: nombre, frases, contacto, redes, fotos principales y cifras.",
      cards: [
        { file: "settings", icon: "🏫", title: "Datos del colegio", desc: "Nombre, frase de la portada, dirección, WhatsApp, redes, fotos principales y cifras.", chips: ["Frase de portada", "WhatsApp", "Dirección", "Foto de portada", "Cifras"], web: "/" },
      ],
    },
    paginas: {
      icon: "📝",
      title: "Títulos, portada y aviso",
      desc: "Los títulos grandes de cada página, el aviso sobre el menú y los textos de la página de campaña.",
      cards: [
        { file: "banner", icon: "🔔", title: "Aviso sobre el menú", desc: "La barra amarilla de arriba: “Matrícula abierta hasta…”. Se puede programar.", chips: ["Mensaje", "Botón", "Fechas"], web: "/" },
        { file: "pages", icon: "🚀", title: "Portada y página de campaña", desc: "El texto de admisión de la portada y toda la página a la que llevan los anuncios.", chips: ["Razones para elegirnos", "Pasos", "Agenda tu visita"], web: "/admision-2027" },
        { file: "modules", icon: "🔤", title: "Títulos de cada página", desc: "El título grande, la introducción y la descripción para Google de cada sección.", chips: ["Título", "Introducción", "Google"], web: "/nosotros" },
      ],
    },
    nosotros: {
      icon: "👥",
      title: "Quiénes somos y equipo",
      desc: "La historia y los valores del colegio, el equipo, los logros y lo que dicen las familias.",
      cards: [
        { file: "philosophy", icon: "💬", title: "Quiénes somos y valores", desc: "El texto principal y los valores del colegio.", chips: ["Título", "Párrafos", "Valores"], web: "/nosotros" },
        { file: "team", icon: "🧑‍🏫", title: "Equipo", desc: "Dirección, coordinadores y docentes, con su foto.", chips: ["Cargo", "Nombre", "Foto"], web: "/nosotros" },
        { file: "achievements", icon: "🏆", title: "Logros", desc: "Concursos, deportes y reconocimientos del colegio.", chips: ["Año", "Título", "Descripción"], web: "/nosotros" },
        { file: "testimonials", icon: "⭐", title: "Testimonios", desc: "Lo que dicen padres, estudiantes y docentes (con su permiso).", chips: ["Testimonio", "Nombre"], web: "/nosotros" },
      ],
    },
    propuesta: {
      icon: "🎓",
      title: "Propuesta, niveles y actividades",
      desc: "Cómo enseña el colegio: pilares, Primaria y Secundaria, talleres y la vida en el colegio.",
      cards: [
        { file: "pillars", icon: "🧭", title: "Pilares de la propuesta", desc: "Los seis pilares educativos, con su descripción y foto.", chips: ["Título", "Descripción", "Foto"], web: "/propuesta" },
        { file: "levels", icon: "🏫", title: "Niveles (Primaria y Secundaria)", desc: "Descripción, grados y foto de cada nivel.", chips: ["Descripción", "Grados", "Foto"], web: "/niveles" },
        { file: "activities", icon: "🎨", title: "Actividades y talleres", desc: "Ciencia, arte, deportes, cultura y más, cada una con su foto.", chips: ["Título", "Descripción", "Foto"], web: "/actividades" },
        { file: "experience", icon: "📸", title: "Así se vive Nikola Tesla", desc: "Las fotos grandes de clases, recreos, docentes y eventos.", chips: ["Frases", "Fotos"], web: "/nosotros" },
      ],
    },
    admision: {
      icon: "📋",
      title: "Admisión y preguntas",
      desc: "Los pasos para matricular, requisitos, fechas, vacantes y las preguntas de las familias.",
      cards: [
        { file: "admission", icon: "📋", title: "Proceso de admisión", desc: "Pasos, requisitos, fechas y vacantes que ven las familias.", chips: ["Pasos", "Requisitos", "Fechas", "Vacantes"], web: "/admision" },
        { file: "faq", icon: "❓", title: "Preguntas frecuentes", desc: "Horario, costos, uniforme, visitas… y sus respuestas.", chips: ["Preguntas", "Respuestas"], web: "/admision" },
      ],
    },
    galeria: {
      icon: "🖼️",
      title: "Galería de fotos",
      desc: "Los eventos del colegio con sus fotos y videos, ordenados por fecha.",
      cards: [
        { file: "gallery", icon: "🖼️", title: "Eventos de la galería", desc: "Cada evento con su fecha, portada, fotos y videos.", chips: ["Evento", "Fecha", "Fotos", "Videos"], web: "/galeria" },
      ],
    },
    noticias: { icon: "📰", title: "Noticias", desc: "Comunicados, logros y novedades.", cards: [] },
  };

  /* ───────── páginas de la web y qué se puede cambiar en cada una (mapa de la web) ───────── */
  var pages = [
    { id: "portada", icon: "🏠", title: "Portada", url: "/", edits: [
      { label: "Frase de la portada", to: "colegio/entries/settings", field: ["Frase principal"] },
      { label: "Foto o video de portada", to: "colegio/entries/settings", field: ["Fotos y video principales", "Foto de la portada"] },
      { label: "Cifras del colegio", to: "colegio/entries/settings", field: ["Cifras del colegio"] },
      { label: "Aviso sobre el menú", to: "paginas/entries/banner" },
      { label: "Texto del aviso de admisión", to: "paginas/entries/pages", field: ["Portada", "Texto del aviso de admisión"] },
    ] },
    { id: "nosotros", icon: "👥", title: "Nosotros", url: "/nosotros", edits: [
      { label: "Texto y valores", to: "nosotros/entries/philosophy" },
      { label: "Equipo", to: "nosotros/entries/team" },
      { label: "Logros", to: "nosotros/entries/achievements" },
      { label: "Testimonios", to: "nosotros/entries/testimonials" },
      { label: "Título de la página", to: "paginas/entries/modules" },
    ] },
    { id: "propuesta", icon: "🧭", title: "Propuesta educativa", url: "/propuesta", edits: [
      { label: "Los seis pilares", to: "propuesta/entries/pillars" },
      { label: "Título de la página", to: "paginas/entries/modules" },
    ] },
    { id: "niveles", icon: "🏫", title: "Niveles", url: "/niveles", edits: [
      { label: "Primaria y Secundaria", to: "propuesta/entries/levels" },
      { label: "Título de la página", to: "paginas/entries/modules" },
    ] },
    { id: "actividades", icon: "🎨", title: "Actividades", url: "/actividades", edits: [
      { label: "Talleres y actividades", to: "propuesta/entries/activities" },
      { label: "Así se vive Nikola Tesla", to: "propuesta/entries/experience" },
    ] },
    { id: "galeria", icon: "🖼️", title: "Galería", url: "/galeria", edits: [
      { label: "Eventos, fotos y videos", to: "galeria/entries/gallery" },
    ] },
    { id: "noticias", icon: "📰", title: "Noticias", url: "/noticias", edits: [
      { label: "Escribir una noticia nueva", to: "noticias/new" },
      { label: "Ver y editar las noticias", to: "noticias" },
    ] },
    { id: "admision", icon: "📋", title: "Admisión", url: "/admision", edits: [
      { label: "Pasos, requisitos y fechas", to: "admision/entries/admission" },
      { label: "Preguntas frecuentes", to: "admision/entries/faq" },
    ] },
    { id: "campana", icon: "🚀", title: "Página de campaña", url: "/admision-2027", edits: [
      { label: "Textos de la página", to: "paginas/entries/pages", field: ["Página de campaña (/admision-2027)"] },
      { label: "Crear el QR y los afiches", page: "campana" },
    ] },
    { id: "contacto", icon: "📞", title: "Contacto", url: "/contacto", edits: [
      { label: "WhatsApp, horario y dirección", to: "colegio/entries/settings", field: ["Contacto"] },
      { label: "Redes sociales", to: "colegio/entries/settings", field: ["Redes sociales"] },
    ] },
  ];

  /* ───────── buscador de "¿qué quieres cambiar?" ───────── */
  function find(label, keys, to, field, extra) {
    var o = { label: label, keys: keys, to: to, field: field || null };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  var search = [
    find("Número de WhatsApp", ["whatsapp", "celular", "telefono", "teléfono", "numero", "número", "llamar"], "colegio/entries/settings", ["Contacto", "Números de WhatsApp"]),
    find("Horario de atención", ["horario", "hora", "atencion", "atención"], "colegio/entries/settings", ["Contacto", "Horario de atención"]),
    find("Dirección del colegio", ["direccion", "dirección", "ubicacion", "ubicación", "mapa", "calle"], "colegio/entries/settings", ["Ubicación", "Dirección"]),
    find("Frase de la portada", ["frase", "portada", "lema", "slogan", "eslogan"], "colegio/entries/settings", ["Frase principal"]),
    find("Foto de la portada", ["foto portada", "imagen portada", "portada foto", "video portada"], "colegio/entries/settings", ["Fotos y video principales", "Foto de la portada"]),
    find("Video de la portada", ["video", "vídeo"], "colegio/entries/settings", ["Fotos y video principales", "Video de la portada"]),
    find("Facebook, Instagram o TikTok", ["facebook", "instagram", "tiktok", "youtube", "redes"], "colegio/entries/settings", ["Redes sociales"]),
    find("Cifras (años, estudiantes, docentes)", ["cifras", "estudiantes", "alumnos", "docentes", "años", "trayectoria", "numeros", "números"], "colegio/entries/settings", ["Cifras del colegio"]),
    find("Fecha de cierre de inscripciones", ["fecha", "cierre", "inscripciones", "contador", "plazo"], "colegio/entries/settings", ["Último día de inscripciones"]),
    find("Resolución y código modular", ["resolucion", "resolución", "ugel", "modular", "codigo", "código"], "colegio/entries/settings", ["Respaldo oficial"]),
    find("Dirección de la web (dominio)", ["dominio", "web", "pagina web", "página web", "link", "url"], "colegio/entries/settings", ["Dirección de la web"]),
    find("Descripción que sale en Google", ["google", "buscador", "descripcion", "descripción", "seo"], "colegio/entries/settings", ["Descripción para Google"]),
    find("Etiquetas “Por confirmar”", ["etiquetas", "por confirmar", "confirmar", "borrador"], "colegio/entries/settings", ["Mostrar etiquetas “Por confirmar”"]),
    find("Aviso sobre el menú", ["aviso", "barra", "anuncio", "banner", "alerta"], "paginas/entries/banner"),
    find("Títulos de las páginas", ["titulo", "título", "menu", "menú", "introduccion", "introducción"], "paginas/entries/modules"),
    find("Página de campaña (admisión 2027)", ["campaña", "campana", "landing", "razones", "visita", "agenda"], "paginas/entries/pages", ["Página de campaña (/admision-2027)"]),
    find("Quiénes somos y valores", ["quienes somos", "quiénes somos", "valores", "historia", "mision", "misión", "vision", "visión", "nosotros"], "nosotros/entries/philosophy"),
    find("Equipo y directivos", ["equipo", "director", "directora", "coordinador", "profesores", "docentes", "personal"], "nosotros/entries/team"),
    find("Logros del colegio", ["logros", "premios", "concursos", "reconocimientos"], "nosotros/entries/achievements"),
    find("Testimonios", ["testimonios", "opiniones", "padres", "comentarios"], "nosotros/entries/testimonials"),
    find("Pilares de la propuesta", ["pilares", "propuesta", "metodologia", "metodología"], "propuesta/entries/pillars"),
    find("Primaria y Secundaria (grados)", ["niveles", "primaria", "secundaria", "grados"], "propuesta/entries/levels"),
    find("Actividades y talleres", ["actividades", "talleres", "deportes", "arte", "ciencia"], "propuesta/entries/activities"),
    find("Fotos de “Así se vive”", ["clases", "recreo", "asi se vive", "así se vive"], "propuesta/entries/experience"),
    find("Pasos y requisitos de admisión", ["admision", "admisión", "requisitos", "matricula", "matrícula", "vacantes", "documentos", "pasos"], "admision/entries/admission"),
    find("Preguntas frecuentes", ["preguntas", "faq", "costos", "pension", "pensión", "uniforme"], "admision/entries/faq"),
    find("Galería de fotos y videos", ["galeria", "galería", "fotos", "eventos", "album", "álbum"], "galeria/entries/gallery"),
    find("Escribir una noticia", ["noticia", "comunicado", "publicar noticia", "novedad"], "noticias/new"),
    find("Crear el QR y los afiches", ["qr", "afiche", "volante", "poster", "póster", "flyer", "imprimir"], null, null, { page: "campana" }),
    find("Ayuda y tutoriales", ["ayuda", "tutorial", "como", "cómo", "no entiendo"], null, null, { page: "ayuda" }),
  ];

  /* ───────── pestañas de los formularios largos ───────── */
  var tabs = {
    "colegio/settings": [
      { label: "Nombre y frases", icon: "✏️", fields: ["Nombre oficial", "Nombre corto", "Rótulo sobre el nombre", "Frase principal", "Concepto", "Frase del pie de página", "Descripción para Google"] },
      { label: "Admisión", icon: "📅", fields: ["Año de admisión", "Último día de inscripciones", "Mostrar etiquetas “Por confirmar”"] },
      { label: "Contacto y ubicación", icon: "📍", fields: ["Dirección de la web", "Ubicación", "Contacto", "Respaldo oficial"] },
      { label: "Redes y fotos", icon: "📷", fields: ["Redes sociales", "Fotos y video principales"] },
      { label: "Cifras", icon: "🔢", fields: ["Cifras del colegio"] },
    ],
    "paginas/pages": [
      { label: "Portada", icon: "🏠", fields: ["Portada"] },
      { label: "Página de campaña", icon: "🚀", fields: ["Página de campaña (/admision-2027)"] },
    ],
    "admision/admission": [
      { label: "Invitación", icon: "💌", fields: ["Titular grande", "Texto de invitación"] },
      { label: "Pasos", icon: "👣", fields: ["Pasos del proceso"] },
      { label: "Requisitos, fechas y vacantes", icon: "📌", fields: ["Requisitos, fechas y vacantes"] },
    ],
    "nosotros/philosophy": [
      { label: "Texto principal", icon: "💬", fields: ["Texto principal"] },
      { label: "Valores", icon: "💎", fields: ["Valores y conceptos"] },
    ],
  };

  /* ───────── ejemplos de buen texto (se insertan con un clic) ───────── */
  var examples = {
    "Frase principal": ["Donde la curiosidad se convierte en futuro.", "Formamos personas curiosas, seguras y listas para el futuro.", "Aprender con alegría, crecer con valores."],
    "Frase del pie de página": ["Educación, curiosidad y futuro.", "Pasión por educar."],
    "Rótulo sobre el nombre": ["Institución Educativa Privada"],
    "Horario de atención": ["Lunes a viernes, 7:30 a. m. – 3:00 p. m.", "Lunes a viernes de 8:00 a. m. a 1:00 p. m. y de 3:00 a 5:00 p. m."],
    "Mensaje": ["Inscripciones abiertas · Admisión 2027", "¡Matrícula 2027 abierta! Separa tu vacante", "Visítanos y conoce el colegio · Agenda tu cita"],
    "Texto del botón": ["Infórmate aquí", "Separa tu vacante", "Agenda tu visita"],
    "Texto del aviso de admisión": ["Infórmate sobre el proceso", "Separa tu vacante para 2027"],
    "Rótulo superior": ["Nikola Tesla · Cañete", "Matrícula 2027"],
    "Texto de “Agenda tu visita”": ["Elige el día y el turno que mejor te vengan. Te confirmamos la hora por WhatsApp."],
    "Titular grande": ["¿Listos para comenzar esta historia?", "Tu familia, nuestra comunidad."],
    "Texto de invitación": ["Queremos conocer a tu familia. Escríbenos y te contamos, paso a paso, cómo ser parte de Nikola Tesla."],
  };

  /* ───────── a qué página de la web corresponde cada formulario ───────── */
  var entryWeb = {
    "colegio/settings": "/", "paginas/banner": "/", "paginas/pages": "/admision-2027", "paginas/modules": "/nosotros",
    "nosotros/philosophy": "/nosotros", "nosotros/team": "/nosotros", "nosotros/achievements": "/nosotros", "nosotros/testimonials": "/nosotros",
    "propuesta/pillars": "/propuesta", "propuesta/levels": "/niveles", "propuesta/activities": "/actividades", "propuesta/experience": "/nosotros",
    "admision/admission": "/admision", "admision/faq": "/admision", "galeria/gallery": "/galeria", noticias: "/noticias",
  };

  /* ───────── nombres amigables para el historial de cambios ───────── */
  var fileNames = {
    "content/settings.json": "Datos del colegio", "content/banner.json": "Aviso sobre el menú", "content/pages.json": "Portada y campaña", "content/modules.json": "Títulos de las páginas",
    "content/philosophy.json": "Quiénes somos", "content/team.json": "Equipo", "content/achievements.json": "Logros", "content/testimonials.json": "Testimonios",
    "content/pillars.json": "Pilares", "content/levels.json": "Niveles", "content/activities.json": "Actividades", "content/experience.json": "Así se vive",
    "content/admission.json": "Admisión", "content/faq.json": "Preguntas frecuentes", "content/gallery.json": "Galería",
  };

  return { sections: sections, pages: pages, search: search, tabs: tabs, examples: examples, entryWeb: entryWeb, fileNames: fileNames, base: E };
})();
