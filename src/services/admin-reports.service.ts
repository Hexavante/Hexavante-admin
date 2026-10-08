import { prisma } from "@/lib/prisma";
import { daysAgo } from "@/lib/dates";
import { ACTION_LABELS } from "@/lib/moderation/log-labels";

/** Chave de dia local YYYY-MM-DD. */
function dayKey(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Lista ascendente das últimas `days` datas (inclui hoje), com buckets zerados. */
function emptyDailyBuckets(days: number): Map<string, number> {
  const map = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    map.set(dayKey(d), 0);
  }
  return map;
}

export type DailyPoint = { date: string; value: number };

/** Totais do cabeçalho do relatório (tudo do banco). */
export async function getAdminReportStats() {
  const week = daysAgo(7);
  const month = daysAgo(30);
  const [totalUsers, newUsers7d, logs30d, reportsPending] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: week } } }),
    prisma.moderationLog.count({ where: { createdAt: { gte: month } } }),
    prisma.communityReport.count({ where: { status: "PENDING" } }),
  ]);
  return { totalUsers, newUsers7d, logs30d, reportsPending };
}

/** Novos usuários por dia (últimos `days` dias). */
export async function getDailyNewUsers(days = 30): Promise<DailyPoint[]> {
  const since = daysAgo(days);
  const rows = await prisma.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });
  const buckets = emptyDailyBuckets(days);
  for (const row of rows) {
    const key = dayKey(row.createdAt);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()].map(([date, value]) => ({ date, value }));
}

export type RewardsPoint = { date: string; xp: number; moedas: number };

/** XP gerado e moedas ganhas por dia (últimos `days` dias). */
export async function getDailyRewards(days = 30): Promise<RewardsPoint[]> {
  const since = daysAgo(days);
  const [xpRows, coinRows] = await Promise.all([
    prisma.xpTransaction.findMany({
      where: { createdAt: { gte: since }, amount: { gt: 0 } },
      select: { createdAt: true, amount: true },
    }),
    prisma.coinTransaction.findMany({
      where: { createdAt: { gte: since }, type: "EARN" },
      select: { createdAt: true, amount: true },
    }),
  ]);

  const xpBuckets = emptyDailyBuckets(days);
  const coinBuckets = emptyDailyBuckets(days);
  for (const row of xpRows) {
    const key = dayKey(row.createdAt);
    if (xpBuckets.has(key)) xpBuckets.set(key, (xpBuckets.get(key) ?? 0) + row.amount);
  }
  for (const row of coinRows) {
    const key = dayKey(row.createdAt);
    if (coinBuckets.has(key)) coinBuckets.set(key, (coinBuckets.get(key) ?? 0) + row.amount);
  }

  return [...xpBuckets.entries()].map(([date, xp]) => ({
    date,
    xp,
    moedas: coinBuckets.get(date) ?? 0,
  }));
}

export type LabelCount = { name: string; value: number };

/** Ações de auditoria por tipo (top 8, últimos 30 dias). */
export async function getModerationActions30d(): Promise<LabelCount[]> {
  const since = daysAgo(30);
  const rows = await prisma.moderationLog.groupBy({
    by: ["action"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
    orderBy: { _count: { action: "desc" } },
    take: 8,
  });
  return rows.map((r) => ({
    name: ACTION_LABELS[r.action] ?? r.action,
    value: r._count._all,
  }));
}

const REASON_LABELS: Record<string, string> = {
  SPAM: "Spam",
  HARASSMENT: "Assédio",
  INAPPROPRIATE: "Inapropriado",
  MISINFORMATION: "Desinformação",
  OTHER: "Outro",
};

/** Denúncias por motivo (últimos 30 dias). */
export async function getReportReasons30d(): Promise<LabelCount[]> {
  const since = daysAgo(30);
  const rows = await prisma.communityReport.groupBy({
    by: ["reason"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });
  return rows
    .map((r) => ({
      name: REASON_LABELS[String(r.reason)] ?? String(r.reason),
      value: r._count._all,
    }))
    .sort((a, b) => b.value - a.value);
}
