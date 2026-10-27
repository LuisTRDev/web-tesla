import type { ReactNode } from "react";

/**
 * Lector mínimo de texto con formato para las noticias (lo que escribe el editor del panel):
 * **negrita**, *cursiva*, [texto](enlace), listas con "- " o "1. ", títulos con "## " y citas con "> ".
 * No acepta HTML: todo se escapa, y solo se permiten enlaces https, mailto, tel o internos.
 */
const safe = (url: string): string | null => (/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(url.trim()) ? url.trim() : null);

function inline(source: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let n = 0;
  while ((match = re.exec(source))) {
    if (match.index > last) out.push(source.slice(last, match.index));
    const key = `${keyBase}-${n++}`;
    if (match[1]) out.push(<strong key={key} className="font-semibold text-noche">{match[1]}</strong>);
    else if (match[2]) out.push(<em key={key}>{match[2]}</em>);
    else {
      const href = safe(match[4]);
      out.push(
        href ? (
          <a key={key} href={href} {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-semibold text-rojo-700 underline underline-offset-4 hover:text-noche">
            {match[3]}
          </a>
        ) : (
          match[3]
        ),
      );
    }
    last = match.index + match[0].length;
  }
  if (last < source.length) out.push(source.slice(last));
  return out;
}

export default function Markdown({ text }: { text: string }) {
  const blocks = String(text || "").replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const key = `b${i}`;
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={key} className="mt-6 list-disc space-y-2 pl-6 text-lg leading-[1.7] text-tinta/85">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""), `${key}-${j}`)}</li>)}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={key} className="mt-6 list-decimal space-y-2 pl-6 text-lg leading-[1.7] text-tinta/85">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""), `${key}-${j}`)}</li>)}
            </ol>
          );
        }
        const heading = block.match(/^(#{1,4})\s+(.+)$/);
        if (heading) return <h2 key={key} className="mt-10 text-balance font-display text-3xl font-bold leading-tight text-noche">{inline(heading[2], key)}</h2>;
        if (lines.every((l) => /^>\s?/.test(l))) {
          return (
            <blockquote key={key} className="mt-6 border-l-4 border-filamento pl-5 text-xl italic leading-relaxed text-noche">
              {inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), key)}
            </blockquote>
          );
        }
        return (
          <p key={key} className="mt-6 text-lg leading-[1.75] text-tinta/85">
            {lines.map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {inline(l, `${key}-${j}`)}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}
