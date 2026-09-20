"use client";

import { useCallback, useRef, useState, useEffect } from "react";

const COOLDOWN_MS = 2_500;
const PARTICLE_COUNT = 12;
const COINS = ["🪙", "⭐", "✨", "💰", "🪙", "⭐", "✨", "💰", "🪙", "⭐", "✨", "💰"];
const DURATION = 800;

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  coin: string;
  scale: number;
  opacity: number;
  born: number;
};

export function CoinExplosion({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastTrigger = useRef(0);
  const idCounter = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [bursting, setBursting] = useState(false);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((p) => {
      const age = now - p.born;
      if (age > DURATION) return false;

      const progress = age / DURATION;
      const ease = 1 - Math.pow(1 - progress, 3);

      const x = p.x + p.vx * ease;
      const y = p.y + p.vy * ease + progress * progress * 60;
      const opacity = progress < 0.2 ? progress / 0.2 : 1 - ((progress - 0.2) / 0.8);
      const rotation = p.rotation + p.rotationSpeed * progress;
      const scale = p.scale * (1 - progress * 0.5);

      ctx.save();
      ctx.globalAlpha = Math.max(0, opacity);
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.coin, 0, 0);
      ctx.restore();

      return true;
    });

    if (particlesRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      setBursting(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const spawn = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastTrigger.current < COOLDOWN_MS) return;
      lastTrigger.current = now;

      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const performanceNow = performance.now();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.5;
        const speed = 80 + Math.random() * 120;
        particlesRef.current.push({
          id: idCounter.current++,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 60,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 720,
          coin: COINS[i % COINS.length],
          scale: 0.8 + Math.random() * 0.5,
          opacity: 1,
          born: performanceNow + i * 20,
        });
      }

      setBursting(true);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    },
    [animate],
  );

  return (
    <div className="coin-explosion-wrapper relative" onMouseEnter={spawn}>
      {children}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}
