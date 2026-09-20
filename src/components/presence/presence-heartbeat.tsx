"use client";

import { useEffect } from "react";

/**
 * Mantém a presença atualizada: envia heartbeat a cada 60s e ao voltar à aba.
 * Sem isso, o usuário aparece offline após 5 minutos.
 */
export function PresenceHeartbeat() {
  useEffect(() => {
    let stopped = false;

    const beat = () => {
      if (stopped || document.hidden) return;
      fetch("/api/presence/heartbeat", {
        method: "POST",
        keepalive: true,
      }).catch(() => undefined);
    };

    beat();
    const timer = setInterval(beat, 60_000);
    document.addEventListener("visibilitychange", beat);
    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", beat);
    };
  }, []);

  return null;
}
