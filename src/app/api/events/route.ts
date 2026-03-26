import { NextResponse } from "next/server";
import { getLiveEvents } from "@/lib/live-events";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;
  const events = await getLiveEvents(Number.isFinite(limit) ? limit : undefined);

  return NextResponse.json({
    events,
    fetchedAt: new Date().toISOString(),
  });
}
