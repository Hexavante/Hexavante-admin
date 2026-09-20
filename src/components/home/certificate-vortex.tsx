"use client";

import { useEffect, useRef } from "react";
import { Award } from "lucide-react";

type Props = {
  hasCertificates: boolean;
};

function Stars({ count = 40 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0,
            animation: `starTwinkle ${s.duration}s ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function VortexText({ text }: { text: string }) {
  return (
    <div className="relative inline-block">
      <div className="vortex-glow absolute inset-0 blur-xl" />
      <h2
        className="relative text-3xl font-black tracking-tight sm:text-4xl"
        style={{
          background: "linear-gradient(135deg, #38bdf8, #a78bfa, #f472b6, #38bdf8)",
          backgroundSize: "300% 300%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradientShift 4s ease infinite",
        }}
      >
        {text}
      </h2>
    </div>
  );
}

export function CertificateVortex({ hasCertificates }: Props) {
  return (
    <section className="relative mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[hsl(var(--sidebar-background))] via-[hsl(var(--sidebar-background)/0.95)] to-sky-950/20 p-8">
      <Stars count={50} />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="vortex-ring mb-6">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-amber-500/10 shadow-[0_0_60px_15px_rgba(251,191,36,0.15)]">
            <Award className="h-10 w-10 text-amber-400" style={{ animation: "vortexSpin 3s linear infinite" }} />
          </div>
        </div>

        <VortexText text="Certificados" />

        {!hasCertificates ? (
          <p
            className="mt-4 text-base text-slate-300 sm:text-lg"
            style={{ animation: "fadeSlideUp 0.8s 0.3s both" }}
          >
            Você ainda não tem certificados.
          </p>
        ) : (
          <p
            className="mt-4 text-base text-slate-300 sm:text-lg"
            style={{ animation: "fadeSlideUp 0.8s 0.3s both" }}
          >
            Confira suas conquistas e compartilhe seu progresso.
          </p>
        )}

        <a
          href="/certificados"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-6 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/20 hover:text-amber-200"
          style={{ animation: "fadeSlideUp 0.8s 0.5s both" }}
        >
          <Award className="h-4 w-4" />
          {hasCertificates ? "Ver certificados" : "Comece a estudar"}
        </a>
      </div>

      <style jsx>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes vortexSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .vortex-glow {
          background: conic-gradient(
            from 0deg,
            rgba(56, 189, 248, 0.12),
            rgba(167, 139, 250, 0.12),
            rgba(244, 114, 182, 0.12),
            rgba(56, 189, 248, 0.12)
          );
          animation: vortexSpin 6s linear infinite;
          border-radius: 50%;
        }
        .vortex-ring {
          position: relative;
          animation: vortexPulse 3s ease-in-out infinite;
        }
        @keyframes vortexPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
}
