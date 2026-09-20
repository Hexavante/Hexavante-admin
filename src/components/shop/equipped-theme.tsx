"use client";

import { useEffect } from "react";
import { getAllThemeClassNames, getThemeMode } from "@/lib/cosmetics";

type Props = {
  themeId: string | null;
  themeClassName: string;
};

export function EquippedTheme({ themeId, themeClassName }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const classes = getAllThemeClassNames();

    classes.forEach((cls) => {
      root.classList.remove(cls);
      body.classList.remove(cls);
    });

    const active = themeId && themeClassName ? themeClassName : "theme-default";
    root.classList.add(active);
    body.classList.add(active);

    const mode = getThemeMode(themeId);
    root.dataset.themeMode = mode;
    body.dataset.themeMode = mode;

    if (themeId && themeClassName) {
      root.dataset.shopTheme = themeId;
    } else {
      delete root.dataset.shopTheme;
    }

    return () => {
      classes.forEach((cls) => {
        root.classList.remove(cls);
        body.classList.remove(cls);
      });
      delete root.dataset.shopTheme;
      delete root.dataset.themeMode;
      delete body.dataset.themeMode;
    };
  }, [themeId, themeClassName]);

  return null;
}
