/*
 * GUÍA Y ORIENTACIÓN DEL PANEL (capa amigable sobre Decap, parte 2)
 * - Barra "dónde estoy": Inicio › Sección › Formulario, botón Volver y herramientas.
 * - Índice de saltos en los formularios largos que no tienen pestañas.
 * - Listas tipo acordeón: título visible en cada elemento, solo uno abierto a la vez, plegadas al abrir la lista,
 *   y una tarjeta de ayuda cuando la lista está vacía.
 * - Contadores de caracteres y ejemplos como texto de muestra dentro de los campos.
 * - Opciones avanzadas ocultas por defecto (secciones.js → advanced).
 * - Ayuda lateral con el tutorial de la pantalla (sin salir del formulario) y guía de la pantalla paso a paso.
 * - Modo práctica: se puede escribir y probar, pero no se publica nada.
 * - Letra más grande y atajo Ctrl + S.
 * Depende de secciones.js, tutoriales.js, panel-ui.js (TeslaFieldFinder) y panel-ux.js (TeslaUX).
 * Si Decap cambia sus nombres de clase, solo se pierde esta capa.
 */
(function () {
  "use strict";
  var T = window.TESLA;
  var P = window.PANEL || {};
  if (!T) return;

  /* ───────── utilidades ───────── */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function norm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function cleanLabel(s) { return norm(s).toLowerCase().replace(/(\s*\((opcional|si quieres)\))+$/, ""); }
  function pane() { return $('[class*="ControlPaneContainer"]:not([class*="PreviewPaneContainer"])') || $('[class*="ControlPaneContainer"]'); }
  function previewPane() { return $('[class*="PreviewPaneContainer"]'); }
  function labelOfContainer(c) {
    var l = c.querySelector(':scope > [class*="ControlTopbar"] label');
    return l ? norm(l.textContent) : "";
  }
  function topContainers(p) {
    return $$('[class*="ControlContainer"]', p).filter(function (c) { return !c.parentElement.closest('[class*="ControlContainer"]'); });
  }
  function inEntry() { return /^#\/collections\/[^/]+\/entries\//.test(location.hash) || /^#\/collections\/[^/]+\/new/.test(location.hash); }
  function collection() { var m = location.hash.match(/^#\/collections\/([^/?]+)/); return m ? m[1] : ""; }
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
  function store(kind) {
    var s = kind === "session" ? "sessionStorage" : "localStorage";
    return {
      get: function (k) { try { return window[s].getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { window[s].setItem(k, v); } catch (e) {} },
      del: function (k) { try { window[s].removeItem(k); } catch (e) {} },
    };
  }
  var local = store("local");
  var session = store("session");
  function ux() { return window.TeslaUX || {}; }
  function finder() { return window.TeslaFieldFinder || {}; }
  function visible(node) { return !!node && node.offsetParent !== null && node.offsetHeight > 0; }

  /* ───────── preferencias (se recuerdan en este navegador) ───────── */
  var prefs = {
    big: local.get("tesla-big") === "1",
    adv: local.get("tesla-adv") === "1",
  };
  function applyPrefs() {
    document.body.classList.toggle("tesla-big", prefs.big);
    document.body.classList.toggle("tesla-adv-on", prefs.adv);
  }
  function practice() { return session.get("tesla-practice") === "1"; }

  /* ───────── toast breve ───────── */
  var toastTimer = null;
  function toast(text) {
    var t = $("#tesla-toast");
    if (!t) { t = el("div", { id: "tesla-toast", role: "status" }); document.body.appendChild(t); }
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }

  /* ═════════════ 1. barra "dónde estoy" ═════════════ */
  var moreOpen = false;
  function entryTitle() {
    var col = collection();
    var sec = T.sections[col];
    var m = location.hash.match(/\/entries\/([^/?]+)/);
    var name = m ? m[1] : "";
    if (/\/new/.test(location.hash)) return "Nuevo";
    if (sec) {
      var card = (sec.cards || []).filter(function (c) { return c.file === name; })[0];
      if (card) return card.title;
    }
    return decodeURIComponent(name).replace(/-/g, " ");
  }
  function goBack() {
    var col = collection();
    var go = function () { window.location.hash = "#/collections/" + col; };
    if (ux().isDirty && ux().isDirty() && !practice()) {
      ux().openModal({
        icon: "✋",
        title: "Tienes cambios sin publicar",
        body: "<p>Si sales ahora, <strong>se perderán</strong> los cambios de esta pantalla. ¿Qué prefieres?</p>",
        buttons: [
          { text: "Seguir editando", kind: "ghost" },
          { text: "Salir sin publicar", kind: "danger", run: function () { window.onbeforeunload = null; go(); } },
          { text: "Revisar y publicar", kind: "primary", run: function () { ux().reviewAndPublish(); } },
        ],
      });
      return;
    }
    go();
  }
  function advancedCount(p) {
    return $$("[data-tesla-adv]", p).filter(function (c) {
      var top = c;
      while (top.parentElement && top.parentElement.closest('[class*="ControlContainer"]')) top = top.parentElement.closest('[class*="ControlContainer"]');
      return top.getAttribute("data-tesla-hidden") !== "1";
    }).length;
  }
  function buildCrumbs(key) {
    var col = collection();
    var sec = T.sections[col] || {};
    var bar = el("div", { id: "tesla-crumbs", role: "navigation", "aria-label": "Dónde estás" });
    bar.__key = key;
    var secTitle = sec.title || col;
    var here = entryTitle();
    var trail = [
      el("a", { href: "#/page/inicio", text: "🏠", title: "Ir al inicio del panel", "aria-label": "Inicio" }),
      el("span", { class: "sep", "aria-hidden": "true", text: "›" }),
      el("a", { href: "#/collections/" + col, text: secTitle, title: "Volver a " + secTitle }),
    ];
    // si el formulario se llama igual que su sección, no se repite
    if (cleanLabel(here) !== cleanLabel(secTitle)) {
      trail.push(el("span", { class: "sep", "aria-hidden": "true", text: "›" }));
      trail.push(el("strong", { text: here }));
    }
    var left = el("div", { class: "tesla-crumbs-left" }, [
      el("button", { type: "button", class: "tesla-back", text: "← Volver", title: "Volver a la lista de esta sección", on: { click: goBack } }),
      el("nav", { class: "tesla-trail" }, trail),
    ]);
    var right = el("div", { class: "tesla-crumbs-right" }, [
      el("button", { type: "button", class: "tesla-adv-pill", id: "tesla-adv-pill", hidden: "hidden", on: { click: toggleAdvanced } }),
      el("button", { type: "button", class: "tesla-tool", text: "🧭 Guía", title: "Te muestro las partes de esta pantalla paso a paso", on: { click: function () { startCoach(true); } } }),
      el("button", { type: "button", class: "tesla-tool strong", text: "❓ Ayuda", title: "Tutorial de esta pantalla, sin salir del formulario", on: { click: function () { openHelp(); } } }),
      el("button", { type: "button", class: "tesla-tool", id: "tesla-more", text: "⋯", title: "Más opciones", "aria-haspopup": "true", on: { click: function (e) { e.stopPropagation(); toggleMore(); } } }),
    ]);
    bar.appendChild(left);
    bar.appendChild(right);
    return bar;
  }
  function toggleAdvanced() {
    prefs.adv = !prefs.adv;
    local.set("tesla-adv", prefs.adv ? "1" : "0");
    applyPrefs();
    refreshAdvPill();
  }
  function refreshAdvPill() {
    var pill = $("#tesla-adv-pill");
    var p = pane();
    if (!pill || !p) return;
    var n = advancedCount(p);
    if (!n) { pill.setAttribute("hidden", "hidden"); return; }
    pill.removeAttribute("hidden");
    pill.textContent = prefs.adv ? "⚙️ Avanzado ✓" : "⚙️ Avanzado · " + n;
    pill.title = prefs.adv ? "Ocultar las opciones avanzadas" : n + (n === 1 ? " opción avanzada oculta" : " opciones avanzadas ocultas") + " (Google, colores sueltos…). Pulsa para mostrarlas.";
    pill.classList.toggle("on", prefs.adv);
  }
  function toggleMore() {
    var menu = $("#tesla-more-menu");
    if (menu) { menu.remove(); return; }
    var btn = $("#tesla-more");
    if (!btn) return;
    menu = el("div", { id: "tesla-more-menu", role: "menu" }, [
      el("button", { type: "button", role: "menuitem", html: (prefs.big ? "✓ " : "") + "🔠 Letra más grande", on: { click: function () { prefs.big = !prefs.big; local.set("tesla-big", prefs.big ? "1" : "0"); applyPrefs(); closeMore(); } } }),
      el("button", { type: "button", role: "menuitem", html: (practice() ? "✓ " : "") + "🧪 Modo práctica (nada se publica)", on: { click: function () { closeMore(); setPractice(!practice()); } } }),
      el("button", { type: "button", role: "menuitem", html: "⌨️ Atajos del teclado", on: { click: function () { closeMore(); shortcutsInfo(); } } }),
    ]);
    document.body.appendChild(menu);
    var r = btn.getBoundingClientRect();
    menu.style.top = r.bottom + 6 + "px";
    menu.style.right = Math.max(12, window.innerWidth - r.right) + "px";
  }
  function closeMore() { var m = $("#tesla-more-menu"); if (m) m.remove(); }
  document.addEventListener("click", function (e) { if (!e.target.closest || !e.target.closest("#tesla-more-menu, #tesla-more")) closeMore(); });

  function ensureCrumbs() {
    var p = pane();
    var old = $("#tesla-crumbs");
    if (!inEntry() || !p) { if (old) old.remove(); return null; }
    var tops = topContainers(p).filter(function (c) { return !c.id || c.id.indexOf("tesla-") !== 0; });
    if (!tops.length) return old;
    var holder = tops[0].parentElement;
    var key = entryKey() || location.hash;
    if (old && old.__key !== key) { old.remove(); old = null; }
    var bar = old || buildCrumbs(key);
    if (holder.firstChild !== bar) holder.insertBefore(bar, holder.firstChild);
    return bar;
  }

  /* ═════════════ 2. índice de saltos (formularios sin pestañas) ═════════════ */
  function ensureJump(p) {
    var key = entryKey();
    var bar = $("#tesla-jump");
    var def = T.tabs[key];
    var tops = topContainers(p).filter(function (c) { return c.getAttribute("data-tesla-hidden") !== "1" && !c.hasAttribute("data-tesla-adv") && visible(c); });
    if (def || tops.length < 4 || !inEntry()) { if (bar) bar.remove(); return; }
    var sig = key + "|" + tops.map(labelOfContainer).join("|");
    if (bar && bar.__sig === sig) return;
    if (bar) bar.remove();
    bar = el("nav", { id: "tesla-jump", "aria-label": "Ir a una parte del formulario" });
    bar.__sig = sig;
    bar.appendChild(el("span", { class: "tesla-jump-label", text: "Ir a:" }));
    tops.forEach(function (c) {
      var label = labelOfContainer(c).replace(/\s*\((opcional|si quieres)\)+$/i, "");
      if (!label) return;
      var chip = el("button", { type: "button", class: "tesla-jump-chip", text: label.length > 28 ? label.slice(0, 27) + "…" : label, title: label, on: { click: function () { if (finder().goTo) finder().goTo(c); else c.scrollIntoView({ behavior: "smooth", block: "start" }); } } });
      chip.__target = c;
      bar.appendChild(chip);
    });
    var crumbs = $("#tesla-crumbs");
    if (crumbs && crumbs.nextSibling) crumbs.parentElement.insertBefore(bar, crumbs.nextSibling);
    else if (crumbs) crumbs.parentElement.appendChild(bar);
  }
  function spyJump(p) {
    var bar = $("#tesla-jump");
    if (!bar) return;
    var line = p.getBoundingClientRect().top + 150;
    var current = null;
    $$(".tesla-jump-chip", bar).forEach(function (chip) {
      var t = chip.__target;
      if (t && t.getBoundingClientRect().top <= line) current = chip;
    });
    $$(".tesla-jump-chip", bar).forEach(function (chip) { chip.classList.toggle("on", chip === current); });
  }

  /* ═════════════ 3. listas: acordeón, títulos, vacías ═════════════ */
  function listItems(list) {
    return $$('[class*="SortableListItem"]', list).filter(function (i) { return i.parentElement.closest('[class*="ControlContainer"]') === list; });
  }
  function itemBar(item) { return item.querySelector(':scope > [class*="StyledListItemTopBar"]'); }
  function toggleBtn(item) { var b = itemBar(item); return b ? b.querySelector("button") : null; }
  function itemContent(item) { return item.querySelector(':scope > div:not([class*="TopBar"]):not([class*="NestedObjectLabel"])'); }
  function isOpen(item) { return item.offsetHeight > 90; }
  function closeItem(item) { if (isOpen(item)) { var b = toggleBtn(item); if (b) b.click(); } }
  /** Pliega de uno en uno: Decap pierde clics si se piden varios a la vez. */
  function closeMany(items) {
    var queue = items.slice();
    (function next() {
      var item = queue.shift();
      if (!item) return;
      closeItem(item);
      setTimeout(next, 320);
    })();
  }
  function itemSummary(item) {
    var inputs = $$("input[type=text], textarea", item).filter(function (i) { return i.closest('[class*="SortableListItem"]') === item && norm(i.value); });
    if (inputs.length) return norm(inputs[0].value);
    var single = $('[class*="singleValue"]', item);
    if (single && single.closest('[class*="SortableListItem"]') === item) return norm(single.textContent);
    return "";
  }
  /** Decap abre los elementos con una animación y un retraso: se espera a que las alturas dejen de cambiar. */
  function whenSettled(list, done) {
    var last = "";
    var tries = 0;
    (function check() {
      var heights = listItems(list).map(function (i) { return i.offsetHeight; }).join(",");
      var anyOpen = listItems(list).some(isOpen);
      if (anyOpen && heights === last) return done();
      last = heights;
      if (++tries < 12) setTimeout(check, 350);
    })();
  }
  var lists = new WeakMap();
  function processLists(p) {
    $$('[class*="SortableListItem"]', p).forEach(function (it) {
      if (!visible(it)) return;
      var list = it.parentElement.closest('[class*="ControlContainer"]');
      if (!list) return;
      var state = lists.get(list);
      var items = listItems(list);
      if (!state) {
        state = { count: items.length };
        lists.set(list, state);
        // Al abrir una lista con 3 o más elementos, solo el primero queda abierto (se espera a que termine de animarse).
        if (items.length >= 3) whenSettled(list, function () { closeMany(listItems(list).slice(1)); });
      } else if (items.length > state.count) {
        // Se añadió un elemento: queda abierto y los demás se pliegan.
        var added = items[items.length - 1];
        whenSettled(list, function () { closeMany(listItems(list).filter(function (o) { return o !== added; })); });
        setTimeout(function () { added.scrollIntoView({ behavior: "smooth", block: "center" }); }, 800);
        state.count = items.length;
      } else {
        state.count = items.length;
      }
    });
    // títulos de cada elemento
    $$('[class*="SortableListItem"]', p).forEach(function (it) {
      var bar = itemBar(it);
      if (!bar) return;
      var list = it.parentElement.closest('[class*="ControlContainer"]');
      var index = list ? listItems(list).indexOf(it) + 1 : 0;
      var title = bar.querySelector(".tesla-item-title");
      if (!title) {
        title = el("div", { class: "tesla-item-title" });
        bar.appendChild(title);
      }
      var text = itemSummary(it);
      var html = '<span class="n">' + index + "</span><span class=\"t" + (text ? "" : " empty") + '">' + esc(text || "Elemento nuevo (sin título todavía)") + "</span>";
      if (title.__html !== html) { title.innerHTML = html; title.__html = html; }
      it.classList.toggle("tesla-open", isOpen(it));
    });
  }
  // tocar la barra del elemento (fuera de sus botones y del asa de arrastre) lo abre o lo cierra
  document.addEventListener("click", function (e) {
    var bar = e.target.closest && e.target.closest('[class*="StyledListItemTopBar"]');
    if (!bar || e.target.closest("button") || e.target.closest('[class*="DragIconContainer"]')) return;
    var item = bar.closest('[class*="SortableListItem"]');
    var b = item && toggleBtn(item);
    if (b) b.click();
  }, true);
  // un solo elemento abierto a la vez
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest('[class*="StyledListItemTopBar"] button');
    if (!b) return;
    var item = b.closest('[class*="SortableListItem"]');
    var isToggle = $$("button", b.parentElement)[0] === b;
    if (!item || !isToggle) return;
    var list = item.parentElement.closest('[class*="ControlContainer"]');
    var wasOpen = isOpen(item);
    if (wasOpen || !list) return;
    // el elemento se abre con retraso: se espera a verlo abierto y entonces se pliegan los demás
    var tries = 0;
    (function wait() {
      if (isOpen(item)) {
        closeMany(listItems(list).filter(function (o) { return o !== item; }));
        setTimeout(function () { item.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 350);
      } else if (++tries < 14) setTimeout(wait, 250);
    })();
  }, true);
  // tarjeta de ayuda cuando una lista está vacía
  function emptyStates(p) {
    $$('[class*="AddButton"]', p).forEach(function (btn) {
      var control = btn.closest('[class*="ControlContainer"]');
      if (!control) return;
      var header = btn.closest('[class*="TopBarContainer"]');
      if (!header) return;
      var label = labelOfContainer(control).replace(/\s*\((opcional|si quieres)\)+$/i, "") || "esta lista";
      var existing = control.querySelector(":scope .tesla-empty");
      var isEmpty = /^\s*0\b/.test(header.textContent) && listItems(control).length === 0;
      if (isEmpty && !existing) {
        var add = norm(btn.textContent).replace(/\s*\+$/, "");
        var card = el("div", { class: "tesla-empty" }, [
          el("div", { class: "ico", text: "📭" }),
          el("div", { class: "txt" }, [
            el("strong", { text: "Aquí todavía no hay nada" }),
            el("span", { text: "Pulsa “" + (add || "Añadir") + "” para crear el primero. Puedes cambiarlo o quitarlo cuando quieras." }),
          ]),
          el("button", { type: "button", class: "tesla-btn primary", text: add || "Añadir", on: { click: function () { btn.click(); } } }),
        ]);
        header.parentElement.insertBefore(card, header.nextSibling);
      } else if (!isEmpty && existing) {
        existing.remove();
      }
    });
  }
  // se oculta la barra gris vacía de los grupos de campos (no aporta nada y confunde)
  function tidyHeaders(p) {
    $$('[class*="TopBarContainer"]', p).forEach(function (bar) {
      var empty = !norm(bar.textContent) && !bar.querySelector('[class*="AddButton"]');
      if (empty) bar.setAttribute("data-tesla-empty", "1"); else bar.removeAttribute("data-tesla-empty");
    });
  }

  /* ═════════════ 4. contadores, ejemplos como muestra y opciones avanzadas ═════════════ */
  function decorateFields(p) {
    $$('[class*="ControlContainer"]', p).forEach(function (c) {
      var label = cleanLabel(labelOfContainer(c));
      if (!label) return;
      if ((T.advanced || []).indexOf(label) >= 0) c.setAttribute("data-tesla-adv", "1");
      var input = c.querySelector(":scope input[type=text], :scope textarea");
      if (!input) return;
      var ex = T.examples && T.examples[labelOfContainer(c).replace(/\s*\((opcional|si quieres)\)+$/i, "")];
      var hint = c.querySelector(':scope > [class*="ControlHint"]');
      if (ex && ex.length && !input.placeholder && !(hint && /ejemplo/i.test(hint.textContent))) input.placeholder = "Ej.: " + (ex[0].length > 70 ? ex[0].slice(0, 69) + "…" : ex[0]);
      var max = (T.limits || {})[label];
      if (max && !c.querySelector(":scope > .tesla-count")) {
        var counter = el("div", { class: "tesla-count" });
        counter.__input = input;
        counter.__max = max;
        c.appendChild(counter);
      }
    });
    $$(".tesla-count", p).forEach(function (counter) {
      var n = counter.__input.value.length;
      var max = counter.__max;
      var text = n + " / " + max + (n > max ? " · es largo: puede cortarse" : n >= max * 0.9 ? " · casi lleno" : "");
      if (counter.textContent !== text) counter.textContent = text;
      counter.className = "tesla-count" + (n > max ? " over" : n >= max * 0.9 ? " near" : "");
    });
  }

  /* ═════════════ 5. ayuda lateral ═════════════ */
  function tutorials() { return window.TESLA_TUTORIALS || []; }
  function tutorialFor(topic) {
    var list = tutorials();
    var byEntry = (T.helpFor || {})[entryKey()];
    var id = byEntry || null;
    if (id) { var t = list.filter(function (x) { return x.id === id; })[0]; if (t) return t; }
    return list.filter(function (x) { return (x.topics || []).indexOf(topic) >= 0; })[0] || list.filter(function (x) { return x.id === "formularios"; })[0] || list[0];
  }
  function closeHelp() { var d = $("#tesla-drawer"); if (d) d.remove(); document.body.classList.remove("tesla-drawer-open"); }
  function renderTutorial(box, t) {
    var video = (P.videos || {})[t.id];
    box.innerHTML =
      '<h3>' + esc(t.title) + '</h3><p class="meta">⏱ ' + esc(t.time || "") + " · paso a paso</p>" +
      (video ? '<div class="video"><iframe src="' + esc(video) + '" title="Video: ' + esc(t.title) + '" allowfullscreen loading="lazy"></iframe></div>' : "") +
      '<ol class="steps">' + (t.steps || []).map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>" +
      (t.tip ? '<p class="tip">💡 ' + t.tip + "</p>" : "");
  }
  function openHelp(topic) {
    closeHelp();
    var current = tutorialFor(topic || collection());
    var list = tutorials();
    var box = el("div", { class: "tesla-drawer-body" });
    var pick = el("select", { "aria-label": "Elegir otro tutorial" }, list.map(function (t) {
      var o = el("option", { value: t.id, text: t.title });
      if (current && t.id === current.id) o.selected = true;
      return o;
    }));
    pick.addEventListener("change", function () { renderTutorial(box, list.filter(function (t) { return t.id === pick.value; })[0]); });
    var wa = P.supportWhatsapp ? el("a", { class: "tesla-btn ghost", href: "https://wa.me/" + String(P.supportWhatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent("Hola, necesito ayuda con el panel de la web del colegio."), target: "_blank", rel: "noopener", text: "💬 Pedir ayuda por WhatsApp" }) : null;
    var drawer = el("aside", { id: "tesla-drawer", role: "complementary", "aria-label": "Ayuda de esta pantalla" }, [
      el("header", {}, [
        el("div", {}, [el("strong", { text: "❓ Ayuda de esta pantalla" }), el("span", { text: "No pierdes lo que escribiste" })]),
        el("button", { type: "button", class: "close", "aria-label": "Cerrar la ayuda", text: "✕", on: { click: closeHelp } }),
      ]),
      el("div", { class: "pick" }, [el("label", { text: "Tutorial:" }), pick]),
      box,
      el("footer", {}, [
        inEntry() ? el("button", { type: "button", class: "tesla-btn ghost", text: "🧭 Ver la guía de esta pantalla", on: { click: function () { closeHelp(); startCoach(true); } } }) : null,
        el("button", { type: "button", class: "tesla-btn ghost", text: "📚 Ver todos los tutoriales", on: { click: function () { closeHelp(); window.location.hash = "#/page/ayuda"; } } }),
        wa,
      ]),
    ]);
    document.body.appendChild(drawer);
    document.body.classList.add("tesla-drawer-open");
    if (current) renderTutorial(box, current);
    var closeBtn = $(".close", drawer);
    if (closeBtn) closeBtn.focus();
  }

  /* ═════════════ 6. guía de la pantalla (globos) ═════════════ */
  var coach = null;
  function endCoach(markSeen) {
    if (coach) { coach.ring.remove(); coach.card.remove(); document.removeEventListener("keydown", coach.key, true); }
    coach = null;
    if (markSeen !== false) {
      var seen = {};
      try { seen = JSON.parse(local.get("tesla-coach-seen") || "{}"); } catch (e) {}
      seen[entryKey() || location.hash] = 1;
      local.set("tesla-coach-seen", JSON.stringify(seen));
    }
  }
  function coachSteps() {
    var p = pane();
    var steps = [];
    var first = p && topContainers(p).filter(function (c) { return visible(c) && c.id !== "tesla-crumbs" && c.querySelector("input, textarea, select, button") && !c.hasAttribute("data-tesla-adv"); })[0];
    if (first) steps.push({ target: first, title: "1 · Aquí cambias lo que quieres", text: "Cada campo tiene su nombre arriba y una ayuda 💡 abajo. Escribe y la vista previa de la derecha cambia sola." });
    var prev = previewPane();
    if (prev) steps.push({ target: prev, title: "2 · Así se ve en la web", text: "Esta es la vista previa. <strong>Haz clic en cualquier texto o foto</strong> y el formulario te lleva a su campo." });
    var nav = $("#tesla-tabs") || $("#tesla-jump");
    if (nav) steps.push({ target: nav, title: "3 · Muévete sin perderte", text: nav.id === "tesla-tabs" ? "El formulario se divide en pestañas. Toca una para ver esa parte." : "Estos botones saltan directo a cada parte del formulario." });
    var item = p && $$('[class*="SortableListItem"]', p).filter(visible)[0];
    if (item && itemBar(item)) steps.push({ target: itemBar(item), title: "4 · Listas", text: "<strong>Toca el título</strong> para abrir o cerrar un elemento. Arrastra el ≡ para <strong>ordenarlos</strong> y usa la ✕ para <strong>quitarlos</strong> (te pedimos confirmación)." });
    var crumbs = $("#tesla-crumbs .tesla-crumbs-right");
    if (crumbs) steps.push({ target: crumbs, title: "5 · Ayuda siempre a mano", text: "<strong>Ayuda</strong> abre el tutorial de esta pantalla sin que salgas. En “⋯” puedes agrandar la letra o practicar sin publicar." });
    var bar = $("#tesla-bar");
    if (bar) steps.push({ target: bar, title: "6 · Publicar", text: "Cuando termines, pulsa <strong>Revisar y publicar</strong>. Los cambios llegan a la web en 1 o 2 minutos. Mientras no publiques, nadie ve nada." });
    return steps;
  }
  function startCoach(force) {
    if (coach) return;
    if (!inEntry() || !pane()) return;
    var key = entryKey() || location.hash;
    if (!force) {
      var seen = {};
      try { seen = JSON.parse(local.get("tesla-coach-seen") || "{}"); } catch (e) {}
      if (seen[key]) return;
    }
    var steps = coachSteps();
    if (!steps.length) return;
    var ring = el("div", { id: "tesla-coach-ring", "aria-hidden": "true" });
    var card = el("div", { id: "tesla-coach", role: "dialog", "aria-label": "Guía de la pantalla" });
    document.body.appendChild(ring);
    document.body.appendChild(card);
    coach = { i: 0, steps: steps, ring: ring, card: card, key: function (e) { if (e.key === "Escape") endCoach(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1); } };
    document.addEventListener("keydown", coach.key, true);
    showStep();
  }
  function step(d) {
    if (!coach) return;
    var n = coach.i + d;
    if (n >= coach.steps.length) return endCoach();
    if (n < 0) return;
    coach.i = n;
    showStep();
  }
  function showStep() {
    var s = coach.steps[coach.i];
    var last = coach.i === coach.steps.length - 1;
    s.target.scrollIntoView({ block: "center", behavior: "auto" });
    setTimeout(function () {
      if (!coach) return;
      var r = s.target.getBoundingClientRect();
      var pad = 8;
      var ring = coach.ring;
      ring.style.cssText = "left:" + (r.left - pad) + "px;top:" + (r.top - pad) + "px;width:" + (r.width + pad * 2) + "px;height:" + (Math.min(r.height, window.innerHeight - 40) + pad * 2) + "px";
      var card = coach.card;
      card.innerHTML =
        '<div class="count">Paso ' + (coach.i + 1) + " de " + coach.steps.length + "</div><h3>" + s.title + "</h3><p>" + s.text + "</p>" +
        '<div class="row">' + (last ? "" : '<button type="button" class="tesla-btn ghost" data-skip>Salir</button>') + '<span class="grow"></span>' +
        (coach.i > 0 ? '<button type="button" class="tesla-btn ghost" data-prev>Atrás</button>' : "") +
        '<button type="button" class="tesla-btn primary" data-next>' + (last ? "¡Entendido!" : "Siguiente") + "</button></div>";
      var w = 340;
      var left = r.left < window.innerWidth / 2 ? Math.min(r.right + 20, window.innerWidth - w - 16) : Math.max(16, r.left - w - 20);
      if (r.width > window.innerWidth * 0.55) left = Math.max(16, Math.min(r.left + 24, window.innerWidth - w - 16));
      var top = Math.max(72, Math.min(r.top, window.innerHeight - 270));
      if (r.width > window.innerWidth * 0.55 && r.top > 300) top = Math.max(72, r.top - 250);
      card.style.cssText = "left:" + left + "px;top:" + top + "px;width:" + w + "px";
      $("[data-next]", card).onclick = function () { step(1); };
      var prev = $("[data-prev]", card); if (prev) prev.onclick = function () { step(-1); };
      var skip = $("[data-skip]", card); if (skip) skip.onclick = function () { endCoach(); };
      $("[data-next]", card).focus();
    }, 120);
  }
  var coachArmed = "";
  function maybeAutoCoach() {
    var key = entryKey() || location.hash;
    if (!inEntry() || !pane() || coachArmed === key) return;
    if ($(".tesla-modal") || $('[aria-label="Recorrido de bienvenida"]') || window.TESLA_TOUR_OPEN) return;
    if (!$("#tesla-crumbs") || !$("#tesla-bar")) return;
    coachArmed = key;
    setTimeout(function () { startCoach(false); }, 900);
  }

  /* ═════════════ 7. modo práctica ═════════════ */
  function setPractice(on) {
    if (on) { session.set("tesla-practice", "1"); local.set("tesla-practiced", "1"); } else session.del("tesla-practice");
    if (!on) { if (ux().reloadWithoutAsking) ux().reloadWithoutAsking(); else { window.onbeforeunload = null; window.location.reload(); } return; }
    renderPractice();
    toast("🧪 Modo práctica activado: nada se publicará");
  }
  function renderPractice() {
    var b = $("#tesla-practice");
    if (!practice()) { if (b) b.remove(); document.body.classList.remove("tesla-practicing"); return; }
    document.body.classList.add("tesla-practicing");
    if (b) return;
    b = el("div", { id: "tesla-practice", role: "status" }, [
      el("span", { html: "🧪 <strong>Modo práctica</strong> · escribe y prueba todo lo que quieras: <strong>nada se publica</strong>." }),
      el("button", { type: "button", class: "tesla-btn", text: "Salir y descartar", on: { click: function () { setPractice(false); } } }),
    ]);
    document.body.appendChild(b);
  }
  function practiceNotice() {
    ux().openModal({
      icon: "🧪",
      title: "Esto es una práctica",
      body: "<p>Así se vería el momento de publicar. En el <strong>modo práctica no se envía nada a la web</strong>.</p><p>Cuando estés lista, sal de la práctica y repite los cambios de verdad.</p>",
      buttons: [
        { text: "Seguir practicando", kind: "ghost" },
        { text: "Salir y descartar mis cambios", kind: "primary", run: function () { setPractice(false); } },
      ],
    });
  }
  // el botón "Publicar ahora" de Decap tampoco publica en modo práctica
  document.addEventListener("click", function (e) {
    if (!practice()) return;
    var t = e.target.closest && e.target.closest("[role=menuitem], li, span, button, a");
    if (t && /^Publicar ahora$/i.test(norm(t.textContent))) {
      e.preventDefault();
      e.stopImmediatePropagation();
      practiceNotice();
    }
  }, true);

  /* ═════════════ 8. atajos ═════════════ */
  function shortcutsInfo() {
    ux().openModal({
      icon: "⌨️",
      title: "Atajos del teclado",
      body: '<ul class="tesla-changes"><li><strong>Ctrl + S</strong> · revisar y publicar tus cambios</li><li><strong>Esc</strong> · cerrar ventanas, la ayuda o la guía</li><li><strong>← →</strong> · pasos de la guía de la pantalla</li></ul>',
      buttons: [{ text: "Entendido", kind: "primary" }],
    });
  }
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S") && inEntry()) {
      e.preventDefault();
      if (ux().isDirty && ux().isDirty()) ux().reviewAndPublish();
      else toast("✓ Todo está publicado: no hay nada pendiente");
    } else if (e.key === "Escape") {
      closeMore();
      if ($("#tesla-drawer") && !$(".tesla-modal") && !coach) closeHelp();
    }
  });

  /* ═════════════ ciclo principal ═════════════ */
  window.TeslaGuide = {
    isPractice: practice,
    practiceNotice: practiceNotice,
    setPractice: setPractice,
    openHelp: openHelp,
    startCoach: function () { startCoach(true); },
    /** panel-ui lo llama antes de ir a un campo: si es avanzado, se muestran las opciones avanzadas. */
    reveal: function (container) {
      var node = container;
      while (node && node.nodeType === 1) {
        if (node.hasAttribute && node.hasAttribute("data-tesla-adv") && !prefs.adv) { prefs.adv = true; applyPrefs(); refreshAdvPill(); return; }
        node = node.parentElement;
      }
    },
  };
  var scheduled = false;
  function tick() {
    scheduled = false;
    applyPrefs();
    renderPractice();
    if (!$('header[class*="AppHeader"], [class*="ToolbarContainer"]')) return;
    var p = pane();
    if (inEntry() && p) {
      var crumbs = ensureCrumbs();
      if (crumbs) document.documentElement.style.setProperty("--tesla-crumbs-h", crumbs.offsetHeight + "px");
      tidyHeaders(p);
      decorateFields(p);
      processLists(p);
      emptyStates(p);
      if (crumbs) { ensureJump(p); spyJump(p); refreshAdvPill(); }
      maybeAutoCoach();
    } else {
      var j = $("#tesla-jump");
      if (j) j.remove();
      var c = $("#tesla-crumbs");
      if (c) c.remove();
      if (coach) endCoach(false);
      coachArmed = "";
    }
  }
  function schedule() { if (scheduled) return; scheduled = true; setTimeout(tick, 220); }
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true });
  document.addEventListener("input", schedule, true);
  document.addEventListener("scroll", function () { var p = pane(); if (p && $("#tesla-jump")) spyJump(p); }, true);
  window.addEventListener("hashchange", function () { coachArmed = ""; closeHelp(); if (coach) endCoach(false); setTimeout(tick, 350); });
  window.addEventListener("resize", function () { if (coach) showStep(); });
  setInterval(tick, 1500);
  applyPrefs();
})();
