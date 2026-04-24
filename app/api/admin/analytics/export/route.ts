import { NextResponse } from "next/server";
import { getAdminText } from "@/lib/admin-text";
import {
  formatAnalyticsBucket,
  formatAnalyticsDate,
  formatAnalyticsDuration,
  getAnalyticsReport,
  normaliseAnalyticsPeriod
} from "@/lib/analytics";
import { isAdminAuthenticated } from "@/lib/auth";
import { normalizeLocale } from "@/lib/locale";

function escapeCsv(value: string | number) {
  const text = `${value}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = normaliseAnalyticsPeriod(searchParams.get("period"));
  const project = searchParams.get("project") ?? "";
  const locale = normalizeLocale(searchParams.get("locale"));
  const t = getAdminText(locale);
  const report = await getAnalyticsReport({ period, tourId: project });

  const lines = [
    `${escapeCsv(t.analytics.range)},${escapeCsv(
      `${formatAnalyticsDate(report.from, locale)} - ${formatAnalyticsDate(report.to, locale)}`
    )}`,
    `${escapeCsv(t.analytics.period)},${escapeCsv(period)}`,
    "",
    [
      t.analytics.projectTitle,
      t.analytics.projectSlug,
      t.analytics.visits,
      t.analytics.panoramaOpens,
      t.analytics.exploreClicks,
      t.analytics.averageViewTime,
      t.analytics.totalViewTime,
      t.analytics.lastActivity
    ]
      .map(escapeCsv)
      .join(","),
    ...report.projects.map((item) =>
      [
        item.tourTitle,
        item.tourSlug,
        item.visits,
        item.panoramaOpens,
        item.exploreClicks,
        formatAnalyticsDuration(item.averageViewDurationMs, locale),
        formatAnalyticsDuration(item.totalViewDurationMs, locale),
        item.lastActivityAt ? formatAnalyticsDate(item.lastActivityAt, locale) : "-"
      ]
        .map(escapeCsv)
        .join(",")
    ),
    "",
    [
      t.analytics.timeline,
      t.analytics.visits,
      t.analytics.panoramaOpens,
      t.analytics.exploreClicks,
      t.analytics.totalViewTime
    ]
      .map(escapeCsv)
      .join(","),
    ...report.timeline.map((item) =>
      [
        formatAnalyticsBucket(item.startsAt, report.period, locale),
        item.visits,
        item.panoramaOpens,
        item.exploreClicks,
        formatAnalyticsDuration(item.totalViewDurationMs, locale)
      ]
        .map(escapeCsv)
        .join(",")
    )
  ].join("\n");

  const csv = `\uFEFF${lines}`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="virtual360-analytics-${period}.csv"`
    }
  });
}
