import { prisma } from "@/lib/prisma";
import { writeModerationLog } from "@/services/moderation-admin.service";

export async function deleteCourseByModerator(courseId: string, moderatorId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      slug: true,
      instructors: { select: { userId: true }, take: 1 },
    },
  });

  if (!course) {
    throw new Error("Curso não encontrado.");
  }

  // Delete + auditoria atômicos: um delete sem log (ou log sem delete)
  // quebrava a rastreabilidade da moderação.
  await prisma.$transaction(async (tx) => {
    await tx.course.delete({ where: { id: courseId } });
    await writeModerationLog(
      {
        moderatorId,
        targetUserId: course.instructors[0]?.userId ?? null,
        action: "OTHER",
        description: `Removeu curso "${course.title}"`,
        metadata: { courseId, slug: course.slug },
      },
      tx,
    );
  });
}

export async function deleteExamByModerator(examId: string, moderatorId: string) {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    select: { id: true, title: true, slug: true },
  });

  if (!exam) {
    throw new Error("Simulado não encontrado.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.exam.delete({ where: { id: examId } });
    await writeModerationLog(
      {
        moderatorId,
        targetUserId: null,
        action: "OTHER",
        description: `Removeu simulado "${exam.title}"`,
        metadata: { examId, slug: exam.slug },
      },
      tx,
    );
  });
}
