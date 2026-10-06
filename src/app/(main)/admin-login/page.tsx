"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { adminLoginAction } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Mail, AlertCircle } from "lucide-react";

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

  // Handle redirect after successful login
  useEffect(() => {
    if (state?.ok && state.email) {
      window.location.href = `/admin-verificar?email=${encodeURIComponent(state.email)}`;
    }
  }, [state]);

  if (state?.ok && state.email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <div className="w-full max-w-md">
          <div className="hx-card text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--sidebar-highlight)/0.12)] border border-[hsl(var(--sidebar-highlight)/0.25)]">
              <Shield className="h-7 w-7 text-[hsl(var(--sidebar-highlight))]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Redirecionando...</h1>
            <p className="mt-2 text-sm text-slate-400">Aguarde enquanto processamos seu acesso.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-12">
      {/* Subtle decorative background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[hsl(var(--sidebar-highlight)/0.03)] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[hsl(var(--sidebar-highlight)/0.02)] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--sidebar-highlight)/0.1)] border border-[hsl(var(--sidebar-highlight)/0.2)]">
            <Shield className="h-7 w-7 text-[hsl(var(--sidebar-highlight))]" />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--sidebar-highlight)/0.8)]">
            Área administrativa
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white">Painel Admin</h1>
          <p className="mt-3 text-sm text-slate-400 max-w-xs mx-auto">
            Acesso restrito a administradores autorizados.
          </p>
        </div>

        {/* Form Card */}
        <form action={action} className="hx-card space-y-5" noValidate>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="hx-label">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[hsl(var(--sidebar-highlight))]" aria-hidden="true" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={pending}
                aria-describedby={state?.error ? "login-error" : undefined}
                aria-invalid={!!state?.error}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="hx-label">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-[hsl(var(--sidebar-highlight))]" aria-hidden="true" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={pending}
                aria-describedby={state?.error ? "login-error" : undefined}
                aria-invalid={!!state?.error}
              />
            </div>
          </div>

          {/* Error Message */}
          {state?.error && (
            <div id="login-error" className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400" role="alert">
              <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={pending} className="w-full mt-1" size="lg">
            {pending ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        {/* Footer Notice */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Um código de verificação será enviado ao seu e-mail após o login.
        </p>
      </div>
    </div>
  );
}