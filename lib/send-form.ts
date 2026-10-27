import { settings } from "@/data/settings";
import { campaignTag } from "@/lib/track";

/**
 * Envío de formularios al correo del colegio con Web3Forms (servicio gratuito, sin servidor propio).
 * La "clave de acceso" es pública por diseño (solo permite enviar al correo con el que se creó). Si no hay clave en
 * Datos del colegio → Formularios al correo, no se envía nada y los formularios siguen abriendo WhatsApp como siempre.
 * Nunca lanza errores: el correo es un respaldo y no debe romper el envío por WhatsApp.
 */
export const emailEnabled = !!settings.forms.emailKey;

export async function sendToEmail(subject: string, fields: Record<string, string>): Promise<boolean> {
  const key = settings.forms.emailKey;
  if (!key) return false;
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: key, subject: `${subject} · ${settings.shortName}`, from_name: `Web ${settings.shortName}`, ...fields, origen: campaignTag().trim() || "directo", botcheck: "" }),
    });
    const json = (await res.json()) as { success?: boolean };
    return !!json.success;
  } catch {
    return false;
  }
}
