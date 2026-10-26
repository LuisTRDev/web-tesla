import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Documents from "@/components/sections/Documents";
import ButtonLink from "@/components/ui/ButtonLink";
import ModuleHeader from "@/components/ui/ModuleHeader";
import Reveal from "@/components/ui/Reveal";
import SchoolImage from "@/components/ui/SchoolImage";
import { describeFile } from "@/data/documents";
import { customPageTheme, pageModule } from "@/data/modules";
import { extraPages } from "@/data/pages-extra";
import { getExtraPage } from "@/lib/data";
import { moduleMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import type { ExtraPage } from "@/types";

/**
 * PÁGINAS NUEVAS creadas desde el panel (/admin → Páginas nuevas): /p/<nombre>.
 * Las páginas en borrador no existen para las visitas.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return extraPages.map((page) => ({ slug: page.slug }));
}

const toModule = (page: ExtraPage) =>
  pageModule({
    id: `p/${page.slug}`,
    label: page.title,
    title: page.title,
    intro: page.intro ?? "",
    kicker: page.kicker ?? undefined,
    seoDescription: page.seoDescription || page.intro || "",
    shareImage: page.shareImage ?? page.image ?? undefined,
    motif: "ondas",
    theme: customPageTheme,
  });

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getExtraPage(params.slug);
  return page ? moduleMetadata(toModule(page)) : {};
}

/** Texto con formato sencillo: "## " = subtítulo, líneas con "- " = lista, el resto = párrafo. */
function renderBody(blocks: string[]): ReactNode[] {
  return blocks.map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 1 && lines[0].startsWith("## ")) {
      return (
        <h2 key={index} className="mt-12 font-display text-2xl font-extrabold tracking-[-0.02em] text-noche first:mt-0 md:text-3xl">
          {lines[0].slice(3)}
        </h2>
      );
    }
    if (lines.every((line) => line.startsWith("- "))) {
      return (
        <ul key={index} className="list-disc space-y-2 pl-6 marker:text-rojo">
          {lines.map((line) => (
            <li key={line}>{line.slice(2)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={index}>
        {lines.map((line, position) => (
          <span key={position}>
            {position > 0 && <br />}
            {line.startsWith("## ") ? line.slice(3) : line}
          </span>
        ))}
      </p>
    );
  });
}

export default async function ExtraPageView({ params }: { params: { slug: string } }) {
  const page = await getExtraPage(params.slug);
  if (!page) notFound();

  const files = page.documents.map((entry, index) => ({
    id: `archivo-${index + 1}`,
    title: entry.title,
    description: null,
    category: "Archivos",
    file: entry.file,
    date: null,
    featured: false,
    ...describeFile(entry.file),
  }));

  return (
    <>
      <ModuleHeader module={toModule(page)} />
      <article className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-6 px-5 text-[18px] leading-[1.75] text-tinta md:px-10">
          {page.image && (
            <Reveal>
              <figure className="!mb-10">
                <SchoolImage src={page.image} alt={page.imageCaption ?? page.title} label={page.title} tone="light" className="aspect-[16/9] rounded-panel" sizes="(min-width: 768px) 768px, 100vw" />
                {page.imageCaption && <figcaption className="mt-3 text-sm text-niebla">{page.imageCaption}</figcaption>}
              </figure>
            </Reveal>
          )}
          {renderBody(page.body)}
          {page.buttonText && page.buttonUrl && (
            <p className="pt-4">
              <ButtonLink href={page.buttonUrl}>{page.buttonText}</ButtonLink>
            </p>
          )}
          {page.updated && <p className="pt-6 text-sm text-niebla">Actualizado el {formatDate(page.updated)}</p>}
        </div>
      </article>
      {files.length > 0 && <Documents items={files} showTitle={false} tone="dark" />}
    </>
  );
}
