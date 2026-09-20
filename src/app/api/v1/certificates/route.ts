import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getUserCertificates, issueCertificate } from "@/services/certificate.service";

const issueSchema = z.object({
  courseId: z.string().min(1, "Curso inválido"),
});

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);
  const certificates = await getUserCertificates(userId);

  return NextResponse.json({
    certificates: certificates.map((cert) => ({
      id: cert.id,
      code: cert.code,
      issuedAt: cert.issuedAt.toISOString(),
      course: {
        title: cert.course.title,
        categoryName: cert.course.category.name,
      },
      user: cert.user,
    })),
  });
});

export const POST = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = issueSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  try {
    const certificate = await issueCertificate(userId, parsed.data.courseId);
    return NextResponse.json(
      {
        success: true,
        certificate: {
          id: certificate.id,
          code: certificate.code,
          issuedAt: certificate.issuedAt.toISOString(),
          courseTitle: certificate.course.title,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
