import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { listCategories } from "@/services/course.service";

export const GET = withApiErrorHandling(async () => {
  const categories = await listCategories();
  return NextResponse.json({
    categories: categories.map((c) => ({ id: c.id, name: c.name, description: c.description })),
  });
});
