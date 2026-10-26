import Reveal from "@/components/ui/Reveal";
import { cn, formatDate } from "@/lib/utils";
import type { SchoolDocument } from "@/types";

const labels: Record<string, string> = { pdf: "PDF", doc: "Word", docx: "Word", xls: "Excel", xlsx: "Excel", ppt: "PowerPoint", pptx: "PowerPoint", jpg: "Imagen", jpeg: "Imagen", png: "Imagen", zip: "ZIP" };

function DocumentCard({ item, tone }: { item: SchoolDocument; tone: "light" | "dark" }) {
  const dark = tone === "dark";
  const kind = labels[item.extension] ?? (item.extension ? item.extension.toUpperCase() : "Archivo");
  const external = /^https?:\/\//i.test(item.file);

  return (
    <a
      href={item.file}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}
      data-spark
      className={cn(
        "group flex h-full gap-4 rounded-panel p-5 transition-transform duration-300 hover:-translate-y-1 md:p-6",
        dark ? "bg-white/[0.06] ring-1 ring-white/15 hover:ring-filamento" : "bg-white ring-1 ring-noche/10 hover:ring-noche/40",
      )}
    >
      <span aria-hidden="true" className={cn("flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-[11px] font-extrabold uppercase", dark ? "bg-filamento text-noche" : "bg-noche text-white")}>
        <svg viewBox="0 0 24 24" className="mb-0.5 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {item.extension.slice(0, 4) || "—"}
      </span>
      <span className="min-w-0">
        <span className={cn("block text-[12px] font-semibold uppercase tracking-[0.08em]", dark ? "text-white/60" : "text-niebla")}>{item.category}</span>
        <span className={cn("mt-1 block font-display text-lg font-bold leading-snug", dark ? "text-white" : "text-noche")}>{item.title}</span>
        {item.description && <span className={cn("mt-1.5 block text-[15px] leading-relaxed", dark ? "text-white/75" : "text-niebla")}>{item.description}</span>}
        <span className={cn("mt-3 block text-[13px]", dark ? "text-white/60" : "text-niebla")}>
          {kind}
          {item.sizeLabel ? ` · ${item.sizeLabel}` : ""}
          {item.date ? ` · ${formatDate(item.date)}` : ""}
        </span>
      </span>
    </a>
  );
}

/**
 * DOCUMENTOS PARA DESCARGAR (reglamento, lista de útiles, ficha de inscripción…).
 * Agrupa por categoría. Los documentos cuyo archivo no existe no se muestran (el panel lo avisa en Inicio).
 * Si no hay ninguno, no se muestra nada.
 */
export default function Documents({
  items,
  title = "Documentos para descargar.",
  tone = "light",
  showTitle = true,
  limit,
}: {
  items: SchoolDocument[];
  title?: string;
  tone?: "light" | "dark";
  showTitle?: boolean;
  limit?: number;
}) {
  const available = items.filter((item) => item.fileExists);
  if (available.length === 0) return null;
  const shown = typeof limit === "number" ? available.slice(0, limit) : available;
  const dark = tone === "dark";
  const categories = Array.from(new Set(shown.map((item) => item.category)));

  return (
    <section id="documentos" aria-labelledby="documentos-titulo" className={cn("py-20 md:py-28", dark ? "bg-marino text-white" : "bg-white")}>
      <div className="mx-auto max-w-site px-5 md:px-10">
        {showTitle && (
          <Reveal className="mb-10 md:mb-14">
            <h2 id="documentos-titulo" className={cn("max-w-[18ch] text-balance font-display text-[clamp(2rem,4.5vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.03em]", dark ? "text-white" : "text-noche")}>
              {title}
            </h2>
          </Reveal>
        )}
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category}>
              {categories.length > 1 && <h3 className={cn("mb-4 text-sm font-semibold uppercase tracking-[0.1em]", dark ? "text-white/60" : "text-niebla")}>{category}</h3>}
              <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shown
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <li key={item.id}>
                      <DocumentCard item={item} tone={tone} />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
