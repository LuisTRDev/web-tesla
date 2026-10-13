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
const config: Config = {
  // data/ también se escanea porque los temas de los módulos declaran clases de Tailwind.
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.ts"],
  theme: {
    extend: {
      colors: {
        noche: { DEFAULT: "#0D1230", 900: "#070A1C", 800: "#141A42", 700: "#1D2558", 600: "#2A3373" },
        tiza: { DEFAULT: "#EEF0F7", 200: "#E2E5F0", 300: "#D3D7E6" },
        tinta: "#1B2040",
        niebla: "#646B8C",
        filamento: { DEFAULT: "#FFB627", 600: "#E89B00" },
        arco: { DEFAULT: "#A9ADFF", 100: "#E8E9FF" },
        // Rojo: DEFAULT para acentos; 700 para fondos con texto blanco (contraste AA).
        rojo: { DEFAULT: "#E03C26", 700: "#B42D1B" },
        marino: { DEFAULT: "#1F3557", 800: "#172843" },
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
