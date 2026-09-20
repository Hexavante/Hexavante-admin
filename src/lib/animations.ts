"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type AnimationPreset =
  | "fade-in"
  | "fade-in-up"
  | "slide-in-right"
  | "slide-in-left"
  | "scale-in"
  | "scale-out"
  | "pulse"
  | "bounce-in"
  | "shake"
  | "ripple"
  | "shimmer";

export type AnimationDuration = "instant" | "fast" | "normal" | "slow" | "slowest";

export type AnimationEasing =
  | "linear"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "spring"
  | "bounce"
  | "material";

const durationMap: Record<AnimationDuration, string> = {
  instant: "0ms",
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
  slowest: "500ms",
};

const easingMap: Record<AnimationEasing, string> = {
  linear: "linear",
  "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  material: "cubic-bezier(0.4, 0, 0.2, 1)",
};

export function getAnimationCSS(
  preset: AnimationPreset,
  duration: AnimationDuration = "normal",
  easing: AnimationEasing = "material",
  delay: string = "0ms",
): string {
  const baseDuration = durationMap[duration];
  const baseEasing = easingMap[easing];

  const keyframes: Record<AnimationPreset, string> = {
    "fade-in": `
      @keyframes anim-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    "fade-in-up": `
      @keyframes anim-fade-in-up {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,
    "slide-in-right": `
      @keyframes anim-slide-in-right {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `,
    "slide-in-left": `
      @keyframes anim-slide-in-left {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `,
    "scale-in": `
      @keyframes anim-scale-in {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `,
    "scale-out": `
      @keyframes anim-scale-out {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
      }
    `,
    pulse: `
      @keyframes anim-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
    `,
    "bounce-in": `
      @keyframes anim-bounce-in {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }
    `,
    shake: `
      @keyframes anim-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `,
    ripple: `
      @keyframes anim-ripple {
        0% { transform: scale(0); opacity: 0.5; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    `,
    shimmer: `
      @keyframes anim-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `,
  };

  return `
    ${keyframes[preset]}
    .anim-${preset} {
      animation: anim-${preset} ${baseDuration} ${baseEasing} ${delay} forwards;
    }
  `;
}

export function getStaggeredDelay(index: number, baseDelay: number = 50): string {
  return `${index * baseDelay}ms`;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function useThemeAnimation(): {
  theme: string;
  getPreset: (base: AnimationPreset) => AnimationPreset;
} {
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState(theme || "default");

  useEffect(() => {
    if (theme) setResolvedTheme(theme);
  }, [theme]);

  const themeAnimations: Record<string, Partial<Record<AnimationPreset, AnimationPreset>>> = {
    cyberpunk: {
      "fade-in": "fade-in",
      "fade-in-up": "slide-in-right",
      "scale-in": "bounce-in",
    },
    hacker: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "scale-in",
    },
    obsidian: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "scale-in",
    },
    sunset: {
      "fade-in": "fade-in",
      "fade-in-up": "slide-in-right",
      "scale-in": "bounce-in",
    },
    ocean: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "scale-in",
    },
    sakura: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "bounce-in",
    },
    midnight: {
      "fade-in": "fade-in",
      "fade-in-up": "slide-in-left",
      "scale-in": "scale-in",
    },
    amber: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "bounce-in",
    },
    snow: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "scale-in",
    },
    daylight: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "scale-in",
    },
    cream: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "scale-in",
    },
    pearl: {
      "fade-in": "fade-in",
      "fade-in-up": "fade-in-up",
      "scale-in": "scale-in",
    },
  };

  const themeConfig = themeAnimations[resolvedTheme] || {};

  const getPreset = (base: AnimationPreset): AnimationPreset => {
    return themeConfig[base] || base;
  };

  return { theme: resolvedTheme, getPreset };
}

export function createRippleEffect(
  event: React.MouseEvent<HTMLElement>,
  color: string = "currentColor",
): HTMLSpanElement {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: ${color};
    border-radius: 50%;
    transform: scale(0);
    opacity: 0.3;
    pointer-events: none;
    animation: anim-ripple 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  `;

  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
  return ripple;
}