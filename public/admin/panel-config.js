/*
 * AJUSTES DEL PANEL (los edita el desarrollador, no la clienta).
 * Completa estos datos cuando existan; si están vacíos, la función correspondiente se oculta.
 */
window.PANEL = {
  // Repositorio de GitHub (para mostrar los últimos cambios en Inicio cuando se entra con GitHub).
  repo: "LuisTRDev/web-tesla",
  // ID del sitio en Netlify (Site configuration → General → Site ID). Activa el indicador "publicando / listo" en Inicio.
  netlifySiteId: "",
  // WhatsApp de soporte (quien administra la web), con código de país. Ejemplo: "51999999999". Activa el botón "Pedir ayuda".
  supportWhatsapp: "",
  // Enlace del informe de Looker Studio con las visitas y los clics de WhatsApp (ver docs/CONFIGURAR_PANEL.md).
  lookerUrl: "",
  // Videos de los tutoriales de Ayuda: { id: "URL de inserción de YouTube" }. Ejemplo: { publicar: "https://www.youtube.com/embed/XXXXXXXXXXX" }.
  // Los ids son: inicio, texto, foto, publicar, noticias, galeria, listas, admision, aviso, qr, version.
  videos: {},
  // Identificadores publicos de Google Cloud para el selector de Drive.
  googleDrive: { clientId: "898831001638-i7deuab6gf314nkdrlpj7uskqaqkpuuf.apps.googleusercontent.com", apiKey: "AIzaSyCxfc19y6LEGbEofUQ3QXdVfYPJ5wLBe9E", projectNumber: "898831001638" },
};
