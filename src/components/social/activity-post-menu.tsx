"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { SocialActivityType } from "@prisma/client";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

type Props = {
  activityId: string;
  activityType: SocialActivityType;
  isPinned: boolean;
  canModerate: boolean;
  isOwnPost: boolean;
};

export function ActivityPostMenu({
  activityId,
  canModerate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!canModerate) return null;

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Opções da publicação"
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={pending}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-slate-400 transition",
          "hover:border-[hsl(var(--sidebar-border))] hover:bg-white/[0.05] hover:text-slate-200",
          open && "border-[hsl(var(--sidebar-border))] bg-white/[0.05] text-slate-200",
        )}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-[hsl(var(--sidebar-border))] bg-[var(--surface)] py-1 shadow-xl shadow-black/30"
        >
          <button
            type="button"
            role="menuitem"
            disabled={pending}
            onClick={() => {
              setOpen(false);
              toast("Remoção de posts será implementada em breve.", "info");
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-400/10"
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            Remover
          </button>
        </div>
      )}
    </div>
  );
}
