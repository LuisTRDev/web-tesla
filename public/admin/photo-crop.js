/* Recorte local: devuelve un archivo nuevo y conserva intacto el original. */
(function () {
  "use strict";
  var drafts = Object.create(null);
  window.TeslaDraftPhotos = {
    remember: function (file) {
      if (!file || !file.name) return;
      var name = file.name.toLowerCase();
      if (drafts[name]) URL.revokeObjectURL(drafts[name]);
      drafts[name] = URL.createObjectURL(file);
    },
    resolve: function (path) {
      if (typeof path !== "string" || /^(?:blob:|data:|https?:)/i.test(path)) return path;
      var name = path.split("/").pop().split("?")[0].toLowerCase();
      try { name = decodeURIComponent(name); } catch (error) { /* conserva el nombre original */ }
      return drafts[name] || path;
    }
  };
  function supported(file) { return !!file && /^image\/(jpeg|png|webp)$/.test(file.type); }
  function edit(file) {
    if (!supported(file) || !window.Cropper) return Promise.resolve(file);
    return new Promise(function (resolve) {
      var previous = document.activeElement;
      var objectUrl = URL.createObjectURL(file);
      var overlay = document.createElement("div"); overlay.className = "tesla-crop-overlay";
      var box = document.createElement("div"); box.className = "tesla-crop-dialog"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Ajustar imagen");
      var title = document.createElement("h2"); title.textContent = "Ajustar imagen"; box.appendChild(title);
      var hint = document.createElement("p"); hint.textContent = "Arrastra el marco para elegir qué parte se verá. Puedes cambiar su tamaño o usar una proporción."; box.appendChild(hint);
      var stage = document.createElement("div"); stage.className = "tesla-crop-stage";
      var image = document.createElement("img"); image.alt = "Vista previa para recortar"; image.src = objectUrl; stage.appendChild(image); box.appendChild(stage);
      var tools = document.createElement("div"); tools.className = "tesla-crop-tools"; box.appendChild(tools);
      var actions = document.createElement("div"); actions.className = "tesla-crop-actions";
      var message = document.createElement("p"); message.className = "tesla-crop-message"; message.setAttribute("role", "status"); box.appendChild(message); box.appendChild(actions);
      overlay.appendChild(box); document.body.appendChild(overlay);
      var cropper; var finished = false;
      function button(parent, label, fn, cls) { var b = document.createElement("button"); b.type = "button"; b.textContent = label; if (cls) b.className = cls; b.addEventListener("click", fn); parent.appendChild(b); return b; }
      function finish(value) { if (finished) return; finished = true; document.removeEventListener("keydown", onKey, true); if (cropper) cropper.destroy(); URL.revokeObjectURL(objectUrl); overlay.remove(); if (previous && previous.focus) previous.focus(); resolve(value); }
      function onKey(event) {
        if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); finish(null); return; }
        if (event.key !== "Tab") return;
        var controls = Array.from(box.querySelectorAll("button:not(:disabled)"));
        if (!controls.length) return;
        if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls[controls.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) { event.preventDefault(); controls[0].focus(); }
      }
      document.addEventListener("keydown", onKey, true);
      var ratioButtons = [];
      [["Libre", NaN], ["Horizontal 16:9", 16 / 9], ["Horizontal 4:3", 4 / 3], ["Cuadrada", 1], ["Vertical 4:5", 4 / 5]].forEach(function (item, index) {
        var b = button(tools, item[0], function () { if (!cropper) return; cropper.setAspectRatio(item[1]); ratioButtons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); });
        b.setAttribute("aria-pressed", index === 0 ? "true" : "false"); ratioButtons.push(b);
      });
      button(tools, "Acercar", function () { if (cropper) cropper.zoom(.1); });
      button(tools, "Alejar", function () { if (cropper) cropper.zoom(-.1); });
      button(tools, "Restablecer", function () { if (cropper) cropper.reset(); });
      button(actions, "Cancelar", function () { finish(null); });
      button(actions, "Usar imagen completa", function () { finish(file); });
      var apply = button(actions, "Usar recorte", function () {
        if (!cropper) return;
        apply.disabled = true;
        try {
          var canvas = cropper.getCroppedCanvas({ maxWidth: 6000, maxHeight: 6000 });
          if (!canvas || !canvas.width || !canvas.height) throw new Error("Selecciona una parte de la imagen.");
          canvas.toBlob(function (blob) {
            if (!blob) { message.textContent = "No se pudo generar el recorte. Prueba con otra imagen."; apply.disabled = false; return; }
            var ext = blob.type === "image/png" ? ".png" : blob.type === "image/webp" ? ".webp" : ".jpg";
            var base = file.name.replace(/\.[^.]+$/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 45) || "foto";
            var name = base + "-recorte-" + Date.now().toString(36) + ext;
            finish(new File([blob], name, { type: blob.type || file.type, lastModified: Date.now() }));
          }, file.type, 0.92);
        } catch (error) { message.textContent = error.message || "No se pudo generar el recorte."; apply.disabled = false; }
      }, "primary");
      apply.disabled = true;
      image.onerror = function () { message.textContent = "No se pudo abrir esta imagen. Puedes usarla completa o cancelar."; };
      try { cropper = new window.Cropper(image, { viewMode: 1, autoCropArea: 1, responsive: true, background: false, movable: true, cropBoxMovable: true, cropBoxResizable: true, ready: function () { apply.disabled = false; } }); }
      catch (error) { message.textContent = "No se pudo abrir el editor. Puedes usar la imagen completa o cancelar."; }
      box.querySelector("button").focus();
    });
  }
  window.TeslaPhotoCrop = { edit: edit, supported: supported };
})();
