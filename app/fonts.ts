import { Bricolage_Grotesque, Figtree, Inter, Nunito, Playfair_Display, Source_Sans_3, Space_Grotesk } from "next/font/google";

/**
 * Pares de letras que se pueden elegir en el panel (Personalizar la web → Colores y efectos → Letras).
 * Cada par usa las mismas variables (--font-display para títulos y --font-body para textos), así que basta con aplicar
 * las clases del par elegido. Las que no se eligen no se precargan: el navegador solo descarga las que se usan.
 * (Next exige que cada fuente sea una constante con valores escritos tal cual, por eso no hay atajos.)
 */
const teslaDisplay = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-display" });
const teslaBody = Figtree({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const clasicaDisplay = Playfair_Display({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-display" });
const clasicaBody = Source_Sans_3({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-body" });
const modernaDisplay = Space_Grotesk({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-display" });
const modernaBody = Inter({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-body" });
const redondeadaDisplay = Nunito({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-display" });
const redondeadaBody = Nunito({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-body" });

export const fontPairs = {
  tesla: [teslaDisplay, teslaBody],
  clasica: [clasicaDisplay, clasicaBody],
  moderna: [modernaDisplay, modernaBody],
  redondeada: [redondeadaDisplay, redondeadaBody],
} as const;
