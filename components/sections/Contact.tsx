import type { ReactNode } from "react";
import ContactForm from "@/components/sections/ContactForm";
import Reveal from "@/components/ui/Reveal";
import SocialIcon from "@/components/ui/SocialIcon";
import { settings } from "@/data/settings";
import { cn, formatPhone, whatsappLink } from "@/lib/utils";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-noche/15 py-4 text-[17px]">
      <dt className="text-sm font-semibold text-niebla">{label}</dt>
      <dd className="text-noche">{children}</dd>
    </div>
  );
}

const pending = (text: string) => <span className="text-niebla">{text}</span>;

const socialLabels: Record<keyof typeof settings.social, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

/** CONTACTO: datos centralizados en data/settings.ts, mapa y formulario que abre WhatsApp. */
export default function Contact({ showIntro = true }: { showIntro?: boolean }) {
  const { location, contact, social } = settings;
  const socials = (Object.keys(social) as Array<keyof typeof social>).filter((key) => social[key]);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&z=16&output=embed`;

  return (
    <section id="contacto" className={cn("bg-tiza", showIntro ? "py-24 md:py-36" : "py-16 md:py-24")}>
      <div className="mx-auto max-w-site px-5 md:px-10">
        {showIntro && (
          <Reveal className="mb-14 lg:mb-20">
            <h2 className="text-balance font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-noche">
              Conversemos.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-niebla">
              Escríbenos o visítanos en {location.district}. Nos encantará conocer a tu familia.
            </p>
          </Reveal>
        )}

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <p className="font-display text-2xl font-bold leading-tight tracking-[-0.015em] text-noche">{settings.name}</p>
            <dl className="mt-6 border-t border-noche/15">
              <Row label="Dirección">
                <address className="not-italic">
                  {location.address}
                  <br />
                  {location.district}, {location.province}, {location.region}
                </address>
              </Row>
              <Row label="WhatsApp">
                {contact.whatsapp.length > 0 ? (
                  <ul className="space-y-2">
                    {contact.whatsapp.map((number) => (
                      <li key={number}>
                        <a
                          href={whatsappLink(number) as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Escribir por WhatsApp al ${formatPhone(number)}`}
                          className="inline-flex items-center gap-2.5 font-semibold underline decoration-filamento decoration-2 underline-offset-4"
                        >
                          <SocialIcon name="whatsapp" className="text-[#25D366]" />
                          {formatPhone(number)}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  pending("[WHATSAPP OFICIAL]")
                )}
              </Row>
              <Row label="Atención">{contact.hours ?? pending("[HORARIO DE ATENCIÓN]")}</Row>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              {socials.length > 0 ? (
                socials.map((key) => (
                  <a
                    key={key}
                    href={social[key] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-3 rounded-full border border-noche/30 px-6 text-[15px] font-semibold text-noche transition-colors hover:bg-noche hover:text-white"
                  >
                    <SocialIcon name={key} />
                    Síguenos en {socialLabels[key]}
                  </a>
                ))
              ) : (
                <span className="inline-flex min-h-[48px] items-center rounded-full border border-dashed border-noche/40 px-6 text-[15px] font-semibold text-noche/70">
                  [REDES SOCIALES OFICIALES]
                </span>
              )}
            </div>

            <div className="mt-12">
              <h3 className="font-display text-xl font-bold text-noche">Solicitar información</h3>
              <div className="mt-5">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="relative h-[420px] overflow-hidden rounded-panel bg-tiza-300 lg:sticky lg:top-28 lg:h-[680px]">
              <iframe
                src={mapSrc}
                title={`Mapa de ubicación: ${location.address}, ${location.district}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            {settings.showDraftBadges && (
              <p className="mt-3 text-sm text-niebla">
                [POR VERIFICAR] Confirmar que el punto del mapa coincide con la ubicación exacta del colegio.
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
