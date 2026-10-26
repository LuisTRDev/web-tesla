import { getPending } from "@/lib/pending";

/** Lista de pendientes para el panel (/admin → Inicio). Se calcula al construir la web. */
export const dynamic = "force-static";

export function GET() {
  return Response.json(getPending(), { headers: { "x-robots-tag": "noindex, nofollow", "cache-control": "no-store" } });
}
