/* Registro local: conserva únicamente detalles técnicos filtrados, sin URLs ni valores de formularios. */
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
  function safeLocation(value, line, column) {
    try {
      var url = new URL(value, location.origin);
      if (url.origin !== location.origin || !/^\/(admin|_next\/static)\//.test(url.pathname)) return "";
      var name = url.pathname.split("/").pop();
      if (!/^[a-z0-9._-]+\.(?:js|css)$/i.test(name)) return "";
      return name + (Number(line) > 0 ? ":" + Number(line) : "") + (Number(column) > 0 ? ":" + Number(column) : "");
    } catch (error) { return ""; }
  }
  function technicalError(error, filename, line, column) {
    var data = {};
    if (error && /^(Error|TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError)$/.test(error.name)) data.tipoError = error.name;
    var message = error && typeof error.message === "string" ? error.message : "";
    if (/cannot read propert/i.test(message)) data.mensaje = "Cannot read properties of null or undefined";
    else if (/is not a function/i.test(message)) data.mensaje = "Value is not a function";
    else if (/failed to fetch|networkerror|network request failed/i.test(message)) data.mensaje = "Network request failed";
    else if (/loading chunk [\w-]+ failed|chunkloaderror/i.test(message)) data.mensaje = "Failed to load a JavaScript chunk";
    else if (/quotaexceedederror/i.test(error && error.name || "")) data.mensaje = "Browser storage quota exceeded";
    var file = safeLocation(filename, line, column);
    if (!file && error && typeof error.stack === "string") {
      var frames = error.stack.split("\n");
      for (var i = 0; i < frames.length; i++) {
        var match = frames[i].match(/(https?:\/\/[^\s()]+?):(\d+):(\d+)/);
        if (match && (file = safeLocation(match[1], match[2], match[3]))) break;
      }
    }
    if (file) data.archivo = file;
    return data;
  }
  function service(input) {
    try {
      var url = new URL(typeof input === "string" ? input : input.url, location.origin);
      if (url.origin === location.origin) return "Panel";
      if (url.hostname === "api.github.com") return "GitHub";
      if (url.hostname === "www.googleapis.com" || url.hostname === "accounts.google.com") return "Google";
      if (url.hostname === "api.netlify.com") return "Netlify";
    } catch (error) { /* La dirección no se guarda. */ }
    return "Servicio externo";
  }
  function record(type, source, detail) {
    var item = { fecha: new Date().toISOString(), tipo: type, origen: source, seccion: section(), accion: action };
    if (detail && Object.keys(detail).length) item.tecnico = detail;
    try {
      var entries = read();
      var last = entries[0];
      if (last && last.tipo === item.tipo && last.origen === item.origen && last.seccion === item.seccion && last.accion === item.accion && JSON.stringify(last.tecnico || {}) === JSON.stringify(item.tecnico || {}) && Date.now() - Date.parse(last.fecha) < 5000) return;
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
    record(event.target && event.target !== window ? "recurso" : "general", "Navegador", technicalError(event.error, event.filename, event.lineno, event.colno));
  }, true);
  window.addEventListener("unhandledrejection", function (event) { record("general", "Operación del panel", technicalError(event.reason)); });
  window.addEventListener("offline", function () { record("conexion", "Navegador"); });
  var originalConsoleError = console.error;
  console.error = function () {
    var args = arguments;
    try {
      for (var i = 0; i < args.length; i++) {
        var error = args[i];
        if (!error || typeof error !== "object" || typeof error.message !== "string") continue;
        var detail = technicalError(error);
        var status = Number(error.status || error.statusCode);
        if (Number.isInteger(status) && status >= 400 && status <= 599) detail.estado = status;
        record(classify(error.message), "Consola del panel", detail);
        break;
      }
    } catch (ignored) { /* Nunca impedir el comportamiento normal de la consola. */ }
    return originalConsoleError.apply(console, args);
  };
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
      if ([401, 403, 409, 422, 429].indexOf(response.status) >= 0 || response.status >= 500) record(response.status === 401 || response.status === 403 ? "acceso" : response.status === 429 ? "limite" : response.status === 409 || response.status === 422 ? "conflicto" : "conexion", "Solicitud de red", { estado: response.status, servicio: service(args[0]) });
      return response;
    }, function (error) { var detail = technicalError(error); detail.servicio = service(args[0]); record("conexion", "Solicitud de red", detail); throw error; });
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
