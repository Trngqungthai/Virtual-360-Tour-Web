import Link from "next/link";
import { updateSiteSettingsAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getAdminText } from "@/lib/admin-text";
import { requireAdminSession } from "@/lib/auth";
import { getLocale } from "@/lib/locale-server";
import { getSiteSettings } from "@/lib/site-settings";

function resolveMessage(status: string | undefined, error: string | undefined, locale: "en" | "vi") {
  const t = getAdminText(locale);

  if (status === "updated") {
    return t.settings.updated;
  }

  if (error === "missing-fields") {
    return t.settings.missing;
  }

  return "";
}

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();
  const locale = await getLocale();
  const t = getAdminText(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const message = resolveMessage(
    typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : undefined,
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined,
    locale
  );
  const settings = await getSiteSettings();

  return (
    <AdminShell locale={locale}>
      <section className="surface-card border border-slate-200/80 bg-white p-6 sm:p-8">
        <div className="mb-8">
          <Link className="secondary-button" href="/admin/dashboard">
            {t.settings.backDashboard}
          </Link>
          <p className="section-kicker mt-6">{t.settings.kicker}</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">
            {t.settings.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t.settings.description}
          </p>
        </div>

        {message ? (
          <div className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        <SiteSettingsForm
          action={updateSiteSettingsAction}
          key={JSON.stringify(settings)}
          locale={locale}
          settings={settings}
        />
      </section>
    </AdminShell>
  );
}
