/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Carpeta de compilación alternativa (útil para probar un build sin pisar `npm run dev`).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Los enlaces cortos de los QR (/qr/volante) viven en app/qr: redirigen a la página de campaña con su origen (utm)
  // y, pasada la fecha de cierre de inscripciones, a la página de Admisión.
  images: {
    formats: ["image/avif", "image/webp"],
    // Cuando las fotos vivan en Supabase Storage (u otro CDN), autoriza el dominio aquí:
    // remotePatterns: [{ protocol: "https", hostname: "TU-PROYECTO.supabase.co" }],
    remotePatterns: [],
  },
};

export default nextConfig;
