"use client";

import { useState } from "react";
import { settings } from "@/data/settings";

/**
 * Agendar visita en un calendario real (Calendly o Cal.com). El colegio pega el enlace de su calendario en
 * Datos del colegio → Agendar visita en calendario. Se carga solo al tocar el botón, para no frenar la página.
 */
export default function BookingEmbed() {
  const url = settings.booking.url;
  const [open, setOpen] = useState(false);
  if (!url) return null;
  const src = url + (url.includes("?") ? "&" : "?") + "hide_gdpr_banner=1&embed_domain=" + (typeof window !== "undefined" ? window.location.hostname : "") + "&embed_type=Inline";
  return (
    <div className="mb-8 rounded-panel border border-noche/15 bg-tiza p-5">
      <p className="font-display text-xl font-bold text-noche">📅 Elige tu horario en el calendario</p>
      <p className="mt-1 text-sm text-niebla">Ves los días y horas libres y reservas al instante. Si prefieres WhatsApp, usa el formulario de abajo.</p>
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} data-spark className="mt-4 inline-flex min-h-[48px] items-center rounded-full bg-filamento px-6 font-semibold text-noche transition-colors hover:bg-noche hover:text-white">
          Ver horarios disponibles
        </button>
      ) : (
        <iframe src={src} title="Calendario para agendar la visita" loading="lazy" className="mt-4 h-[640px] w-full rounded-2xl border-0 bg-white" />
      )}
    </div>
  );
}
