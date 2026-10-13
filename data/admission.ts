import type { AdmissionStep } from "@/types";

/**
 * Proceso de admisión. Es una estructura propuesta: reemplazar por los pasos,
 * requisitos y fechas oficiales antes de publicar.
 */
export const admissionIntro =
  "Queremos conocer a tu familia. Escríbenos y te contamos, paso a paso, cómo ser parte de Nikola Tesla.";

export const admissionSteps: AdmissionStep[] = [
  {
    id: "informacion",
    title: "Solicita información",
    description: "[PASO POR CONFIRMAR] Escríbenos por WhatsApp o visítanos para resolver tus dudas.",
    confirmed: false,
  },
  {
    id: "visita",
    title: "Conoce el colegio",
    description: "[PASO POR CONFIRMAR] Coordinamos una visita para que conozcas nuestros espacios.",
    confirmed: false,
  },
  {
    id: "documentos",
    title: "Presenta los documentos",
    description: "[PASO POR CONFIRMAR] Lista de requisitos y documentos solicitados.",
    confirmed: false,
  },
  {
    id: "matricula",
    title: "Matrícula",
    description: "[PASO POR CONFIRMAR] Fechas y condiciones de matrícula.",
    confirmed: false,
  },
];
