import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getStudentHomeData } from "@/services/student.service";

export const GET = withApiErrorHandling(async (req: Request) => {
  const userId = await requireBearerAuth(req);
  const data = await getStudentHomeData(userId);
  return NextResponse.json(data);
});
