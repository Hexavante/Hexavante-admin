"use server";

import { auth } from "@/auth";
import {
  AuthRequiredError,
  requireModeratorAccount,
} from "@/lib/moderation/guards";
import { isInstructor } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { courseModerationSchema, instructorApplicationSchema } from "@/lib/validations/moderation";
import {
  moderateCourse,
  reviewInstructorApplication,
  setCoursePublished,
  submitCourseForReview,
  submitInstructorApplication,
} from "@/services/moderation.service";
import {
  deleteCourseByModerator,
  deleteExamByModerator,
} from "@/services/content-moderation.service";
import { writeModerationLog } from "@/services/moderation-admin.service";
import { setExamPublished } from "@/services/exam-admin.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionResult = { success: boolean; error?: string; message?: string };

/** Guarda para actions invocadas via <form action>: sessão expirada → login. */
async function requireModeratorOrRedirect() {
  try {
    return await requireModeratorAccount();
  } catch (error) {
    if (error instanceof AuthRequiredError) redirect("/admin-login");
    throw error;
  }
}

/** Guarda para actions com try/catch próprio (erro vira ActionResult). */
async function requireModerator() {
  return requireModeratorAccount();
}

export async function applyInstructorAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Faça login para continuar." };
  }

  if (isInstructor(session.user.roles)) {
    return { success: false, error: "Você já é instrutor." };
  }

  const parsed = instructorApplicationSchema.safeParse({
    motivation: formData.get("motivation"),
    experience: formData.get("experience"),
    portfolioUrl: formData.get("portfolioUrl") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await submitInstructorApplication(session.user.id, parsed.data);
    revalidatePath("/instructor/apply");
    revalidatePath("/instructor/courses");
    return { success: true, message: "Solicitação enviada! Aguarde a análise de um moderador." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao enviar solicitação",
    };
  }
}

export async function approveInstructorAction(applicationId: string) {
  const moderator = await requireModeratorOrRedirect();
  try {
    await reviewInstructorApplication(applicationId, moderator.id, true);
  } catch (error) {
    // Ex.: candidatura já analisada em outra aba. Loga e segue — voltar para a
    // lista sem derrubar a página evita o loop de error boundary no reenvio.
    console.error("[approveInstructorAction]", error);
  }
  revalidatePath("/moderacao");
  revalidatePath("/admin/instrutores");
}

export async function rejectInstructorAction(
  applicationId: string,
  reviewNotes: string,
): Promise<ActionResult> {
  try {
    const moderator = await requireModerator();
    if (!reviewNotes.trim() || reviewNotes.trim().length < 5) {
      return { success: false, error: "Informe o motivo da rejeição (mín. 5 caracteres)." };
    }
    await reviewInstructorApplication(applicationId, moderator.id, false, reviewNotes.trim());
    revalidatePath("/moderacao");
    revalidatePath("/admin/instrutores");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao rejeitar solicitação",
    };
  }
}

export async function moderateCourseAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  let moderator;
  try {
    moderator = await requireModerator();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Sem permissão" };
  }

  const parsed = courseModerationSchema.safeParse({
    courseId: formData.get("courseId"),
    status: formData.get("status"),
    reviewNotes: formData.get("reviewNotes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await moderateCourse(moderator.id, parsed.data);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao moderar curso",
    };
  }

  revalidatePath("/moderacao");
  revalidatePath("/admin/cursos");
  revalidatePath("/admin/conteudo");
  revalidatePath("/courses");

  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/moderacao")) {
    redirect(returnTo);
  }

  redirect(`/admin/cursos/${parsed.data.courseId}`);
}

export async function toggleCoursePublishAction(courseId: string): Promise<ActionResult> {
  try {
    const moderator = await requireModerator();
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { status: true },
    });
    if (!course) return { success: false, error: "Curso não encontrado." };

    const publish = course.status !== "APPROVED";
    await setCoursePublished(courseId, moderator.id, publish);

    revalidatePath("/admin/conteudo");
    revalidatePath("/admin/cursos");
    revalidatePath("/courses");
    return { success: true, message: publish ? "Curso publicado." : "Curso despublicado." };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar curso.",
    };
  }
}

export async function toggleExamPublishAction(examId: string): Promise<ActionResult> {
  try {
    await requireModerator();
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: { isPublished: true },
    });
    if (!exam) return { success: false, error: "Simulado não encontrado." };

    await setExamPublished(examId, !exam.isPublished);

    revalidatePath("/admin/conteudo");
    revalidatePath("/admin/simulados");
    revalidatePath("/simulados");
    return {
      success: true,
      message: !exam.isPublished ? "Simulado publicado." : "Simulado despublicado.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao atualizar simulado.",
    };
  }
}

export async function resubmitCourseAction(courseId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || !isInstructor(session.user.roles)) {
      return { success: false, error: "Sem permissão." };
    }

    await submitCourseForReview(courseId, session.user.id);
    revalidatePath(`/instructor/courses/${courseId}/edit`);
    revalidatePath("/instructor/courses");
    revalidatePath("/admin/cursos");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao reenviar curso para revisão",
    };
  }
}

function revalidateCoursePaths() {
  revalidatePath("/admin/conteudo");
  revalidatePath("/admin/cursos");
  revalidatePath("/courses");
  revalidatePath("/instructor/courses");
}

function revalidateExamPaths() {
  revalidatePath("/admin/conteudo");
  revalidatePath("/admin/simulados");
  revalidatePath("/simulados");
}

export async function deleteCourseModeratorAction(courseId: string) {
  const moderator = await requireModeratorOrRedirect();
  await deleteCourseByModerator(courseId, moderator.id);
  revalidateCoursePaths();
  redirect("/admin/conteudo");
}

export async function deleteExamModeratorAction(examId: string) {
  const moderator = await requireModeratorOrRedirect();
  await deleteExamByModerator(examId, moderator.id);
  revalidateExamPaths();
  redirect("/admin/simulados");
}

export async function toggleTutorialPublishAction(tutorialId: string) {
  const moderator = await requireModeratorOrRedirect();
  const tutorial = await prisma.tutorial.findUnique({
    where: { id: tutorialId },
    select: { isPublished: true, title: true },
  });
  if (!tutorial) redirect("/admin/tutorials");

  const publish = !tutorial.isPublished;
  await prisma.tutorial.update({
    where: { id: tutorialId },
    data: { isPublished: publish },
  });
  await writeModerationLog({
    moderatorId: moderator.id,
    action: "OTHER",
    description: `${publish ? "Publicou" : "Despublicou"} tutorial "${tutorial.title}"`,
    metadata: { tutorialId },
  });

  revalidatePath("/admin/tutorials");
  revalidatePath("/admin/conteudo");
  revalidatePath("/tutorials");
}

export async function deleteTutorialModeratorAction(tutorialId: string) {
  const moderator = await requireModeratorOrRedirect();
  const tutorial = await prisma.tutorial.findUnique({ where: { id: tutorialId } });
  if (!tutorial) redirect("/admin/tutorials");

  await prisma.tutorial.delete({ where: { id: tutorialId } });
  await prisma.moderationLog.create({
    data: {
      moderatorId: moderator.id,
      targetUserId: tutorial.authorId,
      action: "OTHER",
      description: `Excluiu tutorial "${tutorial.title}" via moderação`,
      metadata: { tutorialId },
    },
  });

  revalidatePath("/admin/tutorials");
  revalidatePath("/admin/conteudo");
  revalidatePath("/tutorials");
  redirect("/admin/tutorials");
}
