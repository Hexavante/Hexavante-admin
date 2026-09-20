import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { signApiToken } from "@/lib/api-auth";
import { validateCredentials } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.email("E-mail inválido").transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1, "Informe a senha"),
});

export const POST = withApiErrorHandling(async (req: Request) => {
  const body = await req.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? "Dados inválidos");
  }

  const user = await validateCredentials(result.data);
  if (!user) {
    throw new ApiError(401, "Credenciais inválidas");
  }

  const token = await signApiToken(user.id, user.roles);

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      roles: user.roles,
    },
  });
});
