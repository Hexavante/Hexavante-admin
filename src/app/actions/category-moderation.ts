"use server";

import { auth } from "@/auth";
import { canModerate } from "@/lib/permissions";
import { approveCategory, rejectCategory } from "@/services/course.service";
import { revalidatePath } from "next/cache";

async function requireModerator() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Faça login para continuar.");
  if (!canModerate(session.user.roles)) throw new Error("Acesso restrito a moderadores.");
}

export async function approveCategoryAction(categoryId: string) {
  await requireModerator();
  await approveCategory(categoryId);
  revalidatePath("/admin/categorias");
  revalidatePath("/instructor/courses/new");
  revalidatePath("/instructor/courses");
}

export async function rejectCategoryAction(categoryId: string) {
  await requireModerator();
  await rejectCategory(categoryId);
  revalidatePath("/admin/categorias");
}
