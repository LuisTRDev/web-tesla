"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { levels } from "@/data/levels";
import { settings } from "@/data/settings";
import { SourceField, Thanks } from "@/components/ui/FormExtras";
import { sendToEmail } from "@/lib/send-form";
import { campaignTag, trackEvent } from "@/lib/track";
import { whatsappLink } from "@/lib/utils";

/**
 * Formulario de "Solicitar información".
 * No necesita servidor: arma el mensaje y lo abre en WhatsApp.
 * Si más adelante se quiere guardar en Supabase o enviar por correo,
 * reemplazar el contenido de `handleSubmit` por la llamada correspondiente.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("");
  const [sent, setSent] = useState(false);
  const hasWhatsapp = settings.contact.whatsapp.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = [
      `Hola, soy ${name}.`,
      level ? `Me interesa el nivel ${level}.` : "",
      message,
      source ? `Me enteré por: ${source}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const url = whatsappLink(settings.contact.whatsapp[0] ?? null, `${text}${campaignTag()}`);
    trackEvent("contact_form_submit", { level });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    // respaldo por correo (solo si el colegio puso su clave); no depende de que WhatsApp abra
    void sendToEmail("Solicitud de información", { nombre: name, nivel: level || "No indica", mensaje: message, como_nos_conocio: source || "No indica" });
    setSent(true);
  };

  const field =
    "mt-2 w-full rounded-2xl border border-noche/20 bg-white px-4 py-3.5 text-base text-noche placeholder:text-niebla/70 focus:border-noche focus:outline-none focus:ring-2 focus:ring-filamento";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="contacto-nombre" className="text-sm font-semibold text-noche">
          Tu nombre
        </label>
        <input id="contacto-nombre" name="nombre" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="contacto-nivel" className="text-sm font-semibold text-noche">
          Nivel de interés
        </label>
        <select id="contacto-nivel" name="nivel" value={level} onChange={(e) => setLevel(e.target.value)} className={field}>
          <option value="">Aún no lo sé</option>
          {levels.map((item) => (
            <option key={item.slug} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contacto-mensaje" className="text-sm font-semibold text-noche">
          ¿Qué te gustaría saber?
        </label>
        <textarea id="contacto-mensaje" name="mensaje" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className={field} />
      </div>
      <SourceField id="contacto-origen" value={source} onChange={setSource} />
      <button
        type="submit"
        disabled={!hasWhatsapp}
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-noche px-6 text-base font-semibold text-white transition-colors hover:bg-noche-600 disabled:cursor-not-allowed disabled:bg-noche/35 sm:w-auto"
      >
        Enviar por WhatsApp
      </button>
      <Thanks show={sent} />
      {!hasWhatsapp && (
        <p className="text-sm text-niebla">
          [WHATSAPP OFICIAL] pendiente: el envío se activará cuando se configure el número.
        </p>
      )}
    </form>
  );
}
