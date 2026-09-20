"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Heart } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { ActivityCommentView } from "@/lib/social";
import { timeAgo } from "@/lib/social";
import { cn } from "@/lib/cn";

type Props = {
  activityId: string;
  initialCount: number;
  canInteract: boolean;
  canAcceptSolution: boolean;
  open?: boolean;
};

export function ActivityComments({
  initialCount,
}: Props) {
  const [open, setOpen] = useState(false);

  if (initialCount === 0) return null;

  return (
    <div className="mt-3 border-t border-white/5 pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-sm font-medium hx-accent-link"
      >
        {open ? "Ocultar respostas" : `Ver respostas (${initialCount})`}
      </button>

      {open && (
        <div className="mt-3">
          <p className="text-sm text-slate-500">
            Comentários indisponíveis no momento.
          </p>
        </div>
      )}
    </div>
  );
}
