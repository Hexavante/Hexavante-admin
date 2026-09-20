import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { serializeEnrollment } from "@/lib/api-serialize";
import { listUserEnrollments } from "@/services/student.service";

export const GET = withApiErrorHandling(async (req: Request) => {
  const userId = await requireBearerAuth(req);
  const enrollments = await listUserEnrollments(userId);
  return NextResponse.json({
    enrollments: enrollments.map(serializeEnrollment),
  });
});
