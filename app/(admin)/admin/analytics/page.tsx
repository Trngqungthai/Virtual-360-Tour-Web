import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminText } from "@/lib/admin-text";
import {
  formatAnalyticsBucket,
  formatAnalyticsDate,
  formatAnalyticsDuration,
  getAnalyticsPeriodOptions,
  getAnalyticsReport,
  normaliseAnalyticsPeriod
} from "@/lib/analytics";
import { requireAdminSession } from "@/lib/auth";
import { buildHref } from "@/lib/constants";
import { getLocale } from "@/lib/locale-server";
import { getAllTours } from "@/lib/tours";

export default async function AdminAnalyticsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdminSession();

  const locale = await getLocale();
  const t = getAdminText(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const period = normaliseAnalyticsPeriod(
    typeof resolvedSearchParams.period === "string" ? resolvedSearchParams.period : undefined
  );
  const selectedTourId =
    typeof resolvedSearchParams.project === "string" ? resolvedSearchParams.project : "";

  const [report, tours] = await Promise.all([
    getAnalyticsReport({ period, tourId: selectedTourId }),
    getAllTours()
  ]);

  const exportHref = buildHref("/api/admin/analytics/export", {
    period,
    project: selectedTourId,
    locale
  });

  return (
    <AdminShell locale={locale}>
      <div className="space-y-8">
        <section className="surface-card border border-slate-200/80 bg-white p-6 sm:p-8">
          <p className="section-kicker">{t.analytics.kicker}</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">{t.analytics.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            {t.analytics.description}
          </p>

          <form
            action="/admin/analytics"
            className="mt-8 grid gap-4 lg:grid-cols-[220px_1fr_auto_auto]"
            method="get"
          >
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{t.analytics.period}</span>
              <select className="input-field" defaultValue={period} name="period">
                {getAnalyticsPeriodOptions(locale).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-800">{t.analytics.project}</span>
              <select className="input-field" defaultValue={selectedTourId} name="project">
                <option value="">{t.analytics.allProjects}</option>
                {tours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.title}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary-button self-end" type="submit">
              {t.analytics.apply}
            </button>

            <a className="secondary-button self-end" href={exportHref}>
              {t.analytics.download}
            </a>
          </form>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{t.analytics.range}: </span>
            {formatAnalyticsDate(report.from, locale)} - {formatAnalyticsDate(report.to, locale)}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: t.analytics.visits, value: report.summary.visits.toString() },
            {
              label: t.analytics.panoramaOpens,
              value: report.summary.panoramaOpens.toString()
            },
            {
              label: t.analytics.exploreClicks,
              value: report.summary.exploreClicks.toString()
            },
            {
              label: t.analytics.averageViewTime,
              value: formatAnalyticsDuration(report.summary.averageViewDurationMs, locale)
            },
            {
              label: t.analytics.totalViewTime,
              value: formatAnalyticsDuration(report.summary.totalViewDurationMs, locale)
            }
          ].map((item) => (
            <div className="surface-card border border-slate-200/80 bg-white p-6" key={item.label}>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="surface-card border border-slate-200/80 bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">{t.analytics.projectReport}</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">
                {t.analytics.projectReport}
              </h3>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              {t.analytics.projectSummary}
            </p>
          </div>

          {report.projects.length ? (
            <div className="mt-6 overflow-x-auto rounded-[28px] border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-700">
                  <tr>
                    <th className="px-5 py-4">{t.analytics.projectTitle}</th>
                    <th className="px-5 py-4">{t.analytics.projectSlug}</th>
                    <th className="px-5 py-4">{t.analytics.visits}</th>
                    <th className="px-5 py-4">{t.analytics.panoramaOpens}</th>
                    <th className="px-5 py-4">{t.analytics.exploreClicks}</th>
                    <th className="px-5 py-4">{t.analytics.averageViewTime}</th>
                    <th className="px-5 py-4">{t.analytics.totalViewTime}</th>
                    <th className="px-5 py-4">{t.analytics.lastActivity}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-600">
                  {report.projects.map((item) => (
                    <tr key={item.tourId}>
                      <td className="px-5 py-4 font-semibold text-slate-900">{item.tourTitle}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">{item.tourSlug}</td>
                      <td className="px-5 py-4">{item.visits}</td>
                      <td className="px-5 py-4">{item.panoramaOpens}</td>
                      <td className="px-5 py-4">{item.exploreClicks}</td>
                      <td className="px-5 py-4">
                        {formatAnalyticsDuration(item.averageViewDurationMs, locale)}
                      </td>
                      <td className="px-5 py-4">
                        {formatAnalyticsDuration(item.totalViewDurationMs, locale)}
                      </td>
                      <td className="px-5 py-4">
                        {item.lastActivityAt
                          ? formatAnalyticsDate(item.lastActivityAt, locale)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              {t.analytics.empty}
            </div>
          )}
        </section>

        <section className="surface-card border border-slate-200/80 bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">{t.analytics.timeline}</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">{t.analytics.timeline}</h3>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              {t.analytics.timelineSummary}
            </p>
          </div>

          <div className="mt-6 overflow-x-auto rounded-[28px] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-sm font-semibold text-slate-700">
                <tr>
                  <th className="px-5 py-4">{t.analytics.range}</th>
                  <th className="px-5 py-4">{t.analytics.visits}</th>
                  <th className="px-5 py-4">{t.analytics.panoramaOpens}</th>
                  <th className="px-5 py-4">{t.analytics.exploreClicks}</th>
                  <th className="px-5 py-4">{t.analytics.totalViewTime}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-600">
                {report.timeline.map((item) => (
                  <tr key={item.key}>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {formatAnalyticsBucket(item.startsAt, report.period, locale)}
                    </td>
                    <td className="px-5 py-4">{item.visits}</td>
                    <td className="px-5 py-4">{item.panoramaOpens}</td>
                    <td className="px-5 py-4">{item.exploreClicks}</td>
                    <td className="px-5 py-4">
                      {formatAnalyticsDuration(item.totalViewDurationMs, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
