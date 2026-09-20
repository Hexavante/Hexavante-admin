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

  await prisma.course.delete({ where: { id: courseId } });

  await writeModerationLog({
    moderatorId,
    targetUserId: course.instructors[0]?.userId ?? null,
    action: "OTHER",
    description: `Removeu curso "${course.title}"`,
    metadata: { courseId, slug: course.slug },
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

  await prisma.exam.delete({ where: { id: examId } });

  await writeModerationLog({
    moderatorId,
    targetUserId: null,
    action: "OTHER",
    description: `Removeu simulado "${exam.title}"`,
    metadata: { examId, slug: exam.slug },
  });
}
