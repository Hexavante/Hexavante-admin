import { prisma } from "@/lib/prisma";

export type PlatformStats = {
  totalUsers: number;
  totalCourses: number;
  totalExams: number;
  totalLessons: number;
};

export async function getPlatformStats(): Promise<PlatformStats> {
  const [totalUsers, totalCourses, totalExams, totalLessons] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.exam.count(),
    prisma.lesson.count(),
  ]);

  return { totalUsers, totalCourses, totalExams, totalLessons };
}
