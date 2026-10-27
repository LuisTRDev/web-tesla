"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { appearance } from "@/data/appearance";

const SPEED = { rapida: 0.45, normal: 0.85, lenta: 1.35 } as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Retraso en segundos, para escalonar elementos vecinos. */
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
}

/**
 * Aparición al hacer scroll: sube, enfoca y aparece una sola vez.
 * Con prefers-reduced-motion el contenido se muestra sin animación.
 */
export default function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  const reduce = useReducedMotion();
  const speed = appearance.effects.revealSpeed;
  if (reduce || speed === "apagada") return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: SPEED[speed], delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
