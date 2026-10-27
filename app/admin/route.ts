/**
 * PANEL DE EDICIÓN (/admin)
 * Página mínima que carga Decap CMS. La configuración está en public/admin/config.yml y las
 * vistas previas en public/admin/previews.js. No se indexa en buscadores (cabecera y robots.txt).
 * Se abre desde el pie de página con 5 clics seguidos sobre el logo (components/ui/SecretAdminTrigger.tsx).
 */
export const dynamic = "force-static";

const DECAP_VERSION = "3.16.3";

const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" href="/icon.png" />
    <title>Panel de edición · Nikola Tesla</title>
    <link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />
    <link rel="stylesheet" href="/admin/admin-theme.css" />
    <link rel="stylesheet" href="/admin/admin-ux.css" />
    <link rel="stylesheet" href="/admin/guide.css" />
    <link rel="stylesheet" href="/admin/mobile.css" />
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@${DECAP_VERSION}/dist/decap-cms.js"></script>
    <script src="/admin/panel-config.js"></script>
    <script src="/admin/previews.js"></script>
    <script src="/admin/secciones.js"></script>
    <script src="/admin/panel-ui.js"></script>
    <script src="/admin/tutoriales.js"></script>
    <script src="/admin/panel-ux.js"></script>
    <script src="/admin/panel-guide.js"></script>
    <script src="/admin/photo-optimizer.js"></script>
    <script src="/admin/tour.js"></script>
    <script src="/admin/es-fixes.js"></script>
    <script src="/admin/mobile.js"></script>
    <script src="/admin/preview-device.js"></script>
    <script src="/admin/panel-errors.js"></script>
  </body>
</html>
`;

export function GET() {
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}
