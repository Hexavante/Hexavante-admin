"use client";

import { useState } from "react";
import { useActionState } from "react";
import { adminLoginAction } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, action, pending] = useActionState(
    async (_prev: Awaited<ReturnType<typeof adminLoginAction>> | null, formData: FormData) => {
      const e = formData.get("email") as string;
      const p = formData.get("password") as string;
      return adminLoginAction(e, p);
    },
    null,
  );

  if (state?.ok && state.email) {
    window.location.href = `/admin-verificar?email=${encodeURIComponent(state.email)}`;
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-slate-400">Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Shield className="h-8 w-8 text-sky-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
          <p className="mt-2 text-sm text-slate-400">
            Acesso restrito a administradores.
          </p>
        </div>

        <form action={action} className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div>
            <label className="mb-1 block text-sm text-slate-400">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-slate-400">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600">
          Um código de verificação será enviado ao seu e-mail.
        </p>
      </div>
    </div>
  );
}
