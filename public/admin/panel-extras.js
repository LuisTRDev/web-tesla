/*
 * EXTRAS DEL PANEL
 *  - Menú "Aa": letra grande y más contraste (se recuerdan en este aparato).
 *  - Globo rojo en "Inicio" con las cosas urgentes que faltan (lee /admin/api/pendientes).
 */
(function () {
  "use strict";
  var KEY = "tesla-view";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var state = { big: false, contrast: false };
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}

  function apply() {
    var c = document.documentElement.classList;
    c.toggle("tesla-big", !!state.big);
    c.toggle("tesla-contrast", !!state.contrast);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    var btn = $("#tesla-view-menu");
    if (btn) Array.prototype.forEach.call(btn.querySelectorAll("[data-k]"), function (b) { b.setAttribute("aria-pressed", String(!!state[b.dataset.k])); });
  }
  apply();

  /* ───────── botón y menú ───────── */
  var fab = null, menu = null;
  function ensureMenu() {
    if (fab) return;
    fab = document.createElement("button");
    fab.id = "tesla-view-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Cambiar cómo se ve el panel: modo oscuro, letra grande, contraste");
    fab.setAttribute("aria-expanded", "false");
    fab.textContent = "Aa";
    menu = document.createElement("div");
    menu.id = "tesla-view-menu";
    menu.hidden = true;
    menu.innerHTML =
      '<strong>Cómo ver el panel</strong>' +
      '<button type="button" data-k="big" aria-pressed="false">🔎 Letra más grande</button>' +
      '<button type="button" data-k="contrast" aria-pressed="false">◐ Más contraste</button>' +
      '<button type="button" data-k="reset">↩ Volver a lo normal</button>';
    menu.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.k === "reset") state = { big: false, contrast: false };
      else state[b.dataset.k] = !state[b.dataset.k];
      apply();
    });
    fab.addEventListener("click", function () {
      menu.hidden = !menu.hidden;
      fab.setAttribute("aria-expanded", String(!menu.hidden));
    });
    document.addEventListener("click", function (e) { if (!menu.hidden && !menu.contains(e.target) && e.target !== fab) { menu.hidden = true; fab.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { menu.hidden = true; fab.setAttribute("aria-expanded", "false"); } });
    document.body.appendChild(menu);
    document.body.appendChild(fab);
    apply();
  }

  /* ───────── globo de pendientes urgentes ───────── */
  var urgent = 0;
  function paintBadge() {
    ["header[class*=AppHeader] a[href='#/page/inicio']", "#tesla-tabbar a[href='#/page/inicio']"].forEach(function (sel) {
      var a = $(sel);
      if (!a) return;
      var old = a.querySelector(".tesla-badge");
      if (!urgent) { if (old) old.remove(); return; }
      if (!old) { old = document.createElement("span"); old.className = "tesla-badge"; old.setAttribute("aria-label", urgent + " pendientes urgentes"); a.appendChild(old); }
      old.textContent = String(urgent);
    });
  }
  function loadPending() {
    fetch("/admin/api/pendientes", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) {
      urgent = (d.items || []).filter(function (i) { return !i.done && i.priority === 1; }).length;
      paintBadge();
    }).catch(function () {});
  }

  var pending = 0;
  function soon() { if (!pending) pending = setTimeout(function () { pending = 0; ensureMenu(); paintBadge(); }, 300); }
  new MutationObserver(soon).observe(document.body, { childList: true, subtree: true });
  setInterval(soon, 2000);
  loadPending();
  setInterval(loadPending, 5 * 60 * 1000);
  ensureMenu();
})();
