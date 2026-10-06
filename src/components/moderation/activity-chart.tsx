"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, Activity, TrendingUp } from "lucide-react";

type Point = {
  date: string;
  usuarios: number;
  simulados: number;
  xpGanho: number;
};

const COLORS = {
  usuarios: "#3b82f6",
  simulados: "#10b981",
  xpGanho: "#f59e0b",
};

const LEGEND_ITEMS = [
  { key: "usuarios", label: "Usuários ativos", icon: Users, color: COLORS.usuarios },
  { key: "simulados", label: "Simulados", icon: Activity, color: COLORS.simulados },
  { key: "xpGanho", label: "XP ganho", icon: TrendingUp, color: COLORS.xpGanho },
] as const;

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string; dataKey: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background)/0.95)] backdrop-blur-sm shadow-xl p-3 min-w-[180px]">
      <p className="text-xs font-semibold text-slate-200 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-100 font-medium">{entry.name}</span>
          <span className="ml-auto text-slate-300 font-mono tabular-nums">
            {typeof entry.value === "number" ? entry.value.toLocaleString("pt-BR") : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <span className="h-9 w-9 flex items-center justify-center rounded-xl bg-[hsl(var(--sidebar-accent)/0.5)] border border-[hsl(var(--sidebar-border))]">
            <item.icon className="h-4 w-4" style={{ color: item.color }} aria-hidden="true" />
          </span>
          <span className="text-xs font-medium text-slate-300">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ActivityChart({ data }: { data: Point[] }) {
  const hasData = data && data.length > 0;

  return (
    <div className="hx-panel">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Atividade — últimos 7 dias</h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Evolução de usuários ativos, simulados realizados e XP distribuído
          </p>
        </div>
        <CustomLegend />
      </div>

      <div className="relative h-[320px] w-full" role="img" aria-label="Gráfico de atividade dos últimos 7 dias">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#1e1e2e" }}
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                tickCount={5}
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
              />
              <Line
                type="monotone"
                dataKey="usuarios"
                name="Usuários ativos"
                stroke={COLORS.usuarios}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="simulados"
                name="Simulados"
                stroke={COLORS.simulados}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="xpGanho"
                name="XP ganho"
                stroke={COLORS.xpGanho}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 text-sm">
            Sem dados de atividade para exibir
          </div>
        )}
      </div>
    </div>
  );
}