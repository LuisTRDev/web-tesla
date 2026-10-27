"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { navModules, themeForPath } from "@/data/modules";
import { extraLinks, menuCta, navLinks } from "@/data/navigation";
import { settings } from "@/data/settings";
import { cn } from "@/lib/utils";
import { palette } from "@/data/appearance";

const isCurrent = (href: string, pathname: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

/**
 * Barra de navegación.
 * - Sobre la cabecera de cada módulo: transparente, con texto claro u oscuro según su color.
 * - Al bajar: barra translúcida oscura con desenfoque.
 * - La sección actual se marca con el acento de su módulo.
 * - Escritorio ancho: enlaces en línea. Resto: menú a pantalla completa con los módulos numerados.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const theme = themeForPath(pathname);
  const onLight = theme.tone === "light" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Al cambiar de sección se cierra el menú.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "nav-in fixed inset-x-0 top-[var(--bar-h,0px)] z-50 transition-[background-color,box-shadow,backdrop-filter,color] duration-500",
          onLight ? "text-noche" : "text-white",
          scrolled || open ? "bg-noche/85 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-site items-center justify-between gap-6 px-5 md:px-10">
          <Link href="/" aria-label={`${settings.shortName} ${settings.kicker}, ir al inicio`}>
            <Logo />
          </Link>

          <nav aria-label="Principal" className="hidden xl:block">
            <ul className="flex items-center gap-5 text-[14px] font-medium">
              {navLinks.map((link) => {
                const current = isCurrent(link.href, pathname);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "relative py-2 transition-opacity hover:opacity-100",
                        current ? "font-semibold opacity-100" : "opacity-75",
                      )}
                    >
                      {link.label}
                      {current && (
                        <span aria-hidden="true" className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full" style={{ background: scrolled ? palette.filamento : theme.accent }} />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {menuCta.show && (
            <Link
              href={menuCta.href}
              className={cn(
                "hidden min-h-[42px] items-center rounded-full px-5 text-[14px] font-semibold transition-colors sm:inline-flex",
                onLight ? "bg-noche text-white hover:bg-noche-600" : "bg-filamento text-noche hover:bg-white",
              )}
            >
              {menuCta.label}
            </Link>
            )}
            <button
              type="button"
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((value) => !value)}
              className={cn("relative flex h-11 w-11 items-center justify-center rounded-full border xl:hidden", onLight ? "border-noche/30" : "border-white/25")}
            >
              <span className={cn("absolute h-[2px] w-5 bg-current transition-transform duration-300", open ? "rotate-45" : "-translate-y-[4px]")} />
              <span className={cn("absolute h-[2px] w-5 bg-current transition-transform duration-300", open ? "-rotate-45" : "translate-y-[4px]")} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="fixed inset-0 z-40 overflow-y-auto bg-noche text-white xl:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "circle(0% at 92% 36px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "circle(150% at 92% 36px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "circle(0% at 92% 36px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Menú móvil" className="flex min-h-full flex-col px-5 pb-10 pt-[104px] md:px-10">
              <ul className="flex-1">
                {[{ id: "inicio", number: "00", label: "Inicio", href: "/", accent: palette.filamento }, ...navModules.map((module) => ({ ...module, accent: module.theme.accent })), ...extraLinks.map((link, position) => ({ id: `extra-${position}`, number: "+", label: link.label, href: link.href, accent: palette.arco }))].map(
                  (item, index) => {
                    const current = isCurrent(item.href, pathname);
                    return (
                      <motion.li
                        key={item.href}
                        initial={reduce ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + index * 0.045, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="border-b border-white/10"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={current ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-4 py-4 font-display text-[clamp(1.6rem,6.5vw,2.4rem)] font-bold leading-none tracking-[-0.02em]",
                            !current && "text-white/80",
                          )}
                        >
                          <span className="w-8 text-sm font-semibold tabular-nums text-white/45">{item.number}</span>
                          <span
                            aria-hidden="true"
                            className="h-3 w-3 shrink-0 rounded-full"
                            // Los acentos oscuros (admisión) no se ven sobre el fondo del menú: se usa el amarillo.
                            style={{ background: item.accent === palette.noche ? palette.filamento : item.accent }}
                          />
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  },
                )}
              </ul>
              <div className="mt-8">
                {menuCta.show && (
                  <Link
                    href={menuCta.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[54px] items-center justify-center rounded-full bg-filamento text-base font-semibold text-noche"
                  >
                    {menuCta.label}
                  </Link>
                )}
                <p className="mt-6 text-sm text-white/60">
                  {settings.location.address}, {settings.location.district}, {settings.location.province}
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
