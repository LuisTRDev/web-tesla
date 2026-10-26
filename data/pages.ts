import raw from "@/content/pages.json";
import { list, rec, str } from "@/lib/content";

/**
 * Textos de la portada y de la página de campaña (/admision-AAAA).
 * Se editan desde el panel (/admin → Páginas).
 */
const r = rec(raw);
const home = rec(r.home);
const campaign = rec(r.campaign);

export const homePage = {
  /** Texto del aviso "Admisión 2027 · …" del hero. */
  admissionNotice: str(home.admissionNotice, "Infórmate sobre el proceso"),
};

export const campaignPage = {
  badge: str(campaign.badge, "Nikola Tesla · Cañete"),
  seoDescription: str(campaign.seoDescription),
  reasonsTitle: str(campaign.reasonsTitle, "¿Por qué elegir Nikola Tesla?"),
  reasons: list(campaign.reasons).map((reason, index) => ({
    id: `razon-${index + 1}`,
    title: str(reason.title),
    description: str(reason.description),
    /** Nombre de una ilustración (ver components/ui/Illustration.tsx). */
    illustration: str(reason.illustration, "tecnologia"),
  })),
  stepsTitle: str(campaign.stepsTitle, "Así de simple."),
  visitTitle: str(campaign.visitTitle, "Ven a conocernos."),
  visitText: str(campaign.visitText),
};
