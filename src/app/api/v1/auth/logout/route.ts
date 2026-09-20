import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";

/** JWT stateless — logout é responsabilidade do cliente descartar o token. */
export const POST = withApiErrorHandling(async (req: Request) => {
  await requireBearerAuth(req);
  return NextResponse.json({ success: true });
});
