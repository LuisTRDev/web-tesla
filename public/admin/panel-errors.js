/*
 * ERRORES Y GUARDADO, EN CRISTIANO
 *  1. Resumen de lo que falta: si al publicar faltan campos obligatorios, un aviso dice cuántos son y cada uno lleva a su campo.
 *  2. Mensajes claros: los avisos rojos de Decap ("Failed to persist…", errores de red o de sesión) se reescriben diciendo qué pasó y
 *     que lo escrito NO se perdió.
 *  3. Sin internet: un aviso fijo mientras no hay señal y otro cuando vuelve.
 * El borrador se guarda además en el aparato (local_backup en config.yml): si el navegador se cierra, Decap ofrece recuperarlo.
 */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }

  /* ───────── 1. lo que falta para publicar ───────── */
  var errBar = null;
  var lastKey = "";
  function missing() {
    return $$('[class*="ControlErrorsList"]').filter(function (n) { return n.offsetParent !== null && n.textContent.trim(); }).map(function (n) {
      var text = n.textContent.trim();
      var label = text.replace(/\s+es obligatorio\.?$/i, "").replace(/\.$/, "");
      var box = n.closest('[class*="ControlContainer"], [class*="ControlWrapper"]') || n.parentElement;
      return { label: label, text: text, node: box };
    });
  }
  function jump(node) {
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    var input = $("input, textarea, select, [contenteditable=true]", node);
    if (input) setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) {} }, 350);
  }
  function renderErrors() {
    var list = missing();
    var key = list.map(function (m) { return m.text; }).join("|");
    if (!list.length) {
      if (errBar) errBar.hidden = true;
      lastKey = "";
      return;
    }
    if (key === lastKey && errBar && !errBar.hidden) return;
    lastKey = key;
    if (!errBar) {
      errBar = el("div", { id: "tesla-errbar", role: "alert" });
      document.body.appendChild(errBar);
    }
    errBar.hidden = false;
    errBar.innerHTML = "";
    var allDash = list.every(function (m) { return /es obligatorio/i.test(m.text); });
    errBar.appendChild(el("strong", {}, allDash ? (list.length === 1 ? "⚠️ Falta completar 1 cosa para publicar" : "⚠️ Faltan " + list.length + " cosas para publicar") : "⚠️ Revisa " + (list.length === 1 ? "este campo" : "estos " + list.length + " campos")));
    var chips = el("div", { class: "tesla-errchips" });
    list.slice(0, 8).forEach(function (m) {
      var b = el("button", { type: "button" }, m.label);
      b.addEventListener("click", function () { jump(m.node); });
      chips.appendChild(b);
    });
    errBar.appendChild(chips);
    var close = el("button", { type: "button", class: "tesla-errclose", "aria-label": "Cerrar aviso" }, "×");
    close.addEventListener("click", function () { errBar.hidden = true; });
    errBar.appendChild(close);
    jump(list[0].node);
  }

  /* ───────── 2. mensajes claros en los avisos rojos de Decap ───────── */
  var RULES = [
    [/obligatorio|required|rellenado/i, null], // ya lo explica el resumen de arriba
    [/network|failed to fetch|fetch|timeout|conexi|offline/i, "😟 No hay conexión con el servidor. No perdiste lo que escribiste: revisa tu internet y vuelve a tocar Publicar."],
    [/401|403|unauthori|forbidden|token|sesi[oó]n|session|login|permission|permiso/i, "🔒 Tu sesión terminó o no tienes permiso. Cierra sesión, vuelve a entrar y publica otra vez. Lo que escribiste sigue aquí."],
    [/422|conflict|sha|already exists|ya existe|duplicate/i, "⚠️ Ya existe algo con ese nombre, o alguien más cambió esto a la vez. Cambia el título un poco, o recarga la página y vuelve a intentarlo."],
    [/rate limit|too many|429/i, "⏳ Se hicieron demasiadas publicaciones seguidas. Espera un minuto y vuelve a intentarlo."],
    [/persist|saving|guardar|error|failed|fail|no se pudo/i, "😟 No se pudo guardar. Tus cambios siguen aquí. Inténtalo otra vez en un momento; si se repite, pide ayuda."],
  ];
  function friendly() {
    $$(".Toastify__toast--error, .Toastify__toast--warning").forEach(function (t) {
      if (t.dataset.teslaFixed) return;
      var body = $('[class*="toast-body"], [role="alert"]', t) || t;
      var raw = body.textContent || "";
      for (var i = 0; i < RULES.length; i++) {
        if (RULES[i][0].test(raw)) {
          t.dataset.teslaFixed = "1";
          if (RULES[i][1]) body.textContent = RULES[i][1];
          return;
        }
      }
    });
  }

  /* ───────── 3. sin internet ───────── */
  var net = null;
  var netTimer = 0;
  function showNet(online) {
    if (!net) {
      net = el("div", { id: "tesla-net", role: "status", "aria-live": "polite" });
      document.body.appendChild(net);
    }
    clearTimeout(netTimer);
    net.className = online ? "ok" : "off";
    net.hidden = false;
    net.textContent = online ? "✓ Volvió el internet. Ya puedes publicar." : "📡 Sin internet. Lo que escribes no se pierde: cuando vuelva la señal, toca Publicar.";
    if (online) netTimer = setTimeout(function () { net.hidden = true; }, 3500);
  }
  window.addEventListener("offline", function () { showNet(false); });
  window.addEventListener("online", function () { showNet(true); });
  if (navigator.onLine === false) showNet(false);

  var pending = 0;
  function soon() {
    if (pending) return;
    pending = setTimeout(function () { pending = 0; renderErrors(); friendly(); }, 200);
  }
  new MutationObserver(soon).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("hashchange", function () { lastKey = ""; if (errBar) errBar.hidden = true; });
  setInterval(soon, 1500);
})();
