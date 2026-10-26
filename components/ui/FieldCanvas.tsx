"use client";

import { useEffect, useRef } from "react";

/**
 * Capa gráfica del hero: líneas de campo que ondulan despacio y se curvan
 * levemente hacia el cursor, unas pocas partículas flotando y, cada pocos segundos, un rayo breve.
 * - Una sola línea lleva el color de acento: es la "línea de energía" de la marca.
 * - Se pausa fuera de pantalla y con la pestaña oculta.
 * - Con prefers-reduced-motion dibuja un único cuadro estático.
 */
export default function FieldCanvas({ className, lightning = true }: { className?: string; lightning?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINES = 11;
    const ACCENT = Math.floor(LINES / 2);
    let width = 0;
    let height = 0;
    let frame = 0;
    let time = 0;
    let visible = true;
    type Bolt = { points: Array<[number, number]>; life: number };
    const bolts: Bolt[] = [];
    let nextBolt = 2.5;
    const pointer = { x: 0.62, y: 0.5, tx: 0.62, ty: 0.5 };
    const particles = Array.from({ length: 26 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      speed: 0.00025 + Math.random() * 0.0006,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw();
    };

    /** Rayo quebrado que baja desde arriba y se ramifica una vez, como un arco de bobina Tesla. */
    const spawnBolt = () => {
      const points: Array<[number, number]> = [];
      let x = width * (0.15 + Math.random() * 0.7);
      let y = -10;
      const endY = height * (0.35 + Math.random() * 0.3);
      while (y < endY) {
        points.push([x, y]);
        x += (Math.random() - 0.5) * 46;
        y += 18 + Math.random() * 26;
      }
      bolts.push({ points, life: 1 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;

      for (let i = 0; i < LINES; i++) {
        const p = i / (LINES - 1);
        const baseY = height * (0.16 + p * 0.7);
        ctx.beginPath();
        for (let x = -10; x <= width + 10; x += 14) {
          const nx = x / width;
          const dist = nx - pointer.x;
          const pull = Math.exp(-dist * dist * 12) * (pointer.y * height - baseY) * 0.16;
          const y =
            baseY +
            Math.sin(nx * 4.6 + time * 0.55 + i * 0.5) * (10 + p * 22) +
            Math.sin(nx * 10.5 - time * 0.32 + i * 1.3) * 5 +
            pull;
          if (x === -10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        if (i === ACCENT) {
          ctx.strokeStyle = "rgba(255, 182, 39, 0.9)";
          ctx.lineWidth = 1.5;
          ctx.shadowColor = "rgba(255, 182, 39, 0.55)";
          ctx.shadowBlur = 14;
        } else {
          ctx.strokeStyle = `rgba(169, 173, 255, ${0.07 + p * 0.13})`;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      for (let b = bolts.length - 1; b >= 0; b--) {
        const bolt = bolts[b];
        bolt.life -= 0.045;
        if (bolt.life <= 0) {
          bolts.splice(b, 1);
          continue;
        }
        ctx.beginPath();
        bolt.points.forEach(([bx, by], index) => (index === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by)));
        ctx.strokeStyle = `rgba(255, 220, 140, ${bolt.life})`;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = "rgba(255, 182, 39, 0.9)";
        ctx.shadowBlur = 18;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      for (const dot of particles) {
        if (!reduce) {
          dot.y -= dot.speed;
          if (dot.y < -0.02) {
            dot.y = 1.02;
            dot.x = Math.random();
          }
        }
        const px = (dot.x + Math.sin(time * 0.4 + dot.phase) * 0.008) * width;
        const alpha = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(time * 0.9 + dot.phase));
        ctx.beginPath();
        ctx.arc(px, dot.y * height, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    };

    const loop = () => {
      if (visible && !document.hidden) {
        time += 0.016;
        if (lightning && time > nextBolt) {
          spawnBolt();
          nextBolt = time + 4 + Math.random() * 5;
        }
        draw();
      }
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = (event.clientY - rect.top) / rect.height;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);

    resize();
    window.addEventListener("resize", resize);
    if (reduce) {
      draw();
    } else {
      window.addEventListener("pointermove", onPointer, { passive: true });
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [lightning]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
