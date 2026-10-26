import { ImageResponse } from "next/og";
import { settings } from "@/data/settings";

export const runtime = "edge";
export const alt = `Admisión ${settings.admissionYear} | ${settings.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen para compartir la página de campaña de admisión (Open Graph). */
export default async function AdmissionOpengraphImage() {
  const escudo = await fetch(new URL("../../public/images/logo-escudo.png", import.meta.url)).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0D1230",
          color: "#FFFFFF",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={escudo as unknown as string}
          width={340}
          height={409}
          style={{ position: "absolute", right: 72, top: 110 }}
        />
        <div style={{ display: "flex", fontSize: 30, opacity: 0.8 }}>{settings.kicker}</div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 108, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 }}>
            <span>ADMISIÓN</span>
            <span>{String(settings.admissionYear)}</span>
          </div>
          <div style={{ display: "flex", width: 220, height: 6, background: "#FFB627", marginTop: 28, borderRadius: 3 }} />
          <div style={{ display: "flex", fontSize: 34, marginTop: 28, opacity: 0.9 }}>{`${settings.shortName} · ${settings.tagline}`}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.7 }}>
          {`${settings.location.district}, ${settings.location.province}, ${settings.location.region}`}
        </div>
      </div>
    ),
    size,
  );
}
