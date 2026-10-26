/*
 * RECORRIDO DE BIENVENIDA
 * Se muestra la primera vez que se entra al panel (y se puede repetir desde Ayuda).
 * Cinco pantallas cortas que explican las partes del panel. Se recuerda en este navegador.
 */
(function () {
  "use strict";
  var KEY = "tesla-recorrido-v1";
  var STEPS = [
    { icon: "👋", title: "¡Bienvenida al panel!", text: "Desde aquí cambias los textos, las fotos y los datos de la web del colegio, sin saber de programación. Te mostramos lo básico en 1 minuto." },
    { icon: "🗂️", title: "Tus secciones", text: "A la izquierda está la lista: Datos del colegio, Nosotros, Propuesta, Admisión, Galería, Noticias… Elige una y verás sus campos para editar." },
    { icon: "👀", title: "Escribe y mira cómo queda", text: "A la derecha ves una vista previa que se actualiza mientras escribes. <strong>Haz clic en cualquier texto o foto de la vista previa</strong> y el formulario te lleva a su campo. Con “📱 Ver en celular” compruebas cómo se verá en un teléfono." },
    { icon: "🚀", title: "Publicar", text: "Cuando termines, pulsa Publicar → “Publicar ahora”. Los cambios aparecen en la web en 1 o 2 minutos. Mientras no publiques, nada cambia en la web." },
    { icon: "🎓", title: "Siempre tienes ayuda", text: "Dentro de cualquier formulario, <strong>“❓ Ayuda”</strong> abre el tutorial de esa pantalla a un lado, sin que pierdas lo que escribes, y <strong>“🧭 Guía”</strong> te explica sus partes. Si quieres probar sin miedo, usa el <strong>modo práctica</strong> (en “⋯”): nada se publica. En “Inicio” ves qué falta para la campaña." },
  ];

  var root = null;
  var index = 0;

  function seen() {
    try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function markSeen() {
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
  }
  function close() {
    markSeen();
    if (root) root.remove();
    root = null;
  }
  function render() {
    var step = STEPS[index];
    var last = index === STEPS.length - 1;
    var dots = STEPS.map(function (_, i) {
      return '<span style="width:' + (i === index ? 22 : 8) + "px;height:8px;border-radius:99px;background:" + (i === index ? "#FFB627" : "rgba(13,18,48,.2)") + ';transition:width .2s"></span>';
    }).join("");
    root.innerHTML =
      '<div role="dialog" aria-modal="true" aria-label="Recorrido de bienvenida" style="background:#fff;border-radius:28px;max-width:460px;width:calc(100% - 32px);padding:32px 28px 24px;box-shadow:0 30px 80px -20px rgba(13,18,48,.6);font-family:Figtree,Arial,sans-serif;color:#1B2040">' +
      '<div style="font-size:48px;line-height:1">' + step.icon + "</div>" +
      '<h2 style="font:800 28px/1.05 \'Bricolage Grotesque\',Figtree,sans-serif;color:#0D1230;margin:16px 0 10px;letter-spacing:-.02em">' + step.title + "</h2>" +
      '<p style="margin:0;font-size:16.5px;line-height:1.55;color:#464c6b">' + step.text + "</p>" +
      '<div style="display:flex;gap:6px;margin:22px 0 18px">' + dots + "</div>" +
      '<div style="display:flex;gap:10px;justify-content:space-between;align-items:center">' +
      '<button data-skip style="border:0;background:none;color:#646B8C;font:600 14.5px Figtree,Arial,sans-serif;cursor:pointer;padding:10px 4px">' + (last ? "" : "Saltar") + "</button>" +
      '<div style="display:flex;gap:8px">' +
      (index > 0 ? '<button data-prev style="border:1px solid rgba(13,18,48,.25);background:#fff;color:#0D1230;border-radius:99px;padding:0 18px;min-height:44px;font:600 15px Figtree,Arial,sans-serif;cursor:pointer">Atrás</button>' : "") +
      '<button data-next style="border:0;background:' + (last ? "#FFB627;color:#0D1230" : "#0D1230;color:#fff") + ';border-radius:99px;padding:0 22px;min-height:44px;font:700 15px Figtree,Arial,sans-serif;cursor:pointer">' + (last ? "Empezar" : "Siguiente") + "</button>" +
      "</div></div></div>";
    root.querySelector("[data-next]").onclick = function () { if (last) close(); else { index++; render(); } };
    var prev = root.querySelector("[data-prev]");
    if (prev) prev.onclick = function () { index--; render(); };
    var skip = root.querySelector("[data-skip]");
    if (skip) skip.onclick = close;
  }
  function start() {
    if (root) return;
    index = 0;
    root = document.createElement("div");
    root.style.cssText = "position:fixed;inset:0;z-index:999999;background:rgba(13,18,48,.62);display:flex;align-items:center;justify-content:center";
    root.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    document.body.appendChild(root);
    render();
    var btn = root.querySelector("[data-next]");
    if (btn) btn.focus();
  }
  window.TeslaTour = { start: start, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };

  // Primera vez: esperar a que el panel esté abierto (sesión iniciada).
  var timer = setInterval(function () {
    if (seen()) return clearInterval(timer);
    if (document.querySelector('header[class*="AppHeader"]')) {
      clearInterval(timer);
      setTimeout(start, 900);
    }
  }, 600);
})();
