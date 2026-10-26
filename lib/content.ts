/**
 * Lectura segura del contenido editable (content/*.json).
 * El panel (/admin) guarda campos vacíos como "" o los omite; estas funciones los convierten a lo que
 * espera la interfaz (null = "pendiente") y garantizan valores de respaldo si falta algún campo,
 * para que un cambio mal hecho nunca rompa la web.
 */

export type Raw = Record<string, unknown>;

export const rec = (value: unknown): Raw => (value && typeof value === "object" && !Array.isArray(value) ? (value as Raw) : {});

export const list = (value: unknown): Raw[] => (Array.isArray(value) ? value.map(rec) : []);

/** Texto o null cuando está vacío. */
export const text = (value: unknown): string | null => (typeof value === "string" && value.trim() !== "" ? value : null);

/** Texto con valor de respaldo. */
export const str = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);

export const bool = (value: unknown, fallback = false): boolean => (typeof value === "boolean" ? value : fallback);

export const num = (value: unknown, fallback: number): number => (typeof value === "number" && Number.isFinite(value) ? value : fallback);

/** Lista de textos sin elementos vacíos. */
export const strings = (value: unknown): string[] =>
  (Array.isArray(value) ? value : []).filter((item): item is string => typeof item === "string" && item.trim() !== "");

/** Párrafos: acepta un texto con líneas en blanco entre párrafos o una lista de textos. */
export const paragraphs = (value: unknown): string[] =>
  typeof value === "string" ? value.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean) : strings(value);

/** Fecha AAAA-MM-DD aunque el panel guarde una fecha con hora. */
export const isoDate = (value: unknown, fallback = ""): string => (typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : fallback);

/**
 * Dirección web válida: añade https:// si falta, quita las barras finales y, si aun así no es una URL válida,
 * usa el valor de respaldo. Evita que un valor mal escrito en el panel (por ejemplo "miweb.pe") rompa la web.
 */
export function webUrl(value: unknown, fallback: string): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return fallback;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw.replace(/^\/+/, "")}`;
  try {
    return new URL(withProtocol).origin + (new URL(withProtocol).pathname === "/" ? "" : new URL(withProtocol).pathname.replace(/\/+$/, ""));
  } catch {
    return fallback;
  }
}

/** Valor de una lista cerrada (un "select" del panel); si no coincide, usa el respaldo. */
export const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T =>
  typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;

/** Color #RRGGBB válido (en mayúsculas) o null. */
export const hexColor = (value: unknown): string | null => (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value.trim()) ? value.trim().toUpperCase() : null);

/** Enlace interno (/pagina) o externo (https://…). Cualquier otra cosa se descarta para no generar enlaces rotos. */
export const link = (value: unknown): string | null => {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return null;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) return raw;
  if (raw.startsWith("/")) return raw;
  if (raw.startsWith("#")) return raw;
  return `https://${raw}`;
};
