"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { sendAnalyticsEvent } from "@/lib/analytics-client";

export function TourDetailAnalytics({
  tour,
  exploreLabel,
  panoramaLabel
}: {
  tour: {
    id: string;
    slug: string;
    title: string;
    embedUrl: string;
    projectUrl: string;
  };
  exploreLabel: string;
  panoramaLabel: string;
}) {
  const sessionId = useMemo(() => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    return `${tour.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, [tour.id]);

  const visibleSinceRef = useRef<number | null>(null);
  const totalVisibleMsRef = useRef(0);
  const flushedRef = useRef(false);

  useEffect(() => {
    const pagePath = window.location.pathname;

    sendAnalyticsEvent({
      type: "tour_page_view",
      tourId: tour.id,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      sessionId,
      pagePath
    });

    const startVisible = () => {
      if (document.visibilityState === "visible" && visibleSinceRef.current === null) {
        visibleSinceRef.current = Date.now();
      }
    };

    const stopVisible = () => {
      if (visibleSinceRef.current !== null) {
        totalVisibleMsRef.current += Date.now() - visibleSinceRef.current;
        visibleSinceRef.current = null;
      }
    };

    const flushDuration = () => {
      if (flushedRef.current) {
        return;
      }

      stopVisible();
      flushedRef.current = true;

      if (totalVisibleMsRef.current < 250) {
        return;
      }

      sendAnalyticsEvent({
        type: "tour_view_duration",
        tourId: tour.id,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        sessionId,
        durationMs: totalVisibleMsRef.current,
        pagePath
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopVisible();
        return;
      }

      startVisible();
    };

    startVisible();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flushDuration);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flushDuration);
      flushDuration();
    };
  }, [sessionId, tour.embedUrl, tour.id, tour.slug, tour.title]);

  const trackClick = (type: "tour_embed_open" | "tour_project_click", targetUrl: string) => {
    sendAnalyticsEvent({
      type,
      tourId: tour.id,
      tourSlug: tour.slug,
      tourTitle: tour.title,
      sessionId,
      targetUrl,
      pagePath: typeof window !== "undefined" ? window.location.pathname : ""
    });
  };

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <a
        className="primary-button"
        href={tour.projectUrl}
        onClick={() => trackClick("tour_project_click", tour.projectUrl)}
        rel="noreferrer"
        target="_blank"
      >
        {exploreLabel}
        <ExternalLink className="h-4 w-4" />
      </a>
      <a
        className="secondary-button"
        href={tour.embedUrl}
        onClick={() => trackClick("tour_embed_open", tour.embedUrl)}
        rel="noreferrer"
        target="_blank"
      >
        {panoramaLabel}
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
