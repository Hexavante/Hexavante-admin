"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { ACTION_LABELS, ACTION_PILLS, ACTION_PILL_BASE } from "@/lib/moderation/log-labels";

type Log = {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  moderator: string;
  targetUser: string | null;
};

type LogsResponse = {
  logs: Log[];
  page: number;
  totalPages: number;
  total: number;
};

export function LogList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (search) params.set("search", search);
    params.set("page", String(page));
    const res = await fetch(`/api/moderation/logs?${params}`);
    const data = (await res.json()) as Partial<LogsResponse>;
    setLogs(data.logs ?? []);
    setMeta({
      page: data.page ?? page,
      totalPages: data.totalPages ?? 1,
      total: data.total ?? 0,
    });
    setLoading(false);
  }, [type, search, page]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-4">
      <Card padding="none" className="overflow-hidden p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Logs de auditoria</CardTitle>
            <span className="text-xs text-slate-500">
              {loading ? "Carregando..." : `${meta.total} registro${meta.total === 1 ? "" : "s"}`}
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v);
                setPage(1);
              }}
              className="w-full sm:w-44"
            >
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="BAN">Ban</SelectItem>
              <SelectItem value="UNBAN">Unban</SelectItem>
              <SelectItem value="MUTE">Mute</SelectItem>
              <SelectItem value="WARN">Advertência</SelectItem>
              <SelectItem value="XP_ADD">XP</SelectItem>
              <SelectItem value="COIN_ADD">Moedas</SelectItem>
              <SelectItem value="ROLE_ADD">Cargo</SelectItem>
              <SelectItem value="BROADCAST">Broadcast</SelectItem>
            </Select>
            <div className="w-full min-w-0 sm:flex-1">
              <Input
                placeholder="Filtrar por usuário ou ação"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <ul className="space-y-2">
            {loading ? (
              <li className="py-8 text-center text-slate-500">Carregando logs...</li>
            ) : logs.length === 0 ? (
              <li className="py-8 text-center text-slate-500">Nenhum log encontrado.</li>
            ) : (
              logs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`${ACTION_PILL_BASE} ${ACTION_PILLS[log.action] ?? "border-white/10 bg-white/[0.05] text-slate-400"}`}
                        >
                          {ACTION_LABELS[log.action] ?? log.action}
                        </span>
                        <span className="text-xs text-slate-400">
                          por @{log.moderator}
                          {log.targetUser && <> → @{log.targetUser}</>}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200">{log.description}</p>
                    </div>
                    <time
                      className="shrink-0 text-xs text-slate-500"
                      dateTime={log.createdAt}
                    >
                      {new Date(log.createdAt).toLocaleString("pt-BR")}
                    </time>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="mt-4">
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              disabled={loading}
              onPage={setPage}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
