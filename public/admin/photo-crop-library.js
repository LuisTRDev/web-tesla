/* Permite crear una copia recortada de una imagen que ya está en la biblioteca. */
(function () {
  "use strict";
  var selected = null;
  var busy = false;
  document.addEventListener("click", function (event) {
    var node = event.target;
    if (!node || !node.closest) return;
    var card = node.closest('div[class*="-Card "]');
    if (!card) return;
    var image = card.querySelector("img");
    var label = card.querySelector('[class*="CardText"]');
    if (!image || !label) { selected = null; return; }
    var name = label.textContent.trim();
    selected = selected && selected.name === name ? null : { name: name, src: image.src };
  }, true);

  async function editSelected() {
    if (busy) return;
    if (!selected) { window.alert("Selecciona primero una imagen de la biblioteca."); return; }
    var input = document.querySelector('.nc-fileUploadButton input[type="file"]');
    if (!input) { window.alert("No se encontró la opción de subida. Vuelve a abrir la biblioteca."); return; }
    busy = true;
    try {
      var response;
      try { response = await fetch(selected.src); }
      catch (error) { throw new Error("No se pudo abrir esta imagen. Si es de Drive, impórtala primero desde Google Drive."); }
      if (!response.ok) throw new Error("No se pudo abrir esta imagen. Si es de Drive, impórtala primero desde Google Drive.");
      var blob = await response.blob();
      var extension = selected.name.toLowerCase().match(/\.(jpe?g|png|webp)$/);
      var fallbackType = extension && (extension[1] === "png" ? "image/png" : extension[1] === "webp" ? "image/webp" : "image/jpeg");
      var file = new File([blob], selected.name, { type: /^image\//.test(blob.type) ? blob.type : fallbackType || "" });
      if (!window.TeslaPhotoCrop.supported(file)) throw new Error("El recorte está disponible para imágenes JPG, PNG y WebP.");
      var cropped = await window.TeslaPhotoCrop.edit(file);
      if (!cropped || cropped === file) return;
      if (window.TeslaPhotoOptimizer) cropped = (await window.TeslaPhotoOptimizer.optimize(cropped)).file;
      if (!input.isConnected) throw new Error("Se cerró la biblioteca. Vuelve a intentarlo.");
      if (window.TeslaDraftPhotos) window.TeslaDraftPhotos.remember(cropped);
      var transfer = new DataTransfer(); transfer.items.add(cropped);
      input.files = transfer.files; input.__teslaPassThrough = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      selected = null;
      window.alert("Se está guardando una copia recortada. Cuando aparezca en la biblioteca, selecciónala para usarla.");
    } catch (error) {
      window.alert(error.message || "No se pudo abrir esta imagen para recortarla.");
    } finally { busy = false; }
  }
  function addButton() {
    var found = false;
    document.querySelectorAll("h1, h2, h3").forEach(function (heading) {
      if (["Archivos multimedia", "Imágenes", "Images", "Files", "Archivos"].indexOf(heading.textContent.trim()) < 0 || !heading.parentElement) return;
      found = true;
      if (heading.parentElement.querySelector("[data-crop-library]")) return;
      var button = document.createElement("button"); button.type = "button";
      button.textContent = "Recortar imagen seleccionada"; button.setAttribute("data-crop-library", "true");
      button.style.cssText = "margin:6px 0 6px 12px;padding:9px 14px;border:1px solid #cbd5e1;border-radius:6px;background:#fff;color:#1f2937;font-weight:600;cursor:pointer";
      button.addEventListener("click", editSelected);
      heading.insertAdjacentElement("afterend", button);
    });
    if (!found) selected = null;
  }
  new MutationObserver(addButton).observe(document.documentElement, { childList: true, subtree: true });
  addButton();
})();
