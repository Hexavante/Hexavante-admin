export const THEME_EQUIPPED_EVENT = "hx:theme-equipped";

export type ThemeEquippedDetail = {
  themeId: string;
};

export function notifyThemeEquipped(themeId: string) {
  window.dispatchEvent(
    new CustomEvent<ThemeEquippedDetail>(THEME_EQUIPPED_EVENT, { detail: { themeId } }),
  );
}
