"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyPoint, LabelCount, RewardsPoint } from "@/services/admin-reports.service";

const PALETTE = ["#3b82f6", "#22d3ee", "#f59e0b", "#10b981", "#a78bfa", "#f43f5e", "#eab308", "#64748b"];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number | string; name: string; color?: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="min-w-[160px] rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background)/0.95)] p-3 shadow-xl backdrop-blur-sm">
      {label && <p className="mb-2 text-xs font-semibold text-slate-200">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-100 font-medium">{entry.name}</span>
          <span className="ml-auto font-mono tabular-nums text-slate-300">
            {typeof entry.value === "number" ? entry.value.toLocaleString("pt-BR") : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
      Sem dados no período para exibir
    </div>
  );
}

const axisTick = { fill: "#64748b", fontSize: 11 };

/** Área — novos usuários por dia. */
export function NewUsersChart({ data }: { data: DailyPoint[] }) {
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) return <EmptyChart />;
  return (
    <div className="relative h-[300px] w-full" role="img" aria-label="Novos usuários por dia">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis dataKey="date" tick={axisTick} tickLine={false} axisLine={{ stroke: "#1e1e2e" }} tickFormatter={(v: string) => v.slice(5)} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} wrapperStyle={{ outline: "none" }} />
          <Area type="monotone" dataKey="value" name="Novos usuários" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.15} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Barras agrupadas — XP e moedas gerados por dia. */
export function RewardsChart({ data }: { data: RewardsPoint[] }) {
  const hasData = data.some((d) => d.xp > 0 || d.moedas > 0);
  if (!hasData) return <EmptyChart />;
  return (
    <div className="relative h-[300px] w-full" role="img" aria-label="XP e moedas gerados por dia">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
          <XAxis dataKey="date" tick={axisTick} tickLine={false} axisLine={{ stroke: "#1e1e2e" }} tickFormatter={(v: string) => v.slice(5)} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} wrapperStyle={{ outline: "none" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="xp" name="XP" fill="#38bdf8" radius={[3, 3, 0, 0]} />
          <Bar dataKey="moedas" name="Moedas" fill="#f59e0b" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Barras horizontais — ações de auditoria por tipo. */
export function ModerationActionsChart({ data }: { data: LabelCount[] }) {
  if (data.length === 0) return <EmptyChart />;
  return (
    <div className="relative h-[300px] w-full" role="img" aria-label="Ações de auditoria por tipo">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
          <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={axisTick} tickLine={false} axisLine={false} width={120} />
          <Tooltip content={<ChartTooltip />} wrapperStyle={{ outline: "none" }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" name="Ações" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Rosca — denúncias por motivo. */
export function ReportReasonsChart({ data }: { data: LabelCount[] }) {
  if (data.length === 0) return <EmptyChart />;
  return (
    <div className="relative h-[300px] w-full" role="img" aria-label="Denúncias por motivo">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} wrapperStyle={{ outline: "none" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
