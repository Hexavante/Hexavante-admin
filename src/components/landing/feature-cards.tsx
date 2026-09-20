"use client";

import { BookOpen, Target, Trophy, BarChart3, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
  badge: string;
  badgeVariant: "sky" | "red" | "amber" | "emerald";
  bullets: string[];
  gradient: string;
  mockupContent: React.ReactNode;
};

const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Central de Estudos",
    description: "Cursos organizados por disciplina com aulas em vídeo, material de apoio e exercícios práticos. Acompanhe seu progresso em tempo real.",
    badge: "Mais popular",
    badgeVariant: "sky",
    bullets: ["Cursos com videoaulas", "Material complementar", "Progresso em tempo real"],
    gradient: "from-cyan-500/20 via-blue-600/15 to-violet-600/10",
    mockupContent: (
      <div className="space-y-3 w-full">
        <div className="flex items-center gap-3 rounded-lg bg-white/[0.08] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/20 text-cyan-300"><BookOpen className="h-4 w-4" /></div>
          <div className="flex-1"><div className="h-2.5 w-28 rounded bg-white/20" /><div className="mt-1.5 h-1.5 w-20 rounded bg-white/10" /></div>
          <div className="h-5 w-12 rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-300 flex items-center justify-center">85%</div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-white/[0.05] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-400/20 text-violet-300"><BookOpen className="h-4 w-4" /></div>
          <div className="flex-1"><div className="h-2.5 w-32 rounded bg-white/15" /><div className="mt-1.5 h-1.5 w-24 rounded bg-white/8" /></div>
          <div className="h-5 w-12 rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-300 flex items-center justify-center">42%</div>
        </div>
      </div>
    ),
  },
  {
    icon: Target,
    title: "Simulados ao vivo",
    description: "Questões que simulam provas reais com correção automática e gabarito comentado. Prepare-se com estilo ENEM e vestibulares.",
    badge: "Ao vivo",
    badgeVariant: "red",
    bullets: ["Correção automática", "Gabarito comentado", "Ranking de desempenho"],
    gradient: "from-rose-500/20 via-orange-500/15 to-amber-500/10",
    mockupContent: (
      <div className="space-y-3 w-full">
        <div className="rounded-lg bg-white/[0.08] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Questão 12/30</span>
            <span className="text-[10px] text-white/40">02:34</span>
          </div>
          <div className="h-2 w-full rounded bg-white/15 mb-2" />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-white/[0.06] p-2 text-[10px] text-white/60">Alternativa A</div>
            <div className="rounded-md bg-cyan-400/15 p-2 text-[10px] text-cyan-300 border border-cyan-400/30">Alternativa B ✓</div>
            <div className="rounded-md bg-white/[0.06] p-2 text-[10px] text-white/60">Alternativa C</div>
            <div className="rounded-md bg-white/[0.06] p-2 text-[10px] text-white/60">Alternativa D</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Trophy,
    title: "Ranking e gamificação",
    description: "Ganhe XP, suba de nível e compita com outros estudantes. Desbloqueie conquistas e personalize seu perfil com itens da loja.",
    badge: "Competir",
    badgeVariant: "amber",
    bullets: ["Sistema de XP e níveis", "Conquistas desbloqueáveis", "Loja de cosméticos"],
    gradient: "from-amber-500/20 via-yellow-500/15 to-orange-500/10",
    mockupContent: (
      <div className="space-y-3 w-full">
        <div className="flex items-center gap-3 rounded-lg bg-white/[0.08] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-400/20 text-amber-300 text-sm font-black">#1</div>
          <div className="flex-1">
            <div className="text-xs font-bold text-white">Você</div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/10"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-amber-400 to-orange-500" /></div>
          </div>
          <span className="text-xs font-bold text-amber-300">2.450 XP</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-white/[0.05] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08] text-white/50 text-sm font-black">#2</div>
          <div className="flex-1">
            <div className="text-xs font-medium text-white/70">Maria S.</div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/10"><div className="h-full w-[65%] rounded-full bg-white/20" /></div>
          </div>
          <span className="text-xs text-white/40">2.100 XP</span>
        </div>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: "Estatísticas detalhadas",
    description: "Acompanhe seu desempenho por disciplina, taxa de acerto, tempo de estudo e evolução ao longo do tempo com gráficos interativos.",
    badge: "Insights",
    badgeVariant: "emerald",
    bullets: ["Gráficos interativos", "Desempenho por área", "Histórico completo"],
    gradient: "from-emerald-500/20 via-teal-500/15 to-cyan-500/10",
    mockupContent: (
      <div className="space-y-3 w-full">
        <div className="rounded-lg bg-white/[0.08] p-3">
          <div className="flex items-end justify-between gap-1 h-16">
            {[40, 65, 50, 80, 70, 90, 85].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-emerald-400/40 to-emerald-400/10" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-white/30">
            <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
          </div>
        </div>
      </div>
    ),
  },
];

export function FeatureCards() {
  return (
    <div className="space-y-20 lg:space-y-28">
      {features.map((f, i) => {
        const reversed = i % 2 === 1;
        return (
          <div key={f.title} className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", reversed && "lg:[direction:rtl]")}>
            {/* Text */}
            <div className={cn("space-y-5", reversed && "lg:[direction:ltr]")}>
              <Badge variant={f.badgeVariant}>{f.badge}</Badge>
              <h3 className="text-3xl font-black tracking-tight text-[hsl(var(--sidebar-foreground))] sm:text-4xl">{f.title}</h3>
              <p className="text-base leading-relaxed text-[hsl(var(--sidebar-foreground)/0.6)] sm:text-lg">{f.description}</p>
              <ul className="space-y-3 pt-1">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-[hsl(var(--sidebar-foreground)/0.78)] sm:text-base">
                    <Zap className="h-4 w-4 shrink-0 hx-accent-text" />{b}
                  </li>
                ))}
              </ul>
            </div>
            {/* Mockup card */}
            <div className={cn("relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8 bg-gradient-to-br", f.gradient, reversed && "lg:[direction:ltr]")} style={{ boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.4)" }}>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
              <div className="relative flex items-center justify-center"><div className="w-full max-w-xs">{f.mockupContent}</div></div>
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
