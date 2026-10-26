/*
 * MEJORAS DE USO DEL PANEL
 * - Menú propio: Inicio, Campaña (QR y enlaces), Resultados, Ayuda y "Ver la web".
 * - Al entrar, abre Inicio (con la lista de pendientes) en vez de la lista de colecciones.
 * - Campo "descripción para Google": contador de caracteres y vista previa de cómo se verá en Google.
 * - Botón flotante de ayuda que abre el tutorial de la sección en la que se está.
 * - Selector de vista móvil / escritorio para la vista previa.
 */
(function () {
  "use strict";
  var CMS = window.CMS;
  var h = window.h;
  var createClass = window.createClass;
  if (!CMS || !h) return;

  /* ───────── menú propio (páginas dentro del panel) ─────────
   * Decap no permite añadir páginas propias, así que se agregan enlaces a la barra superior y, al elegir uno,
   * se muestra la página a pantalla completa (bajo la barra) dentro de un iframe. */
  var PAGES = {
    inicio: { title: "Inicio", src: "/admin/inicio.html" },
    campana: { title: "Campaña y QR", src: "/admin/campana.html" },
    resultados: { title: "Resultados", src: "/admin/resultados.html" },
    ayuda: { title: "Ayuda", src: "/admin/ayuda.html" },
  };
  var overlay = null;
  var currentKey = "";
  /** Secciones del menú izquierdo que tienen portada propia (tarjetas) en lugar de la lista vacía de Decap. */
  var HUBS = ["colegio", "paginas", "nosotros", "propuesta", "admision", "galeria"];

  function pageFromHash() {
    var m = window.location.hash.match(/^#\/page\/([a-z]+)/);
    return m && PAGES[m[1]] ? m[1] : "";
  }
  function hubFromHash() {
    var m = window.location.hash.match(/^#\/collections\/([a-z]+)\/?$/);
    return m && HUBS.indexOf(m[1]) >= 0 ? m[1] : "";
  }
  function headerEl() {
    return document.querySelector('header[class*="AppHeader"]');
  }
  function hideOverlay() {
    if (overlay) overlay.style.display = "none";
    currentKey = "";
  }
  function showPage() {
    var id = pageFromHash();
    var hub = id ? "" : hubFromHash();
    var header = headerEl();
    if ((!id && !hub) || !header) {
      hideOverlay();
      markNav("");
      return;
    }
    var top = header.getBoundingClientRect().bottom;
    var css;
    if (hub) {
      // Cubre solo la zona principal de Decap; el menú de secciones de la izquierda queda visible.
      var main = document.querySelector('[class*="CollectionMain"]');
      if (!main) { hideOverlay(); return; }
      var r = main.getBoundingClientRect();
      // <main> ocupa todo el ancho (el menú de secciones flota dentro): se empieza a la derecha del menú.
      var side = document.querySelector('aside[class*="SidebarContainer"]');
      var left = side ? side.getBoundingClientRect().right + 20 : r.left;
      css = "position:fixed;z-index:900;background:#EEF0F7;overflow:hidden;left:" + left + "px;right:16px;top:" + r.top + "px;bottom:0;border-radius:20px 20px 0 0";
    } else {
      css = "position:fixed;left:0;right:0;bottom:0;z-index:1000;background:#EEF0F7;top:" + top + "px";
    }
    if (!overlay) {
      overlay = document.createElement("div");
      document.body.appendChild(overlay);
    }
    overlay.style.cssText = css;
    overlay.style.display = "block";
    var key = id ? "page:" + id : "hub:" + hub;
    if (currentKey !== key) {
      overlay.innerHTML = '<iframe style="width:100%;height:100%;border:0;display:block" title=""></iframe>';
      var frame = overlay.firstChild;
      frame.title = id ? PAGES[id].title : "Sección " + hub;
      frame.src = id ? PAGES[id].src : "/admin/seccion.html#" + hub;
      currentKey = key;
    }
    markNav(id);
  }
  function markNav(id) {
    document.querySelectorAll("[data-tesla-nav]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-tesla-nav") === id);
    });
  }
  function ensureNav() {
    var header = headerEl();
    if (!header || header.querySelector("[data-tesla-nav]")) return;
    var model = header.querySelector('a[class*="AppHeaderNavLink"]');
    if (!model) return;
    var list = model.parentElement;
    var parent = list && list.tagName === "LI" ? list.parentElement : model.parentElement;
    function add(id, label, href, newTab) {
      var a = model.cloneNode(false);
      a.className = model.className.replace(/\bactive\b/g, "").trim();
      a.setAttribute("data-tesla-nav", id);
      a.href = href;
      a.removeAttribute("aria-current");
      a.textContent = label;
      if (newTab) { a.target = "_blank"; a.rel = "noopener"; }
      else a.addEventListener("click", function (e) { e.preventDefault(); window.location.hash = href.charAt(0) === "#" ? href : "#/page/" + id; });
      var holder = list && list.tagName === "LI" ? list.cloneNode(false) : null;
      if (holder) { holder.appendChild(a); parent.appendChild(holder); } else parent.appendChild(a);
    }
    add("inicio", "Inicio", "#/page/inicio");
    add("noticia", "Nueva noticia", "#/collections/noticias/new");
    add("campana", "Campaña y QR", "#/page/campana");
    add("resultados", "Resultados", "#/page/resultados");
    add("ayuda", "Ayuda", "#/page/ayuda");
    add("web", "Ver la web", "/", true);
    markNav(pageFromHash());
  }

  /* ───────── campo de descripción para Google ───────── */
  var site = null;
  fetch("/admin/api/site").then(function (r) { return r.json(); }).then(function (s) { site = s; }).catch(function () {});

  if (createClass) {
    var SeoControl = createClass({
      handleChange: function (event) {
        this.props.onChange(event.target.value);
      },
      render: function () {
        var value = this.props.value || "";
        var len = value.length;
        var good = len >= 120 && len <= 160;
        var color = len === 0 ? "#646B8C" : good ? "#17683A" : "#B45F06";
        var message = len === 0 ? "Escribe entre 120 y 160 caracteres." : len < 120 ? "Un poco corta: " + (120 - len) + " caracteres más es ideal." : len > 160 ? "Muy larga: Google la cortará (sobran " + (len - 160) + ")." : "Longitud ideal.";
        var shown = len > 160 ? value.slice(0, 157) + "…" : value;
        var title = site ? site.name : "Nombre del colegio";
        var url = site ? site.siteUrl.replace(/^https?:\/\//, "") : "www.tudominio.com";
        return h("div", { className: this.props.classNameWrapper }, [
          h("textarea", { key: "t", id: this.props.forID, className: this.props.classNameWrapper, rows: 3, value: value, onChange: this.handleChange, style: { width: "100%", minHeight: "88px", padding: "12px 14px", fontSize: "15px", lineHeight: "1.4", resize: "vertical", boxSizing: "border-box" } }),
          h("div", { key: "c", style: { margin: "8px 2px 12px", fontSize: "13px", color: color, fontWeight: 600 } }, len + " caracteres · " + message),
          h("div", { key: "g", style: { border: "1px solid #DADCE0", borderRadius: "12px", padding: "14px 16px", background: "#fff", maxWidth: "600px", fontFamily: "Arial, sans-serif" } }, [
            h("div", { key: "l", style: { fontSize: "12px", color: "#5F6368", marginBottom: "4px" } }, "Así se verá en Google"),
            h("div", { key: "u", style: { fontSize: "12px", color: "#202124" } }, url),
            h("div", { key: "h", style: { fontSize: "19px", color: "#1A0DAB", margin: "2px 0 3px" } }, title),
            h("div", { key: "d", style: { fontSize: "14px", lineHeight: "1.5", color: "#4D5156" } }, shown || "…"),
          ]),
        ]);
      },
    });
    var SeoPreview = createClass({
      render: function () {
        return h("div", {}, this.props.value || "");
      },
    });
    CMS.registerWidget("seo-descripcion", SeoControl, SeoPreview);
  }

  /* ───────── clic en la vista previa → campo del formulario ─────────
   * Al hacer clic en un texto o foto de la vista previa, el panel desplaza el formulario hasta su campo,
   * lo resalta y lo selecciona. Los textos se enlazan solos buscando un campo con ese mismo valor;
   * las fotos y los textos compuestos llevan una marca data-field con la ruta [etiqueta, nº de elemento, …]. */
  function norm(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }
  function pane() {
    return document.querySelector('[class*="ControlPaneContainer"]') || document.body;
  }
  /** Etiqueta en minúsculas y sin el sufijo "(opcional)" que Decap añade a los campos no obligatorios. */
  function clean(text) {
    return norm(text).toLowerCase().replace(/(\s*\((opcional|si quieres)\))+$/, "");
  }
  function labelOf(container) {
    var label = container.querySelector(':scope > [class*="ControlTopbar"] label');
    return label ? clean(label.textContent) : "";
  }
  /** Elemento de lista (SortableListItem) al que pertenece un nodo, o null si es de nivel superior. */
  function itemOf(node) {
    return node.closest('[class*="SortableListItem"]');
  }
  /** Encuentra el campo "label" dentro de scope (el panel completo, un objeto o un elemento de lista). */
  function findField(scope, label) {
    var wanted = clean(label);
    var all = scope.querySelectorAll('[class*="ControlContainer"]');
    var scopeItem = scope.matches('[class*="SortableListItem"]') ? scope : itemOf(scope);
    for (var i = 0; i < all.length; i++) {
      var c = all[i];
      if (labelOf(c) !== wanted) continue;
      // el campo no debe pertenecer a un elemento de lista más profundo que el ámbito actual
      if (itemOf(c) !== scopeItem) continue;
      return c;
    }
    return null;
  }
  function resolvePath(path) {
    var scope = pane();
    var current = null;
    for (var i = 0; i < path.length; i++) {
      var seg = path[i];
      if (typeof seg === "number") {
        if (!current) return null;
        var items = Array.prototype.filter.call(current.querySelectorAll('[class*="SortableListItem"]'), function (el) {
          return itemOf(el.parentElement) === itemOf(current);
        });
        // solo los elementos directos de esta lista
        items = items.filter(function (el) { return el.parentElement.closest('[class*="ControlContainer"]') === current; });
        if (!items[seg]) return null;
        scope = items[seg];
        current = items[seg];
      } else {
        var found = findField(scope, seg);
        if (!found) return null;
        current = found;
        scope = found;
      }
    }
    return current;
  }
  function allInputs() {
    return Array.prototype.slice.call(pane().querySelectorAll('input[type="text"], input[type="number"], textarea'));
  }
  /** Campo cuyo valor coincide con el texto pulsado: primero igual, luego el más largo contenido en él. */
  function matchByText(raw, exactOnly) {
    var text = norm(raw).replace(/^[“"]|[”"]$/g, "").trim();
    if (text.length < 2) return null;
    var inputs = allInputs();
    var best = null;
    for (var i = 0; i < inputs.length; i++) {
      var v = norm(inputs[i].value);
      if (v && v === text) return inputs[i];
    }
    if (exactOnly) return null;
    var bestLen = 0;
    for (var j = 0; j < inputs.length; j++) {
      var value = norm(inputs[j].value);
      if (value.length < 6) continue;
      if (text.indexOf(value) >= 0 && value.length > bestLen) {
        best = inputs[j];
        bestLen = value.length;
      }
    }
    return best;
  }
  function reveal(container, tries) {
    if (window.TeslaTabs) window.TeslaTabs.reveal(container);
    // si el campo está dentro de un elemento de lista plegado, se despliega
    if (container.offsetParent !== null || tries <= 0) return Promise.resolve();
    var item = itemOf(container);
    if (!item) return Promise.resolve();
    var toggle = item.querySelector('[class*="TopBar"] button');
    if (toggle) toggle.click();
    return new Promise(function (resolve) {
      setTimeout(function () { reveal(container, tries - 1).then(resolve); }, 160);
    });
  }
  function flash(container) {
    container.scrollIntoView({ block: "center", behavior: "smooth" });
    var field = container.querySelector("textarea, input, button");
    if (field && typeof field.focus === "function") {
      try { field.focus({ preventScroll: true }); } catch (e) { field.focus(); }
      if (field.select && /^(text|number)$/.test(field.type || "text") && field.tagName !== "BUTTON") { try { field.select(); } catch (e) {} }
    }
    if (container.animate) {
      container.animate(
        [{ boxShadow: "0 0 0 4px #FFB627", background: "rgba(255,182,39,.18)" }, { boxShadow: "0 0 0 4px #FFB627", background: "rgba(255,182,39,.18)", offset: 0.6 }, { boxShadow: "0 0 0 0 rgba(255,182,39,0)", background: "rgba(255,182,39,0)" }],
        { duration: 2200, easing: "ease-out" }
      );
    }
  }
  function goTo(container) {
    reveal(container, 3).then(function () { flash(container); });
  }
  function onPreviewClick(event) {
    var target = event.target;
    if (!target || target.nodeType !== 1) return;
    var container = null;
    // 1) el texto del elemento pulsado es exactamente el valor de un campo
    var exact = matchByText(target.textContent, true);
    if (exact) container = exact.closest('[class*="ControlContainer"]');
    // 2) el elemento (o un ancestro) lleva la ruta de su campo: fotos y textos compuestos
    if (!container) {
      var marked = target.closest("[data-field]");
      if (marked) {
        try { container = resolvePath(JSON.parse(marked.getAttribute("data-field"))); } catch (e) {}
      }
    }
    // 3) el texto contiene el valor de un campo (el más largo)
    if (!container) {
      var node = target;
      for (var depth = 0; depth < 2 && node && !container; depth++, node = node.parentElement) {
        var partial = matchByText(node.textContent, false);
        if (partial) container = partial.closest('[class*="ControlContainer"]');
      }
    }
    if (container) {
      event.preventDefault();
      goTo(container);
    }
  }
  function hookPreview() {
    var frames = document.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) {
      var doc;
      try { doc = frames[i].contentDocument; } catch (e) { continue; }
      if (doc && doc.body && !doc.__teslaClick && /Vista previa/.test(doc.body.textContent || "")) {
        doc.__teslaClick = true;
        doc.addEventListener("click", onPreviewClick, true);
      }
    }
  }
  window.TeslaFieldFinder = { resolvePath: resolvePath, matchByText: matchByText, goTo: goTo };

  /* ───────── ir a Inicio al entrar ───────── */
  function loggedIn() {
    // En las secciones hay una barra superior (AppHeader); dentro de un formulario, Decap muestra solo su barra de herramientas.
    return !!document.querySelector('header[class*="AppHeader"], [class*="ToolbarContainer"]');
  }
  var redirected = false;
  function maybeRedirect() {
    if (redirected || !loggedIn()) return;
    redirected = true;
    var first = false;
    try {
      first = !sessionStorage.getItem("tesla-panel-inicio");
      sessionStorage.setItem("tesla-panel-inicio", "1");
    } catch (e) {}
    if (!first) return;
    // Decap abre la primera colección por su cuenta; se espera y se lleva al Inicio solo si no se pidió otra cosa.
    setTimeout(function () {
      var hash = window.location.hash;
      if (!hash || hash === "#/" || hash === "#" || /^#\/collections\/[^/]+\/?$/.test(hash)) window.location.hash = "#/page/inicio";
    }, 500);
  }

  /* ───────── ayuda contextual y vista móvil ───────── */
  var help = null;
  var toggle = null;
  function topic() {
    var m = window.location.hash.match(/collections\/([^/]+)/);
    return m ? m[1] : "";
  }
  function ensureHelp() {
    if (!loggedIn()) {
      if (help) help.style.display = "none";
      return;
    }
    if (!help) {
      help = document.createElement("button");
      help.type = "button";
      help.textContent = "? Ayuda";
      help.setAttribute("aria-label", "Abrir la ayuda de esta sección");
      help.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:99998;border:0;border-radius:999px;padding:12px 20px;background:#0D1230;color:#fff;font:700 15px Figtree,Arial,sans-serif;cursor:pointer;box-shadow:0 10px 30px -8px rgba(13,18,48,.6)";
      help.addEventListener("click", function () {
        try { sessionStorage.setItem("tesla-ayuda-tema", topic()); } catch (e) {}
        currentPage = "";
        window.location.hash = "#/page/ayuda";
        showPage();
      });
      document.body.appendChild(help);
    }
    help.style.display = window.location.hash.indexOf("/page/ayuda") >= 0 ? "none" : "block";
  }
  function ensureToggle() {
    var frame = document.querySelector('iframe[class*="PreviewPane"], [class*="PreviewPaneContainer"] iframe, [class*="PreviewContent"] iframe');
    if (!frame) {
      if (toggle) toggle.style.display = "none";
      return;
    }
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "tesla-dock";
      toggle.style.cssText = "bottom:76px";
      toggle.title = "Ver cómo se ve en celular";
      toggle.setAttribute("aria-label", "Ver cómo se ve en celular");
      toggle.addEventListener("click", function () {
        var mobile = document.body.classList.toggle("preview-mobile");
        toggle.textContent = mobile ? "💻" : "📱";
        toggle.title = mobile ? "Ver en computadora" : "Ver cómo se ve en celular";
      });
      toggle.textContent = "📱";
      document.body.appendChild(toggle);
    }
    toggle.style.display = "block";
  }

  var scheduled = false;
  new MutationObserver(function () {
    if (scheduled) return;
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      ensureNav();
      maybeRedirect();
      showPage();
      ensureHelp();
      ensureToggle();
      hookPreview();
    }, 250);
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("hashchange", function () {
    showPage();
    ensureHelp();
    ensureToggle();
  });
  window.addEventListener("resize", showPage);
})();
