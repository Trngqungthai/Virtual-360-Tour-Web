import Link from "next/link";
import { LogOut, ScanSearch } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { getAdminText } from "@/lib/admin-text";
import type { Locale } from "@/lib/locale";

export function AdminShell({
  children,
  locale
}: Readonly<{
  children: React.ReactNode;
  locale: Locale;
}>) {
  const t = getAdminText(locale);

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="container-shell flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
              Virtual 360 {t.layout.adminLabel}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">
              {t.layout.dashboardTitle}
            </h1>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <LanguageSwitcher label="Admin language" locale={locale} />
              <Link className="secondary-button" href="/" target="_blank">
                <ScanSearch className="h-4 w-4" />
                {t.layout.viewSite}
              </Link>
              <form action={logoutAction}>
                <button className="primary-button" type="submit">
                  <LogOut className="h-4 w-4" />
                  {t.layout.logout}
                </button>
              </form>
            </div>

            <AdminNav locale={locale} />
          </div>
        </div>
      </header>

      <main className="container-shell py-10">{children}</main>
    </div>
  );
}
