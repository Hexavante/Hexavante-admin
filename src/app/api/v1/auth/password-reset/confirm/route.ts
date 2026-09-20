import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { mapZodErrors } from "@/lib/api-zod";
import { resetPasswordSchema } from "@/lib/validations/profile";
import { resetPasswordWithToken } from "@/services/password-reset.service";

export const POST = withApiErrorHandling(async (req) => {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        fieldErrors: mapZodErrors(parsed.error),
        error: "Corrija os campos destacados.",
      },
      { status: 422 },
    );
  }

  try {
    await resetPasswordWithToken(parsed.data.token, parsed.data.password);
    return NextResponse.json({
      success: true,
      message: "Senha redefinida com sucesso! Você já pode entrar.",
    });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
