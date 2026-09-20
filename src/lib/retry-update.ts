import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 50;

export async function updateUserWithRetry(
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select?: Prisma.UserSelect,
) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      if (select) {
        return await prisma.user.update({ where, data, select });
      }
      await prisma.user.updateMany({ where: { id: where.id } as Prisma.UserWhereInput, data });
      return await prisma.user.findUnique({ where, select: select ?? { id: true } });
    } catch (err) {
      const isRace =
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2034";
      const isMysqlRace =
        err instanceof Error &&
        err.message.includes("Record has changed since last read");

      if ((isRace || isMysqlRace) && attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}
