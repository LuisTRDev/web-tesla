"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    qrcode?: (type: number, level: string) => { addData: (s: string) => void; make: () => void; getModuleCount: () => number; isDark: (r: number, c: number) => boolean };
  }
}

interface Props {
  /** Nombre corto del colegio, para la tarjeta. */
  schoolName: string;
  /** Frase que acompaña a la tarjeta, por ejemplo "Admisión 2027". */
  tagline: string;
  className?: string;
}

const W = 1080;
const H = 1350;

function loadQrLib(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.qrcode) return resolve();
    const s = document.createElement("script");
    s.src = "/admin/vendor/qrcode.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("qr"));
    document.head.appendChild(s);
  });
}
const loadImg = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Dibuja la tarjeta 4:5 (escudo, título, QR de la página y su dirección), lista para publicar en redes. */
async function drawCard(canvas: HTMLCanvasElement, opts: { title: string; url: string; schoolName: string; tagline: string }) {
  await loadQrLib();
  if (document.fonts?.ready) await document.fonts.ready;
  const logo = await loadImg("/images/logo-escudo.png");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx || !window.qrcode) return;
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0D1230");
  bg.addColorStop(1, "#1F2860");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.85, H * 0.08, 0, W * 0.85, H * 0.08, 650);
  glow.addColorStop(0, "rgba(255,182,39,0.3)");
  glow.addColorStop(1, "rgba(255,182,39,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  // línea de energía
  ctx.beginPath();
  for (let x = -10; x <= W + 10; x += 8) {
    const y = 760 + Math.sin((x / W) * 4.2 + 3.1) * 30 + Math.sin((x / W) * 9.5) * 7;
    if (x === -10) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.save();
  ctx.shadowColor = "#FFB627";
  ctx.shadowBlur = 24;
  ctx.strokeStyle = "#FFB627";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  ctx.textBaseline = "alphabetic";
  if (logo) {
    const lh = 120;
    ctx.drawImage(logo, 72, 72, lh * (logo.naturalWidth / logo.naturalHeight), lh);
  }
  ctx.fillStyle = "#FFFFFF";
  ctx.font = '800 38px "Bricolage Grotesque", system-ui, sans-serif';
  ctx.fillText(opts.schoolName.toUpperCase(), 72 + 120 * 0.83 + 28, 140);

  // título (hasta 3 líneas)
  ctx.font = '800 96px "Bricolage Grotesque", system-ui, sans-serif';
  const words = opts.title.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > W - 144 && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, 72, 330 + i * 104));
  ctx.fillStyle = "#FFB627";
  ctx.font = '700 44px Figtree, system-ui, sans-serif';
  ctx.fillText(opts.tagline, 72, 330 + Math.min(lines.length, 3) * 104 + 20);

  // QR
  const qr = window.qrcode(0, "M");
  qr.addData(opts.url);
  qr.make();
  const n = qr.getModuleCount();
  const box = 400;
  const qx = (W - box) / 2;
  const qy = 800;
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, qx - 26, qy - 26, box + 52, box + 52, 36);
  ctx.fill();
  const cell = box / n;
  ctx.fillStyle = "#0D1230";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(qx + c * cell, qy + r * cell, Math.ceil(cell), Math.ceil(cell));
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.textAlign = "center";
  ctx.font = '600 32px Figtree, system-ui, sans-serif';
  const shown = opts.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  ctx.fillText(shown.length > 44 ? `${shown.slice(0, 43)}…` : shown, W / 2, qy + box + 84);
  ctx.textAlign = "left";
}

/**
 * Botón "Compartir": crea al momento una tarjeta bonita (con el QR de esta misma página) y la comparte con el menú
 * del celular (WhatsApp, Instagram, Facebook…). Si el aparato no puede compartir imágenes, la descarga.
 */
export default function ShareCard({ schoolName, tagline, className }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const canvas = useRef<HTMLCanvasElement>(null);
  const info = useRef({ title: "", url: "" });

  useEffect(() => {
    if (!open) return;
    info.current = { title: document.title.split("|")[0].trim() || schoolName, url: window.location.origin + window.location.pathname };
    setStatus("Creando tu tarjeta…");
    const t = window.setTimeout(() => {
      if (!canvas.current) return;
      drawCard(canvas.current, { ...info.current, schoolName, tagline })
        .then(() => setStatus(""))
        .catch(() => setStatus("No se pudo crear la tarjeta. Inténtalo de nuevo."));
    }, 30);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, schoolName, tagline]);

  const toBlob = () => new Promise<Blob | null>((resolve) => canvas.current?.toBlob(resolve, "image/png") ?? resolve(null));
  const share = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const file = new File([blob], "tarjeta-nikola-tesla.png", { type: "image/png" });
    const text = `${info.current.title} · ${info.current.url}`;
    try {
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text });
      else if (navigator.share) await navigator.share({ title: info.current.title, text, url: info.current.url });
      else download(blob);
    } catch {
      /* la persona cerró el menú de compartir */
    }
  };
  const download = (blob: Blob) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tarjeta-nikola-tesla.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(info.current.url);
      setStatus("Enlace copiado ✓");
    } catch {
      setStatus(info.current.url);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-spark
        className={className ?? "inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 px-5 text-[15px] font-semibold text-white transition-colors hover:border-filamento hover:text-filamento"}
      >
        <span aria-hidden="true">📤</span> Compartir esta página
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Compartir tarjeta" className="fixed inset-0 z-[95] flex items-center justify-center bg-noche-900/90 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="max-h-full w-full max-w-sm overflow-auto rounded-panel bg-white p-5 text-noche" onClick={(e) => e.stopPropagation()}>
            <canvas ref={canvas} className="w-full rounded-2xl bg-noche" style={{ aspectRatio: `${W} / ${H}` }} />
            <p className="mt-3 min-h-[20px] text-center text-sm text-niebla" aria-live="polite">{status}</p>
            <div className="mt-2 grid gap-2">
              <button type="button" onClick={share} className="min-h-[48px] rounded-full bg-filamento px-6 font-semibold text-noche hover:bg-noche hover:text-white">Compartir tarjeta</button>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={async () => { const b = await toBlob(); if (b) download(b); }} className="min-h-[44px] rounded-full border border-noche/25 font-semibold hover:border-noche">Descargar</button>
                <button type="button" onClick={copy} className="min-h-[44px] rounded-full border border-noche/25 font-semibold hover:border-noche">Copiar enlace</button>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="min-h-[44px] text-sm font-semibold text-niebla">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
