import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { mapZodErrors } from "@/lib/api-zod";
import { getAuthBaseUrl } from "@/lib/auth-env";
import { extractClientIp, rateLimitAuthAction } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/validations/profile";
import { createPasswordResetToken } from "@/services/password-reset.service";

export const POST = withApiErrorHandling(async (req) => {
  const ip = extractClientIp(
    req.headers.get("x-forwarded-for"),
    req.headers.get("x-real-ip"),
  );
  if (!rateLimitAuthAction(ip)) {
    throw new ApiError(429, "Muitas tentativas. Tente novamente em alguns minutos.");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        fieldErrors: mapZodErrors(parsed.error),
        error: parsed.error.issues[0]?.message ?? "E-mail inválido",
      },
      { status: 422 },
    );
  }

  const token = await createPasswordResetToken(parsed.data.email);
  const baseUrl = getAuthBaseUrl();

  if (token && process.env.NODE_ENV === "development") {
    return NextResponse.json({
      success: true,
      message:
        "Se o e-mail estiver cadastrado, você receberá instruções. Em desenvolvimento, use o link abaixo:",
      devResetUrl: `${baseUrl}/redefinir-senha?token=${token}`,
    });
  }

  return NextResponse.json({
    success: true,
    message: "Se o e-mail estiver cadastrado com senha, enviaremos instruções para redefinição.",
  });
});
