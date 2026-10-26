import fs from "node:fs";
import path from "node:path";
import raw from "@/content/documentos.json";
import type { SchoolDocument } from "@/types";
import { isoDate, list, rec, str, text } from "@/lib/content";

/**
 * Documentos descargables (reglamento, lista de útiles, ficha de inscripción…).
 * Se suben desde el panel (/admin → Documentos) a public/documentos/. Solo se usa en el servidor.
 */
const publicDir = path.join(process.cwd(), "public");

/** Tamaño legible ("1,2 MB") del archivo si existe en public/. */
function sizeOf(url: string): { label: string | null; exists: boolean } {
  if (/^https?:\/\//i.test(url)) return { label: null, exists: true };
  try {
    const bytes = fs.statSync(path.join(publicDir, url.replace(/^\/+/, ""))).size;
    const label = bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return { label, exists: true };
  } catch {
    return { label: null, exists: false };
  }
}

/** Datos de un archivo a partir de su ruta: extensión, tamaño y si existe. */
export function describeFile(file: string): Pick<SchoolDocument, "extension" | "sizeLabel" | "fileExists"> {
  const size = file ? sizeOf(file) : { label: null, exists: false };
  return {
    extension: (file.split("?")[0].split(".").pop() ?? "").toLowerCase().slice(0, 5),
    sizeLabel: size.label,
    fileExists: size.exists,
  };
}

export const documents: SchoolDocument[] = list(rec(raw).items)
  .map((item, index) => {
    const file = str(item.file).trim();
    return {
      id: `documento-${index + 1}`,
      title: str(item.title),
      description: text(item.description),
      category: str(item.category, "General") || "General",
      file,
      date: isoDate(item.date) || null,
      featured: item.featured === true,
      ...describeFile(file),
    };
  })
  .filter((item) => item.title && item.file);
