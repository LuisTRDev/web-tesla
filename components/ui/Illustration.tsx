import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Ilustraciones de línea (SVG) que ocupan el lugar de una fotografía mientras no llega la real.
 * Se muestran desde <SchoolImage illustration="..."> y desaparecen solas cuando la foto existe.
 * Trazo principal = currentColor; detalle de energía = var(--accent) (el amarillo filamento).
 */
const drawings: Record<string, ReactNode> = {
  academica: (
    <>
      <path d="M80 215 C120 195 170 195 200 215 C230 195 280 195 320 215 V120 C280 100 230 100 200 120 C170 100 120 100 80 120 Z" />
      <path d="M200 120 V215" />
      <path d="M105 140 C130 132 155 134 178 146 M105 165 C130 157 155 159 178 171" />
      <path d="M222 146 C245 134 270 132 295 140 M222 171 C245 159 270 157 295 165" />
      <g className="illo-accent">
        <path d="M200 48 V82 M183 65 H217" />
        <path d="M150 70 V84 M143 77 H157 M250 62 V76 M243 69 H257" />
      </g>
    </>
  ),
  critico: (
    <>
      <path d="M200 75 C157 75 130 108 130 143 C130 168 143 184 157 198 C165 207 168 214 168 222 H232 C232 214 235 207 243 198 C257 184 270 168 270 143 C270 108 243 75 200 75 Z" />
      <path d="M176 238 H224 M184 254 H216" />
      <g className="illo-accent">
        <path d="M178 150 L200 120 L222 150 M200 120 V222" />
        <path d="M200 30 V48 M110 70 L124 84 M290 70 L276 84 M85 140 H103 M297 140 H315" />
      </g>
    </>
  ),
  tecnologia: (
    <>
      <rect x="140" y="90" width="120" height="120" rx="14" />
      <path d="M170 90 V60 M200 90 V60 M230 90 V60 M170 210 V240 M200 210 V240 M230 210 V240 M140 120 H110 M140 150 H110 M140 180 H110 M260 120 H290 M260 150 H290 M260 180 H290" />
      <path d="M110 120 H70 M290 180 H330 M200 60 V35 H250" />
      <g className="illo-accent">
        <rect x="172" y="122" width="56" height="56" rx="8" />
        <path d="M190 150 H210 M200 140 V160" />
        <circle cx="70" cy="120" r="5" />
        <circle cx="330" cy="180" r="5" />
        <circle cx="250" cy="35" r="5" />
      </g>
    </>
  ),
  personal: (
    <>
      <circle cx="190" cy="115" r="38" />
      <path d="M115 245 C115 190 150 168 190 168 C230 168 265 190 265 245" />
      <path d="M160 108 C170 96 195 92 218 104" />
      <g className="illo-accent">
        <path d="M300 92 C292 76 268 82 274 102 C278 114 292 124 300 134 C308 124 322 114 326 102 C332 82 308 76 300 92 Z" />
        <path d="M262 180 C282 176 296 188 300 206" />
      </g>
    </>
  ),
  valores: (
    <>
      <path d="M200 52 L290 84 V155 C290 212 247 242 200 262 C153 242 110 212 110 155 V84 Z" />
      <path d="M200 52 V262 M110 150 H290" opacity=".35" />
      <g className="illo-accent">
        <path d="M156 158 L190 192 L250 122" strokeWidth="5" />
        <path d="M200 20 V34 M120 40 L130 50 M280 40 L270 50" />
      </g>
    </>
  ),
  creatividad: (
    <>
      <path d="M200 60 C120 60 70 110 70 165 C70 220 120 245 165 240 C190 237 185 215 205 215 C225 215 232 240 258 240 C305 240 335 205 330 160 C323 100 275 60 200 60 Z" />
      <circle cx="205" cy="190" r="15" opacity=".5" />
      <g className="illo-accent">
        <circle cx="130" cy="140" r="12" />
        <circle cx="175" cy="105" r="12" />
        <circle cx="235" cy="105" r="12" />
        <circle cx="280" cy="145" r="12" />
        <path d="M335 45 V75 M320 60 H350" />
        <path d="M60 60 V80 M50 70 H70" />
      </g>
    </>
  ),
  ciencia: (
    <>
      <path d="M172 52 H228 M182 52 V132 L118 232 C108 252 120 262 138 262 H262 C280 262 292 252 282 232 L218 132 V52" />
      <g className="illo-accent">
        <path d="M140 222 C170 208 200 236 230 222 C245 215 255 218 266 224" />
        <circle cx="190" cy="196" r="6" />
        <circle cx="212" cy="172" r="5" />
        <circle cx="198" cy="148" r="4" />
        <circle cx="236" cy="104" r="5" />
        <circle cx="250" cy="76" r="4" />
      </g>
    </>
  ),
  arte: (
    <>
      <path d="M160 218 V96 L272 74 V196" />
      <path d="M160 130 L272 108" />
      <ellipse cx="136" cy="222" rx="26" ry="20" />
      <ellipse cx="248" cy="200" rx="26" ry="20" />
      <g className="illo-accent">
        <path d="M70 70 C82 50 104 50 112 68 M300 250 C312 236 330 238 338 252" />
        <path d="M320 70 V96 M307 83 H333" />
      </g>
    </>
  ),
  deportes: (
    <>
      <circle cx="200" cy="150" r="88" />
      <path d="M200 112 L236 138 L222 180 H178 L164 138 Z" />
      <path d="M200 112 V62 M236 138 L284 122 M222 180 L250 222 M178 180 L150 222 M164 138 L116 122" />
      <g className="illo-accent">
        <path d="M52 250 C100 232 130 236 168 262" />
        <path d="M300 40 L316 24 M318 60 L338 54" />
      </g>
    </>
  ),
  proyectos: (
    <>
      <path d="M200 42 C244 84 256 148 238 204 H162 C144 148 156 84 200 42 Z" />
      <path d="M162 170 L124 218 L164 206 M238 170 L276 218 L236 206" />
      <circle cx="200" cy="112" r="20" />
      <g className="illo-accent">
        <path d="M184 222 L200 270 L216 222" />
        <path d="M70 80 V100 M60 90 H80 M326 130 V150 M316 140 H336" />
      </g>
    </>
  ),
  eventos: (
    <>
      <path d="M200 60 L224 128 L296 132 L240 178 L258 248 L200 208 L142 248 L160 178 L104 132 L176 128 Z" />
      <g className="illo-accent">
        <path d="M60 80 L80 100 M90 50 L96 78 M340 70 L322 92 M312 40 L306 66" />
        <circle cx="66" cy="200" r="6" />
        <circle cx="338" cy="196" r="6" />
        <circle cx="300" cy="260" r="4" />
        <circle cx="100" cy="262" r="4" />
      </g>
    </>
  ),
  aulas: (
    <>
      <rect x="80" y="62" width="240" height="150" rx="10" />
      <path d="M62 236 H338 M140 212 V236 M260 212 V236" />
      <path d="M110 190 H150" opacity=".5" />
      <g className="illo-accent">
        <path d="M112 100 H210 M112 130 H264 M112 160 H182" />
        <path d="M236 160 L260 160 L248 142 Z" />
      </g>
    </>
  ),
  recreo: (
    <>
      <circle cx="200" cy="150" r="86" />
      <path d="M168 128 V142 M232 128 V142" strokeWidth="6" />
      <g className="illo-accent">
        <path d="M150 178 C175 222 225 222 250 178" />
        <path d="M70 60 L84 74 M330 60 L316 74 M52 150 H70 M330 150 H348" />
      </g>
    </>
  ),
  docentes: (
    <>
      <path d="M200 112 C168 86 118 108 132 176 C142 218 172 238 200 228 C228 238 258 218 268 176 C282 108 232 86 200 112 Z" />
      <path d="M200 112 C200 92 206 76 222 64" />
      <g className="illo-accent">
        <path d="M222 70 C248 58 268 72 272 88 C250 98 226 94 222 70 Z" />
        <path d="M120 60 V80 M110 70 H130" />
      </g>
    </>
  ),
};

export function hasIllustration(name?: string | null): name is string {
  return !!name && name in drawings;
}

export default function Illustration({ name, tone = "dark", className }: { name: string; tone?: "dark" | "light"; className?: string }) {
  const art = drawings[name];
  if (!art) return null;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden p-6 md:p-8",
        tone === "dark"
          ? "bg-[radial-gradient(circle_at_50%_45%,#2A3373_0%,#141A42_55%,#0D1230_100%)] text-arco"
          : "bg-[radial-gradient(circle_at_50%_45%,#FFFFFF_0%,#E2E5F0_70%,#D3D7E6_100%)] text-noche",
        className,
      )}
      style={{ "--accent": tone === "dark" ? "#FFB627" : "#E89B00" } as CSSProperties}
    >
      {/* Retícula y anillos de fondo */}
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-[0.16]" fill="none" stroke="currentColor">
        {[70, 120, 170, 220].map((radius) => (
          <circle key={radius} cx="200" cy="150" r={radius} strokeWidth="1" />
        ))}
      </svg>
      <svg viewBox="0 0 400 300" className="illo-float relative h-full max-h-full w-full max-w-[520px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {art}
      </svg>
    </div>
  );
}
