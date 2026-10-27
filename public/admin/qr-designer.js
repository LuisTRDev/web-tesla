/*
 * DISEÑADOR DE AFICHES Y QR CON LA IDENTIDAD DEL COLEGIO
 * Dibuja el QR y lo coloca en afiches con la tipografía y la "línea de energía" de la web. Todo es editable:
 *  - Afiche: formato, colores, foto de fondo, textos, beneficios, contacto…
 *  - QR: contenido (enlace, WhatsApp con mensaje, llamada, correo, mapa, texto, tarjeta de contacto, Wi-Fi), nivel de
 *    corrección, zona de silencio, forma y color de los puntos (con degradado), forma de las esquinas, escudo central
 *    (escudo, iniciales, texto, imagen o ninguno), recuadro, sombra, marco, etiqueta, inclinación y chispas.
 *  - Calidad: semáforo de lectura, prueba automática y prueba con la cámara.
 *  - Salidas: PNG (también transparente), SVG, PDF, series numeradas y todos los lugares en ZIP, animación WebM.
 * Usa qrcode-generator (MIT) para la matriz y jsQR (Apache-2.0) solo para las pruebas de lectura.
 * El QR siempre lleva zona de silencio; el semáforo avisa cuando una combinación es arriesgada.
 */
(function () {
  "use strict";

  /* ───────── paleta de la marca ───────── */
  var C = { noche: "#0D1230", marino: "#1F3557", rojo: "#E03C26", rojo700: "#B42D1B", filamento: "#FFB627", arco: "#A9ADFF", blanco: "#FFFFFF" };
  var LOGO_URL = "/images/logo-escudo.png";
  var PALETTE = {
    noche: ["Azul noche", "#0D1230"], marino: ["Azul marino", "#1F3557"], rojo700: ["Rojo oscuro", "#B42D1B"], rojo: ["Rojo", "#E03C26"],
    verde: ["Verde oscuro", "#14532D"], morado: ["Morado oscuro", "#3B1F6B"], negro: ["Negro", "#000000"], filamento: ["Amarillo", "#FFB627"], blanco: ["Blanco", "#FFFFFF"],
    azul: ["Azul intenso", "#1D4ED8"], turquesa: ["Turquesa oscuro", "#0F766E"], fucsia: ["Fucsia oscuro", "#9D174D"], naranja: ["Naranja oscuro", "#C2410C"], dorado: ["Dorado oscuro", "#92400E"],
  };
  var DARKS = ["noche", "marino", "azul", "turquesa", "verde", "morado", "fucsia", "rojo700", "rojo", "naranja", "dorado", "negro"];
  var BGS = { blanco: ["Blanco", "#FFFFFF"], crema: ["Crema", "#FFF8E8"], lila: ["Lila claro", "#EEF0FF"], transparente: ["Transparente (solo PNG y SVG)", null] };
  var EC_AREA = { L: 0, M: 4, Q: 7, H: 13 }; // % máximo seguro del área del escudo, medido con pruebas de lectura

  /* ───────── temas del afiche, acentos, formatos ───────── */
  var THEMES = {
    noche: { label: "Azul noche", bg: ["#0D1230", "#141A42"], text: "#FFFFFF", muted: "rgba(255,255,255,0.78)", dark: true, wave: "169,173,255", accent: "filamento", glow: true },
    marino: { label: "Azul marino", bg: ["#172843", "#1F3557"], text: "#FFFFFF", muted: "rgba(255,255,255,0.8)", dark: true, wave: "169,173,255", accent: "filamento", glow: true },
    rojo: { label: "Rojo del escudo", bg: ["#B42D1B", "#E03C26"], text: "#FFFFFF", muted: "rgba(255,255,255,0.88)", dark: true, wave: "255,255,255", accent: "filamento", glow: false },
    amarillo: { label: "Amarillo", bg: ["#FFB627", "#FFC654"], text: "#0D1230", muted: "rgba(13,18,48,0.8)", dark: false, wave: "13,18,48", accent: "noche", glow: false },
    claro: { label: "Claro", bg: ["#EEF0F7", "#FFFFFF"], text: "#0D1230", muted: "rgba(13,18,48,0.72)", dark: false, wave: "13,18,48", accent: "rojo", glow: false },
  };
  var ACCENTS = { filamento: ["Amarillo", "#FFB627", C.noche], rojo: ["Rojo", "#E03C26", "#FFFFFF"], arco: ["Lila", "#A9ADFF", C.noche], blanco: ["Blanco", "#FFFFFF", C.noche], noche: ["Azul noche", "#0D1230", "#FFFFFF"] };
  var FORMATS = {
    vertical: { label: "Tarjeta vertical 4:5 (afiche y redes)", w: 1080, h: 1350, layout: "stack", dpi: 150, note: "Proporción 4:5. Sirve para afiche, publicación de Instagram o Facebook y estados de WhatsApp.",
      defaults: { showLockup: true, showChips: true, showBullets: false, showDeadline: false, showWhatsapp: false, showAddress: false, showUrl: true, showFooter: true } },
    post: { label: "Cuadrado 1:1 (publicación)", w: 1080, h: 1080, layout: "stack", dpi: 150, note: "Cuadrado para publicaciones de redes. Muestra lo esencial.",
      defaults: { showLockup: true, showChips: false, showBullets: false, showDeadline: false, showWhatsapp: false, showAddress: false, showUrl: true, showFooter: false } },
    story: { label: "Historia 9:16 (Instagram, WhatsApp)", w: 1080, h: 1920, layout: "stack", dpi: 150, safe: { top: 190, bottom: 250 }, note: "Pantalla completa de celular. Deja libres arriba y abajo los espacios que tapa la aplicación.",
      defaults: { showLockup: true, showChips: true, showBullets: true, showDeadline: false, showWhatsapp: true, showAddress: false, showUrl: true, showFooter: false } },
    a5: { label: "Volante A5 completo (impresión)", w: 1748, h: 2480, layout: "stack", dpi: 300, note: "Hoja A5 a 300 dpi, lista para imprimir (descarga también en PDF). Trae todo: beneficios, contacto y QR.",
      defaults: { showLockup: true, showChips: true, showBullets: true, showDeadline: false, showWhatsapp: true, showAddress: true, showUrl: true, showFooter: false } },
    a4: { label: "Afiche A4 completo (impresión)", w: 2480, h: 3508, layout: "stack", dpi: 300, note: "Hoja A4 a 300 dpi, lista para imprimir (descarga también en PDF). Para pegar en puertas y paneles.",
      defaults: { showLockup: true, showChips: true, showBullets: true, showDeadline: false, showWhatsapp: true, showAddress: true, showUrl: true, showFooter: false } },
    banda: { label: "Banda horizontal (pie de volante A4)", w: 2480, h: 700, layout: "side", dpi: 300, note: "Ancho de una hoja A4 a 300 dpi. Pégala al pie de un volante diseñado por la imprenta.",
      defaults: { showLockup: true, showChips: false, showBullets: false, showDeadline: false, showWhatsapp: false, showAddress: false, showUrl: true, showFooter: true } },
    banner: { label: "Banner horizontal 16:9 (pantalla, Facebook)", w: 1920, h: 1080, layout: "side", dpi: 150, note: "Para portada de Facebook, pantallas o presentaciones.",
      defaults: { showLockup: true, showChips: true, showBullets: false, showDeadline: false, showWhatsapp: true, showAddress: false, showUrl: true, showFooter: false } },
    sticker: { label: "Sticker redondo (QR en círculo)", w: 1200, h: 1200, layout: "sticker", dpi: 300, note: "Para stickers redondos de 5 a 8 cm. El QR queda dentro de un círculo con borde.", defaults: {} },
    solo: { label: "QR solo (para tu diseño)", w: 1200, h: 1200, layout: "solo", dpi: 300, note: "Solo el QR, para insertarlo en un diseño hecho por otra persona. Descárgalo también en SVG (vectorial).", defaults: {} },
  };

  /* ───────── formas ───────── */
  function f(v) { return Math.round(v * 100) / 100; }
  /** Rectángulo con radio por esquina [arriba-izq, arriba-der, abajo-der, abajo-izq]. */
  function rrc(x, y, w, h, r) {
    var a = Math.min(r[0], w / 2, h / 2), b = Math.min(r[1], w / 2, h / 2), c = Math.min(r[2], w / 2, h / 2), d = Math.min(r[3], w / 2, h / 2);
    return "M" + f(x + a) + " " + f(y) + "H" + f(x + w - b) + (b ? "A" + f(b) + " " + f(b) + " 0 0 1 " + f(x + w) + " " + f(y + b) : "") + "V" + f(y + h - c) + (c ? "A" + f(c) + " " + f(c) + " 0 0 1 " + f(x + w - c) + " " + f(y + h) : "") + "H" + f(x + d) + (d ? "A" + f(d) + " " + f(d) + " 0 0 1 " + f(x) + " " + f(y + h - d) : "") + "V" + f(y + a) + (a ? "A" + f(a) + " " + f(a) + " 0 0 1 " + f(x + a) + " " + f(y) : "") + "Z";
  }
  function rr(x, y, w, h, r) { return rrc(x, y, w, h, [r, r, r, r]); }
  function circ(cx, cy, r) { return "M" + f(cx - r) + " " + f(cy) + "A" + f(r) + " " + f(r) + " 0 1 0 " + f(cx + r) + " " + f(cy) + "A" + f(r) + " " + f(r) + " 0 1 0 " + f(cx - r) + " " + f(cy) + "Z"; }
  function diamond(cx, cy, r) { return "M" + f(cx) + " " + f(cy - r) + "L" + f(cx + r) + " " + f(cy) + "L" + f(cx) + " " + f(cy + r) + "L" + f(cx - r) + " " + f(cy) + "Z"; }
  /** Estrella de 4 puntas con vértices curvos. `k` = qué tan "gorda" es (0.55 = estrella, 0.8 = casi rombo). */
  function star4(cx, cy, r, k) {
    var i = r * k * 0.6;
    return "M" + f(cx) + " " + f(cy - r) + "Q" + f(cx + i) + " " + f(cy - i) + " " + f(cx + r) + " " + f(cy) + "Q" + f(cx + i) + " " + f(cy + i) + " " + f(cx) + " " + f(cy + r) + "Q" + f(cx - i) + " " + f(cy + i) + " " + f(cx - r) + " " + f(cy) + "Q" + f(cx - i) + " " + f(cy - i) + " " + f(cx) + " " + f(cy - r) + "Z";
  }

  /* ───────── opciones del QR a partir del estado ───────── */
  function qopts(st) {
    var mono = !!st.mono;
    var pick = function (k) { return mono ? "#000000" : (PALETTE[k] || PALETTE.noche)[1]; };
    var bg = mono ? "#FFFFFF" : (BGS[st.qrBg] || BGS.blanco)[1];
    var logoMode = st.logoMode;
    return {
      shape: st.dotShape, scale: st.dotScale / 100, round: st.dotRound / 100,
      eyeOuter: st.eyeOuter, eyeInner: st.eyeInner, thick: { fino: 0.9, normal: 1, grueso: 1.15 }[st.ringThick] || 1,
      dot1: pick(st.dotColor), dot2: pick(st.dotColor2), dot3: !mono && st.dotColor3 && st.dotColor3 !== "none" ? pick(st.dotColor3) : null, grad: mono ? "none" : st.gradient,
      ring: pick(st.ringColor), ball: pick(st.ballColor), bg: bg, quiet: st.quiet,
      logo: { mode: logoMode, area: logoMode === "none" ? 0 : st.logoArea, shape: st.logoShape, border: st.logoBorder === "none" ? null : mono ? "#000000" : (PALETTE[st.logoBorder] || PALETTE.filamento)[1], borderW: { fino: 0.12, normal: 0.28, grueso: 0.45 }[st.logoBorderW] || 0.28 },
    };
  }

  /* ───────── matriz del QR y su geometría ───────── */
  function buildMatrix(text, ec) {
    // UTF-8 para que tildes y eñes (nombres como “Pérez”) se lean bien en cualquier celular
    if (qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs["UTF-8"]) qrcode.stringToBytes = qrcode.stringToBytesFuncs["UTF-8"];
    var qr = qrcode(0, ec || "H");
    qr.addData(text);
    qr.make();
    var n = qr.getModuleCount();
    var m = [];
    for (var r = 0; r < n; r++) {
      m[r] = [];
      for (var c = 0; c < n; c++) m[r][c] = qr.isDark(r, c);
    }
    return m;
  }

  function eyeRing(ex, ey, c, o) {
    var t = o.thick;
    var inner = 7 - 2 * t;
    var s = o.eyeOuter;
    if (s === "circle") return circ(ex + 3.5 * c, ey + 3.5 * c, 3.5 * c) + circ(ex + 3.5 * c, ey + 3.5 * c, (inner / 2) * c);
    var ro, ri;
    if (s === "square") { ro = [0, 0, 0, 0]; ri = [0, 0, 0, 0]; }
    else if (s === "leaf") { ro = [3 * c, 0.7 * c, 3 * c, 0.7 * c]; ri = [1.9 * c, 0.2 * c, 1.9 * c, 0.2 * c]; }
    else if (s === "drop") { ro = [0, 3.5 * c, 3.5 * c, 3.5 * c]; ri = [0, 2.3 * c, 2.3 * c, 2.3 * c]; }
    else { ro = [1.2 * c, 1.2 * c, 1.2 * c, 1.2 * c]; ri = [0.7 * c, 0.7 * c, 0.7 * c, 0.7 * c]; }
    return rrc(ex, ey, 7 * c, 7 * c, ro) + rrc(ex + t * c, ey + t * c, inner * c, inner * c, ri);
  }
  function eyeBall(ex, ey, c, o) {
    var cx = ex + 3.5 * c, cy = ey + 3.5 * c, s = o.eyeInner;
    if (s === "circle") return circ(cx, cy, 1.5 * c);
    if (s === "diamond") return diamond(cx, cy, 1.95 * c);
    if (s === "star") return star4(cx, cy, 2 * c, 1.3);
    if (s === "leaf") return rrc(ex + 2 * c, ey + 2 * c, 3 * c, 3 * c, [1.5 * c, 0.3 * c, 1.5 * c, 0.3 * c]);
    if (s === "square") return rr(ex + 2 * c, ey + 2 * c, 3 * c, 3 * c, 0);
    return rr(ex + 2 * c, ey + 2 * c, 3 * c, 3 * c, 0.7 * c);
  }
  function poly(pts) { return "M" + pts.map(function (p) { return f(p[0]) + " " + f(p[1]); }).join("L") + "Z"; }
  function dotPath(shape, o, x, y, c, nb) {
    var cx = x + c / 2, cy = y + c / 2;
    var d = c * o.scale;
    if (shape === "cross") {
      var L = d / 2 * 1.08, h = d * 0.27;
      return poly([[cx - h, cy - L], [cx + h, cy - L], [cx + h, cy - h], [cx + L, cy - h], [cx + L, cy + h], [cx + h, cy + h], [cx + h, cy + L], [cx - h, cy + L], [cx - h, cy + h], [cx - L, cy + h], [cx - L, cy - h], [cx - h, cy - h]]);
    }
    if (shape === "hex") {
      var hp = [];
      for (var k = 0; k < 6; k++) hp.push([cx + Math.cos(((k * 60 - 90) * Math.PI) / 180) * d * 0.56, cy + Math.sin(((k * 60 - 90) * Math.PI) / 180) * d * 0.56]);
      return poly(hp);
    }
    if (shape === "bolt") {
      return poly([[cx + 0.12 * d, cy - 0.56 * d], [cx - 0.36 * d, cy + 0.08 * d], [cx - 0.04 * d, cy + 0.08 * d], [cx - 0.14 * d, cy + 0.56 * d], [cx + 0.38 * d, cy - 0.14 * d], [cx + 0.04 * d, cy - 0.14 * d]]);
    }
    if (shape === "heart") {
      var u = d * 1.05;
      return "M" + f(cx) + " " + f(cy + 0.46 * u) + "C" + f(cx - 0.62 * u) + " " + f(cy + 0.02 * u) + " " + f(cx - 0.5 * u) + " " + f(cy - 0.46 * u) + " " + f(cx - 0.25 * u) + " " + f(cy - 0.46 * u) +
        "C" + f(cx - 0.1 * u) + " " + f(cy - 0.46 * u) + " " + f(cx) + " " + f(cy - 0.36 * u) + " " + f(cx) + " " + f(cy - 0.26 * u) +
        "C" + f(cx) + " " + f(cy - 0.36 * u) + " " + f(cx + 0.1 * u) + " " + f(cy - 0.46 * u) + " " + f(cx + 0.25 * u) + " " + f(cy - 0.46 * u) +
        "C" + f(cx + 0.5 * u) + " " + f(cy - 0.46 * u) + " " + f(cx + 0.62 * u) + " " + f(cy + 0.02 * u) + " " + f(cx) + " " + f(cy + 0.46 * u) + "Z";
    }
    if (shape === "square") return "M" + f(x) + " " + f(y) + "h" + f(c) + "v" + f(c) + "h" + f(-c) + "Z";
    if (shape === "circle") return circ(cx, cy, (c * o.scale) / 2);
    if (shape === "diamond") return diamond(cx, cy, (c * o.scale) / 2 * 1.08);
    if (shape === "star") return star4(cx, cy, (c * o.scale) / 2 * 1.12, 0.9);
    if (shape === "liquid") {
      // une los puntos vecinos: solo se redondean las esquinas sin vecinos a ambos lados
      var r = c * 0.5;
      var e = c * 0.03; // pequeño solape para que no se vea la costura
      var tl = !nb.up && !nb.left ? r : 0, tr = !nb.up && !nb.right ? r : 0, br = !nb.down && !nb.right ? r : 0, bl = !nb.down && !nb.left ? r : 0;
      return rrc(x - (nb.left ? e : 0), y - (nb.up ? e : 0), c + (nb.left ? e : 0) + (nb.right ? e : 0), c + (nb.up ? e : 0) + (nb.down ? e : 0), [tl, tr, br, bl]);
    }
    var ins = (c * (1 - o.scale)) / 2;
    return rr(x + ins, y + ins, c * o.scale, c * o.scale, c * o.round);
  }

  /** Geometría del QR dentro de un cuadrado (x, y, size) que YA incluye la zona de silencio. */
  function geometry(m, x, y, size, o) {
    var n = m.length;
    var q = o.quiet;
    var cell = size / (n + q * 2);
    var ox = x + q * cell, oy = y + q * cell;
    var hasLogo = o.logo.mode !== "none" && o.logo.area > 0;
    var plateMods = 0;
    if (hasLogo) {
      plateMods = Math.max(3, Math.round(n * Math.sqrt(o.logo.area / 100)));
      if ((n - plateMods) % 2 !== 0) plateMods++;
    }
    var ps = (n - plateMods) / 2;
    var plate = { x: ox + ps * cell, y: oy + ps * cell, size: plateMods * cell };
    var inFinder = function (r, c) { return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7); };
    var inPlate = function (r, c) { return hasLogo && r >= ps - 1 && r < ps + plateMods + 1 && c >= ps - 1 && c < ps + plateMods + 1; };
    var on = function (r, c) { return r >= 0 && c >= 0 && r < n && c < n && m[r][c] && !inFinder(r, c) && !inPlate(r, c); };
    var dots = [];
    var mid = (n - 1) / 2;
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (!on(r, c)) continue;
        var nb = { up: on(r - 1, c), down: on(r + 1, c), left: on(r, c - 1), right: on(r, c + 1) };
        dots.push({ d: dotPath(o.shape, o, ox + c * cell, oy + r * cell, cell, nb), r2: (r - mid) * (r - mid) + (c - mid) * (c - mid) });
      }
    }
    var rings = "", balls = "";
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(function (pos) {
      var ex = ox + pos[1] * cell, ey = oy + pos[0] * cell;
      rings += eyeRing(ex, ey, cell, o);
      balls += eyeBall(ex, ey, cell, o);
    });
    return { dots: dots, rings: rings, balls: balls, plate: plate, cell: cell, n: n, hasLogo: hasLogo, box: { x: ox, y: oy, size: n * cell } };
  }

  /* ───────── escudo central (mapa de bits) ───────── */
  var logoCache = {};
  function tint(canvas, color) {
    var g = canvas.getContext("2d");
    g.globalCompositeOperation = "source-in";
    g.fillStyle = color;
    g.fillRect(0, 0, canvas.width, canvas.height);
    g.globalCompositeOperation = "source-over";
  }
  function bitmapFromImage(img, color) {
    if (!img) return null;
    var max = 520;
    var ratio = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    var c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.naturalWidth * ratio));
    c.height = Math.max(1, Math.round(img.naturalHeight * ratio));
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    if (color) tint(c, color);
    return c;
  }
  function textBitmap(text, color) {
    var c = document.createElement("canvas");
    c.width = 480;
    c.height = 480;
    var g = c.getContext("2d");
    var size = 300;
    g.font = '800 ' + size + 'px "Bricolage Grotesque", sans-serif';
    while (g.measureText(text).width > 440 && size > 40) { size -= 10; g.font = '800 ' + size + 'px "Bricolage Grotesque", sans-serif'; }
    g.fillStyle = color;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, 240, 250);
    return c;
  }
  /** Mapa de bits del centro según el modo (escudo, iniciales, texto, imagen). Devuelve null si no hay. */
  function logoBitmap(st) {
    var mode = st.logoMode;
    if (mode === "none") return null;
    var mono = st.mono || st.logoMono;
    var color = mono ? "#000000" : null;
    var key = [mode, st.logoText, mono, mode === "image" ? st.logoUpData.length : 0, st.logoImg ? 1 : 0].join("|");
    if (logoCache[key]) return logoCache[key];
    var bmp = null;
    if (mode === "shield") bmp = bitmapFromImage(st.logoImg, color);
    else if (mode === "initials") bmp = textBitmap("NT", color || C.marino);
    else if (mode === "text") bmp = textBitmap(String(st.logoText || "").trim().slice(0, 6).toUpperCase() || "QR", color || C.marino);
    else if (mode === "image") bmp = bitmapFromImage(st.logoUp, color);
    if (bmp) logoCache[key] = bmp;
    return bmp;
  }

  function platePath(p, shape) {
    if (shape === "circle") return circ(p.x + p.size / 2, p.y + p.size / 2, p.size / 2);
    if (shape === "square") return rr(p.x, p.y, p.size, p.size, 0);
    return rr(p.x, p.y, p.size, p.size, p.size * 0.2);
  }
  function dotFill(ctx, o, box) {
    if (o.grad === "none" || (o.dot1 === o.dot2 && !o.dot3)) return o.dot1;
    var g;
    if (o.grad === "radial") g = ctx.createRadialGradient(box.x + box.size / 2, box.y + box.size / 2, 0, box.x + box.size / 2, box.y + box.size / 2, box.size * 0.7);
    else if (o.grad === "horizontal") g = ctx.createLinearGradient(box.x, box.y, box.x + box.size, box.y);
    else if (o.grad === "vertical") g = ctx.createLinearGradient(box.x, box.y, box.x, box.y + box.size);
    else g = ctx.createLinearGradient(box.x, box.y, box.x + box.size, box.y + box.size);
    g.addColorStop(0, o.dot1);
    if (o.dot3) g.addColorStop(0.5, o.dot3);
    g.addColorStop(1, o.dot2);
    return g;
  }
  /** Marca de agua: el escudo (o el centro elegido) grande y difuminado detrás de los puntos. */
  function drawWatermark(ctx, st, o, box) {
    var color = o.dot1;
    var key = "wm|" + color + "|" + (st.logoImg ? 1 : 0);
    var bmp = logoCache[key];
    if (!bmp) { bmp = bitmapFromImage(st.logoImg, color); if (bmp) logoCache[key] = bmp; }
    if (!bmp) return;
    var side = box.size * 0.82;
    var ratio = bmp.width / bmp.height;
    var w = ratio >= 1 ? side : side * ratio, h = ratio >= 1 ? side / ratio : side;
    ctx.save();
    ctx.globalAlpha = Math.max(0.04, Math.min(0.3, st.wmarkAlpha / 100));
    try { ctx.filter = "blur(" + Math.round(box.size * 0.006) + "px)"; } catch (e) { /* sin desenfoque */ }
    ctx.drawImage(bmp, box.x + (box.size - w) / 2, box.y + (box.size - h) / 2, w, h);
    ctx.restore();
  }

  /** Dibuja el QR completo (fondo, puntos, esquinas, escudo). opts: background, radius, reveal (0–1 para la animación). */
  function drawQR(ctx, m, x, y, size, st, opts) {
    opts = opts || {};
    var o = qopts(st);
    var g = geometry(m, x, y, size, o);
    if (opts.background !== false && o.bg) {
      ctx.fillStyle = o.bg;
      ctx.fill(new Path2D(rr(x, y, size, size, opts.radius || 0)));
    }
    var list = g.dots;
    if (st.wmark) drawWatermark(ctx, st, o, g.box);
    if (opts.reveal !== undefined && opts.reveal < 1) {
      var sorted = list.slice().sort(function (a, b) { return a.r2 - b.r2; });
      list = sorted.slice(0, Math.round(sorted.length * opts.reveal));
    }
    ctx.fillStyle = dotFill(ctx, o, g.box);
    ctx.fill(new Path2D(list.map(function (d) { return d.d; }).join("")));
    ctx.fillStyle = o.ring;
    ctx.fill(new Path2D(g.rings), "evenodd");
    ctx.fillStyle = o.ball;
    ctx.fill(new Path2D(g.balls));
    if (g.hasLogo && (opts.reveal === undefined || opts.reveal >= 0.5)) {
      var p = g.plate;
      if (o.logo.shape !== "none") {
        ctx.fillStyle = o.bg || "#FFFFFF";
        ctx.fill(new Path2D(platePath(p, o.logo.shape)));
        if (o.logo.border) {
          ctx.lineWidth = Math.max(2, g.cell * o.logo.borderW);
          ctx.strokeStyle = o.logo.border;
          var inset = ctx.lineWidth / 2;
          ctx.stroke(new Path2D(platePath({ x: p.x + inset, y: p.y + inset, size: p.size - 2 * inset }, o.logo.shape)));
        }
      }
      var bmp = logoBitmap(st);
      if (bmp) {
        var box = p.size * (st.logoMode === "shield" ? 0.74 : 0.7);
        var ratio = bmp.width / bmp.height;
        var lw = ratio >= 1 ? box : box * ratio;
        var lh = ratio >= 1 ? box / ratio : box;
        ctx.drawImage(bmp, p.x + (p.size - lw) / 2, p.y + (p.size - lh) / 2, lw, lh);
      }
    }
  }

  /* ───────── recuadro con decoración: sombra, marco, inclinación, chispas, etiqueta ───────── */
  function ribbonHeight(st, size) { return String(st.ribbonText || "").trim() ? size * 0.13 : 0; }
  function drawRibbon(ctx, st, P, cx, plateY, size, top) {
    var text = String(st.ribbonText || "").trim();
    var rh = size * 0.13;
    ctx.font = fontStr(800, rh * 0.5, "Figtree");
    var tw = ctx.measureText(text).width + size * 0.18;
    var overlap = size * 0.02;
    var ry = top ? plateY - rh + overlap : plateY + size - overlap;
    var path = new Path2D(rr(cx - tw / 2, ry, tw, rh, rh / 2));
    ctx.fillStyle = P.accentHex;
    ctx.fill(path);
    if (st.ribbonStyle === "burbuja") {
      var a = rh * 0.28;
      var py = top ? ry + rh : ry;
      var dir = top ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(cx - a, py - dir * 1);
      ctx.lineTo(cx + a, py - dir * 1);
      ctx.lineTo(cx, py + dir * a * 1.2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = P.onAccent;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(text, cx, ry + rh * 0.66);
    ctx.textAlign = "left";
  }
  var SPARK_COLORS = { acento: null, filamento: "#FFB627", blanco: "#FFFFFF", rojo: "#E03C26", arco: "#A9ADFF", noche: "#0D1230" };
  function sparkHex(st, P) { return st.mono ? "#000000" : SPARK_COLORS[st.sparkColor] || P.accentHex; }
  function sparkReach(st, size) { return size * 0.2 * (st.sparkSize / 100); }
  /** Chispas alrededor del recuadro: rayos quebrados, destellos de 4 puntas o estelas de puntos. */
  function drawSparks(ctx, x, y, size, P, st) {
    var cx = x + size / 2, cy = y + size / 2;
    var color = sparkHex(st, P);
    var sc = st.sparkSize / 100;
    var n = Math.max(4, Math.min(20, Number(st.sparkCount) || 8));
    var style = st.sparkStyle || "rayos";
    var seed = 7;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 0.035;
    ctx.lineWidth = Math.max(3, size * 0.012 * sc);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (var i = 0; i < n; i++) {
      var deg = (i + 0.5) * (360 / n) + (rnd() - 0.5) * (180 / n);
      var a = (deg * Math.PI) / 180;
      var cos = Math.cos(a), sin = Math.sin(a);
      var edge = (size / 2) / Math.max(Math.abs(cos), Math.abs(sin));
      var sx = cx + cos * (edge + size * 0.045), sy = cy + sin * (edge + size * 0.045);
      var kind = style === "mixto" ? ["rayos", "destellos", "puntos"][i % 3] : style;
      // en la animación (st.__t, en segundos) cada chispa parpadea a su propio ritmo
      ctx.globalAlpha = st.__t === undefined ? 1 : 0.15 + 0.85 * Math.pow(0.5 + 0.5 * Math.sin(st.__t * 7 + i * 2.3), 2);
      if (kind === "rayos") {
        var len = size * (i % 2 ? 0.1 : 0.14) * sc;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + cos * len * 0.45 - sin * len * 0.2, sy + sin * len * 0.45 + cos * len * 0.2);
        ctx.lineTo(sx + cos * len * 0.55 + sin * len * 0.14, sy + sin * len * 0.55 - cos * len * 0.14);
        ctx.lineTo(sx + cos * len, sy + sin * len);
        ctx.stroke();
      } else if (kind === "destellos") {
        var r = size * (i % 2 ? 0.035 : 0.055) * sc;
        ctx.fill(new Path2D(star4(sx + cos * r, sy + sin * r, r, 0.55)));
      } else {
        for (var k = 0; k < 3; k++) {
          ctx.beginPath();
          ctx.arc(sx + cos * size * 0.035 * k * sc, sy + sin * size * 0.035 * k * sc, Math.max(1.5, size * (0.016 - k * 0.0045) * sc), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }
  /** Dibujo de fondo del recuadro en el color del borde, muy suave para no estorbar la lectura. */
  function drawPlatePattern(ctx, kind, x, y, size, radius, color) {
    ctx.save();
    ctx.clip(new Path2D(rr(x, y, size, size, radius)));
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(1.5, size * 0.005);
    var i, j;
    if (kind === "ondas") {
      for (i = 0; i < 14; i++) {
        ctx.beginPath();
        for (j = 0; j <= 40; j++) {
          var px = x + (size * j) / 40, py = y + (size * (i + 0.5)) / 14 + Math.sin(j * 0.45 + i * 0.6) * size * 0.022;
          if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        }
        ctx.stroke();
      }
    } else if (kind === "rejilla") {
      for (i = -20; i < 20; i++) {
        ctx.beginPath(); ctx.moveTo(x + i * size * 0.07, y); ctx.lineTo(x + i * size * 0.07 + size, y + size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + i * size * 0.07 + size, y); ctx.lineTo(x + i * size * 0.07, y + size); ctx.stroke();
      }
    } else if (kind === "puntos") {
      for (i = 0; i < 20; i++) for (j = 0; j < 20; j++) { ctx.beginPath(); ctx.arc(x + (i + 0.5) * size / 20, y + (j + 0.5) * size / 20, size * 0.007, 0, Math.PI * 2); ctx.fill(); }
    } else if (kind === "rayos") {
      for (i = 0; i < 36; i++) {
        var a = (i * Math.PI) / 18;
        ctx.beginPath(); ctx.moveTo(x + size / 2, y + size / 2); ctx.lineTo(x + size / 2 + Math.cos(a) * size, y + size / 2 + Math.sin(a) * size); ctx.stroke();
      }
    }
    ctx.restore();
  }
  /** Insignia en una esquina del recuadro (por ejemplo "2027"). Su tamaño nunca llega a las esquinas de posición del código. */
  function drawBadge(ctx, st, P, x, y, size, pad, n, accent) {
    var text = String(st.badgeText).trim();
    var cell = (size - 2 * pad) / (n + st.quiet * 2);
    var r = Math.min(size * 0.1, (pad + st.quiet * cell) * 0.92);
    var pos = st.badgePos || "sd";
    var bx = pos.charAt(1) === "d" ? x + size : x, by = pos.charAt(0) === "s" ? y : y + size;
    var shape = st.badgeShape || "circulo";
    var path;
    if (shape === "sol") {
      var pts = [];
      for (var k = 0; k < 24; k++) { var rad = k % 2 ? r * 0.82 : r * 1.06; pts.push([bx + Math.cos((k * Math.PI) / 12) * rad, by + Math.sin((k * Math.PI) / 12) * rad]); }
      path = poly(pts);
    } else if (shape === "rombo") path = diamond(bx, by, r * 1.12);
    else path = circ(bx, by, r);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = size * 0.02;
    ctx.shadowOffsetY = size * 0.008;
    ctx.fillStyle = st.mono ? "#000000" : P.accentHex;
    ctx.fill(new Path2D(path));
    ctx.restore();
    ctx.fillStyle = st.mono ? "#FFFFFF" : P.onAccent;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    var fs = fitSize(ctx, text, r * 1.45, r * 0.8, 800, "Bricolage Grotesque");
    ctx.fillText(text, bx, by + fs * 0.34);
    ctx.textAlign = "left";
  }
  function plateWithQR(ctx, m, x, y, size, st, P) {
    var o = qopts(st);
    var radius = size * (st.plateRadius / 100);
    var pad = size * 0.022;
    var cx = x + size / 2, cy = y + size / 2;
    var rh = ribbonHeight(st, size);
    var top = st.ribbonPos === "top";
    ctx.save();
    if (st.tilt) {
      ctx.translate(cx, cy);
      ctx.rotate((st.tilt * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }
    var gl = { none: 0, suave: 1, fuerte: 2 }[st.glow] || 0;
    if (gl) {
      ctx.save();
      ctx.shadowColor = st.mono ? "#000000" : SPARK_COLORS[st.glowColor] || P.accentHex;
      ctx.shadowBlur = size * (gl === 2 ? 0.22 : 0.12);
      ctx.fillStyle = o.bg || C.blanco;
      for (var gi = 0; gi < (gl === 2 ? 3 : 2); gi++) ctx.fill(new Path2D(rr(x, y, size, size, radius)));
      ctx.restore();
    }
    var sh = { none: 0, soft: 1, strong: 2 }[st.shadow] || 0;
    if (sh) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0," + (sh === 2 ? 0.62 : 0.4) + ")";
      ctx.shadowBlur = size * (sh === 2 ? 0.14 : 0.09);
      ctx.shadowOffsetY = size * (sh === 2 ? 0.05 : 0.033);
      ctx.fillStyle = o.bg || C.blanco;
      ctx.fill(new Path2D(rr(x, y, size, size, radius)));
      ctx.restore();
    }
    ctx.fillStyle = o.bg || C.blanco;
    ctx.fill(new Path2D(rr(x, y, size, size, radius)));
    var accent = st.mono ? "#000000" : st.frameColor && st.frameColor !== "acento" ? (PALETTE[st.frameColor] || [0, P.accentHex])[1] : P.accentHex;
    if (st.plateBg && st.plateBg !== "none" && !st.mono) drawPlatePattern(ctx, st.plateBg, x, y, size, radius, accent);
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(4, size * 0.015 * ({ fino: 0.5, normal: 1, grueso: 2.2 }[st.frameW] || 1));
    if (st.frame === "dashed") ctx.setLineDash([size * 0.04, size * 0.025]);
    ctx.stroke(new Path2D(rr(x + ctx.lineWidth / 2, y + ctx.lineWidth / 2, size - ctx.lineWidth, size - ctx.lineWidth, radius)));
    ctx.setLineDash([]);
    if (st.frame === "double") {
      var gap = size * 0.03;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = Math.max(2, size * 0.007);
      ctx.stroke(new Path2D(rr(x - gap, y - gap, size + 2 * gap, size + 2 * gap, radius + gap)));
      ctx.globalAlpha = 1;
    }
    drawQR(ctx, m, x + pad, y + pad, size - 2 * pad, st, { background: false, reveal: st.__reveal });
    if (String(st.badgeText || "").trim()) drawBadge(ctx, st, P, x, y, size, pad, m.length, accent);
    if (rh) drawRibbon(ctx, st, P, cx, y, size, top);
    if (st.sparks) drawSparks(ctx, x, y, size, P, st);
    ctx.restore();
  }

  /* ───────── texto ───────── */
  function fontStr(weight, size, family) { return weight + " " + Math.round(size) + 'px "' + family + '", sans-serif'; }
  function fitSize(ctx, text, maxWidth, size, weight, family) {
    var s = size;
    ctx.font = fontStr(weight, s, family);
    while (ctx.measureText(text).width > maxWidth && s > 10) { s -= 2; ctx.font = fontStr(weight, s, family); }
    return s;
  }
  function wrapLines(ctx, text, maxWidth, maxLines) {
    var words = String(text || "").split(/\s+/).filter(Boolean);
    var lines = [];
    var line = "";
    words.forEach(function (word) {
      var test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test;
    });
    if (line) lines.push(line);
    if (maxLines && lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      var last = lines[maxLines - 1];
      while (ctx.measureText(last + "…").width > maxWidth && last.length > 1) last = last.slice(0, -1);
      lines[maxLines - 1] = last + "…";
    }
    return lines;
  }
  function splitLines(text) { return String(text || "").split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean); }

  /* ───────── fondo del afiche ───────── */
  function palette(st) {
    var T = THEMES[st.theme] || THEMES.noche;
    var a = ACCENTS[st.accent] || ACCENTS.filamento;
    return { theme: T, text: T.text, muted: T.muted, accentHex: a[1], onAccent: a[2], dark: T.dark };
  }
  function drawBackground(ctx, w, h, st, P) {
    var T = P.theme;
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, T.bg[0]);
    grad.addColorStop(1, T.bg[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    if (st.photo) {
      var ir = st.photo.naturalWidth / st.photo.naturalHeight;
      var cr = w / h;
      var sw = ir > cr ? st.photo.naturalHeight * cr : st.photo.naturalWidth;
      var sh = ir > cr ? st.photo.naturalHeight : st.photo.naturalWidth / cr;
      ctx.drawImage(st.photo, (st.photo.naturalWidth - sw) / 2, (st.photo.naturalHeight - sh) / 2, sw, sh, 0, 0, w, h);
      ctx.globalAlpha = st.photoOverlay / 100;
      ctx.fillStyle = T.bg[0];
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      return;
    }
    if (T.glow) {
      var a = ctx.createRadialGradient(w * 0.85, h * 0.1, 0, w * 0.85, h * 0.1, Math.max(w, h) * 0.55);
      a.addColorStop(0, "rgba(255,182,39,0.26)");
      a.addColorStop(1, "rgba(255,182,39,0)");
      ctx.fillStyle = a;
      ctx.fillRect(0, 0, w, h);
      var b = ctx.createRadialGradient(w * 0.08, h * 0.88, 0, w * 0.08, h * 0.88, Math.max(w, h) * 0.6);
      b.addColorStop(0, "rgba(169,173,255,0.28)");
      b.addColorStop(1, "rgba(169,173,255,0)");
      ctx.fillStyle = b;
      ctx.fillRect(0, 0, w, h);
    }
  }
  function drawWaves(ctx, w, h, P, top, bottom, accentY, u) {
    var lines = 9;
    for (var i = 0; i < lines; i++) {
      var p = i / (lines - 1);
      var base = top + (bottom - top) * p;
      ctx.beginPath();
      for (var x = -10; x <= w + 10; x += 12 * u) {
        var nx = x / w;
        var y = base + Math.sin(nx * 4.2 + i * 0.55) * (14 + p * 20) * u + Math.sin(nx * 9.5 - i * 1.2) * 5 * u;
        if (x === -10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(" + P.theme.wave + "," + (P.dark ? 0.08 + p * 0.1 : 0.05 + p * 0.06) + ")";
      ctx.lineWidth = 1.5 * u;
      ctx.stroke();
    }
    ctx.beginPath();
    for (var x2 = -10; x2 <= w + 10; x2 += 8 * u) {
      var n2 = x2 / w;
      var y2 = accentY + Math.sin(n2 * 4.2 + 3.1) * 26 * u + Math.sin(n2 * 9.5) * 6 * u;
      if (x2 === -10) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
    }
    ctx.save();
    ctx.shadowColor = P.accentHex;
    ctx.shadowBlur = 20 * u;
    ctx.strokeStyle = P.accentHex;
    ctx.globalAlpha = P.dark ? 0.95 : 0.8;
    ctx.lineWidth = 3 * u;
    ctx.stroke();
    ctx.restore();
  }

  /* ───────── elementos del afiche ───────── */
  function ax(st, x, w) { return st.align === "center" ? x + w / 2 : x; }
  function setAlign(ctx, st) { ctx.textAlign = st.align === "center" ? "center" : "left"; ctx.textBaseline = "alphabetic"; }

  function lockupItem(ctx, st, u, P, site) {
    var h = 112 * u;
    var logo = st.logoImg;
    var ratio = logo ? logo.naturalWidth / logo.naturalHeight : 0.83;
    return { h: h, draw: function (x, y, w) {
      var name = String((site && site.shortName) || "Nikola Tesla").toUpperCase();
      var kicker = (site && site.kicker) || "";
      ctx.font = fontStr(800, h * 0.3, "Bricolage Grotesque");
      var nameW = ctx.measureText(name).width;
      ctx.font = fontStr(500, h * 0.17, "Figtree");
      var kickW = ctx.measureText(kicker).width;
      var logoW = h * ratio;
      var total = logoW + 22 * u + Math.max(nameW, kickW);
      var sx = st.align === "center" ? x + (w - total) / 2 : x;
      if (logo) ctx.drawImage(logo, sx, y, logoW, h);
      var tx = sx + logoW + 22 * u;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = P.text;
      ctx.font = fontStr(800, h * 0.3, "Bricolage Grotesque");
      ctx.fillText(name, tx, y + h * 0.5);
      ctx.fillStyle = P.muted;
      ctx.font = fontStr(500, h * 0.17, "Figtree");
      ctx.fillText(kicker, tx, y + h * 0.5 + h * 0.24);
    } };
  }
  function titleItem(ctx, st, u, P, w) {
    var lines = [st.title1, st.title2].map(function (s) { return String(s || "").trim(); }).filter(Boolean);
    if (!lines.length) return null;
    if (st.titleUpper) lines = lines.map(function (s) { return s.toUpperCase(); });
    var scale = st.titleScale / 100;
    var sizes = lines.map(function (l, i) { return fitSize(ctx, l, w, (lines.length === 1 ? 170 : i === 0 ? 150 : 185) * u * scale, 800, "Bricolage Grotesque"); });
    var h = sizes.reduce(function (s, v) { return s + v * 0.92; }, 0) + sizes[sizes.length - 1] * 0.08;
    return { h: h, draw: function (x, y, cw) {
      setAlign(ctx, st);
      ctx.fillStyle = P.text;
      var cy = y;
      lines.forEach(function (l, i) {
        ctx.font = fontStr(800, sizes[i], "Bricolage Grotesque");
        ctx.fillText(l, ax(st, x, cw), cy + sizes[i] * 0.8);
        cy += sizes[i] * 0.92;
      });
    } };
  }
  function subtitleItem(ctx, st, u, P, w) {
    if (!String(st.subtitle || "").trim()) return null;
    var size = 46 * u;
    ctx.font = fontStr(700, size, "Figtree");
    var lines = wrapLines(ctx, st.subtitle, w, 2);
    return { h: lines.length * size * 1.18, draw: function (x, y, cw) {
      setAlign(ctx, st);
      ctx.font = fontStr(700, size, "Figtree");
      ctx.fillStyle = P.dark ? P.accentHex : P.text;
      lines.forEach(function (l, i) { ctx.fillText(l, ax(st, x, cw), y + size * 0.88 + i * size * 1.18); });
    } };
  }
  function chipsItem(ctx, st, u, P, w) {
    var chips = String(st.chips || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (!chips.length) return null;
    var size = 30 * u, padX = 26 * u, ph = 58 * u, gap = 14 * u;
    ctx.font = fontStr(700, size, "Figtree");
    var rows = [[]];
    var rowW = 0;
    chips.forEach(function (c) {
      var cw = ctx.measureText(c).width + padX * 2;
      if (rowW + cw > w && rows[rows.length - 1].length) { rows.push([]); rowW = 0; }
      rows[rows.length - 1].push({ text: c, w: cw });
      rowW += cw + gap;
    });
    return { h: rows.length * ph + (rows.length - 1) * gap, draw: function (x, y, cw) {
      ctx.font = fontStr(700, size, "Figtree");
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      rows.forEach(function (row, ri) {
        var total = row.reduce(function (s, c) { return s + c.w; }, 0) + (row.length - 1) * gap;
        var cx = st.align === "center" ? x + (cw - total) / 2 : x;
        var cy = y + ri * (ph + gap);
        row.forEach(function (c) {
          ctx.lineWidth = 2.5 * u;
          ctx.strokeStyle = P.accentHex;
          ctx.fillStyle = P.dark ? "rgba(255,255,255,0.08)" : "rgba(13,18,48,0.05)";
          var path = new Path2D(rr(cx, cy, c.w, ph, ph / 2));
          ctx.fill(path);
          ctx.stroke(path);
          ctx.fillStyle = P.text;
          ctx.fillText(c.text, cx + c.w / 2, cy + ph * 0.66);
          cx += c.w + gap;
        });
      });
      ctx.textAlign = "left";
    } };
  }
  function bulletsItem(ctx, st, u, P, w) {
    var list = splitLines(st.bullets);
    if (!list.length) return null;
    var size = 38 * u, icon = 44 * u, gap = 18 * u;
    ctx.font = fontStr(600, size, "Figtree");
    var textW = w - icon - 20 * u;
    var rows = list.map(function (t) { return wrapLines(ctx, t, textW, 2); });
    var h = rows.reduce(function (s, r) { return s + Math.max(icon, r.length * size * 1.2); }, 0) + gap * (rows.length - 1);
    return { h: h, draw: function (x, y, cw) {
      ctx.font = fontStr(600, size, "Figtree");
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      var maxLine = 0;
      rows.forEach(function (r) { r.forEach(function (l) { maxLine = Math.max(maxLine, ctx.measureText(l).width); }); });
      var blockW = Math.min(cw, icon + 20 * u + maxLine);
      var bx = st.align === "center" ? x + (cw - blockW) / 2 : x;
      var cy = y;
      rows.forEach(function (r) {
        var rh = Math.max(icon, r.length * size * 1.2);
        ctx.fillStyle = P.accentHex;
        ctx.beginPath();
        ctx.arc(bx + icon / 2, cy + rh / 2, icon / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = P.onAccent;
        ctx.lineWidth = 5 * u;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(bx + icon * 0.27, cy + rh / 2);
        ctx.lineTo(bx + icon * 0.44, cy + rh / 2 + icon * 0.17);
        ctx.lineTo(bx + icon * 0.74, cy + rh / 2 - icon * 0.17);
        ctx.stroke();
        ctx.fillStyle = P.text;
        var ty = cy + (rh - r.length * size * 1.2) / 2 + size * 0.92;
        r.forEach(function (l, i) { ctx.fillText(l, bx + icon + 20 * u, ty + i * size * 1.2); });
        cy += rh + gap;
      });
    } };
  }
  function qrItem(ctx, st, u, P, w, matrix, maxSize) {
    var base = Math.min(w * 0.7, 560 * u);
    var size = Math.min(base * (st.qrSize / 100), maxSize || 1e9);
    var label = String(st.qrLabel || "").trim();
    var lsize = 32 * u;
    var lh = label ? lsize * 1.9 : 0;
    var rh = ribbonHeight(st, size) * 0.9;
    var top = st.ribbonPos === "top";
    // las chispas se extienden fuera del recuadro: se les reserva espacio para que no pisen otros elementos
    var sp = st.sparks ? sparkReach(st, size) : 0;
    return { h: size + lh + rh + 2 * sp, qr: true, qrOffset: top ? rh : 0, draw: function (x, y, cw) {
      var py = y + sp + (top ? rh : 0);
      plateWithQR(ctx, matrix, x + (cw - size) / 2, py, size, st, P);
      if (label) {
        ctx.font = fontStr(600, lsize, "Figtree");
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = P.muted;
        ctx.fillText(label, x + cw / 2, py + size + (top ? 0 : rh) + lsize * 1.45);
        ctx.textAlign = "left";
      }
    } };
  }
  function deadlineItem(ctx, st, u, P, w) {
    var text = String(st.deadline || "").trim();
    if (!text) return null;
    var fs = fitSize(ctx, text, w - 70 * u, 34 * u, 700, "Figtree");
    ctx.font = fontStr(700, fs, "Figtree");
    var pw = Math.min(w, ctx.measureText(text).width + 70 * u);
    var ph = 66 * u;
    return { h: ph, draw: function (x, y, cw) {
      var px = st.align === "center" ? x + (cw - pw) / 2 : x;
      ctx.lineWidth = 3 * u;
      ctx.strokeStyle = P.accentHex;
      ctx.fillStyle = P.dark ? "rgba(255,255,255,0.1)" : "rgba(13,18,48,0.06)";
      var path = new Path2D(rr(px, y, pw, ph, ph / 2));
      ctx.fill(path);
      ctx.stroke(path);
      ctx.font = fontStr(700, fs, "Figtree");
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = P.text;
      ctx.fillText(text, px + pw / 2, y + ph * 0.66);
      ctx.textAlign = "left";
    } };
  }
  function contactItem(ctx, st, u, P, w, oneLine) {
    var rows = [];
    if (st.showWhatsapp && String(st.whatsapp || "").trim()) rows.push(["WhatsApp", String(st.whatsapp).trim()]);
    if (st.showAddress && String(st.address || "").trim()) rows.push(["", String(st.address).trim()]);
    splitLines(st.extra).forEach(function (l) { rows.push(["", l]); });
    if (!rows.length) return null;
    var size = 32 * u, lh = size * 1.45;
    if (oneLine) rows = [["", rows.map(function (r) { return (r[0] ? r[0] + " " : "") + r[1]; }).join("  ·  ")]];
    var wrapped = [];
    ctx.font = fontStr(600, size, "Figtree");
    rows.forEach(function (r) {
      var lines = wrapLines(ctx, (r[0] ? r[0] + ": " : "") + r[1], w, 2);
      lines.forEach(function (l) { wrapped.push({ text: l }); });
    });
    return { h: wrapped.length * lh, draw: function (x, y, cw) {
      setAlign(ctx, st);
      ctx.font = fontStr(600, size, "Figtree");
      ctx.fillStyle = P.muted;
      wrapped.forEach(function (l, i) { ctx.fillText(l.text, ax(st, x, cw), y + size * 1.05 + i * lh); });
    } };
  }
  function urlItem(ctx, st, u, P, w) {
    var text = st.display;
    if (!text) return null;
    var size = fitSize(ctx, text, w - 60 * u, 36 * u, 700, "Figtree");
    ctx.font = fontStr(700, size, "Figtree");
    var pw = Math.min(w, ctx.measureText(text).width + 60 * u);
    var ph = 72 * u;
    return { h: ph, draw: function (x, y, cw) {
      var px = st.align === "center" ? x + (cw - pw) / 2 : x;
      ctx.fillStyle = P.accentHex;
      ctx.fill(new Path2D(rr(px, y, pw, ph, ph / 2)));
      ctx.font = fontStr(700, size, "Figtree");
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = P.onAccent;
      ctx.fillText(text, px + pw / 2, y + ph * 0.66);
      ctx.textAlign = "left";
    } };
  }
  function footerItem(ctx, st, u, P, w) {
    var text = String(st.footer || "").trim();
    if (!text) return null;
    var size = fitSize(ctx, text, w, 30 * u, 600, "Figtree");
    return { h: size * 1.3, draw: function (x, y, cw) {
      setAlign(ctx, st);
      ctx.font = fontStr(600, size, "Figtree");
      ctx.fillStyle = P.muted;
      ctx.fillText(text, ax(st, x, cw), y + size);
    } };
  }
  function present(list) { return list.filter(Boolean); }

  /* ───────── composición ───────── */
  function drawStack(ctx, st, fmt, P, matrix, site) {
    var W = fmt.w, H = fmt.h;
    var u0 = W / 1080, u = u0;
    var safeTop = (fmt.safe ? fmt.safe.top : 0) * u0;
    var safeBottom = (fmt.safe ? fmt.safe.bottom : 0) * u0;
    var items, gap, total, avail, m, cw;
    for (var i = 0; i < 10; i++) {
      m = 72 * u;
      cw = W - 2 * m;
      items = present([
        st.showLockup ? lockupItem(ctx, st, u, P, site) : null,
        titleItem(ctx, st, u, P, cw),
        subtitleItem(ctx, st, u, P, cw),
        st.showChips ? chipsItem(ctx, st, u, P, cw) : null,
        st.showBullets ? bulletsItem(ctx, st, u, P, cw) : null,
        qrItem(ctx, st, u, P, cw, matrix),
        st.showDeadline ? deadlineItem(ctx, st, u, P, cw) : null,
        contactItem(ctx, st, u, P, cw, false),
        st.showUrl ? urlItem(ctx, st, u, P, cw) : null,
        st.showFooter ? footerItem(ctx, st, u, P, cw) : null,
      ]);
      gap = 38 * u;
      total = items.reduce(function (s, it) { return s + it.h; }, 0) + gap * Math.max(0, items.length - 1);
      avail = H - 2 * m - safeTop - safeBottom;
      if (total <= avail) break;
      u *= Math.max(0.45, avail / total) * 0.985;
    }
    drawBackground(ctx, W, H, st, P);
    var qrIndex = items.map(function (it) { return !!it.qr; }).indexOf(true);
    var extra = avail - total;
    var g = gap;
    if (items.length > 1 && extra > 0) g += Math.min(extra / (items.length - 1), 80 * u);
    var used = items.reduce(function (s, it) { return s + it.h; }, 0) + g * Math.max(0, items.length - 1);
    var y = m + safeTop + (avail - used) / 2;
    var qrY = y;
    items.forEach(function (it, idx) { if (idx === qrIndex) qrY = y; y += it.h + g; });
    if (st.waves) drawWaves(ctx, W, H, P, H * 0.22, H * 0.9, qrIndex >= 0 ? qrY + items[qrIndex].h * 0.45 : H * 0.6, u);
    y = m + safeTop + (avail - used) / 2;
    items.forEach(function (it) { it.draw(m, y, cw); y += it.h + g; });
  }
  function drawSide(ctx, st, fmt, P, matrix, site) {
    var W = fmt.w, H = fmt.h;
    var u0 = H / 700, u = u0;
    var m = 70 * u;
    var colW = W * 0.6 - m;
    var qrSize = Math.min(H * 0.74, W * 0.3) * (st.qrSize / 100);
    var items, gap, total, avail;
    for (var i = 0; i < 10; i++) {
      m = 70 * u0;
      items = present([
        st.showLockup ? lockupItem(ctx, st, u, P, site) : null,
        titleItem(ctx, st, u, P, colW),
        subtitleItem(ctx, st, u, P, colW),
        st.showChips ? chipsItem(ctx, st, u, P, colW) : null,
        st.showBullets ? bulletsItem(ctx, st, u, P, colW) : null,
        st.showDeadline ? deadlineItem(ctx, st, u, P, colW) : null,
        contactItem(ctx, st, u, P, colW, true),
        st.showUrl ? urlItem(ctx, st, u, P, colW) : null,
        st.showFooter ? footerItem(ctx, st, u, P, colW) : null,
      ]);
      gap = 30 * u;
      total = items.reduce(function (s, it) { return s + it.h; }, 0) + gap * Math.max(0, items.length - 1);
      avail = H - 2 * m;
      if (total <= avail) break;
      u *= Math.max(0.45, avail / total) * 0.985;
    }
    drawBackground(ctx, W, H, st, P);
    if (st.waves) drawWaves(ctx, W, H, P, H * 0.08, H * 0.92, H * 0.5, u);
    var extra = avail - total;
    var g = gap;
    if (items.length > 1 && extra > 0) g += Math.min(extra / (items.length - 1), 50 * u);
    var used = items.reduce(function (s, it) { return s + it.h; }, 0) + g * Math.max(0, items.length - 1);
    var y = m + (avail - used) / 2;
    items.forEach(function (it) { it.draw(m, y, colW); y += it.h + g; });
    var qx = W - m - qrSize - (W * 0.4 - qrSize) * 0.15;
    plateWithQR(ctx, matrix, qx, (H - qrSize) / 2, qrSize, st, P);
    var label = String(st.qrLabel || "").trim();
    if (label) {
      ctx.font = fontStr(600, 30 * u0, "Figtree");
      ctx.textAlign = "center";
      ctx.fillStyle = P.muted;
      ctx.fillText(label, qx + qrSize / 2, (H + qrSize) / 2 + 48 * u0);
      ctx.textAlign = "left";
    }
  }
  function drawSticker(ctx, st, fmt, P, matrix) {
    var W = fmt.w, H = fmt.h;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W / 2 - 6, 0, Math.PI * 2);
    ctx.clip();
    drawBackground(ctx, W, H, st, P);
    ctx.restore();
    ctx.lineWidth = 14;
    ctx.strokeStyle = P.accentHex;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W / 2 - 14, 0, Math.PI * 2);
    ctx.stroke();
    // con etiqueta, el recuadro se achica un poco para que quepan título, etiqueta y frase dentro del círculo
    var size = W * 0.56 * (st.qrSize / 100) * (String(st.ribbonText || "").trim() ? 0.88 : 1);
    // en el sticker no hay espacio para chispas; la etiqueta de abajo sube el recuadro para no tapar la frase
    var plateSt = Object.assign({}, st, { sparks: false });
    var ribH = ribbonHeight(plateSt, size);
    var shift = ribH && st.ribbonPos !== "top" ? ribH * 0.3 : ribH ? -ribH * 0.3 : 0;
    plateWithQR(ctx, matrix, (W - size) / 2, H * 0.5 - size * 0.46 - shift, size, plateSt, P);
    var title = (String(st.title1 || "").trim() + " " + String(st.title2 || "").trim()).trim();
    if (title) {
      var t = st.titleUpper ? title.toUpperCase() : title;
      ctx.fillStyle = P.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      var fs = fitSize(ctx, t, W * 0.6, W * 0.075, 800, "Bricolage Grotesque");
      ctx.fillText(t, W / 2, H * 0.17 + fs * 0.4);
    }
    var sub = String(st.subtitle || "").trim();
    if (sub) {
      ctx.fillStyle = P.dark ? P.accentHex : P.text;
      var fs2 = fitSize(ctx, sub, W * 0.62, W * 0.04, 700, "Figtree");
      ctx.fillText(sub, W / 2, H * (ribH ? 0.915 : 0.89));
    }
    ctx.textAlign = "left";
  }

  function prepare(st) {
    // texto que codifica el QR y matriz
    return buildMatrix(payload(st), st.ec);
  }
  function render(canvas, st, scale) {
    var fmt = FORMATS[st.format] || FORMATS.vertical;
    var w = fmt.w, h = fmt.h;
    scale = scale || 1;
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var matrix = prepare(st);
    var P = palette(st);
    if (fmt.layout === "solo") {
      var o = qopts(st);
      var mg = w * 0.06;
      if (o.bg) { ctx.fillStyle = o.bg; ctx.fillRect(0, 0, w, h); }
      drawQR(ctx, matrix, mg, mg, w - 2 * mg, st, {});
      return;
    }
    if (fmt.layout === "sticker") drawSticker(ctx, st, fmt, P, matrix);
    else if (fmt.layout === "side") drawSide(ctx, st, fmt, P, matrix, st.site);
    else drawStack(ctx, st, fmt, P, matrix, st.site);
  }

  /* ───────── SVG del QR (vectorial) ───────── */
  function buildSVG(st, bitmapDataUri) {
    var size = 1200;
    var margin = size * 0.06;
    var o = qopts(st);
    var g = geometry(prepare(st), margin, margin, size - 2 * margin, o);
    var defs = "";
    var dotFillAttr = o.dot1;
    var stops = '<stop offset="0" stop-color="' + o.dot1 + '"/>' + (o.dot3 ? '<stop offset="0.5" stop-color="' + o.dot3 + '"/>' : "") + '<stop offset="1" stop-color="' + o.dot2 + '"/>';
    if (o.grad !== "none" && (o.dot1 !== o.dot2 || o.dot3)) {
      var b = g.box;
      var coords = o.grad === "vertical" ? [b.x, b.y, b.x, b.y + b.size] : o.grad === "horizontal" ? [b.x, b.y, b.x + b.size, b.y] : [b.x, b.y, b.x + b.size, b.y + b.size];
      defs = o.grad === "radial"
        ? '<radialGradient id="g" gradientUnits="userSpaceOnUse" cx="' + f(b.x + b.size / 2) + '" cy="' + f(b.y + b.size / 2) + '" r="' + f(b.size * 0.7) + '">' + stops + '</radialGradient>'
        : '<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="' + f(coords[0]) + '" y1="' + f(coords[1]) + '" x2="' + f(coords[2]) + '" y2="' + f(coords[3]) + '">' + stops + '</linearGradient>';
      dotFillAttr = "url(#g)";
    }
    var logo = "";
    if (g.hasLogo) {
      var p = g.plate;
      if (o.logo.shape !== "none") {
        var bw = Math.max(2, g.cell * o.logo.borderW);
        var inset = bw / 2;
        logo += '<path fill="' + (o.bg || "#FFFFFF") + '" d="' + platePath(p, o.logo.shape) + '"/>';
        if (o.logo.border) logo += '<path fill="none" stroke="' + o.logo.border + '" stroke-width="' + f(bw) + '" d="' + platePath({ x: p.x + inset, y: p.y + inset, size: p.size - 2 * inset }, o.logo.shape) + '"/>';
      }
      var bmp = logoBitmap(st);
      if (bmp && bitmapDataUri) {
        var box = p.size * (st.logoMode === "shield" ? 0.74 : 0.7);
        var ratio = bmp.width / bmp.height;
        var lw = ratio >= 1 ? box : box * ratio;
        var lh = ratio >= 1 ? box / ratio : box;
        logo += '<image href="' + bitmapDataUri + '" x="' + f(p.x + (p.size - lw) / 2) + '" y="' + f(p.y + (p.size - lh) / 2) + '" width="' + f(lw) + '" height="' + f(lh) + '"/>';
      }
    }
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="Código QR de ' + (st.site && st.site.shortName ? st.site.shortName : "Nikola Tesla") + '">' +
      (defs ? "<defs>" + defs + "</defs>" : "") +
      (o.bg ? '<rect width="' + size + '" height="' + size + '" fill="' + o.bg + '"/>' : "") +
      '<path fill="' + dotFillAttr + '" d="' + g.dots.map(function (d) { return d.d; }).join("") + '"/>' +
      '<path fill="' + o.ring + '" fill-rule="evenodd" d="' + g.rings + '"/>' +
      '<path fill="' + o.ball + '" d="' + g.balls + '"/>' +
      logo +
      "</svg>"
    );
  }

  /* ───────── PDF y ZIP sin librerías ───────── */
  function pdfFromJpegDataUrl(dataUrl, wPx, hPx, dpi) {
    var bin = atob(dataUrl.split(",")[1]);
    var jpeg = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) jpeg[i] = bin.charCodeAt(i);
    var wPt = f((wPx * 72) / dpi), hPt = f((hPx * 72) / dpi);
    var enc = new TextEncoder();
    var parts = [], offsets = [], length = 0;
    function push(bytes) { parts.push(bytes); length += bytes.length; }
    function text(s) { push(enc.encode(s)); }
    function obj(n, body) { offsets[n] = length; text(n + " 0 obj\n" + body + "\nendobj\n"); }
    text("%PDF-1.4\n");
    obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
    obj(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
    obj(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + wPt + " " + hPt + "] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>");
    offsets[4] = length;
    text("4 0 obj\n<< /Type /XObject /Subtype /Image /Width " + wPx + " /Height " + hPx + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + jpeg.length + " >>\nstream\n");
    push(jpeg);
    text("\nendstream\nendobj\n");
    var content = "q " + wPt + " 0 0 " + hPt + " 0 0 cm /Im0 Do Q";
    obj(5, "<< /Length " + content.length + " >>\nstream\n" + content + "\nendstream");
    var xref = length;
    var xr = "xref\n0 6\n0000000000 65535 f \n";
    for (var k = 1; k <= 5; k++) xr += String(offsets[k]).padStart(10, "0") + " 00000 n \n";
    text(xr + "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF");
    var out = new Uint8Array(length);
    var pos = 0;
    parts.forEach(function (p) { out.set(p, pos); pos += p.length; });
    return new Blob([out], { type: "application/pdf" });
  }
  var crcTable = null;
  function crc32(bytes) {
    if (!crcTable) {
      crcTable = [];
      for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcTable[n] = c >>> 0; }
    }
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  /** ZIP sin compresión. files: [{ name, data: Uint8Array }] */
  function zipStore(files) {
    var enc = new TextEncoder();
    var parts = [], central = [], offset = 0;
    files.forEach(function (file) {
      var name = enc.encode(file.name);
      var crc = crc32(file.data);
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
      lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true); lh.setUint32(14, crc, true);
      lh.setUint32(18, file.data.length, true); lh.setUint32(22, file.data.length, true); lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
      parts.push(new Uint8Array(lh.buffer), name, file.data);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
      ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true); ch.setUint32(16, crc, true);
      ch.setUint32(20, file.data.length, true); ch.setUint32(24, file.data.length, true); ch.setUint16(28, name.length, true);
      ch.setUint16(30, 0, true); ch.setUint16(32, 0, true); ch.setUint16(34, 0, true); ch.setUint16(36, 0, true); ch.setUint32(38, 0, true); ch.setUint32(42, offset, true);
      central.push(new Uint8Array(ch.buffer), name);
      offset += 30 + name.length + file.data.length;
    });
    var centralSize = central.reduce(function (s, p) { return s + p.length; }, 0);
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, centralSize, true); end.setUint32(16, offset, true);
    return new Blob(parts.concat(central, [new Uint8Array(end.buffer)]), { type: "application/zip" });
  }

  /* ───────── contenido del QR ───────── */
  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  function intl(s) { var d = digits(s); return d.length === 9 ? "51" + d : d; }
  function wifiEsc(s) { return String(s || "").replace(/([\\;,:"])/g, "\\$1"); }
  function waFormat(n) {
    var d = digits(n).replace(/^51(?=\d{9}$)/, "");
    return d.length === 9 ? d.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : n || "";
  }
  function payload(st) {
    var t = st.contentType;
    var out;
    if (t === "whatsapp") out = "https://wa.me/" + intl(st.waNumber) + "?text=" + encodeURIComponent(st.waMessage || "");
    else if (t === "tel") out = "tel:+" + intl(st.telNumber);
    else if (t === "mail") out = "mailto:" + String(st.mailTo || "").trim() + "?subject=" + encodeURIComponent(st.mailSubject || "");
    else if (t === "map") out = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(st.mapQuery || "");
    else if (t === "text") out = String(st.freeText || "");
    else if (t === "vcard") out = "BEGIN:VCARD\nVERSION:3.0\nFN:" + (st.vcName || "") + "\nORG:" + (st.vcOrg || "") + "\nTEL;TYPE=CELL:+" + intl(st.vcPhone) + "\nEMAIL:" + (st.vcEmail || "") + "\nADR:;;" + (st.vcAddress || "") + ";;;;\nURL:" + (st.base || "") + "\nEND:VCARD";
    else if (t === "wifi") out = "WIFI:T:" + (st.wifiType || "WPA") + ";S:" + wifiEsc(st.wifiSsid) + ";P:" + wifiEsc(st.wifiPass) + ";;";
    else out = st.url;
    return out && out.trim() ? out : " ";
  }
  function displayText(st) {
    var t = st.contentType;
    if (t === "whatsapp") return "WhatsApp " + waFormat(st.waNumber);
    if (t === "tel") return waFormat(st.telNumber);
    if (t === "mail") return String(st.mailTo || "");
    if (t === "map") return "Cómo llegar";
    if (t === "url") return st.url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    return "";
  }

  /* ───────── calidad de lectura: semáforo y pruebas ───────── */
  function lum(hex) {
    var h = hex.replace("#", "");
    var v = [0, 2, 4].map(function (i) { var c = parseInt(h.substr(i, 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  function ratio(a, b) { var la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); }
  /** Revisa el diseño del QR y devuelve una lista de { level: ok|warn|bad, title, text }. */
  function analyze(s) {
    var o = qopts(s);
    var items = [];
    var add = function (level, title, text) { items.push({ level: level, title: title, text: text }); };
    var text = payload(s);
    var n = 0;
    try { n = buildMatrix(text, s.ec).length; } catch (e) { add("bad", "Contenido demasiado largo", "El contenido no cabe en un QR. Acórtalo."); return items; }

    // contraste
    var bg = o.bg || "#FFFFFF";
    // los puntos y el marco son lo que más pesa; el centro de las esquinas es pequeño y tolera menos contraste
    var colors = [o.dot1].concat(o.grad !== "none" ? [o.dot2].concat(o.dot3 ? [o.dot3] : []) : [], [o.ring]);
    var min = Math.min.apply(null, colors.map(function (c) { return ratio(c, bg); }));
    var ballLow = ratio(o.ball, bg) < 3;
    var inverted = lum(o.dot1) > lum(bg);
    if (inverted) add("bad", "QR invertido", "Los puntos son más claros que el fondo. Muchos lectores antiguos no lo leen. Usa puntos oscuros sobre fondo claro.");
    else if (min >= 5) add("ok", "Buen contraste", "Los puntos se distinguen bien del fondo.");
    else if (min >= 3) add("warn", "Contraste justo", "Se lee, pero con poca luz puede fallar. Usa un color más oscuro en los puntos o un fondo más claro.");
    else add("bad", "Contraste bajo", "Los colores son muy parecidos al fondo. Usa puntos más oscuros.");
    if (ballLow && !inverted) add("warn", "Centro de las esquinas poco visible", "El color del centro se parece al fondo. Elige uno más oscuro.");
    if (o.bg === null) add("warn", "Fondo transparente", "Solo funciona si lo pones sobre un fondo claro y liso. En una foto no se leerá.");

    // escudo
    var area = o.logo.mode === "none" ? 0 : s.logoArea;
    var max = EC_AREA[s.ec];
    if (!area) add("ok", "Sin escudo en el centro", "Es la opción más fácil de leer.");
    else if (area <= max * 0.85) add("ok", "Escudo de buen tamaño", "Ocupa el " + area + " % del QR (el límite seguro con este nivel de corrección es " + max + " %).");
    else if (area <= max) add("warn", "Escudo grande", "Ocupa el " + area + " % del QR; el límite seguro es " + max + " %. Reduce un poco o sube la corrección a H.");
    else add("bad", "Escudo demasiado grande", "Ocupa el " + area + " % y con la corrección " + s.ec + " " + (max ? "solo se lee bien hasta " + max + " %" : "no se recomienda ningún escudo") + ". Reduce el escudo, quítalo o sube la corrección a H.");

    // zona de silencio
    if (s.quiet >= 4) add("ok", "Margen blanco correcto", s.quiet + " módulos de margen.");
    else if (s.quiet === 3) add("warn", "Margen justo", "Con 3 módulos algunos lectores fallan. Si puedes, usa 4.");
    else add("bad", "Margen insuficiente", "Menos de 3 módulos de margen suele impedir la lectura.");

    // forma de puntos y esquinas
    var risky = [];
    var SHAPE_NAME = { diamond: "rombo", star: "estrella", cross: "cruz", heart: "corazón", bolt: "rayo", hex: "hexágono" };
    if (SHAPE_NAME[s.dotShape]) risky.push("puntos en forma de " + SHAPE_NAME[s.dotShape]);
    if (s.wmark) risky.push("marca de agua detrás de los puntos");
    if (s.plateBg && s.plateBg !== "none" && !s.mono) risky.push("dibujo de fondo en el recuadro");
    if (String(s.badgeText || "").trim() && s.quiet < 4) risky.push("insignia en la esquina con poco margen");
    if (s.dotScale < 85 && s.dotShape !== "liquid" && s.dotShape !== "square") risky.push("puntos muy pequeños");
    if (s.eyeOuter === "circle" || s.eyeOuter === "drop" || s.eyeInner === "diamond") risky.push("esquinas con formas muy distintas a un cuadrado");
    if (s.ringThick !== "normal") risky.push("marco de las esquinas " + (s.ringThick === "fino" ? "fino" : "grueso"));
    if (risky.length) add("warn", "Formas decorativas", "Tienes " + risky.join(", ") + ". Suele leerse, pero pruébalo con varios celulares y en papel.");
    else add("ok", "Formas seguras", "Los puntos y las esquinas siguen la forma que todos los lectores reconocen.");

    // densidad y tamaño de impresión
    var mm = Math.ceil(((n + 2 * s.quiet) * 0.8) / 5) * 5;
    if (n <= 41) add("ok", "Tamaño de impresión", "El código tiene " + n + " × " + n + " módulos. Imprímelo de al menos " + (mm / 10).toFixed(1) + " cm de lado.");
    else if (n <= 61) add("warn", "Código denso", n + " × " + n + " módulos. Imprímelo de al menos " + (mm / 10).toFixed(1) + " cm de lado o usa un enlace más corto.");
    else add("bad", "Código muy denso", n + " × " + n + " módulos. Necesitará mucho tamaño: acorta el enlace o el texto, o baja el nivel de corrección.");
    if (s.contentType === "whatsapp") add("warn", "WhatsApp directo", "Abre WhatsApp sin pasar por la web: no se mide cuántas familias llegan desde este QR en Google Analytics.");
    if (s.contentType === "wifi") add("warn", "Contraseña visible", "Quien escanee este QR podrá ver la contraseña del Wi-Fi. No lo publiques en lugares abiertos.");
    return items;
  }

  function scaled(c, w) {
    var out = document.createElement("canvas");
    out.width = w;
    out.height = Math.round((w * c.height) / c.width);
    var g = out.getContext("2d");
    g.fillStyle = "#FFFFFF";
    g.fillRect(0, 0, out.width, out.height);
    g.drawImage(c, 0, 0, out.width, out.height);
    return out;
  }
  /** Lee el QR de un canvas con dos lectores (ZXing, el más tolerante, y jsQR, más estricto): basta con que lo lea uno, como en los celulares. */
  function decode(c) {
    var data = c.getContext("2d").getImageData(0, 0, c.width, c.height);
    if (window.ZXing) {
      try {
        var lum = new Uint8ClampedArray(c.width * c.height);
        for (var i = 0; i < lum.length; i++) lum[i] = (data.data[i * 4] * 0.299 + data.data[i * 4 + 1] * 0.587 + data.data[i * 4 + 2] * 0.114) | 0;
        var bitmap = new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.RGBLuminanceSource(lum, c.width, c.height)));
        var hints = new Map();
        hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
        return new ZXing.QRCodeReader().decode(bitmap, hints).getText();
      } catch (e) {
        /* ZXing no lo leyó: se prueba con jsQR */
      }
    }
    if (typeof jsQR === "function") {
      var res = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
      if (res) return res.data;
    }
    return null;
  }
  /** Simula cómo lo vería un celular: pequeño, desenfocado, con poca luz, torcido, con ruido. */
  function readTest(s) {
    var want = payload(s);
    var size = 720;
    var base = document.createElement("canvas");
    base.width = size; base.height = size;
    var g = base.getContext("2d");
    g.fillStyle = "#FFFFFF";
    g.fillRect(0, 0, size, size);
    drawQR(g, prepare(s), 0, 0, size, s, { background: true });
    var tests = [
      ["Tamaño normal", function () { return scaled(base, 480); }],
      ["Pequeño (volante visto de lejos)", function () { return scaled(base, 260); }],
      ["Muy pequeño", function () { return scaled(base, 190); }],
      ["Desenfocado", function () { var c = scaled(base, 420); var o = document.createElement("canvas"); o.width = c.width; o.height = c.height; var x = o.getContext("2d"); x.filter = "blur(1.3px)"; x.drawImage(c, 0, 0); return o; }],
      ["Poca luz", function () { var c = scaled(base, 420); var o = document.createElement("canvas"); o.width = c.width; o.height = c.height; var x = o.getContext("2d"); x.filter = "brightness(0.6) contrast(0.75)"; x.drawImage(c, 0, 0); return o; }],
      ["Torcido 12°", function () { var c = scaled(base, 420); var o = document.createElement("canvas"); o.width = 560; o.height = 560; var x = o.getContext("2d"); x.fillStyle = "#EDEDED"; x.fillRect(0, 0, 560, 560); x.translate(280, 280); x.rotate((12 * Math.PI) / 180); x.drawImage(c, -c.width / 2, -c.height / 2); return o; }],
      ["Papel con ruido", function () { var c = scaled(base, 420); var x = c.getContext("2d"); var d = x.getImageData(0, 0, c.width, c.height); for (var i = 0; i < d.data.length; i += 4) { var nz = (Math.random() - 0.5) * 70; d.data[i] += nz; d.data[i + 1] += nz; d.data[i + 2] += nz; } x.putImageData(d, 0, 0); return c; }],
    ];
    return tests.map(function (t) {
      var ok = false;
      try { ok = decode(t[1]()) === want; } catch (e) { ok = false; }
      return { name: t[0], ok: ok };
    });
  }

  /* ───────── animación (WebM) ───────── */
  function recordAnimation(s, done) {
    if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) { alert("Este navegador no puede grabar la animación. Prueba con Chrome o Edge."); return; }
    var size = 720;
    var c = document.createElement("canvas");
    c.width = size; c.height = size;
    var ctx = c.getContext("2d");
    var P = palette(s);
    var plate = size * (s.sparks ? 0.6 : 0.72);
    s = Object.assign({}, s, { tilt: s.tilt });
    var stream = c.captureStream(30);
    var rec = new MediaRecorder(stream, { mimeType: window.MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm" });
    var chunks = [];
    rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = function () { done(new Blob(chunks, { type: "video/webm" })); };
    var m = prepare(s);
    var o = qopts(s);
    var start = 0;
    function frame(now) {
      if (!start) start = now;
      var t = (now - start) / 1000;
      var r = Math.min(1, t / 2.2);
      ctx.clearRect(0, 0, size, size);
      drawBackground(ctx, size, size, s, P);
      s.__t = t;
      s.__reveal = r;
      plateWithQR(ctx, m, (size - plate) / 2, (size - plate) / 2, plate, s, P);
      if (t < 5) requestAnimationFrame(frame); else rec.stop();
    }
    rec.start();
    requestAnimationFrame(frame);
  }

  /* ───────── estado ───────── */
  var st = {
    format: "vertical", theme: "noche", accent: "filamento", photo: null, photoData: "", photoOverlay: 70, waves: true, align: "left",
    showLockup: true, title1: "Admisión", title2: "2027", titleUpper: true, titleScale: 100, subtitle: "Escanea y agenda tu visita",
    showChips: true, chips: "Primaria, Secundaria", showBullets: false, bullets: "Conoce nuestra propuesta educativa\nPrimaria y Secundaria\nVisítanos y agenda tu cita",
    showDeadline: false, deadline: "", showUrl: true, qrSize: 100, qrLabel: "",
    showWhatsapp: false, whatsapp: "", showAddress: false, address: "", extra: "", showFooter: true, footer: "",
    // contenido del QR
    contentType: "url", channel: "volante", custom: "", base: "", waNumber: "", waMessage: "", telNumber: "", mailTo: "", mailSubject: "", mapQuery: "", freeText: "",
    vcName: "", vcOrg: "", vcPhone: "", vcEmail: "", vcAddress: "", wifiSsid: "", wifiPass: "", wifiType: "WPA", ec: "H", quiet: 4,
    // puntos, esquinas, escudo, recuadro
    dotShape: "rounded", dotScale: 94, dotRound: 22, dotColor: "noche", gradient: "none", dotColor2: "marino", qrBg: "blanco", mono: false,
    eyeOuter: "rounded", eyeInner: "rounded", ringThick: "normal", ringColor: "marino", ballColor: "rojo",
    logoMode: "shield", logoText: "2027", logoUp: null, logoUpData: "", logoArea: 7, logoShape: "rounded", logoBorder: "filamento", logoBorderW: "normal", logoMono: false,
    plateRadius: 7, shadow: "soft", frame: "none", tilt: 0, sparks: false, ribbonText: "", ribbonPos: "bottom", ribbonStyle: "cinta",
    sparkStyle: "rayos", sparkCount: 8, sparkSize: 100, sparkColor: "acento", glow: "none", glowColor: "acento", frameColor: "acento", frameW: "normal",
    dotColor3: "none", wmark: false, wmarkAlpha: 12, plateBg: "none", badgeText: "", badgePos: "sd", badgeShape: "circulo",
    scale: 2, site: null, logoImg: null, url: "", display: "",
  };
  var KEYS = ["format", "theme", "accent", "photoOverlay", "waves", "align", "showLockup", "title1", "title2", "titleUpper", "titleScale", "subtitle", "showChips", "chips", "showBullets", "bullets", "showDeadline", "deadline", "showUrl", "qrSize", "qrLabel",
    "showWhatsapp", "whatsapp", "showAddress", "address", "extra", "showFooter", "footer", "contentType", "channel", "custom", "base", "waNumber", "waMessage", "telNumber", "mailTo", "mailSubject", "mapQuery", "freeText",
    "vcName", "vcOrg", "vcPhone", "vcEmail", "vcAddress", "wifiSsid", "wifiPass", "wifiType", "ec", "quiet", "dotShape", "dotScale", "dotRound", "dotColor", "gradient", "dotColor2", "qrBg", "mono", "eyeOuter", "eyeInner", "ringThick", "ringColor", "ballColor",
    "logoMode", "logoText", "logoArea", "logoShape", "logoBorder", "logoBorderW", "logoMono", "plateRadius", "shadow", "frame", "tilt", "sparks", "ribbonText", "ribbonPos", "ribbonStyle", "sparkStyle", "sparkCount", "sparkSize", "sparkColor", "glow", "glowColor", "frameColor", "frameW", "dotColor3", "wmark", "wmarkAlpha", "plateBg", "badgeText", "badgePos", "badgeShape", "scale"];

  function computeUrl() {
    var base = encodeURI(String(st.base || "").trim().replace(/\/+$/, ""));
    var ch = String(st.channel === "otro" ? st.custom : st.channel).trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "qr";
    st.url = base + "/qr/" + ch;
    st.display = displayText(st);
    return ch;
  }

  /* ───────── plantillas de estilo del QR ───────── */
  var PRESETS = {
    marca: { label: "Marca (recomendado)", set: { dotShape: "rounded", dotScale: 94, dotRound: 22, dotColor: "noche", gradient: "none", eyeOuter: "rounded", eyeInner: "rounded", ringThick: "normal", ringColor: "marino", ballColor: "rojo", mono: false, qrBg: "blanco", logoMode: "shield", logoArea: 7, logoShape: "rounded", logoBorder: "filamento", sparks: false } },
    clasico: { label: "Clásico", set: { dotShape: "square", dotScale: 100, dotColor: "noche", gradient: "none", eyeOuter: "square", eyeInner: "square", ringThick: "normal", ringColor: "noche", ballColor: "noche", mono: false, qrBg: "blanco", logoShape: "square", sparks: false } },
    liquido: { label: "Líquido", set: { dotShape: "liquid", dotColor: "noche", gradient: "none", eyeOuter: "rounded", eyeInner: "circle", ringThick: "normal", ringColor: "marino", ballColor: "rojo", mono: false, qrBg: "blanco", logoShape: "circle", sparks: false } },
    suave: { label: "Suave (círculos)", set: { dotShape: "circle", dotScale: 92, dotColor: "marino", gradient: "none", eyeOuter: "rounded", eyeInner: "circle", ringThick: "normal", ringColor: "marino", ballColor: "rojo", mono: false, qrBg: "blanco", logoShape: "circle", sparks: false } },
    energia: { label: "Energía", set: { dotShape: "rounded", dotScale: 94, dotRound: 30, dotColor: "noche", gradient: "diagonal", dotColor2: "marino", eyeOuter: "leaf", eyeInner: "leaf", ringThick: "normal", ringColor: "rojo700", ballColor: "noche", mono: false, qrBg: "blanco", logoShape: "rounded", logoBorder: "filamento", sparks: true } },
    tesla: { label: "Tesla (rombos)", set: { dotShape: "diamond", dotScale: 96, dotColor: "noche", gradient: "none", eyeOuter: "square", eyeInner: "square", ringThick: "normal", ringColor: "marino", ballColor: "rojo", mono: false, qrBg: "blanco", logoShape: "square", logoBorder: "rojo", sparks: false } },
    neon: { label: "Neón ⚡", set: { dotShape: "rounded", dotScale: 94, dotRound: 30, dotColor: "morado", gradient: "diagonal", dotColor3: "azul", dotColor2: "fucsia", eyeOuter: "leaf", eyeInner: "leaf", ringThick: "normal", ringColor: "morado", ballColor: "fucsia", mono: false, qrBg: "blanco", logoShape: "circle", logoBorder: "filamento",
      glow: "fuerte", glowColor: "arco", frameColor: "acento", frameW: "grueso", sparks: true, sparkStyle: "destellos", sparkCount: 10, sparkColor: "arco", plateBg: "ondas" } },
    fiesta: { label: "Fiesta 🎉", set: { dotShape: "circle", dotScale: 94, dotColor: "rojo", gradient: "horizontal", dotColor3: "naranja", dotColor2: "fucsia", eyeOuter: "rounded", eyeInner: "circle", ringThick: "normal", ringColor: "rojo700", ballColor: "morado", mono: false, qrBg: "blanco", logoShape: "circle", logoBorder: "filamento",
      glow: "suave", glowColor: "filamento", frameColor: "filamento", frameW: "grueso", sparks: true, sparkStyle: "mixto", sparkCount: 14, sparkSize: 110, sparkColor: "filamento", plateBg: "puntos", badgeText: "2027", badgePos: "sd", badgeShape: "sol", wmark: false, tilt: 4, ribbonText: "¡ESCANÉAME!", ribbonStyle: "burbuja" } },
    tinta: { label: "Una tinta (negro)", set: { dotShape: "square", dotScale: 100, gradient: "none", eyeOuter: "square", eyeInner: "square", ringThick: "normal", mono: true, qrBg: "blanco", logoShape: "square", logoMono: true, sparks: false, shadow: "none" } },
  };

  /* ───────── controles (se generan desde esta lista) ───────── */
  var yesno = function (y, n) { return [[true, y], [false, n]]; };
  var paletteOpts = function (keys) { return function () { return keys.map(function (k) { return [k, PALETTE[k][0]]; }); }; };
  var onType = function (t) { return function () { return st.contentType === t; }; };

  var GROUPS = [
    { id: "formato", title: "📐 Formato y fondo del afiche", open: true, fields: [
      { key: "format", type: "select", label: "Formato", options: function () { return Object.keys(FORMATS).map(function (k) { return [k, FORMATS[k].label]; }); }, hint: function () { return FORMATS[st.format].note; } },
      { key: "theme", type: "select", label: "Color de fondo", options: function () { return Object.keys(THEMES).map(function (k) { return [k, THEMES[k].label]; }); } },
      { key: "accent", type: "swatches", label: "Color de acento", hint: "Para la línea, las etiquetas, el botón del enlace y el borde del QR." },
      { key: "photo", type: "image", label: "Foto de fondo (opcional)", max: 1600, hint: "Una foto del colegio detrás del texto. El QR siempre queda sobre su recuadro para que se lea." },
      { key: "photoOverlay", type: "range", min: 20, max: 95, unit: "%", label: "Qué tan oscura se ve la foto", showIf: function () { return !!st.photo; } },
      { key: "waves", type: "check", label: "Mostrar las líneas decorativas" },
      { key: "align", type: "select", label: "Alineación del texto", options: function () { return [["left", "A la izquierda"], ["center", "Centrado"]]; } },
    ] },
    { id: "textos", title: "✏️ Título y frase", open: true, fields: [
      { key: "showLockup", type: "check", label: "Mostrar el escudo y el nombre del colegio" },
      { key: "title1", type: "text", label: "Título, línea 1", max: 22, example: "Admisión" },
      { key: "title2", type: "text", label: "Título, línea 2", max: 22, example: "2027", hint: "Déjala vacía para un título de una sola línea." },
      { key: "titleUpper", type: "check", label: "Título en mayúsculas" },
      { key: "titleScale", type: "range", min: 60, max: 130, unit: "%", label: "Tamaño del título" },
      { key: "subtitle", type: "text", label: "Frase debajo del título", max: 60, example: "Escanea y agenda tu visita" },
      { key: "showChips", type: "check", label: "Mostrar etiquetas (por ejemplo, los niveles)" },
      { key: "chips", type: "text", label: "Etiquetas (separadas por coma)", max: 80, showIf: function () { return st.showChips; } },
    ] },
    { id: "datos", title: "✅ Beneficios y fechas", fields: [
      { key: "showBullets", type: "check", label: "Mostrar lista de beneficios" },
      { key: "bullets", type: "textarea", label: "Beneficios (uno por línea)", rows: 4, showIf: function () { return st.showBullets; }, hint: "Escribe solo lo que sea cierto. Se ve una marca ✓ delante de cada uno." },
      { key: "showDeadline", type: "check", label: "Mostrar fecha límite de inscripción" },
      { key: "deadline", type: "text", label: "Texto de la fecha", max: 60, showIf: function () { return st.showDeadline; }, example: "Inscripciones hasta el 26 de febrero", hint: "Usa la fecha confirmada del colegio." },
    ] },
    { id: "contacto", title: "📞 Contacto y pie del afiche", fields: [
      { key: "showWhatsapp", type: "check", label: "Mostrar WhatsApp" },
      { key: "whatsapp", type: "text", label: "Número de WhatsApp", max: 20, showIf: function () { return st.showWhatsapp; }, example: "960 209 798" },
      { key: "showAddress", type: "check", label: "Mostrar la dirección" },
      { key: "address", type: "text", label: "Dirección", max: 90, showIf: function () { return st.showAddress; } },
      { key: "extra", type: "textarea", label: "Textos extra (uno por línea)", rows: 3, hint: "Por ejemplo: “Atención de lunes a viernes”, “Vacantes limitadas”." },
      { key: "showFooter", type: "check", label: "Mostrar texto al pie" },
      { key: "footer", type: "text", label: "Texto al pie", max: 70, showIf: function () { return st.showFooter; } },
    ] },
    { id: "contenido", title: "🔳 QR · Contenido y enlace", open: true, fields: [
      { key: "contentType", type: "select", label: "¿Qué hace el QR al escanearlo?", options: function () { return [["url", "Abrir la web del colegio (recomendado, se puede medir)"], ["whatsapp", "Abrir WhatsApp con un mensaje escrito"], ["tel", "Llamar por teléfono"], ["mail", "Escribir un correo"], ["map", "Abrir el mapa (cómo llegar)"], ["vcard", "Guardar el contacto del colegio"], ["wifi", "Conectarse a un Wi-Fi"], ["text", "Mostrar un texto"]]; } },
      { key: "channel", type: "select", label: "¿Dónde irá este QR?", options: function () { return [["volante", "Volante"], ["afiche", "Afiche"], ["banner", "Banner o gigantografía"], ["redes", "Redes sociales"], ["boletin", "Libreta o circular"], ["otro", "Otro…"]]; }, showIf: onType("url"), hint: "Cada lugar tiene su propio enlace corto, así sabrás cuántas familias llegan desde cada uno." },
      { key: "custom", type: "text", label: "Nombre del lugar", max: 24, showIf: function () { return st.contentType === "url" && st.channel === "otro"; }, example: "feria-colegio" },
      { key: "base", type: "text", label: "Dirección de la web", showIf: onType("url"), hint: "Se toma de “Datos del colegio”. Cámbiala aquí solo para pruebas." },
      { key: "waNumber", type: "text", label: "Número de WhatsApp", max: 20, showIf: onType("whatsapp"), example: "960 209 798" },
      { key: "waMessage", type: "text", label: "Mensaje que se escribirá solo", max: 140, showIf: onType("whatsapp"), example: "Hola, quisiera información sobre la Admisión 2027" },
      { key: "telNumber", type: "text", label: "Número de teléfono", max: 20, showIf: onType("tel") },
      { key: "mailTo", type: "text", label: "Correo de destino", max: 80, showIf: onType("mail") },
      { key: "mailSubject", type: "text", label: "Asunto", max: 80, showIf: onType("mail") },
      { key: "mapQuery", type: "text", label: "Lugar para el mapa", max: 140, showIf: onType("map") },
      { key: "vcName", type: "text", label: "Nombre del contacto", max: 60, showIf: onType("vcard") },
      { key: "vcOrg", type: "text", label: "Institución", max: 80, showIf: onType("vcard") },
      { key: "vcPhone", type: "text", label: "Teléfono", max: 20, showIf: onType("vcard") },
      { key: "vcEmail", type: "text", label: "Correo", max: 80, showIf: onType("vcard") },
      { key: "vcAddress", type: "text", label: "Dirección", max: 120, showIf: onType("vcard") },
      { key: "wifiSsid", type: "text", label: "Nombre de la red Wi-Fi", max: 40, showIf: onType("wifi") },
      { key: "wifiPass", type: "text", label: "Contraseña", max: 60, showIf: onType("wifi") },
      { key: "wifiType", type: "select", label: "Tipo de seguridad", options: function () { return [["WPA", "WPA / WPA2"], ["WEP", "WEP"], ["nopass", "Sin contraseña"]]; }, showIf: onType("wifi") },
      { key: "freeText", type: "textarea", label: "Texto", rows: 3, showIf: onType("text") },
      { key: "introPreview", type: "intro", label: "Animación al escanear (vista previa)", hint: "Al escanear, la familia ve unos segundos una animación y luego entra a la web. Se ve en un enlace de la web (no en Wi-Fi, llamada, etc.). La que queda activa se elige en Datos del colegio → pestaña “Animación del QR” (botón de abajo).", showIf: onType("url") },
      { key: "ec", type: "select", label: "Nivel de corrección de errores", options: function () { return [["H", "H · máxima (permite escudo grande)"], ["Q", "Q · alta"], ["M", "M · media (código más simple)"], ["L", "L · baja (código muy simple, sin escudo)"]]; }, hint: "Más corrección tolera más daño, pero hace el código más denso. Con escudo grande usa H." },
      { key: "quiet", type: "range", min: 3, max: 6, unit: " módulos", label: "Margen blanco alrededor", hint: "Mínimo recomendado: 4." },
      { key: "qrSize", type: "range", min: 70, max: 130, unit: "%", label: "Tamaño del QR en el afiche" },
      { key: "qrLabel", type: "text", label: "Texto bajo el QR (opcional)", max: 50, example: "Apunta la cámara de tu celular aquí" },
      { key: "showUrl", type: "check", label: "Mostrar el enlace o dato escrito" },
    ] },
    { id: "puntos", title: "🎨 QR · Puntos y colores", fields: [
      { key: "dotShape", type: "select", label: "Forma de los puntos", options: function () { return [["rounded", "Cuadrados redondeados"], ["square", "Cuadrados"], ["circle", "Círculos"], ["liquid", "Líquido (puntos unidos)"], ["diamond", "Rombos"], ["star", "Estrellas"], ["hex", "Hexágonos"], ["cross", "Cruces"], ["heart", "Corazones"], ["bolt", "Rayos ⚡"]]; }, hint: "Las formas decorativas (rombos, cruces, corazones, rayos…) se leen peor: usa el semáforo y la prueba de lectura." },
      { key: "dotScale", type: "range", min: 75, max: 100, unit: "%", label: "Tamaño de cada punto", showIf: function () { return st.dotShape !== "liquid" && st.dotShape !== "square"; }, hint: "Menos de 85 % puede dificultar la lectura." },
      { key: "dotRound", type: "range", min: 0, max: 50, unit: "%", label: "Qué tan redondeados", showIf: function () { return st.dotShape === "rounded"; } },
      { key: "dotColor", type: "select", label: "Color de los puntos", options: paletteOpts(DARKS) },
      { key: "gradient", type: "select", label: "Degradado en los puntos", options: function () { return [["none", "Sin degradado"], ["vertical", "De arriba a abajo"], ["horizontal", "De izquierda a derecha"], ["diagonal", "En diagonal"], ["radial", "Del centro hacia afuera"]]; } },
      { key: "dotColor2", type: "select", label: "Segundo color del degradado", options: paletteOpts(DARKS), showIf: function () { return st.gradient !== "none"; } },
      { key: "dotColor3", type: "select", label: "Color del medio (degradado de tres colores)", options: function () { return [["none", "Ninguno (dos colores)"]].concat(paletteOpts(DARKS)()); }, showIf: function () { return st.gradient !== "none"; } },
      { key: "wmark", type: "check", label: "Marca de agua: escudo difuminado detrás de los puntos", hint: "Se ve en PNG y PDF; no se incluye en el SVG." },
      { key: "wmarkAlpha", type: "range", min: 5, max: 30, unit: " %", label: "Fuerza de la marca de agua", showIf: function () { return st.wmark; }, hint: "Más de 15 % puede dificultar la lectura." },
      { key: "qrBg", type: "select", label: "Fondo del QR", options: function () { return Object.keys(BGS).map(function (k) { return [k, BGS[k][0]]; }); } },
      { key: "mono", type: "check", label: "Una sola tinta (todo en negro, para fotocopias y sellos)" },
    ] },
    { id: "esquinas", title: "👁 QR · Esquinas", fields: [
      { key: "eyeOuter", type: "select", label: "Forma del marco de las 3 esquinas", options: function () { return [["rounded", "Cuadrado redondeado"], ["square", "Cuadrado"], ["circle", "Círculo"], ["leaf", "Hoja"], ["drop", "Gota"]]; } },
      { key: "eyeInner", type: "select", label: "Forma del centro de las esquinas", options: function () { return [["rounded", "Cuadrado redondeado"], ["square", "Cuadrado"], ["circle", "Círculo"], ["diamond", "Rombo"], ["leaf", "Hoja"]]; } },
      { key: "ringThick", type: "select", label: "Grosor del marco", options: function () { return [["fino", "Fino"], ["normal", "Normal (recomendado)"], ["grueso", "Grueso"]]; } },
      { key: "ringColor", type: "select", label: "Color del marco", options: paletteOpts(DARKS) },
      { key: "ballColor", type: "select", label: "Color del centro", options: paletteOpts(DARKS) },
    ] },
    { id: "escudo", title: "🛡 QR · Escudo central", fields: [
      { key: "logoMode", type: "select", label: "¿Qué va al centro?", options: function () { return [["shield", "El escudo del colegio"], ["initials", "Las iniciales (NT)"], ["text", "Un texto corto (por ejemplo, 2027)"], ["image", "Una imagen mía"], ["none", "Nada (máxima seguridad de lectura)"]]; } },
      { key: "logoText", type: "text", label: "Texto del centro", max: 6, showIf: function () { return st.logoMode === "text"; }, example: "2027" },
      { key: "logoUp", type: "image", label: "Imagen del centro", max: 600, showIf: function () { return st.logoMode === "image"; }, hint: "Mejor un logo simple con fondo transparente (PNG)." },
      { key: "logoArea", type: "range", min: 2, max: 16, unit: "% del QR", label: "Tamaño del centro", showIf: function () { return st.logoMode !== "none"; }, hint: "El semáforo avisa si es demasiado grande para el nivel de corrección." },
      { key: "logoShape", type: "select", label: "Forma del recuadro del centro", options: function () { return [["rounded", "Cuadrado redondeado"], ["circle", "Círculo"], ["square", "Cuadrado"], ["none", "Sin recuadro"]]; }, showIf: function () { return st.logoMode !== "none"; } },
      { key: "logoBorder", type: "select", label: "Color del borde del recuadro", options: function () { return [["none", "Sin borde"]].concat(paletteOpts(["filamento", "rojo", "marino", "noche", "negro"])()); }, showIf: function () { return st.logoMode !== "none" && st.logoShape !== "none"; } },
      { key: "logoBorderW", type: "select", label: "Grosor del borde", options: function () { return [["fino", "Fino"], ["normal", "Normal"], ["grueso", "Grueso"]]; }, showIf: function () { return st.logoMode !== "none" && st.logoShape !== "none" && st.logoBorder !== "none"; } },
      { key: "logoMono", type: "check", label: "Centro en un solo color (negro)", showIf: function () { return st.logoMode !== "none"; } },
    ] },
    { id: "recuadro", title: "🖼 QR · Recuadro, etiqueta y efectos", fields: [
      { key: "plateRadius", type: "range", min: 0, max: 25, unit: "%", label: "Esquinas del recuadro" },
      { key: "shadow", type: "select", label: "Sombra del recuadro", options: function () { return [["soft", "Suave"], ["strong", "Fuerte"], ["none", "Sin sombra"]]; } },
      { key: "frame", type: "select", label: "Marco decorativo", options: function () { return [["none", "Normal"], ["double", "Doble línea"], ["dashed", "Línea punteada"]]; } },
      { key: "tilt", type: "range", min: -8, max: 8, unit: "°", label: "Inclinación del recuadro", hint: "Hasta 8°: sigue leyéndose bien." },
      { key: "sparks", type: "check", label: "Chispas de energía alrededor", hint: "Adornos fuera del recuadro; no tapan el código." },
      { key: "sparkStyle", type: "select", label: "Tipo de chispas", options: function () { return [["rayos", "Rayos quebrados"], ["destellos", "Destellos ✦"], ["puntos", "Estelas de puntos"], ["mixto", "Mezcla de todo"]]; }, showIf: function () { return st.sparks; } },
      { key: "sparkCount", type: "range", min: 4, max: 20, unit: " chispas", label: "Cantidad de chispas", showIf: function () { return st.sparks; } },
      { key: "sparkSize", type: "range", min: 60, max: 160, unit: "%", label: "Tamaño de las chispas", showIf: function () { return st.sparks; } },
      { key: "sparkColor", type: "select", label: "Color de las chispas", options: function () { return [["acento", "El color de acento"], ["filamento", "Amarillo"], ["blanco", "Blanco"], ["rojo", "Rojo"], ["arco", "Lila"], ["noche", "Azul noche"]]; }, showIf: function () { return st.sparks; } },
      { key: "glow", type: "select", label: "Resplandor neón alrededor", options: function () { return [["none", "Sin resplandor"], ["suave", "Suave"], ["fuerte", "Fuerte"]]; } },
      { key: "glowColor", type: "select", label: "Color del resplandor", options: function () { return [["acento", "El color de acento"], ["filamento", "Amarillo"], ["blanco", "Blanco"], ["rojo", "Rojo"], ["arco", "Lila"]]; }, showIf: function () { return st.glow !== "none"; } },
      { key: "frameColor", type: "select", label: "Color del borde del recuadro", options: function () { return [["acento", "El color de acento"], ["filamento", "Amarillo"], ["rojo", "Rojo"], ["marino", "Azul marino"], ["noche", "Azul noche"], ["blanco", "Blanco"]]; } },
      { key: "frameW", type: "select", label: "Grosor del borde del recuadro", options: function () { return [["fino", "Fino"], ["normal", "Normal"], ["grueso", "Grueso"]]; } },
      { key: "plateBg", type: "select", label: "Dibujo de fondo del recuadro", options: function () { return [["none", "Liso"], ["ondas", "Líneas de energía (ondas)"], ["rejilla", "Rejilla en diagonal"], ["puntos", "Puntos"], ["rayos", "Rayos desde el centro"]]; }, hint: "Muy suave, del color del borde. No se usa en “Una sola tinta”." },
      { key: "badgeText", type: "text", label: "Insignia en una esquina (opcional)", max: 8, example: "2027", hint: "Un círculo, sol o rombo con texto corto, por ejemplo “✦ NUEVO”. Para no tapar el código, su tamaño se limita al margen." },
      { key: "badgePos", type: "select", label: "Esquina de la insignia", options: function () { return [["sd", "Arriba a la derecha"], ["si", "Arriba a la izquierda"], ["id", "Abajo a la derecha"], ["ii", "Abajo a la izquierda"]]; }, showIf: function () { return !!String(st.badgeText || "").trim(); } },
      { key: "badgeShape", type: "select", label: "Forma de la insignia", options: function () { return [["circulo", "Círculo"], ["sol", "Sol (con picos)"], ["rombo", "Rombo"]]; }, showIf: function () { return !!String(st.badgeText || "").trim(); } },
      { key: "ribbonText", type: "text", label: "Etiqueta pegada al QR (opcional)", max: 24, example: "ESCANÉAME" },
      { key: "ribbonPos", type: "select", label: "Dónde va la etiqueta", options: function () { return [["bottom", "Debajo del QR"], ["top", "Encima del QR"]]; }, showIf: function () { return !!String(st.ribbonText || "").trim(); } },
      { key: "ribbonStyle", type: "select", label: "Estilo de la etiqueta", options: function () { return [["cinta", "Cinta"], ["burbuja", "Burbuja con flecha"]]; }, showIf: function () { return !!String(st.ribbonText || "").trim(); } },
    ] },
  ];

  var IMAGES = { photo: { el: "photo", data: "photoData" }, logoUp: { el: "logoUp", data: "logoUpData" } };
  var controls = {};
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function buildControls(mount) {
    mount.innerHTML = "";
    GROUPS.forEach(function (g) {
      var det = document.createElement("details");
      det.className = "qgroup";
      det.id = "qg-" + g.id;
      if (g.open) det.open = true;
      var sum = document.createElement("summary");
      sum.textContent = g.title;
      det.appendChild(sum);
      var body = document.createElement("div");
      body.className = "qbody";
      g.fields.forEach(function (fd) {
        var row = document.createElement("div");
        row.className = "field qrow";
        var id = "qf-" + fd.key;
        var input;
        if (fd.type === "check") {
          row.classList.add("qcheck");
          input = document.createElement("input");
          input.type = "checkbox";
          input.id = id;
          var lab = document.createElement("label");
          lab.htmlFor = id;
          lab.className = "qchecklabel";
          lab.textContent = fd.label;
          row.appendChild(input);
          row.appendChild(lab);
        } else {
          var label = document.createElement("label");
          label.htmlFor = id;
          label.textContent = fd.label;
          row.appendChild(label);
          if (fd.type === "select") {
            input = document.createElement("select");
            (fd.options() || []).forEach(function (o) { var opt = document.createElement("option"); opt.value = String(o[0]); opt.textContent = o[1]; input.appendChild(opt); });
          } else if (fd.type === "textarea") {
            input = document.createElement("textarea");
            input.rows = fd.rows || 3;
          } else if (fd.type === "range") {
            input = document.createElement("input");
            input.type = "range";
            input.min = fd.min;
            input.max = fd.max;
          } else if (fd.type === "swatches") {
            input = document.createElement("div");
            input.className = "swatches";
            Object.keys(ACCENTS).forEach(function (k) {
              var b = document.createElement("button");
              b.type = "button";
              b.className = "swatch";
              b.dataset.v = k;
              b.title = ACCENTS[k][0];
              b.style.background = ACCENTS[k][1];
              b.setAttribute("aria-label", ACCENTS[k][0]);
              input.appendChild(b);
            });
          } else if (fd.type === "intro") {
            // vista previa de la animación que se ve al escanear (la que queda activa se elige en “Datos del colegio”)
            input = document.createElement("div");
            input.className = "qintro";
            var sel = document.createElement("select");
            [["atomo", "⚛️ Átomo"], ["rayos", "⚡ Rayos"], ["bobina", "🔮 Bobina Tesla"], ["energia", "〰️ Línea de energía"], ["chispas", "✨ Chispas"], ["constelaciones", "🌌 Constelaciones"], ["circuito", "🔌 Circuito"], ["fuegos", "🎆 Fuegos artificiales"], ["bandera", "🇵🇪 Bandera"]].forEach(function (o) { var opt = document.createElement("option"); opt.value = o[0]; opt.textContent = o[1]; sel.appendChild(opt); });
            var go = document.createElement("button");
            go.type = "button";
            go.className = "btn small";
            go.textContent = "▶ Ver la animación";
            go.addEventListener("click", function () {
              var base = String(st.base || "").trim().replace(/\/+$/, "");
              if (base && !/^https?:\/\//i.test(base)) base = "https://" + base;
              window.open((base || location.origin) + "/qr/prueba?anim=" + encodeURIComponent(sel.value), "_blank", "noopener");
            });
            var act = document.createElement("a");
            act.className = "btn small ghost";
            act.href = "/admin/#/collections/colegio/entries/settings";
            act.target = "_blank";
            act.rel = "noopener";
            act.textContent = "⚙️ Elegir la animación activa";
            var cam = document.createElement("button");
            cam.type = "button";
            cam.className = "btn small ghost";
            cam.textContent = "📷 Probar el Escáner Tesla";
            cam.title = "Cámara que muestra el efecto sobre el QR en el momento de escanear. Dirección: /escanear";
            cam.addEventListener("click", function () {
              var base = String(st.base || "").trim().replace(/\/+$/, "");
              if (base && !/^https?:\/\//i.test(base)) base = "https://" + base;
              window.open((base || location.origin) + "/escanear", "_blank", "noopener");
            });
            input.appendChild(sel);
            input.appendChild(go);
            input.appendChild(act);
            input.appendChild(cam);
          } else if (fd.type === "image") {
            input = document.createElement("div");
            input.className = "photo";
            input.innerHTML = '<input type="file" accept="image/*" /><button type="button" class="btn small ghost" hidden>Quitar imagen</button>';
          } else {
            input = document.createElement("input");
            input.type = "text";
            if (fd.max) input.maxLength = fd.max;
          }
          input.id = id;
          row.appendChild(input);
          if (fd.type === "range") {
            var out = document.createElement("span");
            out.className = "qval";
            out.id = id + "-v";
            row.appendChild(out);
          }
          if (fd.example && fd.type === "text") {
            var ex = document.createElement("button");
            ex.type = "button";
            ex.className = "qexample";
            ex.textContent = "💡 Usar ejemplo: " + fd.example;
            ex.addEventListener("click", function () { set(fd.key, fd.example); });
            row.appendChild(ex);
          }
        }
        if (fd.hint) {
          var hint = document.createElement("p");
          hint.className = "hint";
          hint.id = id + "-hint";
          row.appendChild(hint);
        }
        body.appendChild(row);
        controls[fd.key] = { el: input, row: row, field: fd };
        if (fd.type === "check") input.addEventListener("change", function () { set(fd.key, input.checked); });
        else if (fd.type === "range") input.addEventListener("input", function () { set(fd.key, Number(input.value)); });
        else if (fd.type === "swatches") input.addEventListener("click", function (e) { var b = e.target.closest("[data-v]"); if (b) set(fd.key, b.dataset.v); });
        else if (fd.type === "intro") { /* solo vista previa: no guarda nada */ }
        else if (fd.type === "image") bindImage(input, fd.key, fd.max || 1600);
        else input.addEventListener(fd.type === "select" ? "change" : "input", function () {
          var v = input.value;
          if (fd.key === "ribbonText" && false) v = v;
          set(fd.key, v);
        });
      });
      det.appendChild(body);
      mount.appendChild(det);
    });
  }
  var NUMERIC = { wmarkAlpha: 1, sparkCount: 1, sparkSize: 1, photoOverlay: 1, titleScale: 1, qrSize: 1, quiet: 1, dotScale: 1, dotRound: 1, logoArea: 1, plateRadius: 1, tilt: 1, scale: 1 };
  function syncControls() {
    GROUPS.forEach(function (g) {
      g.fields.forEach(function (fd) {
        var c = controls[fd.key];
        if (!c) return;
        var v = st[fd.key];
        if (fd.type === "check") c.el.checked = !!v;
        else if (fd.type === "swatches") Array.prototype.forEach.call(c.el.children, function (b) { b.classList.toggle("on", b.dataset.v === v); });
        else if (fd.type === "image") c.el.querySelector("button").hidden = !st[IMAGES[fd.key].el];
        else if (c.el.value !== String(v)) c.el.value = v == null ? "" : String(v);
        if (fd.type === "range") $("qf-" + fd.key + "-v").textContent = v + (fd.unit || "");
        if (fd.showIf) c.row.hidden = !fd.showIf();
        if (fd.hint) $("qf-" + fd.key + "-hint").textContent = typeof fd.hint === "function" ? fd.hint() : fd.hint;
      });
    });
  }
  function bindImage(box, key, maxPx) {
    var meta = IMAGES[key];
    var fileEl = box.querySelector('input[type="file"]');
    var clearEl = box.querySelector("button");
    fileEl.addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var ratio = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * ratio);
        c.height = Math.round(img.naturalHeight * ratio);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        st[meta.data] = c.toDataURL(key === "photo" ? "image/jpeg" : "image/png", 0.8);
        URL.revokeObjectURL(url);
        loadImageData(key, st[meta.data], refresh);
      };
      img.src = url;
    });
    clearEl.addEventListener("click", function () {
      st[meta.el] = null;
      st[meta.data] = "";
      fileEl.value = "";
      refresh();
    });
  }
  function loadImageData(key, dataUrl, done) {
    var meta = IMAGES[key];
    if (!dataUrl) { st[meta.el] = null; if (done) done(); return; }
    var img = new Image();
    img.onload = function () { st[meta.el] = img; if (done) done(); };
    img.onerror = function () { st[meta.el] = null; if (done) done(); };
    img.src = dataUrl;
  }

  function set(key, value) {
    if (NUMERIC[key] && typeof value === "string") value = Number(value);
    if (value === "true") value = true;
    if (value === "false") value = false;
    st[key] = value;
    if (key === "format") applyFormatDefaults();
    if (key === "logoMode" && value === "image" && !st.logoUp) { /* se pide la imagen en el control */ }
    refresh();
  }
  function applyFormatDefaults() {
    var d = FORMATS[st.format].defaults || {};
    Object.keys(d).forEach(function (k) { st[k] = d[k]; });
  }
  function applyPreset(name) {
    var p = PRESETS[name];
    if (!p) return;
    // los efectos nuevos vuelven a su valor neutro para que una plantilla no arrastre los de la anterior
    Object.assign(st, { glow: "none", glowColor: "acento", frameColor: "acento", frameW: "normal", dotColor3: "none", wmark: false, plateBg: "none", badgeText: "", sparkStyle: "rayos", sparkCount: 8, sparkSize: 100, sparkColor: "acento", tilt: 0, ribbonText: "", ribbonStyle: "cinta" });
    Object.keys(p.set).forEach(function (k) { st[k] = p.set[k]; });
    refresh();
  }

  /* ───────── vista previa, semáforo y pruebas ───────── */
  var timer = 0;
  var testTimer = 0;
  function renderHealth() {
    var list = analyze(st);
    var level = list.some(function (i) { return i.level === "bad"; }) ? "bad" : list.some(function (i) { return i.level === "warn"; }) ? "warn" : "ok";
    var label = { ok: "Todo bien: se leerá sin problemas", warn: "Se leerá, pero revisa los avisos", bad: "Hay problemas: puede que no se lea" }[level];
    $("health-head").className = "lights " + level;
    $("health-head").textContent = { ok: "🟢 ", warn: "🟡 ", bad: "🔴 " }[level] + label;
    $("health-list").innerHTML = list.map(function (i) { return '<li class="' + i.level + '"><span>' + { ok: "✓", warn: "!", bad: "✕" }[i.level] + "</span><div><strong>" + esc(i.title) + "</strong><br>" + esc(i.text) + "</div></li>"; }).join("");
  }
  function runTests() {
    var out = $("read-results");
    if (typeof jsQR !== "function" && !window.ZXing) { out.textContent = "No se cargó el lector de prueba."; return; }
    out.textContent = "Probando…";
    setTimeout(function () {
      var res;
      try { res = readTest(st); } catch (e) { out.textContent = "No se pudo probar: " + e.message; return; }
      var ok = res.filter(function (r) { return r.ok; }).length;
      $("read-summary").textContent = ok + " de " + res.length + " pruebas superadas";
      $("read-summary").className = ok === res.length ? "ok" : ok >= res.length - 2 ? "warn" : "bad";
      out.innerHTML = res.map(function (r) { return '<span class="pill ' + (r.ok ? "ok" : "todo") + '">' + (r.ok ? "✓ " : "✕ ") + esc(r.name) + "</span>"; }).join(" ");
    }, 30);
  }
  function refresh() {
    var ch = computeUrl();
    syncControls();
    $("url-out").textContent = payload(st).replace(/\n/g, " ⏎ ").slice(0, 200);
    var warn = st.contentType === "url" && (/example\.com/.test(st.url) || /localhost/.test(st.url));
    $("warn").hidden = !warn;
    $("format-label").textContent = FORMATS[st.format].label;
    var layout = FORMATS[st.format].layout;
    $("dl-pdf").hidden = layout === "solo" || layout === "sticker";
    $("dl-svg").hidden = !(layout === "solo");
    $("series-warn").hidden = st.contentType === "url";
    $("dl-series").disabled = st.contentType !== "url";
    $("dl-all").disabled = st.contentType !== "url";
    $("dl-sheet").disabled = st.contentType !== "url";
    clearTimeout(timer);
    timer = setTimeout(function () {
      try {
        var fmt = FORMATS[st.format];
        render($("preview"), st, Math.min(1, 1100 / fmt.w));
        $("error").hidden = true;
      } catch (e) {
        $("error").hidden = false;
        $("error").textContent = "No se pudo dibujar: " + e.message;
      }
    }, 40);
    renderHealth();
    clearTimeout(testTimer);
    $("read-summary").textContent = "";
    $("read-results").textContent = "Toca “Probar lectura ahora” para simular un celular.";
    st.__channel = ch;
  }

  /* ───────── descargas ───────── */
  function download(name, blob) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function fileBase() { return "qr-nikola-tesla-" + (st.__channel || st.contentType) + "-" + st.format; }
  function canvasBytes(c) {
    return new Promise(function (resolve) {
      c.toBlob(function (blob) { blob.arrayBuffer().then(function (buf) { resolve(new Uint8Array(buf)); }); }, "image/png");
    });
  }
  function renderCode(channel, scale) {
    var copy = Object.assign({}, st);
    var ch = String(channel);
    copy.url = String(st.base || "").trim().replace(/\/+$/, "") + "/qr/" + ch;
    copy.display = copy.url.replace(/^https?:\/\//, "").replace(/^www\./, "");
    copy.contentType = "url";
    var c = document.createElement("canvas");
    render(c, copy, scale);
    return canvasBytes(c);
  }
  function seriesZip() {
    var prefix = String($("series-prefix").value || "volante").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "volante";
    var from = Math.max(0, Number($("series-from").value) || 1);
    var count = Math.min(100, Math.max(1, Number($("series-count").value) || 10));
    var scale = Math.min(Number($("scale").value), FORMATS[st.format].w > 2000 ? 1 : 2);
    var files = [];
    var i = 0;
    var btn = $("dl-series");
    function next() {
      if (i >= count) {
        btn.textContent = "Descargar serie numerada (ZIP)";
        btn.disabled = false;
        download("serie-" + prefix + "-" + st.format + ".zip", zipStore(files));
        return;
      }
      var code = prefix + "-" + String(from + i).padStart(3, "0");
      btn.textContent = "Creando " + (i + 1) + " de " + count + "…";
      renderCode(code, scale).then(function (bytes) { files.push({ name: "qr-" + code + ".png", data: bytes }); i++; setTimeout(next, 0); });
    }
    btn.disabled = true;
    next();
  }
  /** Dibuja un QR "solo" (sin afiche) con el estilo actual, con el contenido indicado. */
  function codeCanvas(content, scale) {
    var copy = Object.assign({}, st, { format: "solo", contentType: "text", freeText: content });
    var c = document.createElement("canvas");
    render(c, copy, scale);
    return c;
  }
  function sheetPdf() {
    var prefix = String($("series-prefix").value || "volante").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "volante";
    var from = Math.max(0, Number($("series-from").value) || 1);
    var count = Math.min(100, Math.max(1, Number($("series-count").value) || 20));
    var base = String(st.base || "").trim().replace(/\/+$/, "");
    var W = 2480, H = 3508, M = 150, cols = 4, rows = 5, per = cols * rows;
    var sheets = Math.ceil(count / per);
    var files = [];
    for (var s = 0; s < sheets; s++) {
      var c = document.createElement("canvas");
      c.width = W; c.height = H;
      var g = c.getContext("2d");
      g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, H);
      g.fillStyle = C.noche; g.font = fontStr(800, 64, "Bricolage Grotesque"); g.textBaseline = "alphabetic";
      g.fillText((st.site && st.site.shortName ? st.site.shortName : "Nikola Tesla") + " · Códigos QR · " + prefix, M, M + 40);
      var cw = (W - 2 * M) / cols, ch = (H - 2 * M - 120) / rows;
      for (var k = 0; k < per && s * per + k < count; k++) {
        var n = from + s * per + k, code = prefix + "-" + String(n).padStart(3, "0");
        var qc = codeCanvas(base + "/qr/" + code, 1);
        var side = Math.min(cw - 60, ch - 110);
        var x = M + (k % cols) * cw + (cw - side) / 2, y = M + 120 + Math.floor(k / cols) * ch;
        g.drawImage(qc, x, y, side, side);
        g.fillStyle = C.noche; g.font = fontStr(800, 46, "Figtree"); g.textAlign = "center";
        g.fillText(code, x + side / 2, y + side + 52);
        g.textAlign = "left";
        g.strokeStyle = "#BBBBBB"; g.setLineDash([10, 10]); g.lineWidth = 2;
        g.strokeRect(M + (k % cols) * cw + 8, y - 12, cw - 16, ch - 8);
        g.setLineDash([]);
      }
      files.push({ name: "hoja-" + prefix + "-" + (s + 1) + ".pdf", data: pdfFromJpegDataUrl(c.toDataURL("image/jpeg", 0.95), W, H, 300) });
    }
    if (files.length === 1) download(files[0].name, files[0].data);
    else download("hojas-" + prefix + ".zip", zipStore(files));
  }
  function ticketsZip() {
    var event = String($("tk-event").value || "Evento").trim().slice(0, 40) || "Evento";
    var evKey = event.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "evento";
    var names = String($("tk-names").value || "").split(/\n+/).map(function (x) { return x.replace(/[|]/g, " ").trim(); }).filter(Boolean).slice(0, 100);
    if (!names.length) { alert("Escribe al menos un nombre."); return; }
    var btn = $("dl-tickets");
    var files = [];
    var i = 0;
    btn.disabled = true;
    function next() {
      if (i >= names.length) {
        btn.textContent = "Descargar entradas (ZIP)";
        btn.disabled = false;
        download("entradas-" + evKey + ".zip", zipStore(files));
        return;
      }
      btn.textContent = "Creando " + (i + 1) + " de " + names.length + "…";
      var id = String(i + 1).padStart(3, "0");
      var qc = codeCanvas("TESLA-TICKET|" + evKey + "|" + names[i] + "|" + id, 1);
      var c = document.createElement("canvas");
      c.width = 1200; c.height = 1500;
      var g = c.getContext("2d");
      g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, 1200, 1500);
      g.drawImage(qc, 0, 0, 1200, 1200);
      g.fillStyle = C.noche; g.textAlign = "center";
      g.font = fontStr(800, 70, "Bricolage Grotesque"); g.fillText(names[i], 600, 1290, 1100);
      g.font = fontStr(600, 44, "Figtree"); g.fillText(event + " · Entrada " + id, 600, 1370, 1100);
      var fname = "entrada-" + id + "-" + names[i].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + ".png";
      canvasBytes(c).then(function (bytes) { files.push({ name: fname, data: bytes }); i++; setTimeout(next, 0); });
    }
    next();
  }
  function allPlacesZip() {
    var places = ["volante", "afiche", "banner", "redes", "boletin"];
    var scale = Math.min(Number($("scale").value), FORMATS[st.format].w > 2000 ? 1 : 2);
    var files = [];
    var i = 0;
    var btn = $("dl-all");
    function next() {
      if (i >= places.length) {
        btn.textContent = "Descargar todos los lugares (ZIP)";
        btn.disabled = false;
        download("todos-los-lugares-" + st.format + ".zip", zipStore(files));
        return;
      }
      btn.textContent = "Creando " + (i + 1) + " de " + places.length + "…";
      renderCode(places[i], scale).then(function (bytes) { files.push({ name: "qr-" + places[i] + ".png", data: bytes }); i++; setTimeout(next, 0); });
    }
    btn.disabled = true;
    next();
  }
  function bindDownloads() {
    $("scale").addEventListener("change", function () { st.scale = Number($("scale").value); });
    $("dl-png").addEventListener("click", function () {
      var c = document.createElement("canvas");
      render(c, st, Number($("scale").value));
      c.toBlob(function (blob) { download(fileBase() + "-x" + $("scale").value + ".png", blob); }, "image/png");
    });
    $("dl-pdf").addEventListener("click", function () {
      var fmt = FORMATS[st.format];
      var c = document.createElement("canvas");
      var scale = fmt.dpi >= 300 ? 1 : 2;
      render(c, st, scale);
      // el JPEG no tiene transparencia: se pinta sobre blanco
      var flat = document.createElement("canvas");
      flat.width = c.width; flat.height = c.height;
      var fg = flat.getContext("2d");
      fg.fillStyle = "#FFFFFF"; fg.fillRect(0, 0, flat.width, flat.height); fg.drawImage(c, 0, 0);
      download(fileBase() + ".pdf", pdfFromJpegDataUrl(flat.toDataURL("image/jpeg", 0.95), flat.width, flat.height, fmt.dpi * scale));
    });
    $("dl-svg").addEventListener("click", function () {
      var bmp = logoBitmap(st);
      var uri = "";
      if (bmp) {
        // el centro se incrusta reducido para que el SVG no pese cientos de KB
        var k = Math.min(1, 256 / Math.max(bmp.width, bmp.height));
        var small = document.createElement("canvas");
        small.width = Math.max(1, Math.round(bmp.width * k));
        small.height = Math.max(1, Math.round(bmp.height * k));
        small.getContext("2d").drawImage(bmp, 0, 0, small.width, small.height);
        uri = small.toDataURL("image/png");
      }
      download("qr-nikola-tesla-" + (st.__channel || st.contentType) + ".svg", new Blob([buildSVG(st, uri)], { type: "image/svg+xml" }));
    });
    $("dl-anim").addEventListener("click", function () {
      var b = $("dl-anim");
      b.disabled = true;
      b.textContent = "Grabando (4 s)…";
      recordAnimation(st, function (blob) { b.disabled = false; b.textContent = "Descargar animación (WebM)"; download("qr-animado-nikola-tesla.webm", blob); });
    });
    $("dl-series").addEventListener("click", seriesZip);
    $("dl-all").addEventListener("click", allPlacesZip);
    $("dl-sheet").addEventListener("click", sheetPdf);
    $("dl-tickets").addEventListener("click", ticketsZip);
    $("copy").addEventListener("click", function () {
      var done = function () { $("copy").textContent = "¡Copiado!"; setTimeout(function () { $("copy").textContent = "Copiar contenido"; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(payload(st)).then(done);
    });
    $("run-test").addEventListener("click", runTests);
    $("cam-start").addEventListener("click", toggleCamera);
  }

  /* ───────── prueba con la cámara ───────── */
  var camStream = null;
  var camTimer = 0;
  function stopCamera() {
    if (camStream) camStream.getTracks().forEach(function (t) { t.stop(); });
    camStream = null;
    clearInterval(camTimer);
    $("cam-box").hidden = true;
    $("cam-start").textContent = "Probar con la cámara";
  }
  function toggleCamera() {
    if (camStream) { stopCamera(); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { $("cam-result").textContent = "Este navegador no permite usar la cámara aquí."; $("cam-box").hidden = false; return; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (stream) {
      camStream = stream;
      var video = $("cam-video");
      video.srcObject = stream;
      video.play();
      $("cam-box").hidden = false;
      $("cam-start").textContent = "Apagar la cámara";
      $("cam-result").textContent = "Muestra el QR impreso a la cámara…";
      $("cam-result").className = "";
      var work = document.createElement("canvas");
      var want = payload(st);
      camTimer = setInterval(function () {
        if (!video.videoWidth) return;
        var w = Math.min(640, video.videoWidth);
        work.width = w;
        work.height = Math.round((w * video.videoHeight) / video.videoWidth);
        work.getContext("2d").drawImage(video, 0, 0, work.width, work.height);
        var found = decode(work);
        if (found) {
          var same = found === want;
          $("cam-result").className = same ? "ok" : "bad";
          $("cam-result").textContent = same ? "✓ ¡Se leyó bien! Abre: " + found.slice(0, 80) : "⚠ Se leyó otro QR distinto: " + found.slice(0, 80);
          if (same) setTimeout(stopCamera, 1500);
        }
      }, 300);
    }).catch(function () {
      $("cam-box").hidden = false;
      $("cam-result").className = "bad";
      $("cam-result").textContent = "No se pudo abrir la cámara. Revisa el permiso del navegador.";
    });
  }

  /* ───────── mis diseños ───────── */
  var STORE = "tesla-qr-disenos";
  function readDesigns() { try { return JSON.parse(localStorage.getItem(STORE) || "[]"); } catch (e) { return []; } }
  function writeDesigns(list) { try { localStorage.setItem(STORE, JSON.stringify(list)); return true; } catch (e) { alert("No se pudo guardar: el navegador no tiene espacio. Prueba quitando la foto de fondo o exporta el diseño a un archivo."); return false; } }
  function snapshot() {
    var o = {};
    KEYS.forEach(function (k) { o[k] = st[k]; });
    o.photoData = st.photoData || "";
    o.logoUpData = st.logoUpData || "";
    return o;
  }
  function restore(o) {
    // diseños de versiones anteriores
    if (o.qrStyle === "clasico") { o = Object.assign({}, o, { dotShape: "square", eyeOuter: "square", eyeInner: "square", ringColor: "noche", ballColor: "noche" }); }
    KEYS.forEach(function (k) { if (o[k] !== undefined) st[k] = o[k]; });
    st.photoData = o.photoData || "";
    st.logoUpData = o.logoUpData || "";
    loadImageData("photo", st.photoData, function () { loadImageData("logoUp", st.logoUpData, refresh); });
  }
  function renderDesigns() {
    var list = readDesigns();
    var box = $("designs");
    if (!list.length) { box.innerHTML = '<p class="muted" style="margin:0">Aún no guardaste ningún diseño. Cuando uno te guste, ponle nombre y guárdalo.</p>'; return; }
    box.innerHTML = list.map(function (d, i) {
      return '<div class="drow"><div><strong>' + esc(d.name) + '</strong><div class="muted" style="font-size:13px">' + esc(FORMATS[d.data.format] ? FORMATS[d.data.format].label : "") + '</div></div><div class="row"><button class="btn small" data-act="load" data-i="' + i + '" type="button">Abrir</button><button class="btn small ghost" data-act="dup" data-i="' + i + '" type="button">Duplicar</button><button class="btn small ghost" data-act="del" data-i="' + i + '" type="button">Borrar</button></div></div>';
    }).join("");
  }
  function bindDesigns() {
    $("save-design").addEventListener("click", function () {
      var name = ($("design-name").value || "").trim();
      if (!name) { $("design-name").focus(); $("design-name").placeholder = "Escribe un nombre primero"; return; }
      var list = readDesigns();
      var existing = list.filter(function (d) { return d.name === name; })[0];
      if (existing) existing.data = snapshot(); else list.push({ name: name, data: snapshot() });
      if (writeDesigns(list)) { $("design-name").value = ""; renderDesigns(); }
    });
    $("designs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var list = readDesigns();
      var d = list[Number(b.dataset.i)];
      if (!d) return;
      if (b.dataset.act === "load") restore(d.data);
      if (b.dataset.act === "dup") { list.push({ name: d.name + " (copia)", data: d.data }); writeDesigns(list); renderDesigns(); }
      if (b.dataset.act === "del" && confirm("¿Borrar el diseño “" + d.name + "”?")) { list.splice(Number(b.dataset.i), 1); writeDesigns(list); renderDesigns(); }
    });
    $("export-designs").addEventListener("click", function () { download("disenos-qr-nikola-tesla.json", new Blob([JSON.stringify(readDesigns())], { type: "application/json" })); });
    $("import-designs").addEventListener("change", function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var incoming = JSON.parse(r.result);
          if (!Array.isArray(incoming)) throw new Error("formato");
          var list = readDesigns().concat(incoming.filter(function (d) { return d && d.name && d.data; }));
          if (writeDesigns(list)) renderDesigns();
        } catch (err) { alert("Ese archivo no es un respaldo de diseños válido."); }
      };
      r.readAsText(file);
      e.target.value = "";
    });
    $("reset").addEventListener("click", function () { if (confirm("¿Volver al diseño inicial? Se pierden los cambios que no hayas guardado.")) { initDefaults(); refresh(); } });
  }

  /* ───────── plantillas de estilo (botones) ───────── */
  function buildPresets() {
    var box = $("presets");
    box.innerHTML = Object.keys(PRESETS).map(function (k) { return '<button type="button" class="chip-btn" data-p="' + k + '">' + esc(PRESETS[k].label) + "</button>"; }).join("");
    box.addEventListener("click", function (e) { var b = e.target.closest("[data-p]"); if (b) applyPreset(b.dataset.p); });
  }

  /* ───────── valores iniciales desde los datos del colegio ───────── */
  function longDate(iso) {
    try { return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long" }).format(new Date(iso + "T00:00:00")); } catch (e) { return iso; }
  }
  function initDefaults() {
    var site = st.site || {};
    st.photo = null; st.photoData = ""; st.logoUp = null; st.logoUpData = "";
    st.theme = "noche"; st.accent = "filamento"; st.photoOverlay = 70; st.waves = true; st.align = "left";
    st.format = st.format && FORMATS[st.format] ? st.format : "vertical";
    st.title1 = "Admisión"; st.title2 = String(site.year || "2027"); st.titleUpper = true; st.titleScale = 100;
    st.subtitle = "Escanea y agenda tu visita";
    st.chips = (site.levels || ["Primaria", "Secundaria"]).join(", ");
    st.bullets = "Conoce nuestra propuesta educativa\nPrimaria y Secundaria\nVisítanos y agenda tu cita";
    st.deadline = site.deadline ? "Inscripciones hasta el " + longDate(site.deadline) : "";
    st.qrSize = 100; st.qrLabel = ""; st.channel = "volante"; st.custom = ""; st.base = site.siteUrl || "";
    st.contentType = "url"; st.ec = "H"; st.quiet = 4;
    st.waNumber = waFormat((site.whatsapp || [])[0]);
    st.waMessage = "Hola, quisiera información sobre la Admisión " + (site.year || "2027");
    st.telNumber = waFormat((site.whatsapp || [])[0]);
    st.mailTo = ""; st.mailSubject = "Información de admisión";
    st.mapQuery = (site.location && site.location.mapQuery) || "";
    st.freeText = ""; st.vcName = site.name || ""; st.vcOrg = site.name || ""; st.vcPhone = waFormat((site.whatsapp || [])[0]); st.vcEmail = "";
    st.vcAddress = [site.location && site.location.address, site.location && site.location.district, site.location && site.location.province].filter(Boolean).join(", ");
    st.wifiSsid = ""; st.wifiPass = ""; st.wifiType = "WPA";
    Object.assign(st, PRESETS.marca.set);
    st.dotRound = 22; st.dotScale = 94; st.dotColor2 = "marino"; st.logoText = String(site.year || "2027"); st.logoArea = 7; st.logoBorderW = "normal"; st.logoMono = false;
    st.plateRadius = 7; st.shadow = "soft"; st.frame = "none"; st.tilt = 0; st.sparks = false; st.ribbonText = ""; st.ribbonPos = "bottom"; st.ribbonStyle = "cinta";
    st.sparkStyle = "rayos"; st.sparkCount = 8; st.sparkSize = 100; st.sparkColor = "acento"; st.glow = "none"; st.glowColor = "acento"; st.frameColor = "acento"; st.frameW = "normal";
    st.dotColor3 = "none"; st.wmark = false; st.wmarkAlpha = 12; st.plateBg = "none"; st.badgeText = ""; st.badgePos = "sd"; st.badgeShape = "circulo";
    st.whatsapp = waFormat((site.whatsapp || [])[0]);
    st.address = [site.location && site.location.address, site.location && site.location.district, site.location && site.location.province].filter(Boolean).join(", ");
    st.extra = "";
    st.footer = [site.location && site.location.district, site.location && site.location.province].filter(Boolean).join(", ");
    st.scale = 2;
    applyFormatDefaults();
  }

  function loadImage(src) {
    return new Promise(function (resolve) { var img = new Image(); img.onload = function () { resolve(img); }; img.onerror = function () { resolve(null); }; img.src = src; });
  }

  /* ───────── arranque ───────── */
  window.QRDesigner = {
    state: st, FORMATS: FORMATS, THEMES: THEMES, PRESETS: PRESETS, render: render, buildMatrix: buildMatrix, buildSVG: buildSVG, pdf: pdfFromJpegDataUrl, zip: zipStore,
    set: set, refresh: refresh, applyPreset: applyPreset, snapshot: snapshot, restore: restore, payload: payload, analyze: analyze, readTest: readTest,
    logoBitmap: logoBitmap, recordAnimation: recordAnimation,
  };
  Promise.all([
    fetch("/admin/api/site").then(function (r) { return r.json(); }),
    loadImage(LOGO_URL),
    document.fonts ? document.fonts.load('800 80px "Bricolage Grotesque"') : null,
    document.fonts ? document.fonts.load('700 40px "Figtree"') : null,
    document.fonts ? document.fonts.load('600 30px "Figtree"') : null,
  ]).then(function (res) {
    st.site = res[0];
    st.logoImg = res[1];
    initDefaults();
    buildControls($("controls"));
    buildPresets();
    bindDownloads();
    bindDesigns();
    renderDesigns();
    $("copy").disabled = false;
    refresh();
  }).catch(function (err) {
    if (window.console) console.error("Diseñador de QR:", err);
    $("error").hidden = false;
    $("error").textContent = "No se pudo preparar el diseñador (" + (err && err.message ? err.message : "error") + "). Recarga la página.";
  });
})();
