"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_KEY } from "@/components/layout/ConsentGate";
import { settings } from "@/data/settings";

/**
 * Aviso de cookies y privacidad (texto editable en Datos del colegio → Aviso de privacidad). Se apaga en el panel.
 * "Aceptar" activa la medición; "Solo lo necesario" no carga Google Analytics. La elección se recuerda en el aparato.
 */
export default function CookieNotice() {
  const p = settings.privacy;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!p.enabled) return;
    try {
      setOpen(!localStorage.getItem(CONSENT_KEY));
    } catch {
      setOpen(true);
    }
  }, [p.enabled]);
  if (!p.enabled || !open) return null;
  const choose = (value: "all" | "necessary") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* sin almacenamiento: se vuelve a preguntar */
    }
    window.dispatchEvent(new Event("tesla-consent"));
    setOpen(false);
  };
  return (
    <div role="dialog" aria-label="Aviso de privacidad" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-panel bg-noche p-5 text-white shadow-[0_20px_60px_-15px_rgba(7,10,28,0.8)] md:bottom-6">
      <p className="text-[15px] leading-relaxed text-white/85">
        {p.text}{" "}
        {p.linkHref && (
          <Link href={p.linkHref} className="font-semibold text-filamento underline underline-offset-4">
            {p.linkLabel}
          </Link>
        )}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose("all")} className="btn-shape inline-flex min-h-[46px] items-center rounded-full bg-filamento px-6 font-semibold text-noche hover:bg-white">
          {p.acceptLabel}
        </button>
        <button type="button" onClick={() => choose("necessary")} className="btn-shape inline-flex min-h-[46px] items-center rounded-full border border-white/35 px-6 font-semibold hover:border-white">
          {p.rejectLabel}
        </button>
      </div>
    </div>
  );
}
