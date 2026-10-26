// Avisa (sin detener el build) de las imágenes y videos demasiado pesados en public/.
// Las fotos que sube la clienta desde el panel pueden pesar varios MB y vuelven lenta la web.
import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const LIMITS = { ".jpg": 2, ".jpeg": 2, ".png": 2, ".webp": 2, ".avif": 2, ".mp4": 8, ".webm": 8 }; // MB
const heavy = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stats = statSync(path);
    if (stats.isDirectory()) walk(path);
    else {
      const limit = LIMITS[extname(name).toLowerCase()];
      if (limit && stats.size > limit * 1024 * 1024) heavy.push(`${path.replace(/\\/g, "/")} (${(stats.size / 1024 / 1024).toFixed(1)} MB, máx. recomendado ${limit} MB)`);
    }
  }
}

try {
  walk("public");
} catch {
  /* sin carpeta public */
}
if (heavy.length > 0) {
  console.warn("\n⚠ Archivos pesados en public/ (conviene comprimirlos):\n  - " + heavy.join("\n  - ") + "\n");
}
