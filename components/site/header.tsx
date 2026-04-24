"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Menu, X } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { getLocalizedNavLinks, getTranslations } from "@/lib/copy";
import type { Locale } from "@/lib/locale";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = getLocalizedNavLinks(locale);
  const t = getTranslations(locale);

  const resolveActive = (href: string) => {
    const baseHref = href.split("#")[0] || "/";
    if (baseHref === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(baseHref);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-600/20 text-brand-700">
            <Globe2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-600">
              Virtual 360
            </p>
            <p className="text-sm text-slate-500">{t.brandSubtitle}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              className={`text-sm font-medium ${
                resolveActive(link.href)
                  ? "text-brand-700"
                  : "text-slate-600 hover:text-slate-950"
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher label={t.header.language} locale={locale} />
          <Link className="primary-button" href="/#contact">
            {t.header.consultation}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher label={t.header.language} locale={locale} />
          <button
            aria-label={isOpen ? t.header.closeMenu : t.header.openMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
            onClick={() => setIsOpen((value) => !value)}
            type="button"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/95 lg:hidden">
          <div className="container-shell flex flex-col gap-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <Link
                className="primary-button w-full"
                href="/#contact"
                onClick={() => setIsOpen(false)}
              >
                {t.header.consultation}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
