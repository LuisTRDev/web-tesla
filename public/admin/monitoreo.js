(function () {
  "use strict";
  var monitor;
  try { monitor = window.parent.TeslaErrorMonitor; } catch (error) { /* La página debe abrirse desde el panel. */ }
  var names = {
    validacion: ["Faltan datos o hay un campo inválido", "Revisa los campos marcados antes de publicar."],
    conexion: ["Problema de conexión o del servidor", "Comprueba la conexión e intenta nuevamente."],
    acceso: ["Problema de acceso o permisos", "Revisa la sesión y los permisos de la cuenta."],
    limite: ["Límite de solicitudes", "Espera unos minutos antes de volver a intentarlo."],
    conflicto: ["Conflicto al guardar", "Comprueba si otra persona modificó el contenido."],
    publicacion: ["No se pudo publicar o guardar", "Conserva los cambios y vuelve a intentarlo."],
    recurso: ["No se pudo cargar un recurso", "Recarga el panel y revisa la conexión."],
    general: ["Error del panel", "Intenta nuevamente y comparte este registro con soporte si se repite."]
  };
  var list = document.getElementById("entries");
  var count = document.getElementById("count");
  var message = document.getElementById("message");
  var copy = document.getElementById("copy");
  var download = document.getElementById("download");
  var clear = document.getElementById("clear");
  function entries() { return monitor ? monitor.list() : []; }
  function report() {
    return JSON.stringify({ descripcion: "Registro local del panel", generado: new Date().toISOString(), errores: entries() }, null, 2);
  }
  function render() {
    var items = entries();
    count.textContent = items.length + (items.length === 1 ? " error registrado" : " errores registrados");
    copy.disabled = download.disabled = clear.disabled = !items.length;
    list.replaceChildren();
    if (!monitor || !monitor.available()) message.textContent = "El navegador no permite guardar el historial local. Revisa la configuración del navegador.";
    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "entry";
      empty.textContent = "Todavía no hay errores registrados en este navegador.";
      list.appendChild(empty);
      return;
    }
    items.forEach(function (item) {
      var info = names[item.tipo] || names.general;
      var article = document.createElement("article"); article.className = "entry";
      var title = document.createElement("h2"); title.textContent = info[0]; article.appendChild(title);
      var detail = document.createElement("p"); detail.textContent = info[1]; article.appendChild(detail);
      var meta = document.createElement("p"); meta.className = "meta";
      var date = new Date(item.fecha);
      meta.textContent = (isNaN(date.getTime()) ? "Fecha desconocida" : date.toLocaleString("es-PE", { timeZone: "America/Lima" })) + " · " + item.seccion + " · " + item.accion + " · " + item.origen;
      article.appendChild(meta); list.appendChild(article);
    });
  }
  copy.addEventListener("click", function () {
    if (!navigator.clipboard || !navigator.clipboard.writeText) { message.textContent = "No se pudo copiar. Usa Descargar registro."; return; }
    navigator.clipboard.writeText(report()).then(function () { message.textContent = "Registro copiado."; }, function () { message.textContent = "No se pudo copiar. Usa Descargar registro."; });
  });
  download.addEventListener("click", function () {
    var url = URL.createObjectURL(new Blob([report()], { type: "application/json" }));
    var link = document.createElement("a"); link.href = url; link.download = "errores-panel.json"; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    message.textContent = "Registro descargado.";
  });
  clear.addEventListener("click", function () {
    if (!window.confirm("¿Borrar el historial de errores de este navegador?")) return;
    message.textContent = monitor.clear() ? "Historial borrado." : "No se pudo borrar el historial.";
    render();
  });
  window.addEventListener("storage", function (event) { if (event.key === "tesla-admin-errors-v1") render(); });
  if (window.parent !== window) window.parent.addEventListener("tesla-errors-changed", render);
  render();
})();
