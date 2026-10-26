"use client";

import { useEffect, useRef } from "react";

/**
 * Chispas de energía al pasar el cursor sobre botones y tarjetas marcados con `data-spark`.
 * - Un único canvas fijo que no intercepta clics; solo anima mientras haya chispas vivas.
 * - Se desactiva en pantallas táctiles y con prefers-reduced-motion.
 */
export default function SparkTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const enabled = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled) return;

    type Spark = { x: number; y: number; vx: number; vy: number; life: number; size: number };
    const sparks: Spark[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let last = 0;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= 0.032;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.07;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 2.5, s.y - s.vy * 2.5);
        ctx.strokeStyle = `rgba(255, 190, 60, ${s.life})`;
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(255, 182, 39, 0.9)";
        ctx.shadowBlur = 8;
        ctx.stroke();
      }
      frame = sparks.length > 0 ? requestAnimationFrame(draw) : 0;
      if (sparks.length === 0) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.("[data-spark]")) return;
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2.2;
        sparks.push({ x: event.clientX, y: event.clientY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.8, life: 1, size: 1 + Math.random() * 1.4 });
      }
      if (sparks.length > 90) sparks.splice(0, sparks.length - 90);
      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] h-full w-full" />;
}
