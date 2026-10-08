"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import type { FinanceItem, FinanceKind, FinancePage } from "@/services/moderation-finance.service";

const XP_SOURCE_LABELS: Record<string, string> = {
  LESSON: "Lição",
  MODULE: "Módulo",
  COURSE: "Curso",
  EXAM: "Simulado",
  ADMIN: "Admin",
};

const COIN_SOURCE_LABELS: Record<string, string> = {
  EXAM_CORRECT: "Simulado",
  SHOP_PURCHASE: "Loja",
  LESSON: "Lição",
  MODULE: "Módulo",
  COURSE: "Curso",
  PREMIUM_GRANT: "Premium",
  LEAGUE_REWARD: "Liga",
  ADMIN: "Admin",
};

function formatValue(item: FinanceItem) {
  const sign = item.amount > 0 ? "+" : "";
  if (item.kind === "coins") {
    const cls = item.direction === "SPEND" ? "text-red-300" : "text-emerald-300";
    return (
      <span className={`font-semibold ${cls}`}>
        {sign}
        {item.amount.toLocaleString("pt-BR")}
      </span>
    );
  }
  const cls = item.amount < 0 ? "text-red-300" : "text-sky-300";
  return (
    <span className={`font-semibold ${cls}`}>
      {sign}
      {item.amount.toLocaleString("pt-BR")} XP
    </span>
  );
}

export function FinanceTable() {
  const [type, setType] = useState<FinanceKind>("xp");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<FinancePage | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ type, page: String(page), limit: "25" });
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/moderation/finance?${params}`);
      if (!res.ok) {
        setData(null);
        return;
      }
      const json = (await res.json()) as FinancePage;
      setData(json);
    } finally {
      setLoading(false);
    }
  }, [type, page, search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const items = data?.items ?? [];
  const sourceLabels = type === "xp" ? XP_SOURCE_LABELS : COIN_SOURCE_LABELS;

  return (
    <Card padding="none" className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Ledger de transações</CardTitle>
          <span className="text-xs text-slate-500">
            {loading
              ? "Carregando..."
              : `${data?.total ?? 0} registro${(data?.total ?? 0) === 1 ? "" : "s"}`}
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v as FinanceKind);
              setPage(1);
            }}
            className="w-full sm:w-40"
          >
            <SelectItem value="xp">XP</SelectItem>
            <SelectItem value="coins">Moedas</SelectItem>
          </Select>
          <div className="w-full min-w-0 sm:flex-1">
            <Input
              placeholder="Buscar por usuário"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Usuário</th>
              {type === "coins" && <th className="px-4 py-3">Tipo</th>}
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={type === "coins" ? 6 : 5} className="px-4 py-8 text-center text-slate-500">
                  Carregando transações...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={type === "coins" ? 6 : 5} className="px-4 py-8 text-center text-slate-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(item.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{item.user.fullName}</p>
                    <p className="text-xs text-slate-500">@{item.user.username ?? "—"}</p>
                  </td>
                  {type === "coins" && (
                    <td className="px-4 py-3">
                      <span
                        className={
                          item.direction === "SPEND"
                            ? "inline-flex items-center rounded-full border border-red-400/25 bg-red-400/10 px-2 py-0.5 text-[11px] font-semibold text-red-300"
                            : "inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300"
                        }
                      >
                        {item.direction === "SPEND" ? "Usou" : "Ganhou"}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3">{formatValue(item)}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {sourceLabels[item.source] ?? item.source}
                  </td>
                  <td className="max-w-[280px] truncate px-4 py-3 text-slate-400">
                    {item.description ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-white/10 px-5 py-3">
        <Pagination
          page={data?.page ?? page}
          totalPages={data?.totalPages ?? 1}
          total={data?.total}
          disabled={loading}
          onPage={setPage}
        />
      </div>
    </Card>
  );
}
