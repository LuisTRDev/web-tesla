import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import Analytics from "@/components/layout/Analytics";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import ClickTracker from "@/components/layout/ClickTracker";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SparkTrail from "@/components/ui/SparkTrail";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import { banner, isBannerActive } from "@/data/banner";
import { settings } from "@/data/settings";
import { todayISO } from "@/lib/utils";
import "./globals.css";

// Títulos: Bricolage Grotesque (con carácter, cálida). Texto: Figtree (clara y amable).
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const title = `${settings.name} | ${settings.location.district}, ${settings.location.province}`;

export const metadata: Metadata = {
  metadataBase: new URL(settings.siteUrl),
  title: { default: title, template: `%s | ${settings.name}` },
  description: settings.description,
  applicationName: settings.name,
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
  themeColor: "#0D1230",
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
    <html lang="es-PE" className={`${display.variable} ${body.variable}`} style={{ "--bar-h": isBannerActive() ? "40px" : "0px" } as CSSProperties}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-filamento focus:px-5 focus:py-3 focus:font-semibold focus:text-noche"
        >
          Saltar al contenido
        </a>
        <ScrollProgress />
        {banner.enabled && banner.text && !(banner.endDate && todayISO() > banner.endDate) && (
          <AnnouncementBar text={banner.text} linkText={banner.linkText} linkUrl={banner.linkUrl} startDate={banner.startDate} endDate={banner.endDate} initialVisible={isBannerActive()} />
        )}
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <Analytics />
        <ClickTracker />
        <SparkTrail />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
