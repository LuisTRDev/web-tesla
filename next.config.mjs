/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Cuando las fotos vivan en Supabase Storage (u otro CDN), autoriza el dominio aquí:
    // remotePatterns: [{ protocol: "https", hostname: "TU-PROYECTO.supabase.co" }],
    remotePatterns: [],
  },
};

export default nextConfig;
