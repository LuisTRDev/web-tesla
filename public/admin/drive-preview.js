/* Decap renderiza su propia miniatura; adaptar solo el src sin modificar el dato guardado. */
(function () {
  function update(img) {
    var original = img.getAttribute("src");
    if (!original) return;
    var converted = window.TeslaDraftPhotos ? window.TeslaDraftPhotos.resolve(original) : original;
    converted = window.teslaImageUrl(converted);
    if (converted !== original) img.setAttribute("src", converted);
  }
  function scan(node) {
    if (node.nodeType !== 1) return;
    if (node.tagName === "IMG") update(node);
    node.querySelectorAll("img").forEach(update);
  }
  new MutationObserver(function (changes) {
    changes.forEach(function (change) {
      if (change.type === "attributes") update(change.target);
      else change.addedNodes.forEach(scan);
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
  document.querySelectorAll("img").forEach(update);
})();
