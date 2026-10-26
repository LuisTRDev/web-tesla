import { qrRedirect } from "@/lib/qr-redirect";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return qrRedirect(request);
}
