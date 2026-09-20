import { auth } from "@/auth";
import { canModerate } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !canModerate(session.user.roles)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ users: [], tutorials: [], courses: [], exams: [] });
  }

  const [users, tutorials, courses, exams] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q } },
          { fullName: { contains: q } },
          { email: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        xp: true,
        bansReceived: { where: { isActive: true }, take: 1 },
        mutesReceived: { where: { isActive: true }, take: 1 },
      },
    }),
    prisma.tutorial.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, isPublished: true },
    }),
    prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, slug: true, status: true },
    }),
    prisma.exam.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
        ],
      },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, isPublished: true },
    }),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      avatarUrl: u.avatarUrl,
      level: u.xp?.level ?? 1,
      isBanned: u.bansReceived.length > 0,
      isMuted: u.mutesReceived.length > 0,
    })),
    tutorials: tutorials.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      type: "tutorial" as const,
      status: t.isPublished ? "published" : "draft",
    })),
    courses: courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      type: "course" as const,
      status: c.status,
    })),
    exams: exams.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      type: "exam" as const,
      status: e.isPublished ? "published" : "draft",
    })),
  });
}
