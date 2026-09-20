"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type Props = {
  title: string;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
};

export function ManageDeleteButton({ title, onDelete }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    if (!confirm(`Excluir "${title}" permanentemente? Esta ação não pode ser desfeita.`)) {
      return;
    }
    startTransition(async () => {
      const result = await onDelete();
      if (!result.success) {
        alert(result.error ?? "Erro ao excluir.");
        return;
      }
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      title={`Excluir ${title}`}
      aria-label={`Excluir ${title}`}
      onClick={handleClick}
      disabled={pending}
      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-red-500/25 text-slate-500 transition hover:border-red-500/60 hover:text-red-400 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
