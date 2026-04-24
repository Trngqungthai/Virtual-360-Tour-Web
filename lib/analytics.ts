import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Locale } from "@/lib/locale";
import { getAllTours } from "@/lib/tours";

export type AnalyticsEventType =
  | "tour_page_view"
  | "tour_view_duration"
  | "tour_embed_open"
  | "tour_project_click";

export type AnalyticsPeriod = "day" | "week" | "month" | "year";

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: AnalyticsEventType;
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  sessionId: string;
  durationMs?: number;
  targetUrl?: string;
  pagePath?: string;
}

export interface AnalyticsSummary {
  visits: number;
  panoramaOpens: number;
  exploreClicks: number;
  totalViewDurationMs: number;
  averageViewDurationMs: number;
}

export interface AnalyticsProjectRow extends AnalyticsSummary {
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  lastActivityAt: string | null;
}

export interface AnalyticsTimelineRow extends AnalyticsSummary {
  key: string;
  startsAt: string;
}

export interface AnalyticsReport {
  period: AnalyticsPeriod;
  from: string;
  to: string;
  selectedTourId: string;
  summary: AnalyticsSummary;
  projects: AnalyticsProjectRow[];
  timeline: AnalyticsTimelineRow[];
}

const analyticsFilePath = path.join(process.cwd(), "data", "analytics-events.json");
const analyticsPeriods: AnalyticsPeriod[] = ["day", "week", "month", "year"];

function isValidEventType(value: string): value is AnalyticsEventType {
  return (
    value === "tour_page_view" ||
    value === "tour_view_duration" ||
    value === "tour_embed_open" ||
    value === "tour_project_click"
  );
}

function getSummaryTemplate(): AnalyticsSummary {
  return {
    visits: 0,
    panoramaOpens: 0,
    exploreClicks: 0,
    totalViewDurationMs: 0,
    averageViewDurationMs: 0
  };
}

function normaliseText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseDuration(value: unknown) {
  const duration = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(duration) || duration < 0) {
    return undefined;
  }

  return Math.round(duration);
}

function applyEventToSummary(summary: AnalyticsSummary, event: AnalyticsEvent) {
  if (event.type === "tour_page_view") {
    summary.visits += 1;
    return;
  }

  if (event.type === "tour_embed_open") {
    summary.panoramaOpens += 1;
    return;
  }

  if (event.type === "tour_project_click") {
    summary.exploreClicks += 1;
    return;
  }

  if (event.type === "tour_view_duration") {
    summary.totalViewDurationMs += event.durationMs ?? 0;
  }
}

function finaliseAverage(summary: AnalyticsSummary) {
  summary.averageViewDurationMs =
    summary.visits > 0 ? Math.round(summary.totalViewDurationMs / summary.visits) : 0;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function startOfWeek(date: Date) {
  const next = startOfDay(date);
  const currentDay = next.getDay();
  const diff = currentDay === 0 ? 6 : currentDay - 1;
  next.setDate(next.getDate() - diff);
  return next;
}

function startOfMonth(date: Date) {
  const next = startOfDay(date);
  next.setDate(1);
  return next;
}

function startOfYear(date: Date) {
  const next = startOfDay(date);
  next.setMonth(0, 1);
  return next;
}

function getPeriodRange(period: AnalyticsPeriod, now = new Date()) {
  const end = new Date(now);

  if (period === "day") {
    return { from: startOfDay(now), to: end };
  }

  if (period === "week") {
    return { from: startOfWeek(now), to: end };
  }

  if (period === "month") {
    return { from: startOfMonth(now), to: end };
  }

  return { from: startOfYear(now), to: end };
}

function createTimelineBuckets(period: AnalyticsPeriod, from: Date, to: Date) {
  const buckets: Array<{ key: string; startsAt: Date }> = [];

  if (period === "day") {
    const cursor = new Date(from);

    while (cursor <= to) {
      buckets.push({
        key: `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}-${cursor.getHours()}`,
        startsAt: new Date(cursor)
      });
      cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
    }

    return buckets;
  }

  if (period === "year") {
    const cursor = new Date(from);

    while (cursor <= to) {
      buckets.push({
        key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
        startsAt: new Date(cursor)
      });
      cursor.setMonth(cursor.getMonth() + 1, 1);
      cursor.setHours(0, 0, 0, 0);
    }

    return buckets;
  }

  const cursor = new Date(from);

  while (cursor <= to) {
    buckets.push({
      key: `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`,
      startsAt: new Date(cursor)
    });
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(0, 0, 0, 0);
  }

  return buckets;
}

function getTimelineKey(period: AnalyticsPeriod, timestamp: Date) {
  if (period === "day") {
    return `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}`;
  }

  if (period === "year") {
    return `${timestamp.getFullYear()}-${timestamp.getMonth()}`;
  }

  return `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}`;
}

export function normaliseAnalyticsPeriod(value?: string | null): AnalyticsPeriod {
  return analyticsPeriods.includes(value as AnalyticsPeriod) ? (value as AnalyticsPeriod) : "week";
}

export function getAnalyticsPeriodOptions(locale: Locale) {
  if (locale === "vi") {
    return [
      { value: "day", label: "Ngày" },
      { value: "week", label: "Tuần" },
      { value: "month", label: "Tháng" },
      { value: "year", label: "Năm" }
    ] satisfies Array<{ value: AnalyticsPeriod; label: string }>;
  }

  return [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" }
  ] satisfies Array<{ value: AnalyticsPeriod; label: string }>;
}

export function formatAnalyticsDuration(durationMs: number, locale: Locale) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (locale === "vi") {
    return `${minutes} phút ${seconds} giây`;
  }

  return `${minutes}m ${seconds}s`;
}

