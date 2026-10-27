import raw from "@/content/apariencia.json";
import { bool, hexColor, oneOf, rec } from "@/lib/content";

/**
 * APARIENCIA: paleta de colores y efectos. Se edita desde el panel (/admin → Personalizar la web → Colores y efectos).
 * Tailwind lee los colores de variables CSS (ver tailwind.config.ts); `cssVariables()` las escribe en <html>
 * al construir la web. Si algo falta o es inválido, se usa la paleta oficial "Nikola Tesla".
 */

export const PRESETS = ["tesla", "oceano", "bosque", "vino", "grafito"] as const;
export type PresetId = (typeof PRESETS)[number];

type Tokens = Record<
  "noche" | "noche900" | "noche800" | "noche700" | "noche600" | "tiza" | "tiza200" | "tiza300" | "tinta" | "niebla" | "filamento" | "filamento600" | "arco" | "arco100" | "rojo" | "rojo700" | "marino" | "marino800",
  string
>;

const presets: Record<PresetId, Tokens> = {
  tesla: {
    noche: "#0D1230", noche900: "#070A1C", noche800: "#141A42", noche700: "#1D2558", noche600: "#2A3373",
    tiza: "#EEF0F7", tiza200: "#E2E5F0", tiza300: "#D3D7E6", tinta: "#1B2040", niebla: "#646B8C",
    filamento: "#FFB627", filamento600: "#E89B00", arco: "#A9ADFF", arco100: "#E8E9FF",
    rojo: "#E03C26", rojo700: "#B42D1B", marino: "#1F3557", marino800: "#172843",
  },
  oceano: {
    noche: "#082B3A", noche900: "#04171F", noche800: "#0C3B50", noche700: "#124D68", noche600: "#1B6385",
    tiza: "#EEF6F8", tiza200: "#DEEDF1", tiza300: "#C9E0E7", tinta: "#12303D", niebla: "#5A7482",
    filamento: "#FFC857", filamento600: "#E8AE2E", arco: "#8FD3E8", arco100: "#E1F4FA",
    rojo: "#E5533D", rojo700: "#B93A27", marino: "#14506B", marino800: "#0E3C52",
  },
  bosque: {
    noche: "#11271C", noche900: "#08140E", noche800: "#1A3A2A", noche700: "#244F39", noche600: "#306749",
    tiza: "#F1F5EE", tiza200: "#E3EBDE", tiza300: "#D0DCC8", tinta: "#1D2F24", niebla: "#5F7367",
    filamento: "#F5B93B", filamento600: "#DC9E1C", arco: "#A8D8A0", arco100: "#E6F4E3",
    rojo: "#D9472B", rojo700: "#AE3219", marino: "#1F5138", marino800: "#163C29",
  },
  vino: {
    noche: "#2A0F1E", noche900: "#16060F", noche800: "#3B1730", noche700: "#4F2040", noche600: "#682C55",
    tiza: "#F7F0F2", tiza200: "#EDE0E5", tiza300: "#DFCCD4", tinta: "#34202B", niebla: "#7A6470",
    filamento: "#FFB84D", filamento600: "#E89B22", arco: "#E3A8D0", arco100: "#F8E6F1",
    rojo: "#E04A52", rojo700: "#B3303A", marino: "#5B2347", marino800: "#431A35",
  },
  grafito: {
    noche: "#15181F", noche900: "#0A0C10", noche800: "#1F242E", noche700: "#2C333F", noche600: "#3B4452",
    tiza: "#F2F3F5", tiza200: "#E4E6EA", tiza300: "#D3D6DC", tinta: "#20242C", niebla: "#6A7080",
    filamento: "#FFB627", filamento600: "#E89B00", arco: "#B4BAC8", arco100: "#ECEEF3",
    rojo: "#E03C26", rojo700: "#B42D1B", marino: "#2B3A55", marino800: "#202C42",
  },
};

export const presetLabels: Record<PresetId, string> = {
  tesla: "Tesla (azul noche y amarillo)",
  oceano: "Océano (azul petróleo)",
  bosque: "Bosque (verde profundo)",
  vino: "Vino (granate)",
  grafito: "Grafito (sobrio)",
};

/* ───────── utilidades de color ───────── */
type RGB = [number, number, number];
const toRgb = (hex: string): RGB => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
const toHex = ([r, g, b]: RGB) => `#${[r, g, b].map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")).join("")}`.toUpperCase();

function toHsl([r, g, b]: RGB): [number, number, number] {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === rn ? (gn - bn) / d + (gn < bn ? 6 : 0) : max === gn ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
  return [h / 6, s, l];
}

function fromHsl([h, s, l]: [number, number, number]): RGB {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    const x = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return [channel(h + 1 / 3) * 255, channel(h) * 255, channel(h - 1 / 3) * 255];
}

