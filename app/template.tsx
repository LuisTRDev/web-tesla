"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { appearance } from "@/data/appearance";
import { themeForPath } from "@/data/modules";
import { cn } from "@/lib/utils";

// La primera carga no lleva cortina: solo los cambios de sección.
let isFirstLoad = true;

/**
 * Transición entre módulos: al entrar a una sección, una cortina con su color
 * se recoge hacia arriba y deja ver la página. Se remonta en cada navegación.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [withCurtain] = useState(() => !isFirstLoad);

  useEffect(() => {
    isFirstLoad = false;
  }, []);

  return (
    <>
      {withCurtain && !reduce && appearance.effects.pageTransitions && (
        <motion.div
          aria-hidden="true"
          className={cn("pointer-events-none fixed inset-0 z-[60] origin-top", themeForPath(pathname).bg)}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        />
      )}
      {children}
    </>
  );
}
