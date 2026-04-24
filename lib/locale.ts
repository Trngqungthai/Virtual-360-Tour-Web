export type Locale = "en" | "vi";

export const localeCookieName = "virtual360-locale";
export const defaultLocale: Locale = "vi";

export function normalizeLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "vi";
}
