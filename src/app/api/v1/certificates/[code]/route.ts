import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { verifyCertificateSchema } from "@/lib/validations/certificate";
import { getCertificateByCode, verifyCertificate } from "@/services/certificate.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const { code } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const verify = searchParams.get("verify") === "1";

  const parsed = verifyCertificateSchema.safeParse({ code });
  if (!parsed.success) {
    throw new ApiError(400, "Código inválido");
  }

  const certificate = verify
    ? await verifyCertificate(parsed.data.code)
    : await getCertificateByCode(parsed.data.code);

  if (!certificate) {
    throw new ApiError(404, "Certificado não encontrado");
  }

  return NextResponse.json({
    certificate: {
      id: certificate.id,
      code: certificate.code,
      issuedAt: certificate.issuedAt.toISOString(),
      verifiedAt: certificate.verifiedAt?.toISOString() ?? null,
      user: certificate.user,
      course: {
        title: certificate.course.title,
        slug: "slug" in certificate.course ? certificate.course.slug : undefined,
        categoryName: certificate.course.category.name,
      },
    },
  });
});
