"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * La "línea de energía": el gesto gráfico de la marca.
 * Una onda fina que se dibuja al entrar en pantalla. Usar con moderación.
 */
export default function WaveLine({ className, color = "#FFB627" }: { className?: string; color?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 600 40" fill="none" preserveAspectRatio="none" aria-hidden="true" className={cn("h-6 w-full", className)}>
      <motion.path
        d="M0 20 C 50 20, 60 4, 100 4 S 150 36, 200 36 S 250 4, 300 4 S 350 36, 400 36 S 450 12, 500 16 S 570 20, 600 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
