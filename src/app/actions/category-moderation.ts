"use server";

import {
  AuthRequiredError,
  requireModeratorAccount,
} from "@/lib/moderation/guards";
import { approveCategory, rejectCategory } from "@/services/course.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** Actions invocadas via <form action>: sessão expirada → volta para o login. */
async function requireModerator() {
  try {
    return await requireModeratorAccount();
  } catch (error) {
    if (error instanceof AuthRequiredError) redirect("/admin-login");
    throw error;
  }
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
