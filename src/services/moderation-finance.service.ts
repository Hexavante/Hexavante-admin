import { prisma } from "@/lib/prisma";
import { clampTake } from "@/lib/api-params";
import { daysAgo } from "@/lib/dates";

export type FinanceKind = "xp" | "coins";

export type FinanceItem = {
  id: string;
  kind: FinanceKind;
  user: { id: string; username: string | null; fullName: string };
  amount: number;
  /** Apenas em moedas: EARN/SPEND. Em XP não existe (valor líquido). */
  direction: "EARN" | "SPEND" | null;
  source: string;
  description: string | null;
  createdAt: Date;
};

export type FinancePage = {
  items: FinanceItem[];
  page: number;
  totalPages: number;
  total: number;
};

/** Ledger paginado (XP ou moedas), ordenado do mais recente. */
export async function listFinanceTransactions(options: {
  kind: FinanceKind;
  page: number;
  pageSize: number;
  search?: string;
}): Promise<FinancePage> {
  const pageSize = clampTake(options.pageSize, 25, 100);
  const userWhere = options.search
    ? {
        user: {
          OR: [
            { username: { contains: options.search } },
            { fullName: { contains: options.search } },
          ],
        },
      }
    : {};

  const total =
    options.kind === "xp"
      ? await prisma.xpTransaction.count({ where: userWhere })
      : await prisma.coinTransaction.count({ where: userWhere });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(options.page, totalPages);

  if (options.kind === "xp") {
    const rows = await prisma.xpTransaction.findMany({
      where: userWhere,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, username: true, fullName: true } } },
    });
    return {
      items: rows.map((r) => ({
        id: r.id,
        kind: "xp",
        user: r.user,
        amount: r.amount,
        direction: null,
        source: r.source,
        description: r.description,
        createdAt: r.createdAt,
      })),
      page,
      totalPages,
      total,
    };
  }

  const rows = await prisma.coinTransaction.findMany({
    where: userWhere,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, username: true, fullName: true } } },
  });
  return {
    items: rows.map((r) => ({
      id: r.id,
      kind: "coins",
      user: r.user,
      amount: r.amount,
      direction: r.type,
      source: r.source,
      description: r.description,
      createdAt: r.createdAt,
    })),
    page,
    totalPages,
    total,
  };
}

export type FinanceStats = {
  xpWeekCount: number;
  xpWeekNet: number;
  coinWeekCount: number;
  coinWeekNet: number;
};

/** Métricas dos últimos 7 dias (contagens + líquidos), tudo do banco. */
export async function getFinanceStats(): Promise<FinanceStats> {
  const since = daysAgo(7);
  const [xpWeek, coinWeek, coinEarn, coinSpend] = await Promise.all([
    prisma.xpTransaction.aggregate({
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      _sum: { amount: true },
    }),
    prisma.coinTransaction.aggregate({
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.coinTransaction.aggregate({
      where: { createdAt: { gte: since }, type: "EARN" },
      _sum: { amount: true },
    }),
    prisma.coinTransaction.aggregate({
      where: { createdAt: { gte: since }, type: "SPEND" },
      _sum: { amount: true },
    }),
  ]);

  return {
    xpWeekCount: xpWeek._count._all,
    xpWeekNet: xpWeek._sum.amount ?? 0,
    coinWeekCount: coinWeek._count._all,
    coinWeekNet: (coinEarn._sum.amount ?? 0) - (coinSpend._sum.amount ?? 0),
  };
}
