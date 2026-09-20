"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-[#0a0a1a] text-white">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mb-6 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold">Algo deu errado</h1>
          <p className="mt-3 text-sm text-slate-400">
            Ocorreu um erro inesperado. Nossa equipe foi notificada.
          </p>
          {error.digest && (
            <p className="mt-2 rounded-lg bg-white/5 px-3 py-2 font-mono text-xs text-slate-500">
              {error.digest}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/20"
            >
              Tentar novamente
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
