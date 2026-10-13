import ButtonLink from "@/components/ui/ButtonLink";
import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import { admissionIntro, admissionSteps } from "@/data/admission";
import { settings } from "@/data/settings";
import { cn, whatsappLink } from "@/lib/utils";

/**
 * ADMISIÓN: el único bloque de la web a todo color de acento.
 * Importante pero sin presión: una invitación, tres caminos claros.
 */
export default function Admission({ showProcessLink = true, showIntro = true }: { showProcessLink?: boolean; showIntro?: boolean }) {
  const wa = whatsappLink(
    settings.contact.whatsapp[0] ?? null,
    `Hola, quisiera información sobre la Admisión ${settings.admissionYear} en la I.E.P. Nikola Tesla.`,
  );
  const hasDrafts = admissionSteps.some((step) => !step.confirmed);

  return (
    <section id="admision" className={cn("relative overflow-hidden bg-filamento text-noche", showIntro ? "py-24 md:py-36" : "pb-24 md:pb-36")}>
      {/* Ondas concéntricas (en /admision ya las dibuja la cabecera del módulo) */}
      {showIntro && (
        <svg aria-hidden="true" viewBox="0 0 800 800" className="pointer-events-none absolute -bottom-[420px] -right-[260px] h-[900px] w-[900px] text-noche/[0.12]" fill="none" stroke="currentColor">
          {[100, 170, 240, 310, 380].map((radius) => (
            <circle key={radius} cx="400" cy="400" r={radius} strokeWidth="1.5" />
          ))}
        </svg>
      )}

      <div className="relative mx-auto max-w-site px-5 md:px-10">
        {showIntro && (
          <Reveal className="mb-10">
            <p className="font-display text-xl font-bold md:text-2xl">Admisión {settings.admissionYear}</p>
            <h2 className="mt-4 max-w-[13ch] text-balance font-display text-[clamp(3rem,9.5vw,8.5rem)] font-extrabold leading-[0.88] tracking-[-0.045em]">
              ¿Listos para comenzar esta historia?
            </h2>
            <p className="mt-8 max-w-xl text-xl leading-relaxed text-noche/85">{admissionIntro}</p>
          </Reveal>
        )}

        <Reveal delay={0.1} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href="/contacto" variant="dark">
            Solicitar información
          </ButtonLink>
          {wa ? (
            <ButtonLink href={wa} variant="outline-dark">
              Contactar por WhatsApp
            </ButtonLink>
          ) : (
            <span className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-dashed border-noche/50 px-6 text-[15px] font-semibold text-noche/70">
              Contactar por WhatsApp [WHATSAPP OFICIAL]
            </span>
          )}
          {showProcessLink && (
            <ButtonLink href="/admision" variant="outline-dark">
              Conocer el proceso de admisión
            </ButtonLink>
          )}
        </Reveal>

        <div className="mt-16 md:mt-24">
          {hasDrafts && <DraftBadge label="Proceso propuesto, por confirmar" className="mb-5" />}
          <ol className="grid border-t border-noche/25 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
