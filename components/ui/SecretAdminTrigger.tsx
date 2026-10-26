"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

const TAPS = 5;
const WINDOW_MS = 3000;

/**
 * Acceso oculto al panel de edición: pulsar 5 veces seguidas el logo del pie de página
 * (en menos de 3 segundos) abre /admin. No hay botón visible. El panel pide iniciar sesión,
 * así que conocer el gesto no da acceso por sí solo.
 */
export default function SecretAdminTrigger({ children }: { children: ReactNode }) {
  const taps = useRef<number[]>([]);

  const onClick = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((time) => now - time < WINDOW_MS), now];
    if (taps.current.length >= TAPS) {
      taps.current = [];
      window.location.assign("/admin");
    }
  };

  return (
    <div onClick={onClick} className="inline-block select-none">
      {children}
    </div>
  );
}
