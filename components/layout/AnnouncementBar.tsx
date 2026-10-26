"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const HEIGHT = "40px";

interface AnnouncementBarProps {
  text: string;
  linkText: string;
  linkUrl: string;
  startDate: string | null;
  endDate: string | null;
  /** Si se ve al cargar (calculado al construir la web); el navegador lo vuelve a comprobar con la fecha de hoy. */
  initialVisible: boolean;
}

/** Fecha de hoy en Lima (AAAA-MM-DD). */
function today(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
}

/**
 * Barra de aviso sobre el menú (ver data/banner.ts). Empuja el menú hacia abajo con la variable CSS --bar-h.
 * Se puede cerrar; al cerrarla no vuelve a aparecer mientras dure la visita. Las fechas se comprueban
 * también en el navegador, así que una campaña programada termina sola aunque la web no se reconstruya.
 */
export default function AnnouncementBar({ text, linkText, linkUrl, startDate, endDate, initialVisible }: AnnouncementBarProps) {
  const key = `tesla-aviso-${text}`;
  const [visible, setVisible] = useState(initialVisible);

  useEffect(() => {
    const now = today();
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(key) === "1";
    } catch {
      /* sin almacenamiento */
    }
    const inRange = (!startDate || now >= startDate) && (!endDate || now <= endDate);
    setVisible(inRange && !dismissed);
  }, [key, startDate, endDate]);

  useEffect(() => {
    document.documentElement.style.setProperty("--bar-h", visible ? HEIGHT : "0px");
    return () => document.documentElement.style.setProperty("--bar-h", "0px");
  }, [visible]);

  if (!visible) return null;

  const external = /^https?:\/\//.test(linkUrl);
  const link =
    linkText && linkUrl ? (
      external ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 underline decoration-2 underline-offset-4">
          {linkText}
        </a>
      ) : (
        <Link href={linkUrl} className="shrink-0 underline decoration-2 underline-offset-4">
          {linkText}
        </Link>
      )
    ) : null;

  return (
    <div role="region" aria-label="Aviso" className="fixed inset-x-0 top-0 z-[55] flex h-10 items-center justify-center gap-3 bg-filamento px-12 text-[13px] font-semibold text-noche">
      <p className="truncate">{text}</p>
      {link}
      <button
        type="button"
        aria-label="Cerrar aviso"
        onClick={() => {
          try {
            sessionStorage.setItem(key, "1");
          } catch {
            /* sin almacenamiento */
          }
          setVisible(false);
        }}
        className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full hover:bg-noche/10"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
