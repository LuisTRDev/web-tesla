"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { levels } from "@/data/levels";
import { settings } from "@/data/settings";
import BookingEmbed from "@/components/ui/BookingEmbed";
import { sendToEmail } from "@/lib/send-form";
import { campaignTag, trackEvent } from "@/lib/track";
import { formatDate, whatsappLink } from "@/lib/utils";

const SHIFTS = ["Por la mañana", "Por la tarde"] as const;

/** Fecha de mañana en formato AAAA-MM-DD (hora local), para no permitir visitas en el pasado. */
function tomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * "Agenda tu visita": la familia elige día y turno y se abre WhatsApp con el mensaje ya redactado.
 * No necesita servidor. El colegio confirma la hora por el mismo chat.
 */
export default function VisitForm() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [date, setDate] = useState("");
  const [shift, setShift] = useState<string>(SHIFTS[0]);
  const hasWhatsapp = settings.contact.whatsapp.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = [
      `Hola, soy ${name}.`,
      `Quisiera agendar una visita al colegio${date ? ` el ${formatDate(date)}` : ""}, ${shift.toLowerCase()}.`,
      level ? `Me interesa el nivel ${level}.` : "",
      `Es para la Admisión ${settings.admissionYear}.`,
    ]
      .filter(Boolean)
      .join(" ");
    const url = whatsappLink(settings.contact.whatsapp[0] ?? null, `${text}${campaignTag()}`);
    trackEvent("visit_request", { level, shift });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    void sendToEmail("Solicitud de visita", { nombre: name, dia: date ? formatDate(date) : "", turno: shift, nivel: level || "No indica", admision: String(settings.admissionYear) });
  };

  const field =
    "mt-2 w-full rounded-2xl border border-noche/20 bg-white px-4 py-3.5 text-base text-noche placeholder:text-niebla/70 focus:border-noche focus:outline-none focus:ring-2 focus:ring-filamento";

  return (
    <>
    <BookingEmbed />
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="visita-nombre" className="text-sm font-semibold text-noche">
          Tu nombre
        </label>
        <input id="visita-nombre" name="nombre" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="visita-fecha" className="text-sm font-semibold text-noche">
            Día de la visita
          </label>
          <input id="visita-fecha" name="fecha" type="date" required min={tomorrow()} value={date} onChange={(e) => setDate(e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="visita-turno" className="text-sm font-semibold text-noche">
            Turno
          </label>
          <select id="visita-turno" name="turno" value={shift} onChange={(e) => setShift(e.target.value)} className={field}>
            {SHIFTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="visita-nivel" className="text-sm font-semibold text-noche">
          Nivel de interés
        </label>
        <select id="visita-nivel" name="nivel" value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
          <option value="">Aún no lo sé</option>
          {levels.map((item) => (
            <option key={item.slug} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={!hasWhatsapp}
        data-spark
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-noche px-6 text-base font-semibold text-white transition-colors hover:bg-noche-600 disabled:cursor-not-allowed disabled:bg-noche/35 sm:w-auto"
      >
        Agendar por WhatsApp
      </button>
      <p className="text-sm text-niebla">
        {hasWhatsapp ? "Te confirmamos el horario por el mismo chat." : "[WHATSAPP OFICIAL] pendiente: el envío se activará cuando se configure el número."}
      </p>
    </form>
    </>
  );
}
