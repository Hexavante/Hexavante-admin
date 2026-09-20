"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { NativeSelect } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { setPresenceAction } from "@/app/actions/security";
import { PRESENCE_META, type PresenceKind } from "@/components/presence/presence-dot";

const OPTIONS: (PresenceKind | "INVISIBLE")[] = ["ONLINE", "AWAY", "STUDYING", "DND", "INVISIBLE"];

export function PresencePicker({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = async (next: string) => {
    setValue(next);
    setSaving(true);
    setSaved(false);
    setError(null);
    const result = await setPresenceAction(next);
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError(result.error ?? "Erro ao salvar.");
    }
  };

  return (
    <div>
      <Label htmlFor="presence">Seu status</Label>
      <div className="mt-1.5 flex items-center gap-3">
        <NativeSelect
          id="presence"
          value={value}
          onChange={(e) => void onChange(e.target.value)}
          disabled={saving}
          className="max-w-xs"
        >
          {OPTIONS.map((key) => (
            <option key={key} value={key}>
              {key === "INVISIBLE" ? "Invisível (aparecer offline)" : PRESENCE_META[key].label}
            </option>
          ))}
        </NativeSelect>
        {saving && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
        {saved && (
          <span className="flex items-center gap-1 text-xs text-emerald-300">
            <Check className="h-3.5 w-3.5" /> Salvo
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
      <p className="mt-1 text-xs text-slate-500">
        No modo invisível você aparece offline para todos.
      </p>
    </div>
  );
}
