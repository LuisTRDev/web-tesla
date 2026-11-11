/* Añade recorte opcional al flujo de URL de los controles de Decap. */
(function () {
  "use strict";
  var busy = false;
  function sleep(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
  function urlInfo(value) {
    var url;
    try { url = new URL(value.trim()); } catch (error) { throw new Error("Escribe un enlace completo que empiece por https://."); }
    if (url.protocol !== "https:" && !(url.protocol === "http:" && /^(localhost|127\.0\.0\.1)$/.test(url.hostname))) throw new Error("Escribe un enlace seguro que empiece por https://.");
    return url;
  }
  function driveFile(url) {
    if (url.hostname !== "drive.google.com") return null;
    var match = url.pathname.match(/^\/file\/d\/([\w-]+)(?:\/|$)/);
    var id = match ? match[1] : (/^\/(?:open|uc|thumbnail)$/.test(url.pathname) ? url.searchParams.get("id") : null);
    if (!id || !/^[\w-]+$/.test(id)) throw new Error("Este enlace de Drive no identifica un archivo. Copia el enlace de una imagen concreta.");
    return { id: id, resourceKey: url.searchParams.get("resourcekey") };
  }
  async function download(value) {
    var url = urlInfo(value);
    var drive = driveFile(url);
    var request = url.href;
    var options = {};
    if (drive) {
      var key = window.PANEL && window.PANEL.googleDrive && window.PANEL.googleDrive.apiKey;
      if (!key) throw new Error("Google Drive no está configurado. Usa la opción de importar desde Drive.");
      request = "https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(drive.id) + "?alt=media&key=" + encodeURIComponent(key);
      if (drive.resourceKey) options.headers = { "X-Goog-Drive-Resource-Keys": drive.id + "/" + drive.resourceKey };
    }
    var response;
    try { response = await fetch(request, options); }
    catch (error) { throw new Error("El sitio de la imagen no permite descargarla desde el panel. Puedes insertar el enlace sin recortar o subir el archivo."); }
    if (!response.ok) throw new Error(drive ? "No se pudo acceder a la imagen de Drive. Compártela con cualquier persona con el enlace o impórtala desde Google Drive." : "No se pudo descargar la imagen. Comprueba el enlace o súbela desde tu dispositivo.");
    var size = Number(response.headers.get("content-length"));
    if (size > 25 * 1024 * 1024) throw new Error("La imagen supera los 25 MB. Reduce su tamaño o súbela desde tu dispositivo.");
    var blob = await response.blob();
    if (blob.size > 25 * 1024 * 1024) throw new Error("La imagen supera los 25 MB. Reduce su tamaño o súbela desde tu dispositivo.");
    var type = blob.type.split(";")[0].toLowerCase();
    var ext = type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : type === "image/webp" ? "webp" : "";
    if (!ext) throw new Error("El enlace no contiene una imagen JPG, PNG o WebP compatible con el recorte.");
    return new File([blob], "imagen-url-" + Date.now().toString(36) + "." + ext, { type: type });
  }
  function insertLink(button, value) {
    var prompt = window.prompt;
    try { window.prompt = function () { return value; }; button.click(); }
    finally { window.prompt = prompt; }
  }
  async function uploadToField(file, chooseButton) {
    if (!chooseButton || !chooseButton.isConnected) throw new Error("No se encontró el selector de archivos del campo. Vuelve a intentarlo.");
    chooseButton.click();
    var input;
    for (var i = 0; i < 40; i++) {
      input = document.querySelector('.nc-fileUploadButton input[type="file"]');
      if (input && input.isConnected) break;
      await sleep(100);
    }
    if (!input) throw new Error("No se pudo abrir la biblioteca de imágenes. Vuelve a intentarlo.");
    if (window.TeslaPhotoOptimizer) file = (await window.TeslaPhotoOptimizer.optimize(file)).file;
    if (window.TeslaDraftPhotos) window.TeslaDraftPhotos.remember(file);
    var transfer = new DataTransfer(); transfer.items.add(file);
    input.files = transfer.files; input.__teslaPassThrough = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    var started = Date.now();
    while (Date.now() - started < 60000) {
      await sleep(250);
      if (!input.isConnected) throw new Error("Se cerró la biblioteca durante la importación. Revisa si la foto se guardó.");
      if (document.body.textContent.toLowerCase().includes(file.name.toLowerCase())) {
        await sleep(350);
        var confirm = Array.from(document.querySelectorAll("button")).find(function (button) {
          return button.offsetParent !== null && !button.disabled && /^(confirmar selección|insert selected|insertar selección)$/i.test(button.textContent.trim());
        });
        if (!confirm) throw new Error("La copia está en la biblioteca. Selecciónala y pulsa Confirmar selección para usarla.");
        confirm.click();
        return;
      }
    }
    throw new Error("No se pudo confirmar la subida. Revisa la biblioteca antes de reintentar.");
  }
  function openDialog(button, chooseButton, isFile) {
    if (busy) return;
    var previous = document.activeElement;
    var overlay = document.createElement("div"); overlay.className = "tesla-crop-overlay tesla-url-overlay";
    var box = document.createElement("div"); box.className = "tesla-crop-dialog"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", isFile ? "Archivo desde URL" : "Imagen desde URL");
    var title = document.createElement("h2"); title.textContent = isFile ? "Archivo desde URL" : "Imagen desde URL"; box.appendChild(title);
    var intro = document.createElement("p"); intro.textContent = "Pega el enlace. Puedes insertarlo directamente o, si es una imagen, recortar una copia antes de usarla."; box.appendChild(intro);
    var label = document.createElement("label"); label.textContent = "Enlace del archivo"; label.htmlFor = "tesla-image-url"; box.appendChild(label);
    var input = document.createElement("input"); input.id = "tesla-image-url"; input.type = "url"; input.placeholder = "https://"; input.style.cssText = "width:100%;padding:10px;border:1px solid #aab4c8;border-radius:8px;margin:6px 0"; box.appendChild(input);
    var message = document.createElement("p"); message.className = "tesla-crop-message"; message.setAttribute("role", "status"); box.appendChild(message);
    var actions = document.createElement("div"); actions.className = "tesla-crop-actions"; box.appendChild(actions);
    function add(text, handler, cls) { var b = document.createElement("button"); b.type = "button"; b.textContent = text; if (cls) b.className = cls; b.addEventListener("click", handler); actions.appendChild(b); return b; }
    function close() { document.removeEventListener("keydown", onKey, true); overlay.remove(); if (previous && previous.focus) previous.focus(); }
    function onKey(event) {
      if (overlay.style.display === "none") return;
      if (event.key === "Escape" && !busy) { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
      if (event.key !== "Tab") return;
      var controls = Array.from(box.querySelectorAll("input:not(:disabled), button:not(:disabled)"));
      if (!controls.length) return;
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls[controls.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) { event.preventDefault(); controls[0].focus(); }
    }
    document.addEventListener("keydown", onKey, true);
    var cancel = add("Cancelar", close);
    var direct = add("Insertar enlace", function () { var value = input.value.trim(); if (!value) { message.textContent = "Escribe un enlace."; return; } close(); insertLink(button, value); });
    var crop = add("Previsualizar y recortar", async function () {
      if (busy) return;
      busy = true; input.disabled = cancel.disabled = direct.disabled = crop.disabled = true; message.textContent = "Cargando imagen…";
      try {
        var file = await download(input.value);
        message.textContent = "";
        overlay.style.display = "none";
        var chosen = await window.TeslaPhotoCrop.edit(file);
        if (!chosen) { overlay.style.display = "flex"; return; }
        overlay.style.display = "flex"; message.textContent = "Guardando copia en la biblioteca…";
        await uploadToField(chosen, chooseButton);
        close();
      } catch (error) { overlay.style.display = "flex"; message.textContent = error.message || "No se pudo preparar la imagen."; }
      finally { busy = false; input.disabled = cancel.disabled = direct.disabled = crop.disabled = false; }
    }, "primary");
    overlay.appendChild(box); document.body.appendChild(overlay); input.focus();
  }
  document.addEventListener("click", function (event) {
    if (!event.isTrusted || !event.target.closest) return;
    var button = event.target.closest("button");
    var field = button && button.closest('[class*="ControlContainer"]');
    if (!field || !/^(insertar desde url|insert from url|replace with url|reemplazar con url)$/i.test(button.textContent.trim())) return;
    var kind = field.getAttribute("aria-label");
    var isGalleryFile = kind === "file field" && /^#\/collections\/galeria\/entries\/gallery/.test(location.hash);
    if (kind !== "image field" && !isGalleryFile) return;
    var control = button.closest("span");
    var choose = control && Array.from(control.querySelectorAll("button")).find(function (item) {
      return item !== button && /^(elige|escoge|choose|select|selecciona)/i.test(item.textContent.trim());
    });
    if (!choose) return;
    event.preventDefault(); event.stopImmediatePropagation();
    openDialog(button, choose, isGalleryFile);
  }, true);
})();
