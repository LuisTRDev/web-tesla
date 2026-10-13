import DraftBadge from "@/components/ui/DraftBadge";
import Reveal from "@/components/ui/Reveal";
import { settings } from "@/data/settings";
import type { FaqItem } from "@/types";
import { whatsappLink } from "@/lib/utils";

/**
 * PREGUNTAS FRECUENTES: acordeón nativo (<details>), accesible sin JavaScript.
 * Las respuestas confirmadas se publican también como datos estructurados FAQPage para Google.
 */
export default function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  const confirmed = items.filter((item) => item.confirmed);
  const wa = whatsappLink(settings.contact.whatsapp[0] ?? null, "Hola, tengo una consulta sobre la I.E.P. Nikola Tesla.");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: confirmed.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-site gap-12 px-5 md:px-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 id="preguntas-titulo" className="text-balance font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold leading-[0.96] tracking-[-0.03em] text-noche">
            Preguntas frecuentes.
          </h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-niebla">
            Lo que las familias suelen preguntarnos. ¿No encuentras tu respuesta?{" "}
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-noche underline decoration-filamento decoration-2 underline-offset-4">
                Escríbenos por WhatsApp
              </a>
            ) : (
              "Escríbenos."
            )}
          </p>
          {confirmed.length < items.length && <DraftBadge label="Respuestas por confirmar" className="mt-6" />}
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          <ul className="border-t border-noche/15">
            {items.map((item) => (
              <li key={item.id} className="border-b border-noche/15">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl font-bold leading-snug text-noche md:text-2xl [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span
                      aria-hidden="true"
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-noche/25 transition-colors group-open:border-noche group-open:bg-noche group-open:text-white"
                    >
                      <span className="absolute h-[2px] w-4 bg-current" />
                      <span className="absolute h-4 w-[2px] bg-current transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 pr-14 text-[17px] leading-relaxed text-niebla">{item.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      {confirmed.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </section>
  );
}
