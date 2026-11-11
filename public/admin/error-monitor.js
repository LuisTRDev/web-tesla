/* Registro local: guarda categorías conocidas, nunca mensajes, URLs ni valores del formulario. */
(function () {
  "use strict";
  var key = "tesla-admin-errors-v1";
  var limit = 100;
  var action = "Uso del panel";
  var seenToasts = new WeakSet();
  var labels = {
    colegio: "Datos del colegio", paginas: "Páginas", nosotros: "Nosotros",
    propuesta: "Propuesta", admision: "Admisión", galeria: "Galería",
    noticias: "Noticias", calendario: "Calendario", documentos: "Documentos"
  };
  function read() {
    try { var data = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(data) ? data : []; }
    catch (error) { return []; }
  }
  function section() {
    var match = location.hash.match(/^#\/collections\/([a-z-]+)/);
    return match ? (labels[match[1]] || "Contenido") : "Panel";
  }
  function classify(text) {
    text = String(text || "").toLowerCase();
    if (/obligatorio|required|rellenado|validaci[oó]n/.test(text)) return "validacion";
    if (/network|fetch|offline|internet|conexi[oó]n|timeout/.test(text)) return "conexion";
    if (/401|403|unauthori|forbidden|sesi[oó]n|session|login|permission|permiso/.test(text)) return "acceso";
    if (/429|rate limit|too many/.test(text)) return "limite";
    if (/409|422|conflict|duplicate|already exists/.test(text)) return "conflicto";
    if (/publicar|publish|persist|saving|guardar|save/.test(text)) return "publicacion";
    return "general";
  }
  function record(type, source) {
    var item = { fecha: new Date().toISOString(), tipo: type, origen: source, seccion: section(), accion: action };
    try {
      var entries = read();
      var last = entries[0];
      if (last && last.tipo === item.tipo && last.origen === item.origen && last.seccion === item.seccion && last.accion === item.accion && Date.now() - Date.parse(last.fecha) < 5000) return;
      entries.unshift(item);
      localStorage.setItem(key, JSON.stringify(entries.slice(0, limit)));
      window.dispatchEvent(new Event("tesla-errors-changed"));
    } catch (error) { /* El navegador puede bloquear el almacenamiento. */ }
  }
  window.TeslaErrorMonitor = {
    list: read,
    clear: function () { try { localStorage.removeItem(key); window.dispatchEvent(new Event("tesla-errors-changed")); return true; } catch (error) { return false; } },
    available: function () { try { var probe = key + "-test"; localStorage.setItem(probe, "1"); localStorage.removeItem(probe); return true; } catch (error) { return false; } }
  };
  window.addEventListener("error", function (event) {
    record(event.target && event.target !== window ? "recurso" : "general", "Navegador");
  }, true);
  window.addEventListener("unhandledrejection", function () { record("general", "Operación del panel"); });
  window.addEventListener("offline", function () { record("conexion", "Navegador"); });
  document.addEventListener("click", function (event) {
    var button = event.target.closest && event.target.closest("button");
    if (!button) return;
    var text = button.textContent || "";
    if (/publicar|guardar/i.test(text)) action = "Publicar o guardar";
    else if (/google drive/i.test(text)) action = "Abrir Google Drive";
    else if (/subir|importar/i.test(text)) action = "Subir o importar archivo";
    else action = "Uso del panel";
  }, true);
  var originalFetch = window.fetch;
  if (originalFetch) window.fetch = function () {
    var args = arguments;
    return originalFetch.apply(this, args).then(function (response) {
      if ([401, 403, 409, 422, 429].indexOf(response.status) >= 0 || response.status >= 500) record(response.status === 401 || response.status === 403 ? "acceso" : response.status === 429 ? "limite" : response.status === 409 || response.status === 422 ? "conflicto" : "conexion", "Solicitud de red");
      return response;
    }, function (error) { record("conexion", "Solicitud de red"); throw error; });
  };
  function observe() {
    function scan() {
      document.querySelectorAll('.Toastify__toast--error, .Toastify__toast--warning').forEach(function (toast) {
        if (seenToasts.has(toast)) return;
        seenToasts.add(toast);
        record(classify(toast.textContent), "Aviso del panel");
      });
      document.querySelectorAll('.tesla-modal[role="alertdialog"], .tesla-modal [role="dialog"]').forEach(function (dialog) {
        if (seenToasts.has(dialog)) return;
        var title = dialog.querySelector("h2");
        if (title && /no se pudo|error/i.test(title.textContent)) {
          seenToasts.add(dialog);
          record(classify(title.textContent), "Aviso del panel");
        }
      });
    }
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    scan();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observe);
  else observe();
})();
