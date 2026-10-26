import { NextResponse } from "next/server";
import { settings } from "@/data/settings";
import { todayISO } from "@/lib/utils";

/**
 * Enlace corto de los QR impresos: /qr/<lugar> → página de campaña con el origen (utm) para medir cada medio.
 * - Los QR impresos nunca cambian; el destino sí: si ya pasó la fecha de cierre de inscripciones
 *   (settings.admissionDeadline), llevan a la página de Admisión en lugar de la de campaña.
 * - Lleva el origen como utm_source (p. ej. "volante" o "volante-014" para códigos numerados).
 */
export function qrRedirect(request: Request, canal?: string) {
  const source = (canal ?? "qr").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "qr";
  const closed = !!settings.admissionDeadline && todayISO() > settings.admissionDeadline;
  const path = closed ? "/admision" : `/admision-${settings.admissionYear}`;
  const url = new URL(path, request.url);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "impreso");
  url.searchParams.set("utm_campaign", `admision-${settings.admissionYear}`);
  return NextResponse.redirect(url, 307);
}
