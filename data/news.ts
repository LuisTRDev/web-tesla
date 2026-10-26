import fs from "node:fs";
import path from "node:path";
import type { NewsPost } from "@/types";
import { bool, isoDate, paragraphs, rec, str, text } from "@/lib/content";

/**
 * Noticias y comunicados: un archivo por publicación en content/noticias/.
 * Se crean y editan desde el panel (/admin → Noticias). El nombre del archivo es la dirección (slug).
 * Solo se usa en el servidor (lee archivos).
 */
const dir = path.join(process.cwd(), "content", "noticias");

function readPosts(): NewsPost[] {
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const data = rec(JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")));
        return {
          slug: file.replace(/\.json$/, ""),
          title: str(data.title),
          excerpt: str(data.excerpt),
          body: paragraphs(data.body),
          date: isoDate(data.date),
          category: str(data.category, "Comunicados"),
          image: text(data.image),
          isPlaceholder: bool(data.isPlaceholder),
        };
      });
  } catch {
    return [];
  }
}

export const news: NewsPost[] = readPosts();
