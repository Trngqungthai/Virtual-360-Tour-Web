"use client";

import type { AnalyticsEventType } from "@/lib/analytics";

export function sendAnalyticsEvent(payload: {
  type: AnalyticsEventType;
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  sessionId: string;
  durationMs?: number;
  targetUrl?: string;
  pagePath?: string;
}) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    return navigator.sendBeacon(
      "/api/analytics",
      new Blob([body], { type: "application/json" })
    );
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body,
    keepalive: true
  });

  return true;
}
