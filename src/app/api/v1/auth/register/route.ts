import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { signApiToken } from "@/lib/api-auth";
import { registerUser } from "@/services/auth.service";
import { registerSchema } from "@/lib/validations/auth";

export const POST = withApiErrorHandling(async (req: Request) => {
  const body = await req.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? "Dados inválidos");
  }

  try {
    const user = await registerUser(result.data);
    const token = await signApiToken(user.id, ["USER"]);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          username: user.username,
          roles: ["USER"],
        },
      },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      throw new ApiError(409, "E-mail ou nome de usuário já está em uso");
    }
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
