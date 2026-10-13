import Link from "next/link";
import type { CSSProperties } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import FieldCanvas from "@/components/ui/FieldCanvas";
import SchoolImage from "@/components/ui/SchoolImage";
import { settings } from "@/data/settings";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/**
 * HERO
 * Capas, de atrás hacia adelante: fotografía (zoom lento de entrada) → velo oscuro →
 * líneas de campo y partículas → tipografía gigante.
 * Para usar video, reemplaza <SchoolImage> por un <video autoPlay muted loop playsInline poster="...">.
 */
export default function Hero() {
  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-noche text-white">
      <SchoolImage
        cover
        priority
        src={settings.images.hero}
        alt="Estudiantes de la Institución Educativa Privada Nikola Tesla"
        label="Fotografía o video principal: estudiantes del colegio"
        sizes="100vw"
        className="-z-30"
        imgClassName="hero-zoom"
        labelClassName="items-start justify-end pt-24 text-right"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-gradient-to-t from-noche via-noche/75 to-noche/35" />
      <FieldCanvas className="absolute inset-0 -z-10 h-full w-full" />

      <div className="mx-auto w-full max-w-site px-5 pb-10 pt-36 md:px-10 md:pb-14">
        {/* Aviso de campaña: lleva directo a Admisión. */}
        <Link
          href="/admision"
          className="hero-in mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-4 text-[14px] font-medium backdrop-blur-sm transition-colors hover:border-filamento hover:bg-white/15 md:mb-10"
          style={delay(0.1)}
        >
          <span className="rounded-full bg-filamento px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-noche">
            Admisión {settings.admissionYear}
          </span>
          Infórmate sobre el proceso
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="font-display">
          <span className="hero-in block text-[15px] font-medium text-white/80 md:text-lg" style={delay(0.25)}>
            {settings.kicker}
          </span>
          <span
            className="hero-in mt-3 block text-[21vw] font-extrabold uppercase leading-[0.8] tracking-[-0.045em] md:mt-4 md:text-[15.5vw] 2xl:text-[15rem]"
            style={delay(0.4)}
          >
            Nikola
          </span>
          <span
            className="hero-in block text-[21vw] font-extrabold uppercase leading-[0.8] tracking-[-0.045em] md:text-[15.5vw] 2xl:text-[15rem]"
            style={delay(0.55)}
          >
            Tesla
          </span>
        </h1>

        <div className="mt-9 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p className="hero-in max-w-[20ch] text-balance font-display text-[clamp(1.5rem,3.2vw,2.6rem)] font-semibold leading-[1.08] tracking-[-0.015em]" style={delay(0.8)}>
            {settings.tagline}
          </p>
          <div className="hero-in flex flex-col gap-3 sm:flex-row" style={delay(0.95)}>
            <ButtonLink href="/propuesta">Conoce nuestra propuesta</ButtonLink>
            <ButtonLink href="/admision" variant="outline-light">
              Admisión {settings.admissionYear}
            </ButtonLink>
          </div>
        </div>

        <p className="hero-in mt-10 border-t border-white/15 pt-5 text-sm text-white/60 md:mt-14" style={delay(1.1)}>
          {settings.location.district}, {settings.location.province}, {settings.location.region}
        </p>
      </div>
    </section>
  );
}
