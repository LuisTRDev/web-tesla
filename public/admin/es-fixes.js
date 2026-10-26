/*
 * Traduce los pocos textos que Decap deja en inglés en su versión en español
 * ("Add …", "Insert from URL"…). Solo cambia texto visible; no afecta a los datos.
 */
(function () {
  var MAP = [
    [/^Add (.+)$/, "Añadir $1"],
    [/^Insert from URL$/, "Insertar desde URL"],
    [/^Add$/, "Añadir"],
    [/^Copy$/, "Copiar"],
    [/^Colecciones$/, "Secciones de la web"],
    [/^Buscar todas$/, "Buscar en toda la web"],
    [/^Escribiendo en la colección (.+)$/, "Editando: $1"],
    [/^Cambios no guardados$/i, "Hay cambios sin publicar"],
    [/^Cambios guardados$/i, "Todo guardado ✓"],
    [/^Comprobar Vista Previa$/, "Actualizar vista previa"],
    [/^(.*?)\s*\(opcional\)(\s*\(opcional\))*$/, "$1 (si quieres)"],
  ];
  function fix(node) {
    var value = node.nodeValue;
    if (!value) return;
    var trimmed = value.trim();
    if (!trimmed || trimmed.length > 80) return;
    for (var i = 0; i < MAP.length; i++) {
      if (MAP[i][0].test(trimmed)) {
        node.nodeValue = value.replace(trimmed, trimmed.replace(MAP[i][0], MAP[i][1]));
        return;
      }
    }
  }
  function walk(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) fix(node);
  }
  new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.type === "characterData") fix(m.target);
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === 3) fix(n);
        else if (n.nodeType === 1) walk(n);
      });
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
