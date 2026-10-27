import fs from "node:fs";

/**
 * Redirecciones y enlaces cortos que edita el colegio en el panel (Personalizar la web → Redirecciones y enlaces cortos).
 * Se descartan las que podrían romper la web: rutas internas del sistema, caracteres especiales o que se apunten a sí mismas.
 */
function loadRedirects() {
  try {
    const raw = JSON.parse(fs.readFileSync(new URL("./content/redirects.json", import.meta.url), "utf8"));
    const list = Array.isArray(raw && raw.items) ? raw.items : [];
    const seen = new Set();
    return list
      .map((item) => ({ from: String(item.from || "").trim(), to: String(item.to || "").trim(), permanent: item.permanent === true }))
      .filter((r) => /^\/[A-Za-z0-9/_-]*[A-Za-z0-9_-]$/.test(r.from) && !/^\/(admin|api|_next|qr|escanear)(\/|$)/.test(r.from))
      .filter((r) => (/^\/[^\s]*$/.test(r.to) || /^https:\/\/[^\s]+$/.test(r.to)) && r.to !== r.from)
      .filter((r) => (seen.has(r.from) ? false : seen.add(r.from)))
      .map((r) => ({ source: r.from, destination: r.to, permanent: r.permanent }));
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Carpeta de compilación alternativa (útil para probar un build sin pisar `npm run dev`).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Los enlaces cortos de los QR (/qr/volante) viven en app/qr: redirigen a la página de campaña con su origen (utm)
  // y, pasada la fecha de cierre de inscripciones, a la página de Admisión.
  async redirects() {
    return loadRedirects();
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Cuando las fotos vivan en Supabase Storage (u otro CDN), autoriza el dominio aquí:
    // remotePatterns: [{ protocol: "https", hostname: "TU-PROYECTO.supabase.co" }],
    remotePatterns: [],
  },
};

export default nextConfig;
