import type { Metadata } from "next";
import Admission from "@/components/sections/Admission";
import Faq from "@/components/sections/Faq";
import DraftBadge from "@/components/ui/DraftBadge";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { admissionIntro } from "@/data/admission";
import { getModule } from "@/data/modules";
import { settings } from "@/data/settings";
import { getFaq } from "@/lib/data";

const mod = getModule("admision");

export const metadata: Metadata = {
  title: `Admisión ${settings.admissionYear}`,
  description: `Conoce el proceso de Admisión ${settings.admissionYear} de la Institución Educativa Privada “Nikola Tesla” en Nuevo Imperial, Cañete.`,
  alternates: { canonical: mod.href },
};

/** Bloques de información pendiente. Completar con datos oficiales en este mismo archivo o moverlos a /data. */
const pendingInfo = [
  { title: "Requisitos", text: "[REQUISITOS PENDIENTES] Documentos que debe presentar la familia." },
  { title: "Fechas", text: "[FECHAS PENDIENTES] Calendario de inscripción, evaluación y matrícula." },
  { title: "Vacantes", text: "[VACANTES PENDIENTES] Niveles y grados con vacantes disponibles." },
];

export default async function AdmissionPage() {
  const faq = await getFaq();
  const { resolution, modularCode } = settings.legal;

  return (
    <>
      <ModuleHeader module={mod} intro={admissionIntro} />
      <Admission showIntro={false} showProcessLink={false} />

      <section className="bg-tiza py-20 md:py-28">
        <div className="mx-auto max-w-site px-5 md:px-10">
          <DraftBadge label="Información por confirmar" className="mb-6" />
          <dl className="grid border-t border-noche/15 md:grid-cols-3">
            {pendingInfo.map((item) => (
              <div key={item.title} className="border-b border-noche/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
                <dt className="font-display text-3xl font-extrabold tracking-[-0.025em] text-noche">{item.title}</dt>
                <dd className="mt-3 text-[17px] leading-relaxed text-niebla">{item.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-[15px] text-niebla">
            <span className="font-semibold text-noche">Respaldo oficial:</span> {resolution ?? "[RESOLUCIÓN DE FUNCIONAMIENTO – UGEL]"} ·
            Código modular {modularCode ?? "[CÓDIGO MODULAR]"}
          </p>
        </div>
      </section>

      <Faq items={faq} />

      <NextModule current={mod.id} />
    </>
  );
}
