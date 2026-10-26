import raw from "@/content/admission.json";
import type { AdmissionInfo, AdmissionStep } from "@/types";
import { bool, list, rec, str } from "@/lib/content";

/** Proceso de admisión. Se edita desde el panel (/admin → Admisión). */
const r = rec(raw);

export const admissionHeadline = str(r.headline, "¿Listos para comenzar esta historia?");

export const admissionIntro = str(r.intro);

export const admissionSteps: AdmissionStep[] = list(r.steps).map((step, index) => ({
  id: str(step.id, `paso-${index + 1}`),
  title: str(step.title),
  description: str(step.description),
  confirmed: bool(step.confirmed),
}));

/** Bloques informativos de la página de admisión: requisitos, fechas, vacantes… */
export const admissionInfo: AdmissionInfo[] = list(r.info).map((item) => ({ title: str(item.title), text: str(item.text) }));
