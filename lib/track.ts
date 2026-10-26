/**
 * Seguimiento de campañas y de contactos por WhatsApp.
 * - Guarda el origen del visitante (utm_source, utm_medium, utm_campaign) mientras dura la sesión.
 * - Envía eventos a Google Analytics 4 si está configurado (NEXT_PUBLIC_GA_ID); si no, no hace nada.
 * Todo falla en silencio: el seguimiento nunca debe romper la web.
 */

const KEY = "tesla-campana";
const FIELDS = ["utm_source", "utm_medium", "utm_campaign"] as const;

type Campaign = Partial<Record<(typeof FIELDS)[number], string>>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Lee los parámetros utm de la URL actual y los guarda en la sesión. */
export function captureCampaign(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Campaign = {};
    for (const field of FIELDS) {
      const value = params.get(field);
      if (value) found[field] = value.slice(0, 60);
    }
    if (Object.keys(found).length > 0) sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* sin almacenamiento disponible */
  }
}

export function getCampaign(): Campaign {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Campaign;
  } catch {
    return {};
  }
}

/** Texto corto para añadir al mensaje de WhatsApp, p. ej. " (vía facebook)". Vacío si no hay origen. */
export function campaignTag(): string {
  const { utm_source: source } = getCampaign();
  return source ? ` (vía ${source})` : "";
}

export function trackEvent(name: string, params: Record<string, string | number> = {}): void {
  try {
    window.gtag?.("event", name, { ...getCampaign(), ...params });
  } catch {
    /* sin analítica */
  }
}
