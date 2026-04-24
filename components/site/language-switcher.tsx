"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { localeCookieName, type Locale } from "@/lib/locale";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSwitch = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

    const query = searchParams.toString();
    const hash = window.location.hash;
    const targetUrl = `${pathname}${query ? `?${query}` : ""}${hash}`;

    router.replace(targetUrl);
    router.refresh();
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-2 py-2 shadow-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Languages className="h-4 w-4" />
      </span>
      <span className="sr-only">{label}</span>
      {(["vi", "en"] as const).map((item) => (
        <button
          className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
            item === locale
              ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
              : "text-slate-500 hover:text-slate-900"
          }`}
          key={item}
          onClick={() => handleSwitch(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