export function formatAnalyticsDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}

export function formatAnalyticsBucket(date: string, period: AnalyticsPeriod, locale: Locale) {
  const value = new Date(date);
  const lang = locale === "vi" ? "vi-VN" : "en-US";

  if (period === "day") {
    return new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(value);
  }

  if (period === "year") {
    return new Intl.DateTimeFormat(lang, { month: "short", year: "numeric" }).format(value);
  }

  return new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(value);
}

export async function readAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  try {
    const file = await readFile(analyticsFilePath, "utf8");
    const parsed = JSON.parse(file) as AnalyticsEvent[];

    return parsed.filter((event) => {
      return (
        isValidEventType(event.type) &&
        normaliseText(event.tourId) &&
        normaliseText(event.tourSlug) &&
        normaliseText(event.tourTitle) &&
        normaliseText(event.sessionId) &&
        normaliseText(event.timestamp)
      );
    });
  } catch {
    return [];
  }
}

export async function appendAnalyticsEvent(input: {
  type: string;
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  sessionId: string;
  durationMs?: number;
  targetUrl?: string;
  pagePath?: string;
}) {
  if (!isValidEventType(input.type)) {
    throw new Error("Invalid analytics event");
  }

  const event: AnalyticsEvent = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    type: input.type,
    tourId: normaliseText(input.tourId),
    tourSlug: normaliseText(input.tourSlug),
    tourTitle: normaliseText(input.tourTitle),
    sessionId: normaliseText(input.sessionId),
    durationMs: normaliseDuration(input.durationMs),
    targetUrl: normaliseText(input.targetUrl),
    pagePath: normaliseText(input.pagePath)
  };

  if (!event.tourId || !event.tourSlug || !event.tourTitle || !event.sessionId) {
    throw new Error("Missing analytics fields");
  }

  const events = await readAnalyticsEvents();
  events.unshift(event);

  await mkdir(path.dirname(analyticsFilePath), { recursive: true });
  await writeFile(analyticsFilePath, JSON.stringify(events, null, 2), "utf8");

  return event;
}

export async function getAnalyticsReport({
  period,
  tourId = ""
}: {
  period: AnalyticsPeriod;
  tourId?: string;
}): Promise<AnalyticsReport> {
  const [{ from, to }, events, tours] = await Promise.all([
    Promise.resolve(getPeriodRange(period)),
    readAnalyticsEvents(),
    getAllTours()
  ]);

  const fromTime = from.getTime();
  const toTime = to.getTime();
  const selectedTourId = tourId.trim();

  const filteredEvents = events.filter((event) => {
    const eventTime = new Date(event.timestamp).getTime();
    const inRange = eventTime >= fromTime && eventTime <= toTime;
    const matchesTour = selectedTourId ? event.tourId === selectedTourId : true;
    return inRange && matchesTour;
  });

  const summary = getSummaryTemplate();
  const durationSessions = new Set<string>();
  const projectMap = new Map<string, AnalyticsProjectRow>();
  const timelineMap = new Map<string, AnalyticsTimelineRow>();

  createTimelineBuckets(period, from, to).forEach((bucket) => {
    timelineMap.set(bucket.key, {
      key: bucket.key,
      startsAt: bucket.startsAt.toISOString(),
      ...getSummaryTemplate()
    });
  });

  filteredEvents.forEach((event) => {
    applyEventToSummary(summary, event);

    const existingProject = projectMap.get(event.tourId) ?? {
      tourId: event.tourId,
      tourSlug: event.tourSlug,
      tourTitle: event.tourTitle,
      lastActivityAt: event.timestamp,
      ...getSummaryTemplate()
    };

    applyEventToSummary(existingProject, event);
    if (!existingProject.lastActivityAt || existingProject.lastActivityAt < event.timestamp) {
      existingProject.lastActivityAt = event.timestamp;
    }
    projectMap.set(event.tourId, existingProject);

    const timelineKey = getTimelineKey(period, new Date(event.timestamp));
    const existingBucket = timelineMap.get(timelineKey);
    if (existingBucket) {
      applyEventToSummary(existingBucket, event);
      timelineMap.set(timelineKey, existingBucket);
    }

    if (event.type === "tour_view_duration") {
      durationSessions.add(event.sessionId);
    }
  });

  if (selectedTourId && !projectMap.has(selectedTourId)) {
    const selectedTour = tours.find((tour) => tour.id === selectedTourId);

    if (selectedTour) {
      projectMap.set(selectedTour.id, {
        tourId: selectedTour.id,
        tourSlug: selectedTour.slug,
        tourTitle: selectedTour.title,
        lastActivityAt: null,
        ...getSummaryTemplate()
      });
    }
  }

  finaliseAverage(summary);
  if (durationSessions.size === 0 && summary.visits === 0) {
    summary.averageViewDurationMs = 0;
  }

  const projects = Array.from(projectMap.values())
    .map((project) => {
      finaliseAverage(project);
      return project;
    })
    .sort((a, b) => {
      if (b.visits !== a.visits) {
        return b.visits - a.visits;
      }

      return a.tourTitle.localeCompare(b.tourTitle);
    });

  const timeline = Array.from(timelineMap.values())
    .map((item) => {
      finaliseAverage(item);
      return item;
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return {
    period,
    from: from.toISOString(),
    to: to.toISOString(),
    selectedTourId,
    summary,
    projects,
    timeline
  };
}
