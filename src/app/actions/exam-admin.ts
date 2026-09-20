"use server";

import { auth } from "@/auth";
import { canModerate } from "@/lib/permissions";
import { parseAlternativesFromFormData } from "@/lib/exam-alternatives";
import { examAdminSchema, examQuestionSchema } from "@/lib/validations/exam";
import { prisma } from "@/lib/prisma";
import { deleteExamByModerator } from "@/services/content-moderation.service";
import {
  addExamQuestion,
  createExam,
  deleteExamQuestion,
  updateExam,
} from "@/services/exam-admin.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResult = { success: boolean; error?: string };

async function requireModerator() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Faça login para continuar.");
  }
  if (!canModerate(session.user.roles)) {
    throw new Error("Acesso restrito a moderadores.");
  }
  return session.user;
}

export async function createExamAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireModerator();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sem permissão",
    };
  }

  const parsed = examAdminSchema.safeParse({
    title: formData.get("title"),
    examType: formData.get("examType"),
    description: formData.get("description") || undefined,
    coverImage: formData.get("coverImage") || undefined,
    removeCover: formData.get("removeCover") || "false",
    timeLimit: formData.get("timeLimit") || undefined,
    isPublished: formData.get("isPublished") || "false",
    isPremiumOnly: formData.get("isPremiumOnly") || "false",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const exam = await createExam({
    ...parsed.data,
    coverImage: parsed.data.removeCover ? undefined : parsed.data.coverImage,
  });
  revalidatePath("/admin/simulados");
  revalidatePath("/simulados");
  redirect(`/admin/simulados/${exam.id}/edit`);
}

export async function updateExamAction(
  examId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireModerator();
    const parsed = examAdminSchema.safeParse({
      title: formData.get("title"),
      examType: formData.get("examType"),
      description: formData.get("description") || undefined,
      coverImage: formData.get("coverImage") || undefined,
      removeCover: formData.get("removeCover") || "false",
      timeLimit: formData.get("timeLimit") || undefined,
      isPublished: formData.get("isPublished") || "false",
      isPremiumOnly: formData.get("isPremiumOnly") || "false",
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
    }

    if (parsed.data.isPublished) {
      const questionCount = await prisma.examQuestion.count({ where: { examId } });
      if (questionCount === 0) {
        return {
          success: false,
          error: "Adicione ao menos uma questão antes de publicar o simulado.",
        };
      }
    }

    await updateExam(examId, {
      ...parsed.data,
      coverImage: parsed.data.removeCover ? undefined : parsed.data.coverImage,
    });
    revalidatePath("/admin/simulados");
    revalidatePath(`/admin/simulados/${examId}/edit`);
    revalidatePath("/simulados");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar simulado",
    };
  }
}

export async function addExamQuestionAction(
  examId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await requireModerator();
    const type = formData.get("type") === "ESSAY" ? "ESSAY" : "MULTIPLE_CHOICE";

    const parsed = examQuestionSchema.safeParse(
      type === "ESSAY"
      ? {
          type: "ESSAY",
          statement: formData.get("statement"),
          imageUrl: formData.get("imageUrl") || undefined,
          imageWidth: formData.get("imageWidth") || undefined,
          imageHeight: formData.get("imageHeight") || undefined,
          imageDisplaySize: formData.get("imageDisplaySize") || "MEDIUM",
          orderNumber: formData.get("orderNumber"),
          expectedAnswer: formData.get("expectedAnswer"),
          subject: formData.get("subject") || undefined,
          explanation: formData.get("explanation") || undefined,
          points: formData.get("points") || undefined,
          difficulty: formData.get("difficulty") || undefined,
        }
      : {
          type: "MULTIPLE_CHOICE",
          statement: formData.get("statement"),
          imageUrl: formData.get("imageUrl") || undefined,
          imageWidth: formData.get("imageWidth") || undefined,
          imageHeight: formData.get("imageHeight") || undefined,
          imageDisplaySize: formData.get("imageDisplaySize") || "MEDIUM",
          orderNumber: formData.get("orderNumber"),
          alternatives: parseAlternativesFromFormData(formData),
          correctAlternative: formData.get("correctAlternative"),
          subject: formData.get("subject") || undefined,
          explanation: formData.get("explanation") || undefined,
          points: formData.get("points") || undefined,
          difficulty: formData.get("difficulty") || undefined,
        },
    );

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
    }

    await addExamQuestion(examId, parsed.data);
    revalidatePath(`/admin/simulados/${examId}/edit`);
    revalidatePath("/simulados");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao adicionar questão",
    };
  }
}

export async function deleteExamQuestionAction(examId: string, questionId: string) {
  await requireModerator();
  await deleteExamQuestion(questionId);
  revalidatePath(`/admin/simulados/${examId}/edit`);
  revalidatePath("/simulados");
}

export async function deleteExamAction(examId: string) {
  const user = await requireModerator();
  await deleteExamByModerator(examId, user.id);
  revalidatePath("/admin/simulados");
  revalidatePath("/admin/conteudo");
  revalidatePath("/simulados");
  redirect("/admin/simulados");
}

export async function deleteExamByIdAction(examId: string): Promise<ActionResult> {
  try {
    const user = await requireModerator();
    await deleteExamByModerator(examId, user.id);
    revalidatePath("/admin/simulados");
    revalidatePath("/admin/conteudo");
    revalidatePath("/simulados");
    revalidatePath("/instructor/gerenciar");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao excluir simulado",
    };
  }
}
