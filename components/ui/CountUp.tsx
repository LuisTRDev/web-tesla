"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Cifra que cuenta hacia arriba al entrar en pantalla, con un leve resplandor mientras cambia.
 * Acepta textos como "15", "+500" o "1,200": anima el número y conserva el prefijo y el sufijo.
 * Con prefers-reduced-motion muestra el valor final directamente.
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const [shown, setShown] = useState<number | null>(null);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    if (!inView || reduce || Number.isNaN(target)) return;
    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    setCounting(true);
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      setShown(Math.round(target * (1 - Math.pow(1 - progress, 4))));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setCounting(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, target]);

  if (!match || Number.isNaN(target)) return <span className={className}>{value}</span>;

  const current = shown ?? (reduce || inView ? target : 0);
  return (
    <span
      ref={ref}
      className={className}
      style={{ textShadow: counting ? "0 0 26px rgba(255,182,39,0.7)" : "0 0 0 rgba(255,182,39,0)", transition: "text-shadow 0.8s" }}
    >
      {match[1]}
      {current.toLocaleString("en-US")}
      {match[3]}
    </span>
  );
}
