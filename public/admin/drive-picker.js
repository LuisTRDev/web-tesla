/* Selector de Google Drive accesible desde la biblioteca de medios de Decap. */
(function () {
  "use strict";
  var settings = window.PANEL && window.PANEL.googleDrive;
  if (!settings || !settings.clientId || !settings.apiKey || !settings.projectNumber) return;
  var token = null;
  var picker = null;
  var loading;
  var urlButton = null;

  // Decap's file and image controls expose an "Insert from URL" action. Remember
  // the control that opened the library so the chosen file goes to that field.
  document.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button || button.hasAttribute("data-drive-picker") || button.closest("[data-drive-options]")) return;
    var control = button.closest("span");
    var candidate = control && Array.from(control.querySelectorAll("button")).find(function (item) {
      return /url/i.test(item.textContent);
    });
    urlButton = candidate && candidate !== button ? candidate : null;
  }, true);

  function insertOrCopy(url) {
    if (urlButton && urlButton.isConnected) {
      var originalPrompt = window.prompt;
      try {
        window.prompt = function () { return url; };
        urlButton.click();
      } finally {
        window.prompt = originalPrompt;
        urlButton = null;
      }
      var driveButton = document.querySelector("[data-drive-picker]");
      var dialog = driveButton && driveButton.closest('[role="dialog"]');
      var close = dialog && dialog.querySelector('button[aria-label="Close"], button[aria-label="Cerrar"]');
      if (close) close.click();
      window.alert("Archivo insertado. Para que los visitantes puedan verlo, compártelo en Drive con cualquier persona con el enlace.");
      return;
    }
    window.prompt("Copia el enlace y pégalo en «Insertar desde URL» del campo. Para que los visitantes puedan verlo, comparte el archivo con cualquier persona con el enlace.", url);
  }

  function script(url) {
    return new Promise(function (resolve, reject) {
      var node = document.createElement("script");
      node.src = url;
      node.onload = resolve;
      node.onerror = function () { reject(new Error("No se pudo cargar Google Drive. Comprueba tu conexión.")); };
      document.head.appendChild(node);
    });
  }
  function loadGoogle() {
    if (!loading) {
      loading = Promise.all([
        script("https://apis.google.com/js/api.js").then(function () {
          return new Promise(function (resolve, reject) {
            window.gapi.load("picker", { callback: resolve, onerror: reject, timeout: 15000, ontimeout: reject });
          });
        }),
        script("https://accounts.google.com/gsi/client")
      ]).catch(function (error) { loading = null; throw error; });
    }
    return loading;
  }
  function chooseMode() {
    var overlay = document.createElement("div");
    overlay.setAttribute("data-drive-options", "true");
    overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:20px";
    var box = document.createElement("div");
    box.style.cssText = "background:white;color:#17213a;padding:24px;border-radius:14px;max-width:480px;width:100%;font:15px system-ui;box-shadow:0 8px 35px #0005";
    var title = document.createElement("h2");
    title.textContent = "¿Cómo quieres usar la foto?";
    box.appendChild(title);
    [
      ["optimized", "Importar optimizada (recomendado)", "Guarda una copia ligera en la biblioteca de la web."],
      ["original", "Importar original", "Conserva el archivo completo. Puede pesar mucho y ralentizar la web."],
      ["link", "Usar enlace de Drive", "No copia el archivo. Debe estar compartido con cualquier persona con el enlace."],
      ["cancel", "Cancelar", ""]
    ].forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      button.style.cssText = "display:block;width:100%;text-align:left;margin-top:10px;padding:11px;border:1px solid #cbd5e1;border-radius:8px;background:white;color:#17213a;cursor:pointer";
      var strong = document.createElement("strong");
      strong.textContent = option[1];
      button.appendChild(strong);
      if (option[2]) {
        var detail = document.createElement("small");
        detail.style.cssText = "display:block;margin-top:4px";
        detail.textContent = option[2];
        button.appendChild(detail);
      }
      button.addEventListener("click", function () { overlay.remove(); if (option[0] !== "cancel") choose(option[0]); });
      box.appendChild(button);
    });
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  async function importFile(file, mode) {
    var input = document.querySelector('.nc-fileUploadButton input[type="file"]');
    if (!input) throw new Error("No se encontró el botón de subida de la biblioteca. Vuelve a abrir Medios.");
    if (/\.(cr2|cr3|nef|arw|dng|raw)$/i.test(file.name || "")) throw new Error("Convierte los archivos RAW, como CR2, a JPG o PNG antes de importarlos.");
    var response = await fetch("https://www.googleapis.com/drive/v3/files/" + encodeURIComponent(file.id) + "?alt=media", {
      headers: { Authorization: "Bearer " + token }
    });
    if (!response.ok) throw new Error("Google Drive no permitió descargar el archivo. Comprueba tus permisos e inténtalo otra vez.");
    var blob = await response.blob();
    var name = file.name || "foto-drive.jpg";
    var type = blob.type || file.mimeType || "";
    if (!/^image\/(jpeg|png|webp|gif|svg\+xml|avif|bmp)$/.test(type)) {
      throw new Error("Este formato no se puede usar como foto de la web. Convierte los archivos RAW, como CR2, a JPG o PNG.");
    }
    var image = new File([blob], name, { type: type });
    if (mode === "original" && image.size > 2 * 1024 * 1024 && !window.confirm("La imagen original pesa " + (image.size / 1024 / 1024).toFixed(1) + " MB. Puede ralentizar la web y la publicación. ¿Quieres subirla así?")) return;
    if (mode === "optimized" && window.TeslaPhotoOptimizer && /^image\/(jpeg|png|webp)$/.test(image.type)) {
      image = (await window.TeslaPhotoOptimizer.optimize(image)).file;
    }
    var transfer = new DataTransfer();
    transfer.items.add(image);
    input.files = transfer.files;
    // Evita que el optimizador automático vuelva a modificar el archivo original.
    input.__teslaPassThrough = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    window.alert("La importación comenzó. Cuando la foto aparezca en la biblioteca, selecciónala y pulsa Insertar para usarla en el campo.");
  }

  function importWithStatus(file, mode) {
    var status = document.createElement("div");
    status.setAttribute("role", "status");
    status.style.cssText = "position:fixed;z-index:2147483647;bottom:24px;left:24px;padding:14px 18px;border-radius:10px;background:#0d1230;color:white;font:600 14px system-ui;box-shadow:0 4px 20px #0005";
    status.textContent = "Preparando la imagen de Google Drive…";
    document.body.appendChild(status);
    return importFile(file, mode).catch(function (error) {
      window.alert(error.message || "No se pudo importar la imagen.");
    }).finally(function () { status.remove(); });
  }

  function choose(mode) {
    loadGoogle().then(function () {
      var client = window.google.accounts.oauth2.initTokenClient({
        client_id: settings.clientId,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: function (response) {
          if (response.error) { window.alert("No se pudo conectar con Google Drive: " + response.error); return; }
          token = response.access_token;
          try {
            picker = new window.google.picker.PickerBuilder()
            .addView(new window.google.picker.DocsView().setIncludeFolders(true))
            .setOAuthToken(token)
            .setDeveloperKey(settings.apiKey)
            .setAppId(settings.projectNumber)
            .setCallback(function (result) {
              if (result.action !== window.google.picker.Action.PICKED || !result.docs || !result.docs[0]) return;
              var file = result.docs[0];
              if (mode === "link") {
                var url = file.url || ("https://drive.google.com/file/d/" + encodeURIComponent(file.id) + "/view");
                insertOrCopy(url);
              } else {
                importWithStatus(file, mode);
              }
            }).build();
            picker.setVisible(true);
          } catch (error) {
            console.error("No se pudo abrir el selector de Google Drive", error);
            window.alert("No se pudo abrir el selector de Google Drive. Revisa la configuración de Google Picker y vuelve a intentarlo.");
          }
        },
        error_callback: function () { window.alert("No se pudo abrir el acceso de Google. Comprueba que el navegador permita ventanas emergentes."); }
      });
      client.requestAccessToken({ prompt: token ? "" : "consent" });
    }).catch(function () { window.alert("No se pudo cargar Google Drive. Comprueba tu conexión y vuelve a intentarlo."); });
  }
  function addButton() {
    var headings = document.querySelectorAll("h1, h2, h3");
    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i];
      if (heading.textContent.trim() !== "Archivos multimedia" || !heading.parentElement || heading.parentElement.querySelector("[data-drive-picker]")) continue;
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = "Abrir Google Drive";
      button.setAttribute("data-drive-picker", "true");
      button.style.cssText = "margin-left:16px;padding:9px 14px;border:1px solid #cbd5e1;border-radius:6px;background:#fff;color:#1f2937;font-weight:600;cursor:pointer";
      button.addEventListener("click", chooseMode);
      heading.insertAdjacentElement("afterend", button);
    }
  }
  new MutationObserver(addButton).observe(document.documentElement, { childList: true, subtree: true });
  addButton();
})();
