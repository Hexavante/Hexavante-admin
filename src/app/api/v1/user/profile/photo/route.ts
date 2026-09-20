import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

const photoSchema = z
  .object({
    avatarUrl: z.string().min(1).optional(),
    base64: z.string().min(1).optional(),
    mimeType: z.string().min(1).optional(),
  })
  .refine((data) => data.avatarUrl || (data.base64 && data.mimeType), {
    message: "Informe avatarUrl ou base64 + mimeType",
  });

function resolveAvatarUrl(input: z.infer<typeof photoSchema>): string | null {
  if (input.avatarUrl) {
    if (!input.avatarUrl.startsWith("data:image/")) return null;
    return input.avatarUrl;
  }

  if (!input.base64 || !input.mimeType) return null;
  if (!ALLOWED_IMAGE_TYPES.has(input.mimeType)) return null;
  return `data:${input.mimeType};base64,${input.base64}`;
}

export const PUT = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = photoSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  const avatarUrl = resolveAvatarUrl(parsed.data);
  if (!avatarUrl) {
    throw new ApiError(400, "Use uma imagem PNG, JPG, GIF ou WebP em base64.");
  }

  const payloadSize = avatarUrl.length;
  if (payloadSize > MAX_AVATAR_SIZE * 1.4) {
    throw new ApiError(400, "A imagem deve ter no máximo 5MB.");
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: { avatarUrl: true, username: true },
    });

    return NextResponse.json({
      success: true,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const isColumnTooSmall =
      message.includes("Data too long") ||
      message.includes("value too long") ||
      message.includes("1406");

    throw new ApiError(
      400,
      isColumnTooSmall
        ? "O banco precisa aceitar fotos maiores. Rode: npm run db:avatar"
        : message || "Erro ao atualizar foto de perfil.",
    );
  }
});
