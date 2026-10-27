import raw from "@/content/settings.json";
import { QR_ANIMATIONS } from "@/lib/qr-splash";
import type { SiteSettings } from "@/types";
import { bool, list, num, oneOf, rec, str, strings, text, webUrl } from "@/lib/content";

/**
 * CONFIGURACIÓN CENTRAL DEL SITIO
 * Los valores viven en content/settings.json y se editan desde el panel (/admin → Datos del colegio).
 * Todo dato institucional se lee de aquí: cambia un valor y se actualiza en toda la web.
 * Los valores vacíos (null) se muestran como placeholders visibles, por ejemplo [WHATSAPP OFICIAL].
 */
const r = rec(raw);
const location = rec(r.location);
const contact = rec(r.contact);
const legal = rec(r.legal);
const social = rec(r.social);
const whatsappButton = rec(contact.whatsappButton);
const images = rec(r.images);
const qrIntro = rec(r.qrIntro);
const forms = rec(r.forms);
const booking = rec(r.booking);

/** Solo se aceptan calendarios de Calendly o Cal.com (https). */
const bookingUrl = (value: unknown): string | null => {
  try {
    const url = new URL(String(value ?? '').trim());
    return url.protocol === 'https:' && /(^|\.)(calendly\.com|cal\.com)$/.test(url.hostname) ? url.toString() : null;
  } catch {
    return null;
  }
};

export const settings: SiteSettings = {
  name: str(r.name, "Institución Educativa Privada “Nikola Tesla”"),
  shortName: str(r.shortName, "Nikola Tesla"),
  kicker: str(r.kicker, "Institución Educativa Privada"),
  tagline: str(r.tagline, "Donde la curiosidad se convierte en futuro."),
  concept: str(r.concept),
  footerPhrase: str(r.footerPhrase, "Educación, curiosidad y futuro."),
  description: str(r.description),
  admissionYear: num(r.admissionYear, 2027),
  admissionDeadline: text(r.admissionDeadline),
  siteUrl: webUrl(r.siteUrl, "https://www.example.com"),
  location: {
    address: str(location.address),
    district: str(location.district),
    province: str(location.province),
    region: str(location.region),
    country: str(location.country, "Perú"),
    mapQuery: str(location.mapQuery),
  },
  contact: {
    // Solo dígitos con código de país. El primero es el principal.
    whatsapp: strings(contact.whatsapp)
      .map((number) => number.replace(/\D/g, ""))
      .filter(Boolean),
    hours: text(contact.hours),
    whatsappButton: {
      label: str(whatsappButton.label, "¿Consultas? Escríbenos"),
      side: oneOf(whatsappButton.side, ["derecha", "izquierda"] as const, "derecha"),
      defaultMessage: str(whatsappButton.defaultMessage, "Hola, quisiera información sobre la I.E.P. Nikola Tesla."),
      messages: list(whatsappButton.messages)
        .map((entry) => ({ path: str(entry.path).trim(), message: str(entry.message).trim() }))
        .filter((entry) => entry.path && entry.message),
    },
  },
  legal: {
    resolution: text(legal.resolution),
    modularCode: text(legal.modularCode),
  },
  social: {
    facebook: text(social.facebook),
    instagram: text(social.instagram),
    tiktok: text(social.tiktok),
    youtube: text(social.youtube),
  },
  showDraftBadges: bool(r.showDraftBadges, true),
  images: {
    hero: text(images.hero),
    heroVideo: text(images.heroVideo),
    about: text(images.about),
    aboutDetail: text(images.aboutDetail),
    admission: text(images.admission),
    share: text(images.share),
  },
  forms: { emailKey: text(forms.emailKey) },
  booking: { url: bookingUrl(booking.url) },
  qrIntro: {
    animation: oneOf(qrIntro.animation, QR_ANIMATIONS, "atomo"),
    text: str(qrIntro.text),
    seconds: Math.min(6, Math.max(1.5, num(qrIntro.seconds, 2.8))),
    destination: oneOf(qrIntro.destination, ["campana", "whatsapp", "contacto", "inicio"] as const, "campana"),
  },
  stats: list(r.stats).map((stat, index) => ({
    id: str(stat.id, `cifra-${index + 1}`),
    value: text(stat.value),
    label: str(stat.label),
  })),
};
