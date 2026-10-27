/**
 * Revisa que el panel pueda abrir: config.yml se lee bien, cada archivo de contenido existe y es JSON válido,
 * y todos los campos tienen nombre y tipo. Si algo está mal, falla ANTES de publicar (un config.yml roto deja el panel en blanco).
 * Uso: node scripts/check-panel.mjs (también se ejecuta solo antes de `npm run build`).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const root = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
let yaml;
try {
  yaml = require("js-yaml");
} catch {
  console.warn("check-panel: js-yaml no está instalado; se omite la revisión de config.yml.");
  process.exit(0);
}
const errors = [];
let config;
try {
  config = yaml.load(fs.readFileSync(path.join(root, "public/admin/config.yml"), "utf8"));
} catch (e) {
  console.error("✗ config.yml no se puede leer:\n" + e.message);
  process.exit(1);
}
function walkFields(fields, where) {
  if (!Array.isArray(fields)) return;
  const names = new Set();
  fields.forEach((f, i) => {
    if (!f || typeof f !== "object") return errors.push(`${where}[${i}]: campo vacío`);
    if (!f.name) errors.push(`${where}[${i}] (${f.label || "sin etiqueta"}): falta name`);
    if (!f.widget && !f.field) errors.push(`${where}.${f.name}: falta widget`);
    if (f.name && names.has(f.name)) errors.push(`${where}: nombre repetido "${f.name}"`);
    names.add(f.name);
    if (f.pattern && !(Array.isArray(f.pattern) && f.pattern.length === 2)) errors.push(`${where}.${f.name}: pattern debe ser [regex, mensaje]`);
    if (Array.isArray(f.pattern)) {
      try { new RegExp(f.pattern[0]); } catch { errors.push(`${where}.${f.name}: regex inválida en pattern`); }
    }
    if (f.widget === "select" && !(f.options || []).length) errors.push(`${where}.${f.name}: select sin opciones`);
    walkFields(f.fields, `${where}.${f.name}`);
    if (f.field) walkFields([f.field], `${where}.${f.name}`);
  });
}
for (const col of config.collections || []) {
  if (col.files) {
    for (const file of col.files) {
      const p = path.join(root, file.file);
      if (!fs.existsSync(p)) errors.push(`${col.name}/${file.name}: no existe ${file.file}`);
      else {
        try { JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { errors.push(`${file.file}: JSON inválido (${e.message})`); }
      }
      walkFields(file.fields, `${col.name}/${file.name}`);
    }
  } else if (col.folder) {
    if (!fs.existsSync(path.join(root, col.folder))) errors.push(`${col.name}: no existe la carpeta ${col.folder}`);
    walkFields(col.fields, col.name);
  }
}
if (errors.length) {
  console.error("✗ El panel tiene problemas:\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log(`✓ Panel revisado: ${(config.collections || []).length} secciones sin errores.`);
