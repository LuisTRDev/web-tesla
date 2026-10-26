import type { Config } from "tailwindcss";
import base from "./tailwind.config";

/**
 * Tailwind solo para las vistas previas del panel (/admin). Reutiliza la paleta de la web y escanea
 * únicamente public/admin/previews.js. Genera public/admin/preview.css con `npm run build:admin-css`.
 */
const config: Config = {
  ...base,
  content: ["./public/admin/previews.js"],
};

export default config;
