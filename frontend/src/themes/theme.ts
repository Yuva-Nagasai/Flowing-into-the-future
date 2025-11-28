import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";

export const themes = {
  dark: darkTheme,
  light: lightTheme
};

export type ThemeMode = "dark" | "light";

export function getTheme(mode: ThemeMode) {
  return themes[mode];
}
