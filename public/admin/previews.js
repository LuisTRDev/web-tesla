/*
 * VISTAS PREVIAS DEL PANEL (/admin)
 * Muestran, mientras se edita, cómo quedará cada sección en la web: mismos colores, tipografías y
 * composición. Las clases son de Tailwind y se compilan a public/admin/preview.css
 * (npm run build:admin-css, que se ejecuta solo en `npm run dev` y `npm run build`).
 * Límites: los efectos animados (rayos, chispas, scroll) y las ilustraciones SVG no se muestran aquí;
 * se ven al publicar. Si falta una foto se muestra un recuadro "Foto pendiente".
 */
(function () {
  var CMS = window.CMS;
  var h = window.h;
  if (!CMS || !h) return;

  CMS.registerPreviewStyle("/admin/preview.css");

  /* ───────── utilidades ───────── */
  var DASH = "—";
  function data(props) {
    var d = props.entry.get("data");
    return d && d.toJS ? d.toJS() : {};
  }
  function src(props, path) {
    if (!path) return "";
    try {
      var asset = props.getAsset(path);
      return (asset && asset.toString()) || path;
    } catch (e) {
      return path;
    }
  }
  function t(value, fallback) {
    return value && String(value).trim() ? value : fallback || DASH;
  }
  function arr(value) {
    return Array.isArray(value) ? value : [];
  }
  function long(date) {
    if (!date) return "";
    var parts = String(date).slice(0, 10).split("-");
    var months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return parts.length === 3 ? Number(parts[2]) + " de " + months[Number(parts[1]) - 1] + " de " + parts[0] : date;
  }
  function Frame(children, extra) {
    return h("div", { className: "font-sans text-tinta " + (extra || "") }, children);
  }
  function Note(text) {
    return h("p", { className: "bg-filamento/30 px-4 py-2 text-center text-[12px] font-medium text-noche" }, "Vista previa · " + text + " · haz clic en un texto o foto para ir a su campo");
  }
  /* Marca un elemento con la ruta de su campo en el formulario: [etiqueta, número de elemento, etiqueta…].
   * Los textos se enlazan solos por su contenido; esta marca sirve para fotos y textos compuestos. */
  function F(path, extra) {
    var o = { "data-field": JSON.stringify(path) };
    for (var k in extra) o[k] = extra[k];
    return o;
  }
  function Draft(label, dark) {
    return h("span", { className: "inline-flex rounded-full border border-dashed px-2.5 py-0.5 text-[11px] font-medium " + (dark ? "border-white/40 text-white/75" : "border-tinta/35 text-tinta/70") }, label || "Por confirmar");
  }
  function Photo(props, path, label, cls, dark, field) {
    var url = src(props, path);
    if (url) return h("img", F(field || [], { src: url, alt: "", className: "h-full w-full object-cover " + (cls || "") }));
    return h("div", F(field || [], { className: "flex h-full w-full items-end p-3 text-[11px] font-medium " + (dark ? "ph-dark bg-noche-700 text-white/65" : "ph-light bg-tiza-300 text-tinta/60") + " " + (cls || "") }), "[FOTO PENDIENTE] " + (label || ""));
  }
  function Heading(text, cls) {
    return h("h2", { className: "text-balance font-display font-extrabold leading-[0.95] tracking-[-0.03em] " + (cls || "text-4xl text-noche") }, text);
  }

  /* ───────── Datos del colegio: portada + cifras + pie ───────── */
  CMS.registerPreviewTemplate("settings", function (props) {
    var d = data(props);
    var img = d.images || {};
    var loc = d.location || {};
    var contact = d.contact || {};
    var legal = d.legal || {};
    var social = d.social || {};
    var heroBg = src(props, img.hero);
    var words = String(t(d.shortName, "Nikola Tesla")).split(" ");
    return Frame([
      Note("Portada, cifras y pie de página"),
      h("section", { "data-field": JSON.stringify(["Fotos y video principales", "Foto de la portada"]), className: "hero-aurora relative flex min-h-[520px] flex-col justify-end overflow-hidden bg-noche text-white", style: heroBg ? { backgroundImage: "linear-gradient(to top,#0D1230,rgba(13,18,48,.55)),url(" + heroBg + ")", backgroundSize: "cover", backgroundPosition: "center" } : { background: "radial-gradient(60% 55% at 78% 30%,rgba(255,182,39,.22),transparent 70%),radial-gradient(55% 60% at 12% 75%,rgba(169,173,255,.28),transparent 70%),#0D1230" } }, [
        h("div", { key: "c", className: "px-6 pb-8 pt-20" }, [
          h("span", { key: "chip", className: "mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-4 text-[13px] font-medium" }, [
            h("span", F(["Año de admisión"], { key: "y", className: "rounded-full bg-filamento px-3 py-1 text-[11px] font-bold uppercase text-noche" }), "Admisión " + t(d.admissionYear, "")),
            "Infórmate sobre el proceso",
          ]),
          h("p", { key: "k", className: "text-[14px] text-white/80" }, t(d.kicker)),
          h("h1", { key: "h", className: "font-display text-7xl font-extrabold uppercase leading-[0.82] tracking-[-0.045em]" }, words.map(function (w, i) { return h("span", { key: i, className: "block" }, w); })),
          h("p", { key: "t", className: "mt-6 max-w-[20ch] text-balance font-display text-3xl font-semibold leading-[1.08]" }, t(d.tagline)),
          h("p", F(["Ubicación", "Distrito"], { key: "l", className: "mt-8 border-t border-white/15 pt-4 text-sm text-white/60" }), [loc.district, loc.province, loc.region].filter(Boolean).join(", ")),
        ]),
      ]),
      h("section", { key: "stats", className: "bg-tiza px-6 py-10" }, [
        h("dl", { key: "dl", className: "grid grid-cols-3 gap-4 border-t border-noche/15 pt-6" }, arr(d.stats).map(function (s, i) {
          return h("div", { key: i, className: "flex flex-col-reverse" }, [
            h("dt", { key: "l", className: "mt-2 text-[13px] font-medium text-niebla" }, t(s.label)),
            h("dd", F(["Cifras del colegio", i, "Valor"], { key: "v", className: "font-display text-3xl font-extrabold leading-none tracking-[-0.03em] text-noche sm:text-5xl" }), s.value ? s.value : h("span", { className: "text-noche/30" }, "[DATO]")),
          ]);
        })),
        d.admissionDeadline ? h("p", F(["Último día de inscripciones"], { key: "dl2", className: "mt-6 text-sm text-niebla" }), "Contador de admisión hasta el " + long(d.admissionDeadline)) : null,
      ]),
      h("footer", { key: "foot", className: "bg-noche px-6 py-10 text-white" }, [
        h("p", { key: "p", className: "font-display text-4xl font-extrabold leading-none tracking-[-0.03em]" }, t(d.footerPhrase)),
        h("div", { key: "g", className: "mt-8 space-y-1 border-t border-white/10 pt-6 text-[14px] text-white/80" }, [
          h("p", { key: "n", className: "font-semibold text-white" }, t(d.name)),
          h("p", F(["Ubicación", "Dirección"], { key: "a" }), [loc.address, loc.district, loc.province].filter(Boolean).join(", ")),
          h("p", F(["Contacto", "Números de WhatsApp"], { key: "w" }), "WhatsApp: " + (arr(contact.whatsapp).join(" · ") || "[WHATSAPP OFICIAL]")),
          h("p", F(["Contacto", "Horario de atención"], { key: "h" }), "Horario: " + t(contact.hours, "[HORARIO]")),
          h("p", F(["Respaldo oficial", "Resolución de funcionamiento (UGEL)"], { key: "r", className: "text-white/60" }), "Resolución: " + t(legal.resolution, "[RESOLUCIÓN – UGEL]") + " · Código modular: " + t(legal.modularCode, "[CÓDIGO MODULAR]")),
          h("p", F(["Redes sociales", "Facebook"], { key: "s", className: "text-white/60" }), "Redes: " + (["facebook", "instagram", "tiktok", "youtube"].filter(function (k) { return social[k]; }).join(", ") || "ninguna")),
        ]),
      ]),
    ]);
  });

  /* ───────── Secciones del sitio (cabeceras) ───────── */
  var THEMES = {
    nosotros: "bg-tiza text-noche",
    propuesta: "bg-noche text-white",
    niveles: "bg-marino text-white",
    actividades: "bg-rojo-700 text-white",
    galeria: "bg-noche-900 text-white",
    noticias: "bg-white text-noche",
    admision: "bg-filamento text-noche",
    contacto: "bg-arco-100 text-noche",
  };
  CMS.registerPreviewTemplate("modules", function (props) {
    var d = data(props);
    return Frame([
      Note("Cabecera de cada sección"),
      arr(d.items).map(function (m, i) {
        return h("section", { key: i, className: "mb-3 px-6 py-10 " + (THEMES[m.id] || "bg-noche text-white") }, [
          h("p", { key: "k", className: "text-[13px] font-semibold uppercase tracking-[0.08em] opacity-80" }, String(i + 1).padStart(2, "0") + " · " + t(m.kicker || m.label)),
          h("h2", { key: "t", className: "mt-3 max-w-[14ch] text-balance font-display text-5xl font-extrabold leading-[0.92] tracking-[-0.035em]" }, t(m.title)),
          h("p", { key: "i", className: "mt-4 max-w-md text-[16px] leading-relaxed opacity-85" }, t(m.intro)),
          h("p", { key: "te", className: "mt-4 text-[13px] opacity-70" }, "En la portada: " + t(m.teaser)),
          h("p", { key: "g", className: "mt-1 text-[12px] opacity-60" }, "En Google: " + t(m.seoDescription)),
        ]);
      }),
    ]);
  });

  /* ───────── Portada y página de campaña ───────── */
  CMS.registerPreviewTemplate("pages", function (props) {
    var d = data(props);
    var c = d.campaign || {};
    return Frame([
      Note("Aviso de la portada y página de campaña"),
      h("div", { key: "home", className: "hero-aurora bg-noche px-6 py-8 text-white" }, [
        h("span", { key: "chip", className: "inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-4 text-[13px] font-medium" }, [
          h("span", { key: "y", className: "rounded-full bg-filamento px-3 py-1 text-[11px] font-bold uppercase text-noche" }, "Admisión"),
          t((d.home || {}).admissionNotice),
        ]),
      ]),
      h("section", { key: "camp", className: "hero-aurora bg-noche px-6 pb-12 pt-10 text-white" }, [
        h("p", { key: "b", className: "inline-flex rounded-full bg-filamento px-4 py-1.5 text-[12px] font-bold uppercase text-noche" }, t(c.badge)),
        h("h1", { key: "h", className: "mt-5 font-display text-6xl font-extrabold uppercase leading-[0.86] tracking-[-0.045em]" }, "Admisión"),
        h("p", { key: "g", className: "mt-4 text-[12px] text-white/60" }, "En Google: " + t(c.seoDescription)),
      ]),
      h("section", { key: "why", className: "bg-white px-6 py-10" }, [
        Heading(t(c.reasonsTitle), "text-4xl text-noche"),
        h("ul", { key: "u", className: "mt-6 grid gap-4" }, arr(c.reasons).map(function (r, i) {
          return h("li", { key: i, className: "overflow-hidden rounded-[28px] bg-noche text-white" }, [
            h("div", { key: "i", className: "flex aspect-[16/7] items-center justify-center bg-noche-700 text-[12px] text-arco" }, "Ilustración: " + t(r.illustration)),
            h("div", { key: "t", className: "p-6" }, [h("h3", { key: "h", className: "font-display text-2xl font-bold" }, t(r.title)), h("p", { key: "p", className: "mt-2 text-white/75" }, t(r.description))]),
          ]);
        })),
      ]),
      h("section", { key: "steps", className: "bg-filamento px-6 py-10 text-noche" }, [Heading(t(c.stepsTitle), "text-4xl")]),
      h("section", { key: "visit", className: "bg-tiza px-6 py-10" }, [
        Heading(t(c.visitTitle), "text-4xl text-noche"),
        h("p", { key: "p", className: "mt-4 max-w-md text-lg text-niebla" }, t(c.visitText)),
      ]),
    ]);
  });

  /* ───────── Aviso destacado ───────── */
  var BAR = { amarillo: "bg-filamento text-noche", rojo: "bg-rojo-700 text-white", azul: "bg-marino text-white", oscuro: "bg-noche-900 text-white" };
  var WHERE = { todas: "todas las páginas", portada: "solo la portada", admision: "solo Admisión", "nosotros-propuesta": "Nosotros, Propuesta, Niveles y Actividades", "noticias-calendario": "Noticias, Calendario y Galería" };
  CMS.registerPreviewTemplate("banner", function (props) {
    var d = data(props);
    var items = arr(d.items);
    return Frame([
      Note("Avisos sobre el menú"),
      items.length === 0 ? h("p", { key: "none", className: "px-6 py-6 text-[14px] text-niebla" }, "Todavía no hay avisos. Pulsa “Añadir avisos” para crear el primero.") : null,
    ].concat(items.map(function (item, i) {
      var range = item.startDate || item.endDate ? "Se muestra " + (item.startDate ? "desde el " + long(item.startDate) : "desde ahora") + (item.endDate ? " hasta el " + long(item.endDate) : " sin fecha de fin") + "." : "Se muestra sin fecha de fin.";
      return h("div", { key: "a" + i, className: "mb-5" }, [
        item.enabled === false ? h("p", { key: "off", className: "bg-tiza-200 px-4 py-2 text-center text-[12px] font-semibold text-niebla" }, "APAGADO: no se muestra en la web.") : null,
        h("div", { key: "bar", className: "flex h-10 items-center justify-center gap-3 px-6 text-[13px] font-semibold " + (BAR[item.color] || BAR.amarillo) }, [
          h("span", { key: "t" }, t(item.text)),
          item.linkText ? h("span", { key: "l", className: "underline decoration-2 underline-offset-4" }, item.linkText) : null,
        ]),
        h("p", { key: "r", className: "px-6 pt-2 text-[12px] text-niebla" }, range + " Páginas: " + (WHERE[item.where] || WHERE.todas) + "." + (item.linkUrl ? " El botón lleva a " + item.linkUrl + "." : "")),
      ]);
    })).concat([
      items.length > 1 ? h("p", { key: "rot", className: "px-6 pb-4 text-[12px] font-semibold text-noche" }, "Si varios avisos coinciden en fechas y página, se alternan cada 7 segundos.") : null,
    ]));
  });

  /* ───────── Nosotros ───────── */
  CMS.registerPreviewTemplate("philosophy", function (props) {
    var d = data(props);
    var a = d.about || {};
    return Frame([
      Note("Sección Nosotros"),
      h("section", { key: "a", className: "bg-tiza px-6 py-12" }, [
        a.confirmed === false ? Draft("Texto por confirmar") : null,
        h("h2", { key: "t", className: "mt-4 font-display text-6xl font-extrabold leading-[0.92] tracking-[-0.035em] text-noche" }, t(a.title)),
        h("blockquote", { key: "q", className: "mt-6 border-l-4 border-rojo pl-5 font-display text-2xl font-semibold text-noche" }, t(a.quote)),
        arr(a.paragraphs).map(function (p, i) { return h("p", { key: i, className: "mt-5 max-w-lg text-lg leading-relaxed text-tinta/85" }, p); }),
      ]),
      h("section", { key: "c", className: "bg-noche px-6 py-12 text-white" }, [
        h("ul", { key: "u", className: "grid grid-cols-2 gap-px bg-white/10" }, arr(d.items).map(function (c, i) {
          return h("li", { key: i, className: "bg-noche p-5" }, [h("h3", { key: "h", className: "font-display text-2xl font-bold" }, t(c.title)), h("p", { key: "p", className: "mt-2 text-[14px] text-white/70" }, t(c.description))]);
        })),
      ]),
    ]);
  });

  CMS.registerPreviewTemplate("team", function (props) {
    var d = data(props);
    return Frame([
      Note("Nuestro equipo"),
      h("ul", { key: "u", className: "grid grid-cols-2 gap-4 bg-white px-6 py-10" }, arr(d.items).map(function (m, i) {
        return h("li", { key: i }, [
          h("div", { key: "p", className: "aspect-[4/5] overflow-hidden rounded-3xl" }, Photo(props, m.image, "Retrato", "", false, ["Personas", i, "Foto (retrato)"])),
          h("p", { key: "r", className: "mt-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-niebla" }, t(m.role)),
          h("h3", { key: "n", className: "font-display text-xl font-bold text-noche" }, m.name ? m.name : h("span", { className: "text-noche/30" }, "[NOMBRE]")),
          h("p", { key: "b", className: "mt-1 text-[14px] text-niebla" }, t(m.bio, "")),
        ]);
      })),
    ]);
  });

  CMS.registerPreviewTemplate("achievements", function (props) {
    var d = data(props);
    return Frame([
      Note("Nuestros logros"),
      h("ul", { key: "u", className: "divide-y divide-noche/15 bg-tiza px-6 py-8" }, arr(d.items).map(function (a, i) {
        return h("li", { key: i, className: "py-5" }, [
          h("p", { key: "y", className: "font-display text-3xl font-extrabold text-rojo" }, t(a.year, "—")),
          h("h3", { key: "t", className: "mt-1 font-display text-2xl font-bold text-noche" }, t(a.title)),
          h("p", { key: "d", className: "mt-1 text-[15px] text-niebla" }, t(a.description, "")),
          a.isPlaceholder ? h("div", { key: "b", className: "mt-2" }, Draft("Espacio de ejemplo")) : null,
        ]);
      })),
    ]);
  });

  CMS.registerPreviewTemplate("testimonials", function (props) {
    var d = data(props);
    return Frame([
      Note("Lo que dice nuestra comunidad"),
      h("ul", { key: "u", className: "space-y-4 bg-noche px-6 py-10 text-white" }, arr(d.items).map(function (q, i) {
        return h("li", { key: i, className: "rounded-3xl bg-white/5 p-6" }, [
          h("p", { key: "q", className: "font-display text-2xl font-semibold leading-snug" }, "“" + t(q.quote) + "”"),
          h("p", { key: "a", className: "mt-4 text-[14px] text-white/70" }, t(q.author) + " · " + t(q.role)),
          q.isPlaceholder ? h("div", { key: "b", className: "mt-2" }, Draft("Espacio de ejemplo", true)) : null,
        ]);
      })),
    ]);
  });

  /* ───────── Propuesta, niveles, actividades, experiencia ───────── */
  CMS.registerPreviewTemplate("pillars", function (props) {
    var d = data(props);
    return Frame([
      Note("Propuesta educativa"),
      h("section", { key: "s", className: "bg-noche px-6 py-10 text-white" }, [
        h("ol", { key: "o", className: "border-t border-white/15" }, arr(d.items).map(function (p, i) {
          return h("li", { key: i, className: "border-b border-white/15 py-5" }, [
            h("div", { key: "r", className: "flex items-baseline gap-5" }, [
              h("span", { key: "n", className: "w-8 text-sm font-semibold text-filamento" }, String(i + 1).padStart(2, "0")),
              h("span", { key: "t", className: "font-display text-4xl font-bold leading-[1.02] tracking-[-0.025em]" }, t(p.title)),
            ]),
            h("p", { key: "d", className: "mt-3 pl-14 text-[16px] leading-relaxed text-white/75" }, t(p.description)),
            p.image ? h("div", { key: "i", className: "ml-14 mt-4 aspect-[16/10] overflow-hidden rounded-2xl" }, Photo(props, p.image, p.title, "", true, ["Pilares", i, "Foto"])) : h("p", F(["Pilares", i, "Ilustración (mientras no haya foto)"], { key: "ph", className: "mt-3 pl-14 text-[12px] text-white/45" }), "Ilustración: " + t(p.illustration || p.id, "automática")),
            p.confirmed === false ? h("div", { key: "b", className: "mt-3 pl-14" }, Draft("Descripción propuesta", true)) : null,
          ]);
        })),
      ]),
    ]);
  });

  CMS.registerPreviewTemplate("levels", function (props) {
    var d = data(props);
    var themes = ["bg-rojo-700 text-white", "bg-marino text-white"];
    return Frame([
      Note("Niveles"),
      arr(d.items).map(function (l, i) {
        return h("section", { key: i, className: "mb-3 " + (themes[i % 2]) }, [
          h("div", { key: "p", className: "aspect-[16/8]" }, Photo(props, l.image, l.name, "", true, ["Niveles", i, "Foto del nivel"])),
          h("div", { key: "c", className: "p-6" }, [
            h("h2", { key: "n", className: "font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-[-0.04em]" }, t(l.name)),
            h("p", { key: "s", className: "mt-2 font-display text-2xl font-semibold" }, t(l.summary)),
            h("p", { key: "d", className: "mt-4 text-[16px] leading-relaxed opacity-90" }, t(l.description)),
            h("div", { key: "g", className: "mt-4 flex flex-wrap gap-2" }, arr(l.grades).length ? arr(l.grades).map(function (g, k) { return h("span", { key: k, className: "rounded-full border border-white/40 px-3 py-1 text-[13px]" }, g); }) : Draft("Grados por confirmar", true)),
          ]),
        ]);
      }),
    ]);
  });

  CMS.registerPreviewTemplate("activities", function (props) {
    var d = data(props);
    return Frame([
      Note("Actividades"),
      h("ul", { key: "u", className: "grid grid-cols-2 gap-3 bg-rojo-700 p-4" }, arr(d.items).map(function (a, i) {
        return h("li", { key: i, className: "relative overflow-hidden rounded-3xl text-white " + (i % 5 === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square") }, [
          h("div", { key: "p", className: "absolute inset-0" }, Photo(props, a.image, a.title, "", true, ["Actividades", i, "Foto"])),
          h("div", { key: "g", className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-noche/90 to-transparent p-4 pt-14" }, [
            h("h3", { key: "t", className: "font-display text-2xl font-bold leading-tight" }, t(a.title)),
            h("p", { key: "d", className: "mt-1 text-[13px] text-white/85" }, t(a.description, "")),
          ]),
        ]);
      })),
    ]);
  });

  CMS.registerPreviewTemplate("experience", function (props) {
    var d = data(props);
    return Frame([
      Note("Así se vive Nikola Tesla"),
      h("section", { key: "s", className: "bg-noche px-6 py-10 text-white" }, [
        h("ul", { key: "u", className: "grid gap-4" }, arr(d.shots).map(function (s, i) {
          return h("li", { key: i, className: "relative aspect-[16/9] overflow-hidden rounded-3xl" }, [
            h("div", { key: "p", className: "absolute inset-0" }, Photo(props, s.image, s.label, "", true, ["Momentos", i, "Foto"])),
            h("div", { key: "c", className: "absolute bottom-3 left-3 max-w-[16rem] rounded-2xl bg-white px-4 py-3 text-noche" }, [
              h("p", { key: "l", className: "text-[12px] font-semibold uppercase tracking-[0.06em] text-niebla" }, t(s.label)),
              h("p", { key: "t", className: "font-display text-lg font-bold leading-snug" }, t(s.caption)),
            ]),
          ]);
        })),
        h("p", { key: "w", className: "mt-8 font-display text-4xl font-extrabold uppercase tracking-[-0.03em] text-white/30" }, arr(d.words).join(" · ")),
      ]),
    ]);
  });

  /* ───────── Admisión y preguntas ───────── */
  CMS.registerPreviewTemplate("admission", function (props) {
    var d = data(props);
    return Frame([
      Note("Admisión"),
      h("section", { key: "s", className: "bg-filamento px-6 py-12 text-noche" }, [
        h("h2", { key: "h", className: "max-w-[13ch] text-balance font-display text-6xl font-extrabold leading-[0.88] tracking-[-0.045em]" }, t(d.headline)),
        h("p", { key: "i", className: "mt-6 max-w-md text-xl leading-relaxed text-noche/85" }, t(d.intro)),
        h("ol", { key: "o", className: "mt-10 grid border-t border-noche/25" }, arr(d.steps).map(function (s, i) {
          return h("li", { key: i, className: "border-b border-noche/25 py-5" }, [
            h("span", { key: "n", className: "font-display text-5xl font-extrabold leading-none text-noche/35" }, i + 1),
            h("h3", { key: "t", className: "mt-2 font-display text-xl font-bold" }, t(s.title)),
            h("p", { key: "d", className: "mt-1 text-[15px] text-noche/75" }, t(s.description)),
            s.confirmed === false ? h("div", { key: "b", className: "mt-2" }, Draft("Por confirmar")) : null,
          ]);
        })),
      ]),
      h("section", { key: "i", className: "bg-tiza px-6 py-10" }, [
        h("dl", { key: "dl", className: "border-t border-noche/15" }, arr(d.info).map(function (x, i) {
          return h("div", { key: i, className: "border-b border-noche/15 py-6" }, [
            h("dt", { key: "t", className: "font-display text-3xl font-extrabold tracking-[-0.025em] text-noche" }, t(x.title)),
            h("dd", { key: "d", className: "mt-2 text-[17px] leading-relaxed text-niebla" }, t(x.text)),
          ]);
        })),
      ]),
    ]);
  });

  CMS.registerPreviewTemplate("faq", function (props) {
    var d = data(props);
    return Frame([
      Note("Preguntas frecuentes"),
      h("section", { key: "s", className: "bg-white px-6 py-10" }, [
        Heading("Preguntas frecuentes.", "text-4xl text-noche"),
        h("ul", { key: "u", className: "mt-6 border-t border-noche/15" }, arr(d.items).map(function (q, i) {
          return h("li", { key: i, className: "border-b border-noche/15 py-5" }, [
            h("p", { key: "q", className: "font-display text-xl font-bold leading-snug text-noche" }, t(q.question)),
            h("p", { key: "a", className: "mt-2 text-[16px] leading-relaxed text-niebla" }, t(q.answer)),
            q.confirmed === false ? h("div", { key: "b", className: "mt-2" }, Draft("Respuesta por confirmar")) : null,
          ]);
        })),
      ]),
    ]);
  });

  /* ───────── Galería ───────── */
  CMS.registerPreviewTemplate("gallery", function (props) {
    var d = data(props);
    return Frame([
      Note("Galería"),
      h("ul", { key: "u", className: "grid grid-cols-2 gap-4 bg-noche-900 p-5 text-white" }, arr(d.items).map(function (e, i) {
        var photos = arr(e.media).filter(function (m) { return m.type !== "video"; }).length;
        var videos = arr(e.media).length - photos;
        return h("li", { key: i }, [
          h("div", { key: "p", className: "aspect-[4/3] overflow-hidden rounded-2xl" }, Photo(props, e.coverImage, e.title, "", true, ["Eventos", i, "Foto de portada"])),
          h("p", { key: "c", className: "mt-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-filamento" }, t(e.category) + " · " + long(e.date)),
          h("h3", { key: "t", className: "font-display text-xl font-bold" }, t(e.title)),
          h("p", { key: "n", className: "mt-1 text-[13px] text-white/60" }, photos + " fotos" + (videos ? " · " + videos + " videos" : "")),
          e.isPlaceholder ? h("div", { key: "b", className: "mt-2" }, Draft("Evento de ejemplo", true)) : null,
        ]);
      })),
    ]);
  });

  /* ───────── Noticias (una publicación) ───────── */
  CMS.registerPreviewTemplate("noticias", function (props) {
    var d = data(props);
    var body = String(d.body || "").split(/\n{2,}/).filter(Boolean);
    return Frame([
      Note("Noticia"),
      h("article", { key: "a", className: "bg-white px-6 py-10" }, [
        h("p", { key: "c", className: "text-[13px] font-semibold uppercase tracking-[0.08em] text-rojo" }, t(d.category, "") + (d.date ? " · " + long(d.date) : "")),
        h("h1", { key: "t", className: "mt-3 text-balance font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.035em] text-noche" }, t(d.title)),
        h("p", { key: "e", className: "mt-4 text-xl leading-relaxed text-niebla" }, t(d.excerpt, "")),
        d.image ? h("div", { key: "i", className: "mt-8 aspect-[16/9] overflow-hidden rounded-3xl" }, Photo(props, d.image, d.title, "", false, ["Foto (opcional)"])) : null,
        h("div", { key: "b", className: "mt-8 space-y-5 text-[18px] leading-relaxed text-tinta/90" }, body.map(function (p, i) { return h("p", { key: i }, p); })),
        d.isPlaceholder ? h("div", { key: "d", className: "mt-6" }, Draft("Noticia de ejemplo")) : null,
      ]),
    ]);
  });

  /* ───────── Calendario: un evento ───────── */
  var EVENT_COLOR = { "Reunión": "bg-marino text-white", "Académico": "bg-noche text-white", "Cultural": "bg-rojo-700 text-white", "Deportivo": "bg-rojo-700 text-white", "Admisión": "bg-filamento text-noche", "Feriado": "bg-arco-100 text-noche", "Otro": "bg-tiza-200 text-noche" };
  CMS.registerPreviewTemplate("calendario", function (props) {
    var d = data(props);
    var parts = String(d.date || "").slice(0, 10).split("-");
    var months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    var day = parts.length === 3 ? String(Number(parts[2])) : "—";
    var month = parts.length === 3 ? months[Number(parts[1]) - 1] : "";
    return Frame([
      Note("Evento del calendario"),
      h("div", { key: "w", className: "bg-noche px-6 py-10" }, [
        h("article", { key: "c", className: "flex gap-5 rounded-[28px] bg-white/[0.06] p-6 ring-1 ring-white/15" }, [
          h("div", { key: "d", className: "flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl " + (EVENT_COLOR[d.category] || EVENT_COLOR.Otro) }, [
            h("span", { key: "n", className: "font-display text-3xl font-extrabold leading-none" }, day),
            h("span", { key: "m", className: "mt-1 text-[12px] font-bold uppercase tracking-[0.08em]" }, month),
          ]),
          h("div", { key: "b", className: "min-w-0 flex-1 text-white" }, [
            h("p", { key: "k", className: "text-[13px] font-semibold text-white/70" }, t(d.category, "") + (d.date ? " · " + long(d.date) : "") + (d.endDate ? " al " + long(d.endDate) : "") + (d.time ? " · " + d.time : "")),
            h("h3", { key: "t", className: "mt-1.5 font-display text-2xl font-bold leading-tight" }, t(d.title)),
            d.place ? h("p", { key: "p", className: "mt-1 text-[15px] text-white/70" }, d.place) : null,
            d.description ? h("p", { key: "x", className: "mt-3 text-[15px] leading-relaxed text-white/80" }, d.description) : null,
            h("p", { key: "a", className: "mt-4 text-[14px] font-semibold text-filamento underline decoration-2 underline-offset-4" }, "Agregar a Google Calendar"),
            d.isPlaceholder ? h("div", { key: "e", className: "mt-3" }, Draft("Ejemplo", true)) : null,
          ]),
        ]),
      ]),
    ]);
  });

  /* ───────── Documentos ───────── */
  CMS.registerPreviewTemplate("documentos", function (props) {
    var d = data(props);
    var items = arr(d.items);
    return Frame([
      Note("Documentos para descargar"),
      h("div", { key: "w", className: "bg-white px-6 py-10" }, [
        h("h2", { key: "h", className: "font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.03em] text-noche" }, "Documentos para descargar."),
        items.length === 0 ? h("p", { key: "n", className: "mt-6 text-[15px] text-niebla" }, "Todavía no hay documentos. Pulsa “Añadir documentos”.") : null,
        h("ul", { key: "l", className: "mt-8 grid gap-4" }, items.map(function (item, i) {
          var ext = String(item.file || "").split("?")[0].split(".").pop();
          return h("li", { key: i, className: "flex gap-4 rounded-[28px] p-5 ring-1 ring-noche/10" }, [
            h("span", { key: "e", className: "flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-noche text-[11px] font-extrabold uppercase text-white" }, item.file ? ext.slice(0, 4) : "—"),
            h("span", { key: "t", className: "min-w-0" }, [
              h("span", { key: "c", className: "block text-[12px] font-semibold uppercase tracking-[0.08em] text-niebla" }, t(item.category, "General")),
              h("span", { key: "n", className: "mt-1 block font-display text-lg font-bold leading-snug text-noche" }, t(item.title)),
              item.description ? h("span", { key: "d", className: "mt-1.5 block text-[15px] text-niebla" }, item.description) : null,
              item.file ? null : h("span", { key: "f", className: "mt-2 block text-[12px] font-semibold text-rojo" }, "Falta subir el archivo"),
            ]),
          ]);
        })),
      ]),
    ]);
  });

  /* ───────── Páginas nuevas ───────── */
  CMS.registerPreviewTemplate("extra", function (props) {
    var d = data(props);
    var blocks = String(d.body || "").split(/\n{2,}/).filter(Boolean);
    return Frame([
      Note(d.published === false ? "Página en borrador (nadie la ve)" : "Página nueva"),
      h("header", { key: "h", className: "bg-noche px-6 pb-12 pt-14 text-white" }, [
        h("p", { key: "k", className: "text-sm font-semibold" }, t(d.kicker, "Página")),
        h("h1", { key: "t", className: "mt-5 text-balance font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.04em]" }, t(d.title)),
        d.intro ? h("p", { key: "i", className: "mt-5 text-lg leading-relaxed text-white/75" }, d.intro) : null,
      ]),
      h("article", { key: "a", className: "space-y-5 bg-white px-6 py-10 text-[17px] leading-[1.75] text-tinta" }, [
        d.image ? h("div", { key: "im", className: "mb-6 aspect-[16/9] overflow-hidden rounded-3xl" }, Photo(props, d.image, d.title, "", false, ["Foto (opcional)"])) : null,
      ].concat(blocks.map(function (block, i) {
        var lines = block.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
        if (lines.length === 1 && lines[0].indexOf("## ") === 0) return h("h2", { key: "b" + i, className: "mt-8 font-display text-2xl font-extrabold tracking-[-0.02em] text-noche" }, lines[0].slice(3));
        if (lines.every(function (l) { return l.indexOf("- ") === 0; })) return h("ul", { key: "b" + i, className: "list-disc space-y-2 pl-6" }, lines.map(function (l, j) { return h("li", { key: j }, l.slice(2)); }));
        return h("p", { key: "b" + i }, lines.join(" "));
      })).concat([
        d.buttonText ? h("p", { key: "bt", className: "pt-2" }, h("span", { className: "inline-flex min-h-[48px] items-center rounded-full bg-filamento px-6 text-[15px] font-semibold text-noche" }, d.buttonText)) : null,
        arr(d.documents).length ? h("p", { key: "dc", className: "pt-2 text-[14px] font-semibold text-noche" }, "Archivos: " + arr(d.documents).map(function (x) { return x.title; }).join(" · ")) : null,
      ])),
    ]);
  });

  /* ───────── Orden de la portada ───────── */
  var HOME_NAMES = { modulos: "Explora el colegio", eventos: "Próximos eventos", noticias: "Noticias", testimonios: "Testimonios", logros: "Logros", documentos: "Documentos", preguntas: "Preguntas frecuentes", admision: "Invitación a la admisión" };
  CMS.registerPreviewTemplate("portada", function (props) {
    var d = data(props);
    return Frame([
      Note("Orden de la portada"),
      h("div", { key: "w", className: "bg-tiza px-6 py-8" }, [
        h("div", { key: "hero", className: "mb-2 rounded-2xl bg-noche px-5 py-6 text-center text-[13px] font-semibold text-white" }, "Presentación del colegio (siempre arriba)"),
      ].concat(arr(d.sections).map(function (s, i) {
        var on = s.show !== false;
        return h("div", { key: "s" + i, className: "mb-2 flex items-center justify-between rounded-2xl px-5 py-4 text-[14px] font-semibold " + (on ? "bg-white text-noche ring-1 ring-noche/10" : "bg-tiza-200 text-niebla line-through") }, [
          h("span", { key: "n" }, (i + 1) + ". " + (HOME_NAMES[s.id] || t(s.id))),
          h("span", { key: "o", className: "text-[12px] no-underline " + (on ? "text-noche" : "text-niebla") }, on ? "Se muestra" : "Oculta"),
        ]);
      }))),
    ]);
  });

  /* ───────── Menú y pie de página ───────── */
  CMS.registerPreviewTemplate("navegacion", function (props) {
    var d = data(props);
    var hidden = arr(d.hiddenModules);
    var all = [["nosotros", "Nosotros"], ["propuesta", "Propuesta"], ["niveles", "Niveles"], ["actividades", "Actividades"], ["galeria", "Galería"], ["noticias", "Noticias"], ["admision", "Admisión"], ["contacto", "Contacto"]];
    var visible = all.filter(function (m) { return hidden.indexOf(m[0]) < 0; }).map(function (m) { return m[1]; });
    var items = ["Inicio"].concat(visible).concat(arr(d.extraLinks).map(function (l) { return l.label; }));
    var cta = d.cta || {};
    var footer = d.footer || {};
    return Frame([
      Note("Menú y pie de página"),
      h("div", { key: "nav", className: "flex flex-wrap items-center gap-x-4 gap-y-2 bg-noche px-6 py-5 text-[13px] font-medium text-white" }, items.map(function (x, i) { return h("span", { key: i, className: i === 0 ? "font-semibold" : "opacity-75" }, x); }).concat(cta.show === false ? [] : [h("span", { key: "cta", className: "ml-auto rounded-full bg-filamento px-4 py-2 font-semibold text-noche" }, t(cta.label, "Admisiones"))])),
      h("div", { key: "foot", className: "bg-noche px-6 pb-10 pt-8 text-white" }, [
        h("p", { key: "f", className: "font-display text-2xl font-extrabold" }, "Frase del pie de página"),
        footer.showExplore === false ? null : h("p", { key: "e", className: "mt-4 text-[13px] text-white/70" }, "Explorar: " + items.join(" · ")),
        arr(footer.links).length ? h("p", { key: "l", className: "mt-4 border-t border-white/15 pt-4 text-[13px] text-white/80" }, arr(footer.links).map(function (l) { return l.label; }).join(" · ")) : null,
        footer.legalText ? h("p", { key: "g", className: "mt-3 text-[12px] text-white/50" }, footer.legalText) : null,
        footer.showWatermark === false ? null : h("p", { key: "w", className: "mt-6 text-center font-display text-5xl font-extrabold uppercase text-white/[0.08]" }, "Nikola Tesla"),
      ]),
    ]);
  });

  /* ───────── Colores y efectos ───────── */
  var PALETTES = {
    tesla: ["#0D1230", "#FFB627", "#E03C26", "#1F3557", "#A9ADFF", "#EEF0F7"],
    oceano: ["#082B3A", "#FFC857", "#E5533D", "#14506B", "#8FD3E8", "#EEF6F8"],
    bosque: ["#11271C", "#F5B93B", "#D9472B", "#1F5138", "#A8D8A0", "#F1F5EE"],
    vino: ["#2A0F1E", "#FFB84D", "#E04A52", "#5B2347", "#E3A8D0", "#F7F0F2"],
    grafito: ["#15181F", "#FFB627", "#E03C26", "#2B3A55", "#B4BAC8", "#F2F3F5"],
  };
  CMS.registerPreviewTemplate("apariencia", function (props) {
    var d = data(props);
    var c = d.colors || {};
    var e = d.effects || {};
    var base = (PALETTES[c.preset] || PALETTES.tesla).slice();
    [c.noche, c.filamento, c.rojo, c.marino, c.arco].forEach(function (v, i) { if (v && /^#[0-9a-fA-F]{6}$/.test(v)) base[i] = v; });
    var names = ["Fondo oscuro", "Acento", "Rojo", "Azul marino", "Detalles fríos", "Fondo claro"];
    var EFFECTS = [["fieldAnimation", "Línea de energía"], ["lightning", "Rayos"], ["sparks", "Chispas"], ["scrollProgress", "Línea de progreso"], ["pageTransitions", "Cortina de color"], ["whatsappFloat", "Botón de WhatsApp"]];
    return Frame([
      Note("Colores y efectos (se aplican al publicar)"),
      h("div", { key: "hero", className: "px-6 py-10 text-white", style: { background: base[0] } }, [
        h("p", { key: "k", className: "text-sm font-semibold" }, "Institución Educativa Privada"),
        h("p", { key: "t", className: "mt-3 font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.03em]" }, "Nikola Tesla"),
        h("span", { key: "b", className: "mt-6 inline-flex min-h-[48px] items-center rounded-full px-6 text-[15px] font-semibold", style: { background: base[1], color: base[0] } }, "Admisión 2027"),
      ]),
      h("div", { key: "sw", className: "grid grid-cols-3 gap-3 bg-white px-6 py-6" }, base.map(function (hex, i) {
        return h("div", { key: i }, [h("div", { key: "c", className: "h-12 rounded-xl ring-1 ring-noche/15", style: { background: hex } }), h("p", { key: "n", className: "mt-1.5 text-[11px] font-semibold text-noche" }, names[i]), h("p", { key: "h", className: "text-[11px] text-niebla" }, hex.toUpperCase())]);
      })),
      h("ul", { key: "fx", className: "space-y-1.5 bg-tiza px-6 py-6 text-[13px] text-noche" }, EFFECTS.map(function (x) {
        var on = e[x[0]] !== false;
        return h("li", { key: x[0], className: "flex justify-between font-semibold" }, [h("span", { key: "n" }, x[1]), h("span", { key: "s", className: on ? "text-noche" : "text-niebla" }, on ? "Activado" : "Apagado")]);
      })),
    ]);
  });
})();
