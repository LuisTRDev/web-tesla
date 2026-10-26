import type { Metadata } from "next";
import Admission from "@/components/sections/Admission";
import Documents from "@/components/sections/Documents";
import Faq from "@/components/sections/Faq";
import DraftBadge from "@/components/ui/DraftBadge";
import ModuleHeader from "@/components/ui/ModuleHeader";
import NextModule from "@/components/ui/NextModule";
import { admissionInfo, admissionIntro } from "@/data/admission";
import { getModule } from "@/data/modules";
import { settings } from "@/data/settings";
import { getDocuments, getFaq } from "@/lib/data";
import { moduleMetadata } from "@/lib/seo";

const mod = getModule("admision");

export const metadata: Metadata = moduleMetadata(mod, `Admisión ${settings.admissionYear}`);

export default async function AdmissionPage() {
  const [faq, documents] = await Promise.all([getFaq(), getDocuments()]);
  const { resolution, modularCode } = settings.legal;

  return (
    <>
      <ModuleHeader module={mod} intro={admissionIntro} />
      <Admission showIntro={false} showProcessLink={false} />

      <section className="bg-tiza py-20 md:py-28">
        <div className="mx-auto max-w-site px-5 md:px-10">
          <DraftBadge label="Información por confirmar" className="mb-6" />
          <dl className="grid border-t border-noche/15 md:grid-cols-3">
            {admissionInfo.map((item) => (
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
      <Documents items={documents.filter((item) => item.category === "Admisión" || item.featured)} title="Documentos de admisión." tone="dark" />

      <NextModule current={mod.id} />
    </>
  );
}
