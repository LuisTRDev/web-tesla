/*
 * VISTA PREVIA FIEL: ver el borrador tal como lo verá una familia en el celular (lo más común) o en pantalla grande.
 * La vista previa es un iframe: al darle el ancho de un celular (390 px) la web responde con su diseño móvil de verdad.
 * Solo en pantallas anchas; en el celular la vista previa ya ocupa toda la pantalla (mobile.js).
 */
(function () {
  "use strict";
  var KEY = "tesla-preview-device";
  var box = null;
  function mode() {
    try { return localStorage.getItem(KEY) || "phone"; } catch (e) { return "phone"; }
  }
  function apply(m) {
    document.body.classList.toggle("tesla-phone", m === "phone");
    if (!box) return;
    Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) { b.setAttribute("aria-pressed", String(b.dataset.m === m)); });
  }
  function ensure() {
    var pane = document.querySelector(".SplitPane .Pane2");
    if (!pane || window.matchMedia("(max-width: 860px)").matches) {
      if (box && box.parentNode) box.parentNode.removeChild(box);
      box = null;
      return;
    }
    if (box && box.parentNode === pane) return;
    box = document.createElement("div");
    box.id = "tesla-device";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Tamaño de la vista previa");
    box.innerHTML = '<button type="button" data-m="phone">📱 Celular</button><button type="button" data-m="desk">💻 Pantalla</button>';
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      try { localStorage.setItem(KEY, b.dataset.m); } catch (err) {}
      apply(b.dataset.m);
    });
    pane.style.position = "relative";
    pane.appendChild(box);
    apply(mode());
  }
  // Decap modifica la página sin parar: se revisa a intervalos (no se reinicia el temporizador en cada cambio)
  var pending = 0;
  function soon() { if (!pending) pending = setTimeout(function () { pending = 0; ensure(); }, 200); }
  new MutationObserver(soon).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("resize", soon);
  setInterval(ensure, 1500);
  ensure();
})();
