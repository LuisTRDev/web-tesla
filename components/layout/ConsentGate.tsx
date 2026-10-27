"use client";

import { useEffect, useState, type ReactNode } from "react";
import { settings } from "@/data/settings";

export const CONSENT_KEY = "tesla-consent";

/** Muestra a sus hijos (Google Analytics) solo si el aviso de privacidad está apagado o la persona aceptó. */
export default function ConsentGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(!settings.privacy.enabled);
  useEffect(() => {
    if (!settings.privacy.enabled) return;
    const read = () => {
      try {
        setOk(localStorage.getItem(CONSENT_KEY) === "all");
      } catch {
        setOk(false);
      }
    };
    read();
    window.addEventListener("tesla-consent", read);
    return () => window.removeEventListener("tesla-consent", read);
  }, []);
  return ok ? <>{children}</> : null;
}
