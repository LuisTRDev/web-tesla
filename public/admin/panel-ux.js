/*
 * EXPERIENCIA DEL PANEL (capa amigable sobre Decap)
 * - Pestañas en los formularios largos (secciones.js → tabs).
 * - Confirmación antes de quitar un elemento de una lista.
 * - Barra "Tienes cambios sin publicar" + ventana "Revisar y publicar" con resumen, y pantalla de éxito.
 * - Indicador de estado en la barra superior.
 * - Botón de ejemplos de texto (secciones.js → examples).
 * - "Solo vista previa" y "Ver en la web" en el menú flotante; al enfocar un campo, se resalta en la vista previa.
 * - Ir directo a un campo desde Inicio (sessionStorage "tesla-goto").
 * Depende de panel-ui.js (TeslaFieldFinder) y de secciones.js. Si Decap cambia su estructura, solo se pierde esta capa.
 */
(function () {
  "use strict";
  var T = window.TESLA;
  var F = function () { return window.TeslaFieldFinder || {}; };
  if (!T) return;

  /* ───────── utilidades ───────── */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function norm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
  function pane() { return $('[class*="ControlPaneContainer"]:not([class*="PreviewPaneContainer"])') || $('[class*="ControlPaneContainer"]'); }
  function cleanLabel(s) { return norm(s).toLowerCase().replace(/(\s*\((opcional|si quieres)\))+$/, ""); }
  function labelOfContainer(c) {
    var l = c.querySelector(':scope > [class*="ControlTopbar"] label');
    return l ? norm(l.textContent) : "";
  }
  function appReady() { return !!$('header[class*="AppHeader"], [class*="ToolbarContainer"]'); }
  function inEntry() { return /^#\/collections\/[^/]+\/entries\//.test(location.hash) || /^#\/collections\/[^/]+\/new/.test(location.hash); }
  function entryKey() {
    var m = location.hash.match(/^#\/collections\/([^/]+)\/entries\/([^/?]+)/);
    return m ? m[1] + "/" + m[2] : "";
  }
  function el(tag, props, children) {
    var e = document.createElement(tag);
    for (var k in props || {}) {
      if (k === "text") e.textContent = props[k];
      else if (k === "html") e.innerHTML = props[k];
      else if (k === "on") for (var ev in props.on) e.addEventListener(ev, props.on[ev]);
      else e.setAttribute(k, props[k]);
    }
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function setValue(input, value) {
    var proto = input.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    var setter = Object.getOwnPropertyDescriptor(proto, "value").set;
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /* ───────── recargar sin que el navegador pregunte "¿Salir del sitio?" (ya se pidió confirmación aquí) ───────── */
  var leaving = false;
  window.addEventListener("beforeunload", function (e) { if (leaving) { e.stopImmediatePropagation(); } }, true);
  function reloadWithoutAsking() {
    leaving = true;
    window.onbeforeunload = null;
    window.location.reload();
  }

  /* ───────── ventanas (modales) ───────── */
  var modal = null;
  function closeModal() {
    if (modal) modal.remove();
    modal = null;
  }
  function openModal(opts) {
    closeModal();
    var actions = el("div", { class: "tesla-modal-actions" }, (opts.buttons || []).map(function (b) {
      return el("button", { type: "button", class: "tesla-btn " + (b.kind || ""), text: b.text, on: { click: function () { if (b.close !== false) closeModal(); if (b.run) b.run(); } } });
    }));
    var box = el("div", { class: "tesla-modal-box", role: "dialog", "aria-modal": "true", "aria-label": opts.title }, [
      opts.icon ? el("div", { class: "tesla-modal-icon", text: opts.icon }) : null,
      el("h2", { text: opts.title }),
      opts.body ? el("div", { class: "tesla-modal-body", html: opts.body }) : null,
      actions,
    ]);
    modal = el("div", { class: "tesla-modal", on: { click: function (e) { if (e.target === modal && opts.dismissable !== false) closeModal(); } } }, [box]);
    document.body.appendChild(modal);
    var first = box.querySelector("button");
    if (first) first.focus();
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal) closeModal(); });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ───────── pestañas en formularios largos ───────── */
  var activeTab = {};
  function topContainers(p) {
    return $$('[class*="ControlContainer"]', p).filter(function (c) { return !c.parentElement.closest('[class*="ControlContainer"]'); });
  }
  function tabIndexFor(def, label) {
    var l = cleanLabel(label);
    for (var i = 0; i < def.length; i++) {
      for (var j = 0; j < def[i].fields.length; j++) if (cleanLabel(def[i].fields[j]) === l) return i;
    }
    return 0;
  }
  function applyTabs() {
    var key = entryKey();
    var def = T.tabs[key];
    var p = pane();
    var old = $("#tesla-tabs");
    if (!def || !p) { if (old) old.remove(); return; }
    var tops = topContainers(p);
    if (!tops.length) return;
    var current = activeTab[key];
    if (current === undefined) { try { current = Number(sessionStorage.getItem("tesla-tab-" + key)) || 0; } catch (e) { current = 0; } activeTab[key] = current; }
    var holder = tops[0].parentElement;
    var bar = $("#tesla-tabs");
    if (!bar || bar.parentElement !== holder || bar.getAttribute("data-key") !== key) {
      if (bar) bar.remove();
      bar = el("div", { id: "tesla-tabs", "data-key": key, role: "tablist" });
      def.forEach(function (tab, i) {
        bar.appendChild(el("button", { type: "button", class: "tesla-tab", role: "tab", "data-i": String(i), text: tab.icon + "  " + tab.label, on: { click: function () { showTab(key, i); } } }));
      });
      var crumbs = $("#tesla-crumbs");
      holder.insertBefore(bar, crumbs && crumbs.parentElement === holder ? crumbs.nextSibling : holder.firstChild);
    }
    tops.forEach(function (c) {
      var idx = tabIndexFor(def, labelOfContainer(c));
      c.setAttribute("data-tesla-tab", String(idx));
      if (idx === current) c.removeAttribute("data-tesla-hidden");
      else c.setAttribute("data-tesla-hidden", "1");
    });
    $$(".tesla-tab", bar).forEach(function (b) { b.setAttribute("aria-selected", Number(b.getAttribute("data-i")) === current ? "true" : "false"); });
  }
  function showTab(key, i) {
    activeTab[key] = i;
    try { sessionStorage.setItem("tesla-tab-" + key, String(i)); } catch (e) {}
    applyTabs();
    var p = pane();
    if (p && p.scrollTo) p.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.TeslaTabs = {
    /** Muestra la pestaña que contiene este campo (lo llama panel-ui antes de desplazarse). */
    reveal: function (container) {
      var top = container;
      while (top.parentElement && top.parentElement.closest('[class*="ControlContainer"]')) top = top.parentElement.closest('[class*="ControlContainer"]');
      var idx = top.getAttribute && top.getAttribute("data-tesla-tab");
      var key = entryKey();
      if (idx !== null && idx !== undefined && Number(idx) !== activeTab[key]) showTab(key, Number(idx));
    },
  };

  /* ───────── quitar elementos de una lista: pedir confirmación ───────── */
  function itemTitle(item) {
    var label = item && item.querySelector('[class*="NestedObjectLabel"]');
    var t = label && norm(label.textContent);
    if (!t) { var input = item && item.querySelector("input[type=text], textarea"); t = input ? norm(input.value).slice(0, 50) : ""; }
    return t || "este elemento";
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest('[class*="StyledListItemTopBar"] button');
    if (!btn) return;
    var all = $$("button", btn.parentElement);
    var isDelete = all[all.length - 1] === btn && all.length > 1;
    if (!isDelete) return;
    if (btn.__teslaOk) { btn.__teslaOk = false; return; }
    e.preventDefault();
    e.stopImmediatePropagation();
    var item = btn.closest('[class*="SortableListItem"]');
    openModal({
      icon: "🗑️",
      title: "¿Quitar “" + itemTitle(item) + "”?",
      body: "<p>Se quitará de la lista. <strong>Nada cambia en la web hasta que publiques.</strong> Si te equivocas, puedes salir sin publicar para recuperarlo.</p>",
      buttons: [
        { text: "No, conservar", kind: "ghost" },
        { text: "Sí, quitar", kind: "danger", run: function () { btn.__teslaOk = true; btn.click(); } },
      ],
    });
  }, true);

  /* ───────── etiquetas de ayuda en los botones de las listas ───────── */
  function decorate() {
    $$('[class*="StyledListItemTopBar"]').forEach(function (bar) {
      var buttons = $$("button", bar);
      if (buttons.length > 1) {
        if (!buttons[0].title) { buttons[0].title = "Abrir o cerrar"; buttons[0].setAttribute("aria-label", "Abrir o cerrar este elemento"); }
        var last = buttons[buttons.length - 1];
        if (!last.title) { last.title = "Quitar este elemento"; last.setAttribute("aria-label", "Quitar este elemento"); }
      }
    });
  }

  /* ───────── ejemplos de texto con un clic ───────── */
  function addExamples() {
    var p = pane();
    if (!p) return;
    $$('[class*="ControlContainer"]', p).forEach(function (c) {
      if (c.querySelector(":scope > .tesla-ex")) return;
      var ex = T.examples[labelOfContainer(c).replace(/\s*\((opcional|si quieres)\)+$/i, "")];
      var input = c.querySelector(":scope input[type=text], :scope textarea");
      if (!ex || !input || c.querySelector('[class*="ListItem"]')) return;
      var wrap = el("div", { class: "tesla-ex" }, [
        el("button", { type: "button", class: "tesla-ex-toggle", text: "💡 Ver ejemplos" }),
        el("div", { class: "tesla-ex-list", hidden: "hidden" }, ex.map(function (text) {
          return el("button", { type: "button", class: "tesla-ex-item", text: text, title: "Usar este texto", on: { click: function () { setValue(input, text); input.focus(); } } });
        })),
      ]);
      wrap.firstChild.addEventListener("click", function () {
        var list = wrap.lastChild;
        if (list.hasAttribute("hidden")) list.removeAttribute("hidden"); else list.setAttribute("hidden", "hidden");
      });
      c.appendChild(wrap);
    });
  }

  /* ───────── cambios sin publicar ───────── */
  var snap = new WeakMap();
  var wasDirty = false;
  var publishing = false;
  var discarding = false;
  var dirtyHash = "";
  function isDirty() { return !!$('[class*="BackStatusChanged"]'); }
  function inputs() { var p = pane(); return p ? $$("input[type=text], input[type=number], textarea", p) : []; }
  function fieldLabel(input) {
    var c = input.closest('[class*="ControlContainer"]');
    var l = c ? labelOfContainer(c) : "";
    return l.replace(/\s*\((opcional|si quieres)\)+$/i, "") || "un campo";
  }
  function takeSnapshot(force) {
    inputs().forEach(function (i) { if (force || !snap.has(i)) snap.set(i, i.value); });
  }
  function changes() {
    var out = [];
    var seen = {};
    inputs().forEach(function (i) {
      if (!snap.has(i) || snap.get(i) === i.value) return;
      var l = fieldLabel(i);
      var item = i.closest('[class*="SortableListItem"]');
      var name = item ? itemTitle(item) : "";
      var text = name && name !== "este elemento" && name.toLowerCase() !== l.toLowerCase() ? l + " (" + name + ")" : l;
      var placeholder = /\[[^\]]*[A-ZÁÉÍÓÚÑ]{3,}[^\]]*\]/.test(i.value);
      if (!seen[text]) { seen[text] = true; out.push({ text: text, placeholder: placeholder }); }
    });
    return out;
  }
  function publishNow() {
    var spans = $$('[class*="ToolbarContainer"] span, [class*="ToolbarContainer"] button');
    var open = spans.filter(function (s) { return /^Publicar$/.test(norm(s.textContent)); })[0];
    if (!open) return false;
    publishing = true;
    open.click();
    // el menú de Decap tarda en aparecer (más en celulares lentos): se espera hasta 3 s en vez de rendirse a los 350 ms
    var tries = 0;
    var timer = setInterval(function () {
      var item = $$("[role=menuitem], li, span, button").filter(function (s) { return /^Publicar ahora$/i.test(norm(s.textContent)) && s.offsetParent !== null; }).pop();
      if (item) { clearInterval(timer); item.click(); }
      else if (++tries > 12) {
        clearInterval(timer);
        publishing = false;
        openModal({ icon: "⚠️", title: "No se pudo abrir el menú de publicar", body: "<p>Toca el botón <strong>Publicar</strong> de arriba y luego <strong>Publicar ahora</strong>.</p>", buttons: [{ text: "Entendido", kind: "primary" }] });
      }
    }, 250);
    return true;
  }
  function reviewAndPublish() {
    if (window.TeslaGuide && window.TeslaGuide.isPractice()) return window.TeslaGuide.practiceNotice();
    var list = changes();
    var warn = list.filter(function (c) { return c.placeholder; });
    var body = "<p>Esto es lo que vas a cambiar en la web:</p>";
    body += list.length
      ? '<ul class="tesla-changes">' + list.slice(0, 12).map(function (c) { return "<li>✏️ " + esc(c.text) + "</li>"; }).join("") + (list.length > 12 ? "<li>… y " + (list.length - 12) + " más</li>" : "") + "</ul>"
      : "<p><strong>Cambiaste fotos u otras opciones</strong> (no solo textos).</p>";
    if (warn.length) body += '<div class="tesla-warn">⚠️ ' + (warn.length === 1 ? "Este campo todavía dice <strong>[PENDIENTE]</strong>: " : "Estos campos todavía dicen <strong>[PENDIENTE]</strong>: ") + warn.map(function (w) { return esc(w.text); }).join(", ") + ". Puedes publicar igual, pero las familias lo verán.</div>";
    body += "<p class=\"tesla-note\">Los cambios aparecen en la web en <strong>1 o 2 minutos</strong>. Mientras no publiques, nadie los ve.</p>";
    openModal({
      icon: "🚀",
      title: "Revisar y publicar",
      body: body,
      buttons: [
        { text: "Seguir editando", kind: "ghost" },
        { text: "Publicar ahora", kind: "primary", run: function () { if (!publishNow()) openModal({ icon: "⚠️", title: "No se pudo publicar", body: "<p>No encontré el botón de publicar de esta pantalla. Usa el botón <strong>Publicar</strong> de arriba a la izquierda.</p>", buttons: [{ text: "Entendido", kind: "primary" }] }); } },
      ],
    });
  }
  function discard() {
    openModal({
      icon: "↩️",
      title: "¿Descartar los cambios?",
      body: "<p>Se perderá lo que escribiste desde la última vez que publicaste. <strong>La web no cambia.</strong></p>",
      buttons: [
        { text: "No, seguir editando", kind: "ghost" },
        { text: "Sí, descartar", kind: "danger", run: function () { discarding = true; reloadWithoutAsking(); } },
      ],
    });
  }
  function webUrl() { return T.entryWeb[entryKey()] || T.entryWeb[(location.hash.match(/^#\/collections\/([^/]+)/) || [])[1]] || "/"; }
  function showSuccess() {
    var url = webUrl();
    openModal({
      icon: "🎉",
      title: "¡Publicado!",
      body: '<p>Tus cambios ya se enviaron. Estarán en la web en <strong>1 o 2 minutos</strong>.</p><div class="tesla-progress"><span></span></div><p class="tesla-note" id="tesla-wait">Publicando en la web…</p>',
      buttons: [
        { text: "Seguir editando", kind: "ghost" },
        { text: "Ir al inicio", kind: "ghost", run: function () { window.location.hash = "#/page/inicio"; } },
        { text: "Ver mi web ↗", kind: "primary", run: function () { window.open(url, "_blank", "noopener"); } },
      ],
    });
    var bar = $(".tesla-progress span");
    if (bar) { bar.style.transition = "width 90s linear"; setTimeout(function () { bar.style.width = "100%"; }, 50); }
    setTimeout(function () { var w = $("#tesla-wait"); if (w) w.textContent = "Ya debería estar en línea. Recarga tu web con Ctrl + F5."; }, 90000);
  }
  function showError() {
    publishing = false;
    openModal({
      icon: "😟",
      title: "No se pudo publicar",
      body: "<p>Revisa tu conexión a internet y vuelve a intentarlo. <strong>No perdiste lo que escribiste.</strong> Si sigue igual, pide ayuda.</p>",
      buttons: [
        { text: "Pedir ayuda", kind: "ghost", run: function () { window.location.hash = "#/page/ayuda"; } },
        { text: "Intentar de nuevo", kind: "primary", run: reviewAndPublish },
      ],
    });
  }

  /* ───────── barra inferior e indicador de estado ───────── */
  var bar = null;
  var chip = null;
  function ensureBar() {
    if (!bar) {
      bar = el("div", { id: "tesla-bar", role: "status" }, [
        el("span", { class: "tesla-bar-text", text: "✏️ Tienes cambios sin publicar" }),
        el("button", { type: "button", class: "tesla-btn ghost-dark when-dirty", text: "Descartar", on: { click: discard } }),
        el("button", { type: "button", class: "tesla-btn primary when-dirty", text: "Revisar y publicar", on: { click: reviewAndPublish } }),
        el("button", { type: "button", class: "tesla-btn ghost-dark when-clean", text: "Ver mi web ↗", title: "Abrir esta página en la web real", on: { click: function () { window.open(webUrl(), "_blank", "noopener"); } } }),
      ]);
      document.body.appendChild(bar);
    }
    return bar;
  }
  function ensureChip() {
    // El indicador vive en la barra de herramientas del formulario (antes del avatar).
    var meta = $('[class*="ToolbarSectionMeta"]');
    if (!meta) { if (chip) chip.style.display = "none"; return; }
    if (!chip || chip.parentElement !== meta) {
      if (chip) chip.remove();
      chip = el("button", { type: "button", id: "tesla-chip", class: "tesla-chip", on: { click: function () { if (isDirty()) reviewAndPublish(); } } });
      meta.insertBefore(chip, meta.firstChild);
    }
    chip.style.display = inEntry() ? "inline-flex" : "none";
    var dirty = isDirty();
    chip.className = "tesla-chip " + (dirty ? "dirty" : "clean");
    chip.textContent = dirty ? "● Cambios sin publicar" : "● Todo publicado";
    chip.title = dirty ? "Haz clic para revisar y publicar" : "No hay nada pendiente en esta pantalla";
  }

  /* ───────── menú flotante extra ───────── */
  var webBtn = null;
  var focusBtn = null;
  var homeBtn = null;
  function ensureDock() {
    var show = inEntry() && !!pane();
    if (!webBtn) {
      webBtn = el("button", { type: "button", class: "tesla-dock", style: "bottom:188px", title: "Ver esta página en la web real", "aria-label": "Ver esta página en la web real", text: "🌐", on: { click: function () { window.open(webUrl(), "_blank", "noopener"); } } });
      focusBtn = el("button", { type: "button", class: "tesla-dock", style: "bottom:132px", title: "Ver solo la vista previa (ocultar el formulario)", "aria-label": "Ver solo la vista previa", text: "🖥", on: { click: function () {
        var on = document.body.classList.toggle("tesla-focus-preview");
        focusBtn.textContent = on ? "✏️" : "🖥";
        focusBtn.title = on ? "Volver al formulario" : "Ver solo la vista previa (ocultar el formulario)";
      } } });
      homeBtn = el("button", { type: "button", class: "tesla-dock", style: "bottom:244px", title: "Ir al inicio del panel", "aria-label": "Ir al inicio del panel", text: "🏠", on: { click: function () { window.location.hash = "#/page/inicio"; } } });
      document.body.appendChild(webBtn);
      document.body.appendChild(focusBtn);
      document.body.appendChild(homeBtn);
    }
    webBtn.style.display = show ? "block" : "none";
    focusBtn.style.display = show ? "block" : "none";
    homeBtn.style.display = show ? "block" : "none";
    if (!show) document.body.classList.remove("tesla-focus-preview");
  }

  /* ───────── resaltar en la vista previa el campo que se edita ───────── */
  var lit = null;
  function unlight() { if (lit) { lit.style.outline = lit.__o || ""; lit.style.outlineOffset = lit.__oo || ""; lit = null; } }
  document.addEventListener("focusin", function (e) {
    var input = e.target;
    if (!input || !/^(INPUT|TEXTAREA)$/.test(input.tagName) || !input.closest('[class*="ControlPaneContainer"]')) return;
    var value = norm(input.value);
    unlight();
    if (value.length < 2) return;
    var frame = $$("iframe").filter(function (f) { try { return f.contentDocument && /Vista previa/.test(f.contentDocument.body.textContent); } catch (err) { return false; } })[0];
    if (!frame) return;
    var doc = frame.contentDocument;
    var all = $$("*", doc.body).filter(function (n) { return n.children.length === 0 || Array.prototype.some.call(n.childNodes, function (c) { return c.nodeType === 3 && norm(c.textContent); }); });
    var target = all.filter(function (n) { return norm(n.textContent).replace(/^[“"]|[”"]$/g, "") === value; })[0];
    if (!target) return;
    lit = target;
    target.__o = target.style.outline;
    target.__oo = target.style.outlineOffset;
    target.style.outline = "3px solid #FFB627";
    target.style.outlineOffset = "4px";
    if (target.scrollIntoView) target.scrollIntoView({ block: "center", behavior: "smooth" });
  });
  document.addEventListener("focusout", function () { setTimeout(unlight, 2500); });

  /* ───────── ir directo a un campo (viene de Inicio) ───────── */
  var gotoTries = 0;
  function maybeGoto() {
    var raw = null;
    try { raw = sessionStorage.getItem("tesla-goto"); } catch (e) {}
    if (!raw || !inEntry()) { gotoTries = 0; return; }
    var goal;
    try { goal = JSON.parse(raw); } catch (e) { sessionStorage.removeItem("tesla-goto"); return; }
    if (!goal || location.hash.indexOf(goal.to) < 0) return;
    if (!goal.field) { try { sessionStorage.removeItem("tesla-goto"); } catch (e) {} return; }
    gotoTries++;
    var find = F().resolvePath;
    var c = find && find(goal.field);
    if (c) {
      try { sessionStorage.removeItem("tesla-goto"); } catch (e) {}
      gotoTries = 0;
      setTimeout(function () { F().goTo(c); }, 250);
    } else if (gotoTries > 40) {
      try { sessionStorage.removeItem("tesla-goto"); } catch (e) {}
      gotoTries = 0;
    }
  }

  /* ───────── ciclo principal ───────── */
  var scheduled = false;
  function tick() {
    scheduled = false;
    if (!appReady()) return;
    var dirty = isDirty();
    if (inEntry() && pane()) {
      applyTabs();
      decorate();
      addExamples();
      if (!dirty) takeSnapshot(wasDirty);
      else takeSnapshot(false);
    } else {
      var old = $("#tesla-tabs");
      if (old) old.remove();
    }
    var search = $('input[placeholder="Buscar todas"]');
    if (search) search.placeholder = "Buscar en toda la web";
    ensureChip();
    ensureDock();
    var b = ensureBar();
    b.classList.toggle("show", inEntry());
    b.classList.toggle("is-clean", !dirty);
    var label = b.querySelector(".tesla-bar-text");
    var isNew = /^#\/collections\/[^/]+\/new/.test(location.hash);
    var text = dirty ? "✏️ Tienes cambios sin publicar" : isNew ? "📝 Entrada nueva: se publica al terminar" : "✓ Todo publicado · nada pendiente";
    if (label && label.textContent !== text) label.textContent = text;
    if (dirty) dirtyHash = location.hash;
    if (wasDirty && !dirty && inEntry() && !discarding && dirtyHash === location.hash) {
      publishing = false;
      showSuccess();
    }
    if (publishing && $(".Toastify__toast--error")) {
      // faltan campos obligatorios: no es un problema de internet; panel-errors.js muestra qué falta
      if ($('[class*="ControlErrorsList"]')) publishing = false;
      else showError();
    }
    wasDirty = dirty;
    maybeGoto();
  }
  new MutationObserver(function () {
    if (scheduled) return;
    scheduled = true;
    setTimeout(tick, 200);
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  window.addEventListener("hashchange", function () { activeTab = {}; setTimeout(tick, 300); });
  window.TeslaUX = { openModal: openModal, closeModal: closeModal, reviewAndPublish: reviewAndPublish, isDirty: isDirty, reloadWithoutAsking: reloadWithoutAsking };
  setInterval(tick, 1500);
})();
