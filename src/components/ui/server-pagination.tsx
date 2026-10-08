import { LinkButton } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  total?: number;
  /** URLs prontas para Anterior/Próxima (null = botão desabilitado). */
  prev: string | null;
  next: string | null;
};

/** Paginação server-side (links) — mesmos estilos da Pagination client. */
export function ServerPagination({ page, totalPages, total, prev, next }: Props) {
  const totalPagesSafe = Math.max(1, totalPages);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {typeof total === "number" ? (
        <span className="text-xs text-slate-500">
          {total} registro{total === 1 ? "" : "s"}
        </span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-2">
        {prev ? (
          <LinkButton href={prev} variant="outline" size="sm">
            Anterior
          </LinkButton>
        ) : (
          <span className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-600 opacity-60">
            Anterior
          </span>
        )}
        <span className="text-xs text-slate-400">
          Página {page} de {totalPagesSafe}
        </span>
        {next ? (
          <LinkButton href={next} variant="outline" size="sm">
            Próxima
          </LinkButton>
        ) : (
          <span className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-600 opacity-60">
            Próxima
          </span>
        )}
      </div>
    </div>
  );
}
