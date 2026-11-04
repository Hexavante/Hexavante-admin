"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Ban,
  CheckCircle,
  Download,
  Eye,
  Plus,
  Shield,
  Trash2,
  UserRound,
  VolumeX,
  Volume2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import { allowedRoleChanges, canManageTarget } from "@/lib/moderation/permissions";
import { isAdmin, isStaff } from "@/lib/permissions";
import { UserActionModals, type ModUser, type ModalType } from "./action-modals";
import { APP_URL } from "@/lib/app-url";
import { impersonateUser } from "@/app/actions/impersonate";
import { bulkUserAction, type BulkAction } from "@/app/actions/moderation-bulk";

type UsersResponse = {
  users: ModUser[];
  page: number;
  totalPages: number;
  total: number;
};

export function UserTable() {
  const [users, setUsers] = useState<ModUser[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ModUser | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [viewer, setViewer] = useState<{ id: string; roles: string[] }>({id:"", roles:[]});
  const targetRoles = (user: ModUser) => [...user.roles, (user.legacyRole ?? "").toUpperCase()];
  const manageable = (user: ModUser) => canManageTarget(viewer.roles, targetRoles(user), viewer.id === user.id);
  const mayLift = isAdmin(viewer.roles);
  const [canImpersonate, setCanImpersonate] = useState(false);

  // Ação em massa (seleção atravessa páginas; limpa ao trocar filtros).
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [bulkReason, setBulkReason] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkMsg, setBulkMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    if (role !== "all") params.set("role", role);
    params.set("page", String(page));
    const res = await fetch(`/api/moderation/users?${params}`);
    const data = (await res.json()) as Partial<UsersResponse>;
    setUsers(data.users ?? []);
    setMeta({
      page: data.page ?? page,
      totalPages: data.totalPages ?? 1,
      total: data.total ?? 0,
    });
    setLoading(false);
  }, [search, status, role, page]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    void fetch("/api/moderation/settings")
      .then((res) => res.json())
      .then((data: { canImpersonate?: boolean; viewer?: typeof viewer }) => {
        setCanImpersonate(Boolean(data.canImpersonate));
        if (data.viewer) setViewer(data.viewer);
      })
      .catch(() => undefined);
  }, []);

  const impersonate = async (user: ModUser) => {
    try {
      await impersonateUser(user.id);
      globalThis.location.assign("/");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro ao impersonar.");
    }
  };

  const openModal = (user: ModUser, type: ModalType) => {
    setSelected(user);
    setModal(type);
  };

  // ── Seleção ──────────────────────────────────────────────
  const pageIds = users.map((u) => u.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => checked.has(id));

  const toggleAll = () => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (allChecked) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Ação em massa ────────────────────────────────────────
  const runBulk = async (action: BulkAction) => {
    const ids = [...checked];
    if (ids.length === 0 || bulkBusy) return;
    if ((action === "ban" || action === "mute") && !bulkReason.trim()) {
      setBulkMsg({ ok: false, text: "Informe um motivo para banir ou silenciar." });
      return;
    }
    setBulkBusy(true);
    setBulkMsg(null);
    try {
      const result = await bulkUserAction(ids, action, { reason: bulkReason, duration: "1d" });
      if (result.failed.length > 0) {
        const first = result.failed[0];
        setBulkMsg({
          ok: false,
          text: `${result.processed} concluído(s), ${result.failed.length} falha(s) — ${first.error}`,
        });
        setChecked(new Set(result.failed.map((f) => f.id)));
      } else {
        setBulkMsg({ ok: true, text: `${result.processed} usuário(s) atualizado(s).` });
        setChecked(new Set());
      }
      await load();
    } catch (e) {
      setBulkMsg({ ok: false, text: e instanceof Error ? e.message : "Erro na ação em massa." });
    } finally {
      setBulkBusy(false);
    }
  };

  const exportCsv = async () => {
    const ids = [...checked];
    if (ids.length === 0 || bulkBusy) return;
    setBulkBusy(true);
    setBulkMsg(null);
    try {
      const res = await fetch(`/api/moderation/users?${new URLSearchParams({ ids: ids.join(",") })}`);
      const data = (await res.json()) as Partial<UsersResponse>;
      const rows = data.users ?? [];
      if (rows.length === 0) {
        setBulkMsg({ ok: false, text: "Nada para exportar." });
        return;
      }
      const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
      const lines = [
        ["username", "nome", "nivel", "xp", "moedas", "cargos", "status", "criado_em"].join(";"),
        ...rows.map((u) =>
          [
            esc(u.username ?? ""),
            esc(u.fullName),
            esc(u.level),
            esc(u.xp),
            esc(u.coins),
            esc(u.roles.join("|") || "USER"),
            esc(u.isBanned ? "banido" : u.isMuted ? "silenciado" : "ativo"),
            esc(new Date(u.createdAt).toLocaleString("pt-BR")),
          ].join(";"),
        ),
      ];
      const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setBulkMsg({ ok: true, text: `${rows.length} usuário(s) exportado(s) em CSV.` });
    } catch (e) {
      setBulkMsg({ ok: false, text: e instanceof Error ? e.message : "Erro ao exportar." });
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card padding="none" className="overflow-hidden p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Usuários</CardTitle>
            <span className="text-xs text-slate-500">
              {loading ? "Carregando..." : `${meta.total} resultado${meta.total === 1 ? "" : "s"}`}
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full min-w-0 sm:flex-1">
              <Input
                placeholder="Buscar por nome ou @username"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                  setChecked(new Set());
                }}
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
                setChecked(new Set());
              }}
              className="w-full sm:w-44"
            >
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="banned">Banidos</SelectItem>
              <SelectItem value="muted">Silenciados</SelectItem>
            </Select>
            <Select
              value={role}
              onValueChange={(v) => {
                setRole(v);
                setPage(1);
                setChecked(new Set());
              }}
              className="w-full sm:w-44"
            >
              <SelectItem value="all">Todos os cargos</SelectItem>
              <SelectItem value="SUPERADMIN">Superadmin</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MODERATOR">Moderador</SelectItem>
              <SelectItem value="INSTRUCTOR">Instrutor</SelectItem>
              <SelectItem value="USER">Usuário</SelectItem>
            </Select>
          </div>

          {checked.size > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-sky-400/25 bg-sky-400/10 px-3 py-2">
              <span className="text-xs font-semibold text-sky-200">
                {checked.size} selecionado{checked.size === 1 ? "" : "s"}
              </span>
              <Input
                placeholder="Motivo (banir/silenciar)"
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value)}
                className="h-9 w-56"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => void runBulk("ban")}
              >
                Banir
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => void runBulk("mute")}
              >
                Silenciar 24h
              </Button>
              {mayLift && <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => void runBulk("unban")}
              >
                Desbanir
              </Button>}
              {mayLift && <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => void runBulk("unmute")}
              >
                Remover silêncio
              </Button>}
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={bulkBusy}
                onClick={() => void exportCsv()}
              >
                <Download className="mr-1 h-3.5 w-3.5" />
                CSV
              </Button>
              <button
                type="button"
                className="text-xs text-slate-400 transition hover:text-white"
                onClick={() => setChecked(new Set())}
              >
                Limpar
              </button>
            </div>
          )}

          {bulkMsg && (
            <p
              className={`mt-3 text-xs font-medium ${bulkMsg.ok ? "text-emerald-400" : "text-red-400"}`}
            >
              {bulkMsg.text}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
              <tr>
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="Selecionar página"
                  />
                </th>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Nível</th>
                <th className="px-4 py-3">XP</th>
                <th className="px-4 py-3">Moedas</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Carregando...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={checked.has(user.id)}
                        onChange={() => toggleOne(user.id)}
                        aria-label={`Selecionar @${user.username ?? user.id}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatarUrl} alt={user.username ?? ""} size="sm" />
                        <div>
                          <p className="font-medium text-white">@{user.username}</p>
                          <p className="text-xs text-slate-500">{user.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{user.level}</td>
                    <td className="px-4 py-3 text-slate-300">{user.xp}</td>
                    <td className="px-4 py-3 text-slate-300">{user.coins}</td>
                    <td className="px-4 py-3 text-slate-300">{user.roles.join(", ") || "USER"}</td>
                    <td className="px-4 py-3">
                      {user.isBanned ? (
                        <span className="text-red-400">Banido</span>
                      ) : user.isMuted ? (
                        <span className="text-amber-400">Silenciado</span>
                      ) : (
                        <span className="text-green-400">Ativo</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <ActionBtn
                          icon={Eye}
                          label="Perfil"
                          onClick={() => window.open(`${APP_URL}/perfil/${user.username}`, "_blank")}
                        />
                        {canImpersonate &&
                        !isStaff(targetRoles(user)) ? (
                          <ActionBtn
                            icon={UserRound}
                            label="Ver como"
                            onClick={() => void impersonate(user)}
                          />
                        ) : null}
                        <ActionBtn icon={Plus} label="XP" onClick={() => openModal(user, "addxp")} />
                        {manageable(user) && <ActionBtn
                          icon={Shield}
                          label="Cargo"
                          onClick={() => openModal(user, "cargo")}
                        />}
                        <ActionBtn
                          icon={AlertTriangle}
                          label="Aviso"
                          onClick={() => openModal(user, "warn")}
                        />

                        {user.isMuted ? (
                          mayLift && <ActionBtn
                            icon={Volume2}
                            label="Remover silêncio"
                            onClick={() => openModal(user, "unmute")}
                          />
                        ) : (
                          <ActionBtn
                            icon={VolumeX}
                            label="Silenciar"
                            onClick={() => openModal(user, "mute")}
                          />
                        )}

                        {user.isBanned ? (
                          mayLift && <ActionBtn
                            icon={CheckCircle}
                            label="Desbanir"
                            onClick={() => openModal(user, "unban")}
                          />
                        ) : (
                          <ActionBtn
                            icon={Ban}
                            label="Banir"
                            onClick={() => openModal(user, "ban")}
                          />
                        )}

                        <ActionBtn
                          icon={Trash2}
                          label="Limpar perfil"
                          onClick={() => openModal(user, "deleteProfile")}
                        />
                        {manageable(user) && <ActionBtn
                          icon={XCircle}
                          label="Excluir conta"
                          danger
                          onClick={() => openModal(user, "deleteUser")}
                        />}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/10 px-5 py-3">
          <Pagination
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            disabled={loading || bulkBusy}
            onPage={(p) => setPage(p)}
          />
        </div>
      </Card>

      <UserActionModals
        assignableRoles={selected ? allowedRoleChanges(viewer.roles, targetRoles(selected), viewer.id === selected.id) : []}
        user={selected}
        modal={modal}
        onClose={() => {
          setModal(null);
          setSelected(null);
        }}
        onSuccess={() => void load()}
      />
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Eye;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg border text-slate-400 transition ${
        danger
          ? "border-red-500/30 hover:border-red-500/60 hover:text-red-400"
          : "border-white/10 hover:border-sky-400/30 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
