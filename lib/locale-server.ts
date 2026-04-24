import { cookies } from "next/headers";
import { defaultLocale, localeCookieName, normalizeLocale } from "@/lib/locale";

export async function getLocale() {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookieName)?.value;

  return storedLocale ? normalizeLocale(storedLocale) : defaultLocale;
}
