import Link from "next/link";
import Logo from "@/components/ui/Logo";
import SecretAdminTrigger from "@/components/ui/SecretAdminTrigger";
import SocialIcon from "@/components/ui/SocialIcon";
import { footerConfig, navLinks } from "@/data/navigation";
import { settings } from "@/data/settings";
import { formatPhone, whatsappLink } from "@/lib/utils";

const socialLabels: Record<keyof typeof settings.social, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

export default function Footer() {
  const { location, contact, social, legal } = settings;
  const socials = (Object.keys(social) as Array<keyof typeof social>).filter((key) => social[key]);

  return (
    <footer className="relative overflow-hidden bg-noche text-white">
      <div className="mx-auto max-w-site px-5 pb-10 pt-20 md:px-10 md:pt-28">
        <p className="font-display text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.03em] text-balance">
          {settings.footerPhrase}
        </p>

        <div className="mt-16 grid gap-12 border-t border-white/[0.12] pt-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <SecretAdminTrigger>
              <Logo />
            </SecretAdminTrigger>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">{settings.name}</p>
          </div>

          {footerConfig.showExplore && (
          <nav aria-label="Pie de página">
            <h2 className="text-sm font-semibold text-white/55">Explorar</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[15px] lg:grid-cols-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/85 transition-colors hover:text-filamento">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          )}

          <div>
            <h2 className="text-sm font-semibold text-white/55">Contacto</h2>
            <ul className="mt-4 space-y-2.5 text-[15px] text-white/85">
              {contact.whatsapp.length > 0 ? (
                contact.whatsapp.map((number) => (
                  <li key={number}>
                    <a
                      href={whatsappLink(number) as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Escribir por WhatsApp al ${formatPhone(number)}`}
                      className="inline-flex items-center gap-2.5 hover:text-filamento"
                    >
                      <SocialIcon name="whatsapp" className="h-[18px] w-[18px] text-[#25D366]" />
                      {formatPhone(number)}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-white/55">[WHATSAPP OFICIAL]</li>
              )}
              {contact.hours && <li className="text-white/65">{contact.hours}</li>}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white/55">Ubicación</h2>
            <address className="mt-4 flex gap-2.5 text-[15px] not-italic leading-relaxed text-white/85">
              <SocialIcon name="pin" className="mt-[3px] h-[18px] w-[18px] text-filamento" />
              <span>
                {location.address}
                <br />
                {location.district}, {location.province}
                <br />
                {location.region}, {location.country}
              </span>
            </address>
            <div className="mt-6 flex flex-wrap gap-3 text-[15px]">
              {socials.length > 0 ? (
                socials.map((key) => (
                  <a
                    key={key}
                    href={social[key] as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${socialLabels[key]} de ${settings.shortName}`}
                    title={socialLabels[key]}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-filamento hover:bg-filamento hover:text-noche"
                  >
                    <SocialIcon name={key} />
                  </a>
                ))
              ) : (
                <span className="text-white/55">[REDES SOCIALES OFICIALES]</span>
              )}
            </div>
          </div>
        </div>

        {footerConfig.links.length > 0 && (
          <nav aria-label="Enlaces de interés" className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.12] pt-8 text-[14px]">
            {footerConfig.links.map((item) =>
              /^https?:\/\//.test(item.href) ? (
                <a key={item.href + item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/80 transition-colors hover:text-filamento">
                  {item.label}
                </a>
              ) : (
                <Link key={item.href + item.label} href={item.href} className="text-white/80 transition-colors hover:text-filamento">
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        )}

        <p className="mt-14 text-[13px] text-white/50">
          © {new Date().getFullYear()} {settings.name}. Todos los derechos reservados.
        </p>
        {footerConfig.legalText && <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-white/50">{footerConfig.legalText}</p>}
        {(legal.resolution || legal.modularCode || settings.showDraftBadges) && (
          <p className="mt-2 text-[13px] text-white/50">
            {legal.resolution ?? "[RESOLUCIÓN DE FUNCIONAMIENTO – UGEL]"} · Código modular {legal.modularCode ?? "[CÓDIGO MODULAR]"}
          </p>
        )}
      </div>

      {/* Marca de agua tipográfica */}
      {footerConfig.showWatermark && (
        <p aria-hidden="true" className="pointer-events-none select-none whitespace-nowrap px-2 text-center font-display text-[17.5vw] font-extrabold uppercase leading-[0.78] tracking-[-0.04em] text-white/[0.055]">
          {settings.shortName}
        </p>
      )}
    </footer>
  );
}
