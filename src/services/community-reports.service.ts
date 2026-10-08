import type { CommunityReportStatus, SocialActivityType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { clampTake } from "@/lib/api-params";
import { formatEventText, type FeedEventMetadata } from "@/lib/social";

export type CommunityReportItem = {
  id: string;
  reason: string;
  details: string | null;
  status: CommunityReportStatus;
  createdAt: Date;
  reporter: { username: string | null; fullName: string };
  activity: {
    id: string;
    type: SocialActivityType;
    text: string;
    body: string | null;
    author: { username: string | null; fullName: string };
  };
};

export type CommunityReportPage = {
  items: CommunityReportItem[];
  page: number;
  totalPages: number;
  total: number;
};

function parseMeta(value: unknown): FeedEventMetadata {
  return value && typeof value === "object" ? (value as FeedEventMetadata) : {};
}

export type ReportStatusFilter = CommunityReportStatus | "all";

/** Fila de denúncias paginada (feed social), mais recentes primeiro. */
export async function listCommunityReports(options: {
  status: ReportStatusFilter;
  search?: string;
  page: number;
  pageSize: number;
}): Promise<CommunityReportPage> {
  const pageSize = clampTake(options.pageSize, 25, 100);

  const searchOr = options.search
    ? [
        { reporter: { OR: [{ username: { contains: options.search } }, { fullName: { contains: options.search } }] } },
        { activity: { user: { OR: [{ username: { contains: options.search } }, { fullName: { contains: options.search } }] } } },
      ]
    : undefined;

  const where = {
    ...(options.status !== "all" ? { status: options.status } : {}),
    ...(searchOr ? { OR: searchOr } : {}),
  };

  const total = await prisma.communityReport.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(options.page, totalPages);

  const rows = await prisma.communityReport.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { username: true, fullName: true } },
      activity: {
        select: {
          id: true,
          type: true,
          metadata: true,
          user: { select: { username: true, fullName: true } },
        },
      },
    },
  });

  return {
    items: rows.map((r) => {
      const meta = parseMeta(r.activity.metadata);
      return {
        id: r.id,
        reason: r.reason,
        details: r.details,
        status: r.status,
        createdAt: r.createdAt,
        reporter: r.reporter,
        activity: {
          id: r.activity.id,
          type: r.activity.type,
          text: formatEventText(r.activity.type, meta),
          body: typeof meta.body === "string" ? meta.body : null,
          author: r.activity.user,
        },
      };
    }),
    page,
    totalPages,
    total,
  };
}

/** Contagens por status (todas, inclusive as zeradas). */
export async function countCommunityReports() {
  const rows = await prisma.communityReport.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const counts: Record<string, number> = { PENDING: 0, REVIEWED: 0, DISMISSED: 0 };
  for (const row of rows) counts[row.status] = row._count._all;
  return {
    pending: counts.PENDING,
    reviewed: counts.REVIEWED,
    dismissed: counts.DISMISSED,
    total: counts.PENDING + counts.REVIEWED + counts.DISMISSED,
  };
}

/**
 * Atualiza o status de N denúncias em lote + registro de auditoria,
 * tudo na mesma transação.
 */
export async function setCommunityReportsStatus(
  ids: string[],
  status: CommunityReportStatus,
  moderatorId: string,
): Promise<number> {
  if (ids.length === 0) return 0;
  const label = status === "REVIEWED" ? "revisadas" : "dispensadas";

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.communityReport.updateMany({
      where: { id: { in: ids } },
      data: { status },
    });
    if (result.count > 0) {
      await tx.moderationLog.create({
        data: {
          moderatorId,
          action: "OTHER",
          description: `Denúncias ${label}: ${result.count} atualizada(s) no feed social`,
          metadata: { reportIds: ids.slice(0, 50), status },
        },
      });
    }
    return result.count;
  });

  return updated;
}
