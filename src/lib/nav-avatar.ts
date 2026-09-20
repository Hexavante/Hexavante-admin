import { prisma } from "@/lib/prisma";

export async function getNavAvatarUrl(userId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });
    return user?.avatarUrl ?? null;
  } catch {
    return null;
  }
}
