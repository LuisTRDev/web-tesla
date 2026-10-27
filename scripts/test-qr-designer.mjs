/**
 * Prueba rápida del diseñador de QR (sin navegador): carga public/admin/qr-designer.js con un DOM de mentira
 * y revisa que todas las plantillas y formas de punto generen un QR, un SVG válido y un análisis sin errores.
 * Uso: node scripts/test-qr-designer.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..", "public", "admin");
const stub = () => new Proxy(function () {}, {
  get: (_t, k) => (k === Symbol.toPrimitive ? () => "" : k === "style" || k === "dataset" || k === "classList" ? stub() : k === "children" ? [] : stub()),
  set: () => true,
  apply: () => stub(),
  construct: () => stub(),
});
const window = { addEventListener() {}, location: { origin: "http://localhost" }, matchMedia: () => ({ matches: false }) };
const ctx = vm.createContext({
  window, document: stub(), console, setTimeout, clearTimeout, URL, Map, Path2D: class {}, Image: class {},
  HTMLCanvasElement: { prototype: {} }, fetch: () => new Promise(() => {}),
  localStorage: { getItem: () => null, setItem() {} }, navigator: {}, alert() {},
});
ctx.window = Object.assign(window, ctx);
vm.runInContext(fs.readFileSync(path.join(root, "vendor", "qrcode.js"), "utf8"), ctx);
vm.runInContext(fs.readFileSync(path.join(root, "qr-designer.js"), "utf8"), ctx);
const D = ctx.window.QRDesigner;
let failed = 0;
const check = (name, ok, extra = "") => { if (!ok) { failed++; console.error("✗", name, extra); } else console.log("✓", name); };

D.state.base = "https://colegio.example.org";
for (const name of Object.keys(D.PRESETS)) {
  D.applyPreset(name);
  let svg = "", items = [];
  try { svg = D.buildSVG(D.state, ""); items = D.analyze(D.state); } catch (e) { check("plantilla " + name, false, e.message); continue; }
  check("plantilla " + name, svg.startsWith("<svg") && items.length > 0 && !items.some((i) => i.level === "bad"), JSON.stringify(items.filter((i) => i.level === "bad")));
}
for (const shape of ["rounded", "square", "circle", "liquid", "diamond", "star", "hex", "cross", "heart", "bolt"]) {
  D.state.dotShape = shape;
  const svg = D.buildSVG(D.state, "");
  check("forma de punto " + shape, /<path/.test(svg) && !/NaN/.test(svg));
}
D.state.mono = false; D.state.gradient = "diagonal"; D.state.dotColor3 = "turquesa";
check("degradado de 3 colores en SVG", (D.buildSVG(D.state, "").match(/<stop /g) || []).length === 3);
process.exit(failed ? 1 : 0);
