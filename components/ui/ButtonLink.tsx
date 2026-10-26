import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "accent" | "dark" | "outline-light" | "outline-dark";

const variants: Record<Variant, string> = {
  accent: "bg-filamento text-noche hover:bg-white",
  dark: "bg-noche text-white hover:bg-noche-600",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white hover:text-noche",
  "outline-dark": "border border-noche/30 text-noche hover:border-noche hover:bg-noche hover:text-white",
};

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

/** Botón-enlace. Detecta enlaces externos y los abre en otra pestaña. */
export default function ButtonLink({ href, children, variant = "accent", className }: ButtonLinkProps) {
  const classes = cn(
    "relative",
    "inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-[15px] font-semibold transition-colors duration-300",
    variants[variant],
    className,
  );
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} data-spark>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} data-spark>
      {children}
    </Link>
  );
}
