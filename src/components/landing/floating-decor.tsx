"use client";

export function FloatingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Ambient glows */}
      <div className="absolute left-[-15%] top-[-5%] h-[700px] w-[700px] rounded-full bg-primary/[0.08] blur-[14rem]" />
      <div className="absolute right-[-8%] top-[10%] h-[500px] w-[500px] rounded-full bg-accent/[0.06] blur-[12rem]" />
      <div className="absolute bottom-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-violet-500/[0.04] blur-[10rem]" />

      {/* Floating dots */}
      <svg className="absolute left-[8%] top-[15%] h-2 w-2 animate-pulse" style={{ animationDuration: "3s" }}>
        <circle cx="4" cy="4" r="4" fill="hsl(187, 85%, 53%)" opacity="0.5" />
      </svg>
      <svg className="absolute right-[12%] top-[20%] h-1.5 w-1.5 animate-pulse" style={{ animationDuration: "4s", animationDelay: "1s" }}>
        <circle cx="3" cy="3" r="3" fill="#a78bfa" opacity="0.4" />
      </svg>
      <svg className="absolute left-[25%] top-[45%] h-1 w-1 animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}>
        <circle cx="2" cy="2" r="2" fill="hsl(187, 85%, 53%)" opacity="0.6" />
      </svg>
      <svg className="absolute right-[20%] top-[55%] h-2 w-2 animate-pulse" style={{ animationDuration: "3.5s", animationDelay: "2s" }}>
        <circle cx="4" cy="4" r="4" fill="#38bdf8" opacity="0.3" />
      </svg>
      <svg className="absolute left-[15%] top-[70%] h-1.5 w-1.5 animate-pulse" style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}>
        <circle cx="3" cy="3" r="3" fill="#a78bfa" opacity="0.35" />
      </svg>
      <svg className="absolute right-[8%] top-[75%] h-1 w-1 animate-pulse" style={{ animationDuration: "3s", animationDelay: "0.8s" }}>
        <circle cx="2" cy="2" r="2" fill="hsl(187, 85%, 53%)" opacity="0.45" />
      </svg>
      <svg className="absolute left-[45%] top-[10%] h-1 w-1 animate-pulse" style={{ animationDuration: "5s", animationDelay: "0.3s" }}>
        <circle cx="2" cy="2" r="2" fill="#38bdf8" opacity="0.3" />
      </svg>
      <svg className="absolute right-[35%] top-[85%] h-1.5 w-1.5 animate-pulse" style={{ animationDuration: "3.8s", animationDelay: "1.2s" }}>
        <circle cx="3" cy="3" r="3" fill="hsl(187, 85%, 53%)" opacity="0.25" />
      </svg>

      {/* Star shapes */}
      <svg className="absolute left-[5%] top-[35%] h-4 w-4" style={{ animationDuration: "6s" }}>
        <path d="M8 0 l2 6 6 2 -6 2 -2 6 -2-6 -6-2 6-2z" fill="hsl(187, 85%, 53%)" opacity="0.15" />
      </svg>
      <svg className="absolute right-[15%] top-[40%] h-3 w-3" style={{ animationDuration: "5s", animationDelay: "2s" }}>
        <path d="M6 0 l1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5-4.5 -4.5-1.5 4.5-1.5z" fill="#a78bfa" opacity="0.12" />
      </svg>
      <svg className="absolute left-[40%] top-[80%] h-3.5 w-3.5" style={{ animationDuration: "7s", animationDelay: "1s" }}>
        <path d="M7 0 l1.75 5.25 5.25 1.75 -5.25 1.75 -1.75 5.25 -1.75-5.25 -5.25-1.75 5.25-1.75z" fill="hsl(187, 85%, 53%)" opacity="0.1" />
      </svg>

      {/* Geometric shapes */}
      <svg className="absolute right-[5%] top-[15%] h-12 w-12 rotate-45" style={{ animationDuration: "20s" }}>
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="hsl(187, 85%, 53%)" strokeWidth="1" fill="none" opacity="0.08" />
      </svg>
      <svg className="absolute left-[10%] top-[60%] h-8 w-8 rotate-12" style={{ animationDuration: "25s" }}>
        <rect x="2" y="2" width="14" height="14" rx="3" stroke="#a78bfa" strokeWidth="1" fill="none" opacity="0.06" />
      </svg>
      <svg className="absolute right-[25%] top-[30%] h-6 w-6 -rotate-12">
        <circle cx="12" cy="12" r="10" stroke="hsl(187, 85%, 53%)" strokeWidth="1" fill="none" opacity="0.07" />
      </svg>
    </div>
  );
}
