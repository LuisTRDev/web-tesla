"use client";

import { useEffect, useRef, useState } from "react";
import type { TourScene } from "@/data/tour";
import { cn } from "@/lib/utils";

/* Pannellum 2.5.6 (MIT), servido desde /vendor/pannellum: sin depender de servidores de terceros. */
interface PannellumViewer {
  loadScene: (id: string) => void;
  destroy: () => void;
  toggleFullscreen: () => void;
}
declare global {
  interface Window {
    pannellum?: { viewer: (el: HTMLElement | string, config: unknown) => PannellumViewer };
  }
}

function loadAssets(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!document.getElementById("pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href = "/vendor/pannellum/pannellum.css";
      document.head.appendChild(link);
    }
    if (window.pannellum) return resolve();
    const existing = document.getElementById("pannellum-js");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.id = "pannellum-js";
    script.src = "/vendor/pannellum/pannellum.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el visor 360°"));
    document.head.appendChild(script);
  });
}

/** Visor 360° con selector de escenas. Arrastra (o desliza) para mirar, rueda o pellizca para acercar. */
export default function PanoramaViewer({ scenes }: { scenes: TourScene[] }) {
  const box = useRef<HTMLDivElement>(null);
  const viewer = useRef<PannellumViewer | null>(null);
  const [active, setActive] = useState(scenes[0]?.id ?? "");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadAssets()
      .then(() => {
        if (cancelled || !box.current || !window.pannellum) return;
        const config = {
          default: { firstScene: scenes[0].id, sceneFadeDuration: 900, autoLoad: true, showControls: true, compass: false, hfov: 105, strings: { loadButtonLabel: "Toca para ver", loadingLabel: "Cargando…", bylineLabel: "" } },
          scenes: Object.fromEntries(scenes.map((s) => [s.id, { title: s.title, type: "equirectangular", panorama: s.image, autoRotate: -2 }])),
        };
        viewer.current = window.pannellum.viewer(box.current, config);
      })
      .catch(() => setError(true));
    return () => {
      cancelled = true;
      viewer.current?.destroy();
      viewer.current = null;
    };
  }, [scenes]);

  const go = (id: string) => {
    setActive(id);
    viewer.current?.loadScene(id);
  };
  const current = scenes.find((s) => s.id === active) ?? scenes[0];

  return (
    <div>
      <div className="relative overflow-hidden rounded-panel bg-noche-800">
        <div ref={box} className="h-[62vh] min-h-[340px] w-full md:h-[70vh]" aria-label={`Vista 360° de ${current.title}`} />
        {error && <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-white/80">No pudimos cargar el recorrido. Revisa tu conexión e inténtalo de nuevo.</p>}
        <p className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-noche/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">↔ Arrastra para mirar alrededor</p>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">{current.title}</h2>
          {current.description && <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-white/75">{current.description}</p>}
        </div>
        {scenes.length > 1 && (
          <ul className="flex flex-wrap gap-2 md:max-w-md md:justify-end" aria-label="Lugares del recorrido">
            {scenes.map((scene) => (
              <li key={scene.id}>
                <button
                  type="button"
                  aria-pressed={scene.id === active}
                  onClick={() => go(scene.id)}
                  className={cn("min-h-[44px] rounded-full border px-5 text-sm font-semibold transition-colors", scene.id === active ? "border-filamento bg-filamento text-noche" : "border-white/25 text-white/85 hover:border-white")}
                >
                  {scene.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
