/*
 * PANEL EN EL CELULAR: botón flotante para alternar entre editar y ver la vista previa (ver mobile.css).
 * Solo aparece cuando hay un formulario con vista previa abierto y la pantalla es angosta.
 */
(function () {
  "use strict";
  var NARROW = window.matchMedia("(max-width: 860px)");
  var fab = null;

  function ensureFab() {
    if (fab) return fab;
    fab = document.createElement("button");
    fab.id = "tesla-prev-fab";
    fab.type = "button";
    fab.addEventListener("click", function () {
      document.body.classList.toggle("tesla-previewing");
      refreshLabel();
      window.scrollTo({ top: 0 });
    });
    document.body.appendChild(fab);
    return fab;
  }
  function refreshLabel() {
    if (!fab) return;
    var on = document.body.classList.contains("tesla-previewing");
    fab.textContent = on ? "✏️ Volver a editar" : "👁 Ver cómo queda";
    fab.setAttribute("aria-pressed", on ? "true" : "false");
  }
  /* ───────── barra inferior con los 4 accesos de siempre, al alcance del pulgar ───────── */
  var tabs = null;
  var ITEMS = [
    ["🏠", "Inicio", "#/page/inicio"],
    ["📰", "Noticia", "#/collections/noticias/new"],
    ["📣", "Campaña", "#/page/campana"],
    ["📂", "Contenido", "#/collections/colegio"],
  ];
  function ensureTabs() {
    if (!tabs) {
      tabs = document.createElement("nav");
      tabs.id = "tesla-tabbar";
      tabs.setAttribute("aria-label", "Accesos principales");
      tabs.innerHTML = ITEMS.map(function (i) { return '<a href="' + i[2] + '"><span aria-hidden="true">' + i[0] + "</span>" + i[1] + "</a>"; }).join("");
      document.body.appendChild(tabs);
    }
    var hash = location.hash || "#/";
    Array.prototype.forEach.call(tabs.querySelectorAll("a"), function (a) {
      var key = a.getAttribute("href");
      var on = key === hash || (key === "#/collections/colegio" && /^#\/(collections\/(?!noticias\/new)|$)/.test(hash) && hash !== "#/page/inicio");
      a.classList.toggle("on", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    tabs.hidden = !NARROW.matches;
  }
  /** Alto de la barra del editor: las migas y pestañas se pegan debajo de ella. */
  function measure() {
    var bar = document.querySelector('[class*="ToolbarContainer"]');
    document.documentElement.style.setProperty("--tesla-toolbar-h", (bar ? bar.offsetHeight : 0) + "px");
  }
  function update() {
    watchBar();
    measure();
    ensureTabs();
    var inEditor = !!document.querySelector(".SplitPane .Pane2") && NARROW.matches;
    if (!inEditor) {
      document.body.classList.remove("tesla-previewing");
      if (fab) fab.classList.remove("on");
      return;
    }
    ensureFab().classList.add("on");
    refreshLabel();
  }

  /* la barra del editor cambia de alto (pasa a dos filas, aparecen avisos): se vuelve a medir sola */
  var watched = null;
  var ro = window.ResizeObserver ? new ResizeObserver(measure) : null;
  function watchBar() {
    var bar = document.querySelector('[class*="ToolbarContainer"]');
    if (ro && bar !== watched) {
      if (watched) ro.unobserve(watched);
      watched = bar;
      if (bar) ro.observe(bar);
    }
  }
  // Decap modifica la página sin parar: se revisa a intervalos (no se reinicia el temporizador en cada cambio)
  var timer = 0;
  new MutationObserver(function () {
    if (!timer) timer = setTimeout(function () { timer = 0; update(); }, 150);
  }).observe(document.body, { childList: true, subtree: true });
  setInterval(update, 1500);
  window.addEventListener("hashchange", function () {
    document.body.classList.remove("tesla-previewing");
    update();
  });
  if (NARROW.addEventListener) NARROW.addEventListener("change", update);
  update();
})();
