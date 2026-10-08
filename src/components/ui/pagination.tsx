"use client";

import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  disabled?: boolean;
  /** Total de registros (opcional, mostrado à esquerda). */
  total?: number;
};

/** Paginação real Anterior/Próxima — padrão de todas as listas do painel. */
export function Pagination({ page, totalPages, onPage, disabled, total }: Props) {
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Anterior
        </Button>
        <span className="text-xs text-slate-400">
          Página {page} de {Math.max(1, totalPages)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