/** Mismo tono y saturación, con la luminosidad cambiada (delta) o multiplicada (factor). */
const lightness = (hex: string, change: { delta?: number; factor?: number }) => {
  const [h, s, l] = toHsl(toRgb(hex));
  const next = change.factor !== undefined ? l * change.factor : l + (change.delta ?? 0);
  return toHex(fromHsl([h, s, Math.max(0, Math.min(1, next))]));
};

const mixWithWhite = (hex: string, amount: number) => toHex(toRgb(hex).map((c) => c + (255 - c) * amount) as RGB);

/* ───────── lectura del panel ───────── */
const r = rec(raw);
const colors = rec(r.colors);
const effects = rec(r.effects);
const typography = rec(r.typography);
const shape = rec(r.shape);

export const preset = oneOf(colors.preset, PRESETS, "tesla");

function buildPalette(): Tokens {
  const p = { ...presets[preset] };
  const noche = hexColor(colors.noche);
  if (noche) Object.assign(p, { noche, noche900: lightness(noche, { factor: 0.55 }), noche800: lightness(noche, { delta: 0.045 }), noche700: lightness(noche, { delta: 0.09 }), noche600: lightness(noche, { delta: 0.15 }) });
  const filamento = hexColor(colors.filamento);
  if (filamento) Object.assign(p, { filamento, filamento600: lightness(filamento, { factor: 0.88 }) });
  const rojo = hexColor(colors.rojo);
  if (rojo) Object.assign(p, { rojo, rojo700: lightness(rojo, { factor: 0.78 }) });
  const marino = hexColor(colors.marino);
  if (marino) Object.assign(p, { marino, marino800: lightness(marino, { factor: 0.78 }) });
  const arco = hexColor(colors.arco);
  if (arco) Object.assign(p, { arco, arco100: mixWithWhite(arco, 0.82) });
  return p;
}

/** Colores en hexadecimal, para el código que los necesita fuera de Tailwind (SVG, canvas, estilos en línea). */
export const palette = buildPalette();

/** Variables CSS (`--c-noche: 13 18 48`) que usa tailwind.config.ts. */
export function cssVariables(): string {
  const names: Record<keyof Tokens, string> = {
    noche: "noche", noche900: "noche-900", noche800: "noche-800", noche700: "noche-700", noche600: "noche-600",
    tiza: "tiza", tiza200: "tiza-200", tiza300: "tiza-300", tinta: "tinta", niebla: "niebla",
    filamento: "filamento", filamento600: "filamento-600", arco: "arco", arco100: "arco-100",
    rojo: "rojo", rojo700: "rojo-700", marino: "marino", marino800: "marino-800",
  };
  const body = (Object.keys(names) as Array<keyof Tokens>).map((key) => `--c-${names[key]}:${toRgb(palette[key]).join(" ")}`).join(";");
  return `:root{${body}}`;
}

export const isDefaultPalette = JSON.stringify(palette) === JSON.stringify(presets.tesla);

export const appearance = {
  preset,
  /** Par de letras (títulos + texto) y tamaño base en % (100 = normal). */
  typography: {
    pair: oneOf(typography.pair, ["tesla", "clasica", "moderna", "redondeada"] as const, "tesla"),
    scale: ({ "100": 100, "106": 106, "112": 112 } as Record<string, number>)[String(typography.scale ?? "100")] ?? 100,
  },
  /** Esquinas de tarjetas y botones. */
  shape: { corners: oneOf(shape.corners, ["suaves", "rectas", "redondas"] as const, "suaves") },
  effects: {
    /** Chispas al pasar el cursor sobre botones y tarjetas. */
    sparks: bool(effects.sparks, true),
    /** Líneas de energía y rayos en la portada. */
    fieldAnimation: bool(effects.fieldAnimation, true),
    /** Rayos breves dentro de la animación de la portada. */
    lightning: bool(effects.lightning, true),
    /** Línea de progreso bajo el menú. */
    scrollProgress: bool(effects.scrollProgress, true),
    /** Cortina de color al cambiar de sección. */
    pageTransitions: bool(effects.pageTransitions, true),
    /** Fondo y cursor eléctricos (partículas que reaccionan al mouse o al dedo). */
    electric: oneOf(effects.electric, ["apagado", "suave", "normal", "intenso"] as const, "suave"),
    /** Velocidad con que aparecen los bloques al hacer scroll. */
    revealSpeed: oneOf(effects.revealSpeed, ["rapida", "normal", "lenta", "apagada"] as const, "normal"),
    /** Botón flotante de WhatsApp. */
    whatsappFloat: bool(effects.whatsappFloat, true),
  },
};
