"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";

/** Ajustes de status bar / splash / keyboard no app nativo (Capacitor). */
export function NativeAppBootstrap() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    document.documentElement.dataset.nativeShell = "true";

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      );
    }

    void (async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#0b1220" });
      } catch {
        // StatusBar opcional fora do dispositivo
      }

      try {
        await SplashScreen.hide();
      } catch {
        // SplashScreen opcional
      }

      try {
        await Keyboard.setResizeMode({ mode: KeyboardResize.Native });
        await Keyboard.setScroll({ isDisabled: false });
      } catch {
        // Keyboard opcional
      }
    })();
  }, []);

  return null;
}
