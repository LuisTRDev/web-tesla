import { qrRedirect } from "@/lib/qr-redirect";

export const dynamic = "force-dynamic";

export function GET(request: Request, { params }: { params: { canal: string } }) {
  return qrRedirect(request, params.canal);
}
