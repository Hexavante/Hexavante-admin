import { buildAllThemesStyleBlock } from "@/lib/cosmetics";

/** Injeta variáveis CSS de todos os temas (escopadas por classe). */
export function ThemeStyles() {
  const css = buildAllThemesStyleBlock();
  if (!css) return null;

  return <style id="hexavante-theme-vars" dangerouslySetInnerHTML={{ __html: css }} />;
}
