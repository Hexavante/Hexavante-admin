import { cn } from "@/lib/cn";

export type PresenceKind = "ONLINE" | "AWAY" | "STUDYING" | "DND" | "OFFLINE";

export const PRESENCE_META: Record<PresenceKind, { label: string; dot: string; pulse?: boolean }> = {
  ONLINE: { label: "Online", dot: "bg-emerald-400", pulse: true },
  AWAY: { label: "Ausente", dot: "bg-amber-400" },
  STUDYING: { label: "Estudando", dot: "bg-sky-400", pulse: true },
  DND: { label: "Não perturbe", dot: "bg-red-400" },
  OFFLINE: { label: "Offline", dot: "bg-slate-500" },
};

export function PresenceDot({ status, size = "md" }: { status: string; size?: "sm" | "md" | "lg" }) {
  const meta = PRESENCE_META[(status as PresenceKind) ?? "OFFLINE"] ?? PRESENCE_META.OFFLINE;
  const sizes = { sm: "h-2 w-2", md: "h-2.5 w-2.5", lg: "h-3.5 w-3.5" };
  return (
    <span className="relative inline-flex shrink-0" title={meta.label}>
      {meta.pulse && (
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", meta.dot)} />
      )}
      <span className={cn("relative inline-flex rounded-full", sizes[size], meta.dot)} />
    </span>
  );
}
