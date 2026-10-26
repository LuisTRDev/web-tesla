import fs from "node:fs";
import path from "node:path";
import type { ExtraPage } from "@/types";
import { bool, isoDate, link, list, paragraphs, rec, str, text } from "@/lib/content";

/**
 * Páginas nuevas creadas desde el panel (/admin → Páginas nuevas): reglamento, calendario escolar,
 * convivencia, convenios… Un archivo por página en content/paginas/; el nombre del archivo es la dirección:
 * content/paginas/reglamento.json → /p/reglamento. Solo se usa en el servidor (lee archivos).
 */
const dir = path.join(process.cwd(), "content", "paginas");

function readPages(): ExtraPage[] {
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const data = rec(JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")));
        return {
          slug: file.replace(/\.json$/, ""),
          title: str(data.title),
          kicker: text(data.kicker),
          intro: text(data.intro),
          body: paragraphs(data.body),
          image: text(data.image),
          imageCaption: text(data.imageCaption),
          buttonText: text(data.buttonText),
          buttonUrl: link(data.buttonUrl),
          documents: list(data.documents).map((entry) => ({ title: str(entry.title), file: str(entry.file).trim() })).filter((entry) => entry.title && entry.file),
          seoDescription: str(data.seoDescription),
          shareImage: text(data.shareImage),
          published: bool(data.published, true),
          updated: isoDate(data.updated) || null,
        };
      })
      .filter((page) => page.title);
  } catch {
    return [];
  }
}

const all = readPages();

/** Páginas publicadas (las que están en borrador no existen para las visitas ni para Google). */
export const extraPages: ExtraPage[] = all.filter((page) => page.published);
export const allExtraPages: ExtraPage[] = all;
