"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { bannerMatches, isBannerActive, type BannerColor, type BannerItem } from "@/data/banner";
import { cn } from "@/lib/utils";

const HEIGHT = "40px";
const ROTATE_MS = 7000;

const colors: Record<BannerColor, { bar: string; hover: string }> = {
  amarillo: { bar: "bg-filamento text-noche", hover: "hover:bg-noche/10" },
  rojo: { bar: "bg-rojo-700 text-white", hover: "hover:bg-white/15" },
  azul: { bar: "bg-marino text-white", hover: "hover:bg-white/15" },
  oscuro: { bar: "bg-noche-900 text-white", hover: "hover:bg-white/15" },
};

/** Fecha de hoy en Lima (AAAA-MM-DD). */
function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
}

const keyOf = (item: BannerItem) => `tesla-aviso-${item.text}`;

/**
 * Barra de aviso sobre el menú (ver data/banner.ts). Empuja el menú hacia abajo con la variable CSS --bar-h.
 * - Puede haber varios avisos: se muestran los que estén en fechas y en esa página; si son varios, rotan.
 * - Se puede cerrar; al cerrarlo no vuelve a aparecer mientras dure la visita.
 * - Las fechas se comprueban también en el navegador, así que una campaña programada termina sola
 *   aunque la web no se reconstruya.
 */
export default function AnnouncementBar({ items, initialVisible }: { items: BannerItem[]; initialVisible: boolean }) {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    setNow(today());
    const closed: string[] = [];
    for (const item of items) {
      try {
        if (sessionStorage.getItem(keyOf(item)) === "1") closed.push(item.id);
      } catch {
        /* sin almacenamiento */
      }
    }
    setDismissed(closed);
    setReady(true);
  }, [items]);

  const visible = useMemo(
    () => (ready && now ? items.filter((item) => isBannerActive(item, now) && bannerMatches(item.where, pathname) && !dismissed.includes(item.id)) : []),
    [items, ready, now, pathname, dismissed],
  );

  useEffect(() => {
    setIndex(0);
  }, [pathname]);

  useEffect(() => {
    if (visible.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => value + 1), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [visible.length]);

  const show = ready ? visible.length > 0 : initialVisible;

  useEffect(() => {
    document.documentElement.style.setProperty("--bar-h", show ? HEIGHT : "0px");
    return () => document.documentElement.style.setProperty("--bar-h", "0px");
  }, [show]);

  // Antes de hidratar se muestra el primer aviso general, para que el menú no salte.
  const current = ready ? visible[index % Math.max(visible.length, 1)] : items.find((item) => item.where === "todas");
  if (!show || !current) return null;

  const style = colors[current.color];
  const external = /^https?:\/\//.test(current.linkUrl);
  const linkClass = "shrink-0 underline decoration-2 underline-offset-4";
  const cta =
    current.linkText && current.linkUrl ? (
      external ? (
        <a href={current.linkUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {current.linkText}
        </a>
      ) : (
        <Link href={current.linkUrl} className={linkClass}>
          {current.linkText}
        </Link>
      )
    ) : null;

  return (
    <div role="region" aria-label="Aviso" className={cn("fixed inset-x-0 top-0 z-[55] flex h-10 items-center justify-center gap-3 px-12 text-[13px] font-semibold", style.bar)}>
      <p key={current.id} className="truncate">
        {current.text}
      </p>
      {cta}
      {visible.length > 1 && (
        <span aria-hidden="true" className="hidden gap-1 sm:flex">
          {visible.map((item, position) => (
            <span key={item.id} className={cn("h-1.5 w-1.5 rounded-full bg-current", position === index % visible.length ? "opacity-90" : "opacity-30")} />
          ))}
        </span>
      )}
      <button
        type="button"
        aria-label="Cerrar aviso"
        onClick={() => {
          try {
            sessionStorage.setItem(keyOf(current), "1");
          } catch {
            /* sin almacenamiento */
          }
          setDismissed((list) => [...list, current.id]);
        }}
        className={cn("absolute right-3 flex h-8 w-8 items-center justify-center rounded-full", style.hover)}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
