"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

type Log = {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  moderator: string;
  targetUser: string | null;
};

const ACTION_LABELS: Record<string, string> = {
  BAN: "Ban",
  UNBAN: "Unban",
  MUTE: "Mute",
  UNMUTE: "Unmute",
  WARN: "Advertência",
  XP_ADD: "XP",
  XP_REMOVE: "XP removido",
  XP_SET: "XP definido",
  LEVEL_SET: "Nível",
  COIN_ADD: "Moedas",
  COIN_REMOVE: "Moedas removidas",
  COIN_SET: "Moedas definidas",
  ROLE_ADD: "Cargo",
  ROLE_REMOVE: "Cargo removido",
  BROADCAST: "Broadcast",
  MAINTENANCE: "Manutenção",
  GLOBAL_BOOSTER: "Booster global",
  COURSE_PUBLISH: "Curso publicado",
  COURSE_UNPUBLISH: "Curso despublicado",
  EXAM_RESET: "Reset de simulado",
  PASSWORD_RESET: "Senha redefinida",
  IMPERSONATE: "Impersonar",
  DELETE_USER: "Excluir conta",
  DELETE_PROFILE: "Limpar perfil",
  OTHER: "Outro",
};

const ACTION_PILLS: Record<string, string> = {
  BAN: "border-red-400/25 bg-red-400/10 text-red-300",
  UNBAN: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  MUTE: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  UNMUTE: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  WARN: "border-yellow-400/25 bg-yellow-400/10 text-yellow-300",
  XP_ADD: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  COIN_ADD: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  ROLE_ADD: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  BROADCAST: "border-teal-400/25 bg-teal-400/10 text-teal-300",
  DELETE_USER: "border-red-400/25 bg-red-400/10 text-red-300",
  DELETE_PROFILE: "border-red-400/25 bg-red-400/10 text-red-300",
  IMPERSONATE: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  MAINTENANCE: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  GLOBAL_BOOSTER: "border-teal-400/25 bg-teal-400/10 text-teal-300",
  COURSE_PUBLISH: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  PASSWORD_RESET: "border-sky-400/25 bg-sky-400/10 text-sky-300",
};

const ACTION_PILL_BASE =
  "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold";

export function LogList() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (search) params.set("search", search);
    const res = await fetch(`/api/moderation/logs?${params}`);
    const data = (await res.json()) as { logs: Log[] };
    setLogs(data.logs ?? []);
    setLoading(false);
  }, [type, search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select value={type} onValueChange={setType} className="w-full sm:w-44">
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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

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
    </div>
  );
}
