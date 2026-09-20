import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { claimSeasonReward } from "@/services/ranking-season.service";

const claimSchema = z.object({
  seasonKey: z.string().min(1, "Temporada inválida"),
});

export const POST = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  try {
    const result = await claimSeasonReward(userId, parsed.data.seasonKey);
    if (!result) {
      throw new ApiError(404, "Recompensa indisponível ou já resgatada");
    }

    return NextResponse.json({
      success: true,
      coins: result.coins,
    });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(500, "Não foi possível resgatar a recompensa");
  }
});
