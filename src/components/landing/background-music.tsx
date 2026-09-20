"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music, ChevronDown, ChevronUp } from "lucide-react";

const VIDEO_ID = "MX-iaTDEyGI";

function getStoredMuted(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("hx_bg_muted") !== "false";
}

export function BackgroundMusic() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const post = useCallback((fn: string, arg?: unknown) => {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    const msg = arg !== undefined
      ? { event: "command", func: fn, args: [arg] }
      : { event: "command", func: fn, args: [] };
    w.postMessage(JSON.stringify(msg), "*");
  }, []);

  useEffect(() => {
    const stored = getStoredMuted();
    setMuted(stored);
    if (!stored) setStarted(true);
  }, []);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      post("playVideo");
      post("unMute");
    }, 800);
    return () => clearTimeout(t);
  }, [started, post]);

  const toggle = () => {
    if (!started) {
      setStarted(true);
      setMuted(false);
      localStorage.setItem("hx_bg_muted", "false");
      return;
    }
    const next = !muted;
    setMuted(next);
    localStorage.setItem("hx_bg_muted", String(next));
    if (next) {
      post("mute");
    } else {
      post("unMute");
      post("playVideo");
    }
  };

  const embedUrl = started
    ? `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&enablejsapi=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&loop=1&playlist=${VIDEO_ID}`
    : "";

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2">
      {started && expanded && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            width="320"
            height="180"
            allow="autoplay; encrypted-media"
            className="pointer-events-none"
          />
        </div>
      )}

      {started && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[hsl(var(--sidebar-background))]/80 text-slate-400 shadow-lg backdrop-blur transition hover:border-white/20 hover:text-white"
          title={expanded ? "Recolher player" : "Mostrar player"}
        >
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
      )}

      <button
        onClick={toggle}
        title={!started ? "Tocar música de fundo" : muted ? "Retomar música" : "Pausar música"}
        className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-[hsl(var(--sidebar-background))]/80 text-slate-400 shadow-lg backdrop-blur transition hover:border-white/20 hover:text-white"
      >
        {!started || muted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
      </button>
    </div>
  );
}
