import { NextResponse } from "next/server";
import { appendAnalyticsEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    if (!rawBody) {
      return NextResponse.json({ error: "Missing body" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody) as {
      type: string;
      tourId: string;
      tourSlug: string;
      tourTitle: string;
      sessionId: string;
      durationMs?: number;
      targetUrl?: string;
      pagePath?: string;
    };

    await appendAnalyticsEvent(payload);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Unable to record analytics event" }, { status: 400 });
  }
}
