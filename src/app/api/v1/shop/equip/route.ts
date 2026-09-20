import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { equipStoreItem } from "@/services/shop.service";

const equipSchema = z.object({
  inventoryId: z.string().min(1, "Item inválido"),
});

export const POST = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = equipSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  try {
    await equipStoreItem(userId, parsed.data.inventoryId);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
