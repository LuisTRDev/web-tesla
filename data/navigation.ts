import { modules } from "@/data/modules";
import type { NavLink } from "@/types";

/** Menú principal: la portada y luego cada módulo, en el orden de data/modules.ts. */
export const navLinks: NavLink[] = [{ label: "Inicio", href: "/" }, ...modules.map((module) => ({ label: module.label, href: module.href }))];
