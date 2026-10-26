import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Faq from "@/components/sections/Faq";
import VisitForm from "@/components/sections/VisitForm";
import ButtonLink from "@/components/ui/ButtonLink";
import Countdown from "@/components/ui/Countdown";
import CountUp from "@/components/ui/CountUp";
import DraftBadge from "@/components/ui/DraftBadge";
import FieldCanvas from "@/components/ui/FieldCanvas";
import Illustration from "@/components/ui/Illustration";
import Reveal from "@/components/ui/Reveal";
import { admissionIntro, admissionSteps } from "@/data/admission";
import { campaignPage } from "@/data/pages";
import { settings } from "@/data/settings";
import { getFaq } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";

/**
 * PÁGINA DE CAMPAÑA
 * Es el destino de los anuncios (Facebook, Instagram, Google): un solo mensaje, un solo camino
 * (WhatsApp o agendar visita). La ruta lleva el año en el nombre; si cambia `admissionYear`,
 * renombrar esta carpeta (app/admision-AAAA) para que la dirección coincida.
 * Enlazar los anuncios con parámetros, p. ej. /admision-2027?utm_source=facebook&utm_campaign=matricula
 */
const path = `/admision-${settings.admissionYear}`;

export const metadata: Metadata = {
  title: `Admisión ${settings.admissionYear}`,
  description: campaignPage.seoDescription,
  alternates: { canonical: path },
  openGraph: { url: path, title: `Admisión ${settings.admissionYear} | ${settings.name}` },
};

export default async function AdmissionCampaignPage() {
  const faq = await getFaq();
  const reasons = campaignPage.reasons;
  const stats = settings.stats.filter((stat) => stat.value);
  const wa = whatsappLink(settings.contact.whatsapp[0] ?? null, `Hola, quisiera información sobre la Admisión ${settings.admissionYear} en la I.E.P. Nikola Tesla.`);

  return (
    <>
      {/* Cabecera */}
      <section className="relative isolate overflow-hidden bg-noche text-white">
        <div aria-hidden="true" className="hero-aurora absolute inset-0 -z-20" />
        <FieldCanvas className="absolute inset-0 -z-10 h-full w-full" />
        <div className="mx-auto max-w-site px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
          <p className="hero-in inline-flex rounded-full bg-filamento px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-noche">
            {campaignPage.badge}
          </p>
          <h1 className="hero-in mt-6 max-w-[11ch] text-balance font-display text-[clamp(3.4rem,11vw,10rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em]" style={{ "--d": "0.15s" } as CSSProperties}>
            Admisión {settings.admissionYear}
          </h1>
          <p className="hero-in mt-8 max-w-xl text-xl leading-relaxed text-white/85" style={{ "--d": "0.3s" } as CSSProperties}>
            {settings.tagline} {admissionIntro}
          </p>
          <div className="hero-in mt-10 flex flex-col gap-3 sm:flex-row" style={{ "--d": "0.45s" } as CSSProperties}>
            {wa ? (
              <ButtonLink href={wa}>Escríbenos por WhatsApp</ButtonLink>
            ) : (
              <span className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-dashed border-white/50 px-6 text-[15px] font-semibold text-white/80">
                WhatsApp [WHATSAPP OFICIAL]
              </span>
            )}
            <ButtonLink href="#visita" variant="outline-light">
              Agenda tu visita
            </ButtonLink>
          </div>
          <Countdown className="hero-in mt-14" />
        </div>
      </section>

      {/* Cifras (solo las que ya tienen dato real) */}
      {stats.length > 0 && (
        <section aria-label="El colegio en cifras" className="bg-tiza py-14 md:py-20">
          <dl className="mx-auto grid max-w-site gap-8 px-5 sm:grid-cols-3 md:px-10">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col-reverse">
                <dt className="mt-2 text-[15px] font-medium text-niebla">{stat.label}</dt>
                <dd className="font-display text-[clamp(2.6rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em] text-noche">
                  <CountUp value={stat.value as string} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Por qué elegirnos */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-site px-5 md:px-10">
          <Reveal>
            <h2 className="max-w-[16ch] text-balance font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-noche">
              {campaignPage.reasonsTitle}
            </h2>
            <DraftBadge label="Descripciones propuestas" className="mt-5" />
          </Reveal>
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {reasons.map((reason, index) => (
              <li key={reason.id} data-spark className="overflow-hidden rounded-panel bg-noche text-white">
                <Reveal delay={index * 0.08}>
                  <div className="relative aspect-[4/3]">
                    <Illustration name={reason.illustration} />
                  </div>
                  <div className="p-7">
                    <h3 className="font-display text-2xl font-bold leading-tight">{reason.title}</h3>
                    <p className="mt-3 text-[16px] leading-relaxed text-white/75">{reason.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pasos */}
      <section className="bg-filamento py-20 text-noche md:py-28">
        <div className="mx-auto max-w-site px-5 md:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">{campaignPage.stepsTitle}</h2>
            {admissionSteps.some((step) => !step.confirmed) && <DraftBadge label="Proceso propuesto, por confirmar" className="mt-5" />}
          </Reveal>
          <ol className="mt-12 grid border-t border-noche/25 sm:grid-cols-2 lg:grid-cols-4">
            {admissionSteps.map((step, index) => (
              <li key={step.id} className="border-b border-noche/25 py-6 sm:pr-8 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <Reveal delay={index * 0.07}>
                  <span className="font-display text-5xl font-extrabold leading-none tracking-[-0.03em] text-noche/35">{index + 1}</span>
                  <h3 className="mt-3 font-display text-xl font-bold leading-tight">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-noche/75">{step.description}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Agenda tu visita */}
      <section id="visita" className="bg-tiza py-20 md:py-28">
        <div className="mx-auto grid max-w-site gap-12 px-5 md:px-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="text-balance font-display text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-noche">{campaignPage.visitTitle}</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-niebla">
              {campaignPage.visitText}
            </p>
            <p className="mt-6 text-[15px] text-niebla">
              {settings.location.address}, {settings.location.district}, {settings.location.province}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-panel bg-white p-6 md:p-9 lg:col-span-7">
            <VisitForm />
          </Reveal>
        </div>
      </section>

      <Faq items={faq} />
    </>
  );
}
