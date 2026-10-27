"use client";

import { useEffect, useRef } from "react";

type Level = "suave" | "normal" | "intenso";
const LEVELS: Record<Level, { density: number; link: number; glow: number }> = {
  suave: { density: 16000, link: 110, glow: 0.5 },
  normal: { density: 11000, link: 135, glow: 0.8 },
  intenso: { density: 7500, link: 160, glow: 1 },
};

/**
 * Fondo y cursor "eléctricos": partículas que flotan, se unen con líneas cuando están cerca y reaccionan al mouse o al dedo
 * (se acercan y dejan una estela amarilla). Un único canvas fijo que no intercepta clics.
 * Se apaga solo con prefers-reduced-motion y se pausa con la pestaña oculta.
 */
export default function ElectricField({ level = "suave" }: { level?: Level }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cfg = LEVELS[level];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    type T = { x: number; y: number; life: number };
    let W = 0;
    let H = 0;
    let parts: P[] = [];
    const trail: T[] = [];
    const pointer = { x: -999, y: -999, on: false };
    let raf = 0;
    let running = true;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.round((W * H) / cfg.density));
      parts = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: 1 + Math.random() * 1.6 }));
    };

    const move = (x: number, y: number) => {
      pointer.x = x;
      pointer.y = y;
      pointer.on = true;
      trail.push({ x, y, life: 1 });
      if (trail.length > 28) trail.shift();
    };
    const onMove = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onLeave = () => {
      pointer.on = false;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") onLeave();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        if (pointer.on) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 190 && d > 1) {
            p.x += (dx / d) * 0.9;
            p.y += (dy / d) * 0.9;
          }
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const d = Math.hypot(parts[i].x - parts[j].x, parts[i].y - parts[j].y);
          if (d < cfg.link) {
            ctx.strokeStyle = `rgba(169,173,255,${(1 - d / cfg.link) * 0.28 * cfg.glow})`;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(parts[j].x, parts[j].y);
            ctx.stroke();
          }
        }
        if (pointer.on) {
          const d = Math.hypot(parts[i].x - pointer.x, parts[i].y - pointer.y);
          if (d < 190) {
            ctx.strokeStyle = `rgba(255,182,39,${(1 - d / 190) * 0.7 * cfg.glow})`;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = `rgba(200,205,255,${0.55 * cfg.glow + 0.2})`;
      for (const p of parts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      // estela del cursor
      ctx.lineCap = "round";
      for (let i = trail.length - 1; i > 0; i--) {
        const t = trail[i];
        t.life -= 0.045;
        if (t.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        const prev = trail[i - 1];
        ctx.strokeStyle = `rgba(255,182,39,${t.life * 0.8})`;
        ctx.lineWidth = 1 + t.life * 3;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      }
      if (pointer.on) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 36);
        g.addColorStop(0, `rgba(255,182,39,${0.45 * cfg.glow})`);
        g.addColorStop(1, "rgba(255,182,39,0)");
        ctx.fillStyle = g;
        ctx.fillRect(pointer.x - 36, pointer.y - 36, 72, 72);
      }
      if (running) raf = requestAnimationFrame(draw);
    };

    const onVisible = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisible);
    raf = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [level]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[5] h-full w-full" />;
}
