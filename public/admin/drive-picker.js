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
    if (!button || button.hasAttribute("data-drive-picker")) return;
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
  function choose() {
    loadGoogle().then(function () {
      var client = window.google.accounts.oauth2.initTokenClient({
        client_id: settings.clientId,
        scope: "https://www.googleapis.com/auth/drive.file",
        callback: function (response) {
          if (response.error) { window.alert("No se pudo conectar con Google Drive: " + response.error); return; }
          token = response.access_token;
          picker = new window.google.picker.PickerBuilder()
            .addView(new window.google.picker.DocsView().setIncludeFolders(true))
            .setOAuthToken(token)
            .setDeveloperKey(settings.apiKey)
            .setAppId(settings.projectNumber)
            .setCallback(function (result) {
              if (result.action !== window.google.picker.Action.PICKED || !result.docs || !result.docs[0]) return;
              var file = result.docs[0];
              var url = file.url || ("https://drive.google.com/file/d/" + encodeURIComponent(file.id) + "/view");
              insertOrCopy(url);
            }).build();
          picker.setVisible(true);
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
      button.addEventListener("click", choose);
      heading.insertAdjacentElement("afterend", button);
    }
  }
  new MutationObserver(addButton).observe(document.documentElement, { childList: true, subtree: true });
  addButton();
})();
