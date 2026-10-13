import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-noche text-white">
      <div className="mx-auto w-full max-w-site px-5 pb-20 pt-40 md:px-10">
        <h1 className="font-display text-[clamp(2.6rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
          Esta página no existe.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/75">
          Puede que el enlace haya cambiado. Vuelve al inicio y sigue explorando.
        </p>
        <ButtonLink href="/" className="mt-10">
          Volver al inicio
        </ButtonLink>
      </div>
    </section>
  );
}
