import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export type TutorialInput = {
  title: string;
  categoryId?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string | null;
  duration?: number;
  isPublished?: boolean;
};

async function uniqueTutorialSlug(title: string): Promise<string> {
  const base = slugify(title) || "tutorial";
  let slug = base;
  let counter = 1;
  while (await prisma.tutorial.findUnique({ where: { slug } })) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

export async function listTutorials(params?: { categoryId?: string; publishedOnly?: boolean }) {
  return prisma.tutorial.findMany({
    where: {
      ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
      ...(params?.publishedOnly ? { isPublished: true } : {}),
    },
    include: {
      author: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
      category: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function searchPublishedTutorials(params?: {
  q?: string;
  categoryId?: string;
  sort?: "recent" | "popular";
}) {
  const query = params?.q?.trim();
  return prisma.tutorial.findMany({
    where: {
      isPublished: true,
      ...(params?.categoryId ? { categoryId: params.categoryId } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query } },
              { description: { contains: query } },
            ],
          }
        : {}),
    },
    include: {
      author: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
      category: { select: { id: true, name: true } },
    },
    orderBy:
      params?.sort === "popular" ? { viewCount: "desc" } : { createdAt: "desc" },
  });
}

export async function getTutorial(slug: string, publishedOnly = false) {
  return prisma.tutorial.findFirst({
    where: {
      slug,
      ...(publishedOnly ? { isPublished: true } : {}),
    },
    include: {
      author: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
      category: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function createTutorial(authorId: string, data: TutorialInput) {
  const slug = await uniqueTutorialSlug(data.title);
  return prisma.tutorial.create({
    data: {
      authorId,
      title: data.title,
      slug,
      categoryId: data.categoryId || null,
      description: data.description || null,
      videoUrl: data.videoUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      duration: data.duration || null,
      isPublished: data.isPublished ?? false,
    },
  });
}

export async function updateTutorial(tutorialId: string, authorId: string, data: Partial<TutorialInput>) {
  const existing = await prisma.tutorial.findFirst({
    where: { id: tutorialId, authorId },
  });
  if (!existing) throw new Error("Tutorial não encontrado ou sem permissão.");

  return prisma.tutorial.update({
    where: { id: tutorialId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId || null }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl || null }),
      ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl || null }),
      ...(data.duration !== undefined && { duration: data.duration || null }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
    },
  });
}

export async function deleteTutorial(tutorialId: string, authorId: string) {
  const existing = await prisma.tutorial.findFirst({
    where: { id: tutorialId, authorId },
  });
  if (!existing) throw new Error("Tutorial não encontrado ou sem permissão.");
  return prisma.tutorial.delete({ where: { id: tutorialId } });
}

export async function incrementTutorialViews(tutorialId: string) {
  return prisma.tutorial.update({
    where: { id: tutorialId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function setTutorialTags(tutorialId: string, tagNames: string[]) {
  await prisma.tutorialTag.deleteMany({ where: { tutorialId } });
  for (const name of tagNames) {
    const clean = name.trim();
    if (!clean) continue;
    const tag = await prisma.tag.upsert({
      where: { name: clean },
      update: {},
      create: { name: clean },
    });
    await prisma.tutorialTag.create({
      data: { tutorialId, tagId: tag.id },
    });
  }
}
