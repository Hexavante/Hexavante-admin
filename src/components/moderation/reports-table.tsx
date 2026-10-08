"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import {
  ACTIVITY_TYPE_LABELS,
  REPORT_REASON_LABELS,
  REPORT_STATUS_LABELS,
} from "@/lib/moderation/log-labels";
import type { CommunityReportPage } from "@/services/community-reports.service";

const REASON_PILLS: Record<string, string> = {
  SPAM: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  HARASSMENT: "border-red-400/25 bg-red-400/10 text-red-300",
  INAPPROPRIATE: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  MISINFORMATION: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  OTHER: "border-white/10 bg-white/[0.05] text-slate-300",
};

const STATUS_PILLS: Record<string, string> = {
  PENDING: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  REVIEWED: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  DISMISSED: "border-white/10 bg-white/[0.05] text-slate-400",
};

const PILL_BASE =
  "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold";

type Action = "reviewed" | "dismissed";

export function ReportsTable() {
  const [status, setStatus] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CommunityReportPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status, page: String(page), limit: "25" });
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/moderation/reports?${params}`);
      if (!res.ok) {
        setData(null);
        return;
      }
      const json = (await res.json()) as CommunityReportPage;
      setData(json);
    } finally {
      setLoading(false);
    }
  }, [status, page, search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const items = data?.items ?? [];

  const applyAction = async (ids: string[], action: Action) => {
    if (ids.length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/moderation/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Falha ao atualizar as denúncias.");
        return;
      }
      setSelected(new Set());
      await load();
    } catch {
      setError("Falha de conexão ao atualizar as denúncias.");
    } finally {
      setSubmitting(false);
    }
  };

  const pageIds = items.map((i) => i.id);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Card padding="none" className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Denúncias do feed</CardTitle>
          <span className="text-xs text-slate-500">
            {loading
              ? "Carregando..."
              : `${data?.total ?? 0} registro${(data?.total ?? 0) === 1 ? "" : "s"}`}
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
              setSelected(new Set());
            }}
            className="w-full sm:w-44"
          >
            <SelectItem value="PENDING">Pendentes</SelectItem>
            <SelectItem value="REVIEWED">Revisadas</SelectItem>
            <SelectItem value="DISMISSED">Dispensadas</SelectItem>
            <SelectItem value="all">Todas</SelectItem>
          </Select>
          <div className="w-full min-w-0 sm:flex-1">
            <Input
              placeholder="Buscar por denunciante ou autor"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setSelected(new Set());
              }}
            />
          </div>
        </div>

        {selected.size > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-sky-400/25 bg-sky-400/10 px-3 py-2">
            <span className="text-xs font-semibold text-sky-200">
              {selected.size} selecionada{selected.size === 1 ? "" : "s"}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => void applyAction([...selected], "reviewed")}
            >
              Marcar revisadas
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={submitting}
              onClick={() => void applyAction([...selected], "dismissed")}
            >
              Dispensar
            </Button>
          </div>
        )}

        {error && <p className="mt-3 text-xs font-medium text-red-400">{error}</p>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
            <tr>
              <th className="w-10 px-4 py-3">
                <Checkbox checked={allSelected} onChange={toggleAll} aria-label="Selecionar página" />
              </th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Denúncia</th>
              <th className="px-4 py-3">Atividade</th>
              <th className="px-4 py-3">Denunciante</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Carregando denúncias...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Nenhuma denúncia neste filtro.
                </td>
              </tr>
            ) : (
              items.map((report) => (
                <tr
                  key={report.id}
                  className={`border-b border-white/5 hover:bg-white/[0.03] ${selected.has(report.id) ? "bg-sky-400/[0.06]" : ""}`}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selected.has(report.id)}
                      onChange={() => toggleOne(report.id)}
                      aria-label="Selecionar denúncia"
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(report.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`${PILL_BASE} ${REASON_PILLS[report.reason] ?? REASON_PILLS.OTHER}`}>
                        {REPORT_REASON_LABELS[report.reason] ?? report.reason}
                      </span>
                      {ACTIVITY_TYPE_LABELS[report.activity.type] && (
                        <span className={`${PILL_BASE} border-white/10 bg-white/[0.05] text-slate-400`}>
                          {ACTIVITY_TYPE_LABELS[report.activity.type]}
                        </span>
                      )}
                    </div>
                    {report.details && (
                      <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                        {report.details}
                      </p>
                    )}
                  </td>
                  <td className="max-w-[300px] px-4 py-3">
                    <p className="truncate font-medium text-white">{report.activity.text}</p>
                    <p className="truncate text-xs text-slate-500">
                      @{report.activity.author.username ?? "—"} · {report.activity.author.fullName}
                      {report.activity.body ? ` — ${report.activity.body}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-300">{report.reporter.fullName}</p>
                    <p className="text-xs text-slate-500">@{report.reporter.username ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${PILL_BASE} ${STATUS_PILLS[report.status] ?? ""}`}>
                      {REPORT_STATUS_LABELS[report.status] ?? report.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {report.status === "PENDING" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={submitting}
                          onClick={() => void applyAction([report.id], "reviewed")}
                        >
                          Revisar
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={submitting}
                          onClick={() => void applyAction([report.id], "dismissed")}
                        >
                          Dispensar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
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
          disabled={loading || submitting}
          onPage={(p) => {
            setPage(p);
            setSelected(new Set());
          }}
        />
      </div>
    </Card>
  );
}
