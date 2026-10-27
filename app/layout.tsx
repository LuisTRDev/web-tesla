import type { Metadata, Viewport } from "next";
import { fontPairs } from "@/app/fonts";
import type { CSSProperties, ReactNode } from "react";
import Analytics from "@/components/layout/Analytics";
import ConsentGate from "@/components/layout/ConsentGate";
import CookieNotice from "@/components/layout/CookieNotice";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import ClickTracker from "@/components/layout/ClickTracker";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SparkTrail from "@/components/ui/SparkTrail";
import ElectricField from "@/components/ui/ElectricField";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import { appearance, cssVariables, palette } from "@/data/appearance";
import { banners, hasGlobalBanner } from "@/data/banner";
import { settings } from "@/data/settings";
import "./globals.css";

// Letras: por defecto Bricolage Grotesque (títulos) + Figtree (texto); se cambian desde el panel.
const [display, body] = fontPairs[appearance.typography.pair];
const CORNERS = { suaves: 28, rectas: 8, redondas: 44 } as const;

const title = `${settings.name} | ${settings.location.district}, ${settings.location.province}`;

export const metadata: Metadata = {
  metadataBase: new URL(settings.siteUrl),
  title: { default: title, template: `%s | ${settings.name}` },
  description: settings.description,
  applicationName: settings.name,
  ...(settings.images.favicon ? { icons: { icon: settings.images.favicon, apple: settings.images.favicon } } : {}),
  keywords: [
    "Institución Educativa Privada Nikola Tesla",
    "colegio en Nuevo Imperial",
    "colegio en Cañete",
    "colegio privado Nuevo Imperial",
    `admisión ${settings.admissionYear}`,
    "primaria",
    "secundaria",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    siteName: settings.name,
    title,
    description: settings.description,
    ...(settings.images.share ? { images: [settings.images.share] } : {}),
  },
  twitter: { card: "summary_large_image", title, description: settings.description, ...(settings.images.share ? { images: [settings.images.share] } : {}) },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: palette.noche,
  width: "device-width",
  initialScale: 1,
};

// Datos estructurados para buscadores (schema.org)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "School",
  "@id": `${settings.siteUrl}/#school`,
  name: settings.name,
  url: settings.siteUrl,
  logo: `${settings.siteUrl}/images/logo-escudo.png`,
  description: settings.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: settings.location.address,
    addressLocality: settings.location.district,
    addressRegion: settings.location.region,
    addressCountry: "PE",
  },
  ...(settings.contact.whatsapp[0] ? { telephone: `+${settings.contact.whatsapp[0]}` } : {}),
  image: `${settings.siteUrl}/opengraph-image`,
  areaServed: [settings.location.district, settings.location.province],
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.location.mapQuery)}`,
  sameAs: Object.values(settings.social).filter(Boolean),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-PE" className={`${display.variable} ${body.variable}`} data-corners={appearance.shape.corners} style={{ "--bar-h": hasGlobalBanner() ? "40px" : "0px", "--r-panel": `${CORNERS[appearance.shape.corners]}px`, fontSize: `${appearance.typography.scale}%` } as CSSProperties}>
      <head>
        {/* Paleta elegida en el panel (Personalizar la web → Colores y efectos). */}
        <style dangerouslySetInnerHTML={{ __html: cssVariables() }} />
      </head>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-filamento focus:px-5 focus:py-3 focus:font-semibold focus:text-noche"
        >
          Saltar al contenido
        </a>
        {appearance.effects.scrollProgress && <ScrollProgress />}
        {banners.length > 0 && <AnnouncementBar items={banners} initialVisible={hasGlobalBanner()} />}
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ConsentGate>
          <Analytics />
        </ConsentGate>
        <CookieNotice />
        <ClickTracker />
        {appearance.effects.sparks && <SparkTrail />}
        {appearance.effects.electric !== "apagado" && <ElectricField level={appearance.effects.electric} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
