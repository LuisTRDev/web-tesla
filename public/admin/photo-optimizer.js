/*
 * OPTIMIZADOR DE FOTOS
 * Las fotos del celular pesan varios MB y vuelven lenta la web. Este script intercepta las imágenes que se
 * suben desde el panel, las reduce a 2000 px de lado mayor y las convierte a WebP (calidad 82) antes de
 * guardarlas. Las imágenes ya pequeñas, los GIF y los SVG se dejan como están.
 */
(function () {
  "use strict";
  var MAX_SIDE = 2000;
  var MIN_BYTES = 450 * 1024;
  var QUALITY = 0.82;

  function isCandidate(file) {
    return /^image\/(jpeg|png|webp)$/.test(file.type);
  }
  function mb(bytes) {
    return bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + " MB" : Math.round(bytes / 1024) + " KB";
  }
  function toast(text) {
    var box = document.createElement("div");
    box.setAttribute("role", "status");
    box.textContent = text;
    box.style.cssText = "position:fixed;left:20px;bottom:20px;z-index:999999;background:#0D1230;color:#fff;padding:12px 18px;border-radius:14px;font:600 14px Figtree,Arial,sans-serif;box-shadow:0 10px 30px -8px rgba(13,18,48,.6);max-width:360px";
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 6000);
  }

  function optimize(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        var side = Math.max(img.naturalWidth, img.naturalHeight);
        if (file.size < MIN_BYTES && side <= MAX_SIDE) return resolve({ file: file, changed: false });
        var ratio = Math.min(1, MAX_SIDE / side);
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * ratio);
        canvas.height = Math.round(img.naturalHeight * ratio);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(function (blob) {
          if (!blob || blob.size >= file.size) return resolve({ file: file, changed: false });
          var name = file.name.replace(/\.[^.]+$/, "") + ".webp";
          resolve({ file: new File([blob], name, { type: "image/webp", lastModified: Date.now() }), changed: true, before: file.size, after: blob.size });
        }, "image/webp", QUALITY);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        resolve({ file: file, changed: false });
      };
      img.src = url;
    });
  }

  document.addEventListener(
    "change",
    function (event) {
      var input = event.target;
      if (!input || input.tagName !== "INPUT" || input.type !== "file") return;
      if (input.__teslaPassThrough) {
        input.__teslaPassThrough = false;
        return;
      }
      var files = Array.prototype.slice.call(input.files || []);
      if (!files.some(isCandidate)) return;

      // Detiene el evento original, optimiza y lo vuelve a lanzar con los archivos nuevos.
      event.stopImmediatePropagation();
      Promise.all(files.map(function (file) { return isCandidate(file) ? optimize(file) : Promise.resolve({ file: file, changed: false }); })).then(function (results) {
        var transfer = new DataTransfer();
        var saved = 0;
        var count = 0;
        var before = 0;
        results.forEach(function (r) {
          transfer.items.add(r.file);
          if (r.changed) { count++; before += r.before; saved += r.after; }
        });
        input.files = transfer.files;
        input.__teslaPassThrough = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        if (count > 0) toast("Foto optimizada: " + mb(before) + " → " + mb(saved) + (count > 1 ? " (" + count + " fotos)" : ""));
      });
    },
    true
  );

  window.TeslaPhotoOptimizer = { optimize: optimize };
})();
