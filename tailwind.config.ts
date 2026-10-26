import type { Config } from "tailwindcss";

/**
 * Paleta "Nikola Tesla"
 * noche     → base oscura (índigo profundo, no negro neutro)
 * tiza      → base clara (blanco frío, como pizarra limpia)
 * filamento → acento cálido (la luz de una lámpara encendida). Usar con moderación.
 * arco      → acento frío para líneas y detalles (un arco eléctrico suave)
 * escudo    → rojo y azul del escudo oficial; dan personalidad a módulos concretos.
 * Los temas de cada módulo (color de cabecera, acento) viven en data/modules.ts.
 */
/**
 * Los colores salen de variables CSS (--c-noche, …) que escribe app/layout.tsx según la paleta elegida en el panel
 * (data/appearance.ts). El segundo valor es el respaldo: la paleta oficial, por si la variable no existe.
 */
const v = (name: string, fallback: string) => `rgb(var(--c-${name}, ${fallback}) / <alpha-value>)`;

const config: Config = {
  // data/ también se escanea porque los temas de los módulos declaran clases de Tailwind.
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.ts"],
  theme: {
    extend: {
      colors: {
        noche: { DEFAULT: v("noche", "13 18 48"), 900: v("noche-900", "7 10 28"), 800: v("noche-800", "20 26 66"), 700: v("noche-700", "29 37 88"), 600: v("noche-600", "42 51 115") },
        tiza: { DEFAULT: v("tiza", "238 240 247"), 200: v("tiza-200", "226 229 240"), 300: v("tiza-300", "211 215 230") },
        tinta: v("tinta", "27 32 64"),
        niebla: v("niebla", "100 107 140"),
        filamento: { DEFAULT: v("filamento", "255 182 39"), 600: v("filamento-600", "232 155 0") },
        arco: { DEFAULT: v("arco", "169 173 255"), 100: v("arco-100", "232 233 255") },
        // Rojo: DEFAULT para acentos; 700 para fondos con texto blanco (contraste AA).
        rojo: { DEFAULT: v("rojo", "224 60 38"), 700: v("rojo-700", "180 45 27") },
        marino: { DEFAULT: v("marino", "31 53 87"), 800: v("marino-800", "23 40 67") },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "1400px" },
      borderRadius: { panel: "28px" },
    },
  },
  plugins: [],
};

export default config;
