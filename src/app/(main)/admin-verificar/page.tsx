"use client";

import { useState, use } from "react";
import { useActionState } from "react";
import { adminResendCodeAction, adminVerifyAction } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, KeyRound } from "lucide-react";

export default function AdminVerifyPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email = "" } = use(searchParams);
  const [code, setCode] = useState("");
  const [state, action, pending] = useActionState(
    async (_prev: Awaited<ReturnType<typeof adminVerifyAction>> | null, formData: FormData) => {
      const c = formData.get("code") as string;
      return adminVerifyAction(email, c);
    },
    null,
  );
  const [resendState, resendAction, resending] = useActionState(
    async (_prev: Awaited<ReturnType<typeof adminResendCodeAction>> | null) => {
      return adminResendCodeAction(email);
    },
    null,
  );

  if (state?.ok) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin";
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-slate-400">Verificado! Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <KeyRound className="h-8 w-8 text-sky-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verificação</h1>
          <p className="mt-2 text-sm text-slate-400">
            Digite o código de 6 dígitos enviado para<br />
            <span className="font-medium text-white">{email}</span>
          </p>
        </div>

        <form action={action} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Código de verificação</label>
            <Input
              name="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              autoFocus
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <Button type="submit" disabled={pending || code.length !== 6} className="w-full">
            {pending ? "Verificando..." : "Verificar"}
          </Button>
        </form>

        {resendState?.error && (
          <p className="mt-4 text-sm text-red-400">{resendState.error}</p>
        )}
        {resendState?.ok && (
          <p className="mt-4 text-sm text-emerald-300">Novo código enviado para seu e-mail.</p>
        )}

        <form action={resendAction} className="mt-2">
          <Button type="submit" variant="ghost" disabled={resending} className="w-full">
            {resending ? "Enviando..." : "Não recebeu? Reenviar código"}
          </Button>
        </form>

        <a
          href="/admin-login"
          className="mt-2 block text-center text-xs text-slate-500 hover:text-slate-300 transition"
        >
          ← Voltar ao login
        </a>
      </div>
    </div>
  );
}
